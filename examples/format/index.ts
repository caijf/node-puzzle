import path from 'path';
import fs from 'fs';
import createPuzzle from '../../src';

const input = path.join(__dirname, '../../docs/sunflower.jpg');

createPuzzle(input, {
  format: 'webp',
  bgFormat: 'webp'
}).then((res) => {
  console.log('res: ', res);
  fs.writeFileSync(path.join(__dirname, 'bg.jpg'), res.bg);
  fs.writeFileSync(path.join(__dirname, 'puzzle.png'), res.puzzle);
});
