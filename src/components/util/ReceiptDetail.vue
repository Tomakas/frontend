<template>
  <div>
    {{$d(new Date(Date.parse(receiptDetail.dateTime)),'short')}}
    <br>
    {{receiptDetail.receiptNumber}}  {{receiptDetail.user}}
    <hr>
    <table class="receiptItem">
      <tr v-for="item in receiptDetail.items" :key="item.itemId">
        <td style="text-align: right;padding-right: 5px">{{item.quantityStr}}</td>
        <td>x</td>
        <td style="text-align: right;padding-right: 5px;padding-left: 5px">{{item.itemPriceStr}}</td>
        <td>{{item.text}}</td>
        <td style="text-align: right;padding-left: 5px">{{item.priceStr}}</td>
        <td style="text-align: right;padding-left: 5px; color: gray">{{ item.pointsStr }}</td>
      </tr>
    </table>
    <hr>
    <div class="amountReceipt">{{receiptDetail.totalStr}}</div>
    <hr>
    <div>{{ getPaymentType(receiptDetail.paymentType) }}</div>
    <hr>
    <div><b>{{ $t('receipts.customer') }}:</b>
      <div style="white-space: pre-line;">{{receiptDetail.customer}}</div>
    </div>
    <div><b>{{ $t('receipts.note') }}:</b> {{receiptDetail.note}}</div>
    <div><b>{{ $t('receipts.shiftCode') }}:</b> {{receiptDetail.shiftCode}}</div>
    <div><b>{{ $t('receipts.validity') }}:</b> {{ getValidity(receiptDetail.validity)}}</div>
    <div><b>{{ $t('receipts.user') }}:</b>{{ receiptDetail.user}}</div>
    <div><b>{{ $t('receipts.billName') }}:</b>{{receiptDetail.billName}}</div>
    <hr>
    <button class="btn btn-secondary" @click="printFile(receiptDetail.receiptId)">{{$t('lastReceipts.show')}}</button>
  </div>
</template>

<script>
import {baseURL} from '@/config/variables'
import utils from "@/util/util";

export default {
  props: {
    receiptDetail: { required: true }
  },
  data: function () {
    return {
      bu: baseURL,
      ak: localStorage.apiKey
    }
  },
  methods: {
    getPaymentType(paymentType) {
      return utils.getPaymentType(paymentType,this);
    },
    getValidity(validity) {
      if(validity === 'unnumbered') {
        return this.$t('validity.unnumbered');
      }
      if(validity === 'valid') {
        return this.$t('validity.valid');
      }
    },
    printFile: function(receiptId) {
      const dataUrl = this.bu+'/doc/receipt/'+receiptId;
      const pdfWindow = window.open(dataUrl);

      setTimeout(function() {
        pdfWindow.print();
      },3000);
    },
  }
};
</script>