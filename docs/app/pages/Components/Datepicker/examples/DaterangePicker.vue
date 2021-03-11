<template>
  <div>
    <md-daterange-picker v-model="selectedDate" />
  </div>
</template>

<script>
  export default {
    name: 'DaterangePicker',
    data: () => ({
      selectedDate: null
    }),
  }
</script>
