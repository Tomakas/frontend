<template>
    <div class="e-card e-rounding shadow-sm">
        <h1 class="h3">{{ $t('customReceipt.title') }}</h1>

        <Loader v-if="loading" />

        <div class="row" v-if="!loading">
            <div class="col-12 col-lg-8 mt-2 mb-2">
              {{ $t('customReceipt.info') }}
              <div style="margin: 20px"></div>
              <textarea style="font-family: monospace;" v-model="receiptTemplate" class="form-control" id="receiptFooter" rows="20"></textarea>

              <div class="d-flex flex-wrap-reverse justify-content-end pt-3">
                <button @click="$router.push('/company')" class="btn btn-outline-secondary mr-4">{{$t('button.back')}}</button>
                <button @click="save()" class="btn btn-primary">
                  <i v-if="loading" class="fas fa-cog fa-spin mr-2"></i>{{$t('button.save')}}
                </button>
              </div>

              <h3>{{ $t('customReceipt.example') }}</h3>

              <button @click="copyClipboard()" class="btn btn-outline-secondary">{{ $t('customReceipt.copyExample') }}</button>

              <table>
                <tr>
                  <td>
              <pre style="white-space: pre-wrap">{{ receiptExampleTemplate }}</pre>
                  </td>
                  <td><div style="margin: 20px"><i class="fa-solid fa-arrow-right fa-2xl"></i></div></td>
                  <td>
                    <img v-if="$i18n.locale === 'cs'" src="./../assets/receipt-example_cs.png"/>
                    <img v-if="$i18n.locale === 'es'" src="./../assets/receipt-example_es.png"/>
                    <img v-if="$i18n.locale === 'en'" src="./../assets/receipt-example.png"/>
                  </td>
                </tr>
              </table>


              <div style="margin: 40px"></div>
              <h3>Legend</h3>
              <pre style="white-space: pre-wrap">
Line types:
-----------
[n] - normal line, small size
[b] - bold line, small size
[large] - large line
[center_large] - large center line
[logo] - company logo
[qrCode] - QR Code with URL to download receipt
[paymentQrCode] - Payment QR code

Variables:
----------
{date_time} - date and time of the receipt
{date} - date of the receipt
{time} - time of the receipt
{title} - title of the receipt
{header} - header of the receipt
{footer} - footer of the receipt
{footer_generated} - additional generated footer
{number} - receipt number
{cash_register} - cash register name
{items} - list of items
{taxes} - tax information
{rounding} - rounding amount
{total} - total receipt amount
{subtotal} - subtotal receipt amount
{tax_value} - receipt tax value
{payment_type} - payment type: cash, card, ...
{payment_type_details} - for example returned cash info
{cash_received} - cash received if cash payment
{cash_returned} - cash returned if cash payment
{bank_account} - bank account if bank payment
{user} - user who created receipt
{download_info} - URL where is possible download the receipt
{card_transaction} - Detailed info about card transaction
{validity_info} - info about validity of the receipt
{customer} - info about buyer
{merchant} - info about seller
{note} - receipt note
{bill_name} - name of bill (order) if the receipt was created from the bill
{bill_num} - bill number (order) if the receipt was created from the bill
{duplicated_info} - info, if receipt is duplicated
{loyalty_info} - info about loyalty points

Variable layouts:
----------------
{total} - align total to the left
{total   } - align total to the left
{   total} - align total to the right
{ total  } - center total

Examples of variable layouts:
**************** -> ****************
**{total     }** -> **28.50       **
**{     total}** -> **       28.50**
**{  total   }** -> **    28.50   **
**************** -> ****************
              </pre>
            </div>
        </div>

      <div ref="reference"></div>

    </div>
</template>

<script>
    import Loader from "@/components/Loader"

    export default {
        name: 'ReceiptTemplate',
        components: { Loader },

        data: function () {
            return {
              loading: true,
              receiptTemplate: '',
              receiptExampleTemplate : ''
            };
        },

        mounted: function () {
          this.refresh();
          this.readExample();
        },

        methods: {
            refresh: function () {
                const vm = this;
                vm.loading = true;
                this.$http.post('/company/get-receipt-template')
                    .then(function (response) {
                        vm.receiptTemplate = response.data.receiptTemplate;
                        vm.loading = false;
                    },function() {
                      vm.loading = false;
                    });
            },
           readExample: function () {
            const vm = this;
            this.$http.post('/company/get-example-receipt-template')
                .then(function (response) {
                  vm.receiptExampleTemplate = response.data.receiptTemplate;
                });
            },
            save: function () {
                const vm = this;
                vm.loading = true;
                this.$http.post('/company/update-receipt-template', {receiptTemplate: vm.receiptTemplate})
                    .then(function () {
                       vm.loading = false;
                    },function () {
                       vm.loading = false;
                    });
            },
          copyClipboard() {
            const storage = document.createElement('textarea');
            storage.value = this.receiptExampleTemplate;
            this.$refs.reference.appendChild(storage);
            storage.select();
            storage.setSelectionRange(0, 99999);
            document.execCommand('copy');
            this.$refs.reference.removeChild(storage);
            alert(this.$t('customReceipt.copiedToClipboard'))
          }
        }
    }
</script>

