const UserModel = require("../models/User");
const PollModel = require("../models/poll");

module.exports = {
    createPoll: async (req, res) => {
        const {question, type, options, creatorId} = req.body;

        if (!creatorId || !question || !type) {
            return res.status(400).send({
                success: false,
                message: "سوال نوع نظرسنجی و ایدی کاربر الزامی است."
            })
        }

        try {
            let processedOptions = [];

            switch (type) {
                case "single-choice": {
                    if (!options || options.length < 2) {
                        return res.status(400).send({
                            success: false,
                            message: "تک انتخاب باید بیشتر از 1 گزینه باشد."
                        })
                    }
                    processedOptions = options.map(option => (
                        {optionText: option}
                    ));
                    break;
                }

                case "image-based": {
                    if (!options || options.length < 2) {
                        return res.status(400).send({
                            success: false,
                            message: "بر پایه تصویر باید بیشتر از 1 گزینه باشد."
                        })
                    }
                    processedOptions = options.map((url) => (
                        {optionText: url}
                    ))
                    break;
                }

                case "yes/no": {
                    processedOptions = ["آره", "نه"].map((option) => (
                        {optionText: option}
                    ))
                    break;
                }

                case "rating": {
                    processedOptions = [1, 2, 3, 4, 5].map(option => (
                        {optionText: option.toString()}
                    ))
                    break;
                }

                case "open-ended": {
                    processedOptions = []; // No options needed for this
                    break;
                }

                default: {
                    return res.status(400).send({
                        success: false,
                        message: "نوع نظرسنجی نامعتبر."
                    })
                }
            }

            const newPoll = await PollModel.create({
                question,
                type,
                options: processedOptions,
                creator: creatorId,
            })

            res.status(201).json(newPoll);

        } catch (err) {
            return res.status(400).send({
                success: false,
                message: err.message
            })
        }
    },
    getAllPolls: async (req, res) => {
        const {type, creatorId, page = 1, limit = 10} = req.query;
        const filter = {};
        const userId = req.user?._id;

        if (type) filter.type = type;
        if (creatorId) filter.creator = creatorId;

        try {
            // Calculate pagination param
            const pageNumber = parseInt(page, 10)
            const pageSize = parseInt(limit, 10)
            const skip = (pageNumber - 1) * pageSize;

            // Fetch Polls with pagination
            const polls = await PollModel.find(filter)
                .populate("creator", "fullName username email profileImageUrl")
                .populate({
                    path: "responses.voterId",
                    select: "username profileImageUrl fullName",
                })
                .skip(skip)
                .limit(pageSize)
                .sort({createdAt: -1}) // sort from last to first

            // Add 'userHasVoted' flag for each poll
            const updatedPolls = polls.map((poll) => {
                const userHasVoted = poll.voters?.some((voterId) =>
                    voterId.equals(userId)
                );
                return {
                    ...poll.toObject(),
                    userHasVoted,
                }
            })

            // Get total count of polls for pagination metaData
            const totalPolls = await PollModel.countDocuments(filter)

            const stats = await PollModel.aggregate([
                {
                    $group: {
                        _id: "$type",
                        count: {$sum: 1}
                    },
                },
                {
                    $project: {
                        type: "$_id",
                        count: 1,
                        _id: 0
                    }
                }
            ]);

            // Ensure all types are included in stats , even those with zero counts
            const allTypes = [
                {type: "yes/no", label: "آره/نه"},
                {type: "single-choice", label: "تک انتخاب"},
                {type: "rating", label: "نمره دهی"},
                {type: "image-based", label: "بر پایه تصویر"},
                {type: "open-ended", label: "پاسخ آزاد"},
            ];

            const statsWithDefault = allTypes.map(pollType => {
                const stat = stats.find((item) => item.type === pollType.type)
                return {
                    label: pollType.label,
                    type: pollType.type,
                    count: stat ? stat.count : 0,
                };
            })
                .sort((a, b) => b.count - a.count);

            res.status(200).json({
                polls: updatedPolls,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalPolls / pageSize),
                totalPolls,
                stats: statsWithDefault
            });
        } catch (err) {
            return res.status(400).send({
                success: false,
                message: err.message
            })
        }
    },
    getPollById: async (req, res) => {
        const {id} = req.params;

        const poll = await PollModel.findById(id)

        if (!poll) {
            return res.status(404).send({
                success: false,
                message: "نظر سنجی پیدا نشد."
            })
        }

        res.status(200).json(poll)
    },
    voteOnPoll: async (req, res) => {
        const {id} = req.params;
        const {optionIndex, voterId, responseText} = req.body;

        try {
            const poll = await PollModel.findById(id)

            if (!poll) {
                return res.status(404).send({
                    success: false,
                    message: "نظر سنجی پیدا نشد."
                })
            }

            if (poll.closed) {
                return res.status(400).send({
                    success: false,
                    message: "نظر سنجی بسته است."
                })
            }

            if (poll.voters.includes(voterId)) {
                return res.status(400).send({
                    success: false,
                    message: "کاربر قبلا رای داده است."
                })
            }

            if (poll.type === "open-ended") {
                if (!responseText) {
                    return res.status(400).send({
                        success: false,
                        message: "متن پاسخ الزامی است."
                    })
                }
                poll.responses.push({voterId, responseText});
            } else {
                if (optionIndex === undefined || optionIndex < 0 || optionIndex >= poll.options.length) {
                    return res.status(400).send({
                        success: false,
                        message: "گزینه ی نامعتبر."
                    })
                }
                poll.options[optionIndex].votes += 1;
            }

            poll.voters.push(voterId);
            await poll.save()

            return res.status(200).send(poll);

        } catch (err) {
            return res.status(400).send({
                success: false,
                message: err.message
            })
        }
    },
    getVotedPolls: async (req, res) => {
        try {
            const {page, limit} = req.query;
            const userId = req.user?._id;

            // Calculate pagination param
            const pageNumber = parseInt(page, 10) // 2
            const pageSize = parseInt(limit, 10) // 5
            const skip = (pageNumber - 1) * pageSize; // 5

            // Fetch polls where the user has voted
            const polls = await PollModel.find({voters: userId})
                .populate("creator", "fullName username email profileImageUrl")
                .populate({
                    path: "responses.voterId",
                    select: "username profileImageUrl fullName",
                })
                .skip(skip)
                .limit(limit)
                .sort({createdAt: -1})

            // Add 'userHasVoted' flag for each poll
            const updatedPolls = polls.map((poll) => {
                const userHasVoted = poll.voters?.some((voterId) =>
                    voterId.equals(userId)
                )

                return {
                    ...poll.toObject(),
                    userHasVoted
                }
            })

            // Get total count of voted polls for pagination metaData
            const totalVotedPolls = await PollModel.countDocuments({voters: userId})

            res.status(200).json({
                polls: updatedPolls,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalVotedPolls / pageSize), // 14 / 3 = 5
                totalVotedPolls,
            })
        } catch (err) {
            return res.status(400).send({
                success: false,
                message: err.message
            })
        }
    },
    bookmarkPoll: async (req, res) => {
        const pollId = req.params.id;
        const userId = req.user?._id;

        try {
            const user = await UserModel.findById(userId)

            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "کاربر وجو ندارد."
                })
            }

            const alreadyBookmarked = user.bookmarkedPolls.includes(pollId);
            if (alreadyBookmarked) {
                // Remove Poll From Bookmark
                user.bookmarkedPolls = user.bookmarkedPolls.filter(
                    (bookmarkId) => bookmarkId.toString() !== pollId
                );
            } else {
                // Add poll in Bookmark
                user.bookmarkedPolls.push(pollId);
            }

            await user.save();

            res.status(200).json({
                success: true,
                message: alreadyBookmarked ? "Bookmark removed" : "Bookmark added",
                bookmarks: user.bookmarkedPolls
            });

        } catch (err) {
            return res.status(400).send({
                success: false,
                message: err.message
            })
        }


    },
    getBookmarkedPolls: async (req, res) => {
        const userId = req.user?._id;

        try {
            const user = await UserModel.findById(userId)
                .populate({
                    path: "bookmarkedPolls",
                    populate: {
                        path: "creator",
                        select: "username fullName profileImageUrl"
                    }
                });

            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "کاربر وجود ندارد."
                })
            }

            const bookmarkedPolls = user.bookmarkedPolls;

            const updatedPolls = bookmarkedPolls?.map((poll) => {
                const userHasVoted = poll.voters?.some((voterId) =>
                    voterId.equals(userId)
                );
                return {
                    ...poll.toObject(),
                    userHasVoted,
                }
            })

            res.status(200).json({bookmarkedPoll: updatedPolls})
        } catch (err) {
            return res.status(400).send({
                success: false,
                message: err.message
            })
        }
    },
    closePoll: async (req, res) => {
        const {id} = req.params;
        const userId = req.user?._id;

        try {
            const poll = await PollModel.findById(id)

            if (!poll) {
                return res.status(404).send({
                    success: false,
                    message: "نظرسنجی ای پیدا نشد."
                })
            }

            if (poll.creator?.toString() !== userId.toString()) {
                return res.status(403).send({
                    success: false,
                    message: "شما اجازه دسترسی به بستن نظرسنجی ندارید."
                });
            }

            poll.closed = true;
            await poll.save();

            res.status(200).json(poll)
        } catch (err) {
            return res.status(400).send({
                success: false,
                message: err.message
            })
        }


    },
    deletePoll: async (req, res) => {
        const {id} = req.params;
        const userId = req.user?._id;

        try {
            const poll = await PollModel.findById(id)

            if (!poll) {
                return res.status(404).send({
                    success: false,
                    message: "نظرسنجی ای پیدا نشد."
                })
            }

            if (poll.creator?.toString() !== userId.toString()) {
                return res.status(403).send({
                    success: false,
                    message: "شما اجازه دسترسی به بستن نظرسنجی ندارید."
                })
            }

            await PollModel.findByIdAndDelete(id)

            res.status(200).json({
                success: true,
                message: "نظرسنجی با موفقیت حذف شد."
            })
        } catch (err) {
            return res.status(400).send({
                success: false,
                message: err.message
            })
        }
    },
}