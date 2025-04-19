const UserModel = require("../models/User");
const PollModel = require("../models/poll");
const jwt = require("jsonwebtoken");

// Generate Jwt Token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"});
}

// Controllers
module.exports = {
    register: async function (req, res) {
        const {fullName, username, email, password, profileImageUrl} = req.body;

        if (!fullName || !email || !password || !username) {
            return res.status(400).json({
                success: false,
                message: "فراموش کردن گزینه های مهم."
            })
        }

        const usernameRegex = /^[a-zA-Z0-9]+$/;

        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                success: false,
                message: "نام کاربری غیر معتبر. نام کاربری فقط باید شامل حروف باشد"
            })
        }

        try {
            const exitingUser = await UserModel.findOne({email})

            if (exitingUser) {
                return res.status(400).json({
                    success: false,
                    message: "این ایمیل وجود دارد."
                })
            }

            const exitingUsername = await UserModel.findOne({username})

            if (exitingUsername) {
                return res.status(400).json({
                    success: false,
                    message: "این نام کاربری وجود دارد."
                })
            }

            const user = await UserModel.create({
                fullName,
                username,
                email,
                password,
                profileImageUrl
            })

            return res.status(201).json({
                id: user._id,
                user,
                token: generateToken(user._id),
            })

        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            })
        }
    },
    login: async function (req, res) {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "فراموش کردن گزینه های مهم."
            })
        }

        try {
            const user = await UserModel.findOne({email})

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "ایمیل نامعتبر."
                })
            }

            const isPasswordCorrect = await user.comparePassword(password)

            if (!isPasswordCorrect) {
                return res.status(400).json({
                    success: false,
                    message: "رمز عبور با ایمیل همخوانی ندارد."
                })
            }

            const totalPollsCreated = await PollModel.countDocuments({
                creator: user._id
            })

            const totalPollsVotes = await PollModel.countDocuments({
                voters: user._id
            })

            const totalPollsBookmarked = user.bookmarkedPolls.length

            res.status(200).json({
                id: user._id,
                user: {
                    ...user.toObject(),
                    totalPollsCreated,
                    totalPollsVotes,
                    totalPollsBookmarked,
                },
                token: generateToken(user._id),
            })
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            })
        }
    },
    getUserInfo: async function (req, res) {
        try {
            const user = await UserModel.findById(req.user.id).select('-password')

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "کاربر مورد نظر پیدا نشد."
                })
            }

            const totalPollsCreated = await PollModel.countDocuments({
                creator: user._id
            })

            const totalPollsVotes = await PollModel.countDocuments({
                voters: user._id
            })

            const totalPollsBookmarked = user.bookmarkedPolls.length

            const userInfo = {
                ...user.toObject(),
                totalPollsCreated,
                totalPollsVotes,
                totalPollsBookmarked,
            }
            return res.status(200).json(userInfo)
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            })
        }
    },
}