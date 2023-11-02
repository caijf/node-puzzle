import * as PImage from 'pureimage';
import fs from 'fs';
import path from 'path';
import { drawPuzzle, getRandomPoints } from '../../src/util';

// const WIDTH = 360;
const HEIGHT = 160;

const PUZZLE_WIDTH = 60;
const PUZZLE_HEIGHT = HEIGHT;

console.time('read_stream');
const stream = fs.createReadStream(path.join(__dirname, '../sunflower.jpg'));
console.timeEnd('read_stream');

PImage.decodeJPEGFromStream(stream)
  .then((img) => {
    const sx = 150;
    const sy = 50;
    const points = getRandomPoints(2);

    const ctx = img.getContext('2d');

    // puzzle
    const puzzleCanvas = PImage.make(PUZZLE_WIDTH, PUZZLE_HEIGHT);
    const puzzleCtx = puzzleCanvas.getContext('2d');
    puzzleCtx.strokeStyle = 'white';
    puzzleCtx.lineWidth = 2;
    puzzleCtx.clearRect(0, 0, PUZZLE_WIDTH, PUZZLE_HEIGHT);
    drawPuzzle(puzzleCtx as any, { x: 0, y: sy, points, margin: 2 });
    puzzleCtx.clip();
    puzzleCtx.drawImage(
      img,
      sx,
      sy,
      PUZZLE_WIDTH,
      PUZZLE_HEIGHT,
      0,
      sy,
      PUZZLE_WIDTH,
      PUZZLE_HEIGHT
    );

    // mask
    const maskCanvas = PImage.make(PUZZLE_WIDTH, PUZZLE_HEIGHT);
    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.clearRect(0, 0, PUZZLE_WIDTH, PUZZLE_HEIGHT);
    maskCtx.fillStyle = 'rgba(255,255,255,0.85)';
    maskCtx.fillRect(0, 0, PUZZLE_WIDTH, PUZZLE_HEIGHT);

    drawPuzzle(ctx as any, { x: sx, y: sy, points });
    ctx.clip();
    ctx.drawImage(maskCanvas, sx, sy, PUZZLE_WIDTH, PUZZLE_HEIGHT);

    return Promise.all([
      PImage.encodePNGToStream(
        puzzleCanvas,
        fs.createWriteStream(path.join(__dirname, 'draw-puzzle.png'))
      ),
      PImage.encodeJPEGToStream(img, fs.createWriteStream(path.join(__dirname, 'draw-bg.jpg')))
    ]);
  })
  .then(() => {
    console.log('done writing', 'draw-bg.jpg & draw-puzzle.png');
  });
