'use strict';

///Parameter///
let oneSecond = 1000 * 60 ;
let Minute10 = oneSecond * 10;
let oneHour = oneSecond * 60;
let oneDay = oneSecond * 60 * 24;
let microsecondsPerWeek = oneSecond * 60 * 24 * 7;
let Minute10Ago = (new Date).getTime() - Minute10;
let oneHourAgo = (new Date).getTime() - oneHour;
let oneDayAgo = (new Date).getTime() - oneDay;
let oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

///head///
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
let Bind_DeleteAll = () => {
    let btn_deletehour = document.getElementById("btn_deleteall");
    btn_deletehour.addEventListener("click", () => {
        chrome.history.deleteAll(()=>{
            Clear_OldData();
            alert('清除全部成功');
            Div_ShowHistory("Url_List")
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
let Bind_Search = () => {
    let txt_search = document.getElementById('txt_search')
    txt_search.addEventListener('input', (e) => {
        let input_value = txt_search.value;
        Clear_OldData()
        Div_ShowHistory('Url_List', input_value)
    })
}

///content///
let getYMD = (DateNumber) => {
    let dateObj = new Date(DateNumber);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let date = dateObj.getDate();
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let strHours;
    let strMinutes;
    if (hours < 10) {
        strHours = "0" + hours.toString();
    } else {
        strHours = hours.toString();
    }
    if (minutes < 10) {
        strMinutes = "0" + minutes.toString();
    } else {
        strMinutes = minutes.toString();
    }
    let seconds = dateObj.getSeconds();
    let timeCombine = `${year}/${month}/${date} ${strHours}:${strMinutes}`;
    return timeCombine;
}

function Div_ShowHistory(DivId, serchText) {

    let query = {
        "text": "",
        "startTime": oneDayAgo
        //"endTime": new Date().getTime(),
        //"maxResults": 3
    };

    if (serchText !== '' && serchText !== undefined) {
        query = {
            "text": serchText,
            "startTime": oneWeekAgo
        };
    }

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
        Bind_DeleteAll();
        Bind_Search();
        Div_ShowHistory("Url_List");
    }
);


