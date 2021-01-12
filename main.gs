const CHANNEL_ACCESS_TOKEN = 'aEXNw8CeJz0UgV0LB3NtmFaM6m9GVEcYLnvP5Jj1FOomxLtOrZryca2KeLnoqD2J4mHiZphopquqHbj5mruJv4bxku0z4V4OxMhQd6jhfeWtSqCLjpNn8/NK96FzJKP7PNImBHm/Nn8vSN7IdbjfqwdB04t89/1O/w1cDnyilFU=';
const dateExp = /^1?\d\/[123]\d$/;

function doPost(e){
  getMessage(e);
};

function getMessage(e) {
    const replyToken= JSON.parse(e.postData.contents).events[0].replyToken;

    if (typeof replyToken === 'undefined') {
      return;
    }

  let messageText = JSON.parse(e.postData.contents).events[0].message.text;
  const birthdays = {};
  const cache = CacheService.getScriptCache();
  let flow = cache.get("flow");

  if(flow === null) {
      if(messageText === '誕生日の追加') {
          cache.put("flow", 1);
          reply(replyToken, "追加する人を入力して下さい\n 追加をキャンセルする場合は途中で「キャンセル」と入力して下さい");
      } else if(messageText === '誕生日の削除') {
          cache.put("flow", 3);
          let list;
          while(birthdays.name) {
              list += birthdays.name + "\n";
          };
          reply(replyToken, "削除する人の誕生日を以下から選んでください \n" + list);
      } else {
          reply(replyToken, "「誕生日の追加」で誕生日を追加します \n 「誕生日の削除」で誕生日を削除します。");
      }
  } else {
      if(messageText === 'キャンセル') {
          cache.remove("flow");
          reply(replyToken, '誕生日の追加をキャンセルしました。');
          return;
      }

      switch(flow) {
        case "1":
            cache.put("flow", 2);
            // 一旦、キャッシュに入れておいて日付が決まったら一辺にオブジェクトへ格納する
            cache.put("name", messageText);
            // birthdays.name = messageText;
            reply(replyToken, "追加する誕生日を入力して下さい\n 12/20の形式で入力してください");
            break;
        case "2":
            if(messageText.match(dateExp)) {
                cache.remove("flow");
                cache.put("date", messageText);
                // birthdays.date = messageText;
                reply(replyToken, '誕生日が追加されました');
                break;
            } else {
                reply(replyToken, '正しい形式で入力してください');
                break;
            }
        case "3":
            cache.remove("flow");
            if(checkDelete(messageText)) {
                delete birthdays.messageText;
            } else {
                reply(replyToken, "見つかりませんでした \n 最初からやり直してください");
                cache.remove("flow");
            }
            reply(replyToken, "削除しました。");
            break;
      }
  }

}

function checkDelete(text, obj) {
    return obj.hasOwnProperty(text);
}

function reply(replyToken, message) {
    const url = 'https://api.line.me/v2/bot/message/reply';
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
