const { createCanvas } = require("canvas");
const moment = require("moment-timezone");
const fs = require("fs");
const Image = require("./Models/Image");

async function createImageWithText(text_list, res) {
  // Create a canvas
  const canvas = createCanvas(2000, 2000);
  const ctx = canvas.getContext("2d");

  // Set the background color
  ctx.fillStyle = "rgb(135, 206, 235)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Calculate the dimensions of the red rectangle
  const rectWidth = canvas.width * 0.5; // 50% width
  const rectHeight = canvas.height * 0.1; // 10% height
  const rectX = (canvas.width - rectWidth) / 2; // Centered horizontally
  const rectY = 0; // At the top

  // Draw a red rounded rectangle with a border radius of 10px
  const cornerRadius = 10;
  ctx.beginPath();
  ctx.moveTo(rectX + cornerRadius, rectY);
  ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
  ctx.quadraticCurveTo(
    rectX + rectWidth,
    rectY,
    rectX + rectWidth,
    rectY + cornerRadius
  );
  ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
  ctx.quadraticCurveTo(
    rectX + rectWidth,
    rectY + rectHeight,
    rectX + rectWidth - cornerRadius,
    rectY + rectHeight
  );
  ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
  ctx.quadraticCurveTo(
    rectX,
    rectY + rectHeight,
    rectX,
    rectY + rectHeight - cornerRadius
  );
  ctx.lineTo(rectX, rectY + cornerRadius);
  ctx.quadraticCurveTo(rectX, rectY, rectX + cornerRadius, rectY);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();

  // Set the text properties
  ctx.fillStyle = "white";
  ctx.font = "55px Arial"; // Increase font size by 5 pixels

  // Text to be added to the image
  const newsUpdates = "Latest News Updates";
  const currentDate = moment.tz("Asia/Kathmandu").format("MMMM DD, YYYY");
  const currentTime = moment.tz("Asia/Kathmandu").format("hh:mm A");

  // Measure the text widths
  const newsUpdatesWidth = ctx.measureText(newsUpdates).width;
  const currentDateWidth = ctx.measureText(currentDate).width;
  const currentTimeWidth = ctx.measureText(currentTime).width;

  // Position the text in the center of the red rectangle
  const newsX = rectX + (rectWidth - newsUpdatesWidth) / 2;
  const dateX = rectX + (rectWidth - currentDateWidth) / 2;
  const timeX = rectX + (rectWidth - currentTimeWidth) / 2;

  const textY = rectY + rectHeight / 2;

  // Add text to the canvas
  ctx.fillText(newsUpdates, newsX, textY - 40); // Adjust vertical position
  ctx.fillText(currentDate, dateX, textY + 20); // Adjust vertical position
  ctx.fillText(currentTime, timeX, textY + 80); // Adjust vertical position

  // Additional text to be added to the image

  // Save the original font size
  const originalFontSize = ctx.font;

  // Increase the font size for text_list by 10 pixels
  ctx.font = "70px Arial"; // Adjust font size as needed

  // Position the list of text in the red rectangle with appropriate margins
  let textListY = rectY + rectHeight + 150; // Add a 20px margin at the top of the text list
  const lineHeight = 40; // Adjust the line height as needed
  const maxLineChars = 50; // Maximum characters per line
  const linePadding = 30; // Padding for each line
  const textSpacing = 40; // Margin between each text item

  // Calculate the maximum text width within each text block
  const maxTextBlockWidth = rectWidth - 2 * linePadding;

  // Define a constant gap between the first line of each text_list item
  const firstLineGap = 40; // Adjust as needed

  // Loop through the text_list and add each item to the canvas
  for (let i = 0; i < text_list.length; i++) {
    const text = text_list[i];
    const words = text.split(" ");
    let line = "";
    let textLines = [];

    for (const word of words) {
      if ((line + " " + word).length <= maxLineChars) {
        line += (line.length > 0 ? " " : "") + word;
      } else {
        textLines.push(line);
        line = word;
      }
    }

    textLines.push(line);

    // Calculate total text height for this item
    const textHeight = textLines.length * lineHeight;

    // Calculate the maximum text width within this text block
    const textBlockWidth = Math.min(
      maxTextBlockWidth,
      ctx.measureText(textLines[0]).width
    );

    // Position the text in the center of the red rectangle, shifted to the left by 150 pixels
    const textX = rectX - 300; // Adjusted to push the text to the left
    let textY = textListY + i * (lineHeight + textHeight);

    // Add padding to the top of the first line with the consistent gap for all items
    textY += firstLineGap; // Add the consistent gap for all lines

    // Add each line of text to the canvas with padding between lines
    for (let j = 0; j < textLines.length; j++) {
      ctx.fillText(
        textLines[j],
        textX,
        textY + j * lineHeight + j * linePadding
      );
    }

    // Add spacing between each text item
    textListY += textHeight + textSpacing;
  }

  // Restore the original font size for the "Latest News Updates," "Date," and "Time" text
  ctx.font = originalFontSize;

  // Save the canvas as an image file (PNG format)
  // const output = fs.createWriteStream("output.png");
  // const stream = canvas.createPNGStream();
  // stream.pipe(output);

  // output.on("finish", () => {
  //   console.log("Image created successfully.");
  // });
  // Save the canvas as an image file (PNG format)
  const buffer = canvas.toBuffer("image/png");
  try {
    // Create a new Image document and save it to MongoDB using async/await
    const newImage = new Image({
      data: buffer,
      contentType: "image/png",
    });

    await newImage.save();
    console.log("Image saved to MongoDB");

    res.status(200).send("Image saved to MongoDB and file system");
  } catch (err) {
    console.error("Error saving image:", err);
    res.status(500).send("Error saving image");
  }
}
module.exports = createImageWithText;
