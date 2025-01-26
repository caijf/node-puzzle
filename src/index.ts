import { drawPuzzle, getRandomPoints, Point as BasePoint } from 'create-puzzle';
import { randomInt } from 'ut2';
import { AvifConfig, createCanvas, loadImage } from '@napi-rs/canvas';

export type Point = BasePoint;

type Options = {
  // 拼图
  borderWidth?: number; // 描边宽度。默认 1
  borderColor?: string; // 描边颜色。默认 rgba(255,255,255,0.7)
  fillColor?: string; // 填充颜色。默认 rgba(255,255,255,0.7)
  points?: NonNullable<Parameters<typeof drawPuzzle>[1]>['points']; // 拼图点，不传默认随机2/3/4
  width?: number; // 宽度。默认 60
  height?: number; // 高度。默认 60
  x?: number; // x 轴偏移值，如果不传内部随机生成。
  y?: number; // y 轴偏移值，如果不传内部随机生成。
  margin?: number; // 上下左右留白。默认 2
  equalHeight?: boolean; // 等高。默认 true
  format?: 'webp' | 'png' | 'avif'; // 图片格式，支持 `png` `webp` `avif`。默认 png
  quality?: number; // 图片质量，仅作用于 `webp` 图片格式。默认 80
  avifConfig?: AvifConfig; // `avif` 配置，仅作用于 `avif` 图片格式。

  // 背景图
  bgWidth?: number; // 背景图宽度。默认 图片宽度
  bgHeight?: number; // 背景图高度。默认 图片高度
  bgOffset?: [number, number]; // 背景图偏移值。默认 [0,0]
  bgFormat?: 'webp' | 'jpeg' | 'png' | 'avif'; // 图片格式，支持 `jpeg` `png` `webp` `avif`。默认 jpeg
  bgQuality?: number; // 图片质量，仅作用于 `webp` 或 `jpeg` 图片格式。默认 `format` 值
  bgAvifConfig?: AvifConfig; // `avif` 配置，仅作用于 `avif` 图片格式。默认 `avifConfig` 值
};

type InputType = Parameters<typeof loadImage>[0];

async function createPuzzle(input: InputType, options: Options = {}) {
  const {
    // 拼图
    borderWidth = 1,
    borderColor = 'rgba(255,255,255,0.7)',
    fillColor = 'rgba(255,255,255,0.7)',
    points: outPoints,
    width = 60,
    height = 60,
    x: outX,
    y: outY,
    margin = 2,
    equalHeight = true,
    format = 'png',
    quality = 80,
    avifConfig,

    // 背景图
    bgWidth: outBgWidth,
    bgHeight: outBgHeight,
    bgOffset = [0, 0],
    bgFormat = 'jpeg',
    bgQuality: outBgQuality,
    bgAvifConfig: outBgAvifConfig
  } = options;
  const bgQuality = outBgQuality || quality;
  const bgAvifConfig = outBgAvifConfig || avifConfig;

  const originImg = await loadImage(input);

  // 拼图点
  const points =
    typeof outPoints === 'number' || !outPoints ? getRandomPoints(outPoints) : outPoints;

  const bgWidth =
    typeof outBgWidth === 'number' && outBgWidth > 0
      ? outBgWidth > width
        ? outBgWidth
        : width
      : originImg.width;
  const bgHeight =
    typeof outBgHeight === 'number' && outBgHeight > 0
      ? outBgHeight > height
        ? outBgHeight
        : height
      : originImg.height;

  const maxOffsetX = bgWidth - width;
  const maxOffsetY = bgHeight - height;
  let x = typeof outX === 'undefined' ? randomInt(width, maxOffsetX) : outX || 0;
  let y = typeof outY === 'undefined' ? randomInt(0, maxOffsetY) : outY || 0;

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
  const bgCanvas = createCanvas(bgWidth, bgHeight);
  const bgCtx = bgCanvas.getContext('2d');
  bgCtx.clearRect(0, 0, bgWidth, bgHeight);
  bgCtx.drawImage(originImg, bgOffset[0], bgOffset[1], bgWidth, bgHeight, 0, 0, bgWidth, bgHeight);

  // 拼图
  const puzzleCanvasHeight = equalHeight ? bgHeight : height;
  const puzzleY = equalHeight ? y : 0;

  const puzzleCanvas = createCanvas(width, puzzleCanvasHeight);
  const puzzleCtx = puzzleCanvas.getContext('2d');
  puzzleCtx.strokeStyle = borderColor;
  puzzleCtx.lineWidth = borderWidth;
  puzzleCtx.clearRect(0, 0, width, puzzleCanvasHeight);
  drawPuzzle(puzzleCtx as any, {
    x: 0,
    y: puzzleY,
    w: width,
    h: height,
    points,
    margin
  });
  puzzleCtx.clip();
  puzzleCtx.drawImage(bgCanvas, x, y, width, height, 0, puzzleY, width, height);

  // 背景图添加遮罩
  const maskCanvas = createCanvas(width, height);
  const maskCtx = maskCanvas.getContext('2d');
  maskCtx.clearRect(0, 0, width, height);
  maskCtx.fillStyle = fillColor;
  maskCtx.fillRect(0, 0, width, height);

  bgCtx.strokeStyle = borderColor;
  bgCtx.lineWidth = borderWidth;
  drawPuzzle(bgCtx as any, {
    x,
    y,
    w: width,
    h: height,
    points,
    margin
  });
  bgCtx.clip();
  bgCtx.drawImage(maskCanvas, x, y, width, height);

  const puzzleCanvasToData =
    format === 'png'
      ? puzzleCanvas.encode(format)
      : format === 'avif'
        ? puzzleCanvas.encode(format, avifConfig)
        : puzzleCanvas.encode(format, quality);
  const bgCanvasToData =
    bgFormat === 'png'
      ? bgCanvas.encode(bgFormat)
      : bgFormat === 'avif'
        ? bgCanvas.encode(bgFormat, bgAvifConfig)
        : bgCanvas.encode(bgFormat, bgQuality);

  // export canvas as image
  const [puzzle, bg] = await Promise.all([puzzleCanvasToData, bgCanvasToData]);

  return {
    bg,
    puzzle,
    x,
    y: equalHeight ? 0 : y
  };
}

export default createPuzzle;
