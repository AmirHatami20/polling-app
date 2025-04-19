const express = require('express');
const {protect} = require("../middlewares/authMiddleware");
const pollController = require("../controllers/pollController");
const router = express.Router();

// Create new poll
router.post("/", protect, pollController.createPoll);

// Get all polls
router.get("/", protect, pollController.getAllPolls);

// Get a specific poll by ID
router.get("/:id", protect, pollController.getPollById);

// Vote on a poll
router.post("/:id/vote", protect, pollController.voteOnPoll);

// Get voted polls (by the current user)
router.get("/user/voted", protect, pollController.getVotedPolls);

// Add to Bookmark
router.post("/:id/bookmark", protect, pollController.bookmarkPoll);

// Get bookmarked polls (by the current user)
router.get("/user/bookmarked", protect, pollController.getBookmarkedPolls);

// Close a poll
router.post("/:id/close", protect, pollController.closePoll);

// Delete a poll
router.delete("/:id", protect, pollController.deletePoll);

module.exports = router;
