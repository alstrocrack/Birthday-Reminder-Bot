//アクセストークン
var ACCESS_TOKEN = "KjfpEWZUjJfHTMzQMUBmkJ/nIrVFCOCi1NnZKZ4YuOzKGa/IkX/9TK/IyaHEuTDdaJ/zIhyT0kWLvBdHBoGdC/q9azEs6PcaJuPIxYk0YQL1u7vW+dyBd0DFnuf6dnR1KCbIVaXIFKJJcNmmhyjkKQdB04t89/1O/w1cDnyilFU=";

//送信先の処理
function pushMessage() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const index = findUser();

  // 誕生日が無い場合は早期リターン
  if(index === -1) {
    return push('誕生日はありません');
    // return;
  }

  const person = sheet.getRange(index + 1, 1).getValue();
  const to = sheet.getRange(index + 1, 5).getValue();
  const year = new Date().getFullYear();
  let theYear = sheet.getRange(index + 1, 2).getValue();
  let message = "今日は";
  let age;

  if(theYear) {
    age = year - theYear;
    message += `${person}さんの${age}歳の誕生日です`;
  } else {
    message += `${person}さんの誕生日です`;
  }

  //メッセージ送信処理
  return push(message, to);
}

function findUser() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();

  // 比較するときの様式を合わせる
  const birthdaysList = values.map( row => {
    return `${row[2]}/${row[3]}`;
  });

  // 比較するときの様式を合わせる
  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();
  const theDay = `${month + 1}/${date}`;

  // 記述方法がこれでないと動かないっぽい
  const BirthdayIndex = birthdaysList.findIndex((el) => el == theDay　);

  // デバッグ用
  // const BirthdayIndex = birthdaysList.reduce((accu, curr) => {
  //   return `${accu}\n${curr}`;
  // }, theDay);

  return BirthdayIndex;
}

//PushMessageの作成
function push(message, to) {

    var url = "https://api.line.me/v2/bot/message/push";
    var headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + ACCESS_TOKEN,
    };
    var postData = {
    "to" : to,
    "messages" : [{
      'type' : 'text',
      'text' : message,
    }],
    };
    var options = {
    "method" : "post",
    "headers" : headers,
    "payload" : JSON.stringify(postData)
    };
    return UrlFetchApp.fetch(url, options);
}