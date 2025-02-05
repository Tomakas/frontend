<template>
    <div class="e-card e-rounding shadow-sm">
        <PremiumBanner/>
        <h1 class="h3">{{ $t('title.categories') }}</h1>
        
        <Loader v-if="loading" />

        <div v-if="!loading">
            <div class="d-flex flex-wrap-reverse justify-content-center justify-content-md-end mb-3">
                <button @click="$router.push('/import-export')" class="btn btn-outline-primary m-2">
                 <i class="fas fa-file-export pr-1"></i>{{ $t('items.exportImport') }}
                </button>
                <button @click="prepareAddCategory()" class="btn btn-primary m-2">
                    <i class="fas fa-plus pr-1"></i>{{ $t('button.createCategory') }}
                </button>
            </div>

                <div class="category" :style="{'padding-left': 20*category.level+'px'}" v-for="category in categories" v-bind:key="category.categoryId">
                    <span class="e-mcode-square"
                                v-bind:class="['m'+category.color]">
                    </span>
                  <span style="padding-left: 10px" class="e-table-link" @click="prepareEditCategory(category.categoryId)">{{ category.name}}</span>
                </div>
        </div>
        <div><br></div>

        <div class="e-card-backdrop" v-if="showCategory">
            <div class="row e-modal-row justify-content-center align-items-start">
                <div class="e-modal-card col-10 col-lg-5 bg-white shadow-sm e-rounding p-0">
                    <div class="card-header e-user__header" v-bind:class="['m'+category.color]">
                        <span v-if="category.categoryId === null">{{ $t('title.newCategory') }}</span>
                        <span v-else>{{ $t('title.editCategory') }}</span>
                        <i @click="showCategory = false" class="fas fa-times e-modal-close-icon"></i>
                    </div>
                    <div class="card-body py-5 px-4">
                        <form>
                            <div class="form-group">
                                <label for="mColor">{{$t('title.selectColor') }}</label>
                                <div style="margin: auto">
                                    <div style="overflow:hidden;" id="mColor">
                                        <div class="m1 mBox" v-bind:class="{mBoxSelected : category.color===1}"
                                                @click="category.color=1"/>
                                        <div class="m2 mBox" v-bind:class="{mBoxSelected : category.color===2}"
                                                @click="category.color=2"/>
                                        <div class="m3 mBox" v-bind:class="{mBoxSelected : category.color===3}"
                                                @click="category.color=3"/>
                                        <div class="m4 mBox" v-bind:class="{mBoxSelected : category.color===4}"
                                                @click="category.color=4"/>
                                        <div class="m5 mBox" v-bind:class="{mBoxSelected : category.color===5}"
                                                @click="category.color=5"/>
                                        <div class="m6 mBox" v-bind:class="{mBoxSelected : category.color===6}"
                                             @click="category.color=6"/>
                                        <div class="m7 mBox" v-bind:class="{mBoxSelected : category.color===7}"
                                             @click="category.color=7"/>
                                        <div class="m8 mBox" v-bind:class="{mBoxSelected : category.color===8}"
                                             @click="category.color=8"/>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="text">{{ $t('form.categoryName') }}</label>
                                <input v-model="category.name" class="form-control" id="text">
                            </div>
                            <div class="form-group">
                             <label for="parentCategory">{{ $t('form.parentCategoryName') }}</label>
                              <select v-model="category.parentCategoryId" class="form-control" id="parentCategory">
                              <option v-for="c in categoriesList(category.categoryId)" v-bind:value="c.categoryId"
                                      v-bind:key="c.categoryId">
                                {{ c.name }}
                              </option>
                            </select>
                            </div>
                            <div class="form-group">
                              <div class="custom-control custom-switch">
                              <input type="checkbox"  class="custom-control-input" v-model="category.enableRemoteOrder" id="enableRemoteOrder">
                                <label class="custom-control-label" for="enableRemoteOrder">{{$t('remoteOrder.category.enableRemoteOrder')}}</label>
                              </div>
                            </div>
                        </form>
                        <div class="d-flex flex-wrap-reverse justify-content-between pt-3">
                            <div>
                                <button v-if="category.categoryId !== null" @click="removeCategory(category.categoryId)" class="btn btn-danger mr-4">
                                  {{ $t('button.deleteCategory') }}
                                </button>
                            </div>
                            <div class="e-btn-mobile-container">
                                <button @click="showCategory = false" class="btn btn-outline-secondary mr-4">
                                    {{ $t('button.back')}}
                                </button>
                                <button v-if="category.categoryId === null" @click="addCategory()" class="btn btn-primary">
                                  {{ $t('button.createCategory')}}
                                </button>
                                <button v-else @click="editCategory()" class="btn btn-primary">
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

    export default {
        name: 'Categories',
        components: { Loader, PremiumBanner },

        data: function () {
            return {
                categories: [],
                category: {
                },
                showCategory: false,
                loading: true,
            }
        },

        mounted: function () {
            this.refresh();
        },

        methods: {
            refresh: function() {
                const vm = this;
                vm.loading = true;
                this.$http.post('/category/get-categories-flat',{})
                    .then(function (response) {
                        vm.categories = response.data.list;
                        vm.loading = false;
                    });
            },
            clearCategory: function () {
                this.category = {
                  categoryId : null,
                  parentCategoryId : null,
                  name: "",
                  color: 1,
                  enableRemoteOrder: true
                }
            },
            removeCategory: function (categoryId) {
                if( confirm(this.$t('confirm.delete'))) {
                    const vm = this;
                    this.$http.post('/category/delete-category', {categoryId: categoryId})
                        .then(function () {
                            vm.showCategory = false;
                            vm.refresh();
                        });
                }
            },
            prepareEditCategory: function(categoryId) {
                const vm = this;
                this.$http.post('/category/get-category',{categoryId:categoryId})
                    .then(function (response) {
                        vm.category = response.data;
                        vm.showCategory = true;
                    });
            },
            prepareAddCategory: function() {
                this.clearCategory();
                this.showCategory = true;
            },
            addCategory: function() {
                const vm = this;
                this.$http.post('/category/add-category',this.category)
                    .then(function (response) {
                        if(response.status === 200) {
                            vm.refresh();
                            vm.showCategory = false;
                        }
                    });
            },
            editCategory: function() {
                const vm = this;
                this.$http.post('/category/edit-category',this.category)
                    .then(function (response) {
                        if(response.status === 200) {
                            vm.refresh();
                            vm.showCategory = false;
                        }
                    });
            },
            categoriesList: function (excludeId) {
                const ret = [];
                let i;
                let cat;
                ret.push({
                  categoryId: null,
                  name: ''
                });
                for(i=0;i<this.categories.length;i++) {
                  cat = this.categories[i];
                  if(cat.categoryId !== excludeId) {
                    ret.push(cat);
                  }
                }
                return ret;
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

    .category {
      margin-top: 20px;
      margin-bottom: 20px;
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