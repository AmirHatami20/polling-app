import {useCallback, useContext, useState} from 'react';
import {UserContext} from "../../context/UserContext.jsx";
import UserProfileInfo from "../cards/UserProfileInfo.jsx";
import PollActions from "./PollActions.jsx";
import PollContent from "./PollContent.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import {API_PATHS} from "../../utils/apiPaths.js";
import toast from "react-hot-toast";
import PollingResultContent from "./PollingResultContent.jsx";

function PollCard(
    {
        pollId,
        question,
        type,
        options,
        voters,
        responses,
        creatorProfileImg,
        creatorName,
        creatorFullName,
        userHasVoted,
        isMyPoll,
        isPollClosed,
        createdAt,
    }
) {
    const {user, onUserVoted, toggleBookmarkId, onPollCreateAndDelete} = useContext(UserContext);

    const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
    const [rating, setRating] = useState(0);
    const [userResponse, setUserResponse] = useState("");

    const [isVoteComplete, setIsVoteComplete] = useState(userHasVoted);

    const [pollResult, setPollResult] = useState({
        options,
        voters,
        responses,
    });

    const isPollBookmarked = user?.bookmarkedPolls.includes(pollId)
    const [pollBookmarked, setPollBookmarked] = useState(isPollBookmarked);

    const [pollClosed, setPollClosed] = useState(isPollClosed || false);
    const [pollDelete, setPollDelete] = useState(false);

    // Handles user input based on the poll type
    const handleInput = (value) => {
        if (type === "rating") setRating(value);
        else if (type === "open-ended") setUserResponse(value);
        else setSelectedOptionIndex(value);
    };

    // Generators post data based on the poll type
    const getPostData = useCallback(() => {
        if (type === 'open-ended') {
            return {responseText: userResponse, voterId: user._id};
        }
        if (type === 'rating') {
            return {optionIndex: rating - 1, voterId: user._id};
        }
        return {optionIndex: selectedOptionIndex, voterId: user._id};
    }, [type, userResponse, rating, selectedOptionIndex, user]);

    // Get poll details by ID
    const getPollDetails = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.POLLS.GET_BY_ID(pollId)
            );

            if (response.data) {
                const pollDetails = response.data;
                setPollResult({
                    options: pollDetails.options || [],
                    voters: pollDetails.voters || [],
                    responses: pollDetails.responses || [],
                });
            }
        } catch (err) {
            toast.error(err.responses?.data?.message || "Error something went wrong");
        }
    }

    // Handle the submission fo votes
    const handleVoteSubmit = async () => {
        try {
            const response = await axiosInstance.post(
                API_PATHS.POLLS.VOTE(pollId),
                getPostData()
            );

            if (response.data) {
                getPollDetails();
                onUserVoted()
                setIsVoteComplete(true);
                toast.success("Voted Submitted Successfully!");
            }

        } catch (err) {
            toast.error(err.responses?.data?.message || "Error something went wrong");
        }
    }

    // Toggles the bookmark status of a poll
    const toggleBookmark = async () => {
        try {
            const response = await axiosInstance.post(
                API_PATHS.POLLS.BOOKMARK(pollId),
            );

            if (response.data) {
                toggleBookmarkId(pollId);
                setPollBookmarked(prev => !prev)
                toast.success(`Bookmark ${pollBookmarked ? "removed" : "added"} successfully!`);
            }

        } catch (err) {
            toast.error(err.responses?.data?.message || "Error something went wrong");
        }
    }

    // Close Poll
    const closePoll = async () => {
        try {
            const response = await axiosInstance.post(API_PATHS.POLLS.CLOSE(pollId));

            if (response.data) {
                setPollClosed(true);
                toast.success("Poll closed successfully!");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error something went wrong");
        }
    }

    // Delete Poll
    const deletePoll = async () => {
        try {
            const response = await axiosInstance.delete(API_PATHS.POLLS.DELETE(pollId));

            if (response.data) {
                setPollDelete(true);
                onPollCreateAndDelete("delete")
                toast.success("Poll Deleted successfully!");
            }

        } catch (err) {
            toast.error(err.response?.data?.message || "Error something went wrong");
        }
    }

    return !pollDelete && (
        <div className="bg-slate-100/50 my-5 p-5 rounded-lg border border-slate-100 mx-auto">
            <div className="flex justify-between">
                <UserProfileInfo
                    imgUrl={creatorProfileImg}
                    fullName={creatorFullName}
                    username={creatorName}
                    createdAt={createdAt}
                />

                <PollActions
                    pollId={pollId}
                    isVoteComplete={isVoteComplete}
                    inputCaptured={
                        !!(userResponse || selectedOptionIndex >= 0 || rating)
                    }
                    onVoteSubmit={handleVoteSubmit}
                    isBookmarked={pollBookmarked}
                    toggleBookmark={toggleBookmark}
                    isMyPoll={isMyPoll}
                    pollClosed={pollClosed}
                    onClosePoll={closePoll}
                    onDeletePoll={deletePoll}
                />
            </div>

            <div className="ml-14 mt-3">
                <p className="text-[15px] text-black leading-8">
                    {question}
                </p>
                <div className="mt-4">
                    {isVoteComplete || isPollClosed ? (
                        <PollingResultContent
                            type={type}
                            options={pollResult.options || []}
                            voters={pollResult.voters || []}
                            responses={pollResult.responses || []}
                        />
                    ) : (
                        <PollContent
                            type={type}
                            options={options}
                            selectedOptionIndex={selectedOptionIndex}
                            onOptionSelect={handleInput}
                            rating={rating}
                            onRatingChange={handleInput}
                            userResponse={userResponse}
                            onResponseChange={handleInput}
                        />
                    )}
                </div>
            </div>

        </div>
    )
}

export default PollCard;