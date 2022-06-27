//送信先の処理
function pushMessage() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const index = findUser();

  // 誕生日が無い場合は早期リターン
  if (index === -1) {
    return;
  }

  const person = sheet.getRange(index + 1, 1).getValue();
  const to = sheet.getRange(index + 1, 5).getValue();
  const year = new Date().getFullYear();
  let theYear = sheet.getRange(index + 1, 2).getValue();
  let message = "今日は";
  let age;

  if (theYear) {
    age = year - theYear;
    message += `${person}さんの${age}歳の誕生日です！`;
  } else {
    message += `${person}さんの誕生日です！`;
  }

  //メッセージ送信処理
  return push(message, to);
}

function findUser() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();

  // 比較するときの様式を合わせる
  const birthdaysList = values.map((row) => {
    return `${row[2]}/${row[3]}`;
  });

  // 比較するときの様式を合わせる
  const today = new Date();
  const hour = today.getHours();
  const month = today.getMonth();
  const date = today.getDate();
  // timeZoneをAsia/Tokyoに変更
  const theDay = `${month + 1}/${date}`;

  // 記述方法がこれでないと動かないっぽい
  const BirthdayIndex = birthdaysList.findIndex((el) => el == theDay);

  // デバッグ用
  // const BirthdayIndex = birthdaysList.reduce((accu, curr) => {
  //   return `${accu}\n${curr}`;
  // }, theDay);

  return BirthdayIndex;
}

//PushMessageの作成
function push(message, to) {
  var headers = {
    "Content-Type": "application/json; charset=UTF-8",
    Authorization: "Bearer " + ACCESS_TOKEN
  };
  var postData = {
    to: to,
    messages: [
      {
        type: "text",
        text: "Today is your friend's Birthday!!"
      },
      {
        type: "text",
        text: message
      }
    ]
  };
  var options = {
    method: "post",
    headers: headers,
    payload: JSON.stringify(postData)
  };
  return UrlFetchApp.fetch(url, options);
}
