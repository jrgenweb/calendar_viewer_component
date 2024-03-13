const calendarLeftSelector = document.querySelector('.navigation-left')
const calendarRightSelector = document.querySelector('.navigation-right')
const calendarSelectedDate = document.querySelector('.selected-date');
const calendarDayNames = document.querySelector('.calendar-day-names')
const calendarDayItems = document.querySelector('.calendar-days')



/**
 * 
 * modal window
 * 
 * 
 */

const modal = document.querySelector('.modal');
const modalCloseBtn = document.querySelector('.btn-close');
const btnAdd = document.querySelector('#btnAdd');
const btnCancel = document.querySelector('#btnCancel');
const eventInput = document.querySelector('#eventInput');
const eventId = document.querySelector('#eventId');
const modalEvents = document.querySelector('.events');
const modalDrop = document.querySelector('.modal-drop');

const weekDays = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap']
const monthNames = ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December']


let date = new Date();
const currentYear = date.getFullYear();
const currentMonth = date.getMonth();
const currentDay = date.getDate();

let selectedYear = date.getFullYear();
let selectedMonth = date.getMonth();
let selectedDay = date.getDate();

let calendarNumbers = [];
let events = JSON.parse(localStorage.getItem('events'));
//events start

calendarLeftSelector.addEventListener('click', previousMonth);
calendarRightSelector.addEventListener('click', nextMonth);
//events end



// a napok kiíratása....
weekDays.forEach((item) => {
    calendarDayNames.innerHTML += `<div>${item}</div>`

})
function renderCalendar() {
    calendarDayItems.innerHTML = ''; //lenullazzuk a calendar-t

    calendarSelectedDate.innerHTML = `${selectedYear} ${monthNames[selectedMonth]}`

    let actualMonthDays = new Date(selectedYear, selectedMonth + 1, 0).getDate(),
        indexOfCurrentDay = new Date(selectedYear, selectedMonth, 1).getDay(), //a hónap elsőnapjának az indexe
        previousMonthDays = new Date(selectedYear, selectedMonth, 0).getDate();
    lastDayOfMonth = new Date(selectedYear, selectedMonth, actualMonthDays).getDay();



    //console.log(actualMonthDays + ' sd ' + selectedDay + 'előző honap napjai: ' + lastDayOfMonth)


    //24 29
    for (i = previousMonthDays - indexOfCurrentDay + 1; i < previousMonthDays; i++) {
        calendarDayItems.innerHTML += `<div class="days previous-month">${i + 1}</div>`
    }


    /**
     * 
     * 
     * az aktuális napok kiírratása
     * 
     * 
     */
    for (i = 0; i < actualMonthDays; i++) {
        let current, highlight = '';

        //console.log(currentDay, selectedDay, selectedMonth, currentMonth,)
        if (selectedMonth === currentMonth && selectedYear === currentYear && i + 1 === currentDay) {
            current = 'current';
        }



        events.forEach(eventItem => {
            console.log(eventItem, selectedMonth, selectedYear, i + 1)
            if (
                eventItem.date.year === selectedYear
                && eventItem.date.month === selectedMonth
                && Number.parseInt(eventItem.date.day) === i + 1) {
                highlight = 'highlight';

                console.log('Va')
            }
            console.log('nincs')
        })






        calendarDayItems.innerHTML += `<div class="days actual-month ${current} ${highlight}">${i + 1}</div>`
    }

    //itt lesznek a hónap következőnapjai


    /* console.log(lastDayOfMonth)
     6 - lastDateOfLastMonth;*/

    for (i = 0; i <= 6 - lastDayOfMonth; i++) {
        calendarDayItems.innerHTML += `<div class="days next-month">${i + 1}</div>`
        console.log('ok: ' + i)
    }


    //eseménykezelő hozzáadása a napokhoz
    addClickEvents();

}

renderCalendar();








//modal window events

modalCloseBtn.addEventListener('click', () => {
    closeModal()
})
btnCancel.addEventListener('click', () => {
    closeModal()
})

btnAdd.addEventListener('click', addEvent)


function previousMonth() {

    selectedMonth -= 1;
    if (selectedMonth < 0) {
        selectedMonth = 11;
        selectedYear -= 1
    }
    renderCalendar()
}
function nextMonth() {

    selectedMonth += 1;
    if (selectedMonth > 11) {
        selectedMonth = 0;
        selectedYear += 1
    }
    renderCalendar();
}

//renderCalendarElements();




// ez nyitja meg a modal ablakot

function addClickEvents() {
    const days = document.querySelectorAll('.days');

    days.forEach(day => {
        if (day.classList.contains('actual-month')) {
            day.addEventListener('click', function (event) {
                selectedDay = event.target.innerText
                loadEvents(selectedYear, selectedMonth, selectedDay);

                console.log('a választott napom' + selectedDay)

                openModal();



            });
        } else if (day.classList.contains('previous-month')) {
            day.addEventListener('click', previousMonth);
        } else {
            day.addEventListener('click', nextMonth);
        }
    })


}




// modal window









//load events from localstorage
function loadEvents() {
    modalEvents.innerHTML = '';
    console.log(events)

    //selectedYear, selectedMonth, selectedDay

    const data = events.filter(eventItem => {
        return eventItem.date.year === selectedYear && eventItem.date.month === selectedMonth && eventItem.date.day === selectedDay
    })


    data.forEach((event, index) => {
        try {
            const eventEl = document.createElement('div');
            eventEl.classList.add('event');
            const eventNameEl = document.createElement('div');
            eventNameEl.classList.add('event-name');
            eventNameEl.innerText = event.eventName;

            const eventActionsEl = document.createElement('div');
            eventActionsEl.classList.add('event-actions')

            const btnEdit = document.createElement('button')
            btnEdit.classList.add('btn', 'btn-edit')
            btnEdit.innerHTML = '<i class="fa fa-solid fa-edit"></i>';

            const btnDelete = document.createElement('button')
            btnDelete.classList.add('btn', 'btn-delete')
            btnDelete.innerHTML = '<i class="fa fa-solid fa-trash"></i>'
            btnDelete.setAttribute('data-index', index)
            btnDelete.addEventListener('click', deleteEvent);


            eventActionsEl.appendChild(btnEdit);
            eventActionsEl.appendChild(btnDelete);

            eventEl.appendChild(eventNameEl);
            eventEl.appendChild(eventActionsEl);
            modalEvents.appendChild(eventEl);
        } catch (err) {
            console.log(err)
        }
    })



}




//add events 

function addEvent() {
    if (events === null) {
        events = new Array();
    }
    events.push({
        eventName: eventInput.value,
        date: {
            year: selectedYear,
            month: selectedMonth,
            day: Number.parseInt(selectedDay)


        }
    })

    localStorage.setItem('events', JSON.stringify(events));

    eventInput.value = '';//törlöm az event imputot
    closeModal();
    //refreshelnunk kell az egész kalendáriumot
    renderCalendar();
}


//function delete events

function deleteEvent(event) {
    const eventIndex = event.target.getAttribute('data-index');
    if (confirm('Biztos tölölni szeretnéd?')) {
        let torolt = events.splice(eventIndex, 1);
        localStorage.setItem('events', JSON.stringify(events))
        renderCalendar();
    }
}

//open modal
// csak azokat az eseményeket töltöm be amelyek az adott dátumra vonatkoznak





function openModal() {
    modal.classList.add('active')
    modalDrop.classList.add('active')

}

function closeModal() {

    modal.classList.remove('active')
    modalDrop.classList.remove('active')
}




