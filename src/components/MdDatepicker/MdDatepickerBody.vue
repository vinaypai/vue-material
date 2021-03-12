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
              <div
                v-for="day in daysInMonth" :key="'day-'+day"
                class="md-datepicker-day"
                :class="{
                  'md-datepicker-rangestart': isRangeStart(day),
                  'md-datepicker-rangeend': isRangeEnd(day),
                  'md-datepicker-rangemid': isRangeMid(day),
                }"
              >
                <span
                  class="md-datepicker-day-button"
                  :class="{
                    'md-datepicker-selected': isSelectedDay(day),
                    'md-datepicker-today': isToday(day),
                    'md-datepicker-disabled': isDisabled(day)
                  }"
                  @mouseover="hoveringDate=makeDate(day)"
                  @mouseout="hoveringDate=null"
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
  import isAfter from 'date-fns/isAfter'
  import isBefore from 'date-fns/isBefore'
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
      selectedDate: [Date, Array],
      mdCurrentDate: { type: Date, default: () => new Date() },
      mdCurrentView: { type: String, required: true },
      mdDisabledDates: [Array, Function],
      mdHoveringDate: Date
    },
    data: () => ({
      monthAction: null,
      availableYears: null,
    }),
    computed: {
      isRangePicker() {
        return Array.isArray(this.selectedDate)
      },
      isDatePicker() {
        return !this.isRangePicker
      },
      isBothSelected() {
        return this.isRangePicker && !!this.selectedDate[0] && !!this.selectedDate[1]
      },
      isNeitherSelected() {
        return this.isRangePicker && !this.selectedDate[0] && !this.selectedDate[1]
      },
      highlightedRange() {
        if (!this.isRangePicker || this.isNeitherSelected) {
          return null;
        } else if (this.isBothSelected) {
          return this.selectedDate;
        } else if (this.hoveringDate) {
          return this.makeRange(this.hoveringDate);
        } else {
          return null;
        }
      },
      currentView: {
        get() {
          return this.mdCurrentView
        },
        set(newview) {
          this.$emit('update:mdCurrentView', newview)
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
      hoveringDate: {
        get() {
          return this.mdHoveringDate;
        },
        set(newDate) {
          this.$emit('update:mdHoveringDate', newDate)
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
      makeDate(day) {
        return setDate(this.currentDate, day);
      },
      isSelectedDay (day) {
        let date = this.makeDate(day);
        if(this.isRangePicker) {
          return this.selectedDate[0] && isSameDay(this.selectedDate[0], date) ||
            this.selectedDate[1] && isSameDay(this.selectedDate[1], date);
        } else {
          return this.isDatePicker && isEqual(this.selectedDate, this.makeDate(day));
        }
      },
      isRangeStart(day) {
        return this.highlightedRange && isSameDay(this.highlightedRange[0], this.makeDate(day))
      },
      isRangeEnd(day) {
        return this.highlightedRange && isSameDay(this.highlightedRange[1], this.makeDate(day));
      },
      isRangeMid(day) {
        let date = this.makeDate(day);
        return this.highlightedRange && isAfter(date, this.highlightedRange[0], date) && isBefore(date, this.highlightedRange[1]);
      },
      isToday (day) {
        return isSameDay(new Date(), this.makeDate(day))
      },
      isDisabled (day) {
        if (this.mdDisabledDates) {
          const targetDate = this.makeDate(day)

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
        let newDate = this.makeDate(day)
        this.currentDate = newDate

        let value;
        if(this.isDatePicker) {
          value = newDate;
        } else {
          value = this.makeRange(newDate);
        }

        this.$emit('input', value);
      },
      makeRange(newDate) {
        // If both dates are already picked, nor a neither was picked
        // start a new range with the selected date. Otherwise, set
        // this as the first or last date as appropriate
        if(this.isBothSelected || this.isNeitherSelected) {
          return [newDate, null]
        }

        let date = this.selectedDate[0] || this.selectedDate[1];
        if(isBefore(newDate, date)) {
          return [newDate, date];
        } else {
          return [date, newDate];
        }
      },
    },
    created() {
      this.setAvailableYears()
    }
  });
</script>

<style lang="scss">
  @import "~components/MdAnimation/variables";
  @import "~components/MdLayout/mixins";

  $md-calendar-width: 320px;
  $md-calendar-mobile-width: 296px;

  .md-datepicker-body {
    width: $md-calendar-width;
    position: relative;
    overflow: hidden;
    transition: width .3s $md-transition-stand-timing;
    will-change: width;

    @include md-layout-xsmall {
      width: $md-calendar-mobile-width;
    }

    .md-button {
      margin: 0;
    }
  }

  .md-datepicker-body-header {
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    pointer-events: none;

    &:before,
    &:after {
      width: 48px;
      height: 48px;
      position: absolute;
      top: 0;
      z-index: 2;
      pointer-events: none;
      content: " ";
    }

    &:after {
      left: 0;
    }

    &:before {
      right: 0;
    }

    .md-button {
      pointer-events: auto;
      z-index: 3;
    }
  }

  .md-datepicker-body-header-enter,
  .md-datepicker-body-header-leave-active {
    .md-button:first-child {
      transform: translate3d(-150%, 0, 0);
    }

    .md-button:last-child {
      transform: translate3d(150%, 0, 0);
    }
  }

  .md-datepicker-body-content {
    overflow: hidden;
    transition: height .35s $md-transition-default-timing;
    will-change: height;
  }

  .md-datepicker-panel {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: .35s $md-transition-default-timing;
    transition-property: transform, opacity;
    will-change: transform, opacity;
  }

  .md-datepicker-calendar {
    &.md-datepicker-view-enter,
    &.md-datepicker-view-leave-active {
      transform: translate3d(0, 100%, 0);
    }

    &.md-previous {
      .md-datepicker-month-enter {
        transform: translate3D(-100%, 0, 0);

        .md-datepicker-month-trigger {
          transform: translate3D(-30%, 0, 0);
        }
      }

      .md-datepicker-month-leave-active {
        transform: translate3D(100%, 0, 0);
      }
    }

    &.md-next {
      .md-datepicker-month-enter {
        transform: translate3D(100%, 0, 0);

        .md-datepicker-month-trigger {
          transform: translate3D(30%, 0, 0);
        }
      }

      .md-datepicker-month-leave-active {
        transform: translate3D(-100%, 0, 0);
      }
    }
  }

  .md-datepicker-month {
    top: 8px;
    bottom: auto;
    flex-direction: column;
    transition: .35s $md-transition-default-timing;
    transition-property: transform, opacity;
    will-change: transform, opacity;

    @include md-layout-xsmall {
      padding: 0 6px;
    }

    .md-datepicker-month-trigger {
      min-height: 32px;
      margin: 0 46px 10px;
      flex: 1;
      border-radius: 0;
      transition: transform .45s $md-transition-default-timing;
      will-change: transform;
    }
  }

  .md-datepicker-week {
    display: flex;
    align-items: center;

    span {
      flex: 1;
      font-size: 12px;
      text-align: center;
    }
  }

  .md-datepicker-days {
    $md-day-width: 100%;

    display: flex;
    flex-wrap: wrap;

    .md-datepicker-empty,
    .md-datepicker-day {
      margin: 1px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 1 $md-day-width / 7;
    }

    .md-datepicker-day-button {
      $width: 30px;

      width: $width;
      min-width: $width;
      height: $width;
      cursor: pointer;
      border-radius: $width;
      transition: .3s $md-transition-default-timing;
      line-height: $width;
      text-align: center;
    }

    .md-datepicker-selected, .md-datepicker-rangestart, .md-datepicker-rangeend {
      font-weight: 700;
      position: relative;
    }

    .md-datepicker-rangestart::before, .md-datepicker-rangeend::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 50%;
      pointer-events: none;
      z-index: -1;
    }
    .md-datepicker-rangestart::before {
      right: 0;
    }
    .md-datepicker-rangeend::before {
      left: 0;
    }
    .md-datepicker-rangestart.md-datepicker-rangeend::before {
      display: none; // Prevent odd display when start==end
    }

    .md-datepicker-today {
      font-weight: 700;
    }

    .md-datepicker-disabled {
      pointer-events: none;
    }
  }

  .md-datepicker-month-selector {
    padding: 6px 8px 10px;
    flex-wrap: wrap;
    bottom: auto;
    transition: .35s $md-transition-default-timing;
    transition-property: transform, opacity;
    will-change: transform, opacity;

    &.md-datepicker-view-enter,
    &.md-datepicker-view-leave-active {
      transform: translate3d(0, -100%, 0);
    }

    .md-datepicker-year-trigger {
      width: 100%;
      margin: 0 0 8px;
      flex: 1 1 100%;
    }
  }

  .md-datepicker-month-button,
  .md-datepicker-year-button {
    height: 36px;
    margin: 3px 0;
    cursor: pointer;
    transition: .3s $md-transition-default-timing;
    line-height: 36px;
    font-weight: 500;
    text-align: center;
    text-transform: uppercase;
  }

  .md-datepicker-month-button {
    flex: 1 1 33.3333%;
    border-radius: 2px;
    font-size: 13px;
  }

  .md-datepicker-year-selector {
    flex-direction: column;
    overflow: auto;
    bottom: 52px;
    border-bottom: 1px solid;

    &.md-datepicker-view-enter,
    &.md-datepicker-view-leave-active {
      transform: translate3d(0, -100%, 0);
    }

    .md-button {
      min-height: 36px;
    }
  }

  .md-datepicker-year-button {
    font-size: 16px;

    &.md-datepicker-selected {
      font-size: 24px;
    }
  }
</style>