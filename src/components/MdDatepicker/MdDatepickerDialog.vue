<template>
  <md-popover :md-settings="popperSettings" md-active>
    <transition name="md-datepicker-dialog" appear @enter="setContentStyles" @after-leave="resetDate">
      <div class="md-datepicker-dialog" :class="[$mdActiveTheme]">
        <div class="md-datepicker-header">
          <span class="md-datepicker-year-select" :class="{ 'md-selected': currentView === 'year' }" @click="currentView = 'year'">{{ selectedYear }}</span>
          <div class="md-datepicker-date-select" :class="{ 'md-selected': currentView !== 'year' }" @click="currentView = 'day'">
            <strong class="md-datepicker-dayname">{{ shortDayName }}, </strong>
            <strong class="md-datepicker-monthname">{{ shortMonthName }}</strong>
            <strong class="md-datepicker-day">{{ currentDay }}</strong>
          </div>
        </div>

        <div>
          <md-datepicker-body
            v-model="selectedDate"
            :style="contentStyles"
            :md-current-date.sync="currentDate"
            :md-current-view.sync="currentView"
            :md-disabled-dates="mdDisabledDates"
            @input="onDateSelect"
             />

          <md-dialog-actions class="md-datepicker-body-footer">
            <md-button class="md-primary" @click="onCancel">{{ locale.cancel }}</md-button>
            <md-button v-if="!mdImmediately" class="md-primary" @click="onConfirm">{{ locale.confirm }}</md-button>
          </md-dialog-actions>
        </div>
      </div>
    </transition>
  </md-popover>
</template>

<script>
  import getDate from 'date-fns/getDate'
  import getDay from 'date-fns/getDay'
  import getMonth from 'date-fns/getMonth'
  import getYear from 'date-fns/getYear'

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
    name: 'MdDatepickerDialog',
    components: {
      MdPopover,
      MdDialog,
      MdDatepickerBody,
    },
    props: {
      mdDate: Date,
      mdDisabledDates: [Array, Function],
      mdImmediately: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      currentDate: null,
      selectedDate: null,
      showDialog: false,
      currentView: 'day',
      contentStyles: {},
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
      mdDate () {
        this.currentDate = this.mdDate || new Date()
        this.selectedDate = this.mdDate
      },
      currentDate (next, previous) {
        this.$nextTick().then(() => {
          if (previous) {
            this.setContentStyles()
          }
        })
      },
      currentView () {
        this.$nextTick().then(() => {
          if (this.currentView === 'year') {
            const activeYear = getElements(this.$el, '.md-datepicker-year-button.md-datepicker-selected')

            if (activeYear.length) {
              activeYear[0].scrollIntoView({
                behavior: 'instant',
                block: 'center',
                inline: 'center'
              })
            }
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
        this.$emit('update:mdDate', this.selectedDate)
        this.closeDialog()
      },
      resetDate () {
        this.currentDate = this.mdDate || new Date()
        this.selectedDate = this.mdDate
        this.currentView = 'day'
      },
      onDateSelect() {
        // Only emit update event if we're in a day view, not switching months or years
        if (this.mdImmediately && this.currentView === 'day') {
          this.$emit('update:mdDate', this.selectedDate)
          this.closeDialog()
        }
      }
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

  .md-datepicker-dialog {
    @include md-elevation(24);
    display: flex;
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
      flex-direction: column;
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

    .md-datepicker-selected {
      font-weight: 700;
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
