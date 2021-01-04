'use strict';

///Parameter///
let oneSecond = 1000 * 60;
let oneDay = oneSecond * 60 * 24;
let oneDayAgo = (new Date).getTime() - oneDay;
let query = {
    "text": '',
    "startTime": oneDayAgo,
    "maxResults": 20
}

function createMenus() {
    chrome.contextMenus.removeAll();
    var parent = chrome.contextMenus.create({
        id: "fast-url",
        "title": "快速檢視紀錄",
        "contexts": ['all'],
    });

    chrome.history.search(query, (histories) => {
        histories.forEach(element => {
            let child = {
                title: element.title ?? "empty",
                id: element.id,
                type: "normal",
                contexts: ["all"],
                parentId: parent
            }
            chrome.contextMenus.create(child);
        });
    })

    chrome.contextMenus.onClicked.addListener(urlClick);
}

function urlClick(info) {
    chrome.history.search(query, (histories) => {
        let click = histories.filter(history => history.id == info.menuItemId);
        let targetUrl = click[0].url;
        window.open(targetUrl);
        console.log(targetUrl)
    });
}
chrome.tabs.onCreated.addListener(createMenus)
chrome.tabs.onRemoved.addListener(createMenus)









