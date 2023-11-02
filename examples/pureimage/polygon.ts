import * as PImage from "pureimage";
import fs from "fs";
import path from 'path';

// make image
const img1 = PImage.make(500, 500);

// get canvas context
const ctx = img1.getContext("2d");

ctx.clearRect(0, 0, 500, 500);

ctx.beginPath();
ctx.moveTo(5, 75);
ctx.lineTo(80, 75)
ctx.arc(100, 75, 20, 1 * Math.PI, 0 * Math.PI, true);
ctx.lineTo(185, 75);
ctx.lineTo(100, 175);
ctx.lineTo(5, 75);

ctx.closePath();

// ctx.strokeStyle = 'red';
// ctx.stroke();

ctx.fillStyle = 'red';
ctx.fill();

//write to 'polygon.png'
PImage.encodePNGToStream(img1, fs.createWriteStream(path.join(__dirname, 'polygon.png')))
  .then(() => {
    console.log("wrote out the png file to polygon.png");
  })
  .catch((e) => {
    console.log("there was an error writing");
  });