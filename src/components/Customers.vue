<template>
    <div class="e-card e-rounding shadow-sm">
        <PremiumBanner/>

        <Loader v-if="loading" />

        <div>
            <div class="d-flex flex-wrap-reverse justify-content-center justify-content-md-end mb-3">
                <button @click="prepareAddItem()" class="btn btn-primary m-2">
                    <i class="fas fa-plus pr-1"></i>{{ $t('button.newCustomer') }}
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
                    :list="getSuggestionSupplierList"
                    @input="queryChange"
                >
                </vue-simple-suggest>
                </td>
              </tr></table>
            </div>
           
            <table class="table table-hover e-table--responsive">
                <thead>
                <tr>
                  <th><Sort column-name="name" :number-type="false" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('form.customerName') }}</Sort></th>
                  <th>{{ $t('form.customerEmail')}} </th>
                  <th>{{ $t('loyalty.id')}} </th>
                  <th><Sort column-name="loyaltyPoints" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('loyalty.points') }}</Sort></th>
                  <th><Sort column-name="total" :number-type="true" :sort-data="sortData" @changeSort="changeSort($event)">{{ $t('customer.sales') }}</Sort></th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="subject in subjects" v-bind:key="subject.subjectId">
                    <td :data-title="$t('form.customerName')">
                      <span class="e-table-link" @click="prepareEdit(subject.subjectId)"><Emphasize :value="subject.shortName" :query="query"></Emphasize></span></td>
                    <td :data-title="$t('form.customerEmail')">{{subject.email}}</td>
                    <td :data-title="$t('loyalty.id')">{{subject.customId}}</td>
                    <td :data-title="$t('loyalty.points')">{{subject.loyaltyPoints}}</td>
                    <td :data-title="$t('customer.sales')">{{subject.total}}</td>
                    <td>
                      <button v-if="rightUtil.hasRight(rightUtil.codes.allReceipts)" class="btn btn-secondary" href="/#/customers" @click="goToSales(subject);">
                        {{ $t('button.sales') }}</button>
                    </td>
                </tr>
                </tbody>
            </table>

          <div>
            <button v-show="moreAvailable && !maxReached" @click="nextLimit()" class="btn btn-outline-secondary ml-3">
              {{ $t('link.more') }}
            </button>
            <div v-if="maxReached" style="color: darkorange">{{ $t('list.maxItems') }}</div>
          </div>

        </div>
        <div><br></div>

        <div class="e-card-backdrop" v-if="showType==='customer'">
            <div class="row e-modal-row justify-content-center align-items-start">
                <div class="e-modal-card col-10 col-lg-5 bg-white shadow-sm e-rounding p-0">
                    <div class="card-header e-user__header">
                        <span v-if="subject.subjectId === null">{{ $t('title.newCustomer') }}</span>
                        <span v-else>{{ $t('title.editCustomer') }}</span>
                        <i @click="showType = 'list'" class="fas fa-times e-modal-close-icon"></i>
                    </div>
                    <div class="card-body py-5 px-4">
                        <form>
                            <div class="form-group">
                                <label for="name">{{ $t('form.customerName') }}</label>
                              <textarea v-model="subject.name" rows="5" class="form-control" id="name"></textarea>
                              <i class="far fa-question-circle"></i> <i>{{ $t('customer.name.note')}}</i>
                            </div>
                          <div class="form-group">
                            <label for="address">{{ $t('form.customerAddress') }}</label>
                            <input v-model="subject.address" class="form-control" id="address">
                          </div>
                          <div class="form-group">
                            <label for="email">{{ $t('form.customerEmail') }}</label>
                            <input v-model="subject.email" class="form-control" id="email">
                          </div>
                          <div class="form-group">
                            <label for="phone">{{ $t('form.customerPhone') }}</label>
                            <input v-model="subject.phone" class="form-control" id="phone">
                          </div>
                          <div class="form-group">
                            <label for="customId">{{ $t('form.customerCustomId') }}</label>
                            <input v-model="subject.customId" class="form-control" id="customId">
                          </div>
                          <div class="form-group">
                            <label for="note">{{ $t('form.customerNote') }}</label>
                            <input v-model="subject.note" class="form-control" id="note">
                          </div>
                        </form>
                        <div class="d-flex flex-wrap-reverse justify-content-between pt-3">
                            <div>
                                <button v-if="subject.subjectId !== null" @click="removeItem(subject.subjectId)" class="btn btn-danger mr-4">
                                    {{ $t('button.deleteCustomer')}}
                                </button>
                                <button v-if="subject.subjectId !== null" @click="customerToMerge = null;showType='merge'" class="btn btn-warning mr-4">
                                  {{ $t('button.mergeCustomer') }}
                                </button>
                            </div>
                            <div class="e-btn-mobile-container">
                                <button @click="showType = 'list'" class="btn btn-outline-secondary mr-4">
                                    {{ $t('button.back')}}
                                </button>
                                <button v-if="subject.subjectId === null" @click="addItem()" class="btn btn-primary">
                                    {{ $t('button.newCustomer')}}
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


      <div class="e-card-backdrop" v-if="showType==='merge'">
        <div class="row e-modal-row justify-content-center align-items-start">
          <div class="e-modal-card col-10 col-lg-5 bg-white shadow-sm e-rounding p-0">
            <div class="card-header e-user__header">
              {{ $t('title.mergeCustomer') }}
              <i @click="showType = 'customer'" class="fas fa-times e-modal-close-icon"></i>
            </div>
            <div class="card-body py-5 px-4">
              <div>{{ $t('message.merge.1') }}</div>
              <div><b>{{ subject.name }}</b></div>
              <div>{{ $t('message.merge.2') }}:</div>
              <div>
                <vue-simple-suggest
                    id="searchCustomer"
                    ref="customerQueryRef"
                    :debounce="2"
                    :placeholder="$t('search')"
                    :list="getCustomerSuggestionList"
                    @select="onCustomerSuggestSelect"
                ></vue-simple-suggest>
              </div>
              <div class="d-flex flex-wrap-reverse justify-content-between pt-3">
                <div></div>
                <div class="e-btn-mobile-container">
                  <button @click="showType = 'customer'" class="btn btn-outline-secondary mr-4">
                    {{ $t('button.back')}}
                  </button>
                  <button v-show="customerToMerge!=null" @click="mergeCustomer()" class="btn btn-primary">
                    {{ $t('button.mergeCustomer')}}
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
    import PremiumBanner from "@/components/PremiumBanner";
    import VueSimpleSuggest from 'vue-simple-suggest'
    import 'vue-simple-suggest/dist/styles.css'
    import Emphasize from "@/components/util/Emphasize.vue";
    import rightUtil from "@/util/rights";
    import Sort from "@/components/Sort.vue";

    export default {
        name: 'Customers',
        computed: {
          rightUtil() {
            return rightUtil
          }
        },
        components: { Loader, PremiumBanner,VueSimpleSuggest,Emphasize,Sort },

        data: function () {
            return {
                subjects: [],
                subject: {
                },
                showType: 'list',
                loading: true,
                query: '',
                queryTimeout: null,
                limit : 0,
                maxReached : false,
                moreAvailable: false,
                sortData: {
                 sortBy: 'name',
                 sortType: 'asc'
                },
                customerToMerge: null,
                firstQuery: true
            }
        },

        mounted: function () {
          this.resetLimit();
        },

        methods: {
            refresh: function() {
                const vm = this;
                vm.loading = true;
                this.$http.post('/subject/get-customers',{
                  query: vm.query,
                  limit:vm.limit,
                  sortData: vm.sortData,
                })
                    .then(function (response) {
                        vm.subjects = response.data.subjects;
                        vm.loading = false;
                        vm.maxReached = response.data.maxReached;
                        vm.moreAvailable = response.data.moreAvailable;
                    });
            },
            changeSort: function (sortData) {
             this.resetLimit();
             this.sortData = sortData;
             this.refresh();
            },
            clearItem: function () {
                this.subject = {
                  subjectId : null,
                  type: 'customer',
                  name: '',
                  address: '',
                  email: '',
                  phone: '',
                  note: ''
                }
            },
            removeItem: function (subjectId) {
                if( confirm(this.$t('confirm.delete'))) {
                    const vm = this;
                    this.$http.post('/subject/delete-subject', {subjectId: subjectId})
                        .then(function () {
                            vm.showType = 'list';
                            vm.refresh();
                        });
                }
            },
            prepareEdit: function(subjectId) {
                const vm = this;
                this.$http.post('/subject/get-subject',{subjectId:subjectId})
                    .then(function (response) {
                        vm.subject = response.data;
                        vm.showType = 'customer';
                    });
            },
            prepareAddItem: function() {
                this.clearItem();
                this.showType = 'customer';
            },
            addItem: function() {
                const vm = this;
                this.$http.post('/subject/add-subject',this.subject)
                    .then(function (response) {
                        if(response.status === 200) {
                            vm.refresh();
                            vm.showType = 'list';
                        }
                    });
            },
            editItem: function() {
                const vm = this;
                this.$http.post('/subject/edit-subject',this.subject)
                    .then(function (response) {
                        if(response.status === 200) {
                            vm.refresh();
                            vm.showType = 'list';
                        }
                    });
            },
            queryChange: function () {
              const vm = this;
              if(vm.firstQuery) {
                vm.firstQuery=false;
                vm.refresh();
              } else {
                if (this.queryTimeout !== null) {
                  clearTimeout(this.queryTimeout);
                }
                this.queryTimeout = setTimeout(function () {
                  vm.refresh();
                }, 500);
              }
            },
          getSuggestionSupplierList :function(text) {
            const vm = this;
            return new Promise(function(resolve) {
              vm.$http.post('/suggestion/search', {query: text, subjectType: 'customer'})
                  .then(function (response) {
                    resolve(response.data.list);
                  });
            });
            },
          nextLimit() {
            this.limit=this.limit+100;
            this.refresh();
          },
          resetLimit() {
            this.limit = 50;
          },
          goToSales(customer) {
            let url = '/receipt-items?customerName='+encodeURIComponent(customer.shortName)+"&customerId="+customer.subjectId;
            this.$router.push(url);
          },
          getCustomerSuggestionList(input) {
            const vm = this;
            return new Promise(function(resolve) {
              vm.$http.post('/suggestion/customer-search', {query: input})
                  .then(function (response) {
                    let resultList = [];
                    for(let i=0;i<response.data.list.length;i++) {
                      let customer = response.data.list[i];
                      if(customer.id !== vm.subject.subjectId) {
                        resultList.push(customer);
                      }
                    }
                    resolve(resultList);
                  });
            });
          },
          onCustomerSuggestSelect(selected) {
            const vm = this;
            vm.customerToMerge=selected.id;
          },
          mergeCustomer: function() {
            const vm = this;
            if( confirm(this.$t('message.merge.confirm'))) {
              this.$http.post('/subject/merge-customers', {
                primaryCustomerId: vm.subject.subjectId,
                secondaryCustomerId: vm.customerToMerge
              })
                  .then(function (response) {
                    if (response.status === 200) {
                      vm.refresh();
                      vm.showType = 'list';
                      vm.customerToMerge = null;
                    }
                  });
            }
          },
        }
    }

</script>

<style>
    .table td {
        vertical-align: middle;
        word-break: break-word
    }

    @media screen and (max-width: 576px) {
        .e-btn-mobile-container {
            width: 100%;
            text-align: right;
            margin-bottom: 2rem;
        }
    }
</style>