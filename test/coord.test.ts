import fs from 'fs';
import path from 'path';
import createPuzzle from '../src';

const name = 'coord';

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

  it('custom coord', async () => {
    const result = await createPuzzle(
      paths.origin,
      {
        bg: fs.createWriteStream(paths.bg),
        puzzle: fs.createWriteStream(paths.puzzle)
      },
      {
        x: 100,
        y: 50
      }
    );

    expect(result.x).toBe(100);
    expect(result.y).toBe(0);
    expect(fs.existsSync(paths.bg)).toBe(true);
    expect(fs.existsSync(paths.puzzle)).toBe(true);
  });
});
