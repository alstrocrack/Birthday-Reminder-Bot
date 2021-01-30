/////////////////// 送信先のuserID/////////////////
////////////（ここで入力したIDに送信されます)//////////

var to = "*************";

///////////////////////////////////////////////////
///////////////////////////////////////////////////

//アクセストークン
var ACCESS_TOKEN = "*********";
//スプレッドシート情報
var SHEET_ID = '************';
var SHEET_NAME = 'data';

//送信先の処理
function pushMessage() {

//送信したユーザー先のユーザーを検索
var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
var textFinder = sheet.createTextFinder(to);
var ranges = textFinder.findAll();

if(ranges[0]){
//送信完了時メッセージ（デバック記録用）
debug('送信完了しました。',to);
}else{
//送信済みメッセージ（デバック記録用）
debug('すでに送信済みです',to);
}

//送信ユーザーを順番待ちから削除
sheet.deleteRows(ranges[0].getRow());

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
"messages" : [
{
"type": "flex",
"altText": "順番が来ました。",
"contents": {
"type": "bubble",
"hero": {
"type": "image",
"url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
"size": "full",
"aspectRatio": "20:13",
"aspectMode": "cover",
"action": {
"type": "uri",
"label": "Line",
"uri": "https://linecorp.com/"
}
},
"body": {
"type": "box",
"layout": "vertical",
"contents": [
{
"type": "text",
"text": "順番になりました",
"size": "xl",
"weight": "bold"
},
{
"type": "box",
"layout": "baseline",
"margin": "md",
"contents": [
{
"type": "text",
"text": "＊＊＊分以内にお越しください。",
"flex": 0,
"margin": "md",
"size": "sm",
"color": "#F60404"
}
]
},
{
"type": "box",
"layout": "vertical",
"spacing": "sm",
"margin": "lg",
"contents": [
{
"type": "box",
"layout": "baseline",
"spacing": "sm",
"contents": [
{
"type": "text",
"text": "Place",
"flex": 1,
"size": "sm",
"color": "#AAAAAA"
},
{
"type": "text",
"text": "Miraina Tower, 4-1-6 Shinjuku, Tokyo",
"flex": 5,
"size": "sm",
"color": "#666666",
"wrap": true
}
]
},
{
"type": "box",
"layout": "baseline",
"spacing": "sm",
"contents": [
{
"type": "text",
"text": "Time",
"flex": 1,
"size": "sm",
"color": "#AAAAAA"
},
{
"type": "text",
"text": "10:00 - 23:00",
"flex": 5,
"size": "sm",
"color": "#666666",
"wrap": true
}
]
}
]
}
]
},
"footer": {
"type": "box",
"layout": "vertical",
"flex": 0,
"spacing": "sm",
"contents": [
{
"type": "button",
"action": {
"type": "uri",
"label": "CALL",
"uri": "https://linecorp.com"
},
"height": "sm",
"style": "link"
},
{
"type": "button",
"action": {
"type": "uri",
"label": "WEBSITE",
"uri": "https://linecorp.com"
},
"height": "sm",
"style": "link"
},
{
"type": "spacer",
"size": "sm"
}
]
}
}
}
]
};

var options = {
"method" : "post",
"headers" : headers,
"payload" : JSON.stringify(postData)
};

return UrlFetchApp.fetch(url, options);
}
