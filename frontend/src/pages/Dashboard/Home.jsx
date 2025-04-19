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

import {MdOutlineCreate} from "react-icons/md";

const PAGE_SIZE = 5;

function Home() {
    useUserAuth()

    const navigate = useNavigate();

    const [allPolls, setAllPolls] = useState([]);
    const [stats, setStats] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [filterType, setFilterType] = useState("");

    const fetchAllPolls = async (overridePage = page) => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosInstance.get(
                `${API_PATHS.POLLS.GET_ALL}?type=${filterType}&page=${page}&limit=${PAGE_SIZE}`
            )

            if (response.data?.polls?.length > 0) {
                setAllPolls(prev => (
                    overridePage === 1
                        ? response.data.polls
                        : [...prev, ...response.data.polls]
                ));
                setStats(response.data?.stats || []);
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
        setPage(1);
        fetchAllPolls(1);
        return () => {
        }
    }, [filterType]);

    useEffect(() => {
        if (page !== 1) {
            fetchAllPolls();
        }
        return () => {
        }
    }, [page]);

    return (
        <DashboardLayout activeMenu="Dashboard" stats={stats || []} showStats>
            <div className="my-5 mx-auto">
                <HeaderWithFilter
                    title="نظر سنجی ها"
                    filterType={filterType}
                    setFilterType={setFilterType}
                />

                {allPolls.length === 0 && !loading ? (
                    <EmptyCard
                        icon={MdOutlineCreate}
                        message="خوش آمدید دوست عزیر . شما اولین کاربر سایت هستید و با ساخت نظرسنجی در موفقیت ما شریک باشید."
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
                        {allPolls.map((poll) => (
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
                )}
            </div>
        </DashboardLayout>
    );
}

export default Home;