/////////////////// 送信先のuserID/////////////////
////////////（ここで入力したIDに送信されます)//////////

var to = "U5a257a207126e910d9b304f2314ea4fc";

///////////////////////////////////////////////////
///////////////////////////////////////////////////

//アクセストークン
var ACCESS_TOKEN = "KjfpEWZUjJfHTMzQMUBmkJ/nIrVFCOCi1NnZKZ4YuOzKGa/IkX/9TK/IyaHEuTDdaJ/zIhyT0kWLvBdHBoGdC/q9azEs6PcaJuPIxYk0YQL1u7vW+dyBd0DFnuf6dnR1KCbIVaXIFKJJcNmmhyjkKQdB04t89/1O/w1cDnyilFU=";
//スプレッドシート情報
var ID = '1UvfoXcokXfyeaZIKC8nLTkrTqFeZbS555jIOZWEhKuU';
var NAME = 'data';

//送信先の処理
function pushMessage() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const index = findUser();

  // 誕生日が無い場合は早期リターン
  // if(index === -1) {
  //   return push('誕生日はありません');
  // }

  // const range = sheet.getRange(index, 1);
  // const value = range.getValue();

  // const message = `今日は${value}さんの誕生日です`;

  //メッセージ送信処理
  // return push(message);
  return push(index);
}

function findUser() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();

  const birthdaysList = [];
  for(let i = 0; i < values.length; i++) {
    birthdaysList.push(values[i][1]);
  }

  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();

  const theDay = `${month + 1}/${date}`;

  const BirthdayIndex = birthdaysList.findIndex(el => {
    el == theDay;
  });

  return BirthdayIndex;
}

//FlexMessageの作成
function push(message) {

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