// 初期設定
const CHANNEL_ACCESS_TOKEN =
  "KjfpEWZUjJfHTMzQMUBmkJ/nIrVFCOCi1NnZKZ4YuOzKGa/IkX/9TK/IyaHEuTDdaJ/zIhyT0kWLvBdHBoGdC/q9azEs6PcaJuPIxYk0YQL1u7vW+dyBd0DFnuf6dnR1KCbIVaXIFKJJcNmmhyjkKQdB04t89/1O/w1cDnyilFU=";
const URL = "https://api.line.me/v2/bot/message/reply";
const SHEET_ID = "1QR-HT2L1RQenVHeR4y1V9cJm7q18nOQqwSZPtDi3UKY";
const SHEET_NAME = "birthdays";
const SPREAD = SpreadsheetApp.getActiveSpreadsheet();
const SHEET = SPREAD.getSheets()[0];
// 誕生年があるものとないもの
const dateExp = /1?\d\/[123]?\d/;
const dateExpYear = /[19|20]\d{2}\/1?\d\/[123]?\d/;

//doPost関数（Lineからメッセージを受け取る）
function doPost(e) {
  //メッセージ受信
  const data = JSON.parse(e.postData.contents).events[0];
  //ユーザーID取得
  const lineUserId = data.source.userId;
  //リプレイトークン取得
  const replyToken = data.replyToken;
  //送信されたメッセージ取得
  const postMsg = data.message.text;

  // リプライトークンが無かったら処理を止める
  if (typeof replyToken === "undefined") {
    return;
  }

  // キャッシュを設定
  const cache = CacheService.getScriptCache();
  let type = cache.get("type");

  // 処理を分ける
  if (type === null) {
    if (postMsg === "誕生日の追加") {
      cache.put("type", 1);
      reply(replyToken, "追加する人の名前を入力してください");
    } else if (postMsg === "誕生日の削除") {
      cache.put("type", 3);
      reply(replyToken, "削除する人の名前を入力してください");
    } else if (postMsg === "誕生日の一覧") {
      reply(replyToken, showBirthdaysList());
    } else {
      reply(
        replyToken,
        "「誕生日の追加」、「誕生日の削除」、「誕生日の一覧」のいずれかを入力してください"
      );
    }
  } else {
    // 処理途中で追加のキャンセル
    if (postMsg === "キャンセル") {
      cache.remove("type");
      reply(replyToken, "誕生日の追加をキャンセルしました");
      return;
    }

    switch (type) {
      // 誕生日の追加処理
      case "1":
        cache.put("type", 2);
        cache.put("name", postMsg);
        reply(
          replyToken,
          "追加する誕生日を「1996/12/20」の形式で入力してください \n 誕生年は無くても構いません"
        );
        break;
      case "2":
        if (postMsg.match(dateExp || dateExpYear)) {
          cache.put("date", postMsg);
          addBirthday(cache.get("name"), cache.get("date"), lineUserId);
          reply(replyToken, `${cache.get("name")}さんの誕生日を${cache.get("date")}で登録しました`);
          cache.remove("type");
          cache.remove("name");
          cache.remove("date");
          break;
        } else {
          reply(replyToken, "正しく入力してください。「キャンセル」で処理を中止します");
          break;
        }

      // 誕生日の削除処理
      case "3":
        if (checkName(postMsg) !== -1) {
          deleteBirthday(checkName(postMsg));
          reply(replyToken, `${postMsg}さんの誕生日を削除しました`);
          cache.remove("type");
          break;
        } else {
          reply(replyToken, `${postMsg}さんの誕生はありませんでした`);
          cache.remove("type");
          break;
        }
    }
  }
}

// 誕生日の追加
function addBirthday(name, date, lineUserId) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const splitedDate = date.split("/");
  let year, month, day;

  if (splitedDate.length === 3) {
    year = splitedDate[0];
    month = splitedDate[1];
    day = splitedDate[2];

    sheet.appendRow([name, year, month, day, lineUserId]);
  } else {
    year = "";
    month = splitedDate[0];
    day = splitedDate[1];

    sheet.appendRow([name, year, month, day, lineUserId]);
  }
}

// 誕生日の検索
function checkName(name) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  const nameList = [];
  // 初期値に-1を入れておく、-1がそのまま返ってきたら該当するユーザーはいなかったということ
  let nameIndex = -1;

  // nameListに全ての名前を入れていく
  for (let i = 0; i < values.length; i++) {
    nameList.push(values[i][0]);
  }

  // 一つずつnameとマッチするか確かめていく
  nameList.forEach((e, i) => {
    if (e == name) {
      nameIndex = i;
      return;
    }
    return;
  });

  return nameIndex;
}

// 誕生日の削除
function deleteBirthday(rowNumber) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  sheet.deleteRows(rowNumber + 1);
}

// 誕生日の一覧
function showBirthdaysList() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  const ranges = sheet.getRange(2, 1, values.length - 1, 4).getValues();

  // 返信用のフォーマットに変換する
  const dataList = ranges.reduce((list, item) => {
    if (item[1] === "") {
      return `${list}\n${item[0]} : ${item[2]}月${item[3]}日`;
    } else {
      return `${list}\n${item[0]} : ${item[1]}年${item[2]}月${item[3]}日`;
    }
  }, "名前 : 誕生日");

  return dataList;
}

// 返信機能
function reply(replyToken, message) {
  UrlFetchApp.fetch(URL, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + CHANNEL_ACCESS_TOKEN
    },
    method: "post",
    payload: JSON.stringify({
      replyToken: replyToken,
      messages: [
        {
          type: "text",
          text: message
        }
      ]
    })
  });
  return ContentService.createTextOutput(JSON.stringify({ content: "post ok" })).setMimeType(
    ContentService.MimeType.JSON
  );
}
