<template>
    <div class="e-card e-rounding shadow-sm">
        <h1 class="h3">{{$t('title.companySettingsInfo')}}</h1>

        <Loader v-if="loadingCompany" />              

        <div class="row" v-if="show==='company' && !loadingCompany">
            <div class="col-12 col-lg-8 mt-2 mb-2">
                <table class="table" >
                    <tr>
                        <td class="e-detail-title">{{$t('form.companyName')}}</td>
                        <td><pre>{{company.receiptCompanyName}}</pre></td>
                    </tr>
                    <tr>
                        <td class="e-detail-title">{{$t('form.receiptHeader')}}</td>
                        <td><pre>{{company.receiptHeader}}</pre></td>
                    </tr>
                    <tr>
                        <td class="e-detail-title">{{$t('form.receiptFooter')}}</td>
                        <td><pre>{{company.receiptFooter}}</pre></td>
                    </tr>
                    <tr>
                        <td class="e-detail-title">{{ $t('companyType.title') }}</td>
                        <td>
                          {{ $t('companyType.label.'+company.companyType) }}
                        </td>
                    </tr>
                    <tr v-if="company.companyType==='other'">
                        <td></td>
                        <td>{{ company.companyTypeOther }}</td>
                    </tr>
                    <tr>
                     <td class="e-detail-title">{{$t('form.bankNumber')}}</td>
                    <td>{{company.bankNumber}}</td>
                  </tr>
                </table>
                <div class="d-flex justify-content-end">
                    <button @click="prepareEditCompany()" class="btn btn-primary">{{$t('button.modify')}}</button>
                    <br>
                </div>
            </div>
        </div>

        <div class="row" v-if="show==='company' && !loadingCompany">
          <div class="col-12 col-lg-8 mt-2 mb-2">
          <h1 class="h3">{{$t('title.companyLogo')}}</h1>

          <div  v-if="company.logoId!==null">
            <img class="logo" :src="bu+'/logo/get-logo?logoId='+company.logoId+'&ak='+ak"/>
          </div>

            <div v-show="company.logoId==null" class="form-group">
              <label for="file">{{$t('logo.info')}}</label>
              <input type="file" class="form-control-file" id="file" ref="file" accept=".png"
                     v-on:change="handleFileUpload()" style="margin-bottom: 10px"/>
              <button @click="uploadLogoFile()" class="btn btn-primary"><i class="fa fa-upload"></i> {{$t('button.uploadLogo')}}</button>
            </div>

            <div  v-show="company.logoId!==null">
              <div>{{$t('logo.infoApp')}}</div>
              <button @click="deleteLogo()" class="btn btn-danger"> {{$t('button.deleteLogo')}}</button>
            </div>

            <i v-if="uploading" class="fas fa-cog fa-spin"></i>

          </div>
        </div>

      <div style="margin: 30px"></div>
      <div class="row" v-if="show==='company' && !loadingCompany">
        <div class="col-12 col-lg-8 mt-2 mb-2">
          <h1 class="h3">{{ $t('customReceipt.title') }}</h1>

          <button @click="$router.push('/receipt-template')" class="btn btn-primary"><i class="fa-solid fa-screwdriver-wrench"></i> {{ $t('customReceipt.setButton') }}</button>
        </div>
      </div>


        <div class="e-card-backdrop" v-if="show==='editCompany'">
            <div class="row e-modal-row justify-content-center align-items-start">
                <div class="e-modal-card col-10 col-lg-6 bg-white shadow-sm e-rounding p-0">
                    <div class="card-header e-user__header">
                        <span>{{$t('button.modify')}}</span>
                        <i @click="cancel()" class="fas fa-times e-modal-close-icon"></i>
                    </div>
                    <div class="card-body py-5 px-4">
                        <form>
                            <div class="form-group mb-4">
                                <label for="companyName">{{$t('form.companyName')}}</label> <i v-tooltip="$t('tooltip.companyName')" class="far fa-question-circle"></i>
                                <textarea v-model="company.receiptCompanyName" class="form-control" id="companyName" rows="3">></textarea>
                            </div>
                            <div class="form-group mb-4">
                                <label for="receiptHeader">{{$t('form.receiptHeader')}}</label> <i v-tooltip="$t('tooltip.receiptHeader')" class="far fa-question-circle"></i>
                                <textarea v-model="company.receiptHeader" class="form-control" id="receiptHeader" rows="3"></textarea>
                            </div>
                            <div class="form-group mb-4">
                                <label for="receiptFooter">{{$t('form.receiptFooter')}}</label> <i v-tooltip="$t('tooltip.receiptFooter')" class="far fa-question-circle"></i>
                                <textarea v-model="company.receiptFooter" class="form-control" id="receiptFooter" rows="3"></textarea>
                            </div>
                            <div class="form-group mb-4">
                              <label for="companyType">{{ $t('companyType.edit.title') }}</label>
                              <select v-model="company.companyType" class="form-control" id="companyType">
                                <option v-for="type in companyTypes" v-bind:value="type"
                                        v-bind:key="type">
                                  {{ $t('companyType.label.'+type) }}
                                </option>
                              </select>
                            </div>
                            <div class="form-group mb-4" v-if="company.companyType==='other'">
                              <label for="companyTypeOther">{{ $t('companyType.edit.other.title') }}</label>
                              <input v-model="company.companyTypeOther" class="form-control" id="companyTypeOther"/>
                            </div>
                            <div class="form-group mb-4">
                              <label for="bankNumber">{{$t('form.bankNumber')}}</label> <i v-tooltip="$t('tooltip.bankNumber')" class="far fa-question-circle"></i>
                            <input v-model="company.bankNumber" class="form-control" id="bankNumber">
                          </div>
                        </form>
                       <div class="d-flex flex-wrap-reverse justify-content-end pt-3">
                        <button @click="cancel()" class="btn btn-outline-secondary mr-4">{{$t('button.cancel')}}</button>
                        <button @click="saveCompany()" class="btn btn-primary">
                          <i v-if="updatingCompany" class="fas fa-cog fa-spin mr-2"></i>{{$t('button.save')}}
                        </button>
                      </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import Loader from "@/components/Loader"
    import {baseURL} from '@/config/variables'

    export default {
        name: 'Company',
        components: { Loader },

        data: function () {
            return {
              show: 'company',
              company: {
                receiptCompanyName: '',
                receiptHeader: '',
                receiptFooter: '',
                logoId: null
              },
              loadingCompany: true,
              updatingCompany: false,
              bu: baseURL,
              ak: localStorage.apiKey,
              file: '',
              uploading: false,
              companyTypes: ['unknown', 'shop', 'restaurant', 'bar', 'services', 'accommodation', 'other']
            };
        },

        mounted: function () {
          this.refresh();
        },

        methods: {
            refresh: function () {
                const vm = this;
                vm.loadingCompany = true;
                this.$http.post('/company/get-company-settings')
                    .then(function (response) {
                        vm.company = response.data;
                        vm.loadingCompany = false;
                    });
            },
            saveCompany: function () {
                const vm = this;
                vm.updatingCompany = true;
                this.$http.post('/company/set-company-settings', this.company)
                    .then(function () {
                        vm.show = 'company';
                        vm.updatingCompany = false;
                        vm.refresh();
                    },function () {
                        vm.updatingCompany = false;
                    });
            },
            cancel: function() {
              const vm = this;
              vm.show = 'company';
              vm.refresh();
            },
            prepareEditCompany: function () {
                this.show = 'editCompany';
            },
            handleFileUpload: function () {
                this.file = this.$refs.file.files[0];
            },
            uploadLogoFile: function () {
                const vm = this;
                if (this.file === '') {
                  this.$modal.cs_alert(vm.$t('company.selectLogo'));
                  return;
                }

                vm.uploading = true;
                let formData = new FormData();
                formData.append('file', this.file);
                this.$http.post('/logo/upload-logo', formData, {
                  headers: {
                  'Content-Type': 'multipart/form-data'
                  }
                })
                .then(function (response) {
                  vm.uploading = false;

                  if (response.status === 200) {
                    vm.refresh();
                  }
                }, function () {
                  vm.uploading = false;
                });
          },
          deleteLogo: function () {
            if( confirm(this.$t('confirm.deleteLogo'))) {
              const vm = this;
              vm.uploading = true;
              this.$http.post('/logo/delete-logo', {})
                  .then(function () {
                    vm.uploading = false;
                    vm.refresh();
                  }, function () {
                    vm.uploading = false;
                  });
            }
          },
        }
    }
</script>


<style>
.logo {
  border-style: solid;
  border-width: 1px;
  padding: 10px;
  margin: 10px;
}

</style>