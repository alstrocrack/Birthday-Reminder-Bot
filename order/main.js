var SHEET_ID = '**********';
var SHEET_NAME = 'data';

//アクセストークン
var ACCESS_TOKEN = '***********';
// 応答メッセージURL
var REPLY = "https://api.line.me/v2/bot/message/reply";

function doPost(e) {

    //メッセージ受信
    var data = JSON.parse(e.postData.contents).events[0];
    //ユーザーID取得
    var lineUserId = data.source.userId;
    //リプレイトークン取得
    var replyToken = data.replyToken;
    //送信されたメッセージ取得
    var postMsg = data.message.text;
    //順番待ちがあるかの確認
    var UserData = findUser(lineUserId);

    if (typeof UserData === "undefined") {
    //順番待ちがなかった場合の処理
        if (postMsg === '予約') {
            var userName = getUserDisplayName(lineUserId);
            var userIMG = getUserDisplayIMG(lineUserId);
            flexMessage(replyToken, userName, userIMG);
            userlog(lineUserId);
        }else{
            sendMessage(replyToken, '「予約」と送信ください。');
        }
    }else{
        //順番待ち登録があった場合の処理
        if (postMsg === '順番') {
            var spread = SpreadsheetApp.getActiveSpreadsheet() ;
            var sheet = spread.getSheets()[0] ;
            var textFinder = sheet.createTextFinder(lineUserId);
            var ranges = textFinder.findAll();
            sendMessage(replyToken, UserData+"さんは「"+ranges[0].getRow()+'」番目です');
        }else{
            sendMessage(replyToken, UserData+"さんはすでに順番待ちです。\n「順番」と送信すると順番がわかります。");
        }
    }
    debug(postMsg, lineUserId);
}

//ユーザー検索
function findUser(uid) {
    return getUserData().reduce(
        function(uuid, row) { 
            return uuid || (row.key === uid && row.value); 
        }, false) 
    || undefined;
}
//ユーザー検索
function getUserData() {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    var data = sheet.getDataRange().getValues();
    var d = 0;
    return data.map(function(row) { return {key: row[0], value: row[1]}; });
}

//テキストreplyメッセージ
function sendMessage(replyToken, replyText) {
    var postData = {
        "replyToken" : replyToken,
        "messages" : [
        {
            "type" : "text",
            "text" : replyText
        }
        ]
    };
    return postMessage(postData);
}

//JSON形式データをPOST
function postMessage(postData) {
    var headers = {
        "Content-Type" : "application/json; charset=UTF-8",
        "Authorization" : "Bearer " + ACCESS_TOKEN
    };
    var options = {
        "method" : "POST",
        "headers" : headers,
        "payload" : JSON.stringify(postData)
    };
    return UrlFetchApp.fetch(REPLY, options);
}

//ユーザーのプロフィール名取得
function getUserDisplayName(userId) {
    var url = 'https://api.line.me/v2/bot/profile/' + userId;
    var userProfile = UrlFetchApp.fetch(url,{
        'headers': {
        'Authorization' : 'Bearer ' + ACCESS_TOKEN,
    },
    })
    return JSON.parse(userProfile).displayName;
}

//ユーザーのプロフィール画像取得
function getUserDisplayIMG(userId) {
    var url = 'https://api.line.me/v2/bot/profile/' + userId;
    var userProfile = UrlFetchApp.fetch(url,{
        'headers': {
        'Authorization' : 'Bearer ' + ACCESS_TOKEN,
    },
    })
    return JSON.parse(userProfile).pictureUrl;
}

//デバック記録
function debug(text, userId) {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('debug');
    var date = new Date();
    var userName = getUserDisplayName(userId);
    sheet.appendRow([userId, userName, text, Utilities.formatDate( date, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss')]);
}

//ユーザー登録（順番待ち登録）
function userlog(userId) {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    var date = new Date();
    var userName = getUserDisplayName(userId);
    var userIMG = getUserDisplayIMG(userId);
    sheet.appendRow([userId, userName, userIMG, Utilities.formatDate( date, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss')]);
}

function flexMessage(replyToken, userName, userIMG) {
// replyするメッセージの定義
    var postData = {
        "replyToken" : replyToken,
        "messages" : [
            {
                "type": "flex",
                "altText": "Flex Message",
                "contents": {
                    "type": "bubble",
                    "hero": {
                        "type": "image",
                        "url": userIMG,
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
                                "text": userName+"さん",
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
                                "text": "順番待ちを受付けました。",
                                "flex": 0,
                                "margin": "md",
                                "size": "md",
                                "color": "#000000"
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
                        "type": "message",
                        "label": "順番待ち確認",
                        "text": "順番"
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
    return postMessage(postData);
}
