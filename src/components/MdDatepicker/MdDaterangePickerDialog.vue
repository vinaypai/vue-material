<template>
  <md-popover :md-settings="popperSettings" md-active>
    <transition name="md-datepicker-dialog" appear @enter="setContentStyles" @after-leave="resetDate">
      <div class="md-daterange-picker-dialog" :class="[$mdActiveTheme]">
        <div class="md-datepicker-header">
          <span class="md-datepicker-range-display">{{ rangeDisplay }}</span>
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
  import getMonth from 'date-fns/getMonth'
  import getYear from 'date-fns/getYear'
  import isAfter from 'date-fns/isAfter'
  import isBefore from 'date-fns/isBefore'
  import isSameMonth from 'date-fns/isSameMonth'
  import isSameYear from 'date-fns/isSameYear'

  import MdComponent from 'core/MdComponent'
  import MdPopover from 'components/MdPopover/MdPopover'
  import MdDialog from 'components/MdDialog/MdDialog'

  import MdDatepickerBody from './MdDatepickerBody'
import { isSameDay } from 'date-fns/fp'


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
      currentViewRight: 'day',
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
      rangeDisplay() {
        const shortMonth = (date) => this.locale.shortMonths[getMonth(date)];
        const fmt = (date) => `${shortMonth(date)} ${getDate(date)}, ${getYear(date)}`;
        const endash = '\u2013';

        if(!this.selectedRange[0] && !this.selectedRange[1]) {
          return "Select Range";
        } else if(this.selectedRange[0] && this.selectedRange[1]) {
          if(isSameDay(...this.selectedRange)) {
            return fmt(this.selectedRange[0]);
          } else if(isSameMonth(...this.selectedRange)) {
            // Jan 1–5, 2020
            return shortMonth(this.selectedRange[0]) + ' ' +
              getDate(this.selectedRange[0]) + endash + getDate(this.selectedRange[1]) + ", " +
              getYear(this.selectedRange[0])
          } else if(isSameYear(...this.selectedRange)) {
            // Jan 1–Feb 5, 2020
            return shortMonth(this.selectedRange[0]) + ' ' + getDate(this.selectedRange[0]) + endash +
              shortMonth(this.selectedRange[1]) + ' ' + getDate(this.selectedRange[1]) + ', ' +
              getYear(this.selectedRange[0])
          } else {
            return fmt(this.selectedRange[0]) + endash + fmt(this.selectedRange[1]);
          }
        } else {
          let date = this.selectedRange[0] || this.selectedRange[1];
          let fmtDate = fmt(date);
          if(this.hoveringDate && isBefore(this.hoveringDate, date)) {
            return '?' + endash + fmtDate;
          } else {
            return fmtDate + endash + '?';
          }
        }
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
    padding: 16px;

    @include md-layout-xsmall {
      padding: 16px 20px;
    }

    .md-datepicker-range-display {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: 0;
      line-height: 1.2em;
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
