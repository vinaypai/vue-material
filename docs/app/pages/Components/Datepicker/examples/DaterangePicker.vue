<template>
  <div>
    <div class="block">
      <h3>Basic</h3>
      <md-daterange-picker v-model="selectedRange" />
    </div>
    <div class="block">
      <h3>With Prefilled Value</h3>
      <md-daterange-picker v-model="prefilledValue" />
    </div>
    <div class="block">
      <h3>Only Allow &plusmn; 7 Days of Today</h3>
      <md-daterange-picker :md-disabled-dates="dateFilter" v-model="selectedLimitedRange" />
    </div>  </div>
</template>

<script>
  import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

  export default {
    name: 'DaterangePicker',
    data: () => ({
      selectedRange: null,
      prefilledValue: ['2020-03-15', '2020-05-20'],
      selectedLimitedRange: null
    }),
    methods: {
      dateFilter(date) {
        const today = new Date();
        return Math.abs(differenceInCalendarDays(today, date)) > 7;
      }
    }
  }
</script>
