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

//送信したユーザー先のユーザーを検索
    var sheet = SpreadsheetApp.openById(ID).getSheetByName(NAME);
    var textFinder = sheet.createTextFinder(to);
    var ranges = textFinder.findAll();

    if(ranges[0]){
        //送信完了時メッセージ（デバック記録用）
        // debug('送信完了しました。',to);
    }else{
        //送信済みメッセージ（デバック記録用）
        // debug('すでに送信済みです',to);
    }

    //送信ユーザーを順番待ちから削除
    // sheet.deleteRows(ranges[0].getRow());

    //メッセージ送信処理
    return push();

}

//FlexMessageの作成
function push() {

    var url = "https://api.line.me/v2/bot/message/push";
    var headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + ACCESS_TOKEN,
    };
    var postData = {
    "to" : to,
    "messages" : [{
      'type' : 'text',
      'text' : 'HELLO'
    }],
    };
    var options = {
    "method" : "post",
    "headers" : headers,
    "payload" : JSON.stringify(postData)
    };
    return UrlFetchApp.fetch(url, options);
}