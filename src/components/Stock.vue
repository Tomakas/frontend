<template>
  <div class="e-card e-rounding shadow-sm">
    <PremiumBanner/>

    <h1 class="h3">{{ $t('stock.title') }}</h1>

    <Loader v-if="loading" />

    <div>
      <div style="color: darkred" v-show="showInfoSku && !loading" class="mb-3">{{ $t('stock.info') }}<br>
        <a href="/#/items">{{ $t('stock.info.link')}}</a>.
      </div>

      <div style="margin-bottom: 1rem;">
        <button @click="showStockRecordHistory()" class="btn btn-secondary mr-1 mb-1"><i class="fa-solid fa-list pr-2"></i> {{ $t('button.stockPurchaseHistory') }}</button>
        <button v-if="rightExportSales" @click="showScreen='exportProfit'" class="btn btn-secondary mr-1 mb-1"><i class="fa-solid fa-coins pr-2"></i> {{ $t('button.calculateStock') }}</button>
        <button @click="$router.push('/stocktaking')" class="btn btn-secondary mr-1 mb-1"><i class="fa-solid fa-list-check pr-2"></i> {{ $t('button.stocktaking') }}</button>
      </div>

      <div class="container">
        <div class="row">
        <div class="col-8 col-lg-4 mt-2 mb-2">
           <table><tr>
             <td>
               <vue-simple-suggest
                   id="search"
                   ref="queryRef"
                   v-model="query"
                   :debounce="2"
                   :placeholder="$t('search')"
                   :list="getSuggestionSaleAndSupplierList"
                   @input="queryChange"
               ></vue-simple-suggest>
             </td>
           <td style="padding: 10px"><i v-tooltip="$t('tooltip.barcodeScanner')" class="fa-solid fa-barcode fa-xl" :class="{'fa-beat':barcodeBeat}"></i></td>
           </tr></table>
        </div>
        <div class="col-8 col-lg-4 mt-2 mb-2">
          <table>
            <tr>
              <td>{{ $t('stock.filterByUnit' )}}</td>
              <td>
          <select v-model="filterUnitType" class="form-control" @change="refresh" id="unitFilter">
            <option v-for="unitType in unitTypes" v-bind:value="unitType.unitType"
                    v-bind:key="unitType.unitType">
              {{ unitType.unitTypeName }}
            </option>
          </select></td>
            </tr>
          </table>
        </div>
        </div>
      </div>

      <div class="container">
      <div class="row">
        <div class="col-sm-4">
         <div class="custom-control custom-switch">
          <input type="checkbox" v-model="filterLowQuantity" @change="refresh()" class="custom-control-input" role="switch" id="lowQuantity">
          <label class="custom-control-label" for="lowQuantity">{{ $t('checkbox.lowQuantity') }}</label>
         </div>
        </div>
        <div class="col-sm-6">
         <div class="custom-control custom-switch">
          <input type="checkbox" v-model="showNotSaleItems" @change="refresh()" class="custom-control-input" role="switch" id="showNotSaleItems">
          <label class="custom-control-label" for="showNotSaleItems">{{ $t('checkbox.showNotSaleItems') }}</label>
         </div>
        </div>
      </div>
      </div>

      <table class="table table-hover e-table--responsive">
        <thead>
          <tr>
            <th><Sort column-name="sku" :number-type="false" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('stock.table.sku') }}</Sort></th>
            <th><Sort column-name="name" :number-type="false" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('stock.table.name') }}</Sort></th>
            <th>{{ $t('form.supplier') }}</th>
            <th style="text-align: right;"><Sort column-name="quantity" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('stock.table.quantity')}}</Sort></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in actualStockData" v-bind:key="data.sku">
            <td :data-title="$t('stock.table.sku')"><a class="e-table-link" href="/#/stock" @click="showDetailData(data.sku)"><Emphasize :value="data.sku" :query="query"></Emphasize></a></td>
            <td :data-title="$t('stock.table.name')"><a class="e-table-simple-link" href="/#/stock" @click="showDetailData(data.sku)"><Emphasize :value="data.itemText" :query="query"></Emphasize></a></td>
            <td :data-title="$t('form.supplier')"><Emphasize :value="data.supplier" :query="query"></Emphasize></td>
            <td :data-title="$t('stock.table.quantity')" style="text-align: right;" :class="{lowQuantityText: data.lowQuantity}">{{ data.quantity }} {{ data.unit }}</td>
            <td :class="{lowQuantityText: data.lowQuantity}">
              <button @click="showDetailData(data.sku)" class="btn btn-secondary">{{ $t('stock.button.status') }}</button>
            </td>
            <td :class="{lowQuantityText: data.lowQuantity}">
              <button @click="showAddStock(data)" class="btn btn-secondary"><i class="fas fa-plus-minus"></i> {{ $t('stock.button.change') }}</button>
            </td>
          </tr>
        </tbody>
      </table>

    </div>

    <div class="e-card-backdrop" v-if="showScreen==='exportProfit'">
      <div class="row e-modal-row justify-content-center align-items-start">
        <div class="e-modal-card col-3 col-lg-3 bg-white shadow-sm e-rounding p-0">
          <div class="card-header e-user__header">
            <span>{{ $t('button.calculateStock') }}</span>
            <i @click="refresh()" class="fas fa-times e-modal-close-icon"></i>
          </div>
          <div class="card-body py-5 px-4">
            <div class="form-group">
              <input @click="exportProfitFinished=false" type="checkbox" v-model="exportProfitRange">  {{ $t('profitStock.specifyDateRange')}}
            </div>
            <div v-show="exportProfitRange" class="form-group">
              <date-picker v-model="exportProfitCustom" :lang="$i18n.locale" value-type="YYYY-MM-DD" range></date-picker>
            </div>

            <Loader v-if="exportingProfit" />
            <div class="d-flex justify-content-end pt-2">
              <button @click="refresh()" class="btn btn-outline-secondary mr-4">{{ $t('button.back') }}</button>
              <button v-show="!exportProfitFinished && !exportingProfit" @click="exportProfitReport()" class="btn btn-primary">
                <i class="fa-solid fa-coins pr-2"></i>{{ $t('button.calculateStock') }}
              </button>
              <a v-show="exportProfitFinished" v-bind:href="bu+'/stock/download-report-document?id='+exportProfitDocumentId"
                 class="btn btn-primary"><i class="fa fa-download pr-1"></i> {{ $t('profitStock.download') }}</a>
              </div>
          </div>
        </div>
      </div>
    </div>

    <div class="e-card-backdrop" v-if="showScreen==='detail'">
      <div class="row e-modal-row justify-content-center align-items-start">
        <div class="e-modal-card col-10 col-lg-7 bg-white shadow-sm e-rounding p-0">
          <div class="card-header e-user__header">
            <span>{{ $t('stock.title.state') }}</span>
            <i @click="refresh()" class="fas fa-times e-modal-close-icon"></i>
          </div>
          <div class="card-body py-5 px-4">
            <div class="e-detail-title">{{ $t('stock.table.sku') }}</div>
            <div class="pb-3">{{ selectedSkuData.sku }}</div>

            <div class="e-detail-title">{{ $t('stock.table.name') }}</div>
            <div class="pb-3">{{ selectedSkuData.itemText }}</div>

            <div class="e-detail-title">{{ $t('stock.table.quantity.long')}}</div>
            <div class="pb-3">{{ selectedSkuData.quantity }} {{ selectedSkuData.unit }}</div>

            <div class="e-detail-title">{{ $t('stock.table.salesItems')}}</div>
            <div class="pb-3">
              <table>
              <tr v-for="ri in relatedItems" v-bind:key="ri.id">
                <td>{{ ri.name }}</td><td> {{ ri.quantityStr }} {{ ri.unitCode }} </td>
              </tr>
              </table>
            </div>
            <div class="pb-3" v-if="rightUtil.hasRight(rightUtil.codes.allReceipts) && relatedItem.itemType==='sale'">
              <button class="btn btn-secondary mr-4" @click="goToSales(relatedItem);">
                {{ $t('button.sales') }}
              </button>
            </div>
            <div v-if="showOptionsButtons===false" class="pb-3">
              <button @click="showOptionsButtons=true" class="btn btn-outline-secondary mr-4">
                {{ $t('button.stock.more') }}
              </button>
            </div>
            <div v-if="showOptionsButtons===true" class="pb-3">
              <div class="pb-3" v-if="rightUtil.hasRight(rightUtil.codes.salesItem)">
               <button class="btn btn-secondary mr-4" @click="goToEditItem(relatedItem);">
                {{ $t('button.edit')}}: {{ relatedItem.name }}
               </button>
              </div>
              <button v-if="selectedSkuData.quantity == 0" @click="removeItem(selectedSkuData.sku)" class="btn btn-danger mr-4">
              {{ $t('button.deleteItem')}}
              </button>
              <button v-if="selectedSkuData.quantity != 0" @click="removeStockHistory(selectedSkuData.sku)" class="btn btn-danger mr-4">
                {{ $t('button.removeStockHistory')}}
              </button>
            </div>

            <div class="stockChart">
              <LineChart :chart-data="dataCollection" />
            </div>

            <div class="d-flex flex-wrap-reverse justify-content-end pt-3" style="margin-bottom: 20px">
              <button @click="refresh()" class="btn btn-outline-secondary mr-4">{{ $t('button.back') }}</button>
              <button @click="showAddStock(selectedSkuData)" class="btn btn-primary">
                <i class="fas fa-plus pr-1"></i> {{ $t('stock.button.edit') }}
              </button>
            </div>

            <table class="table table-hover e-table--responsive">
              <thead>
              <tr>
                <th>{{ $t('stock.history.table.date') }}</th>
                <th class="text-right">{{ $t('stock.history.table.change') }}</th>
                <th class="text-right">{{ $t('stock.history.table.item_price') }}</th>
                <th class="text-right">{{ $t('stock.history.table.balance') }}</th>
                <th>{{ $t('stock.history.table.note') }}</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="data in stockHistory" v-bind:key="data.id">
                <td :data-title="$t('stock.history.table.date')">{{ data.date }}</td>
                <td :data-title="$t('stock.history.table.change')" class="text-right" :class="{invalidQuantity:!data.validUnitType}">{{ data.quantity }} {{ data.unit }}</td>
                <td :data-title="$t('stock.history.table.item_price')" class="text-right">{{ data.itemPriceCurrency }}<span v-show="data.itemPrice">/{{ data.unit }}</span></td>
                <td :data-title="$t('stock.history.table.balance')" class="text-right">{{ data.balance }}</td>
                <td :data-title="$t('stock.history.table.note')">{{ data.note }}{{ data.user!==null?(" ("+data.user+")"):"" }}</td>
                <td><button @click="showEditStock(data)" v-show="data.stockOperation===true" class="btn btn-primary">{{$t('button.modify')}}</button></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="e-card-backdrop" v-if="showScreen==='stockRecord'">
      <div class="row e-modal-row justify-content-center align-items-start">
        <div class="e-modal-card col-10 col-lg-7 bg-white shadow-sm e-rounding p-0">
          <div class="card-header e-user__header">
            <span>{{ $t('stock.title.purchaseHistory') }}</span>
            <i @click="refresh()" class="fas fa-times e-modal-close-icon"></i>
          </div>
          <div class="card-body py-5 px-4">
            <div class="col-8 col-lg-4 mt-2 mb-2">
              <table><tr>
                <td>
                  <vue-simple-suggest
                      id="search"
                      v-model="stockRecordQuery"
                      :debounce="2"
                      :placeholder="$t('search')"
                      :list="getSuggestionSaleAndSupplierAndUserList"
                      @input="stockRecordQueryChange"
                  ></vue-simple-suggest>
                </td>
              </tr></table>
            </div>
            <table class="table table-hover e-table--responsive">
              <thead>
              <tr>
                <th>{{ $t('stock.history.table.date') }}</th>
                <th>{{ $t('stock.history.table.sku') }}</th>
                <th>{{ $t('stock.history.table.itemName') }}</th>
                <th>{{ $t('form.supplier') }}</th>
                <th class="text-right">{{ $t('stock.history.table.change') }}</th>
                <th class="text-right">{{ $t('stock.history.table.item_price') }}</th>
                <th>{{ $t('stock.history.table.note') }}</th>
                <th>{{ $t('stock.history.table.user') }}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="data in stockRecordHistory" v-bind:key="data.id">
                <td :data-title="$t('stock.history.table.date')">{{ data.date }}</td>
                <td :data-title="$t('stock.history.table.sku')"><a class="e-table-link" href="/#/stock" @click="showDetailData(data.sku)"><Emphasize :value="data.sku" :query="stockRecordQuery"></Emphasize></a></td>
                <td :data-title="$t('stock.history.table.itemName')"><Emphasize :value="data.itemName" :query="stockRecordQuery"></Emphasize></td>
                <td :data-title="$t('form.supplier')"><Emphasize :value="data.supplier" :query="stockRecordQuery"></Emphasize></td>
                <td :data-title="$t('stock.history.table.change')" class="text-right"><Emphasize :value="data.quantity" :query="stockRecordQuery"></Emphasize> {{ data.unit }}</td>
                <td :data-title="$t('stock.history.table.item_price')" class="text-right"><Emphasize :value="data.itemPriceCurrency" :query="stockRecordQuery"></Emphasize><span v-show="data.itemPriceCurrency">/{{ data.unit }}</span></td>
                <td :data-title="$t('stock.history.table.note')"><Emphasize :value="data.note" :query="stockRecordQuery"></Emphasize></td>
                <td :data-title="$t('stock.history.table.user')"><Emphasize :value="data.user" :query="stockRecordQuery"></Emphasize></td>
              </tr>
              </tbody>
            </table>
            <a v-if="!stockRecordHistoryComplete" @click="stockRecordLimit=stockRecordLimit+20;showStockRecordHistory();" href="#">{{ $t('link.more')}}</a>
          </div>
        </div>
      </div>
    </div>

    <div class="e-card-backdrop" v-if="showScreen==='add'">
      <div class="row e-modal-row justify-content-center align-items-start">
        <div class="e-modal-card col-10 col-lg-5 bg-white shadow-sm e-rounding p-0">
          <div class="card-header e-user__header">
            <span v-if="addStockForm.type==='add'">{{ $t('stock.tile.add') }}</span>
            <span v-else>{{ $t('stock.tile.edit') }}</span>
            <i @click="refresh()" class="fas fa-times e-modal-close-icon"></i>
          </div>
          <div class="card-body py-5 px-4">
            <div class="e-detail-title">{{ $t('stock.table.sku') }}</div>
            <div class="pb-3">{{ selectedSkuData.sku }}</div>

            <div class="e-detail-title">{{ $t('stock.table.name') }}</div>
            <div class="pb-3">{{ selectedSkuData.itemText }}</div>

            <div class="e-detail-title">{{ $t('stock.table.quantity.long')}}</div>
            <div class="pb-3">{{ selectedSkuData.quantity}} {{ selectedSkuData.unit }}</div>

            <form>
              <div class="form-group">
                <label for="addStockForm.quantity">{{ $t('stock.form.add') }} {{ selectedSkuData.unit }}</label> <i v-tooltip="$t('stock.form.add.tooltip')" class="far fa-question-circle"></i>
                <input v-model="addStockForm.quantity" class="form-control" id="addStockForm.quantity">
              </div>
              <div class="form-group">
                <label for="addStockForm.itemPrice">{{ $t('stock.form.itemPrice') }} {{ selectedSkuData.unit }} <i v-tooltip="$t('stock.form.price.tooltip')" class="far fa-question-circle"></i></label>
                <input v-model="addStockForm.itemPrice" class="form-control" id="addStockForm.itemPrice">
              </div>
              <div class="form-group">
                <label for="addStockForm.note">{{ $t('stock.form.note') }}</label>
                <input v-model="addStockForm.note" class="form-control" id="addStockForm.note">
              </div>
            </form>

            <div v-if="addStockForm.type==='add'" class="d-flex flex-wrap-reverse justify-content-end pt-3">
              <button @click="refresh()" class="btn btn-outline-secondary mr-4">{{ $t('button.back') }}</button>
              <button v-if="addStockForm.quantity.indexOf('-') === -1" @click="addStock()" class="btn btn-primary">
                <i class="fas fa-plus pr-1"></i> {{ $t('stock.button.add') }}
              </button>
              <button v-if="addStockForm.quantity.indexOf('-') === 0" @click="addStock()" class="btn btn-primary">
                <i class="fas fa-minus pr-1"></i> {{ $t('stock.button.remove') }}
              </button>
            </div>

            <div v-else class="d-flex flex-wrap-reverse justify-content-end pt-3">
              <button @click="showScreen='detail'" class="btn btn-outline-secondary mr-4">{{ $t('button.back') }}</button>
              <button @click="editStock()" class="btn btn-primary">
                {{ $t('button.modify') }}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader";
import Sort from "@/components/Sort";
import {baseURL} from '@/config/variables'
import PremiumBanner from "@/components/PremiumBanner";
import DatePicker from 'vue2-datepicker';
import { Line as LineChart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineController, LineElement
} from 'chart.js'
import rightUtil from "@/util/rights"
import VueSimpleSuggest from 'vue-simple-suggest'
import 'vue-simple-suggest/dist/styles.css'
import Emphasize from "@/components/util/Emphasize.vue";

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineController, LineElement)

export default {
  name: 'Stock',
  computed: {
    rightUtil() {
      return rightUtil
    }
  },
  components: {LineChart, Loader, Sort, PremiumBanner, DatePicker,VueSimpleSuggest,Emphasize},

  data: function () {
    return {
      bu: baseURL,
      ak: localStorage.apiKey,
      loading: true,
      query: '',
      actualStockData:[],
      selectedSkuData: {},
      selectedSkuRecordId: null,
      stockHistory:[],
      relatedItems: [],
      relatedItem: {},
      addStockForm: {
        quantity: '0',
        itemPrice: '',
        note: ''
      },
      queryTimeout: null,
      showScreen: 'list',
      dataCollection: null,
      options: {
      },
      showInfoSku: true,
      sortData: {
        sortBy: 'quantity',
        sortType: 'asc'
      },
      exportProfitCustom: '[]',
      exportProfitDocumentId: null,
      exportingProfit: false,
      exportProfitFinished: false,
      exportProfitRange: false,
      unitTypes: [],
      filterUnitType: '',
      barcodeBeat: false,
      showOptionsButtons: false,
      stockRecordHistory: [],
      stockRecordQuery: '',
      stockRecordQueryTimeout: null,
      stockRecordLimit: 20,
      stockRecordHistoryComplete: false,
      rightExportSales: false,
      filterLowQuantity: false,
      showNotSaleItems: false
    }
  },

  mounted: function () {
    this.refresh();

    const vm = this;
    vm.$root.$on('ws_message',(data)=>{
      if (data.type === 'clientEvent' && data.eventType === 'barcode') {
        vm.barcodeBeat = true;
        vm.query = JSON.parse(data.data).barcode;
        vm.$refs.queryRef.input.focus();
        vm.queryChange();
        setTimeout(function() { vm.barcodeBeat=false; }, 1000);
      }
      if (data.type === 'stockChange') {
        if(vm.showScreen==='list') {
          vm.refresh();
        }
      }
    });

    this.rightExportSales = rightUtil.hasRight(rightUtil.codes.exportSales);
  },
  beforeDestroy() {
    this.$root.$off("ws_message");
  },

  watch: {
    exportProfitCustom() {
      this.exportProfitFinished = false;
    }
  },

  methods: {
    refresh: function() {
      const vm = this;
      vm.showScreen='list';
      vm.exportProfitFinished = false;
      vm.stockRecordQuery = '';
      vm.stockRecordLimit = 20;
      vm.loading = true;
      this.$http.post('/stock/get-actual-stock-data', {
            query: vm.query,
            unitType: vm.filterUnitType,
            sortData: vm.sortData,
            filterLowQuantity: vm.filterLowQuantity,
            onlyOnSale: !vm.showNotSaleItems
          })
          .then(function (response) {
            vm.actualStockData = response.data.list;
            vm.unitTypes = response.data.unitTypes;
            vm.unitTypes.push({
              unitType: '',
              unitTypeName: ''
            })
            vm.loading = false;
            if(vm.actualStockData.length > 0) {
              vm.showInfoSku = false;
            }
            vm.$nextTick(() => {
              vm.$refs.queryRef.input.focus();
            });
          });
    },
    showDetailData: function(sku) {
      const vm = this;
      vm.loading = true;
      this.$http.post('/stock/get-stock-history',{sku: sku})
          .then(function (response) {
            vm.stockHistory = response.data.list;
            vm.selectedSkuData = response.data.actualStockData;
            vm.relatedItems = response.data.relatedItems;
            vm.relatedItem = response.data.relatedItem;
            vm.loading = false;
            vm.showScreen='detail';
            vm.showOptionsButtons = false;

            vm.dataCollection = {
              labels: response.data.chartX,
              datasets: [
                {
                  label: vm.$t('stock.graph.label'),
                  backgroundColor: '#1d6491',
                  borderColor: '#36A2EBFF',
                  data: response.data.chartY
                }
              ]
            }
          });
    },
    showAddStock: function (data) {
      const vm = this;
      this.$http.post('/stock/get-default-stock-data',{
        sku: data.sku
      }).then(function(response) {
          vm.selectedSkuData = data;
          vm.addStockForm = {
            quantity: '0',
            itemPrice: response.data.priceStr,
            note: '',
            type: 'add'
        };
        vm.showScreen='add';
      });
    },
    addStock: function() {
      const vm = this;
      const req = {
        sku: this.selectedSkuData.sku,
        quantityStr: this.addStockForm.quantity,
        itemPriceStr: this.addStockForm.itemPrice,
        note: this.addStockForm.note,
        unitCode: this.selectedSkuData.unitCode
      };
      this.$http.post('/stock/add-stock-record',req)
          .then(function () {
            vm.loading = false;
            vm.showDetailData(vm.selectedSkuData.sku);
          });
    },
    showEditStock: function (data) {
      const vm = this;
      vm.selectedSkuRecordId = data.id;
      vm.addStockForm = {
        id: data.id,
        quantity: data.quantity,
        itemPrice: data.itemPrice,
        note: data.note,
        type: 'edit'
      };
      vm.showScreen='add'
    },
    editStock: function () {
      const vm = this;
      const req = {
        stockRecordId: this.selectedSkuRecordId,
        quantityStr: this.addStockForm.quantity,
        itemPriceStr: this.addStockForm.itemPrice,
        note: this.addStockForm.note,
        unitCode: this.selectedSkuData.unitCode
      };
      this.$http.post('/stock/update-stock-record',req)
          .then(function () {
            vm.loading = false;
            vm.showDetailData(vm.selectedSkuData.sku);
          });
    },
    queryChange: function () {
      const vm = this;
      if(this.queryTimeout !== null) {
        clearTimeout(this.queryTimeout);
      }
      this.queryTimeout = setTimeout(function(){
        vm.refresh();
      },500);
    },
    changeSort: function (sortData) {
      this.sortData = sortData;
      this.refresh();
    },
    exportProfitReport: function() {
      if(!this.exportingProfit) {
        const vm = this;
        vm.exportingProfit = true;
        this.$http.post('/stock/stock-profit-report', {
          custom: vm.exportProfitRange?JSON.stringify(vm.exportProfitCustom):JSON.stringify('[]')
        })
            .then(function (response) {
              vm.exportingProfit = false;
              vm.exportProfitFinished = true;
              vm.exportProfitDocumentId = response.data.documentId;
            }, function () {
              vm.exportingProfit = false;
              vm.exportProfitFinished = false;
            });
      }
    },
    removeItem: function(sku) {
      if( confirm(this.$t('confirm.delete'))) {
        const vm = this;
        this.$http.post('/item/delete-item-by-sku', {sku: sku})
            .then(function () {
              vm.refresh();
            });
      }
    },
    removeStockHistory: function(sku) {
      if( confirm(this.$t('confirm.removeStockHistory'))) {
        const vm = this;
        this.$http.post('/stock/remove-stock-history', {sku: sku})
            .then(function () {
              vm.showDetailData(vm.selectedSkuData.sku);
            });
      }
    },
    showStockRecordHistory: function() {
      const vm = this;
      vm.loading = true;
      this.$http.post('/stock/get-stock-record-data',{query: vm.stockRecordQuery,limit: vm.stockRecordLimit})
          .then(function (response) {
            vm.stockRecordHistory = response.data.list;
            vm.stockRecordHistoryComplete = response.data.complete;
            vm.loading = false;
            vm.showScreen='stockRecord';
          });
    },
    stockRecordQueryChange: function () {
      const vm = this;
      if(this.stockRecordQueryTimeout !== null) {
        clearTimeout(this.stockRecordQueryTimeout);
      }
      this.stockRecordQueryTimeout = setTimeout(function(){
        vm.showStockRecordHistory();
      },500);
    },
    getSuggestionSaleAndSupplierList :function(text) {
      const vm = this;
      return new Promise(function(resolve) {
        vm.$http.post('/suggestion/search', {query: text, subjectType: 'supplier', itemType: 'both', category: true})
            .then(function (response) {
              resolve(response.data.list);
            });
      });
    },
    getSuggestionSaleAndSupplierAndUserList :function(text) {
      const vm = this;
      return new Promise(function(resolve) {
        vm.$http.post('/suggestion/search', {query: text, subjectType: 'supplier', itemType: 'both', category: true, user:true})
            .then(function (response) {
              resolve(response.data.list);
            });
      });
    },
    goToEditItem(receiptItem) {
      let url;
      if(receiptItem.itemType==='sale') {
        url='/items?id='+receiptItem.id;
      } else {
        url='/stock-items?id='+receiptItem.id;
      }
      this.$router.push(url);
    },
    goToSales(receiptItem) {
      let url = '/receipt-items?queryName='+encodeURIComponent(receiptItem.name);
      this.$router.push(url);
    }
  }
}
</script>

<style>
.lowQuantityText{
  color: darkred;
  background: #fcc969;
}
.lowQuantityRow{
  background: #fcc969;
}

.stockChart {
  max-width: 300px;
  margin: 30px;
}

.invalidQuantity {
  text-decoration: line-through;
}


.vue-suggestion .vs__list {
  width: 100%;
  text-align: left;
  border: none;
  border-top: none;
  max-height: 400px;
  overflow-y: auto;
  border-bottom: 1px solid #023d7b;
  position: relative;
}
.vue-suggestion .vs__list .vs__list-item {
  background-color: #fff;
  padding: 10px;
  border-left: 1px solid #023d7b;
  border-right: 1px solid #023d7b;
}
.vue-suggestion .vs__list .vs__list-item:last-child {
  border-bottom: none;
}
.vue-suggestion .vs__list .vs__list-item:hover {
  background-color: #eee !important;
}
.vue-suggestion .vs__list,
.vue-suggestion .vs__loading {
  position: absolute;
}
.vue-suggestion .vs__list .vs__list-item {
  cursor: pointer;
}
.vue-suggestion .vs__list .vs__list-item.vs__item-active {
  background-color: #f3f6fa;
}

@media screen and (max-width: 576px) {
  table.e-table--responsive, .e-table--responsive thead, .e-table--responsive tbody, .e-table--responsive th, .e-table--responsive td, .e-table--responsive tr {
    display: block;
  }

  .e-table--responsive thead tr { 
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  .e-table--responsive tr { 
    border: 1px solid #ccc;
    margin-bottom: 1rem;
  }

  .e-table--responsive td {
    border: none;
    border-bottom: 1px solid #eee; 
    position: relative;
    padding-left: 50%; 
    white-space: normal;
    text-align: left;
    overflow-wrap: break-word;
  }

  .e-table--responsive td:before { 
    position: absolute;
    top: calc(50% - 12px);
    left: 6px;
    width: 45%; 
    padding-right: 10px; 
    white-space: nowrap;
    text-align: left;
    font-weight: bold;
  }

  .e-table--responsive td:before { 
    content: attr(data-title); 
  }

  .e-table--responsive .e-table-link {
    text-decoration: underline;
  }

}
</style>