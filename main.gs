const CHANNEL_ACCESS_TOKEN = 'KjfpEWZUjJfHTMzQMUBmkJ/nIrVFCOCi1NnZKZ4YuOzKGa/IkX/9TK/IyaHEuTDdaJ/zIhyT0kWLvBdHBoGdC/q9azEs6PcaJuPIxYk0YQL1u7vW+dyBd0DFnuf6dnR1KCbIVaXIFKJJcNmmhyjkKQdB04t89/1O/w1cDnyilFU=';
const URL = 'https://api.line.me/v2/bot/message/reply';
const dateExp = /^1?\d\/[123]\d$/;

//doPost関数（Lineからメッセージを受け取る）
function doPost(e) {
  //メッセージ受信
  const data = JSON.parse(e.postData.contents).events[0];
  //ユーザーID取得
  const lineUserId = data.source.userId;
  //リプレイトークン取得
  const replyToken= data.replyToken;
  //送信されたメッセージ取得
  const postMsg = data.message.text;
  //順番待ちがあるかの確認
  // const UserData = findUser(lineUserId);

  // リプライトークンが無かったら処理を止める
  if(typeof replyToken === 'undefined') {
    return;
  }

  // キャッシュを設定
  const cache = CacheService.getScriptCache();
  let type = cache.get("type");

  if(type === null) {
    if(postMsg === '誕生日の追加') {
      cache.put('type', 1);
      reply(replyToken, '追加する人の名前を入力してください');
    } else if(postMsg === '誕生日の削除'){
      cache.put('type', 3);
      reply(replyToken, '削除する人の名前を入力してください')
    } else if(postMsg === '誕生日の一覧'){
      // showBirthdaysList();
      reply(replyToken, '誕生日の一覧です');
    } else {
      reply(replyToken, '「誕生日の追加」、「誕生日の削除」、「誕生日の一覧」のいずれかを入力してください');
    }
  } else {
    // 処理途中で追加のキャンセル
    if(postMsg === 'キャンセル') {
      cache.remove('type');
      reply(replyToken, '誕生日の追加をキャンセルしました');
      return;
    }

    switch(type) {

      // 誕生日の追加処理
      case '1':
        cache.put('type', 2);
        cache.put('name', postMsg);
        reply(replyToken, '追加する誕生日を「12/20」の形式で入力してください');
        break;
      case '2':
        if(postMsg.match(dateExp)) {
          cache.put('date', postMsg);
          // addBirthday(cache.get('name'), cache.get('date'));
          reply(replyToken, `${cache.get('name')}さんの誕生日を${cache.get('date')}で登録しました`);
          cache.remove('type');
          cache.remove('name');
          cache.remove('date');
          break;
        } else {
          reply(replyToken, '正しく入力してください。「キャンセル」で処理を中止します');
          break;
        }

      // 誕生日の削除処理
      case '3':
      // deleteBirthday();
        reply(replyToken, '誕生日を削除しました');
        cache.remove('type');
        break;
    }
  }
}
  

function reply(replyToken, message) {
  UrlFetchApp.fetch(URL, {
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
