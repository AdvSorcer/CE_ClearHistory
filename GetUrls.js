'use strict';

///Parameter///
let Minute10 = 1000 * 60 * 10;
let oneHour = 1000 * 60 * 60;
let microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
let Minute10Ago = (new Date).getTime() - Minute10;
let oneHourAgo = (new Date).getTime() - oneHour;
let oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

///head///

let Bind_DeleteHour = () => {
    let btn_deletehour = document.getElementById("btn_deletehour");
    btn_deletehour.addEventListener("click", () => {
        let range = {
            startTime: oneHourAgo,
            endTime: (new Date).getTime()
        }
        chrome.history.deleteRange(range, function () {
            Clear_OldData();
            alert('刪除成功')
            Div_ShowHistory("Url_List");
        })
    })
}
let Bind_Delete10Min = () => {
    let btn_deletehour = document.getElementById("btn_delete10");
    btn_deletehour.addEventListener("click", () => {
        let range = {
            startTime: Minute10Ago,
            endTime: (new Date).getTime()
        }
        chrome.history.deleteRange(range, function () {
            Clear_OldData();
            alert('刪除成功')
            Div_ShowHistory("Url_List");
        })
    })
}
let Clear_OldData = () => {
    let RemoveTargets = document.getElementsByClassName('card');
    let count = RemoveTargets.length;
    for (let index = count - 1; index >= 0; index--) {
        RemoveTargets[index].parentNode.removeChild(RemoveTargets[index])
    }
}

///content///
let query = {
    "text": "",
    "startTime": oneHourAgo
    //"endTime": new Date().getTime(),
    //"maxResults": 3
};

let getYMD = (DateNumber) => {
    let dateObj = new Date(DateNumber);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let date = dateObj.getDate();
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let strMinutes;
    if (minutes < 10) {
        strMinutes = "0" + minutes.toString();
    } else {
        strMinutes = minutes.toString();
    }
    let seconds = dateObj.getSeconds();
    let timeCombine = `${year}/${month}/${date} ${hours}:${strMinutes}`;
    return timeCombine;
}

function Div_ShowHistory(DivId) {
    let targetDiv = document.getElementById(DivId);

    chrome.history.search(query, (histories) => {
        histories.forEach(element => {
            let urlTitle = element.title;
            let urlDate = element.lastVisitTime;
            let urlurl = element.url;
            let div = document.createElement('div');
            div.appendChild(document.createTextNode(`${getYMD(urlDate)}`))
            let a = document.createElement('a');
            a.href = urlurl;
            a.target = "_blank";
            a.appendChild(document.createTextNode(` ${urlTitle}`));
            div.appendChild(a);
            div.classList.add('card')
            targetDiv.appendChild(div);
        });
    })

}

document.addEventListener('DOMContentLoaded',
    function () {
        Bind_DeleteHour();
        Bind_Delete10Min();
        Div_ShowHistory("Url_List");
    }
);


