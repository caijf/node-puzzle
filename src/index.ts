import { drawPuzzle, getRandomPoints, Point as BasePoint } from 'create-puzzle';
import { randomInt } from 'ut2';
import { AvifConfig, createCanvas, loadImage } from '@napi-rs/canvas';

export type Point = BasePoint;

type Options = {
  // 拼图
  /**
   * 拼图描边宽度。
   * @default 1
   */
  borderWidth?: number;
  /**
   * 拼图描边颜色。
   * @default rgba(255,255,255,0.7)
   */
  borderColor?: string;
  /**
   * 拼图填充颜色。
   * @default rgba(255,255,255,0.7)
   */
  fillColor?: string;
  /**
   * 拼图点，不传默认随机`2` `3` `4`。
   */
  points?: NonNullable<Parameters<typeof drawPuzzle>[1]>['points'];
  /**
   * 拼图宽度。
   * @default 60
   */
  width?: number;
  /**
   * 拼图高度。
   * @default 60
   */
  height?: number;
  /**
   * 拼图 x 轴偏移值，如果不传内部随机生成。
   */
  x?: number;
  /**
   * 拼图 y 轴偏移值，如果不传内部随机生成。
   */
  y?: number;
  /**
   * 拼图上下左右留白。
   * @default 2
   */
  margin?: number;
  /**
   * 拼图等高。如果值为 `true`，拼图高度与图片高度相等，`y` 轴偏移值为 `0`。
   * @default true
   */
  equalHeight?: boolean;
  /**
   * 拼图图片格式，支持 `png` `webp` `avif`。
   * @default 'png'
   */
  format?: 'webp' | 'png' | 'avif';
  /**
   * 拼图图片质量，仅作用于 `webp` 图片格式。
   * @default 80
   */
  quality?: number;
  /**
   * 拼图 `avif` 配置，仅作用于 `avif` 图片格式。
   */
  avifConfig?: AvifConfig;

  // 背景图
  /**
   * 背景图宽度。默认图片宽度。
   */
  bgWidth?: number;
  /**
   * 背景图高度。默认图片高度。
   */
  bgHeight?: number;
  /**
   * 背景图偏移值，对应 `x`、`y` 轴偏移值。
   * @default [0,0]
   */
  bgOffset?: [number, number];
  /**
   * 背景图格式，支持 `jpeg` `png` `webp` `avif`。
   * @default 'jpeg'
   */
  bgFormat?: 'webp' | 'jpeg' | 'png' | 'avif';
  /**
   * 背景图质量，仅作用于 `webp` 或 `jpeg` 图片格式。如果不传，默认 `quality` 值。
   */
  bgQuality?: number;
  /**
   * 背景图 `avif` 配置，仅作用于 `avif` 图片格式。如果不传，默认 `avifConfig` 值。
   */
  bgAvifConfig?: AvifConfig;
};

type InputType = Parameters<typeof loadImage>[0];

/**
 * 创建拼图。
 *
 * @param input 图片地址或 Buffer 或 Stream
 * @param options 配置项
 * @returns 背景图和拼图 Buffer ，以及 `x`、`y` 轴偏移值
 */
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
