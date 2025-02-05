
const utils = {
    getPaymentType: function (paymentType,vm) {
        if(paymentType==='CARD') {
            return vm.$t('receipt.cardPayment');
        }
        if(paymentType==='CASH') {
            return vm.$t('receipt.cashPayment');
        }
        if(paymentType==='BANK') {
            return vm.$t('receipt.bankPayment');
        }
        if(paymentType==='CRYPTO') {
            return vm.$t('receipt.cryptoPayment');
        }
        return "";
    }
}

export default utils;