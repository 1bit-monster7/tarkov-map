const { app, BrowserWindow, ipcMain,Menu,screen } = require('electron');

const path = require('path');
const chokidar = require('chokidar');
const WebSocket = require('ws');
const fs = require('fs');
const fsPromises = require('fs').promises;
require('dotenv').config();
let win;
let wss;
let watcher;


function createWindow() {
    win = new BrowserWindow({
        width: 600,
        height: 600,
        x:0,
        y:0,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        alwaysOnTop: true,
        closable : true, // 允许关闭
        autoHideMenuBar:true,
        resizable: true,
        skipTaskbar:true,
        acceptFirstMouse:true,
        titleBarStyle:'hidden-inset'
    });

    win.loadURL(`file://${__dirname}/dist/index.html`);


    win.once('ready-to-show', () => {
        win.show()
    })

    win.on('close',()=>{
        app.quit()
        app.exit()
    })

    // 示例：最小化窗口
    ipcMain.handle('win_exit', () => {
        if (win) {
            app.quit()
            app.exit()
        }
    });

    ipcMain.handle('toggle_always_on_top', (event, value) => {
        if (win) {
            if(value){
                // 获取屏幕信息
                const { width, height } = screen.getPrimaryDisplay().workAreaSize;
                win.setOpacity(1);
                win.setAlwaysOnTop(true);
                win.setMinimumSize(240, 240);
                win.setSize(420, 600);
                win.setPosition(width - 420, 0);
            }else{
                win.setOpacity(1);
                win.setAlwaysOnTop(false);
            }
            win.setAlwaysOnTop(value); // 设置窗口置顶状态
        }
    });
}

app.on('ready', () => {
    wss = new WebSocket.Server({ port: 8889 });

    wss.on('connection', (ws) => {
        // console.log('新的浏览器连接');
        ws.isAlive = true;
        ws.on('pong', () => {
            ws.isAlive = true;
        });
        ws.on('close', () => {
            // console.log('与浏览器断开连接');
        });
        ws.on('message', (message) => {
            const data = JSON.parse(message);
            if (data.type === 'ping') {
                // console.log('收到浏览器给服务器的心跳包');
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
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
