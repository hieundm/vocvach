today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();

days = ['Chủ nhật', 'Thứ 2','Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

monthAndYear = document.getElementById("monthAndYear");
var options = null;
// showCalendar(currentMonth, currentYear, options);


// function next() {
//     currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
//     currentMonth = (currentMonth + 1) % 12;
//     showCalendar(currentMonth, currentYear, options);
// }

// function previous() {
//     currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
//     currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
//     showCalendar(currentMonth, currentYear, options);
// }

// function jump() {
//     currentYear = parseInt(selectYear.value);
//     currentMonth = parseInt(selectMonth.value);
//     showCalendar(currentMonth, currentYear, options);
// }

function initCalendar(id) {
    if (id === '' || id === null || id === undefined) {
        throw 'Please type your id of the div you want to show the calendar!';
    }
    var table = document.createElement('table');
    table.setAttribute('class', 'reflow');
    var obID = document.getElementById(id);
    var thead = document.createElement('thead');
    table.appendChild(thead);
    for (var i = 0, len = days.length; i < len; i++) {
        var tdh = document.createElement('th');
        tdh.innerText = days[i];
        thead.appendChild(tdh);
    }
    var tbody = document.createElement('tbody');
    tbody.id = 'calendar-body';
    table.appendChild(tbody);
    obID.appendChild(table);
}

function showCalendar(month, year, options, id) {
    let firstDay = (new Date(year, month)).getDay();
    initCalendar(id);
    var table = document.getElementById(id);
    tbl = table.querySelector('#calendar-body'); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    if (monthAndYear !== null) {
        monthAndYear.innerHTML = months[month] + " " + year;
    }

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            } else if (date > daysInMonth(month, year)) {
                break;
            } else {
                var d = new Date(year,month, date);
                cell = document.createElement('td');
                div = document.createElement('div');
                div.setAttribute('style', 'height: 100%; min-height:100px; max-height:150px;');
                cell.appendChild(div);
                cell.setAttribute('data-date', formatDateLocal(d));
                if (typeof (options !== null && options !== undefined && options.method.dayRender) === 'function') { 
                    options.method.dayRender(d, div);
                } else {
                    cellText = document.createTextNode(formatDateLocal(d));
                }
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    if(options !== null && options !== undefined && options.cell !== undefined){
                        if(options.cell.currentDate !== undefined){
                            if (options.cell.currentDate.background !== undefined || options.cell.currentDate.background !== '') {
                                var bg = options.cell.currentDate.background;
                                cell.setAttribute('class', 'cld-currday');
                                cell.setAttribute('style', 'background-color:' + bg);
                            }
                        }
                    }else{
                        cell.setAttribute('style', 'background-color: lightgrey');
                    }
                } // color today's date
                if (options !== null && options !== undefined && options.data !== null && options.data !== undefined) {
                    for (var k = 0, len = options.data.length; k < len; k++) {
                        var item = options.data[k];
                        var dataDate = new Date(item.start);
                        var _d = d;
                        if (dataDate.setHours(0, 0, 0) === _d.setHours(0, 0, 0)) {
                            cell.setAttribute('class', 'hasEvent');

                        }
                    }  
                    if (typeof (options.method.dataRender) === 'function') {
                        options.method.dataRender(div, cell, d, event, options.data);
                    }
                } 
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row); // appending each row into calendar body.
    }
    if ((options !== null && options !== undefined) && typeof (options.method.dayClick) === 'function') {
        var arrTd = document.querySelectorAll('#' + id + ' td');
        arrTd.forEach(function (item) {
            item.addEventListener('click', function () {
                options.method.dayClick(item.getAttribute('data-date'), options.data, event);
            });
        });
    }

}

// check how many days in a month code from https://dzone.com/articles/determining-number-days-month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function formatDateLocal(date) {
    return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/' + date.getFullYear();
}
