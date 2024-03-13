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


const weekDays = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap']
const monthNames = ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December']


let date = new Date();

const currentYear = date.getFullYear()
const curretMonth = date.getMonth();
const currentDay = date.getDate();

let selectedYear = date.getFullYear();
let selectedMonth = date.getMonth();
let selectedDay = date.getDate();

let calendarNumbers = [];

//events start

calendarLeftSelector.addEventListener('click', previousMonth);
calendarRightSelector.addEventListener('click', nextMonth);
//events end


//modal window events

modalCloseBtn.addEventListener('click', () => {
    modal.classList.remove('active')
})
btnCancel.addEventListener('click', () => {
    modal.classList.remove('active')
})

btnAdd.addEventListener('click', addEvent)


console.log('date: ' + date +
    '\nyear:' + date.getFullYear() +
    '\nmonth: ' + date.getMonth() +
    '\nday: ' + date.getDate())




function getCalendarNumbers(year, month, day) {

    let { currentMonthLength, previousMonthLength, previusMonthIndex
    } =
        getMonthDaysCount(year, month, day)


    console.log(currentMonthLength)
    console.log(previusMonthIndex)



    for (i = 0; i < currentMonthLength; i++) {
        calendarNumbers.push({
            'day': i + 1,
            'class': 'actual-month'
        });
    }
    for (i = 0; i < previusMonthIndex; i++) {
        calendarNumbers.unshift({
            'day': previousMonthLength - i,

            'class': 'previous-month'
        });
    }



    const length = calendarNumbers.length;
    for (i = 0; i < (42 - length); i++) {
        calendarNumbers.push({
            'day': i + 1,
            'class': 'next-month'
        });
    }

}

function getMonthDaysCount(year, month, day) {

    //visszatér az előző hónap hosszával
    //visszatér a kiválasztott hónap hosszával
    //visszatér a kiválasztott hónap napjával, hogy hanyadik a héten



    //current month length
    const currentMonthLength = (new Date(year, month, 0)).getDate();
    const previusMonthIndex = (new Date(year, month, 0)).getDay();

    prevYear = year;
    prevMonth = month - 1;
    prevMonth -= 1;
    if (prevMonth < 0) {
        prevMonth = 11;
        prevYear -= 1
    }
    const previousMonthLength = (new Date(prevYear, prevMonth, 0)).getDate();


    console.log('currents:' + currentMonthLength, 'previous:' + previousMonthLength, previusMonthIndex)
    console.log(currentMonthLength)



    return { currentMonthLength, previousMonthLength, previusMonthIndex }
}


function renderCalendarElements() {
    calendarNumbers = [];
    console.log('emptyed array:' + calendarNumbers)
    getCalendarNumbers(selectedYear, selectedMonth, selectedDay);

    calendarSelectedDate.innerText = selectedYear + ' ' + monthNames[selectedMonth];


    calendarDayNames.innerHTML = '';
    calendarDayItems.innerHTML = '';

    weekDays.forEach(dayName => {
        const dayNameElement = document.createElement('div');
        dayNameElement.innerText = dayName;
        calendarDayNames.appendChild(dayNameElement);
    })


    calendarNumbers.forEach((item) => {
        const calendarElement = document.createElement('div');
        calendarElement.classList.add('days');
        calendarElement.classList.add(item.class);
        if (item.day === currentDay && selectedYear === currentYear && selectedMonth === curretMonth) {
            calendarElement.classList.add('current');
        }


        calendarElement.innerText = item.day;
        calendarDayItems.appendChild(calendarElement)
    });

    addClickEvents();

    highlightEvents();
}

function previousMonth() {

    selectedMonth -= 1;
    if (selectedMonth < 0) {
        selectedMonth = 11;
        selectedYear -= 1
    }
    renderCalendarElements()
}
function nextMonth() {

    selectedMonth += 1;
    if (selectedMonth > 11) {
        selectedMonth = 0;
        selectedYear += 1
    }
    renderCalendarElements()
}

renderCalendarElements();




// ez nyitja meg a modal ablakot

function addClickEvents() {
    const days = document.querySelectorAll('.days');

    days.forEach(day => {
        day.addEventListener('click', function (event) {
            selectedDay = event.target.innerText
            loadEvents(selectedYear, selectedMonth, selectedDay);

            console.log('a választott napom' + selectedDay)
            modal.classList.add('active')
        });
    })

    highlightEvents();
}




// modal window









//load events from localstorage
function loadEvents() {
    events = JSON.parse(localStorage.getItem('events'));

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

function highlightEvents() {

    events = JSON.parse(localStorage.getItem('events'));
    const days = document.querySelectorAll('.days');
    days.forEach(item => {
        events.forEach(eventItem => {
            if (eventItem.date.year === selectedYear && eventItem.date.month === selectedMonth && eventItem.date.day === item.innerText && item.classList.contains('actual-month')) {
                item.classList.add('highlight');
            }
        })

    })
    console.log('itt történik a high')

}


//add events 

function addEvent(text) {

    let events = JSON.parse(localStorage.getItem('events'));

    console.log(events)

    if (events === null) {
        events = new Array();
    }
    events.push({
        eventName: eventInput.value,
        date: {
            year: selectedYear,
            month: selectedMonth,
            day: selectedDay
        }
    })

    //let lclEvents = localStorage.getItem('events');


    localStorage.setItem('events', JSON.stringify(events));
    //localStorage.setItem('events', events)



    modal.classList.remove('active')
    eventInput.value = '';//törlöm az event imputot
    console.log(events);



    //refreshelnunk kell az egész kalendáriumot
    renderCalendarElements();
}


//function delete events

function deleteEvent(event) {
    const eventIndex = event.target.getAttribute('data-index');
    if (confirm('Biztos tölölni szeretnéd?')) {
        let torolt = events.splice(eventIndex, 1);
        localStorage.setItem('events', JSON.stringify(events))
        //alert('ok' + eventIndex + 'törölt: ' + torolt)

        loadEvents();
        renderCalendarElements();

    }
}

//open modal
// csak azokat az eseményeket töltöm be amelyek az adott dátumra vonatkoznak
function openModal() {




}
