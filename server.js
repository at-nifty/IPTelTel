const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let offer = null;
let candidate = null;

// オファーを保存・取得
app.post("/offer", (req, res) => {
    offer = req.body;
    res.send("Offer received");
});
app.get("/offer", (req, res) => {
    res.json(offer);
});

// ICE候補を保存・取得
app.post("/candidate", (req, res) => {
    candidate = req.body;
    res.send("Candidate received");
});
app.get("/candidate", (req, res) => {
    res.json(candidate);
});

// サーバー起動
app.listen(8080, () => {
    console.log("シグナリングサーバーがポート8080で待機中...");
});
