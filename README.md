# node-puzzle

[![npm][npm]][npm-url] ![GitHub](https://img.shields.io/github/license/caijf/node-puzzle.svg)

Node.js 生成滑块验证码的拼图和背景图。

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

// 第一个参数是图片地址，支持本地路径和远程地址
// 第二个参数是处理后的背景图和拼图写入流（如写入到路径）
createPuzzle('./sunflower.jpg', {
  bg: fs.createWriteStream('bg.jpg'),
  puzzle: fs.createWriteStream('puzzle.png')
}).then((res) => {
  // 背景图和拼图处理完成后，返回中包含拼图 x 轴和 y 轴偏移值
  console.log(res); // { x: 229, y: 0 }
});
```

输入图片：

`sunflower.jpg`

![origin](./docs/sunflower.jpg)

▼▼▼

生成背景图和拼图保存到本地：

`bg.jpg`

![bg](./docs/bg.jpg)

`puzzle.png`

![puzzle](./docs/puzzle.png)

▼▼▼

异步返回 `{ x: 229, y: 0 }` 。

## API

```typescript
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
  equalHeight?: boolean; // 等高。默认 true

  // 背景图
  bgWidth?: number; // 背景图宽度。默认 图片宽度
  bgHeight?: number; // 背景图高度。默认 图片高度
  bgOffset?: [number, number]; // 背景图偏移值。 默认 [0,0]

  // 导出配置
  bgImageType?: 'png' | 'jpeg'; // 背景图导出类型。默认 jpeg
  quality?: number; // 导出图片质量，仅作用于 `jepg` 图片。默认 80 。
  pngOptions?: Parameters<typeof PImage.encodePNGToStream>[2]; // 导出 png 图片配置，仅作用于 `png` 图片。
};

type createPuzzle = (
  input: string | Buffer,
  output: Output,
  options: Options = {}
) => Promise<{ x: number; y: number }>;
```

## 常见问题

### 控制台警告信息 `“can't project the same paths 1 [ 'l', t { x: 44, y: 16 } ] t { x: 44, y: 16 } t { x: 44, y: 16 }”`

> 参考：<https://github.com/joshmarinacci/node-pureimage/issues/98#issuecomment-901297418>

可以忽略该警告。

## 感谢

- [node-pureimage](https://github.com/joshmarinacci/node-pureimage)
- [image-size](https://github.com/image-size/image-size)

[npm]: https://img.shields.io/npm/v/node-puzzle.svg
[npm-url]: https://npmjs.com/package/node-puzzle
