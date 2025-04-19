import {useState} from 'react';
import {FaBookmark, FaRegBookmark} from "react-icons/fa";

function PollActions(
    {
        isVoteComplete,
        inputCaptured,
        onVoteSubmit,
        isBookmarked,
        toggleBookmark,
        isMyPoll,
        pollClosed,
        onClosePoll,
        onDeletePoll,

    }
) {
    const [loading, setLoading] = useState(false);

    const handleVoteClick = async () => {
        setLoading(true);
        try {
            await onVoteSubmit();
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-4">
            {(isVoteComplete || pollClosed) && (
                <div className="text-[11px] font-medium text-slate-600 bg-sky-700/10 px-3 py-1 rounded-md">
                    {pollClosed ? "Closed" : "Voted"}
                </div>
            )}

            {isMyPoll && !pollClosed && (
                <button
                    className="btn-small text-orange-500 bg-orange-500/20 hover:bg-orange-500 hover:text-white hover:border-orange-100"
                    onClick={onClosePoll}
                    disabled={loading}
                >
                    بستن
                </button>
            )}

            {isMyPoll && (
                <button
                    className="btn-small text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white hover:border-red-100"
                    onClick={onDeletePoll}
                    disabled={loading}
                >
                    حذف
                </button>
            )}

            <button
                className="icon-btn"
                onClick={toggleBookmark}
            >
                {isBookmarked ? (
                    <FaBookmark className="text-primary "/>
                ) : (
                    <FaRegBookmark/>
                )}
            </button>

            {inputCaptured && !isVoteComplete && (
                <button
                    className="btn-small ml-auto"
                    onClick={handleVoteClick}
                    disabled={loading}
                >
                    {loading ? "در حال ثبت..." : "ثبت"}
                </button>
            )}
        </div>
    );
}

export default PollActions;