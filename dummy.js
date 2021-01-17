const CHANNEL_ACCESS_TOKEN = 'KjfpEWZUjJfHTMzQMUBmkJ/nIrVFCOCi1NnZKZ4YuOzKGa/IkX/9TK/IyaHEuTDdaJ/zIhyT0kWLvBdHBoGdC/q9azEs6PcaJuPIxYk0YQL1u7vW+dyBd0DFnuf6dnR1KCbIVaXIFKJJcNmmhyjkKQdB04t89/1O/w1cDnyilFU=';
const dateExp = /(\d+)\/(\d+)\s(\d+):(\d+)/;

//doPost関数（Lineからメッセージを受け取る）
function doPost(e) {
  GetMessage(e);
}

function GetMessage(e) {
  // メッセージ受信
  const data = JSON.parse(e.postData.contents).events[0];
  // ユーザーID取得
  const lineUserId = data.source.userId;
  // リプライトークン取得
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  // 送信されたメッセージ
  const postMessage = data.message.text;
  // シートに名前があるかの確認
  const UserData = findBirthday(lineUserId);
}
  

function reply(replyToken, message) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': message,
      }],
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}
