import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import createPuzzle from '../src';
import { isBuffer } from 'ut2';
import { Point } from 'create-puzzle';

const input = path.join(__dirname, './fixtures/sunflower.jpg');
const output = path.join(__dirname, `./dist`);

fse.ensureDirSync(output);

const getOutputPaths = (name: string) => ({
  bg: path.join(output, `${name}-bg.jpg`),
  puzzle: path.join(output, `${name}-puzzle.png`)
});

describe('createPuzzle', () => {
  it('existed bg.jpg and puzzle.png file', async () => {
    const result = await createPuzzle(input);
    const paths = getOutputPaths('basic');

    fs.writeFileSync(paths.bg, result.bg);
    fs.writeFileSync(paths.puzzle, result.puzzle);

    expect(result.x).toBeGreaterThanOrEqual(60);
    expect(result.y).toBe(0);
    expect(isBuffer(result.bg)).toBe(true);
    expect(isBuffer(result.puzzle)).toBe(true);
    expect(fs.existsSync(paths.bg)).toBe(true);
    expect(fs.existsSync(paths.puzzle)).toBe(true);
  });

  it('custom coord', async () => {
    const result = await createPuzzle(input, {
      x: 100,
      y: 50
    });
    const paths = getOutputPaths('coord');

    fs.writeFileSync(paths.bg, result.bg);
    fs.writeFileSync(paths.puzzle, result.puzzle);

    expect(result.x).toBe(100);
    expect(result.y).toBe(0);
    expect(fs.existsSync(paths.bg)).toBe(true);
    expect(fs.existsSync(paths.puzzle)).toBe(true);
  });

  it('unequal height', async () => {
    const result = await createPuzzle(input, {
      x: 100,
      y: 50,
      equalHeight: false
    });
    const paths = getOutputPaths('unequal-height');

    fs.writeFileSync(paths.bg, result.bg);
    fs.writeFileSync(paths.puzzle, result.puzzle);

    expect(result.x).toBe(100);
    expect(result.y).toBe(50);
    expect(fs.existsSync(paths.bg)).toBe(true);
    expect(fs.existsSync(paths.puzzle)).toBe(true);
  });

  it('custom size', async () => {
    const result = await createPuzzle(input, {
      width: 40,
      height: 40,
      bgWidth: 200,
      bgHeight: 100,
      bgOffset: [50, 30]
    });
    const paths = getOutputPaths('size');

    fs.writeFileSync(paths.bg, result.bg);
    fs.writeFileSync(paths.puzzle, result.puzzle);

    expect(result.x).toBeGreaterThanOrEqual(40);
    expect(result.y).toBe(0);
    expect(fs.existsSync(paths.bg)).toBe(true);
    expect(fs.existsSync(paths.puzzle)).toBe(true);
  });

  it('all config', async () => {
    const result = await createPuzzle(input, {
      borderWidth: 3,
      borderColor: 'red',
      fillColor: 'blue',
      points: { top: Point.Inner, right: Point.Outer, bottom: Point.Outer, left: Point.None },
      width: 90,
      height: 40,
      x: 10,
      y: 10,
      margin: 5,
      equalHeight: false,
      format: 'webp',
      quality: 70,

      // 背景图
      bgWidth: 180,
      bgHeight: 80,
      bgOffset: [90, 40],
      bgFormat: 'webp',
      bgQuality: 50
    });
    const paths = getOutputPaths('all-config');

    fs.writeFileSync(paths.bg, result.bg);
    fs.writeFileSync(paths.puzzle, result.puzzle);

    expect(result.x).toBe(10);
    expect(result.y).toBe(10);
    expect(fs.existsSync(paths.bg)).toBe(true);
    expect(fs.existsSync(paths.puzzle)).toBe(true);
  });
});
