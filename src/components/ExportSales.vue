<template>
  <div class="e-card e-rounding shadow-sm">
    <PremiumBanner/>
    <div class="row">

      <DateRangeFilter ref="dateFilter" @filter-changed="changedFilter"></DateRangeFilter>

      <div class="container">
        <div class="row">
          <div class="col-sm">
            <Loader v-if="(exporting)"/>
          </div>
        </div>
      </div>

      <div class="ml-4">
        <div v-if="!showPremiumText" class="d-flex justify-content-end pt-2">
          <button v-show="!exportFinished && !exporting && rightExportSales" @click="exportReport()" class="btn btn-primary">{{ $t('button.exportExcel') }}</button>
          <a v-show="exportFinished" v-bind:href="bu+'/report/download-report-document?id='+exportDocumentId"
             class="btn btn-primary"><i class="fa fa-download pr-1"></i> {{ $t('button.exportSales') }}</a>
        </div>
        <div v-if="showPremiumText" style="color: darkred">{{ $t('report.premiumOnly')}}</div>
      </div>
      <div style="height: 4rem"/>
      <div v-if="exportFinished === true" class="report-info e-rounding m-2 shadow-sm d-flex align-items-center">
        <i class="fas fa-info-circle pr-3"></i>
        <p class="mb-0">
          {{ $t('salesReport.info') }}
          <br>
          <i>{{ $t('salesReport.group') }}</i>
          <br>
          <a :href="$t('salesReport.link')" target="_blank">{{ $t('salesReport.moreInfo') }}</a>
        </p>
      </div>
    </div>


  </div>
</template>

<script>
import {baseURL} from '@/config/variables'
import PremiumBanner from "@/components/PremiumBanner";
import Loader from "@/components/Loader";
import DateRangeFilter from "@/components/util/DateRangeFilter.vue";
import rightUtil from "@/util/rights"

export default {
  name: 'ExportSales',
  components: {PremiumBanner,Loader,DateRangeFilter},
  data: function () {
    return {
      bu: baseURL,
      ak: localStorage.apiKey,
      exportDocumentId: null,
      exporting: false,
      exportFinished: false,
      showPremiumText: false,
      rightExportSales: false
    }
  },
  mounted() {
    this.rightExportSales = rightUtil.hasRight(rightUtil.codes.exportSales);
  },
  watch: {
    custom() {
      this.exportFinished = false;
    }
  },
  methods: {
    exportReport: function() {
      if(!this.exporting) {
        const vm = this;
        const ft = this.$refs.dateFilter;
        vm.exporting = true;
        this.$http.post('/report/create-report-document', {
          year: ft.selectedYear,
          type: ft.selectedType,
          quarter: ft.selectedQuarter,
          month: ft.selectedMonth,
          day: ft.selectedDay,
          week: ft.selectedWeek,
          custom: JSON.stringify(ft.custom),
          customTime: JSON.stringify(ft.customTime),
          useServerTime: ft.useServerTime
        })
            .then(function (response) {
              vm.exporting = false;
              vm.exportFinished = true;
              vm.exportDocumentId = response.data.documentId;
            }, function () {
              vm.exporting = false;
              vm.exportFinished = false;
            });
      }
    },
    testPremium() {
      if((this.$refs.dateFilter.selectedType!=='day' || this.$refs.dateFilter.selectedDay!=='today') && localStorage.premium === 'false') {
        //not premium
        this.showPremiumText=true;
      } else {
        this.showPremiumText=false;
      }
    },
    changedFilter: function() {
      this.exportFinished = false;
    }
  }
}
</script>

<style>
.report-info {
  background-color: #97bdce;
  padding: 0.5rem;
}
</style>