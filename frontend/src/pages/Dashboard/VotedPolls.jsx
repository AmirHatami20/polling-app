import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import useUserAuth from "../../hooks/useUserAuth.jsx";
import HeaderWithFilter from "../../components/layout/HeaderWithFilter.jsx";

import axiosInstance from "../../utils/axiosInstance.js";

import {API_PATHS} from "../../utils/apiPaths.js";
import PollCard from "../../components/pollCards/PollCard.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import EmptyCard from "../../components/cards/EmptyCard.jsx";

import {MdOutlineHowToVote} from "react-icons/md";

const PAGE_SIZE = 5;

function VotedPolls() {
    useUserAuth()

    const navigate = useNavigate();

    const [votedPolls, setVotedPolls] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [filterType, setFilterType] = useState("");

    const fetchAllPolls = async (overridePage = page) => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosInstance.get(`${API_PATHS.POLLS.GET_VOTED_POLLS}?page=${overridePage}`);

            if (response.data?.polls?.length > 0) {
                setVotedPolls((prev) => [...prev, ...response.data.polls]);
                setHasMore(response.data.polls.length === PAGE_SIZE);
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
        fetchAllPolls();
        return () => {
        }
    }, [page]);

    return (
        <DashboardLayout activeMenu="Voted Poll">
            <div className="my-5 mx-auto">
                <HeaderWithFilter
                    title="نظر سنجی های ثبت شده"
                    filterType={filterType}
                    setFilterType={setFilterType}
                />

                {votedPolls.length === 0 && !loading ? (
                    <EmptyCard
                        icon={MdOutlineHowToVote}
                        message="خوش آمدید دوست عزیر . شما هیچ نظرسنجی ثبت نکرده اید با ثبت نظرسنجی در پیشرفت ما شریک باشید."
                        btnText="گشت و گذار"
                        onClick={() => navigate("/dashboard")}
                    />
                ) : (

                    <InfiniteScroll
                        dataLength={votedPolls.length}
                        next={() => setPage(prev => prev + 1)}
                        hasMore={hasMore}
                        loader={<p className="info-text">لودینگ...</p>}
                        endMessage={<p className="info-text">نطر سنجی دیگری وجود ندارد.</p>}
                    >
                        {votedPolls.map((poll) => (
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
                        ))}
                    </InfiniteScroll>
                )
                }
            </div>
        </DashboardLayout>
    );
}

export default VotedPolls;