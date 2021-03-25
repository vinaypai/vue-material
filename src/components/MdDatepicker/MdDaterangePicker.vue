<template>
  <md-field :class="['md-datepicker', { 'md-native': !this.mdOverrideNative }]" :md-clearable="mdClearable" @md-clear="onClear">
    <md-date-icon class="md-date-icon" @click.native="toggleDialog" />
    <md-input :type="type" ref="input" v-model="inputDate" @focus.native="onFocus" :pattern="pattern" />

    <slot />

    <keep-alive>
      <md-daterange-picker-dialog
        v-if="showDialog"
        :md-date-range.sync="localDateRange"
        :md-disabled-dates="mdDisabledDates"
        :mdImmediately="mdImmediately"
        @md-closed="toggleDialog"
      />
    </keep-alive>

    <md-overlay class="md-datepicker-overlay" md-fixed :md-active="showDialog" @click="toggleDialog" />
  </md-field>
</template>

<script>
  import Vue from 'vue'
  import isFirefox from 'is-firefox'
  import format from 'date-fns/format'
  import parse from 'date-fns/parse'
  import isValid from 'date-fns/isValid'
  import MdPropValidator from 'core/utils/MdPropValidator'
  import MdOverlay from 'components/MdOverlay/MdOverlay'
  import MdDaterangePickerDialog from './MdDaterangePickerDialog'
  import MdDateIcon from 'core/icons/MdDateIcon'
  import MdDebounce from 'core/utils/MdDebounce'
  import MdField from 'components/MdField/MdField'
  import MdInput from 'components/MdField/MdInput/MdInput'

  const rangeJoin = ' to ';

  export default {
    name: 'MdDaterangePicker',
    components: {
      MdOverlay,
      MdDateIcon,
      MdField,
      MdInput,
      MdDaterangePickerDialog
    },
    props: {
      value: {
        type: Array,
        validator(value) {
          if(!Array.isArray(value) || value.length != 2) {
            Vue.util.warn('Invalid value: Array of length 2 required')
          } else if(value[0].constructor !== value[1].constructor) {
            Vue.util.warn('Invalid value: Both elements must have the same type')
          } else {
            return true;
          }

          return false;
        }
      },
      mdDisabledDates: [Array, Function],
      mdOpenOnFocus: {
        type: Boolean,
        default: true
      },
      mdOverrideNative: {
        type: Boolean,
        default: true
      },
      mdImmediately: {
        type: Boolean,
        default: false
      },
      mdModelType: {
        type: Function,
        default: Date,
        ...MdPropValidator('md-model-type', [Date, String, Number])
      },
      MdDebounce: {
        type: Number,
        default: 1000
      },
      mdClearable: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      showDialog: false,
      // String for input
      inputDate: '',
      // Date for real value
      localDateRange: null
    }),
    computed: {
      locale () {
        return this.$material.locale
      },
      type () {
        return this.mdOverrideNative
          ? 'text'
          : 'date'
      },
      dateFormat () {
        return this.locale.dateFormat || 'yyyy-MM-dd'
      },
      modelType () {
        if (this.isModelTypeString) {
          return String
        } else if (this.isModelTypeNumber) {
          return Number
        } else if (this.isModelTypeDate) {
          return Date
        } else {
          return this.mdModelType
        }
      },
      isModelNull () {
        return this.value === null || this.value === undefined
      },
      isModelTypeString () {
        return !this.isModelNull && typeof this.value[0] === 'string'
      },
      isModelTypeNumber () {
        return !this.isModelNull && Number.isInteger(this.value[0]) && this.value[0] >= 0
      },
      isModelTypeDate () {
        return !this.isModelNull && typeof this.value[0] === 'object' && this.value[0] instanceof Date && isValid(this.value[0])
      },
      localString () {
        return this.localDateRange && this.localDateRange.map(ld => format(ld, this.dateFormat))
      },
      localNumber () {
        return this.localDateRange && this.localDateRange.map(ld => Number(ld))
      },
      parsedInputDate () {
        const parsedRange = this.inputDate
          .split(rangeJoin, 2)
          .map(dp => parse(dp, this.dateFormat, new Date()))
          .filter(itm => isValid(itm));

        return parsedRange.length == 2 ? parsedRange : null
      },
      pattern () {
        return this.dateFormat.replace(/yyyy|MM|dd/g, match => {
          switch (match) {
          case 'yyyy':
            return '[0-9]{4}'
          case 'MM':
          case 'dd':
            return '[0-9]{2}'
          }
        })
      }
    },
    watch: {
      inputDate (value) {
        this.inputDateToLocalDate()
      },
      localDateRange () {
        this.inputDate = this.localString ? this.localString.join(rangeJoin) : ''
        if (this.modelType === Date) {
          this.$emit('input', this.localDateRange)
        }
      },
      localString () {
        if (this.modelType === String) {
          this.$emit('input', this.localString)
        }
      },
      localNumber () {
        if (this.modelType === Number) {
          this.$emit('input', this.localNumber)
        }
      },
      value: {
        immediate: true,
        handler (oldVal, newVal) {
          // Avoid a possible infinite loop. valueDateToLocalDate
          // can map the input value into an equivalent array but
          // that will stil trigger the watch again a === b is false
          if(JSON.stringify(oldVal) != JSON.stringify(newVal)) {
            this.valueDateToLocalDate()
          }
        }
      },
      mdModelType (type) {
        switch (type) {
        case Date:
          this.$emit('input', this.localDateRange)
          break
        case String:
          this.$emit('input', this.localString)
          break
        case Number:
          this.$emit('input', this.localNumber)
          break
        }
      },
      dateFormat () {
        if (this.localDateRange) {
          this.inputDate = this.localDateRange.map(ld => format(ld, this.dateFormat))
        }
      }
    },
    methods: {
      toggleDialog () {
        if (!isFirefox || this.mdOverrideNative) {
          this.showDialog = !this.showDialog
          if (this.showDialog) {
            this.$emit('md-opened')
          } else {
            this.$emit('md-closed')
          }
        } else {
          this.$refs.input.$el.click()
        }
      },
      onFocus () {
        if (this.mdOpenOnFocus) {
          this.toggleDialog()
        }
      },
      inputDateToLocalDate () {
        if (this.inputDate) {
          if (this.parsedInputDate) {
            this.localDateRange = this.parsedInputDate
          }
        } else {
          this.localDateRange = null
        }
      },
      valueDateToLocalDate () {
        if (this.isModelNull) {
          this.localDateRange = null
        } else if (this.isModelTypeNumber) {
          this.localDateRange = this.value.map(v => new Date(v))
        } else if (this.isModelTypeDate) {
          this.localDateRange = this.value
        } else if (this.isModelTypeString) {
          let parsedRange = this.value.map(v => parse(v, this.dateFormat, new Date()));

          if(parsedRange.find(pd => !isValid(pd))) {
            Vue.util.warn(`The datepicker value is not a valid date. Given value: ${this.value}, format: ${this.dateFormat}`)
          } else {
            this.localDateRange = parsedRange;
          }
        } else {
          Vue.util.warn(`The datepicker value is not a valid date. Given value: ${this.value}`)
        }
      },
      onClear () {
        this.$emit('md-clear')
      }
    },
    created () {
      this.inputDateToLocalDate = MdDebounce(this.inputDateToLocalDate, this.MdDebounce)
    }
  }
</script>

<style lang="scss">
  @import "~components/MdAnimation/variables";
  @import "~components/MdLayout/mixins";

  .md-datepicker-overlay {
    opacity: 0;

    @include md-layout-xsmall {
      opacity: 1;
    }
  }

  .md-datepicker {
    &.md-native {
      label {
        top: 0 !important;
      }
    }

    .md-date-icon {
      cursor: pointer;
    }

    input[type=date]::-webkit-clear-button,
    input[type=date]::-webkit-inner-spin-button,
    input[type=date]::-webkit-calendar-picker-indicator {
      display: none;
    }
  }
</style>
