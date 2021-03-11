<template>
  <div class="md-datepicker-body">
    <transition name="md-datepicker-body-header">
      <div class="md-datepicker-body-header" v-if="currentView === 'day'">
        <md-button class="md-dense md-icon-button" @click="previousMonth">
          <md-arrow-left-icon />
        </md-button>

        <md-button class="md-dense md-icon-button" @click="nextMonth">
          <md-arrow-right-icon />
        </md-button>
      </div>
    </transition>

    <div class="md-datepicker-body-content">
      <transition name="md-datepicker-view">
        <transition-group class="md-datepicker-panel md-datepicker-calendar" :class="calendarClasses" tag="div" name="md-datepicker-month" v-if="currentView === 'day'">
          <div class="md-datepicker-panel md-datepicker-month" v-for="month in [currentDate]" :key="month.getMonth()">
            <md-button class="md-dense md-datepicker-month-trigger" @click="currentView = 'month'">{{ currentMonthName }} {{ currentYear }}</md-button>

            <div class="md-datepicker-week">
              <span v-for="(day, index) in locale.shorterDays" :key="index" v-if="index >= firstDayOfAWeek">{{ day }}</span>
              <span v-for="(day, index) in locale.shorterDays" :key="index" v-if="index < firstDayOfAWeek">{{ day }}</span>
            </div>

            <div class="md-datepicker-days">
              <span class="md-datepicker-empty" v-for="day in prefixEmptyDays" :key="'day-empty-'+day"></span>
              <div class="md-datepicker-day" v-for="day in daysInMonth" :key="'day-'+day">
                <span
                  class="md-datepicker-day-button"
                  :class="{
                    'md-datepicker-selected': isSelectedDay(day),
                    'md-datepicker-today': isToday(day),
                    'md-datepicker-disabled': isDisabled(day)
                  }"
                  @click="selectDate(day)">{{ day }}</span>
              </div>
            </div>
          </div>
        </transition-group>

        <div class="md-datepicker-panel md-datepicker-month-selector" v-else-if="currentView === 'month'">
          <md-button class="md-datepicker-year-trigger" @click="currentView = 'year'">{{ currentYear }}</md-button>
          <span
            class="md-datepicker-month-button"
            v-for="(month, index) in locale.months"
            :class="{
              'md-datepicker-selected': currentMonthName === month
            }"
            :key="month"
            @click="switchMonth(index)">{{ month }}</span>
        </div>

        <keep-alive v-else-if="currentView === 'year'">
          <md-content class="md-datepicker-panel md-datepicker-year-selector md-scrollbar">
            <span
              class="md-datepicker-year-button"
              v-for="year in availableYears"
              :class="{
                'md-datepicker-selected': currentYear === year
              }"
              :key="year"
              @click="switchYear(year)">{{ year }}</span>
          </md-content>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
  import addMonths from 'date-fns/addMonths'
  import getDaysInMonth from 'date-fns/getDaysInMonth'
  import getMonth from 'date-fns/getMonth'
  import getYear from 'date-fns/getYear'
  import isEqual from 'date-fns/isEqual'
  import isSameDay from 'date-fns/isSameDay'
  import setDate from 'date-fns/setDate'
  import setMonth from 'date-fns/setMonth'
  import setYear from 'date-fns/setYear'
  import startOfMonth from 'date-fns/startOfMonth'
  import subMonths from 'date-fns/subMonths'

  import MdArrowRightIcon from 'core/icons/MdArrowRightIcon'
  import MdArrowLeftIcon from 'core/icons/MdArrowLeftIcon'
  import MdComponent from 'core/MdComponent'

  const daysInAWeek = 7

  const getElements = (el, selector) => {
    if (el && el.querySelector) {
      return el.querySelectorAll(selector)
    }

    return false
  }

  export default new MdComponent({
    name: 'MdDatepickerBody',
    components: {
      MdArrowRightIcon,
      MdArrowLeftIcon,
    },
    model: {
      prop: 'selectedDate'
    },
    props: {
      selectedDate: Date,
      mdCurrentDate: { type: Date, default: () => new Date() },
      mdCurrentView: { type: String, required: true },
      mdDisabledDates: [Array, Function],
    },
    data: () => ({
      monthAction: null,
      availableYears: null
    }),
    computed: {
      currentView: {
        get() {
          return this.mdCurrentView
        },
        set(newview) {
          this.$emit('update:mdCurrentView', newview);
        }
      },
      currentDate: {
        get() {
          return this.mdCurrentDate
        },
        set(newdate) {
          this.$emit('update:mdCurrentDate', newdate)
        }
      },
      locale () {
        return this.$material.locale
      },
      calendarClasses () {
        if (this.monthAction === 'next') {
          return 'md-next'
        }

        return 'md-previous'
      },
      firstDayOfAWeek () {
        // normalize
        let firstDayOfAWeek = Number(this.locale.firstDayOfAWeek)
        if (Number.isNaN(firstDayOfAWeek) || !Number.isFinite(firstDayOfAWeek)) {
          return 0
        }
        firstDayOfAWeek = Math.floor(firstDayOfAWeek) % daysInAWeek
        firstDayOfAWeek += firstDayOfAWeek < 0 ? daysInAWeek : 0
        return firstDayOfAWeek
      },
      firstDayOfMonth () {
        return startOfMonth(this.currentDate).getDay()
      },
      prefixEmptyDays () {
        let prefixEmptyDays = this.firstDayOfMonth - this.firstDayOfAWeek
        prefixEmptyDays += prefixEmptyDays < 0 ? daysInAWeek : 0
        return prefixEmptyDays
      },
      daysInMonth () {
        return getDaysInMonth(this.currentDate)
      },
      currentMonthName () {
        return this.locale.months[this.currentMonth]
      },
      currentMonth () {
        return getMonth(this.currentDate)
      },
      currentYear () {
        return getYear(this.currentDate)
      },
    },
    methods: {
      setAvailableYears () {
        const { startYear, endYear } = this.locale
        let counter = startYear
        let years = []

        while (counter <= endYear) {
          years.push(counter++)
        }

        this.availableYears = years
      },
      previousMonth () {
        this.monthAction = 'previous'
        this.currentDate = subMonths(this.currentDate, 1)
      },
      nextMonth () {
        this.monthAction = 'next'
        this.currentDate = addMonths(this.currentDate, 1)
      },
      isSelectedDay (day) {
        return isEqual(this.selectedDate, setDate(this.currentDate, day))
      },
      isToday (day) {
        return isSameDay(new Date(), setDate(this.currentDate, day))
      },
      isDisabled (day) {
        if (this.mdDisabledDates) {
          const targetDate = setDate(this.currentDate, day)

          if (Array.isArray(this.mdDisabledDates)) {
            return this.handleDisabledDateByArray(targetDate)
          } else if (typeof this.mdDisabledDates === 'function') {
            return this.mdDisabledDates(targetDate)
          }
        }
      },
      switchMonth (index) {
        this.currentDate = setMonth(this.currentDate, index)
        this.currentView = 'day'
      },
      switchYear (year) {
        this.currentDate = setYear(this.currentDate, year)
        this.currentView = 'month'
      },
      selectDate (day) {
        let newDate = setDate(this.currentDate, day)
        this.currentDate = newDate
        this.$emit('input', newDate)
      },

    },
    created() {
      this.setAvailableYears()
    }
  });
</script>