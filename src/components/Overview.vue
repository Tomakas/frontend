<template>
  <div class="e-card e-rounding shadow-sm">
    <PremiumBanner/>
    <div class="row">

      <DateRangeFilter ref="dateFilter" @filter-changed="fillData" :hide-server-time-option="true"></DateRangeFilter>

      <div class="container">
        <div class="row">
          <div class="col-sm">
            <Loader v-if="(exporting || loadingGraphs)"/>
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

<div v-if="!exportFinished && valid" class="mt-4">
  <div class="container">
    <div class="row">
      <div class="col-sm">
        <div class="card-header e-user__header">
          <span>{{ $t('sales.total')}}: {{ amountTotal }}</span>
        </div>
        <div class="card-body py-5 px-4" v-if="amountDataCollection!==null">
          <Bar :chart-data="amountDataCollection" />
        </div>
      </div>
      <div class="col-sm">
        <div class="card-header e-user__header">
          <span>{{ $t('receipts.total')}}: {{ receiptsTotal}}</span>
        </div>
        <div class="card-body py-5 px-4" v-if="receiptDataCollection !==null">
          <LineChart :chart-data="receiptDataCollection" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm">
        <div class="custom-control custom-switch" v-show="showCompare">
          <input type="checkbox" v-model="comparePrevious" class="custom-control-input" role="switch" id="comparePrevious" @change="fillData()">
          <label class="custom-control-label" for="comparePrevious">{{ $t('graph.comparePrevious')}} {{ previousName!==''?'-':''}} {{previousName}}</label>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm">
        <div class="card-header e-user__header">
          <span>{{ $t('graph.paymentTypes')}}</span>
        </div>
        <div class="card-body py-5 px-4" v-if="paymentsDataCollection!==null">
          <Pie :chart-data="paymentsDataCollection" :chart-options="pieOptions"/>
        </div>
      </div>
      <div class="col-sm">
        <div class="card-header e-user__header">
          <span>{{ $t('graph.topItems')}}</span>
        </div>
        <div class="card-body py-5 px-4" v-if="topItemsDataCollection!==null">
          <Bar :chart-data="topItemsDataCollection" />
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">
      <div class="col-sm">
        <div>
          <div class="card-header e-user__header">{{ $t('sales.sellerSales')}}</div>
          <table class="table table-hover e-table--responsive">
            <thead>
            <tr>
              <th>{{ $t('form.user.userName') }}</th>
              <th style="white-space: nowrap;" class="num">{{ $t('sales.total')}}</th>
              <th class="num">{{ $t('sales.totalReceipts') }}</th>
              <th class="num">{{ $t('sales.totalReceiptsPrinted') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="data in userDetail" v-bind:key="data.userName">
              <td :data-title="$t('form.user.userName')">{{data.userName}}</td>
              <td style="white-space: nowrap;" :data-title="$t('sales.total')" class="num">{{data.total}}</td>
              <td :data-title="$t('sales.totalReceipts')" class="num">{{data.receipts}}</td>
              <td :data-title="$t('sales.totalReceiptsPrinted')" class="num">{{data.multiplePrints}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-sm">
        <div>
          <div class="card-header e-user__header">{{ $t('sales.topSales') }}</div>
          <table class="table table-hover e-table--responsive">
            <thead>
            <tr>
              <th>{{ $t('sales.item')}}</th>
              <th class="num">{{ $t('sales.total')}}</th>
              <th class="num">{{ $t('sales.quantity')}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in topItems" v-bind:key="item.itemName">
              <td :data-title="$t('sales.item')">{{item.itemName}}</td>
              <td :data-title="$t('sales.total')" class="num">{{item.totalPriceStr}}</td>
              <td :data-title="$t('sales.quantity')" class="num">{{item.quantityStr}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

    </div>
  </div>
</template>

<script>
import {baseURL} from '@/config/variables'
import PremiumBanner from "@/components/PremiumBanner";
import Loader from "@/components/Loader";
import utils from "@/util/util";
import { Bar } from 'vue-chartjs'
import { Pie } from 'vue-chartjs'
import { Line as LineChart } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineController, LineElement, PieController, ArcElement } from 'chart.js'
import DateRangeFilter from "@/components/util/DateRangeFilter.vue";
import rightUtil from "@/util/rights"

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineController, LineElement, PieController, ArcElement)

export default {
  name: 'Overview',
  components: {Bar,LineChart,Pie,PremiumBanner,Loader,DateRangeFilter},
  data: function () {
    return {
      bu: baseURL,
      ak: localStorage.apiKey,
      amountDataCollection: null,
      receiptDataCollection : null,
      paymentsDataCollection : null,
      topItemsDataCollection : null,
      currency: '',
      total: '',
      amountTotal: '',
      receiptsTotal: '',
      name: '',
      options: {
      },
      userDetail: [],
      exportDocumentId: null,
      exporting: false,
      exportFinished: false,
      showPremiumText: false,
      topItems: [],
      comparePrevious: false,
      previousName: '',
      valid : true,
      pieOptions: {
        aspectRatio:2
      },
      loadingGraphs: false,
      showCompare: false,
      rightExportSales: false
    }
  },
  mounted() {
    this.fillData();

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
    fillData() {
      this.testPremium();
      this.exportFinished = false;
      this.showCompare = this.$refs.dateFilter.selectedType !== 'custom' && this.$refs.dateFilter.selectedType !== 'customTime';
      const url = '/chart/get-chart';
      if(this.$refs.dateFilter.selectedType === 'year') {
        this.fillDataCall(url,{year: this.$refs.dateFilter.selectedYear, generatePreviousPeriod: this.comparePrevious});
      }
      if(this.$refs.dateFilter.selectedType === 'quarterYear') {
        this.fillDataCall(url,{year: this.$refs.dateFilter.selectedYear, quarter:this.$refs.dateFilter.selectedQuarter, generatePreviousPeriod: this.comparePrevious});
      }
      if(this.$refs.dateFilter.selectedType === 'month') {
        this.fillDataCall(url,{year: this.$refs.dateFilter.selectedYear, month: this.$refs.dateFilter.selectedMonth, generatePreviousPeriod: this.comparePrevious});
      }
      if(this.$refs.dateFilter.selectedType === 'day') {
        this.fillDataCall(url,{day: this.$refs.dateFilter.selectedDay, generatePreviousPeriod: this.comparePrevious});
      }
      if(this.$refs.dateFilter.selectedType === 'week') {
        this.fillDataCall(url,{week: this.$refs.dateFilter.selectedWeek, generatePreviousPeriod: this.comparePrevious});
      }
      if(this.$refs.dateFilter.selectedType === 'custom') {
        this.fillDataCall(url,{custom: JSON.stringify(this.$refs.dateFilter.custom)});
      }
      if(this.$refs.dateFilter.selectedType === 'customTime') {
        this.fillDataCall(url,{customTime: JSON.stringify(this.$refs.dateFilter.customTime)});
      }
    },
    fillDataCall(url,data) {
      const vm = this;
      vm.loadingGraphs = true;
      this.$http.post(url, data)
          .then(function (response) {
            vm.amountDataCollection = {
              labels: response.data.x,
              datasets: [
                {
                  label: response.data.name + ' ' + vm.$t('graph.sales') + ' ' + response.data.currency + ' ',
                  backgroundColor: '#8ca35c',
                  data: response.data.amount
                }
              ]
            }
            if(response.data.previousName !== null) {
              //show also previous data set
              vm.amountDataCollection.datasets.push(
                  {
                    label: response.data.previousName + ' ' + vm.$t('graph.sales') + ' ' + response.data.currency + ' ',
                    backgroundColor: '#5c9da3',
                    data: response.data.previousAmount
                  }
              );
            }

            vm.receiptDataCollection = {
              labels: response.data.x,
              datasets: [
                {
                  label: response.data.name + ' ' + vm.$t('graph.receipts'),
                  backgroundColor: '#21618d',
                  borderColor: '#36A2EBFF',
                  data: response.data.receipts
                }
              ]
            }
            if(response.data.previousName !== null) {
              vm.previousName = response.data.previousName;
              //show also previous data set
              vm.receiptDataCollection.datasets.push(
                  {
                    label: response.data.previousName + ' ' + vm.$t('graph.receipts'),
                    borderColor: '#74e7f3',
                    backgroundColor: '#74e7f3',
                    data: response.data.previousReceipts
                  }
              );
            } else {
              vm.previousName = '';
            }

            vm.name = response.data.name;
            vm.total = response.data.total;
            vm.amountTotal = response.data.amountTotal;
            vm.receiptsTotal = response.data.receiptsTotal;
            vm.currency = response.data.currency;
            vm.userDetail = response.data.userDetailResponse;
            vm.topItems = response.data.topItems;
            vm.valid = response.data.valid;

            //translate payment types
            let translatedPaymentTypes = [];
            if(vm.valid) {
              for (let i = 0; i < response.data.paymentTypesX.length; i++) {
                translatedPaymentTypes.push(utils.getPaymentType(response.data.paymentTypesX[i], vm));
              }
            }
            vm.paymentsDataCollection = {
              labels: translatedPaymentTypes,
              datasets: [{
                label: vm.$t('graph.paymentTypes'),
                data: response.data.paymentTypesY,
                backgroundColor: [
                  'rgb(255, 99, 132)',
                  'rgb(54, 162, 235)',
                  'rgb(255, 205, 86)',
                  'rgb(126,210,112)'
                ],
                hoverOffset: 4
              }]
            };

            vm.topItemsDataCollection = {
              labels: response.data.topItemsX,
              datasets: [
                {
                  label: response.data.name + ' ' + vm.$t('graph.topItems') + ' ' + response.data.currency + ' ',
                  backgroundColor: '#8ca35c',
                  data: response.data.topItemsY
                }
              ]
            }

            vm.loadingGraphs = false;
          });
    },
    testPremium() {
      if((this.$refs.dateFilter.selectedType!=='day' || this.$refs.dateFilter.selectedDay!=='today') && localStorage.premium === 'false') {
        //not premium
        this.showPremiumText=true;
      } else {
        this.showPremiumText=false;
      }
    }
  }
}
</script>

<style>
  .e-chart-container {
    width: 100%;
    max-width: 600px;
    margin: 4rem auto;
  }

  .num {
    text-align: right;
  }

  .report-info {
    background-color: #97bdce;
    padding: 0.5rem;
  }
</style>