<template>
    <div class="e-card e-rounding shadow-sm">
        <PremiumBanner/>

        <Loader v-if="loading" />

        <div>
            <div class="d-flex flex-wrap-reverse justify-content-center justify-content-md-end mb-3">
                <button @click="prepareAddItem()" class="btn btn-primary m-2">
                    <i class="fas fa-plus pr-1"></i>{{ $t('button.newSupplier') }}
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
                  <th>{{ $t('form.supplierName') }}</th>
                  <th>{{ $t('form.supplierAddress') }}  </th>
                  <th>{{ $t('form.supplierEmail')}} </th>
                  <th>{{ $t('form.supplierPhone') }} </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="subject in subjects" v-bind:key="subject.subjectId">
                    <td :data-title="$t('form.supplierName')">
                      <span class="e-table-link" @click="prepareEdit(subject.subjectId)"><Emphasize :value="subject.name" :query="query"></Emphasize></span></td>
                    <td :data-title="$t('form.supplierAddress')">{{subject.address}}</td>
                    <td :data-title="$t('form.supplierEmail')">{{subject.email}}</td>
                    <td :data-title="$t('form.supplierPhone')">{{subject.phone}}</td>
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

        <div class="e-card-backdrop" v-if="showSubject">
            <div class="row e-modal-row justify-content-center align-items-start">
                <div class="e-modal-card col-10 col-lg-5 bg-white shadow-sm e-rounding p-0">
                    <div class="card-header e-user__header">
                        <span v-if="subject.subjectId === null">{{ $t('title.newSupplier') }}</span>
                        <span v-else>{{ $t('title.editSupplier') }}</span>
                        <i @click="showSubject = false" class="fas fa-times e-modal-close-icon"></i>
                    </div>
                    <div class="card-body py-5 px-4">
                        <form>
                            <div class="form-group">
                                <label for="name">{{ $t('form.supplierName') }}</label>
                                <input v-model="subject.name" class="form-control" id="name">
                            </div>
                          <div class="form-group">
                            <label for="address">{{ $t('form.supplierAddress') }}</label>
                            <input v-model="subject.address" class="form-control" id="address">
                          </div>
                          <div class="form-group">
                            <label for="email">{{ $t('form.supplierEmail') }}</label>
                            <input v-model="subject.email" class="form-control" id="email">
                          </div>
                          <div class="form-group">
                            <label for="phone">{{ $t('form.supplierPhone') }}</label>
                            <input v-model="subject.phone" class="form-control" id="phone">
                          </div>
                          <div class="form-group">
                            <label for="note">{{ $t('form.supplierNote') }}</label>
                            <input v-model="subject.note" class="form-control" id="note">
                          </div>
                        </form>
                        <div class="d-flex flex-wrap-reverse justify-content-between pt-3">
                            <div>
                                <button v-if="subject.subjectId !== null" @click="removeItem(subject.subjectId)" class="btn btn-danger mr-4">
                                    {{ $t('button.deleteItem')}}
                                </button>
                            </div>
                            <div class="e-btn-mobile-container">
                                <button @click="showSubject = false" class="btn btn-outline-secondary mr-4">
                                    {{ $t('button.back')}}
                                </button>
                                <button v-if="subject.subjectId === null" @click="addItem()" class="btn btn-primary">
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
    import PremiumBanner from "@/components/PremiumBanner";
    import VueSimpleSuggest from 'vue-simple-suggest'
    import 'vue-simple-suggest/dist/styles.css'
    import Emphasize from "@/components/util/Emphasize.vue";

    export default {
        name: 'Suppliers',
        components: { Loader, PremiumBanner,VueSimpleSuggest,Emphasize },

        data: function () {
            return {
                subjects: [],
                subject: {
                },
                showSubject: false,
                loading: true,
                query: '',
                queryTimeout: null,
                limit : 0,
                maxReached : false,
                moreAvailable: false,
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
                this.$http.post('/subject/get-subjects',{
                  query: vm.query,
                  type: 'supplier',
                  limit:vm.limit
                })
                    .then(function (response) {
                        vm.subjects = response.data.subjects;
                        vm.loading = false;
                        vm.maxReached = response.data.maxReached;
                        vm.moreAvailable = response.data.moreAvailable;
                    });
            },
            clearItem: function () {
                this.subject = {
                  subjectId : null,
                  type: 'supplier',
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
                            vm.showSubject = false;
                            vm.refresh();
                        });
                }
            },
            prepareEdit: function(subjectId) {
                const vm = this;
                this.$http.post('/subject/get-subject',{subjectId:subjectId})
                    .then(function (response) {
                        vm.subject = response.data;
                        vm.showSubject = true;
                    });
            },
            prepareAddItem: function() {
                this.clearItem();
                this.showSubject = true;
            },
            addItem: function() {
                const vm = this;
                this.$http.post('/subject/add-subject',this.subject)
                    .then(function (response) {
                        if(response.status === 200) {
                            vm.refresh();
                            vm.showSubject = false;
                        }
                    });
            },
            editItem: function() {
                const vm = this;
                this.$http.post('/subject/edit-subject',this.subject)
                    .then(function (response) {
                        if(response.status === 200) {
                            vm.refresh();
                            vm.showSubject = false;
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
              vm.$http.post('/suggestion/search', {query: text, subjectType: 'supplier'})
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
          }
        },
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