# Escape From Tarkov & Interactive Map

### Opensource Version. 1.0.0

Copyright 2022-2024, TiltySola.

![预览图片](https://github.com/tiltysola/tarkov-tilty-frontend-opensource/blob/master/git/tarkov-tilty-frontend-opensource.png?raw=true)

### Installation scripts


```
$ npm i
```

### run server

```
node server.js
```

### Development mode

```
$ npm run dev
```

### Build scripts

```
$ npm run build
```

## 基于 https://github.com/tiltysola/tarkov-tilty-frontend-opensource

使用nodejs 监听本地文件变化，通过websocket传递文件名给前端，并在传输文件名后自动删除截图，避免过多的硬盘占用。

前端使用window.interactUpdateLocation 对文件名进行解析并显示在canvas上，通过three 分析角度，实现 user local 朝向功能。

将部分svg保存至本地，减少数据访问。

启动server.js 后 即可开始监听

