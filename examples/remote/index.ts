import path from 'path';
import fs from 'fs';
import createPuzzle from '../../src';

// image ref: https://picsum.photos/
const input =
  'https://fastly.picsum.photos/id/27/360/160.jpg?hmac=5J_4prvaOqKjKy14iOjHoTNQKVVWCL45jOFBrZhmmaE';

createPuzzle(input).then((res) => {
  console.log('res: ', res);
  fs.writeFileSync(path.join(__dirname, 'bg.jpg'), res.bg);
  fs.writeFileSync(path.join(__dirname, 'puzzle.png'), res.puzzle);
});
