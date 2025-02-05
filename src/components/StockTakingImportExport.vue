<template>
  <div class="e-card e-rounding shadow-sm">
    <h1 class="h3"><i class="fa-solid fa-list-check pr-2"></i> {{ $t('stocktaking.title') }}</h1>
      
    <ol class="mb-5">
      <li>{{ $t('stocktaking.step1')}}</li>
      <li>{{ $t('stocktaking.step2')}}</li>
      <li>{{ $t('stocktaking.step3')}}</li>
    </ol>

    <div class="row">
      <div class="col-12 col-lg-6 mt-2 mb-2">
        <div class="e-inner-card shadow-sm e-rounding py-5 px-4">
          <h2>{{ $t('stocktaking.export') }}</h2>

          <p>{{ $t('stocktaking.step1')}}</p>

          <Loader v-if="exportingStockTaking" />

            <button v-show="exportStockTakingFinished" @click="removeExport()" class="btn btn-outline-secondary mr-4">{{ $t('button.back') }}</button>
            <button v-show="!exportStockTakingFinished && !exportingStockTaking" @click="stockTakingExport()" class="btn btn-primary">
              <i class="fa-solid fa-list-check pr-2"></i>{{ $t('stocktaking.export') }}
            </button>
            <a v-show="exportStockTakingFinished" v-bind:href="bu+'/stock/download-report-document?id='+exportStockTakingDocumentId"
               class="btn btn-primary"><i class="fa fa-download pr-1"></i> {{ $t('stocktaking.download') }}</a>

        </div>
      </div>

      <div class="col-12 col-lg-6 mt-2 mb-2">
        <div class="e-inner-card shadow-sm e-rounding py-5 px-4">
          <h2>{{ $t('stocktaking.import') }}</h2>
          <div class="form-group">
          <label for="file">{{ $t('items.excelFile') }}</label>
          <i v-tooltip="$t('stocktaking.step3')" class="far fa-question-circle"></i>
          <input type="file" class="form-control-file" id="file" ref="file" accept=".xlsx"
                v-on:change="handleFileUpload()" style="margin-bottom: 10px"/>
          </div>
          
          <button @click="addImportFile()" class="btn btn-primary"><i class="fa fa-upload"></i> {{ $t('stocktaking.import') }}</button>
          <i v-if="importing" class="fas fa-cog fa-spin"></i>

        </div>
      </div>
    </div>


    <modal name="confirm-modal" :width="400" :height="300" :adaptive="true">
      <div style="margin: 20px;">
        <h3>{{ $t('items.importOk')}}</h3>
        {{ $t('items.import.confirm') }}
        <br>
        <span v-bind:class="{ import_blue: importResult.modified>0}">{{ $t('items.import.modified') }} {{importResult.modified}}</span><br>
        <i v-if="importing" class="fas fa-cog fa-spin"></i>
        <p></p>
          <button class="btn btn-outline-secondary" style="float: left; padding-left: 30px;padding-right: 30px"  @click="$modal.hide('confirm-modal');">{{ $t('no')}}</button>
          <button class="btn btn-warning" style="float: right;padding-left: 30px;padding-right: 30px" @click="confirmImport()">{{ $t('yes')}}</button>
      </div>
    </modal>

  </div>
</template>

<script>
import {baseURL} from '@/config/variables';
import Loader from "@/components/Loader";

export default {
  name: 'StockTakingImportExport',
  components: {Loader},
  data: function () {
    return {
      bu: baseURL,
      ak: localStorage.apiKey,
      file: '',
      importing: false,
      exportingStockTaking: false,
      exportStockTakingFinished: false,
      exportStockTakingDocumentId: null,
      importResult: {
        importId: '',
        message: '',
        ready:false,
        modified: 0
      }
    }
  },

  methods: {
    stockTakingExport: function() {
      if(!this.exportingStockTaking) {
        const vm = this;
        vm.exportingStockTaking = true;
        this.$http.post('/stock/stock-taking-export', {})
            .then(function (response) {
              vm.exportingStockTaking = false;
              vm.exportStockTakingFinished = true;
              vm.exportStockTakingDocumentId = response.data.documentId;
            }, function () {
              vm.exportingStockTaking = false;
              vm.exportStockTakingFinished = false;
            });
      }
    },
    removeExport: function() {
      const vm = this;
      vm.exportingStockTaking = false;
      vm.exportStockTakingFinished = false;
      vm.exportStockTakingDocumentId = null;
    },
    handleFileUpload: function () {
      this.file = this.$refs.file.files[0];
    },
    confirmImport: function () {
      this.$modal.hide('confirm-modal');
      const vm = this;
      vm.importing = true;
      this.$http.post('/stock/confirm-import',{
        importId : vm.importResult.importId
      })
          .then(function () {
            vm.importing = false;
            vm.$modal.cs_alert(vm.$t('items.import.success'));
            vm.$router.push('/stock')
          },function() {
            vm.importing = false;
          });
    },
    addImportFile: function () {
      const vm = this;
      if (this.file === '') {
        this.$modal.cs_alert(vm.$t('items.import.selectFile'));
        return;
      }
      vm.importing = true;
      let formData = new FormData();
      formData.append('file', this.file);
      this.$http.post('/stock/stock-taking-import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(function (response) {
            vm.importing = false;

            if (response.status === 200) {
              vm.importResult = response.data;

              if(vm.importResult.ready) {
                vm.$modal.show('confirm-modal');
              } else {
                vm.$modal.show('dialog', {
                  title: vm.$t('items.import.cannotImport'),
                  text: vm.importResult.message,
                  buttons: [
                    {
                      title: 'OK',       // Button title
                      default: true,    // Will be triggered by default if 'Enter' pressed.
                    }
                  ]
                });
              }
            }
          }, function () {
            vm.importing = false;
          });
    }
  }
}

</script>

<style>
.import_red {
  color: darkred;
}

.import_blue {
  color: darkblue;
}

.import_green {
  color: darkgreen;
}

</style>
