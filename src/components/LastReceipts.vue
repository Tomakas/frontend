<template>
  <div class="e-card e-rounding shadow-sm">
    <h1 class="h3">{{ $t('lastReceipts.info') }}</h1>

    <div class="row justify-content-md-center">
      <div class="col-lg-8 col-md-8 col-sm-12">

        <transition-group class="list-group" name="receipt-list" tag="ul">
          <li class="list-group-item" v-for="receipt in receipts" :key="receipt.receiptId">
            {{$d(new Date(Date.parse(receipt.dateTime)),'short')}}
            <br>
            {{receipt.receiptNumber}}  {{receipt.user}}
            <div class="receiptItem" v-for="item in receipt.items" :key="item.itemId">
              {{item.quantity}} x {{item.text}}
            </div>
            <div class="amountReceipt">{{receipt.amountTotal}}</div>
            <div>{{ getPaymentType(receipt.paymentType2) }}</div>
            <button class="btn btn-primary" @click="printFile(receipt.receiptId)">{{$t('lastReceipts.show')}}</button>
          </li>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import {baseURL} from '@/config/variables'
import utils from "@/util/util"

export default {
  name: 'LastReceipts',
  data: function () {
    return {
      bu: baseURL,
      ak: localStorage.apiKey,
      receipts: [],
      limit : 4,
    }
  },
  mounted: function () {
    const vm = this;
    vm.refreshData();
    vm.$root.$on('ws_message',(data)=>{
      if (data.type === 'receiptCreate' || data.type === 'receiptUpdate') {
        vm.refreshData();
      }
    });
  },
  beforeDestroy() {
    this.$root.$off("ws_message");
  },
  methods: {
    refreshData: function () {
      const vm = this;
      this.$http.post('/receipt/get-last-receipts', {limit:vm.limit})
          .then(function (response) {
            if(response.status === 200) {
              vm.receipts = response.data.receipts;
            }
          });
    },
    printFile: function(receiptId) {
      const dataUrl = this.bu+'/doc/receipt/'+receiptId;
      const pdfWindow = window.open(dataUrl);

      setTimeout(function() {
        pdfWindow.print();
      },3000);

      /*
      pdfWindow.addEventListener("unload", function (){
          if (pdfWindow.document.readyState === "loading")
            pdfWindow.addEventListener("load", function (){
              pdfWindow.print();
            });
          else {
            pdfWindow.print();
          }
      });
       */
      //pdfWindow.print();
      //pdfWindow.addEventListener('load', function() {pdfWindow.print()}, true);
    },
    getPaymentType(paymentType) {
      return utils.getPaymentType(paymentType,this);
    },
  }
}
</script>


<style>
.receipt-list-move {
  transition: transform 2s;
}
.amountReceipt {
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: large;
}
.receiptItem {
  font-family: monospace;
}
</style>

