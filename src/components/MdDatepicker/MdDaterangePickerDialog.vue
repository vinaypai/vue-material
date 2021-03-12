<template>
  <md-popover :md-settings="popperSettings" md-active>
    <transition name="md-datepicker-dialog" appear @enter="setContentStyles" @after-leave="resetDate">
      <div class="md-daterange-picker-dialog" :class="[$mdActiveTheme]">
        <div class="md-datepicker-header">
          <span class="md-datepicker-year-select" :class="{ 'md-selected': currentView === 'year' }" @click="currentView = 'year'">{{ selectedYear }}</span>
          <div class="md-datepicker-date-select" :class="{ 'md-selected': currentView !== 'year' }" @click="currentView = 'day'">
            <strong class="md-datepicker-dayname">{{ shortDayName }}, </strong>
            <strong class="md-datepicker-monthname">{{ shortMonthName }}</strong>
            <strong class="md-datepicker-day">{{ currentDay }}</strong>
          </div>
        </div>

        <div class="md-daterange-picker-calendars">
          <md-datepicker-body
            v-model="selectedRange"
            :style="contentStyles"
            :md-current-date="currentDateLeft" @update:mdCurrentDate="updateLeftCurrentDate"
            :md-current-view.sync="currentViewLeft"
            :md-hovering-date.sync="hoveringDate"
            :md-disabled-dates="mdDisabledDates"
            @input="onDateSelect"
            />

          <md-datepicker-body
            v-model="selectedRange"
            :style="contentStyles"
            :md-current-date="currentDateRight" @update:mdCurrentDate="updateRightCurrentDate"
            :md-current-view.sync="currentViewRight"
            :md-disabled-dates="mdDisabledDates"
            :md-hovering-date.sync="hoveringDate"
            @input="onDateSelect"
            />
        </div>

        <md-dialog-actions class="md-datepicker-body-footer">
          <md-button class="md-primary" @click="onCancel">{{ locale.cancel }}</md-button>
          <md-button v-if="!mdImmediately" class="md-primary" @click="onConfirm">{{ locale.confirm }}</md-button>
        </md-dialog-actions>
      </div>
    </transition>
  </md-popover>
</template>

<script>
  import addMonths from 'date-fns/addMonths'
  import getDate from 'date-fns/getDate'
  import getDay from 'date-fns/getDay'
  import getMonth from 'date-fns/getMonth'
  import getYear from 'date-fns/getYear'
  import isAfter from 'date-fns/isAfter'
  import isBefore from 'date-fns/isBefore'
  import isSameMonth from 'date-fns/isSameMonth'

  import MdComponent from 'core/MdComponent'
  import MdPopover from 'components/MdPopover/MdPopover'
  import MdDialog from 'components/MdDialog/MdDialog'

  import MdDatepickerBody from './MdDatepickerBody'


  const getElements = (el, selector) => {
    if (el && el.querySelector) {
      return el.querySelectorAll(selector)
    }

    return false
  }

  export default new MdComponent({
    name: 'MdDaterangePickerDialog',
    components: {
      MdPopover,
      MdDialog,
      MdDatepickerBody,
    },
    props: {
      mdDateRange: Array,
      mdDisabledDates: [Array, Function],
      mdImmediately: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      currentDateLeft: null,
      currentDateRight: null,
      selectedRange: [null, null],
      showDialog: false,
      currentViewLeft: 'day',
      contentStyles: {},
      hoveringDate: null
    }),
    computed: {
      locale () {
        return this.$material.locale
      },
      popperSettings () {
        return {
          placement: 'bottom-start',
          modifiers: {
            keepTogether: {
              enabled: true
            },
            flip: {
              enabled: false
            }
          }
        }
      },
      selectedDate() { // TODO: Remove this
        return this.selectedRange[0];
      },
      currentDate() { // TODO: Remove this
        return this.currentDateLeft;
      },
      currentDay () {
        if (this.selectedDate) {
          return getDate(this.selectedDate)
        }

        return getDate(this.currentDate)
      },
      selectedYear () {
        if (this.selectedDate) {
          return getYear(this.selectedDate)
        }

        return getYear(this.currentDate)
      },
      shortDayName () {
        if (this.selectedDate) {
          return this.locale.shortDays[getDay(this.selectedDate)]
        }

        return this.locale.shortDays[getDay(this.currentDate)]
      },
      shortMonthName () {
        if (this.selectedDate) {
          return this.locale.shortMonths[getMonth(this.selectedDate)]
        }

        return this.locale.shortMonths[getMonth(this.currentDate)]
      },
    },
    watch: {
      mdDateRange () {
        this.selectedRange = this.mdDateRange || [null, null]
        this.resetCurrentDates()
      },
      currentDate (next, previous) {
        this.$nextTick().then(() => {
          if (previous) {
            this.setContentStyles()
          }
        })
      },
    },
    methods: {
      setContentStyles() {
        const months = getElements(this.$el, '.md-datepicker-month')
        if (months.length) {
          const nextMonth = months[months.length - 1]

          if(nextMonth.offsetHeight) {
            this.contentStyles = {
              height: nextMonth.offsetHeight + 10 + 'px'
            }
          }
        }
      },
      handleDisabledDateByArray (date) {
        return this.mdDisabledDates.some(disabledDate => isSameDay(disabledDate, date))
      },
      closeDialog () {
        this.$emit('md-closed')
      },
      onClose () {
        this.closeDialog()
      },
      onCancel () {
        this.closeDialog()
      },
      onConfirm () {
        this.$emit('update:mdDateRange', this.selectedRange)
        this.closeDialog()
      },
      resetDate () {
        this.selectedRange = this.mdDateRange || [null, null]
        this.resetCurrentDates()
        this.currentViewLeft = 'day'
        this.currentViewRight = 'day'
      },
      resetCurrentDates() {
        this.currentDateLeft = this.selectedRange[0] || new Date()

        if(this.selectedRange[1] && !isSameMonth(this.selectedRange[1], this.currentDateLeft)) {
          this.currentDateRight = this.selectedRange[1]
        } else {
          this.currentDateRight = addMonths(this.currentDateLeft, 1)
        }
      },
      onDateSelect() {
        // Only emit update event if we're in a day view, not switching months or years
        if (this.mdImmediately && this.currentViewLeft === 'day' && this.currentViewRight === 'day') {
          this.$emit('update:mdDateRange', this.selectedRange)
          this.closeDialog()
        }
      },
      updateLeftCurrentDate(date) {
        // Don't allow the left calendar to be >= the right calendar
        if(isAfter(date, this.currentDateRight) || isSameMonth(date, this.currentDateRight)) {
          return;
        }

        this.currentDateLeft = date;
      },
      updateRightCurrentDate(date) {
        // Don't allow the right calendar to be <= the right calendar
        if(isBefore(date, this.currentDateLeft) || isSameMonth(date, this.currentDateLeft)) {
          return;
        }

        this.currentDateRight = date;
      },
    },
    created () {
      this.resetDate()
    }
  })
</script>

<style lang="scss">
  @import "~components/MdAnimation/variables";
  @import "~components/MdLayout/mixins";
  @import "~components/MdElevation/mixins";

  $md-calendar-width: 320px;
  $md-calendar-mobile-width: 296px;

  .md-daterange-picker-dialog {
    @include md-elevation(24);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 110;
    border-radius: 2px;
    backface-visibility: hidden;
    pointer-events: auto;
    transform-origin: top left;
    flex-shrink: 0;
    transition: opacity .2s $md-transition-stand-timing,
                transform .35s $md-transition-stand-timing;
    will-change: opacity, transform, left, top;

    @include md-layout-xsmall {
      top: 50% !important;
      left: 50% !important;
      transform: translate3D(-50%, -50%, 0);
      transform-origin: center center;
      position: fixed !important;
    }
  }

  .md-datepicker-dialog-leave-active {
    opacity: 0;
  }

  .md-datepicker-dialog-enter {
    opacity: 0;
    transform: scale(.9);

    @include md-layout-xsmall {
      transform: translate3D(-50%, -50%, 0) scale(.9);
    }

    .md-datepicker-body {
      .md-datepicker-calendar {
        opacity: 0;
        transform: translate3D(0, 10%, 0);
      }
    }
  }

  .md-datepicker-header {
    min-width: 150px;
    padding: 16px;

    @include md-layout-xsmall {
      min-width: auto;
      padding: 16px 20px;
    }

    .md-datepicker-year-select {
      cursor: pointer;
      opacity: .54;
      transition: opacity .3s $md-transition-default-timing;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: .01em;
      line-height: 24px;
    }

    .md-datepicker-date-select {
      cursor: pointer;
      opacity: .54;
      transition: opacity .3s $md-transition-default-timing;
      font-size: 32px;
      font-weight: 900;
      letter-spacing: 0;
      line-height: 1.2em;
    }

    .md-datepicker-dayname {
      display: block;

      @include md-layout-xsmall {
        display: inline-block;
      }
    }

    .md-selected {
      opacity: 1;
    }
  }

  .md-daterange-picker-calendars {
    display: flex;

    .md-datepicker-body:first-child {
      margin-right: 16px;
    }

    @include md-layout-xsmall {
      flex-direction: column;

      .md-datepicker-body:first-child {
        margin-right: 0;
        margin-bottom: 16px;
      }
    }
  }

</style>
