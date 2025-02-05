<template>
  <div class="e-card e-rounding shadow-sm">
    <PremiumBanner/>

    <DateRangeFilter ref="dateFilter" @filter-changed="changedFilter"></DateRangeFilter>
    <Loader v-if="loading || loadingDetail" />

    <div class="container" v-if="showFilters">
      <div class="row">
        <div class="col-sm">
          <div>
            <label for="paymentType"> {{ $t('receipts.paymentType') }}</label>
            <select v-model="filter.paymentType" class="form-control" id="paymentType" @change="changedFilter()">
              <option v-for="pt in filters.paymentTypes" v-bind:value="pt.id" v-bind:key="pt.id">
                {{ getPaymentType(pt.id) }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-sm">
          <div>
            <label for="device">{{ $t('receipts.cashRegister') }}</label>
            <select v-model="filter.device" class="form-control" id="device" @change="changedFilter()">
              <option v-for="pt in filters.devices" v-bind:value="pt.id" v-bind:key="pt.id">
                {{ pt.value }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-sm">
          <div>
            <label for="user">{{ $t('receipts.user') }}</label>
            <select v-model="filter.user" class="form-control" id="user" @change="changedFilter()">
              <option v-for="pt in filters.users" v-bind:value="pt.id" v-bind:key="pt.id">
                {{ pt.value }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-2">
          <label for="user">{{ $t('receipts.totalFrom') }}</label>
          <input v-model="filter.totalFrom" class="form-control" id="text" @change="changedFilter()">
        </div>
        <div class="col-sm-2">
          <label for="user">{{ $t('receipts.totalTo') }}</label>
          <input v-model="filter.totalTo" class="form-control" id="text" @change="changedFilter()">
        </div>
        <div class="col-sm-2">
          <div>
            <label for="discount">{{ $t('receipts.discount') }}</label>
            <select v-model="filter.discount" class="form-control" id="discount" @change="changedFilter()">
              <option v-for="pt in filters.discount" v-bind:value="pt.id" v-bind:key="pt.id">
                {{ getDiscount(pt.value) }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-sm-2">
          <div>
            <label for="validity">{{ $t('receipts.validity') }}</label>
            <select v-model="filter.valid" class="form-control" id="validity" @change="changedFilter()">
              <option v-for="pt in filters.valid" v-bind:value="pt.id" v-bind:key="pt.id">
                {{ getValidity(pt.value) }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-sm-4">
          <label for="user">{{ $t('receipts.query') }}</label>
          <input v-model="filter.query" class="form-control" id="text" @change="changedFilter()">
        </div>
      </div>
      <div class="row">
        <div class="col-sm-4">
          <label for="searchCustomer">{{ $t('receipts.customer') }}</label>
          <vue-simple-suggest
              id="searchCustomer"
              ref="customerQueryRef"
              v-model="customerQuery"
              :debounce="2"
              :placeholder="$t('search')"
              @input="changedCustomer()"
              :list="getCustomerSuggestionList"
              @select="onCustomerSuggestSelect"
          ></vue-simple-suggest>
        </div>
      </div>
    </div>

    <div class="e-card-backdrop" v-if="showDetailReceipt">
      <div class="row e-modal-row justify-content-center align-items-start">
        <div class="e-modal-card col-12 col-lg-4 bg-white shadow-sm e-rounding p-0">
          <div class="card-header e-user__header">
            <span>{{ $t('receipts.receiptDetail') }}</span>
            <i @click="showDetailReceipt=false" class="fas fa-times e-modal-close-icon"></i>
          </div>
          <div class="card-body py-5 px-4">
              <ReceiptDetail :receipt-detail="receiptDetail"></ReceiptDetail>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!showFilters">
      <button @click="showFilters=true;refreshData()" class="btn btn-outline-secondary ml-3">
        {{ $t('receipts.showFilters') }}
      </button>
    </div>
    <div v-if="showFilters">
      <div style="height: 2rem"/>
      <button @click="cancelFilter()" class="btn btn-outline-secondary ml-3">
        {{ $t('receipts.cancelFilters') }}
      </button>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-sm-8">
          <div style="height: 2rem"/>
          <div><b>{{ $t('receipts.sumAmount') }}:</b> {{ itemsSum.sum }}</div><div><b>{{ $t('receipts.count') }}:</b> {{ itemsSum.total }}</div>
        </div>
      </div>
    </div>

    <div style="height: 2rem"/>

    <div v-if="showPremiumText" style="color: darkred">{{ $t('receipts.range.premiumOnly')}}</div>
    <div v-if="!showPremiumText" class="row justify-content-md-center">
      <table class="table table-hover e-table--responsive" id = "infinite-list">
        <thead>
        <tr>
          <th></th>
          <th class="sortTitle"><Sort column-name="dateTime" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('receipts.dateTime') }}</Sort></th>
          <th class="sortTitle"><Sort column-name="receiptNumber" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('receipts.receiptNumber') }}</Sort></th>
          <th class="sortTitle"><Sort column-name="cashRegister" :number-type="false" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('receipts.cashRegister') }}</Sort></th>
          <th class="sortTitle num"><Sort column-name="total" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('receipts.totalReceipt') }}</Sort></th>
          <th class="sortTitle"><Sort column-name="paymentType" :number-type="false" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('receipts.paymentType') }}</Sort></th>
          <th class="sortTitle"><Sort column-name="customer" :number-type="false" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('receipts.customer') }}</Sort></th>
          <th class="sortTitle"><Sort column-name="billName" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('receipts.note') }}</Sort></th>
          <th class="sortTitle"><Sort column-name="userName" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('receipts.user') }}</Sort></th>
          <th class="sortTitle"><Sort column-name="printNum" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('receipts.printed') }}</Sort></th>
        </tr>
        </thead>
        <transition-group tag="tbody" :name="transitionName">
        <tr v-for="receipt in receipts" v-bind:key="receipt.receiptId">
          <td><button class="btn btn-secondary" href="/#/receipts" @click="showReceiptDetailData(receipt.receiptId)">
            {{ $t('button.receipt') }}</button></td>
          <td :data-title="$t('receipts.dateTime')">{{$d(new Date(Date.parse(receipt.dateTime)),'short')}}</td>
          <td :data-title="$t('receipts.receiptNumber')">{{ receipt.receiptNumber }}</td>
          <td :data-title="$t('receipts.cashRegister')">{{ receipt.cashRegister }}</td>
          <td :data-title="$t('receipts.totalReceipt')" class="num" :class="{ negative: receipt.negative }">{{ receipt.total }}</td>
          <td :data-title="$t('receipts.paymentType')">{{ getPaymentType(receipt.paymentType) }}</td>
          <td :data-title="$t('receipts.customer')"><a href="/#/receipts" style="color: black" @click="filter.query=receipt.customer;showFilters=true;refreshData();">{{ receipt.customerShortName }}</a></td>
          <td :data-title="$t('receipts.note')">{{ receipt.note }}</td>
          <td :data-title="$t('receipts.user')">{{ receipt.user }}</td>
          <td :data-title="$t('receipts.printed')">{{ receipt.printNum }}</td>
        </tr>
        </transition-group>
      </table>
      <div>
        <button v-show="moreAvailable && !maxReached" @click="nextLimit()" class="btn btn-outline-secondary ml-3">
          {{ $t('link.more') }}
        </button>
        <div v-if="maxReached" style="color: darkorange">{{ $t('list.maxItems') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/util/util"
import Loader from "@/components/Loader.vue";
import Sort from "@/components/Sort.vue";
import PremiumBanner from "@/components/PremiumBanner.vue";
import DateRangeFilter from "@/components/util/DateRangeFilter.vue";
import ReceiptDetail from "@/components/util/ReceiptDetail.vue";
import VueSimpleSuggest from "vue-simple-suggest";

export default {
  name: 'Receipts',
  components: {DateRangeFilter, Loader, Sort, PremiumBanner, ReceiptDetail,VueSimpleSuggest },
  data: function () {
    return {
      ak: localStorage.apiKey,
      receipts: [],
      maxReached : false,
      moreAvailable: false,
      loading: false,
      loadingDetail: false,
      limit : 0,
      sortData: {
        sortBy: 'dateTime',
        sortType: 'desc'
      },
      transitionName: '',
      showDetailReceipt: false,
      receiptId: null,
      receiptDetail: {},
      showFilters: false,
      filters: {
        paymentTypes:[],
        users:[],
        devices:[],
        discount:[],
        valid:[]
      },
      filter: {},
      showPremiumText: true,
      itemsSum : {
        sum: '',
        total: ''
      },
      customerQuery: ''
    }
  },
  mounted: function () {
    const vm = this;
    //vm.$refs.dateFilter.selectedType='year';

    //should we show filter?
    if(typeof this.$route.query.customerName === 'string') {
      this.setFilterQuery(function() {
        vm.customerQuery = vm.$route.query.customerName;
        vm.filter.customer=vm.$route.query.customerId;
      });
    } else {
      vm.cancelFilter();
    }

    vm.$root.$on('ws_message',(data)=>{
      if (data.type === 'receiptCreate' || data.type === 'receiptUpdate') {
        //do nice transition for list
        vm.transitionName = 'receipt-list';
        vm.refreshData();
        if(vm.showDetailReceipt) {
          //also refresh detail
          if(vm.receiptId !== null) {
            vm.showReceiptDetailData(vm.receiptId);
          }
        }
      }
    });
    vm.resetLimit();
    /*
    window.onscroll = () => {
      let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

      if (bottomOfWindow) {
        this.next();
      }
    };*/
  },

  beforeDestroy() {
    this.$root.$off("ws_message");
  },
  methods: {
    refreshData: function () {
      const vm = this;
      vm.testPremium();
      vm.loading = true;
      const ft = this.$refs.dateFilter;
      this.$http.post('/receipt/get-receipts', {
        limit:vm.limit,
        sortData: vm.sortData,

        year: ft.selectedYear,
        type: ft.selectedType,
        quarter: ft.selectedQuarter,
        month: ft.selectedMonth,
        day: ft.selectedDay,
        week: ft.selectedWeek,
        custom: JSON.stringify(ft.custom),
        customTime: JSON.stringify(ft.customTime),

        generateFilters: vm.showFilters,
        filter: vm.filter,

        useServerTime: ft.useServerTime
      })
          .then(function (response) {
            if(response.status === 200) {
              vm.receipts = response.data.list;
              vm.filters = response.data.filters;
              vm.maxReached = response.data.maxReached;
              vm.moreAvailable = response.data.moreAvailable;
            }
            vm.loading = false;
            vm.getItemsSum();
          },function(err){
            vm.loading = false;
            vm.$modal.cs_alert(err);
          });
    },
    getItemsSum: function() {
      const vm = this;
      const ft = this.$refs.dateFilter;
      vm.itemsSum = {
        sum: '',
        total: ''
      };
      this.$http.post('/receipt/get-receipts-sum', {
        year: ft.selectedYear,
        type: ft.selectedType,
        quarter: ft.selectedQuarter,
        month: ft.selectedMonth,
        day: ft.selectedDay,
        week: ft.selectedWeek,
        custom: JSON.stringify(ft.custom),
        customTime: JSON.stringify(ft.customTime),
        useServerTime: ft.useServerTime,
        filter: vm.filter
      })
          .then(function (response) {
            if(response.status === 200) {
              vm.itemsSum = response.data;
            }
          });
    },
    getPaymentType(paymentType) {
      return utils.getPaymentType(paymentType,this);
    },
    getDiscount(discount) {
      if(discount === 'yes') {
        return this.$t('yes');
      }
      if(discount === 'no') {
        return this.$t('no');
      }
      return '';
    },
    getValidity(validity) {
      if(validity === 'unnumbered') {
        return this.$t('validity.unnumbered');
      }
      if(validity === 'valid') {
        return this.$t('validity.valid');
      }
    },
    changeSort: function (sortData) {
      this.resetLimit();
      this.sortData = sortData;
      //disable transition
      this.transitionName = '';
      this.refreshData();
    },
    showReceiptDetailData: function(receiptId) {
      const vm = this;
      vm.receiptId = receiptId;
      vm.loadingDetail = true;
      this.$http.post('/receipt/get-receipt-detail', {
        receiptId:receiptId
      }).then(function (response) {
            if(response.status === 200) {
              vm.receiptDetail = response.data;
            }
            vm.loadingDetail = false;
            vm.showDetailReceipt = true;
          });
    },
    changedFilter: function() {
      this.resetLimit();
      this.refreshData();
    },
    cancelFilter: function() {
      //this.$refs.dateFilter.selectedType='year';
      this.resetLimit();
      this.showFilters=false;
      this.resetFilter();
      this.refreshData();
    },
    resetFilter: function() {
      this.filter = {
        paymentType: '',
        user: '',
        device: '',
        totalFrom: '',
        totalTo: '',
        query: '',
        discount: '',
        valid: '',
        customer: ''
      };
    },
    setFilterQuery(setFilters) {
      this.$refs.dateFilter.selectedType='all';
      this.resetLimit();
      this.resetFilter();
      setFilters();
      this.showFilters=true;
      this.refreshData();
    },
    testPremium() {
      if((this.$refs.dateFilter.selectedType!=='day' || this.$refs.dateFilter.selectedDay!=='today') && localStorage.premium === 'false') {
        //not premium
        this.showPremiumText=true;
      } else {
        this.showPremiumText=false;
      }
    },
    nextLimit() {
      this.limit=this.limit+100;
      this.refreshData();
    },
    resetLimit() {
      this.limit = 50;
    },
    getCustomerSuggestionList(input) {
      const vm = this;
      return new Promise(function(resolve) {
        vm.$http.post('/suggestion/customer-search', {query: input})
            .then(function (response) {
              resolve(response.data.list);
            });
      });
    },
    onCustomerSuggestSelect(selected) {
      const vm = this;
      vm.filter.customer=selected.id;
      vm.refreshData();
    },
    changedCustomer() {
      const vm = this;
      if(vm.customerQuery === '' && vm.filter.customer!=='') {
        //clear filter
        vm.filter.customer='';
        vm.refreshData();
      }
    }
  }
}
</script>


<style>
.receipt-list-move {
  transition: transform 2s;
}
.amountReceipt {
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: large;
}
.receiptItem {
  font-family: monospace;
}
.num {
  text-align: right;
  white-space: nowrap;
}
.sortTitle {
  white-space: nowrap;
}
.negative {
  color: darkred;
}
</style>

