const ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => {
  document.getElementById("status").textContent = "ゲームに接続しました！";
};

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);

  if (data.type === "start") {
    document.getElementById("card").textContent = `カード: ${data.card.value}${data.card.suit}`;
    document.getElementById("swapButton").disabled = false;
  }

  if (data.type === "newCard") {
    document.getElementById("card").textContent = `新しいカード: ${data.card.value}${data.card.suit}`;
  }
};

document.getElementById("swapButton").addEventListener("click", () => {
  ws.send(JSON.stringify({ type: "swap" }));
});
