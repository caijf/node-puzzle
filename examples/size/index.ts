import path from 'path';
import fs from 'fs';
import createPuzzle from '../../src';

const input = path.join(__dirname, '../../docs/sunflower.jpg');

createPuzzle(input, {
  width: 40,
  height: 40,
  bgWidth: 200,
  bgHeight: 100,
  bgOffset: [80, 30]
}).then((res) => {
  console.log('res: ', res);
  fs.writeFileSync(path.join(__dirname, 'bg.jpg'), res.bg);
  fs.writeFileSync(path.join(__dirname, 'puzzle.png'), res.puzzle);
});
