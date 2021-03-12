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
</style>
