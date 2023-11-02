import * as PImage from 'pureimage';
import { Writable as WriteStream } from 'stream';
import sizeOf from 'image-size';
import { drawPuzzle, getRandomPoints, getImageBuffer, bufferToStream, getRandomInt } from './util';

type ImageType = 'png' | 'jpeg';

type Output = {
  bg: WriteStream;
  puzzle: WriteStream;
};

type Options = {
  // 拼图
  borderWidth?: number; // 描边宽度。默认 1
  borderColor?: string; // 描边颜色。默认 rgba(255,255,255,0.7)
  fillColor?: string; // 填充颜色。默认 rgba(255,255,255,0.7)
  width?: number; // 宽度。默认 60
  height?: number; // 高度。默认 60
  x?: number; // x 轴偏移值，如果不传内部随机生成。
  y?: number; // y 轴偏移值，如果不传内部随机生成。
  margin?: number; // 上下左右留白。默认 2

  // 背景图
  bgWidth?: number; // 背景图宽度。默认 图片宽度
  bgHeight?: number; // 背景图高度。默认 图片高度
  bgOffset?: [number, number]; // 背景图偏移值。 默认 [0,0]

  // 导出配置
  bgImageType?: ImageType; // 背景图导出类型。默认 jpeg
  quality?: number; // 导出图片质量，仅作用于 `jepg` 图片。默认 80 。
  pngOptions?: Parameters<typeof PImage.encodePNGToStream>[2]; // 导出 png 图片配置，仅作用于 `png` 图片。
};

async function createPuzzle(input: string | Buffer, output: Output, options: Options = {}) {
  const {
    // 拼图
    borderWidth = 1,
    borderColor = 'rgba(255,255,255,0.7)',
    fillColor = 'rgba(255,255,255,0.7)',
    width = 60,
    height = 60,
    x: outX,
    y: outY,
    margin = 2,

    // 背景图
    bgWidth: outBgWidth,
    bgHeight: outBgHeight,
    bgOffset = [0, 0],

    // 导出配置
    bgImageType = 'jpeg',
    quality = 80,
    pngOptions
  } = options;

  const buffer = await getImageBuffer(input);
  const originSizeObj = sizeOf(buffer);

  console.log('originSizeObj: ', originSizeObj);

  const decodeMethod =
    originSizeObj.type === 'png' ? PImage.decodePNGFromStream : PImage.decodeJPEGFromStream;
  const stream = await bufferToStream(buffer);
  // 拼图点不支持自定义，默认2个点
  const points = getRandomPoints(2);
  // 原图
  const originImg = await decodeMethod(stream);
  // const originCtx = originImg.getContext('2d');

  const bgWidth =
    typeof outBgWidth === 'number' && outBgWidth > 0
      ? outBgWidth > width
        ? outBgWidth
        : width
      : originSizeObj.width!;
  const bgHeight =
    typeof outBgHeight === 'number' && outBgHeight > 0
      ? outBgHeight > height
        ? outBgHeight
        : height
      : originSizeObj.height!;

  const maxOffsetX = bgWidth - width;
  const maxOffsetY = bgHeight - height;
  let x = typeof outX === 'undefined' ? getRandomInt(maxOffsetX, width) : outX || 0;
  let y = typeof outY === 'undefined' ? getRandomInt(maxOffsetY) : outY || 0;

  if (x < 0) {
    x = 0;
  } else if (x > maxOffsetX) {
    x = maxOffsetX;
  }

  if (y < 0) {
    y = 0;
  } else if (y > maxOffsetY) {
    y = maxOffsetY;
  }

  // 背景图
  const img = PImage.make(bgWidth, bgHeight);
  const ctx = img.getContext('2d');
  ctx.clearRect(0, 0, bgWidth, bgHeight);
  ctx.drawImage(originImg, bgOffset[0], bgOffset[1], bgWidth, bgHeight, 0, 0, bgWidth, bgHeight);

  // 拼图
  const puzzle = PImage.make(width, height);
  const puzzleCtx = puzzle.getContext('2d');
  puzzleCtx.strokeStyle = borderColor;
  puzzleCtx.lineWidth = borderWidth;
  puzzleCtx.clearRect(0, 0, width, height);
  drawPuzzle(puzzleCtx as any, { x: 0, y: 0, w: width, h: height, points, margin });
  puzzleCtx.clip();
  puzzleCtx.drawImage(img, x, y, width, height, 0, 0, width, height);

  // 背景图添加遮罩
  const maskCanvas = PImage.make(width, height);
  const maskCtx = maskCanvas.getContext('2d');
  maskCtx.clearRect(0, 0, width, height);
  maskCtx.fillStyle = fillColor;
  maskCtx.fillRect(0, 0, width, height);

  drawPuzzle(ctx as any, { x, y, w: width, h: height, points, margin });
  ctx.clip();
  ctx.drawImage(maskCanvas, x, y, width, height);

  const bgImageTypeIsPng = bgImageType === 'png';
  const bgEncodeMethod = bgImageTypeIsPng ? PImage.encodePNGToStream : PImage.encodeJPEGToStream;
  const bgQualityOptions = bgImageTypeIsPng ? pngOptions : quality;

  return Promise.all([
    PImage.encodePNGToStream(puzzle, output.puzzle, pngOptions),
    // @ts-ignore
    bgEncodeMethod(img, output.bg, bgQualityOptions)
  ]).then(() => {
    return {
      x
    };
  });
}

export default createPuzzle;
