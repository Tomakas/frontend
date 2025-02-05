<template>
  <div class="e-card e-rounding shadow-sm">
    <PremiumBanner/>

    <DateRangeFilter ref="dateFilter" @filter-changed="changedFilter"></DateRangeFilter>
    <Loader v-if="loading || loadingDetail" />

    <div class="container" v-if="showFilters">
      <div class="row">
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
        <div class="col-sm">
          <div>
            <label for="category">{{ $t('receipts.category') }}</label>
            <select v-model="filter.category" class="form-control" id="category" @change="changedFilter()">
              <option v-for="ct in filters.categories" v-bind:value="ct.id" v-bind:key="ct.id">
                {{ ct.value }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-2">
          <label for="amountFrom">{{ $t('receipts.totalFrom') }}</label>
          <input v-model="filter.amountFrom" class="form-control" id="amountFrom" @change="changedFilter()">
        </div>
        <div class="col-sm-2">
          <label for="amountTo">{{ $t('receipts.totalTo') }}</label>
          <input v-model="filter.amountTo" class="form-control" id="amountTo" @change="changedFilter()">
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
            <label for="tax">{{ $t('receipts.tax') }}</label>
            <select v-model="filter.tax" class="form-control" id="tax" @change="changedFilter()">
              <option v-for="pt in filters.taxes" v-bind:value="pt.id" v-bind:key="pt.id">
                {{ pt.value }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-sm-4">
          <label for="search">{{ $t('receipts.items.query') }}</label>
          <vue-simple-suggest
              id="search"
              ref="queryRef"
              v-model="filter.query"
              :debounce="2"
              :placeholder="$t('search')"
              @input="changedFilter()"
              :list="getSuggestionItemList"
          ></vue-simple-suggest>
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
        <div><b>{{ $t('receipts.sumAmount') }}:</b> {{ itemsSum.sum }}</div><div><b>{{ $t('receipts.sumCount') }}:</b> {{ itemsSum.total }}</div>
       </div>
     </div>
    </div>

    <div style="height: 2rem"/>

    <div v-if="showPremiumText" style="color: darkred">{{ $t('receipts.range.premiumOnly')}}</div>
    <div v-if="!showPremiumText" class="row justify-content-md-center">
      <table class="table table-hover e-table--responsive" id = "infinite-list">
        <thead>
        <tr>
          <th>{{ $t('receipts.receiptNumber') }}</th>
          <th class="sortTitle"><Sort column-name="dateTime" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('receipts.dateTime') }}</Sort></th>
          <th class="sortTitle"><Sort column-name="itemName" :number-type="false" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('receipts.itemName') }}</Sort></th>
          <th class="sortTitle num"><Sort column-name="itemPrice" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('receipts.itemPrice') }}</Sort></th>
          <th class="sortTitle num"><Sort column-name="quantity" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('receipts.quantity') }}</Sort></th>
          <th class="sortTitle num"><Sort column-name="priceToPay" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('receipts.totalPrice') }}</Sort></th>
          <th class="sortTitle num"><Sort column-name="tax" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('receipts.tax') }}</Sort></th>
          <th class="sortTitle"><Sort column-name="category" :number-type="false" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('receipts.category') }}</Sort></th>
          <th class="sortTitle">{{ $t('receipts.customer') }}</th>
        </tr>
        </thead>
        <tbody v-for="tb in receipts" v-bind:key="tb.id">
        <tr v-for="ri in tb.receiptItemList" v-bind:key="ri.receiptItemId">
          <td v-if="ri.span===true" :rowspan="tb.receiptItemList.length"><button class="btn btn-secondary" href="/#/receipts" @click="showReceiptDetailData(ri.receiptId)">
            {{ $t('button.receipt') }}</button></td>
          <td :data-title="$t('receipts.dateTime')"><a href="/#/receipt-items" style="color: black" @click="setFilterExactDate(ri.dateTime);">{{$d(new Date(Date.parse(ri.dateTime)),'short')}}</a></td>
          <td :data-title="$t('receipts.itemName')"><a href="/#/receipt-items" style="color: black" @click="filter.query=ri.itemName;showFilters=true;refreshData();">{{ ri.itemName }}</a></td>
          <td :data-title="$t('receipts.itemPrice')" class="num">{{ ri.itemPrice }}</td>
          <td :data-title="$t('receipts.quantity')" class="num">{{ ri.quantity }}</td>
          <td :data-title="$t('receipts.totalPrice')" class="num" :class="{ negative: ri.negative }">{{ ri.priceToPay }}</td>
          <td :data-title="$t('receipts.tax')"><a href="/#/receipt-items" style="color: black" @click="filter.tax=ri.taxNum;showFilters=true;refreshData();">{{ ri.tax }}</a></td>
          <td :data-title="$t('receipts.category')"><a href="/#/receipt-items" style="color: black" @click="filter.category=ri.categoryId;showFilters=true;refreshData();">{{ ri.category }}</a></td>
          <td :data-title="$t('receipts.customer')">{{ ri.customer }}</td>
        </tr>
        </tbody>
      </table>
      <div>
        <button v-show="moreAvailable && !maxReached" @click="nextLimit()" class="btn btn-outline-secondary ml-3">
          {{ $t('link.more') }}
        </button>
        <div v-if="maxReached" style="color: darkorange">{{ $t('list.maxItems') }}</div>
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

    </div>
  </div>
</template>

<script>
import {baseURL} from '@/config/variables'
import Loader from "@/components/Loader.vue";
import Sort from "@/components/Sort.vue";
import PremiumBanner from "@/components/PremiumBanner.vue";
import DateRangeFilter from "@/components/util/DateRangeFilter.vue";
import ReceiptDetail from "@/components/util/ReceiptDetail.vue";
import VueSimpleSuggest from "vue-simple-suggest";

export default {
  name: 'ReceiptItems',
  components: {DateRangeFilter, Loader, Sort, PremiumBanner,ReceiptDetail,VueSimpleSuggest },
  data: function () {
    return {
      bu: baseURL,
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
        users:[],
        devices:[],
        discount:[],
        categories: [],
        taxes: []
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

    //should we show filter?
    if(typeof this.$route.query.queryName === 'string') {
      this.setFilterQuery(function() {vm.filter.query=vm.$route.query.queryName});
    } else if(typeof this.$route.query.customerName === 'string') {
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
      this.$http.post('/receipt/get-receipt-items', {
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
        useServerTime: ft.useServerTime,

        generateFilters: vm.showFilters,
        filter: vm.filter
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
      this.$http.post('/receipt/get-receipt-item-sum', {
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
    getDiscount(discount) {
      if(discount === 'yes') {
        return this.$t('yes');
      }
      if(discount === 'no') {
        return this.$t('no');
      }
      return '';
    },
    changeSort: function (sortData) {
      this.resetLimit();
      this.sortData = sortData;
      //disable transition
      this.transitionName = '';
      this.refreshData();
    },
    showReceipt : function(receiptId,receiptNumber) {
      this.resetFilter();
      this.filter.receipt = receiptId;
      this.filter.query = receiptNumber;
      this.showFilters=true;
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
    resetFilter: function() {
      this.filter = {
        user: '',
        device: '',
        amountFrom: '',
        amountTo: '',
        query: '',
        category: '',
        item: '',
        tax: '',
        discount: '',
        receipt: '',
        customer: ''
      };
      this.customerQuery= '';
    },
    cancelFilter: function() {
      //this.$refs.dateFilter.selectedType='year';
      this.resetLimit();
      this.showFilters=false;
      this.showDetailReceipt=false;
      this.resetFilter();
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
    setFilterExactDate(date) {
      let dateIso = new Date(Date.parse(date)).toISOString().split('T')[0];
      let customFormat = [];
      customFormat.push(dateIso); //start
      customFormat.push(dateIso); //end
      this.$refs.dateFilter.custom=customFormat;
      this.$refs.dateFilter.selectedType='custom';
      this.showFilters=true;
      this.refreshData();
    },
    setFilterQuery(setFilters) {
      this.$refs.dateFilter.selectedType='all';
      this.resetLimit();
      this.resetFilter();
      setFilters();
      this.showFilters=true;
      this.refreshData();
    },
    getSuggestionItemList() {
      const vm = this;
      return new Promise(function(resolve) {
        vm.$http.post('/suggestion/search', {query: vm.filter.query, itemType: 'sale', category: false, user:false})
            .then(function (response) {
              resolve(response.data.list);
            });
      });
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

tbody:hover td[rowspan],
tr:hover td {
  background: #f3f3f3;
}
</style>

