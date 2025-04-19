const express = require('express')
const authController = require('../controllers/authController')
const {protect} = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadedMiddleware");

const router = express.Router()

router.post("/register", authController.register)

router.post("/login", authController.login)

router.get("/get-user", protect, authController.getUserInfo)

router.post("/upload-image", upload.any(), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({success: false, message: 'No files uploaded'});
    }

    const file = req.files[0];
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

    res.status(200).json({imageUrl});
});

module.exports = router;


