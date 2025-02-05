<template>
    <div class="e-card e-rounding shadow-sm">
        <PremiumBanner/>
        <h1 class="h3">{{ $t('title.stockItemsInfo') }}</h1>
        <div style="color: #1f5d08"><i class="fas fa-info-circle pr-3"></i>{{ $t('stock.stockItem.info')}}</div>

        <Loader v-if="loading" />

        <div>
            <div class="d-flex flex-wrap-reverse justify-content-center justify-content-md-end mb-3">
                <button @click="$router.push('/import-export')" class="btn btn-outline-primary m-2">
                 <i class="fas fa-file-export pr-1"></i>{{ $t('items.exportImport') }}
                </button>
                <button @click="prepareAddItem()" class="btn btn-primary m-2">
                    <i class="fas fa-plus pr-1"></i>{{ $t('button.newStockItem') }}
                </button>
            </div>

            <div class="form-group" style="max-width: 400px;">
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
                >
                </vue-simple-suggest>
                </td>
                <td style="padding: 10px"><i v-tooltip="$t('tooltip.barcodeScanner')" class="fa-solid fa-barcode fa-xl" :class="{'fa-beat':barcodeBeat}"></i></td>
              </tr></table>
            </div>

            <table class="table table-hover e-table--responsive">
                <thead>
                <tr>
                  <th><Sort column-name="sku" :number-type="false" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('form.sku') }} </Sort></th>
                  <th><Sort column-name="item" :number-type="false" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('form.item') }} </Sort> </th>
                  <th><Sort column-name="unit" :number-type="false" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('form.unit')}} </Sort></th>
                  <th class="price"><Sort column-name="price" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('form.price')}} {{ currencyDisplay }} </Sort></th>
                  <th><Sort column-name="category" :number-type="false" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('form.category') }} </Sort></th>
                  <th>{{ $t('form.supplier') }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in items" v-bind:key="item.itemId">
                    <td :data-title="$t('form.sku')">
                      <span class="e-table-link" @click="prepareEditItem(item.itemId)"><Emphasize :value="item.sku" :query="query"></Emphasize></span></td>
                    <td :data-title="$t('form.item')">
                        <span class="e-table-link" @click="prepareEditItem(item.itemId)"><Emphasize :value="item.text" :query="query"></Emphasize></span>
                    </td>
                    <td :data-title="$t('form.unit')">{{item.unit}}</td>
                    <td :data-title="$t('form.price')" v-if="item.purchasePriceStr !== ''" class="price"><Emphasize :value="item.purchasePriceStr" :query="query"></Emphasize></td>
                    <td :data-title="$t('form.price')" v-else class="price"><i>{{ $t('title.priceNotDefined')}}</i></td>
                    <td :data-title="$t('form.category')"><Emphasize :value="getCategoryName(item.categoryId)" :query="query"></Emphasize></td>
                    <td :data-title="$t('form.supplier')"><Emphasize :value="item.supplier" :query="query"></Emphasize></td>
                </tr>
                </tbody>
            </table>
        </div>
        <div><br></div>

        <div class="e-card-backdrop" v-if="showItem">
            <div class="row e-modal-row justify-content-center align-items-start">
                <div class="e-modal-card col-10 col-lg-5 bg-white shadow-sm e-rounding p-0">
                    <div class="card-header e-user__header" v-bind:class="['m'+item.mcolor]">
                        <span v-if="item.itemId === null">{{ $t('title.stockItemsNew') }}</span>
                        <span v-else>{{ $t('title.stockItemsEdit') }}</span>
                        <i @click="showItem = false" class="fas fa-times e-modal-close-icon"></i>
                    </div>
                    <div class="card-body py-5 px-4">
                        <form>
                          <div class="form-group">
                            <label for="sku">{{$t('form.sku') }}</label> <i v-tooltip="$t('tooltip.stockItem.sku')" class="far fa-question-circle"></i>
                            <table style="width: 100%"><tr>
                              <td><input v-model="item.sku" class="form-control" :class="{'border-success':barcodeBeat}" id="sku" ref="itemSku"></td>
                              <td style="padding: 10px"><i v-tooltip="$t('tooltip.barcodeScanner')" class="fa-solid fa-barcode fa-xl" :class="{'fa-beat':barcodeBeat}"></i></td>
                            </tr></table>
                          </div>
                            <div class="form-group">
                                <label for="text">{{ $t('form.item') }}</label> <i v-tooltip="$t('tooltip.stockItem.item')" class="far fa-question-circle"></i>
                                <input v-model="item.text" class="form-control" id="text">
                            </div>
                          <div class="form-group">
                            <label for="purchasePrice">{{$t('form.purchasePrice') }}</label> <i v-tooltip="$t('tooltip.stockItem.purchasePrice')" class="far fa-question-circle"></i>
                            <input v-model="item.purchasePriceStr" class="form-control" id="purchasePrice">
                          </div>
                            <div class="form-group">
                                <label for="tax">{{ $t('form.tax') }}</label> <i v-tooltip="$t('tooltip.tax')" class="far fa-question-circle"></i>
                                <select v-model="item.taxId" class="form-control" id="tax">
                                    <option v-for="t in taxEnabledItems" v-bind:value="t.taxId"
                                            v-bind:key="t.taxId">
                                    {{ t.name }} ({{ t.displayValue }})
                                    </option>
                                </select>
                            </div>
                           <div class="form-group">
                             <label for="category">{{$t('form.category') }}</label> <i v-tooltip="$t('tooltip.stockItem.category')" class="far fa-question-circle"></i>
                             <select v-model="item.categoryId" class="form-control" id="category">
                               <option v-for="c in categories" v-bind:value="c.categoryId"
                                      v-bind:key="c.categoryId">
                                 {{ c.name }}
                               </option>
                             </select>
                          </div>
                          <div class="form-group">
                            <label for="unitType">{{$t('form.unit') }}</label> <i v-tooltip="$t('tooltip.stockItem.unit')" class="far fa-question-circle"></i>
                            <select v-model="item.unitCode" class="form-control" id="unitType">
                              <option v-for="unit in item.itemId === null?units:selectedUnits" v-bind:value="unit.unitCode"
                                      v-bind:key="unit.unitCode">
                                {{ unit.unitType }} {{ unit.unitLong }} [{{ unit.unit }}]
                              </option>
                            </select>
                          </div>
                          <div class="form-group">
                            <label for="lowQuantity">{{$t('form.lowQuantity') }}</label> <i v-tooltip="$t('tooltip.lowQuantity')" class="far fa-question-circle"></i>
                            <input v-model="item.lowQuantityStr" class="form-control" id="lowQuantity">
                          </div>
                          <div class="form-group">
                            <label for="supplier">{{$t('form.supplier') }}</label> <i v-tooltip="$t('tooltip.supplier')" class="far fa-question-circle"></i>
                            <vue-simple-suggest
                                id="supplier"
                                v-model="item.supplier"
                                :debounce="2"
                                :list="getSuggestionSupplierList">
                            </vue-simple-suggest>
                          </div>
                          <div class="form-group">
                            <label for="note">{{$t('form.note') }}</label>
                            <input v-model="item.note" class="form-control" id="note">
                          </div>
                        </form>
                        <div class="d-flex flex-wrap-reverse justify-content-between pt-3">
                            <div>
                                <button v-if="item.itemId !== null" @click="removeItem(item.itemId)" class="btn btn-danger mr-4">
                                    {{ $t('button.deleteItem')}}
                                </button>
                            </div>
                            <div class="e-btn-mobile-container">
                                <button @click="showItem = false" class="btn btn-outline-secondary mr-4">
                                    {{ $t('button.back')}}
                                </button>
                                <button v-if="item.itemId === null" @click="addItem()" class="btn btn-primary">
                                    {{ $t('button.createItem')}}
                                </button>
                                <button v-else @click="editItem()" class="btn btn-primary">
                                    {{ $t('button.save') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Loader from "@/components/Loader"
    import Sort from "@/components/Sort"
    import PremiumBanner from "@/components/PremiumBanner";
    import VueSimpleSuggest from 'vue-simple-suggest'
    import 'vue-simple-suggest/dist/styles.css'
    import Emphasize from "@/components/util/Emphasize.vue";

    export default {
        name: 'StockItems',
        components: { Loader, Sort, PremiumBanner,VueSimpleSuggest,Emphasize },

        data: function () {
            return {
                items: [],
                categories: [],
                item: {
                },
                taxItems: [],
                taxEnabledItems: [],
                showItem: false,
                loading: true,
                currencyDisplay: '',
                query: '',
                queryTimeout: null,
                sortData: {
                  sortBy: 'sku',
                  sortType: 'asc'
                },
                units: [], //all units
                selectedUnits: [], //units from detail,
                barcodeBeat : false,
                skuBeforeEdit : ''
            }
        },

        mounted: function () {
          this.readTaxItems();
          const vm = this;
          vm.$root.$on('ws_message',(data)=>{
            if (data.type === 'clientEvent' && data.eventType === 'barcode') {
              const value = JSON.parse(data.data).barcode;
              let changed = false;
              if(vm.showItem) {
                if(vm.item.sku.length ===0) {
                  vm.item.sku = value;
                  changed = true;
                  vm.$refs.itemSku.input.focus();
                }
              } else {
                vm.query = value;
                changed = true;
                vm.$refs.queryRef.input.focus();
                vm.queryChange();
              }
              if(changed) {
                vm.barcodeBeat = true;
                setTimeout(function () {
                  vm.barcodeBeat = false;
                }, 1000);
              }
            }
          });

          //should we show item?
          if(typeof this.$route.query.id === 'string') {
            this.prepareEditItem(this.$route.query.id);
          }
        },
        beforeDestroy() {
          this.$root.$off("ws_message");
        },

        methods: {
            refresh: function() {
                const vm = this;
                vm.loading = true;
                this.$http.post('/stock-item/get-items',{
                  query: vm.query,
                  sortData: vm.sortData
                })
                    .then(function (response) {
                        vm.items = response.data.items;
                        vm.units = response.data.units;
                        vm.categories = response.data.categories;
                        //push empty
                        vm.categories.push({categoryId:null,name:''});
                        vm.crateCategoryMap();
                        vm.loading = false;
                        vm.currencyDisplay = response.data.currencyDisplay;
                        vm.$nextTick(() => {
                          vm.$refs.queryRef.input.focus();
                      });
                    });
            },
            crateCategoryMap: function() {
              this.categoryMap = new Map();
              for (let i = 0; i < this.categories.length; i++) {
                let category = this.categories[i];
                this.categoryMap.set(category.categoryId,category);
              }
            },
            clearItem: function () {
                this.item = {
                  itemId : null,
                  mcodeStr : "0",
                  text: "",
                  taxId: this.taxEnabledItems[0].taxId,
                  priceStr: "",
                  mcolor: 1,
                  sku: '',
                  supplier: '',
                  lowQuantityStr: ''
                }
            },
            removeItem: function (itemId) {
                if( confirm(this.$t('confirm.delete'))) {
                    const vm = this;
                    this.$http.post('/item/delete-item', {itemId: itemId})
                        .then(function () {
                            vm.showItem = false;
                            vm.refresh();
                        });
                }
            },
            prepareEditItem: function(itemId) {
                const vm = this;
                this.$http.post('/stock-item/get-item',{uuid:itemId})
                    .then(function (response) {
                        vm.item = response.data.itemResponse;
                        vm.selectedUnits = response.data.availableUnits; //limit available units
                        vm.skuBeforeEdit = vm.item.sku;
                        vm.showItem = true;
                    });
            },
            prepareAddItem: function() {
                this.clearItem();
                this.showItem = true;
            },
            addItem: function() {
                const vm = this;
                this.$http.post('/stock-item/add-item',this.item)
                    .then(function (response) {
                        if(response.status === 200) {
                            vm.refresh();
                            vm.showItem = false;
                        }
                    });
            },
            editItem: function() {
                const vm = this;
                this.$http.post('/stock-item/edit-item-fe',this.item)
                    .then(function (response) {
                        if(response.status === 200) {
                            vm.refresh();
                            vm.showItem = false;
                        }
                    });
            },
            readTaxItems: function() {
                const vm = this;
                this.$http.post('/tax/get-taxes',{deleted:true})
                    .then(function (response) {
                        vm.taxItems = response.data.taxes;
                        vm.taxEnabledItems = [];
                        for(let i=0;i<vm.taxItems.length;i++) {
                            if(vm.taxItems[i].deleted === false) {
                                vm.taxEnabledItems.push(vm.taxItems[i]);
                            }
                        }
                        vm.refresh();
                    });
            },
            getTaxText: function (taxId) {
                for (let i = 0; i < this.taxItems.length; i++) {
                    if(this.taxItems[i].taxId===taxId) {
                        return this.taxItems[i].name;
                    }
                }
            },
            getCategoryName: function(categoryId) {
                return this.categoryMap.get(categoryId).name;
            },
            getCategoryColor: function(categoryId) {
                return this.categoryMap.get(categoryId).color;
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
          getSuggestionSupplierList :function(text) {
            const vm = this;
            return new Promise(function(resolve) {
              vm.$http.post('/suggestion/search', {query: text, subjectType: 'supplier'})
                  .then(function (response) {
                    resolve(response.data.list);
                  });
            });
            },
          getSuggestionSaleAndSupplierList :function(text) {
            const vm = this;
            return new Promise(function(resolve) {
              vm.$http.post('/suggestion/search', {query: text, subjectType: 'supplier', itemType: 'stock', category: true})
                  .then(function (response) {
                    resolve(response.data.list);
                  });
            });
          }
        }
    }

</script>

<style>
    .m1 {
        background-color: #8ea459;
    }
    .m2 {
        background-color: #7ac4dd;
    }
    .m3 {
        background-color: #7aa1ec;
    }
    .m4 {
        background-color: #f0e071;
    }
    .m5 {
        background-color: #e49d5b;
    }
    .m6 {
      background-color: #b191dc;
    }
    .m7 {
      background-color: #d9736f;
    }
    .m8 {
      background-color: #ceb19f;
    }

    .mBox {
        display: inline-block;
        width: 30px;
        height: 30px;
        margin: 3px;
        border-radius: .25rem;
        cursor: pointer;
    }

    .e-mcode-square {
        width: max-content;
        padding: .5rem;
        border-radius: .25rem;
        font-weight: 600;
        text-align: center;
        cursor: pointer;
    }

    .mBoxSelected {
        border: 2px solid black;
    }

    .table td {
        vertical-align: middle;
        word-break: break-word
    }

    .price {
        text-align: right;
    }


    @media screen and (max-width: 576px) {
        .e-btn-mobile-container {
            width: 100%;
            text-align: right;
            margin-bottom: 2rem;
        }
    }
</style>