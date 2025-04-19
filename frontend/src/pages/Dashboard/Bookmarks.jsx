import {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import useUserAuth from "../../hooks/useUserAuth.jsx";
import HeaderWithFilter from "../../components/layout/HeaderWithFilter.jsx";

import axiosInstance from "../../utils/axiosInstance.js";

import {API_PATHS} from "../../utils/apiPaths.js";
import PollCard from "../../components/pollCards/PollCard.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import EmptyCard from "../../components/cards/EmptyCard.jsx";
import {UserContext} from "../../context/UserContext.jsx";

import {CiBookmarkPlus} from "react-icons/ci";

const PAGE_SIZE = 5;

function Bookmarks() {
    useUserAuth()

    const {user} = useContext(UserContext);

    const navigate = useNavigate();

    const [bookmarkedPolls, setBookmarkedPolls] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [filterType, setFilterType] = useState("");

    const fetchAllPolls = async (overridePage = page) => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosInstance.get(`${API_PATHS.POLLS.GET_BOOKMARKED}?page=${overridePage}`);

            if (response.data?.bookmarkedPoll.length > 0) {
                setBookmarkedPolls((prev) => [...prev, ...response.data.bookmarkedPoll]);
                setHasMore(response.data.length === PAGE_SIZE);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Something went wrong. please try again later", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllPolls(page);
    }, [page]);

    return (
        <DashboardLayout activeMenu="Bookmarks">
            <div className="my-5 mx-auto">
                <HeaderWithFilter
                    title="نظرسنجی های دخیره شده"
                    filterType={filterType}
                    setFilterType={setFilterType}
                />

                {bookmarkedPolls.length === 0 && !loading ? (
                    <EmptyCard
                        icon={CiBookmarkPlus}
                        message="خوش آمدید دوست عزیر . شما هیچ نظرسنجی ثبت نکرده اید با ذخیره نظرسنجی در پیشرفت ما شریک باشید."
                        btnText="گشت و گذار"
                        onClick={() => navigate("/dashboard")}
                    />
                ) : (
                    <InfiniteScroll
                        dataLength={bookmarkedPolls.length}
                        next={() => setPage(prev => prev + 1)}
                        hasMore={hasMore}
                        loader={<p className="info-text">لودینگ...</p>}
                        endMessage={<p className="info-text">نطر سنجی دیگری وجود ندارد.</p>}
                    >
                        {bookmarkedPolls.map((poll) => {
                            if (!user?.bookmarkedPolls?.includes(poll._id)) return null;
                            return (
                                <PollCard
                                    key={poll._id}
                                    pollId={poll._id}
                                    question={poll.question}
                                    type={poll.type}
                                    options={poll.options}
                                    voters={poll.voters}
                                    responses={poll.responses}
                                    creatorProfileImg={poll.creator.profileImageUrl}
                                    creatorName={poll.creator.username}
                                    creatorFullName={poll.creator.fullName}
                                    userHasVoted={poll.userHasVoted || false}
                                    isPollClosed={poll.closed || false}
                                    createdAt={poll.createdAt || false}
                                />
                            )
                        })}
                    </InfiniteScroll>
                )}
            </div>
        </DashboardLayout>
    );
}

export default Bookmarks;