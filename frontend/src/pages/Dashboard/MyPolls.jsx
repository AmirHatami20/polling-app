import {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import useUserAuth from "../../hooks/useUserAuth.jsx";
import HeaderWithFilter from "../../components/layout/HeaderWithFilter.jsx";

import axiosInstance from "../../utils/axiosInstance.js";

import {API_PATHS} from "../../utils/apiPaths.js";
import PollCard from "../../components/pollCards/PollCard.jsx";
import InfiniteScroll from "react-infinite-scroll-component";

import {UserContext} from "../../context/UserContext.jsx";
import EmptyCard from "../../components/cards/EmptyCard.jsx";

import {MdOutlineCreate} from "react-icons/md";

const PAGE_SIZE = 5;

function MyPolls() {
    useUserAuth()

    const {user} = useContext(UserContext);

    const navigate = useNavigate();

    const [allPolls, setAllPolls] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [filterType, setFilterType] = useState("");

    const fetchAllPolls = async (overridePage = page) => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosInstance.get(
                `${API_PATHS.POLLS.GET_ALL}?type=${filterType}&page=${overridePage}&limit=${PAGE_SIZE}&creatorId=${user._id}`
            )

            if (response.data?.polls?.length > 0) {
                setAllPolls(prev => (
                    overridePage === 1
                        ? response.data.polls
                        : [...prev, ...response.data.polls]
                ));
                setHasMore(response.data.polls.length === PAGE_SIZE);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.log("Something went wrong. please try again later", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!user) return;
        setPage(1);
        fetchAllPolls(1);
    }, [filterType, user]);

    useEffect(() => {
        if (!user || page === 1) return;
        fetchAllPolls();
    }, [page]);

    return (
        <DashboardLayout activeMenu="My Polls">
            <div className="my-5 mx-auto">
                <HeaderWithFilter
                    title="نظر سنجی های من"
                    filterType={filterType}
                    setFilterType={setFilterType}
                />

                {allPolls.length === 0 && !loading ? (
                    <EmptyCard
                        icon={MdOutlineCreate}
                        message="خوش آمدید دوست عزیر . شما هیچ نظرسنجی ثبت نکرده اید با ساخت نظرسنجی در پیشرفت ما شریک باشید."
                        btnText="ساخت نظرسنجی"
                        onClick={() => navigate("/create-poll")}
                    />
                ) : (
                    <InfiniteScroll
                        dataLength={allPolls.length}
                        next={() => setPage(prev => prev + 1)}
                        hasMore={hasMore}
                        loader={<p className="info-text">لودینگ...</p>}
                        endMessage={<p className="info-text">نطر سنجی دیگری وجود ندارد.</p>}
                    >
                        {allPolls?.map((poll) => (
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
                                isMyPoll
                            />
                        ))}
                    </InfiniteScroll>
                )}
            </div>
        </DashboardLayout>
    );
}

export default MyPolls;