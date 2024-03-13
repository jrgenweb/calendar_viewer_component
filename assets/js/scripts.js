const calendarLeftSelector = document.querySelector('.navigation-left')
const calendarRightSelector = document.querySelector('.navigation-right')
const calendarSelectedDate = document.querySelector('.selected-date');
const calendarDayNames = document.querySelector('.calendar-day-names')
const calendarDayItems = document.querySelector('.calendar-days')




const modal = document.querySelector('.modal');
const modalCloseBtn = document.querySelector('.btn-close');
const btnAdd = document.querySelector('#btnAdd');
const btnCancel = document.querySelector('#btnCancel');
const eventInput = document.querySelector('#eventInput');



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


//modal

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


//alapesetben a jelenlegi dátummal kezdünk


/*  5*7-es lesz a táblánk
*   ha az 1-je, nem a hét első napja, akkor megnézzük az előző hónap hány 
*   napos volt és feltöltjük az üres helyeket
*
*/



/*
function getCalendarNumbers() {
    let previusMonthIndex = 5;//a negyedik nap aza csütörötk
    const currentMonthDaysCount = 31;

    for (i = 0; i < 35; i++) {
        if ((previusMonthIndex - i) > 0) {
            console.log(i + 'ez az elözö hónap')
            calendarNumbers.push({
                'day': i,
                'class': 'previous-month'
            });
            previusMonthIndex--;
        }
        else if (i < currentMonthDaysCount) {
            console.log(i - previusMonthIndex + 'ez az aktuális hónap' + previusMonthIndex)
            //calendarNumbers.push(i - previusMonthIndex);
            calendarNumbers.push({
                'day': i - previusMonthIndex,
                'class': 'actual-month'
            });
        }
        else {
            //ha 4 a különbség akkor
            //
            console.log((i - 35) + 'ez már a következő hónap' + previusMonthIndex)
            //calendarNumbers.push((35 - i));
            calendarNumbers.push({
                'day': 35 - i,
                'class': 'previous-month'
            });
        }
    }
}
*/



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




//

function addClickEvents() {
    const days = document.querySelectorAll('.days');

    days.forEach(day => {
        day.addEventListener('click', function (event) {


            selectedDay = event.target.innerText
            modal.classList.add('active')
        });
    })
}




// modal window









//load events from localstorage
function loadEvents() {

}

//add events 

function addEvent(text) {
    //localStorage.getItem('events');
    let events = [];
    if (events === null) {
        console.log('ok')
    }

    events.push({
        eventName: eventInput.value,
        date: {
            year: selectedYear,
            month: selectedMonth,
            day: selectedDay
        }
    })

    let lclEvents = localStorage.getItem('events');


    localStorage.setItem('events', null)
    //localStorage.setItem('events', events)


    console.log(events);

}


//function delete events

function deleteEvent() {

}


