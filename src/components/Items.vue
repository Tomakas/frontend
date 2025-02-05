<template>
    <div class="e-card e-rounding shadow-sm">
        <PremiumBanner/>
        <h1 class="h3">{{ $t('title.salesItemsInfo') }}</h1>

        <Loader v-if="loading" />

        <div>
            <div class="d-flex flex-wrap-reverse justify-content-center justify-content-md-end mb-3">
                <button @click="$router.push('/import-export')" class="btn btn-outline-primary m-2">
                    <i class="fas fa-file-export pr-1"></i>{{ $t('items.exportImport') }}
                </button>
                <button @click="prepareAddItem()" class="btn btn-primary m-2">
                    <i class="fas fa-plus pr-1"></i>{{ $t('button.newItem') }}
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
                <td>
                  <select v-model="categoryFilter" class="form-control" @change="refresh()">
                    <option v-for="category in categories" v-bind:value="category.categoryId"
                            v-bind:key="category.categoryId">
                      {{ category.path }}
                    </option>
                  </select>
                </td>
              </tr></table>
            </div>

          <div class="col-8 col-lg-4 mt-2 mb-2">
            <div class="custom-control custom-switch">
              <input type="checkbox" v-model="showNotSaleItems" @change="refresh()" class="custom-control-input" role="switch" id="showNotSaleItems">
              <label class="custom-control-label" for="showNotSaleItems">{{ $t('checkbox.showNotSaleItems') }}</label>
            </div>
          </div>

            <table class="table table-hover e-table--responsive">
                <thead>
                <tr>
                  <th><Sort column-name="mcode" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)"> {{ $t('form.mcode') }} </Sort></th>
                  <th><Sort column-name="item" :number-type="false" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('form.item') }} </Sort> </th>
                  <th><Sort column-name="tax" :number-type="false" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('form.tax') }} </Sort></th>
                  <th class="price"><Sort column-name="price" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('form.price')}} {{ currencyDisplay }} </Sort></th>
                  <th><Sort column-name="sku" :number-type="false" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('form.skuBarcode') }} </Sort></th>
                  <th><Sort column-name="category" :number-type="false" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('form.category') }} </Sort></th>
                  <th>{{ $t('form.supplier') }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in items" v-bind:key="item.itemId">
                    <td :data-title="$t('form.mcode')">
                        <div v-if="item.onSale" class="e-mcode-square" @click="prepareEditItem(item.itemId)"
                             v-bind:class="['m'+item.mcolor]">M{{item.mcode}}
                        </div>
                        <div v-if="!item.onSale" class="e-mcode-square notSale" @click="prepareEditItem(item.itemId)">M{{item.mcode}}
                        </div>
                    </td>
                    <td :data-title="$t('form.item')">
                        <span class="e-table-link" @click="prepareEditItem(item.itemId)"><Emphasize :value="item.text" :query="query"></Emphasize></span>
                    </td>
                    <td :data-title="$t('form.tax')">{{getTaxText(item.taxId)}}</td>
                    <td :data-title="$t('form.price')" v-if="item.priceStr !== ''" class="price"><Emphasize :value="item.priceStr" :query="query"></Emphasize></td>
                    <td :data-title="$t('form.price')" v-else class="price"><i>{{ $t('title.priceNotDefined')}}</i></td>
                    <td :data-title="$t('form.skuBarcode')"><Emphasize :value="item.sku" :query="query"></Emphasize></td>
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
                        <span v-if="item.itemId === null">{{ $t('title.salesItemsNew') }}</span>
                        <span v-else>{{ $t('title.salesItemsEdit') }} <span>- M{{item.mcode}}</span></span>
                        <i @click="showItem = false" class="fas fa-times e-modal-close-icon"></i>
                    </div>
                  <ul class="nav nav-tabs" style="background-color: #cccccc">
                    <li class="nav-item">
                      <a class="nav-link elColor" v-bind:class="{'active':navType==='item','elActive':navType==='item'}" aria-current="page" href="#" @click="navType='item'">{{ $t('item.submenu.sale')}}</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link elColor" v-bind:class="{'active':navType==='stock','elActive':navType==='stock'}" href="#" @click="navType='stock'">{{ $t('item.submenu.stock')}}</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link elColor" v-bind:class="{'active':navType==='modifiers','elActive':navType==='modifiers'}" href="#" @click="navType='modifiers'">{{ $t('item.submenu.modifiers')}}</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link elColor" v-bind:class="{'active':navType==='loyalty','elActive':navType==='loyalty'}" href="#" @click="navType='loyalty'">{{ $t('item.submenu.loyalty')}}</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link elColor" v-bind:class="{'active':navType==='other','elActive':navType==='other'}" href="#" @click="navType='other'">{{ $t('item.submenu.other')}}</a>
                    </li>
                  </ul>
                    <div class="card-body py-5 px-4">
                        <div v-if="navType==='item'">
                            <div class="form-group">
                                <label for="mCode">{{ $t('form.mcode') }}</label> <i v-tooltip="$t('tooltip.mcode')" class="far fa-question-circle"></i>
                                <input v-model="item.mcodeStr" type="number" class="form-control" id="mCode">
                            </div>


                            <div class="form-group">
                              <label for="mColor">{{$t('title.selectColor') }}</label>
                              <div style="margin: auto">
                                <div style="overflow:hidden;" id="mColor">
                                  <div class="m1 mBox" v-bind:class="{mBoxSelected : item.mcolor===1}"
                                       @click="item.mcolor=1"/>
                                  <div class="m2 mBox" v-bind:class="{mBoxSelected : item.mcolor===2}"
                                       @click="item.mcolor=2"/>
                                  <div class="m3 mBox" v-bind:class="{mBoxSelected : item.mcolor===3}"
                                       @click="item.mcolor=3"/>
                                  <div class="m4 mBox" v-bind:class="{mBoxSelected : item.mcolor===4}"
                                       @click="item.mcolor=4"/>
                                  <div class="m5 mBox" v-bind:class="{mBoxSelected : item.mcolor===5}"
                                       @click="item.mcolor=5"/>
                                  <div class="m6 mBox" v-bind:class="{mBoxSelected : item.mcolor===6}"
                                       @click="item.mcolor=6"/>
                                  <div class="m7 mBox" v-bind:class="{mBoxSelected : item.mcolor===7}"
                                       @click="item.mcolor=7"/>
                                  <div class="m8 mBox" v-bind:class="{mBoxSelected : item.mcolor===8}"
                                       @click="item.mcolor=8"/>
                                </div>
                              </div>
                            </div>

                            <div class="form-group">
                                <label for="text">{{ $t('form.item') }}</label> <i v-tooltip="$t('tooltip.item')" class="far fa-question-circle"></i>
                                <input v-model="item.text" class="form-control" id="text">
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
                                <label for="price">{{ $t('form.price')}} {{ currencyDisplay }}</label> <i v-tooltip="$t('tooltip.price')" class="far fa-question-circle"></i>
                                <input v-model="item.priceStr" class="form-control" id="price">
                            </div>
                            <div class="form-group">
                                <label for="sku">{{$t('form.skuBarcode') }}</label> <i v-tooltip="$t('tooltip.sku')" class="far fa-question-circle"></i>
                              <table><tr>
                                <td><input v-model="item.sku" @change="refreshSku" class="form-control" id="sku" ref="itemSku" :class="{'border-success':barcodeBeat}"></td>
                                <td style="padding: 10px"><i v-tooltip="$t('tooltip.barcodeScanner')" class="fa-solid fa-barcode fa-xl" :class="{'fa-beat':barcodeBeat}"></i>
                                  <span v-show="extractSkuFromWeightBarcode"> <a href="#" @click="extractSku()"> {{$t('item.extractSkuFromWeightBarcode')}}</a></span>
                                </td>
                              </tr></table>
                            </div>
                           <div class="form-group">
                             <label for="category">{{$t('form.category') }}</label>
                             <select v-model="item.categoryId" class="form-control" id="category">
                               <option v-for="c in categories" v-bind:value="c.categoryId"
                                      v-bind:key="c.categoryId">
                                 {{ c.name }}
                               </option>
                             </select>
                          </div>
                        </div>

                        <div  v-if="navType==='stock'">
                          <div>
                            <input type="radio" v-model="item.stockType" value="simple" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off">
                            {{  $t('item.stockType.simple') }}
                            <i v-tooltip="$t('item.stockTypeToolTip.simple')" class="far fa-question-circle"></i>
                            <br>
                            <input type="radio" v-model="item.stockType" value="complex" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
                            {{  $t('item.stockType.complex') }}
                            <i v-tooltip="$t('item.stockTypeToolTip.complex')" class="far fa-question-circle"></i>
                          </div>
                          <p></p>
                          <div v-if="item.stockType==='simple'">
                          <div v-if="item.sku===''" class="form-group" style="color: darkred">
                            <i class="fa-solid fa-triangle-exclamation"></i> {{ $t('item.stock.skuMustBeSet')}}
                          </div>
                            <div class="form-group">
                            <label for="purchasePrice">{{$t('form.purchasePrice') }} {{ currencyDisplay }}</label> <i v-tooltip="$t('tooltip.purchasePrice')" class="far fa-question-circle"></i>
                            <input v-model="item.purchasePriceStr" class="form-control" id="purchasePrice">
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
                          </div>

                          <div v-if="item.stockType==='complex'">
                          <div v-if="showStockSuggestion" class="form-group">
                            {{ $t('item.searchComplex') }}
                            <vue-suggestion
                                :items="skuSearchItems"
                                :setLabel="skuSearchSetLabel"
                                :itemTemplate="skuSearchTemplate"
                                @changed="skuSearchChanged"
                                @selected="skuSearchSelected"
                            >
                            </vue-suggestion>
                            </div>

                            <div v-if="!showStockSuggestion" class="form-group">
                            <button @click="testStockItemExists();showStockSuggestion=true">
                              + {{ $t('item.stock.connect') }}
                            </button>
                            </div>
                            <div class="form-group">
                              <div v-if="showNoStockWarning" class="form-group" style="color: darkred">
                                <a href="/#/stock-items"><i class="fa-solid fa-triangle-exclamation"></i> {{ $t('warning.noStockItems')}}</a>
                              </div>
                            <table class="table table-hover e-table--responsive">
                              <thead>
                              <tr>
                                <th>{{ $t('stock.table.sku') }}</th>
                                <th>{{ $t('stock.table.name') }}</th>
                                <th>{{ $t('stock.change') }}</th>
                                <th>{{ $t('form.unit') }}</th>
                                <th></th>
                               </tr>
                              </thead>
                              <tbody>
                              <tr v-for="stock in item.stockList" v-bind:key="stock.sku">
                                <td :data-title="$t('stock.table.sku')">{{ stock.sku }}</td>
                                <td :data-title="$t('stock.table.name')">{{ stock.name }}</td>
                                <td :data-title="$t('stock.change')"><input v-model="stock.quantityStr" class="form-control" :placeholder="$t('stock.change')"></td>
                                <td :data-title="$t('form.unit')">
                                  <select v-model="stock.unitCode" class="form-control">
                                    <option v-for="unit in stock.unitList" v-bind:value="unit.unitCode"
                                            v-bind:key="unit.unitCode">
                                      {{ unit.unitLong }}
                                    </option>
                                  </select>
                                </td>
                                <td>
                                  <button @click="removeStockItem(stock.sku)">
                                    -
                                  </button>
                                </td>
                              </tr>
                              </tbody>
                            </table>
                          </div>
                          </div>
                        </div>

                        <div  v-if="navType==='modifiers'">
                          <div>
                            <div style="margin: 10px;">
                            {{ $t('modifier.infoApp') }}
                            </div>
                            <div v-if="showModifierSuggestion" class="form-group">
                              {{ $t('item.searchModifier') }}
                              <vue-suggestion
                                  :items="modifierSearchItems"
                                  :setLabel="modifierSearchSetLabel"
                                  :itemTemplate="modifierSearchTemplate"
                                  @changed="modifierSearchChanged"
                                  @selected="modifierSearchSelected"
                              >
                              </vue-suggestion>
                            </div>
                            <div v-if="!showModifierSuggestion" class="form-group">
                              <button @click="showModifierSuggestion=true">
                                + {{ $t('item.modifier.addModifier') }}
                              </button>
                            </div>
                            <div class="form-group">
                              <table class="table table-hover e-table--responsive">
                                <thead>
                                <tr>
                                  <th>{{ $t('form.mcode') }}</th>
                                  <th>{{ $t('form.item') }}</th>
                                  <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="modifier in item.modifiers" v-bind:key="modifier.itemId">
                                  <td :data-title="$t('form.mcode')">
                                    <div class="e-mcode-square" v-bind:class="['m'+modifier.mcolor]">M{{modifier.mcode}}</div>
                                  </td>
                                  <td :data-title="$t('form.item')">{{ modifier.text }}</td>
                                  <td>
                                    <button @click="removeModifier(modifier.itemId)">
                                      -
                                    </button>
                                  </td>
                                </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        <div v-if="navType==='other'">
                          <div class="form-group">
                            <label for="note">{{$t('form.note') }}</label>
                            <input v-model="item.note" class="form-control" id="note">
                          </div>
                          <div class="custom-control custom-switch">
                            <input type="checkbox" class="custom-control-input" v-model="item.onSale" role="switch" id="onSale">
                            <label class="custom-control-label" for="onSale">{{$t('form.onSale') }}</label>
                          </div>
                        </div>

                      <div v-if="navType==='loyalty'">
                        <div><b>{{$t('loyalty.info')}}</b></div>
                        <div style="margin: 10px; color: #04084c">
                          {{ $t('loyalty.appVersion') }}
                        </div>
                        <div style="color: darkred" v-if="!loyaltyAllowed">
                          {{ $t('loyalty.business') }}
                        </div>
                        <div class="form-group">
                          <label for="loyaltyGain">{{$t('loyalty.form.gain') }}</label> <i v-tooltip="$t('loyalty.form.gain.info')" class="far fa-question-circle"></i>
                          <input v-model="item.loyaltySettings.gainPointsStr" class="form-control" id="loyaltyGain">
                        </div>
                        <div class="form-group">
                          <label for="loyaltyUse">{{$t('loyalty.form.use') }}</label> <i v-tooltip="$t('loyalty.form.use.info')" class="far fa-question-circle"></i>
                          <input v-model="item.loyaltySettings.usePointsStr" class="form-control" id="loyaltyUse">
                        </div>
                        <div class="form-group">
                          <label for="loyaltyDiscount">{{$t('loyalty.form.discount') }} %</label> <i v-tooltip="$t('loyalty.form.discount.info')" class="far fa-question-circle"></i>
                          <input v-model="item.loyaltySettings.discountStr" class="form-control" id="loyaltyDiscount">
                        </div>
                      </div>

                        <div class="d-flex flex-wrap-reverse justify-content-between pt-3">
                          <div>
                            <button v-if="item.itemId !== null && navType==='item'" @click="removeItem(item.itemId)" class="btn btn-danger mr-4">
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
    import skuSearchTemplate from './template/sku-search-template';
    import modifierSearchTemplate from './template/modifier-search-template';
    import VueSimpleSuggest from 'vue-simple-suggest'
    import 'vue-simple-suggest/dist/styles.css'
    import Emphasize from "@/components/util/Emphasize.vue";

    export default {
        name: 'Items',
        components: { Loader, Sort, PremiumBanner, VueSimpleSuggest, Emphasize },

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
                  sortBy: 'mcode',
                  sortType: 'asc'
                },
                skuSearchItems: [],
                skuSearchItem: {},
                modifierSearchItems: [],
                skuSearchTemplate,
                modifierSearchTemplate,
                navType: 'item',
                showStockSuggestion: false,
                showModifierSuggestion: false,
                showNoStockWarning: false,
                barcodeBeat : false,
                categoryFilter : null,
                extractSkuFromWeightBarcode : false,
                skuBeforeEdit : '',
                showNotSaleItems : false,
                loyaltyAllowed: false
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
                if(vm.item.sku.length ===0 && vm.navType==='item') {
                  vm.item.sku = value;
                  changed = true;
                  vm.$refs.itemSku.focus();
                }
              } else {
                vm.query = value;
                changed = true;
                vm.$refs.queryRef.input.focus();
                vm.queryChange();
              }
              if(changed) {
                vm.refreshSku();
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
                this.$http.post('/item/get-items',{
                  query: vm.query,
                  categoryIdFilter: vm.categoryFilter,
                  sortData: vm.sortData,
                  onlyOnSale: !vm.showNotSaleItems
                })
                    .then(function (response) {
                        vm.items = response.data.items;
                        vm.categories = response.data.categories;
                        //push empty
                        vm.categories.push({categoryId:null,name:'',path:''});
                        vm.crateCategoryMap();
                        vm.loading = false;
                        vm.currencyDisplay = response.data.currencyDisplay;
                        vm.loyaltyAllowed = response.data.loyaltyAllowed;
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
                  stockList: [],
                  stockType: 'simple',
                  onSale: true,
                  loyaltySettings: {
                    gainPointsStr: "",
                    usePointsStr: "",
                    discountStr: ""
                  }
                }
                this.showStockSuggestion=false;
                this.showNoStockWarning=false;
                this.extractSkuFromWeightBarcode=false;
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
                vm.navType = 'item';
                vm.showStockSuggestion = false;
                vm.showNoStockWarning = false;
                this.$http.post('/item/get-item',{uuid:itemId})
                    .then(function (response) {
                        vm.item = response.data;
                        vm.showItem = true;
                        vm.skuBeforeEdit = vm.item.sku;
                        vm.refreshSku();
                    });
            },
            prepareAddItem: function() {
                this.navType = 'item';
                this.clearItem();

                const vm = this;
                vm.loading = true;
                this.$http.post('/item/get-items',{})
                  .then(function (response) {
                    vm.showItem = true;
                    vm.loading = false;

                    const allItems = response.data.items;
                    let code = 1;
                    while(code<1000) {
                      let ok = true;
                      for (let i = 0; i < allItems.length; i++) {
                        if (code === allItems[i].mcode) {
                          ok = false;
                          break;
                        }
                      }
                      if(ok === true) {
                        vm.item.mcodeStr = code;
                        break;
                      }
                      code++;
                    }
                  });

            },
            addItem: function() {
                const vm = this;
                this.$http.post('/item/add-item',this.item)
                    .then(function (response) {
                        if(response.status === 200) {
                            vm.refresh();
                            vm.showItem = false;
                        }
                    });
            },
            editItem: function() {
                const vm = this;
                this.$http.post('/item/edit-item-fe',this.item)
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
            skuSearchChanged :function(text) {
              const vm = this;
              this.$http.post('/stock-item/search-items', {query: text})
                  .then(function (response) {
                    vm.skuSearchItems = response.data.list;
                  });
            },
            skuSearchSelected: function(item) {
              //this.skuSearchItem = item;
              //insert a new line
              this.item.stockList.push({
                sku: item.sku,
                name: item.name,
                unitList: item.unitList,
                quantityStr: '',
                unitCode: item.unitCode
              });
              this.showStockSuggestion = false;
            },
            skuSearchSetLabel : function() {
              return '';
            },
            removeStockItem: function(sku) {
              let index = -1;
              for(let i=0; i<this.item.stockList.length;i++) {
                if(this.item.stockList[i].sku === sku) {
                  index = i;
                  break;
                }
              }
              this.item.stockList.splice(index, 1);
            },
            testStockItemExists: function() {
              const vm = this;
              this.$http.post('/stock-item/stock-item-exist', {})
                  .then(function (response) {
                    vm.showNoStockWarning = !response.data.exists;
                  });
            },
            removeModifier: function(itemId) {
              const index = this.item.modifiers.indexOf(itemId);
              this.item.modifiers.splice(index,1);
            },
            modifierSearchChanged :function(text) {
              const vm = this;
              this.$http.post('/item/get-items', {query: text})
                .then(function (response) {
                  vm.modifierSearchItems = response.data.items;
                });
            },
            modifierSearchSelected: function(item) {
              //insert a new line
              this.item.modifiers.push({
                itemId: item.itemId,
                text: item.text,
                mcode: item.mcode,
                mcolor: item.mcolor,
                mcodeStr: item.mcodeStr
              });
              this.showModifierSuggestion = false;
            },
            modifierSearchSetLabel : function() {
              return '';
            },
            refreshSku: function() {
              const vm = this;
              this.$http.post('/barcode/extract-sku-from-weight-barcode', {barcode: vm.item.sku})
                .then(function (response) {
                  if(response.status === 200) {
                    vm.extractSkuFromWeightBarcode = response.data.sku !== null;
                  }
                });
            },
            extractSku: function() {
              const vm = this;
              this.$http.post('/barcode/extract-sku-from-weight-barcode', {barcode: vm.item.sku})
                .then(function (response) {
                  if(response.status === 200) {
                    vm.item.sku = response.data.sku;
                    vm.extractSkuFromWeightBarcode = false;
                  }
                });
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
              vm.$http.post('/suggestion/search', {query: text, subjectType: 'supplier', itemType: 'sale', category: true})
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

    .elActive {
      font-weight: bold;
    }
    .elColor {
      color: black;
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

    .notSale {
      text-decoration: line-through;
      background-color: #8a8a8a;
    }

    @media screen and (max-width: 576px) {
        .e-btn-mobile-container {
            width: 100%;
            text-align: right;
            margin-bottom: 2rem;
        }
    }
</style>