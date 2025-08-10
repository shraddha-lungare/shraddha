const express = require("express");
const router = express.Router();
const upload = require("../Middleware/upload"); // <-- import your multer config

// Route: upload a single file (key name: "image")
router.post("/image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Respond with file info
  res.status(200).json({
    message: "File uploaded successfully!",
    filename: req.file.filename,
    path: "/uploads/${req.file.filename}"
  });
});

module.exports = router;