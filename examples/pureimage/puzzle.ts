import * as PImage from "pureimage";
import fs from "fs";
import path from 'path';
import { drawPuzzle } from '../../src/util';

// make image
const img1 = PImage.make(200, 200);

// get canvas context
const ctx = img1.getContext("2d");

ctx.clearRect(0, 0, 200, 200);

ctx.strokeStyle = 'red';

drawPuzzle(ctx as any, { margin: 5 });

//write to 'puzzle.png'
PImage.encodePNGToStream(img1, fs.createWriteStream(path.join(__dirname, "puzzle.png")))
  .then(() => {
    console.log("wrote out the png file to puzzle.png");
  })
  .catch((e) => {
    console.log("there was an error writing");
  });
