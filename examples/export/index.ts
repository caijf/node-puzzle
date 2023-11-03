import path from 'path';
import fs from 'fs';
import createPuzzle from '../../src';

createPuzzle(
  path.join(__dirname, '../../docs/sunflower.jpg'),
  {
    bg: fs.createWriteStream(path.join(__dirname, 'bg.jpg')),
    puzzle: fs.createWriteStream(path.join(__dirname, 'puzzle.png'))
  },
  {
    // bgImageType: 'png',
    quality: 30
  }
).then((res) => {
  console.log('res: ', res);
});