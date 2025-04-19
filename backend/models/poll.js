const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true, // single-choice rating yes/no
        },
        options: [{
            optionText: {
                type: String,
                required: true,
            },
            votes: {
                type: Number,
                default: 0, // for vote tracking
            }
        }],
        responses: [{
            voterId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            responseText: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            }
        }],
        creator:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        voters:[{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        createdAt:{
            type: Date,
            default: Date.now,
        },
        closed:{
            type: Boolean,
            default: false, // To mark polls as closed
        }
    }
)

module.exports = mongoose.model("Poll", pollSchema);