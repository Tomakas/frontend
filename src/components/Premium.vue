<template>
  <div class="e-card e-rounding shadow-sm">
    <h1 class="h3">{{ $t('subscription.title') }}</h1>

    <Loader v-if="loading" />

    <div v-if="state==='priceInfo'">
      <div class="e-price-info success e-rounding shadow-sm mb-2" v-show="premiumValidTo!==null && subscriptionTypeActive==='premium'">
        <div style="color: #419c30">
        <h2>{{ $t('premium_valid_to') }} {{premiumValidTo}}</h2>
        </div>
        <div v-if="showUpgrade">
          <div>
            {{ $t('business.more.title') }}:
            <ul>
              <li>{{ $t('business.advantage1') }}</li>
              <li>{{ $t('business.advantage2') }}</li>
              <li>{{ $t('business.advantage3') }}</li>
            </ul>
            {{ $t('business.info') }}
          </div>
          <button class="btn btn-warning btn-lg mt-2 mb-2" @click="upgrade(false)">
            {{ $t('premium.upgrade_to_business') }}
          </button>

          <div v-if="dialogType==='upgrade'" class="e-card-backdrop">
            <div class="row e-modal-row justify-content-center align-items-start">
              <div class="e-modal-card col-10 col-lg-3 bg-white shadow-sm e-rounding p-0">
                <div class="card-header e-user__header">
                  <span>{{  $t('premium.upgrade_to_business') }}</span>
                  <i @click="dialogType='none'" class="fas fa-times e-modal-close-icon"></i>
                </div>
                <div class="card-body py-5 px-4">
                  <div v-if="upgradeInfo.type==='googlePlay'">
                    {{ $t('premium.upgrade.googlePay.1') }}<br>
                    {{ $t('premium.upgrade.googlePay.2') }}<br>
                    <a href="https://play.google.com/store/account/subscriptions" target="_blank">{{ $t('premium.upgrade.googlePay.button')}}</a>
                  </div>

                  <div v-if="upgradeInfo.type==='goPay'">
                    {{ $t('premium.upgrade.goPay.1') }}<br>
                    {{ $t('premium.upgrade.goPay.2') }}<b> {{ upgradeInfo.additionalInfo }}</b><br>

                    <div class="d-flex justify-content-center">
                      <button @click="upgrade(true);" class="btn btn-outline-success btn-lg mt-2 mb-2">
                        {{ $t('premium.upgrade_to_business') }}
                      </button>
                    </div>
                  </div>

                  <div v-if="upgradeInfo.type==='half'">
                    {{ $t('premium.upgrade.half.1') }}<br>
                    {{ $t('premium.upgrade.half.2') }}<b> {{ upgradeInfo.additionalInfo }}</b><br>

                    <div class="d-flex justify-content-center">
                      <button @click="upgrade(true);" class="btn btn-outline-success btn-lg mt-2 mb-2">
                        {{ $t('premium.upgrade_to_business') }}
                      </button>
                    </div>
                  </div>

                  <div v-if="upgradeInfo.type==='manual'">
                    {{ $t('premium.upgrade.manual') }}<br>
                  </div>

                </div>
              </div>
            </div>
          </div>


        </div>
        <div v-if="recurrenceType!=='none'" style="margin-top: 20px;">
        <i class="fas fa-check-circle pr-2"></i>{{ $t('premium_auto_renew') }} {{nextPayment}}<br>
        <button @click="cancel()" class="btn btn-danger btn-lg mt-2 mb-2">
          {{ $t('premium_cancel_auto_renew') }}
        </button>
        </div>
        <p></p>
      </div>

      <div class="e-price-info success e-rounding shadow-sm mb-2" v-show="premiumValidTo!==null && subscriptionTypeActive==='business'">
        <div class="businessColor">
          <h2>{{$t('business_valid_to') }} {{premiumValidTo}}</h2>
        </div>
        <div v-if="recurrenceType!=='none'" style="margin-top: 20px;">
          <i class="fas fa-check-circle pr-2"></i>{{ $t('premium_auto_renew') }} {{nextPayment}}<br>
          <button @click="cancel()" class="btn btn-danger btn-lg mt-2 mb-2">
            {{ $t('premium_cancel_auto_renew') }}
          </button>
        </div>
        <p></p>
      </div>

      <div>

      <div v-show="showPaymentButtons">

        <div>
          <div class="py-5">
            <div>

              <div class="row">
                <div class="col-12 col-md-12">
                  <div class="shadow-sm p-3 mb-5 bg-white rounded">
                    <h2 v-if="subscriptionTypeShow==='premium'" class="h5 mb-3">{{ premiumValid?$t('premium_renew'):$t('premium_buy') }}</h2>
                    <h2 v-if="subscriptionTypeShow==='business'" class="h5 mb-3">{{ premiumValid?$t('business_renew'):$t('business_buy') }}</h2>
                    <p></p>
                    <div>
                    <ul>
                      <li>{{ $t('premium.advantage1') }}</li>
                      <li>{{ $t('premium.advantage2') }}</li>
                      <li>{{ $t('premium.advantage3') }}</li>
                      <li>{{ $t('premium.advantage4') }}</li>
                      <li>{{ $t('premium.advantage5') }}</li>
                      <li>{{ $t('premium.advantage6') }}</li>
                      <li v-show="subscriptionTypeShow==='premium'">{{ $t('premium.advantage7') }}</li>
                      <li v-show="subscriptionTypeShow==='premium'">{{ $t('premium.advantage8') }}</li>
                    </ul>
                      <div v-show="subscriptionTypeShow==='business'">
                        {{ $t('business.more.title') }}:
                      <ul>
                      <li>{{ $t('business.advantage1') }}</li>
                      <li>{{ $t('business.advantage2') }}</li>
                      <li>{{ $t('business.advantage3') }}</li>
                      </ul>
                        {{ $t('business.info') }}
                      </div>
                    </div>
                    <div v-if="subscriptionTypeShow==='premium'">{{ $t('premium.switchToBusiness') }} <a href="#" @click="subscriptionTypeShow='business';refresh();">{{ $t('business.subscription') }}</a>.</div>
                    <div v-if="subscriptionTypeShow==='business'">{{ $t('show') }} <a href="#" @click="subscriptionTypeShow='premium';refresh();">{{ $t('premium.subscription') }}</a>.</div>
                  </div>
                </div>
              </div>

              <div class="row">

                <div v-show="couponValid === false && !allowFree" class="col-12 col-md-6 text-center">
                  <div class="shadow p-3 mb-5 bg-white rounded">
                    <h2>{{ $t('premium.monthly_subscription') }}</h2>
                    <h3>{{ monthPriceStr }} / {{ $t('premium.month') }}</h3>
                    <span v-if="premiumValid" style="color: green">{{ $t('premium.cancel.warning') }} {{ premiumValidTo }}</span>
                    <button v-if="subscriptionTypeShow==='premium'" @click="dialogType='monthPayment'" class="btn btn-success btn-lg  mt-2 mb-2">
                      {{ $t('premium_get_premium') }}
                    </button>
                    <button v-if="subscriptionTypeShow==='business'" @click="dialogType='monthPayment'" class="btn btn-warning btn-lg  mt-2 mb-2">
                      {{ $t('premium_get_business') }}
                    </button><br>
                    {{ $t('premium.monthly.auto') }}<br>
                    {{ $t('premium.monthly.cancelAnyTime') }}<br>
                    {{ $t('premium.monthly.cardOnly') }}<br>
                  </div>
                </div>



                <div v-show="!allowFree" class="col-12 col-md-6 text-center">
                  <div class="shadow p-3 mb-5 bg-white rounded">
                    <a v-if="$i18n.locale === 'cs'" href="#" @click="dialogType='yearPayment'"><img src="./../assets/premium-tag-03-cs.svg" width="60" style="position: absolute; top: 0px; right: 15px;"></a>
                    <a v-if="$i18n.locale === 'en'" href="#" @click="dialogType='yearPayment'"><img src="./../assets/premium-tag-03-en.svg" width="60" style="position: absolute; top: 0px; right: 15px;"></a>
                    <a v-if="$i18n.locale === 'es'" href="#" @click="dialogType='yearPayment'"><img src="./../assets/premium-tag-03-es.svg" width="60" style="position: absolute; top: 0px; right: 15px;"></a>
                    <h2>{{ $t('premium.annual_subscription') }}</h2>
                    <div v-show="couponValid === true">
                      <h3 style="text-decoration: line-through;">{{ yearOriginalPrice }} / {{ $t('premium.year') }}</h3>
                    </div>
                    <h3>{{ yearPriceStr }} / {{ $t('premium.year') }}</h3>
                    <span v-if="premiumValid" style="color: green">{{ $t('premium.cancel.warning') }} {{ premiumValidTo }}</span>
                    <div v-show="couponValid === true"> <b>{{ couponMessage}} </b><br></div>
                    <button v-if="subscriptionTypeShow==='premium'" @click="dialogType='yearPayment'" class="btn btn-success btn-lg  mt-2 mb-2">
                      {{ $t('premium_get_premium') }}
                    </button>
                    <button v-if="subscriptionTypeShow==='business'" @click="dialogType='yearPayment'" class="btn btn-warning btn-lg  mt-2 mb-2">
                      {{ $t('premium_get_business') }}
                    </button><br>
                    {{ $t('premium.annual.no_auto') }}<br>
                    {{ $t('premium.annual.twoMonthsFree1') }} - <b>{{ $t('premium.annual.twoMonthsFree2') }}</b>. {{ $t('premium.annual.save') }} <b>{{ saveYearPayment }}</b>.<br>
                    {{ $t('premium.annual.morePaymentMethods') }}<br>
                  </div>
                </div>



              </div>

            </div>

            <div v-if="allowFree">
              <div class="col-12 col-md-6 py-5">
              <div class="shadow p-3 mb-5 bg-white rounded">
                <b>{{ couponMessage}} </b>
                <p></p>
              <button @click="startFree()" class="btn btn-success btn-lg">
                {{ $t('premium.activateFreePremium') }} {{ freeDays }} {{ $t('premium.activateFreePremium.days') }}
              </button>
            </div>
              </div>
            </div>

            <div v-show="couponValid === false" class="shadow-sm p-3 mb-5 bg-white rounded">
              <b>{{  $t('premium.coupon.use') }}</b><br>
              {{ $t('coupon')}}:  <input v-model="coupon" size="5">
              <button @click="refresh(null)" style="margin-left: 10px">
                {{ $t('coupon.use') }}
              </button>
              <br>
              <b style="color: darkred">{{ couponMessage}} </b>
            </div>

          </div>
        </div>

        <div v-if="dialogType==='monthPayment'" class="e-card-backdrop">
          <div class="row e-modal-row justify-content-center align-items-start">
            <div class="e-modal-card col-10 col-lg-3 bg-white shadow-sm e-rounding p-0">
              <div class="card-header e-user__header">
                <span>{{  $t('premium.monthly.recurrent') }}</span>
                <i @click="dialogType='none'" class="fas fa-times e-modal-close-icon"></i>
              </div>
              <div class="card-body py-5 px-4">
                {{ $t('premium.monthly.recurrent.info1') }} <b>{{ monthPriceStr }}</b>.<br>
                {{ $t('premium.monthly.recurrent.info2') }}<br>
                {{  $t('premium.email.info') }}: <b>{{ $t('footer.supportEmail')}}</b><br>
                <div class="d-flex justify-content-center">
                <button @click="preparePay('recurrenceMonth');" class="btn btn-outline-success btn-lg mt-2 mb-2">
                  {{ $t('premium.card_payment_button') }}
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="dialogType==='yearPayment'" class="e-card-backdrop">
          <div class="row e-modal-row justify-content-center align-items-start">
            <div class="e-modal-card col-10 col-lg-3 bg-white shadow-sm e-rounding p-0">
              <div class="card-header e-user__header">
                <span>{{ $t('premium.annual.payment') }}</span>
                <i @click="dialogType='none'" class="fas fa-times e-modal-close-icon"></i>
              </div>
              <div class="card-body py-5 px-4">
                {{  $t('premium.annual.payment.info1') }} <b>{{ yearPriceStr }}</b>.<br>
                {{  $t('premium.email.info') }}: <b>{{ $t('footer.supportEmail')}}</b><br>
                <p></p>

                <div class="d-flex justify-content-center">
                <button @click="preparePay('year');" class="btn btn-outline-success btn-lg  mt-2 mb-2">
                  {{ $t('premium.card_payment_button') }}
                </button>
                </div>

                <div class="d-flex justify-content-center">
                <button v-show="couponValid === false" @click="preparePay('bitcoinYear');" class="btn btn-outline-success btn-lg  mt-2 mb-2">
                  {{ $t('premium.bitcoin_payment_button')}}
                </button></div>

                <!--
                <div class="d-flex justify-content-center">
                <button v-show="couponValid === false" @click="preparePay('paypalYear');" class="btn btn-outline-success btn-lg  mt-2 mb-2">
                  Platba PayPal
                </button></div>-->

                <div class="d-flex justify-content-center">
                <button v-show="variableSymbol!==null && couponValid === false"  @click="dialogType='bankPayment'" class="btn btn-outline-success btn-lg  mt-2 mb-2">
                  {{ $t('premium.bank_payment_button')}}
                </button></div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="dialogType==='bankPayment'" class="e-card-backdrop">
          <div class="row e-modal-row justify-content-center align-items-start">
            <div class="e-modal-card col-10 col-lg-3 bg-white shadow-sm e-rounding p-0">
              <div class="card-header e-user__header">
                <span>Roční platba převodem</span>
                <i @click="dialogType='none'" class="fas fa-times e-modal-close-icon"></i>
              </div>
              <div class="card-body py-5 px-4">
                Jednorázová roční platba <b>{{ yearPriceStr }}</b>.<br>
                Email pro komunikaci: <b>podpora@elementarypos.com</b><br>
                <p></p>
                <div class="my-5">
                  <div class="text-center">
                    Získejte roční předplatné bankovním převodem:<br>
                    Číslo účtu: <b>2201922318/2010</b><br>
                    Variabilní symbol: <b>{{variableSymbol}}</b><br>
                    Částka: <b>{{ yearPriceStr }}</b><br>
                    <img :src="'https://api.paylibo.com/paylibo/generator/czech/image?accountNumber=2201922318&bankCode=2010&amount='+yearPrice+'&currency=CZK&vs='+variableSymbol+'&message=ElementaryPOS'">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        <p></p>
      </div>

    </div>

    <div v-if="state==='showInvoices'">
      <div>
        <button @click="state='priceInfo'" class="btn btn-secondary btn-lg  mt-2 mb-2">{{ $t('button.back') }}</button>
        <div class="row my-5" v-if="payments.length > 0">
          <div class="col-12 col-md-6">
            {{ $t('premium.your_payments') }}:
            <table class="table table-hover">
              <tbody>
              <tr v-for="p in payments" v-bind:key="p.invoiceId">
                <td>{{p.dateStr}}</td>
                <td>{{p.amountStr}}</td>
                <td> <a class="e-link-secondary" target="_blank" :href="bu+'/doc/receipt/'+p.invoiceId">{{ $t('premium.invoice') }}</a></td>
              </tr>
              </tbody>
            </table>
          </div>
          <br>
        </div><p></p>
        {{  $t('premium.invoice.google.tip1') }} <a target="_blank" href="https://payments.google.com/payments/home">{{  $t('premium.invoice.google.tip2') }}</a>.
      </div>
      <p></p>
    </div>

    <div v-if="state==='prepare'" class="row">
      <div class="col-12 col-lg-6">
        <p>{{ $t('premium.enter_information') }}</p>
      <div>
        <div class="form-group">
          <label for="firstName">{{ $t('form.firstName') }}</label>
          <input v-model="contact.firstName" class="form-control" id="firstName">
        </div>
        <div class="form-group">
          <label for="lastName">{{ $t('form.lastName') }}</label>
          <input v-model="contact.lastName" class="form-control" id="lastName">
        </div>
        <div class="form-group">
          <label for="email">{{ $t('form.email') }}</label>
          <input v-model="contact.email" class="form-control" id="email">
        </div>
        <div class="form-group">
          <label for="phoneNumber">{{ $t('form.phoneNumber') }}</label>
          <input v-model="contact.phoneNumber" class="form-control" id="phoneNumber">
        </div>
        <div class="form-group">
          <label for="street">{{ $t('form.street') }}</label>
          <input v-model="contact.street" class="form-control" id="street">
        </div>
        <div class="form-group">
          <label for="city">{{ $t('form.city') }}</label>
          <input v-model="contact.city" class="form-control" id="city">
        </div>
        <div class="form-group">
          <label for="postalCode">{{ $t('form.postalCode') }}</label>
          <input v-model="contact.postalCode" class="form-control" id="postalCode">
        </div>
        <label>{{$t('form.country')}}</label><br>{{contact.country}}
        <p></p>
        <div v-if="type==='recurrenceMonth'">
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" role="switch" id="check1" v-model="check1">
            <label class="custom-control-label" for="check1">{{ $t('premium.check1.1') }} <a :href="$t('premium.link.terms')" target="_blank">{{ $t('premium.check1.2') }}</a>.</label>
          </div>
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" role="switch" id="check2" v-model="check2">
            <label class="custom-control-label" for="check2">{{ $t('premium.check2.1') }} <a :href="$t('premium.link.privacyPolicy')" target="_blank">{{ $t('premium.check2.2') }}</a>.</label>
          </div>
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" role="switch" id="check3" v-model="check3">
            <label class="custom-control-label" for="check3">{{ $t('premium.check3.1') }} <a :href="$t('premium.link.recurringPayments')" target="_blank">{{ $t('premium.check3.2') }}</a>, {{ $t('premium.check3.3') }} <a href="https://gopay.com" target="_blank">GoPay</a> {{ $t('premium.check3.4') }}.</label>
          </div>
        </div>
        <div v-else>
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" role="switch" id="check1" v-model="check1">
            <label class="custom-control-label" for="check1">{{ $t('premium.check1.1') }} <a :href="$t('premium.link.terms')" target="_blank">{{ $t('premium.check1.2') }}</a>.</label>
          </div>
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" role="switch" id="check2" v-model="check2">
            <label class="custom-control-label" for="check2">{{ $t('premium.check2.1') }} <a :href="$t('premium.link.privacyPolicy')" target="_blank">{{ $t('premium.check2.2') }}</a>.</label>
          </div>
        </div>
        <p></p>
        <p class="text-right">
          <button @click="state = 'priceInfo'" class="btn btn-outline-secondary mr-3">
            {{ $t('button.back')}}
          </button>
          <button @click="payFlow()" class="btn btn-success" style="margin-left: 20px">
            {{ $t('premium.pay') }}
          </button>
        </p>

      </div>
      </div>
    </div>

    <div>
      <div v-if="state==='priceInfo'">
        <a href="/#/premium" @click="state='showInvoices'">{{ $t('premium.showAllPayments') }}</a>
      </div>
      <p></p>
      <div class="smallFont">
        eetplus s.r.o.<br>
        Bratranců Veverkových 587<br>
        Zelené Předměstí, 530 02 Pardubice<br>
        IČ: 06675301, DIČ: CZ06675301, DUNS: 49-599-9210<br>
        Czech Republic
        <p>Email: {{ $t('footer.supportEmail')}}</p>
      </div>

      <a href="https://gopay.cz" target="_blank"><img src="./../assets/pay/gopay.png" class="pr-3"/></a>
      <img src="./../assets/pay/visa.png" height="20" class="pr-3"/>
      <img src="./../assets/pay/visa2.png" height="20" class="pr-3"/>
      <img src="./../assets/pay/mc.png" height="20" class="pr-3"/>
      <img src="./../assets/pay/mc2.png" height="20" class="pr-3"/>
      <img src="./../assets/pay/m.png" height="20" class="pr-3"/>
    </div>

    <div v-if="state==='pay'" class="row">
      <div class="col-12 col-lg-6 mt-2 mb-2">
      </div>
    </div>

  </div>
</template>

<script>

import Loader from "@/components/Loader";
import {baseURL} from '@/config/variables'
import ga from "@/util/ga";

export default {
  name: 'Premium',
  components: {Loader },
  data: function () {
    return {
      bu: baseURL,
      contact: {
        firstName:'',
        lastName:'',
        email:'',
        phoneNumber:'',
        city:'',
        street:'',
        postalCode:'',
        country:'',
      },
      payUrl: '',
      state: 'created',
      type: 'year',
      coupon: '',
      couponValid: false,
      couponMessage: '',
      loading: false,
      showPaymentButtons: true,
      bankPayment: false,
      freeDays: null,
      allowFree: false,
      check1: false,
      check2: false,
      check3: false,
      dialogType: 'none',
      subscriptionTypeShow: null, //get this info
      subscriptionTypeActive: null,
      showUpgrade: false,
      upgradeInfo: {
        type: '',
        additionalInfo: '',
        allowUpgrade: ''
      }
    }
  },
  mounted() {
    //order id from callback
    const orderId = this.$route.query.id;
    this.refresh(orderId);
  },
  methods: {
    refresh: function(orderId) {
      const vm = this;
      vm.loading = true;
      this.$http.post('/gopay/get-payment-info',{orderId:orderId,coupon:vm.coupon, subscriptionType: vm.subscriptionTypeShow})
          .then(function (response) {
            vm.premiumValidTo=response.data.premiumValidTo;
            vm.premiumValid=response.data.premiumValid;
            vm.yearPriceStr=response.data.yearPriceStr;
            vm.monthPriceStr = response.data.monthPriceStr;
            vm.yearPrice=response.data.yearPrice;
            vm.successfulPayment=response.data.successfulPayment;
            vm.payments=response.data.payments;
            vm.contact=response.data.contactResponse;
            vm.showPaymentButtons = response.data.showPaymentButtons;
            vm.variableSymbol=response.data.variableSymbol;
            vm.couponValid=response.data.couponValid;
            vm.yearOriginalPrice=response.data.yearOriginalPriceStr;
            vm.couponMessage=response.data.couponMessage;
            vm.dayPrice=response.data.dayPriceStr;
            vm.saveYearPayment = response.data.saveYearPayment;
            vm.freeDays = response.data.freeDays;
            vm.allowFree = vm.freeDays!==null;
            vm.recurrenceType = response.data.recurrenceType;
            vm.nextPayment = response.data.nextPayment;
            vm.subscriptionTypeShow = response.data.subscriptionTypeShow;
            vm.subscriptionTypeActive = response.data.subscriptionTypeActive;
            vm.showUpgrade = response.data.showUpgrade;
            vm.loading = false;
            vm.state = 'priceInfo';

            if(vm.successfulPayment !== null) {
               if(vm.successfulPayment) {
                 localStorage.premium=true;
                 vm.$modal.cs_alert(vm.$t('payment.successful'));
                 ga.sendPaymentInfo();
               } else {
                 vm.$modal.cs_alert(vm.$t('payment.error'));
               }
            }

            const lp = response.data.lastPayment;
            if(lp!==null) {
              ga.sendLastPaymentInfo(lp.amount,lp.currency,lp.paymentId,lp.date,lp.payItemId);
            }

          });
    },

    preparePay:function(type) {
      this.type = type;
      this.state = 'prepare';
      this.showPayments=false;
    },

    startFree: function() {
      const vm=this;
      vm.loading = true;
      this.$http.post('/gopay/start-free', {coupon: vm.coupon})
          .then(function () {
            localStorage.premium=true;
            vm.refresh();
            });
    },

    upgrade: function(confirmation) {
      const vm=this;
      if (!confirmation || confirm(this.$t('premium.upgrade.confirm'))) {
        vm.loading = true;
        this.$http.post('/gopay/upgrade', {confirm: confirmation})
            .then(function (response) {
              vm.loading = false;
              vm.upgradeInfo = response.data;
              if (vm.upgradeInfo.type === 'upgradeSuccess') {
                //success upgrade
                vm.$modal.cs_alert(vm.$t('premium.upgrade.successful'));
                vm.dialogType = 'none';
                vm.refresh();
              } else {
                //show confirmation
                vm.dialogType = 'upgrade';
              }
            },function() {
              vm.loading = false;
            });
      }
    },

    payFlow:function() {
      const vm = this;
      if(vm.contact.email === null || vm.contact.email ==='') {
        this.$modal.cs_alert(vm.$t('error.missingEmail'));
        return;
      }
      if(vm.type==='recurrenceMonth') {
        if(!vm.check1 || !vm.check2 || !vm.check3) {
          this.$modal.cs_alert(vm.$t('premium.consents'));
          return;
        }
      } else {
        if(!vm.check1 || !vm.check2) {
          this.$modal.cs_alert(vm.$t('premium.consents'));
          return;
        }
      }
      this.state = 'blank'; //I do not why, but without changing state it does not work
      const req = {
        type: vm.type,
        firstName: vm.contact.firstName,
        lastName: vm.contact.lastName,
        email: vm.contact.email,
        phoneNumber: vm.contact.phoneNumber,
        city: vm.contact.city,
        street: vm.contact.street,
        postalCode: vm.contact.postalCode,
        coupon: vm.coupon,
        subscriptionType: vm.subscriptionTypeShow
      }
      vm.loading = true;
      this.$http.post('/gopay/start-new-payment',req)
          .then(function (response) {
            // eslint-disable-next-line no-undef
            _gopay.checkout({gatewayUrl: response.data.url, inline: true}, (checkoutResult) => {
              vm.loading = false;
              vm.refresh(checkoutResult.id);
            });
            //redirect
            //window.location.href = response.data.url;
          },function() {
            vm.loading = false;
            vm.state = 'prepare';
      });
    },

    cancel: function() {
      const vm = this;
      const warning1 = vm.$t('premium.cancel.warning1') + ' ' +  vm.monthPriceStr + '/' + vm.$t('premium.month') + '. ' + vm.$t('premium.cancel.warning2');
      const warning2 = vm.$t('premium.confirmCancelSubscription')
      if( confirm(warning1)) {
        if (confirm(warning2)) {
        this.$http.post('/gopay/cancel-recurrence')
            .then(function () {
              vm.refresh();
              vm.$modal.cs_alert(vm.$t('premium.confirmCancel'));
            });
      }
      }
    }
  }
}
</script>

<style>
.e-price-info {
  padding: .7rem 1rem;
  width: fit-content;
}

.okItem {
  color: #19415b;
}

.smallFont {
  font-size: 80%;
}

.businessColor {
  color: #e57e17;
}
</style>
