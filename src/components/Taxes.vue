<template>
  <div class="e-card e-rounding shadow-sm">
    <h1 class="h3">{{ $t('title.taxInfo') }}</h1>

    <Loader v-if="loading"/>

    <div v-if="!loading">
      <div class="d-flex flex-wrap-reverse justify-content-center justify-content-md-end mb-3">
        <button @click="prepareAddTax()" class="btn btn-primary m-2">
          <i class="fas fa-plus pr-1"></i>{{ $t('button.addTax') }}
        </button>
      </div>

      <table class="table table-hover e-table--responsive">
        <thead>
        <tr>
          <th>{{ $t('form.tax.name') }}</th>
          <th>{{ $t('form.tax.title') }}</th>
          <th>{{ $t('form.tax.type') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="tax in taxes" v-bind:key="tax.taxId">
          <td :data-title="$t('form.tax.name')">
            <span class="e-table-link" @click="prepareEditTax(tax.taxId)">{{ tax.name }}</span>
          </td>
          <td :data-title="$t('form.tax.percent')">{{ tax.displayValue }}</td>
          <td :data-title="$t('form.tax.type')">{{ getTaxTypeText(tax.taxType) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div><br></div>

    <div class="e-card-backdrop" v-if="showItem">
      <div class="row e-modal-row justify-content-center align-items-start">
        <div class="e-modal-card col-10 col-lg-5 bg-white shadow-sm e-rounding p-0">
          <div class="card-body py-5 px-4">
            <form>
              <div class="form-group">
                <label for="name">{{ $t('form.tax.name') }}</label>
                <input v-model="tax.name" class="form-control" id="name" :disabled="tax.taxId !== null">
              </div>
              <div class="form-group" v-if="tax.taxType !=='NO_TAX' && tax.taxType !=='CONSTANT' && tax.taxType!=='MULTIPLE'">
                <label for="percent">{{ $t('form.tax.percent') }}</label>
                <input v-model="tax.percent" class="form-control" id="percent">
              </div>
              <div class="form-group" v-if="tax.taxType ==='CONSTANT'">
                <label for="constant">{{ $t('form.tax.constant') }}</label>
                <input v-model="tax.percent" class="form-control" id="constant">
              </div>

              <div v-if="tax.taxType === 'MULTIPLE'">
                <b>{{ $t('tax.multiple.title')}}:</b>
                <div v-for="taxIt in taxesForRelated" v-bind:key="taxIt.taxId">
                  <input type="checkbox"  v-model="taxIt.enabledRT" /> <b>{{ taxIt.name}}</b> {{ taxIt.displayValue }}
                </div>
              </div>

              <div class="form-group">
                <label for="taxTypes">{{ $t('form.tax.type') }}</label>
                <select v-model="tax.taxType" class="form-control" id="taxTypes" :disabled="tax.taxId !== null">
                  <option v-for="taxType in taxTypes" v-bind:value="taxType"
                          v-bind:key="taxType">
                    {{ getTaxTypeText(taxType) }}
                  </option>
                </select>
              </div>
            </form>
            <div class="d-flex flex-wrap-reverse justify-content-between pt-3">
              <div>
              </div>
              <div class="e-btn-mobile-container">
                <button v-if="tax.taxId !== null" @click="deleteTax(tax.taxId)" class="btn btn-danger mr-4">
                  {{ $t('button.deleteTax') }}
                </button>
                <button @click="showItem = false" class="btn btn-outline-secondary mr-4">
                  {{ $t('button.back') }}
                </button>
                <button v-if="tax.taxId === null" @click="addTax()" class="btn btn-primary">
                  {{ $t('button.createTax') }}
                </button>
                <button v-else @click="editTax()" class="btn btn-primary">
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

export default {
  name: 'Taxes',
  components: {Loader},

  data: function () {
    return {
      taxes: [],
      taxesForRelated: [],
      tax: {},
      taxTypes: [],
      showItem: false,
      loading: true,
    }
  },

  mounted: function () {
    this.readTaxTypes();
  },

  methods: {
    refresh: function () {
      const vm = this;
      vm.loading = true;
      this.$http.post('/tax/get-taxes', {deleted: false})
          .then(function (response) {
            vm.taxes = response.data.taxes;
            vm.loading = false;
          });
    },
    clearItem: function () {
      this.tax = {
        taxId: null,
        name: "",
        percent: "",
        taxType: this.getDefaultTaxType()
      }
    },
    deleteTax: function (taxId) {
      if (confirm(this.$t('confirm.delete'))) {
        const vm = this;
        this.$http.post('/tax/delete-tax', {taxId: taxId})
            .then(function () {
              vm.showItem = false;
              vm.refresh();
            });
      }
    },
    prepareEditTax: function (taxId) {
      const vm = this;
      for (var i = 0; i < vm.taxes.length; i++) {
        var stax = vm.taxes[i];
        if (stax.taxId === taxId) {
          vm.tax = {
            taxId: stax.taxId,
            name: stax.name,
            percent: stax.taxType==='CONSTANT'?stax.percent:vm.getPercent(stax.percent, false),
            taxType: stax.taxType,
            relatedTaxes: stax.relatedTaxes
          }
          vm.showItem = true;
          break;
        }
      }
      vm.prepareRelatedTaxesForEdit(vm.tax);
    },
    prepareAddTax: function () {
      this.clearItem();
      this.showItem = true;
      this.prepareRelatedTaxesForCreate();
    },
    addTax: function () {
      const vm = this;
      var percent;
      if (vm.tax.taxType === 'NO_TAX' || vm.tax.taxType === 'MULTIPLE') {
        percent = null;
      } else if(vm.tax.taxType ==='CONSTANT') {
        percent = vm.fromNumber(vm.tax.percent);
        if (percent == null) {
          alert(vm.$t('tax.constant.notNumeric') + ' ' + vm.tax.percent);
          return;
        }
      } else {
        percent = vm.fromPercent(vm.tax.percent);
        if (percent == null) {
          alert(vm.$t('tax.percent.notNumeric') + ' ' + vm.tax.percent);
          return;
        }
      }
      this.$http.post('/tax/create-tax', {
        taxType: vm.tax.taxType,
        name: vm.tax.name,
        percent: percent,
        relatedTaxes: vm.processRT()
      })
          .then(function (response) {
            if (response.status === 200) {
              vm.refresh();
              vm.showItem = false;
            }
          });
    },
    editTax: function () {
      const vm = this;
      var percent;
      if (vm.tax.taxType === 'NO_TAX' || vm.tax.taxType === 'MULTIPLE') {
        percent = null;
      } else if(vm.tax.taxType ==='CONSTANT') {
        percent = vm.fromNumber(vm.tax.percent);
        if (percent == null) {
          alert(vm.$t('tax.constant.notNumeric') + ' ' + vm.tax.percent);
          return;
        }
      } else {
        percent = vm.fromPercent(vm.tax.percent);
        if (percent == null) {
          alert(vm.$t('tax.percent.notNumeric') + ' ' + vm.tax.percent);
          return;
        }
      }
      this.$http.post('/tax/edit-tax', {
        taxId: vm.tax.taxId,
        percent: percent,
        relatedTaxes: vm.processRT()
      })
          .then(function (response) {
            if (response.status === 200) {
              vm.refresh();
              vm.showItem = false;
            }
          });
    },
    readTaxTypes: function () {
      const vm = this;
      this.$http.post('/company/get-tax-types')
          .then(function (response) {
            vm.taxTypes = response.data.taxTypes;
            vm.refresh();
          });
    },
    getTaxTypeText: function (taxType) {
      return this.$t('taxEnum.' + taxType);
    },
    getDefaultTaxType: function () {
      for (var i = 0; i < this.taxTypes.length; i++) {
        if (this.taxTypes[i] !== 'NO_TAX') {
          return this.taxTypes[i];
        }
      }
    },
    getPercent: function (percent, addchar) {
      if (typeof percent === 'number') {
        return this.round(percent * 100) + (addchar ? ' %' : '');
      } else {
        return '';
      }
    },
    fromPercent: function (percent) {
      var val = parseFloat(percent);
      if (isNaN(val)) {
        return null;
      }
      if (val < 0) {
        return null;
      }
      return this.round(val / 100);
    },
    fromNumber: function (num) {
      var val = parseFloat(num);
      if (isNaN(val)) {
        return null;
      }
      if (val < 0) {
        return null;
      }
      return val;
    },
    round: function(val) {
      //quick fix double problem
      return Math.round((val + Number.EPSILON) * 10000) / 10000
    },
    getTaxesForRelated: function(selectedTax) {
      const vm = this;
      let ret = [];
      for(let i=0;i<vm.taxes.length;i++) {
        let tax = vm.taxes[i];
        if(tax.taxType!=='NO_TAX' && tax.taxType!=='INCLUDED_IN_PRICE' && (selectedTax===null || tax.taxId!==selectedTax.taxId)) {
          ret.push({
            taxId:tax.taxId,
            name:tax.name,
            taxType:tax.taxType,
            displayValue: tax.displayValue,
            enabledRT: false
          });
        }
      }
      return ret;
    },
    prepareRelatedTaxesForEdit: function(tax) {
       const vm = this;
       vm.taxesForRelated = vm.getTaxesForRelated(tax);
       for(let i=0;i<vm.taxesForRelated.length;i++) {
         vm.taxesForRelated[i].enabledRT=false;
         for(let j=0; j<tax.relatedTaxes.length;j++) {
           if(tax.relatedTaxes[j]===vm.taxesForRelated[i].taxId) {
             vm.taxesForRelated[i].enabledRT=true;
             break;
           }
         }
       }
    },
    prepareRelatedTaxesForCreate: function() {
      const vm = this;
      vm.taxesForRelated = vm.getTaxesForRelated(null);
    },
    processRT: function() {
      const vm = this;
      let ret = [];
      for(let i=0;i<vm.taxesForRelated.length;i++) {
        if(vm.taxesForRelated[i].enabledRT===true) {
          ret.push(vm.taxesForRelated[i].taxId);
        }
      }
      return ret;
    }
  }
}

</script>

<style>
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