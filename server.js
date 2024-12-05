const WebSocket = require("ws");

// プレイヤー情報を管理
let players = {};
let deck = [];

// デッキを作成する関数
function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  deck = [];
  for (let i = 1; i <= 7; i++) {
    for (let suit of suits) {
      deck.push({ value: i, suit });
    }
  }
  deck.sort(() => Math.random() - 0.5); // ランダムシャッフル
}

// サーバーを起動
const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("Server started on ws://localhost:8080");
});

// 接続時の処理
wss.on("connection", (ws) => {
  const playerId = `Player-${Object.keys(players).length + 1}`;
  players[playerId] = { ws, card: null };
  console.log(`${playerId} connected.`);

  // プレイヤーにカードを配布
  if (Object.keys(players).length === 4) {
    createDeck();
    Object.values(players).forEach((player) => {
      player.card = deck.pop();
      player.ws.send(JSON.stringify({ type: "start", card: player.card }));
    });
  }

  // メッセージ受信時の処理
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type === "swap") {
      const player = players[playerId];
      player.card = deck.pop();
      player.ws.send(JSON.stringify({ type: "newCard", card: player.card }));
    }
  });

  // 切断時の処理
  ws.on("close", () => {
    console.log(`${playerId} disconnected.`);
    delete players[playerId];
  });
});
