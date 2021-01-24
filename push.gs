const to = 'Uad6b8ca26735335be5479d95638f38ba';

const ACCESS_TOKEN = 'KjfpEWZUjJfHTMzQMUBmkJ/nIrVFCOCi1NnZKZ4YuOzKGa/IkX/9TK/IyaHEuTDdaJ/zIhyT0kWLvBdHBoGdC/q9azEs6PcaJuPIxYk0YQL1u7vW+dyBd0DFnuf6dnR1KCbIVaXIFKJJcNmmhyjkKQdB04t89/1O/w1cDnyilFU=';
const SHEET_ID = '1QR-HT2L1RQenVHeR4y1V9cJm7q18nOQqwSZPtDi3UKY'
const SHEET_NAME = 'birthdays';

function pushMessage() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  // 日本時間を取得 2021/1/24
  const date = new Date().toLocaleDateString();
  // 1/24
  const adjustedDate = date.slice(5);

  if(checkBirthdays(adjustedDate) !== -1) {
    return push(checkBirthdays(adjustedDate));
  }
}

function checkBirthdays(birthday) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  const birthdaysList = [];

  // 初期値に-1を入れておく、-1がそのまま返ってきたら該当するユーザーはいなかったよいうこと
  let birthdayIndex = -1;

  // birthdaysListに全ての名前を入れていく
  for(let i = 0; i < values.length; i++) {
    birthdaysList.push(values[i][1]);
  }
  
  // 　一つずつnameとマッチするか確かめていく
  birthdaysList.forEach((e, i )=> {
    if(e == birthday) {
      birthdayIndex = i;
      return;
    }
    return;
  });

  // 誕生日に該当する人の名前を返す
  return values[birthdayIndex][0];
}

// pushメッセージの送信
function push() {
    var url = "https://api.line.me/v2/bot/message/push";
    var headers = {
      "Content-Type" : "application/json; charset=UTF-8",
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    };
    var postData = {};

    var options = {
    "method" : "post",
    "headers" : headers,
    "payload" : JSON.stringify(postData)
    };

    return UrlFetchApp.fetch(url, options);
}
