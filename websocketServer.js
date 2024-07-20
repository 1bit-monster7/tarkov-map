const WebSocket = require('ws');
require('dotenv').config();
let wss;
let watcher;

const chokidar = require('chokidar');
const { promises: fsPromises } = require('fs');
const path = require('path');
wss = new WebSocket.Server({ port: 8889 });

wss.on('connection', (ws) => {
  console.log('新的浏览器连接');
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });
  ws.on('close', () => {
    console.log('与浏览器断开连接');
  });
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'ping') {
      console.log('收到浏览器给服务器的心跳包');
      ws.isAlive = true;
      ws.send(JSON.stringify({ type: 'pong' }));
    }
  });
});

const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) {
      console.log('浏览器未响应，关闭连接');
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping(() => {});
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});

const directoryToWatch = process.env.VITE_APP_IMG_PATH;
watcher = chokidar.watch(directoryToWatch, {
  ignored: /(^|[\/\\])\../,
  persistent: true,
  ignoreInitial: true,
});

const deleteAllFilesInDirectory = async (directory) => {
  try {
    const files = await fsPromises.readdir(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      await fsPromises.unlink(filePath);
      console.log(`文件 ${file} 已被删除`);
    }
  } catch (err) {
    console.error(`删除目录中的文件时出错: ${err}`);
  }
};

watcher.on('add', async (filePath) => {
  const fileName = path.basename(filePath);
  console.log(`文件 ${fileName} 已被添加`);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event: 'add', fileName }));
    }
  });
  try {
    await deleteAllFilesInDirectory(directoryToWatch);
  } catch (err) {
    console.error(`删除文件时出错: ${err}`);
  }
});

watcher.on('error', error => {
  console.error(`监视器错误: ${error}`);
});

console.log('服务器正在8889端口运行');