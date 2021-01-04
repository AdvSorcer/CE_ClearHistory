'use strict';

 ///Parameter///
 let oneSecond = 1000 * 60;
 let Minute10 = oneSecond * 10;
 let oneHour = oneSecond * 60;
 let oneDay = oneSecond * 60 * 24;
 let microsecondsPerWeek = oneSecond * 60 * 24 * 7;
 let Minute10Ago = (new Date).getTime() - Minute10;
 let oneHourAgo = (new Date).getTime() - oneHour;
 let oneDayAgo = (new Date).getTime() - oneDay;
 let oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;


function createMenus() {
    chrome.contextMenus.removeAll();
    var parent = chrome.contextMenus.create({
        id: "fast-url",
        "title": "快速連結",
        "contexts": ['all'],
    });
   

    let query = {
        "text": '',
        "startTime": oneDayAgo,
        "maxResults": 20
    }

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

    chrome.contextMenus.onClicked.addListener(function (info) {
        chrome.history.search(query, (histories) => {
            let click = histories.filter( history => history.id == info.menuItemId);
            window.open(click[0].url);
        });
    });

}


createMenus();
