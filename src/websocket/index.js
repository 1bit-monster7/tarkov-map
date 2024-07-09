let heartbeatInterval = null;

const createWebSocket = () => {
  const wsUrl = `ws://${import.meta.env.VITE_APP_IPV4}:8889`;

  console.log(wsUrl, '准备开始链接 websocket WebSocket URL');

  if (window.websocket) {
    console.log('检测到已存在的链接，先关闭。');
    window.websocket.close();
  }

  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('WebSocket 链接开始');


    if (!heartbeatInterval) {
      heartbeatInterval = setInterval(() => {
        console.log('当前 WebSocket 实例:', ws);
        console.log('当前 WebSocket 状态:', ws.readyState);
        if (ws.readyState === WebSocket.OPEN) {
          console.log('浏览器向服务器发送心跳包');
          ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000); // 每30秒发送一次心跳包
    }
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.event === 'add') {
      const { fileName } = data;
      window.interactUpdateLocation(fileName);
    } else if (data.type === 'pong') {
      console.log('客户端收到心跳包响应');
    }
  };

  ws.onerror = (error) => {
    console.error('发现WebSocket 错误 立刻准备重新链接:', error);
    createWebSocket() // 只要发现链接关闭 立刻重连
  };

  ws.onclose = () => {
    console.log('WebSocket 连接已关闭');
  };

  window.websocket = ws;
};

createWebSocket();
