/*
Original code from "A New Day: Making a Better //Calendar" available at https://www.24a11y.com/2018/a-new-day-making-a-better-calendar/

- Code has been altered for demo purposes

*/

import dayjs from 'dayjs'

const prevButton = document.getElementById('previous')
const nextButton = document.getElementById('next')
const monthSelect = document.getElementById('month')
const yearSelect = document.getElementById('year')
const calendarSection = document.getElementById('Calendar-dates')
const calendarHelp = document.getElementById('Calendar-help-trigger')
const calendarUpdates = document.getElementById('Calendar-updates')
let selected = ''

const announce = content => {
  setText(calendarUpdates, content)

  setTimeout(function() {
    setText(calendarUpdates, '')
  }, 1000)
}

const selectDate = date => {
  const selection = calendarSection.querySelector('[aria-pressed="true"]')

  if (selection) {
    selection.setAttribute('aria-pressed', 'false')
    selection.setAttribute('tabindex', '-1')
  }

  date.setAttribute('aria-pressed', 'true')
  date.removeAttribute('tabindex')

  selected = dayjs.unix(date.getAttribute('data-timestamp'))

  announce(`selected ${date.getAttribute('aria-label')}`)

  setDateInput(date.getAttribute('data-timestamp'))
  showTimeSelectBox()
}

const showTimeSelectBox = () => {
  const timeBox = document.querySelector('.selected-days-box')
  timeBox.classList.remove('visually-hidden')
}

const showDialog = () => {
  const dialog = document.getElementById('Calendar-help-dialog')
  dialog.setAttribute('aria-hidden', 'false')
  dialog.firstElementChild.focus()
  dialog.addEventListener('keydown', onDialogKeydown)
  dialog.addEventListener('click', onDialogUx)
  document.documentElement.setAttribute('tabindex', '-1')
  document.addEventListener('focus', onDialogUx, true)
}

const closeDialog = () => {
  const dialog = document.getElementById('Calendar-help-dialog')

  dialog.removeEventListener('keydown', onDialogKeydown)
  dialog.removeEventListener('click', onDialogUx)
  document.removeEventListener('focus', onDialogUx, true)
  document.documentElement.removeAttribute('tabindex')

  dialog.setAttribute('aria-hidden', 'true')
  calendarHelp.focus()
}

const onDialogKeydown = event => {
  const target = event.target

  if (event.key === 'Escape') {
    closeDialog()
    return
  }

  if (event.key === 'Tab') {
    const dialog = document.getElementById('Calendar-help-dialog')
    const close = document.getElementById('Calendar-help-close')

    if (event.shiftKey && target === dialog) {
      event.preventDefault()
      close.focus()
    } else if (target === close) {
      event.preventDefault()
      dialog.focus()
    }
  }
}

const isWeekend = day => {
  return day.$W === 0 || day.$W === 6
}

const isBlockedDay = (day, month, today) => {
  return day.isBefore(today)
}

const getDateTemplate = (day, month, today) => {
  const isDisabled =
    day.$M !== month.$M || isWeekend(day) || isBlockedDay(day, month, today)
  const isCurrent = day.isSame(today)
  const isSelected = day.isSame(selected)

  return `<button
                  class="Calendar-item ${
                    isDisabled
                      ? 'Calendar-item--unavailable'
                      : 'Calendar-item--active'
                  }"
                  type="button"
                  aria-pressed="${isSelected}"
                  aria-label="${isDisabled ? 'Unavailable, ' : ''}${dayjs(
    day,
  ).format('D, dddd MMMM YYYY')}"
                  ${isCurrent ? 'aria-current="date"' : ''}
                  ${day.$D !== today.$D ? 'tabindex="-1"' : ''}
                  data-timestamp="${day.unix()}" data-day="day-${day.$D}">
                    ${day.$D}
                </button>`
}

const onKeydown = event => {
  const target = event.target
  const key = event.key.replace('Arrow', '')
  let next = ''

  if (
    target.classList.contains('Calendar-item') &&
    key.match(/Up|Down|Left|Right|Home|End|PageUp|PageDown/)
  ) {
    switch (key) {
      case 'Right':
        if (target === getLastDate()) {
          nextMonth()
          next = getFirstDate()
        } else {
          next =
            target.nextElementSibling ||
            target.parentElement.nextElementSibling.firstElementChild
        }
        break
      case 'Left':
        if (target === getFirstDate()) {
          previousMonth()
          next = getLastDate()
        } else {
          next =
            target.previousElementSibling ||
            target.parentElement.previousElementSibling.lastElementChild
        }
        break
      case 'Up':
        if (target === getFirstDate()) {
          previousMonth()
          next = getLastDate()
        } else {
          const parent = target.parentElement
          const index = Array.from(parent.children).indexOf(target)
          const row = parent.previousElementSibling

          if (row) {
            next = row.children.item(index)
          }
        }
        break
      case 'Down':
        if (target === getLastDate()) {
          nextMonth()
          next = getFirstDate()
        } else {
          const parent = target.parentElement
          const index = Array.from(parent.children).indexOf(target)
          const row = parent.nextElementSibling

          if (row) {
            next = row.children.item(index)
          }
        }
        break
      case 'Home':
        next = getFirstDate()
        break
      case 'End':
        next = getLastDate()
        break
      case 'PageUp':
      case 'PageDown':
        if (key === 'PageUp') {
          previousMonth()
        } else {
          nextMonth()
        }
        next = Array.from(
          calendarSection.querySelectorAll('.Calendar-item'),
        ).find(date => date.textContent === target.textContent)
        break
      default:
    }
    event.preventDefault()

    if (next) {
      next.focus()
    } else {
      announce('end of calendar')
    }
  }
}

/**
 * Helpers
 */
const getIndex = (index, len, dir) => (index + len + dir) % len

const getDisplayedMonth = () =>
  dayjs(
    new Date(
      yearSelect.item(yearSelect.selectedIndex).value,
      monthSelect.selectedIndex,
      '1',
    ),
  )

const getFirstDate = () =>
  calendarSection.firstElementChild.querySelector(
    '.Calendar-item:first-of-type:not(.Calendar-item--empty)',
  )

const getLastDate = () =>
  calendarSection.lastElementChild.querySelector(
    '.Calendar-item:last-of-type:not(.Calendar-item--empty)',
  )

const setText = (node, text) => {
  let child = node.firstChild

  if (child && !child.nextSibling && child.nodeType === 3) {
    child.data = text
  } else {
    node.textContent = text
  }
}

/**
 * Event Handlers
 */

const previousMonth = () => {
  const newMonth = getIndex(monthSelect.selectedIndex, monthSelect.length, -1)
  monthSelect.selectedIndex = newMonth

  if (newMonth === monthSelect.length - 1) {
    yearSelect.selectedIndex -= 1
  }
  updateUI()
}

const nextMonth = () => {
  const newMonth = getIndex(monthSelect.selectedIndex, monthSelect.length, 1)
  monthSelect.selectedIndex = newMonth

  if (newMonth === 0) {
    yearSelect.selectedIndex += 1
  }
  updateUI()
}

const onDialogUx = event => {
  const target = event.target
  const dialog = document.getElementById('Calendar-help-dialog')
  const close = dialog.querySelector('.Calendar-help-close')

  if (
    !dialog.contains(target) ||
    (event.type === 'click' && target === close)
  ) {
    closeDialog()
  }
}

const onActivation = event => {
  const target = event.target
  if (target.classList.contains('Calendar-item--active')) {
    selectDate(target)
  }
}

const updateUI = () => {
  const prevMonth = getIndex(monthSelect.selectedIndex, monthSelect.length, -1)
  const prevYear =
    prevMonth === monthSelect.length - 1
      ? yearSelect.selectedIndex - 1
      : yearSelect.selectedIndex

  const nextMonth = getIndex(monthSelect.selectedIndex, month.length, 1)
  const nextYear =
    nextMonth === 0 ? yearSelect.selectedIndex + 1 : year.selectedIndex

  if (prevMonth === 0 && prevYear === 0) {
    prevButton.disabled = true
  } else {
    prevButton.disabled = false
    prevButton.setAttribute(
      'aria-label',
      'Previous month, ' +
        month.item(prevMonth).value +
        ' ' +
        year.item(prevYear).value,
    )
  }

  nextButton.setAttribute(
    'aria-label',
    `Next month, ${month.item(nextMonth).value} ${year.item(nextYear).value}`,
  )

  let update = `${monthSelect.value} ${year.value}`

  announce(update)

  renderDates(getDisplayedMonth())
}

const renderDates = date => {
  let start = dayjs(date)
    .startOf('month')
    .startOf('week')
    .subtract(1, 'day')
  let end = dayjs(date)
    .endOf('month')
    .endOf('week')
    .subtract(1, 'day')
  let today = dayjs()
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0)
  let calendar = []

  while (start.isBefore(end)) {
    calendar.push(
      Array(7)
        .fill(0)
        .map(() => {
          start = start.add(1, 'day')
          return start
        }),
    )
  }

  let grid = calendar.reduce((rowAcc, row) => {
    let days = row.reduce((dayAcc, day) => {
      day = day
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0)

      if (day.$M !== date.$M) {
        return `${dayAcc}<span class="Calendar-item Calendar-item--empty"></span>`
      } else {
        return `${dayAcc}${getDateTemplate(day, date, today)}`
      }
    }, '')

    return `${rowAcc}<div class="Calendar-row">${days}</div>`
  }, '')

  calendarSection.innerHTML = ''
  calendarSection.insertAdjacentHTML('beforeEnd', grid)
}

/* Event Listeners */
monthSelect.addEventListener('change', updateUI)
yearSelect.addEventListener('change', updateUI)
prevButton.addEventListener('click', previousMonth)
nextButton.addEventListener('click', nextMonth)
calendarSection.addEventListener('click', onActivation)
calendarSection.addEventListener('keydown', onKeydown)
calendarHelp.addEventListener('click', showDialog)

/* Init */
updateUI()
