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
  fs.writeFileSync('puzzle.png', res.puzzle);
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
```

| 选项 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| borderWidth | 拼图描边宽度。 | `number` | `1` |
| borderColor | 拼图描边颜色。 | `string` | `'rgba(255,255,255,0.7)'` |
| fillColor | 拼图填充颜色。 | `string` | `'rgba(255,255,255,0.7)'` |
| points | 拼图点，不传默认随机`2` `3` `4`。 | `numer` | - |
| width | 拼图宽度。 | `number` | `60` |
| height | 拼图高度。 | `number` | `60` |
| x | 拼图 x 轴偏移值，如果不传内部随机生成。 | `number` | - |
| y | 拼图 y 轴偏移值，如果不传内部随机生成。 | `number` | - |
| margin | 拼图上下左右留白。 | `number` | `2` |
| equalHeight | 拼图等高。如果值为 `true`，拼图高度与图片高度相等，`y` 轴偏移值为 `0`。 | `boolean` | `true` |
| format | 拼图图片格式。 | `'png' \| 'webp' \| 'avif'` | `'png'` |
| quality | 拼图图片质量，仅作用于 `webp` 图片格式。 | `number` | `80` |
| avifConfig | 拼图 `avif` 配置，仅作用于 `avif` 图片格式。 | `AvifConfig` | - |
| bgWidth | 背景图宽度。默认图片宽度。 | `number` | - |
| bgHeight | 背景图高度。默认图片高度。 | `number` | - |
| bgOffset | 背景图偏移值，对应 `x`、`y` 轴偏移值。 | `number` | `[0, 0]` |
| bgFormat | 背景图格式。 | `'jpeg' \| 'png' \| 'webp' \| 'avif'` | `'jpeg'` |
| bgQuality | 背景图质量，仅作用于 `webp` 或 `jpeg` 图片格式。如果不传，默认 `quality` 值。 | `number` | - |
| bgAvifConfig | 背景图 `avif` 配置，仅作用于 `avif` 图片格式。如果不传，默认 `avifConfig` 值。 | `AvifConfig` | - |

## 感谢

- [@napi-rs/canvas]

[npm]: https://img.shields.io/npm/v/node-puzzle.svg
[npm-url]: https://npmjs.com/package/node-puzzle
[@napi-rs/canvas]: https://github.com/Brooooooklyn/canvas
