<template>
    <div class="e-card e-rounding shadow-sm">
        <PremiumBanner/>
        <h1 class="h3">{{ $t('title.remoteOrderSettings') }}</h1>
        
        <Loader v-if="loading" />
        <div>{{$t('remoteOrder.info') }}</div>
      <p></p>
        <div v-if="!loading">
            <div>
              <button style="margin-top: 20px" @click="showSettings=true" class="btn btn-secondary">{{ $t('title.remoteOrderSettings') }}</button>

              <div v-if="categories.length === 0" style="margin-top: 20px; margin-bottom: 20px">
                <div class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> {{ $t('remoteOrder.noCategories')}}</div>
                <a href="/#/categories">{{ $t('remoteOrder.manageCategories')}}</a>
                ({{ $t('menu.saleSettings') }} -> {{ $t('menu.categories') }})
              </div>

              <div class="row">
                <div class="col-12 col-lg-4 mt-2 mb-2" v-for="bill in permanentBills" v-bind:key="bill.billId">
                  <div class="e-inner-card shadow-sm e-rounding">
                    <div class="card-body py-5 px-4">
                      <h5>{{bill.name}}</h5>
                      <div>
                        <img style="margin-top: 10px; margin-bottom: 10px" :src="bu+'/remote-order-settings/get-permanent-bill-qr-code?&ak='+ak+'&billId='+bill.billId" width="200px"/>
                      </div>
                      <a v-bind:href="bu+'/remote-order-settings/get-permanent-bill-qr-code?&ak='+ak+'&billId='+bill.billId">
                        {{ $t('remoteOrder.downloadQRCode') }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <p></p>
              <div>
                {{  $t('remoteOrder.infoQRCode') }}:
              </div>

              <div class="row">
                <div class="col-12 col-lg-4 mt-2 mb-2">
                  <div class="e-inner-card shadow-sm e-rounding">
                    <div class="card-body py-5 px-4">
                      <div>
                        <a :href="barcodeUrl" target="_blank">
                          <img style="margin-top: 10px; margin-bottom: 10px" :src="bu+'/remote-order-settings/get-temporary-bill-qr-code?code='+remoteOrderApiKey+'&ak='+ak" width="200px"/>
                        </a>
                      </div>
                      <a v-bind:href="bu+'/remote-order-settings/get-temporary-bill-qr-code?code='+remoteOrderApiKey+'&ak='+ak">
                        {{ $t('remoteOrder.downloadQRCode') }}
                      </a>
                      <p></p>
                      {{$t('remoteOrder.infoLink') }}:<br>
                      <a :href="barcodeUrl" target="_blank">{{ barcodeUrl }}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        </div>



      <div class="e-card-backdrop" v-if="!loading && showSettings">
        <div class="row e-modal-row justify-content-center align-items-start">
          <div class="e-modal-card col-10 col-lg-6 bg-white shadow-sm e-rounding p-0">
            <div class="card-header e-user__header">
              <span>{{ $t('title.remoteOrderSettings') }}</span>
              <i @click="showSettings = false" class="fas fa-times e-modal-close-icon"></i>
            </div>
            <div class="card-body py-5 px-4">
              <div class="form-group">
                <label for="customerMessage">{{ $t('remoteOrder.customerMessage') }}</label>
                <input v-model="customerMessage" class="form-control" id="customerMessage">

                <label>{{ $t('remoteOrder.selectCategories') }}</label>
                <div v-if="categories.length === 0" style="margin-top: 20px; margin-bottom: 20px">
                  <div class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> {{ $t('remoteOrder.noCategories')}}</div>
                  <a href="/#/categories">{{ $t('remoteOrder.manageCategories')}}</a>
                  ({{ $t('menu.saleSettings') }} -> {{ $t('menu.categories') }})
                </div>
                <div v-for="category in categories" v-bind:key="category.categoryId">
                  <div class="custom-control custom-switch">
                    <input type="checkbox"  class="custom-control-input" v-model="category.enableRemoteOrder" v-bind:id="category.categoryId">
                    <label class="custom-control-label" :for="category.categoryId">{{ category.categoryName}}</label>
                  </div>
                </div>

                <div class="d-flex flex-wrap-reverse justify-content-end pt-3">
                  <div class="e-btn-mobile-container">
                    <button @click="showSettings = false" class="btn btn-outline-secondary mr-4">
                      {{ $t('button.back')}}
                    </button>
                    <button @click="save()" class="btn btn-primary">
                      {{ $t('button.save') }}
                    </button>
                  </div>
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
    import {baseURL} from '@/config/variables'

    export default {
        name: 'RemoteOrderSettings',
        components: { Loader, PremiumBanner },

        data: function () {
            return {
                barcodeUrl: "",
                remoteOrderApiKey: "",
                customerMessage: "",
                categories: [],
                loading: true,
                bu: baseURL,
                ak: localStorage.apiKey,
                showSettings: false,
                permanentBills: false
            }
        },

        mounted: function () {
            this.refresh();
        },

        methods: {
            refresh: function() {
                const vm = this;
                vm.loading = true;
                this.$http.post('/remote-order-settings/get-ro-settings',{})
                    .then(function (response) {
                        vm.barcodeUrl = response.data.barcodeUrl;
                        vm.remoteOrderApiKey=response.data.remoteOrderApiKey;
                        vm.customerMessage = response.data.customerMessage;
                        vm.categories = response.data.categories;
                      vm.$http.post('/bill/get-all-bills-fe',{})
                          .then(function (response) {
                            vm.permanentBills = response.data.permanentBills;
                            vm.loading = false;
                          });
                    });
            },
            save: function() {
              const vm = this;
              vm.loading = true;
              this.$http.post('/remote-order-settings/update-ro-settings',{
                categories: vm.categories,
                customerMessage: vm.customerMessage
              })
                  .then(function () {
                    vm.loading = false;
                    vm.showSettings = false;
                    vm.refresh();
                  });
            }
        }
    }

</script>
