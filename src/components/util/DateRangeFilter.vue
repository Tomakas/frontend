<template>
  <div class="container">
    <div class="row">
      <div class="col-sm">
        <div>
          <label for="type">{{ $t('form.selectType') }}</label>
          <select v-model="selectedType" class="form-control" id="type" @change="changed()">
            <option v-for="type in types" v-bind:value="type" v-bind:key="type">
              {{ getTypeName(type) }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-sm">
        <div v-show="selectedType==='year' || selectedType==='quarterYear' || selectedType==='month'" class="form-group">
          <label for="year">{{ $t('form.selectYear') }}</label>
          <select v-model="selectedYear" class="form-control" id="year" @change="changed()">
            <option v-for="year in years" v-bind:value="year" v-bind:key="year">
              {{ year }}
            </option>
          </select>
        </div>
        <div v-show="selectedType==='day'" class="form-group">
          <label for="month">{{ $t('form.selectDay') }}</label>
          <select v-model="selectedDay" class="form-control" id="day" @change="changed()">
            <option v-for="day in days" v-bind:value="day" v-bind:key="day">
              {{ getDayName(day) }}
            </option>
          </select>
        </div>
        <div v-show="selectedType==='week'" class="form-group">
          <label for="week">{{ $t('form.selectWeek') }}</label>
          <select v-model="selectedWeek" class="form-control" id="week" @change="changed()">
            <option v-for="week in weeks" v-bind:value="week" v-bind:key="week">
              {{ getWeekName(week) }}
            </option>
          </select>
        </div>
        <div v-show="selectedType==='custom'" class="form-group">
          <label for="custom_selection">{{ $t('form.selectRange') }}</label>
          <date-picker id="custom_selection" v-model="custom" :lang="$i18n.locale" :default-value="getPreviousMonth()" @change="changed()" value-type="YYYY-MM-DD" range></date-picker>
        </div>
        <div v-show="selectedType==='customTime'" class="form-group">
          <label for="custom_selection">{{ $t('form.selectRange') }}</label>
          <date-picker id="custom_selection" v-model="customTime" :lang="$i18n.locale" :default-value="new Date()" @change="changed()" type="datetime" value-type="YYYY-MM-DDTHH:mm:ss" range></date-picker>
        </div>
      </div>
      <div class="col-sm">
        <div v-show="selectedType==='quarterYear'" class="form-group">
          <label for="quarter">{{ $t('form.selectQuarter') }}</label>
          <select v-model="selectedQuarter" class="form-control" id="quarter" @change="changed()">
            <option v-for="quarter in quarters" v-bind:value="quarter" v-bind:key="quarter">
              {{ getQuarterName(quarter) }}
            </option>
          </select>
        </div>
        <div v-show="selectedType==='month'" class="form-group">
          <label for="month">{{ $t('form.selectMonth') }}</label>
          <select v-model="selectedMonth" class="form-control" id="month" @change="changed()">
            <option v-for="month in months" v-bind:value="month" v-bind:key="month">
              {{ getMonthName(month) }}
            </option>
          </select>
        </div>
        <div v-show="hideServerTimeOption!==true && (selectedType==='custom' || selectedType==='customTime')" class="form-group">
          <label></label>
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" role="switch" id="useServerTime" v-model="useServerTime" @change="changed()">
            <label class="custom-control-label" for="useServerTime">{{ $t('dateSelection.useServerTime') }}</label> <i v-tooltip="$t('dateSelection.useServerTime.info')" class="far fa-question-circle"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DatePicker from "vue2-datepicker";
import 'vue2-datepicker/locale/cs';
import 'vue2-datepicker/locale/es';
import 'vue2-datepicker/locale/it';
import 'vue2-datepicker/index.css';

export default {
  name: 'DateRangeFilter',
  components: {DatePicker},
  props: {
    hideServerTimeOption: { required: false }
  },
  data: function () {
    return {
      selectedYear: new Date().getFullYear(),
      selectedType: 'day',
      selectedQuarter: 1,
      selectedMonth: new Date().getMonth() + 1,
      selectedDay: 'today',
      selectedWeek: 'thisWeek',
      years: [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2],
      types: ['year', 'quarterYear', 'month', 'week', 'day', 'custom', 'customTime'],
      quarters: [1, 2, 3, 4],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      days: ['today','yesterday','d2','d3','d4','d5','d6'],
      weeks: ['thisWeek','previousWeek'],
      custom: [],
      customTime:[],
      useServerTime: false,
    }
  },
  mounted: function () {
    this.readFromLocalStorage();
  },
  methods: {
    getPreviousMonth: function() {
      let date = new Date();
      date.setMonth(date.getMonth() - 1);
      return date;
    },
    getTypeName: function (type) {
      return this.$t('saleType.' + type);
    },
    getQuarterName: function (q) {
      return this.$t('quarter.' + q);
    },
    getMonthName: function (m) {
      return this.$t('month.' + m);
    },
    getDayName: function (day) {
      let date = null;
      if(day==='d2') {
        date = new Date();
        date.setDate(date.getDate()-2);
      }
      if(day==='d3') {
        date = new Date();
        date.setDate(date.getDate()-3);
      }
      if(day==='d4') {
        date = new Date();
        date.setDate(date.getDate()-4);
      }
      if(day==='d5') {
        date = new Date();
        date.setDate(date.getDate()-5);
      }
      if(day==='d6') {
        date = new Date();
        date.setDate(date.getDate()-6);
      }
      if(date!==null) {
        return date.toLocaleDateString(this.$i18n.locale);
      }
      return this.$t('day.' + day);
    },
    getWeekName: function(week) {
      return this.$t('week.' + week);
    },
    changed: function() {
      this.$emit('filter-changed');
      this.writeToLocalStorage();
    },
    readFromLocalStorage: function() {
      const vm = this;
      if (localStorage.getItem("dateFilterV2") !== null) {
        const f = JSON.parse(localStorage.getItem('dateFilterV2'));
        vm.selectedYear = f.selectedYear;
        vm.selectedType = f.selectedType;
        vm.selectedQuarter = f.selectedQuarter;
        vm.selectedMonth = f.selectedMonth;
        vm.selectedDay = f.selectedDay;
        vm.selectedWeek = f.selectedWeek;
        vm.custom = f.custom;
        vm.customTime = f.customTime;
      }
    },
    writeToLocalStorage: function() {
      const vm = this;
      const f = {
        selectedYear: vm.selectedYear,
        selectedType: vm.selectedType!=='all'?vm.selectedType:'year',
        selectedQuarter: vm.selectedQuarter,
        selectedMonth: vm.selectedMonth,
        selectedDay: vm.selectedDay,
        selectedWeek: vm.selectedWeek,
        custom: vm.custom,
        customTime: vm.customTime
      }
      localStorage.setItem('dateFilterV2', JSON.stringify(f));
    }
  }
}
</script>