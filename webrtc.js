let peer;
let localStream;

// 音声ストリームの取得
async function getLocalStream() {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
}

// 通話開始6
async function startCall() {
    const targetIp = document.getElementById("targetIp").value;
    if (!targetIp) {
        alert("相手のIPアドレスを入力してください");
        return;
    }

    await getLocalStream();

    // WebRTC接続の作成
    peer = new RTCPeerConnection();

    // 自分の音声を追加
    peer.addStream(localStream);

    // ICE候補を取得（LAN内なのでSTUN/TURN不要）
    peer.onicecandidate = (event) => {
        if (event.candidate) {
            fetch(`http://${targetIp}:8080/candidate`, {
                method: "POST",
                body: JSON.stringify(event.candidate),
                headers: { "Content-Type": "application/json" }
            });
        }
    };

    // 相手の音声を受信
    peer.onaddstream = (event) => {
        document.getElementById("remoteAudio").srcObject = event.stream;
    };

    // オファーを作成して送信
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    fetch(`http://${targetIp}:8080/offer`, {
        method: "POST",
        body: JSON.stringify(offer),
        headers: { "Content-Type": "application/json" }
    });
}

// 通話終了
function endCall() {
    if (peer) {
        peer.close();
        peer = null;
    }
}
