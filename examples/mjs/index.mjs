// import path from 'path';
import fs from 'fs';
import createPuzzle from '../../dist/node-puzzle.cjs.js';

// const cwd = process.cwd();
// const __dirname = path.dirname(import.meta.url);

// console.log('cwd: ', cwd);
// console.log('__dirname: ', __dirname); // 此处不能使用 __dirname ，路径中包含了 file: 导致报错

createPuzzle('docs/sunflower.jpg', {
  bg: fs.createWriteStream('examples/mjs/bg.jpg'),
  puzzle: fs.createWriteStream('examples/mjs/puzzle.png')
}).then((res) => {
  console.log('res: ', res);
});
