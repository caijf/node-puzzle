import path from 'path';
import fs from 'fs';
import createPuzzle from '../../src';

// image ref: https://picsum.photos/
createPuzzle(
  'https://fastly.picsum.photos/id/27/360/160.jpg?hmac=5J_4prvaOqKjKy14iOjHoTNQKVVWCL45jOFBrZhmmaE',
  {
    bg: fs.createWriteStream(path.join(__dirname, 'bg.jpg')),
    puzzle: fs.createWriteStream(path.join(__dirname, 'puzzle.png'))
  }
).then((res) => {
  console.log('res: ', res);
});
