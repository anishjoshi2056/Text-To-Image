require("dotenv").config();
const express = require("express");
const router = express.Router();
const Image = require("../Models/Image");
const Text_To_Image = require("../Text_To_Image");

// @route GET /texttoimage
router.get("/", async (req, res) => {
  const textList = [
    "1. Cricket's domestic structure will change within three months: CAN President Chand. This is a long line that will be wrapped to fit within a certain character limit.",
    "2. In the heart of the city, a bustling market thrived with activity. Vendors called out their wares, and shoppers weaved through the stalls in search of treasures.",
    "3. The sun beat down on the square, casting shadows on the cobblestone streets. Children laughed and played, their voices echoing in the narrow alleyways.",
    "4. The sun beat down on the square, casting shadows on the cobblestone streets. Children laughed and played, their voices echoing in the narrow alleyways.",
  ];

  await Text_To_Image(textList, res);
});

router.get("/latest", async (req, res) => {
  try {
    // Query MongoDB to find the latest image record
    const latestImage = await Image.findOne().sort({ _id: -1 }).exec();

    if (!latestImage) {
      // Handle the case where no image was found
      return res.status(404).json({ message: "No images found." });
    }

    // Send the latest image as a response
    res.setHeader("Content-Type", latestImage.contentType);
    res.send(latestImage.data);
  } catch (err) {
    console.error("Error retrieving latest image:", err);
    res.status(500).json({ message: "Error retrieving latest image." });
  }
});
module.exports = router;
