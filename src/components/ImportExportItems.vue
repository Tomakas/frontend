<template>
  <div class="e-card e-rounding shadow-sm">
    <h1 class="h3">{{ $t('items.exportImport.title') }}</h1>
      
    <ol class="mb-5">
      <li>{{ $t('items.exportImport.step1')}}</li>
      <li>{{ $t('items.exportImport.step2')}}</li>
      <li>{{ $t('items.exportImport.step3')}}</li>
    </ol>

    <div class="row">
      <div class="col-12 col-lg-6 mt-2 mb-2">
        <div class="e-inner-card shadow-sm e-rounding py-5 px-4">
          <h2>{{ $t('items.export') }}</h2>

          <p>{{ $t('items.exportImport.step1')}}</p>

          <a v-bind:href="bu+'/item/export-items?ak='+ak" class="btn btn-primary">
            <i class="fa fa-download pr-1"></i>{{ $t('items.export') }}
          </a>

          <p>
          </p>
          <div style="color: #1f5d08">{{ $t('excel.importExport.info') }}</div>

        </div>
      </div>

      <div class="col-12 col-lg-6 mt-2 mb-2">
        <div class="e-inner-card shadow-sm e-rounding py-5 px-4">
          <h2>{{ $t('items.import') }}</h2>
          <div class="form-group">
          <label for="file">{{ $t('items.excelFile') }}</label>
          <i v-tooltip="$t('items.exportImport.step3')" class="far fa-question-circle"></i>
          <input type="file" class="form-control-file" id="file" ref="file" accept=".xlsx"
                v-on:change="handleFileUpload()" style="margin-bottom: 10px"/>
          </div>
          
          <button @click="addImportFile()" class="btn btn-primary"><i class="fa fa-upload"></i> {{ $t('items.import') }}</button>
          <i v-if="importing" class="fas fa-cog fa-spin"></i>

        </div>
      </div>
    </div>

    





    <modal name="confirm-modal" :width="400" :height="300" :adaptive="true">
      <div style="margin: 20px;">
        <h3>{{ $t('items.importOk')}}</h3>
        {{ $t('items.import.confirm') }}
        <br>
        <span v-bind:class="{ import_green: importResult.inserted>0}">{{ $t('items.import.new') }} {{importResult.inserted}}</span><br>
        <span v-bind:class="{ import_blue: importResult.modified>0}">{{ $t('items.import.modified') }} {{importResult.modified}}</span><br>
        <span v-bind:class="{ import_red: importResult.deleted>0}">{{ $t('items.import.deleted') }} {{importResult.deleted}}</span><br>
        <i v-if="importing" class="fas fa-cog fa-spin"></i>
        <p></p>
          <button class="btn btn-outline-secondary" style="float: left; padding-left: 30px;padding-right: 30px"  @click="$modal.hide('confirm-modal');">{{ $t('no')}}</button>
          <button class="btn btn-warning" style="float: right;padding-left: 30px;padding-right: 30px" @click="confirmImport()">{{ $t('yes')}}</button>
      </div>
    </modal>

  </div>
</template>

<script>
import {baseURL} from '@/config/variables'

export default {
  name: 'ImportExportItems',

  data: function () {
    return {
      bu: baseURL,
      ak: localStorage.apiKey,
      file: '',
      importing: false,
      importResult: {
        importId: '',
        message: '',
        ready:false,
        inserted: 0,
        deleted: 0,
        modified: 0
      }
    }
  },

  methods: {
    handleFileUpload: function () {
      this.file = this.$refs.file.files[0];
    },
    confirmImport: function () {
      this.$modal.hide('confirm-modal');
      const vm = this;
      vm.importing = true;
      this.$http.post('/item/confirm-import',{
        importId : vm.importResult.importId,
        async: true
      })
          .then(function () {
            //check result later
            setTimeout(vm.checkImportResult,1000)
          },function() {
            vm.importing = false;
          });
    },
    checkImportResult: function () {
      const vm = this;
      this.$http.post('/item/check-import-state',{
        importId : vm.importResult.importId
      })
          .then(function (response) {
            if(response.data.state === 'DONE') {
              vm.importing = false;
              vm.$modal.cs_alert(vm.$t('items.import.success'));
              vm.$router.push('/items')
            } else if(response.data.state === 'ERROR' || response.data.message!==null) {
              vm.importing = false;
              vm.$modal.cs_alert(response.data.message);
            } else {
              //still processing
              setTimeout(vm.checkImportResult,1000)
            }
          },function() {
            //some error, try it again
            setTimeout(vm.checkImportResult,5000)
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
      this.$http.post('/item/import-items', formData, {
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
