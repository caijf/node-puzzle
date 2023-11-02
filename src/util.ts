import https from 'https';
import http from 'http';
import fs, { ReadStream } from 'fs';
import { Duplex } from 'stream';

const mathPI = Math.PI;

// 拼图点
export enum Point {
  None, // 没有
  Outer, // 外部
  Inner // 内部
}
export const pointArray = [Point.None, Point.Outer, Point.Inner];

// 获取随机整数，大于等于0，小于max
export function getRandomInt(max: number, min = 0) {
  return Math.max(Math.floor(Math.random() * max), min);
}

// 随机选择数组中的某一项
function pick<T = any>(arr: T[]) {
  const len = arr.length;
  const randomIndex = getRandomInt(len);
  return arr[randomIndex];
}

// 获取随机拼图点
export function getRandomPoints(pointNum?: 2 | 3 | 4) {
  const points = {
    top: pick(pointArray),
    right: pick(pointArray),
    bottom: pick(pointArray),
    left: pick(pointArray)
  };
  type PointKey = keyof typeof points;
  const pointsKeys = Object.keys(points) as PointKey[];
  const verticalDirs = ['top', 'bottom'] as PointKey[];
  const horizontalDirs = ['left', 'right'] as PointKey[];

  console.log('default points: ', points);

  // 保证上下 和 左右 都必须有一个外部的拼图点
  if (points.top === Point.Outer && points.bottom === Point.Outer) {
    points[pick(verticalDirs)] = Point.Inner;
  } else if (points.top !== Point.Outer && points.bottom !== Point.Outer) {
    points[pick(verticalDirs)] = Point.Outer;
  }
  if (points.left === Point.Outer && points.right === Point.Outer) {
    points[pick(horizontalDirs)] = Point.Inner;
  } else if (points.left !== Point.Outer && points.right !== Point.Outer) {
    points[pick(horizontalDirs)] = Point.Outer;
  }

  if (pointNum) {
    const inners: PointKey[] = [];
    const nones: PointKey[] = [];
    pointsKeys.forEach((item) => {
      if (points[item] === Point.Inner) {
        inners.push(item);
      } else if (points[item] === Point.None) {
        nones.push(item);
      }
    });

    if (pointNum === 2) {
      inners.forEach((item) => (points[item] = Point.None));
    } else if (pointNum === 3) {
      if (inners.length === 0) {
        points[pick(nones)] = Point.Inner;
      } else if (inners.length === 2) {
        points[pick(inners)] = Point.None;
      }
    } else if (pointNum == 4) {
      nones.forEach((item) => (points[item] = Point.Inner));
    }
  }

  console.log('after points: ', points);
  return points;
}

// 画拼图
export function drawPuzzle(
  ctx: CanvasRenderingContext2D,
  options: {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    points?:
      | 2
      | 3
      | 4
      | {
          // 拼图点
          top: Point;
          right: Point;
          bottom: Point;
          left: Point;
        };
    margin?: number; // 外部留白
  } = {}
) {
  const { x = 0, y = 0, w = 60, h = 60 } = options;
  let { points, margin = 0 } = options;

  margin = margin <= 0 ? 0 : margin;

  if (typeof points === 'number' || !points) {
    points = getRandomPoints(points);
  }

  console.log(points);

  const r = (Math.min(w, h) - margin * 2) * 0.15; // 适合拼图点的比例 0.15
  const l = Math.hypot(r, r); // 斜边长度
  const l1_2 = l / 2; // 斜边长度一半，45度角直角三角形，邻边相等
  const c2r = r + l1_2; // 圆直径

  const rect = {
    x: x + margin,
    y: y + margin,
    w: w - c2r - margin * 2,
    h: h - c2r - margin * 2
  };
  const w1_2 = rect.w / 2; // 矩形一半宽度
  const h1_2 = rect.h / 2; // 矩形一半高度

  if (points.left === Point.Outer) {
    rect.x += c2r;
  }
  if (points.top === Point.Outer) {
    rect.y += c2r;
  }

  ctx.lineWidth = 2;

  // draw start
  ctx.beginPath();

  ctx.moveTo(rect.x, rect.y);
  // console.log('move to coord, x: ', rect.x, ' y: ', rect.y);

  // top
  if (points.top !== Point.None) {
    ctx.lineTo(rect.x + w1_2 - l1_2, rect.y);
    // console.log('line to coord, x: ', rect.x + w1_2 - l1_2, ' y: ', rect.y);
    if (points.top === Point.Inner) {
      ctx.arc(rect.x + w1_2, rect.y + l1_2, r, 1.25 * mathPI, 1.75 * mathPI, true);
    } else {
      ctx.arc(rect.x + w1_2, rect.y - l1_2, r, 0.75 * mathPI, 0.25 * mathPI);
    }
  }

  ctx.lineTo(rect.x + rect.w, rect.y);
  // console.log('line to coord, x: ', rect.x + rect.w, ' y: ', rect.y);

  // right
  if (points.right !== Point.None) {
    ctx.lineTo(rect.x + rect.w, rect.y + h1_2 - l1_2);
    // console.log('line to coord, x: ', rect.x + rect.w, ' y: ', rect.y + h1_2 - l1_2);
    if (points.right === Point.Inner) {
      ctx.arc(rect.x + rect.w - l1_2, rect.y + h1_2, r, 1.75 * mathPI, 0.25 * mathPI, true);
    } else {
      ctx.arc(rect.x + rect.w + l1_2, rect.y + h1_2, r, 1.25 * mathPI, 0.75 * mathPI);
    }
  }

  ctx.lineTo(rect.x + rect.w, rect.y + rect.h);
  // console.log('line to coord, x: ', rect.x + rect.w, ' y: ', rect.y + rect.h);

  // bottom
  if (points.bottom !== Point.None) {
    ctx.lineTo(rect.x + w1_2 + l1_2, rect.y + rect.h);
    // console.log('line to coord, x: ', rect.x + w1_2 + l1_2, ' y: ', rect.y + rect.h);
    if (points.bottom === Point.Inner) {
      ctx.arc(rect.x + w1_2, rect.y + rect.h - l1_2, r, 0.25 * mathPI, 0.75 * mathPI, true);
    } else {
      ctx.arc(rect.x + w1_2, rect.y + rect.h + l1_2, r, 1.75 * mathPI, 1.25 * mathPI);
    }
  }

  ctx.lineTo(rect.x, rect.y + rect.h);
  // console.log('line to coord, x: ', rect.x, ' y: ', rect.y + rect.h);

  // left
  if (points.left !== Point.None) {
    ctx.lineTo(rect.x, rect.y + h1_2 + l1_2);
    // console.log('line to coord, x: ', rect.x, ' y: ', rect.y + h1_2 + l1_2);
    if (points.left === Point.Inner) {
      ctx.arc(rect.x + l1_2, rect.y + h1_2, r, 0.75 * mathPI, 1.25 * mathPI, true);
    } else {
      ctx.arc(rect.x - l1_2, rect.y + h1_2, r, 0.25 * mathPI, 1.75 * mathPI);
    }
  }

  ctx.lineTo(rect.x, rect.y);
  // console.log('line to coord, x: ', rect.x, ' y: ', rect.y);

  // ctx.strokeStyle = 'red';
  ctx.stroke();

  // ctx.closePath();

  // ctx.fillStyle = "red";
  // ctx.fill();

  // ctx.strokeRect(x, y, w, h);
}

export function streamToBuffer(stream: ReadStream) {
  return new Promise<Buffer>((resolve, reject) => {
    const buffers: any[] = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
}

export function bufferToStream(buffer: Buffer) {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export function getImageBuffer(input: string | Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    if (typeof input !== 'string') {
      resolve(input);
      return;
    }

    // http 或 https 图片地址
    const client =
      input.indexOf('https') === 0 ? https : input.indexOf('http') === 0 ? http : undefined;
    if (client) {
      client.get(input, (res) => {
        const chunks: any[] = [];
        res.on('error', reject);
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
      });
    } else {
      // 本地路径
      const stream = fs.createReadStream(input);
      streamToBuffer(stream)
        .then((buffer) => {
          resolve(buffer);
        })
        .catch(reject);
    }
  });
}
