# node-puzzle

[![npm][npm]][npm-url] ![GitHub](https://img.shields.io/github/license/caijf/node-puzzle.svg)

Node.js 生成滑块验证码的拼图和背景图。

`v2` 使用 [@napi-rs/canvas] 实现，点击查看 [支持的系统和 Node.js 版本](https://github.com/Brooooooklyn/canvas?tab=readme-ov-file#support-matrix)。

## 安装

```shell
npm install node-puzzle
```

```shell
yarn add node-puzzle
```

```shell
pnpm add node-puzzle
```

## 使用

```typescript
import fs from 'fs';
import createPuzzle from 'node-puzzle';

// 第一个参数是图片地址，支持本地路径、远程地址、Buffer、Readable等
// 第二个参数配置项
createPuzzle('./sunflower.jpg').then((res) => {
  // 处理完成后，返回背景图、拼图和 `x`、`y` 轴偏移值
  console.log(res); // { bg: Buffer, puzzle: Buffer, x: 229, y: 0 }
  fs.writeFileSync('bg.jpg', res.bg);
  fs.writeFileSync('puzzle.jpg', res.puzzle);
});
```

输入图片：

`sunflower.jpg`

![input img](./docs/sunflower.jpg)

▼▼▼

异步返回 `{ bg: Buffer, puzzle: Buffer, x: 229, y: 0 }` 。

▼▼▼

背景图和拼图：

`bg.jpg`

![bg.jpg](./docs/bg.jpg)

`puzzle.png`

![puzzle.png](./docs/puzzle.png)

## API

```typescript
type createPuzzle = (
  input:
    | string
    | URL
    | ArrayBufferLike
    | Buffer<ArrayBufferLike>
    | Uint8Array<ArrayBufferLike>
    | Image
    | internal.Readable,
  options?: Options
) => Promise<{
  bg: Buffer;
  puzzle: Buffer;
  x: number;
  y: number;
}>;

// 配置项
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

export enum Point {
  None = 0,
  Outer = 1,
  Inner = 2
}
```

## 感谢

- [@napi-rs/canvas]

[npm]: https://img.shields.io/npm/v/node-puzzle.svg
[npm-url]: https://npmjs.com/package/node-puzzle
[@napi-rs/canvas]: https://github.com/Brooooooklyn/canvas
