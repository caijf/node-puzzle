import fs from 'fs';
import path from 'path';
import createPuzzle from '../src';

const name = 'basic';

const paths = {
  origin: path.join(__dirname, './fixtures/sunflower.jpg'),
  bg: path.join(__dirname, `${name}-bg.jpg`),
  puzzle: path.join(__dirname, `${name}-puzzle.png`)
};

describe(name, () => {
  afterEach(() => {
    fs.unlinkSync(paths.bg);
    fs.unlinkSync(paths.puzzle);
  });

  it('existed bg.jpg and puzzle.png file', async () => {
    const result = await createPuzzle(paths.origin, {
      bg: fs.createWriteStream(paths.bg),
      puzzle: fs.createWriteStream(paths.puzzle)
    });

    expect(result.x).toBeGreaterThanOrEqual(60);
    expect(result.y).toBe(0);
    expect(fs.existsSync(paths.bg)).toBe(true);
    expect(fs.existsSync(paths.puzzle)).toBe(true);
  });
});
