// import path from 'path';
import fs from 'fs';
import createPuzzle from '../../dist/node-puzzle.cjs.js';

// const cwd = process.cwd();
// const __dirname = path.dirname(import.meta.url);

// console.log('cwd: ', cwd);
// console.log('__dirname: ', __dirname); // 此处不能使用 __dirname ，路径中包含了 file: 导致报错

const input = 'docs/sunflower.jpg';

createPuzzle(input).then((res) => {
  console.log('res: ', res);
  fs.writeFileSync('examples/mjs/bg.jpg', res.bg);
  fs.writeFileSync('examples/mjs/puzzle.png', res.puzzle);
});
