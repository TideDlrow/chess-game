import Message from 'element-ui/packages/message/src/main'

const baseUrl = "ws://localhost:8818/socket/"
/**
 *
 * @param {string} token
 * @return {WebSocket}
 * @constructor
 */
export const PVPWebsocket = function (token){
  return new WebSocket(baseUrl+token)
}
/**
 * 发送消息
 * @param {WebSocket} websocket
 * @param {string} message
 */
export const sendMessageByWebsocket = function (websocket,message){
  const state = websocket.readyState;
  switch (state) {
    case WebSocket.CONNECTING:
      Message.error("正在连接中，稍后再试...");
      break;
    case WebSocket.OPEN:
      websocket.send(message);
      break;
    case WebSocket.CLOSING:
      Message.error("连接正在关闭，消息发送失败！！");
      break;
    case WebSocket.CLOSED:
      Message.error("连接已关闭！！");
      break;
  }
}
