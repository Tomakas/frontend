<template>
  <div class="e-card e-rounding shadow-sm">
    <PremiumBanner/>
    <h1 class="h3">{{ $t('bill.title') }}</h1>

    <Loader v-if="loading" />

    <div class="d-flex mb-2 justify-content-md-end justify-content-center">
      <button class="btn btn-primary m-2" @click="prepareCreateBill()">
        <i class="fas fa-plus pr-1"></i> {{ $t('bill.create') }}
      </button>
    </div>

    <div v-if="showType === 'bills'">
      <h3 v-if="temporaryBills.length>0">{{ $t('bill.temporary')}}</h3>
    <div class="row">
      <div class="col-12 col-lg-4 mt-2 mb-2" v-for="bill in temporaryBills" v-bind:key="bill.billId">
        <div class="e-inner-card shadow-sm e-rounding bill-background-temp" :class="{ lastChanged : bill.billId===lastChangedBillId }">
          <div class="card-header e-user__header">
            <span class="timer">{{ bill.caculatedTime }}</span>
            <a href="#" @click="prepareEditBill(bill.billId)" class="bill-link">{{bill.name}}</a>
            <br>
            <a href="#" @click="prepareEditBill(bill.billId)" class="bill-link">{{bill.number}}</a>
          </div>
          <div class="card-body py-5 px-4">
            <div v-show="bill.items.length > 0" class="receiptItem">
              <b>{{ $t('bill.total')}}: {{bill.total}}</b><br>
            </div>
            <p></p>
            <table class="receiptItem">
              <tr v-for="item in bill.items" :key="item.id">
                <td style="text-align: right;padding-right: 5px">{{item.quantity}}</td>
                <td style="padding-right: 5px">x</td>
                <td v-if="!item.modifier">{{item.name}}</td>
                <td v-if="item.modifier"><i>{{item.name}}</i></td>
              </tr>
            </table>
            <p></p>
            <div style="white-space: pre-line;font-style: italic;">{{ bill.customerName }}</div>
          </div>
        </div>
      </div>
    </div>
    <p></p>
      <h3 v-if="permanentBills.length>0">{{ $t('bill.permanent')}}</h3>
    <div class="row">

      <div class="col-12 col-lg-4 mt-2 mb-2" v-for="bill in permanentBills" v-bind:key="bill.billId">
        <div class="e-inner-card shadow-sm e-rounding bill-background-perm" :class="{ lastChanged : bill.billId===lastChangedBillId }">
          <div class="card-header e-user__header">
            <span class="timer">{{ bill.caculatedTime }}</span>
            <a href="#" @click="prepareEditBill(bill.billId)" class="bill-link">{{bill.name}}</a>
            <br>
            <a href="#" @click="prepareEditBill(bill.billId)" class="bill-link">{{bill.number}}</a>
          </div>
          <div class="card-body py-5 px-4">
            <div v-show="bill.items.length > 0" class="receiptItem">
              <b>{{ $t('bill.total')}}: {{bill.total}}</b><br>
            </div>
            <p></p>
            <table class="receiptItem">
              <tr v-for="item in bill.items" :key="item.id">
                <td style="text-align: right;padding-right: 5px">{{item.quantity}}</td>
                <td style="padding-right: 5px">x</td>
                <td v-if="!item.modifier">{{item.name}}</td>
                <td v-if="item.modifier"><i>{{item.name}}</i></td>
              </tr>
            </table>
            <p></p>
            <div style="white-space: pre-line;font-style: italic;">{{ bill.customerName }}</div>
          </div>
        </div>

      </div>

    </div>
    </div>


    <div class="e-card-backdrop" v-if="showType === 'editBill'">
      <div class="row e-modal-row justify-content-center align-items-start">
        <div class="e-modal-card col-10 col-lg-5 bg-white shadow-sm e-rounding p-0">
          <div class="card-header e-user__header">
            {{ $t('bill.bill') }}
            <i @click="showType = 'bills'" class="fas fa-times e-modal-close-icon"></i>
          </div>
          <div class="card-body py-5 px-4">
            <form>
              <div class="form-group">
                <label for="text">{{$t('bill.name')}}</label>
                <input v-model="billEdit.name" class="form-control" id="text">
              </div>
            </form>
            <div v-if="rightCompanySettings && billEdit.type==='permanent'">
              <div>
                <div>
                  {{  $t('remoteOrder.infoQRCodePermanent') }}:
                </div>
                <div>
                  <a :href="billEdit.remoteOrderLink" target="_blank">
                    <img style="margin-top: 10px; margin-bottom: 10px" :src="bu+'/remote-order-settings/get-permanent-bill-qr-code?&ak='+ak+'&billId='+billEdit.billId" width="200px"/>
                  </a>
                </div>
                <a v-bind:href="bu+'/remote-order-settings/get-permanent-bill-qr-code?&ak='+ak+'&billId='+billEdit.billId">
                  {{ $t('remoteOrder.downloadQRCode') }}
                </a>
              </div>
            </div>
            <div class="d-flex flex-wrap-reverse justify-content-between pt-3">
              <div>
                <button v-if="billEdit.items.length===0 && billEditType==='permanent'" @click="removeBill(billEdit.billId)" class="btn btn-danger mr-4">
                  {{ $t('bill.delete') }}
                </button>
              </div>
              <div class="e-btn-mobile-container">
                <button @click="showType = 'bills'" class="btn btn-outline-secondary mr-4">
                  {{ $t('button.back')}}
                </button>
                <button @click="renameBill()" class="btn btn-primary">
                  {{ $t('button.save') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>



    <div class="e-card-backdrop" v-show="showType === 'createBill'">
      <div class="row e-modal-row justify-content-center align-items-start">
        <div class="e-modal-card col-10 col-lg-5 bg-white shadow-sm e-rounding p-0">
          <div class="card-header e-user__header">
            Bill
            <i @click="showType = 'bills'" class="fas fa-times e-modal-close-icon"></i>
          </div>
          <div class="card-body py-5 px-4">
            <form>
              <div class="form-group">
                <label for="text">{{$t('bill.name')}}</label>
                <input ref="billName" v-model="billCreate.name" class="form-control" id="text">
              </div>
            </form>
            <div class="d-flex flex-wrap-reverse justify-content-between pt-3">
              <div class="e-btn-mobile-container">
                <button @click="showType = 'bills'" class="btn btn-outline-secondary mr-4">
                  {{ $t('button.back')}}
                </button>
                <button @click="createBill()" class="btn btn-primary">
                  {{ $t('bill.create') }}
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
import PremiumBanner from "@/components/PremiumBanner";
import rightUtil from "@/util/rights"
import {baseURL} from "@/config/variables";

export default {
  name: 'Bills',
  computed: {
    rightUtil() {
      return rightUtil
    }
  },
  components: { Loader, PremiumBanner },

  data: function () {
    return {
      temporaryBills: [],
      permanentBills: [],
      loading: true,
      lastChangedBillId: null,
      showType: 'bills',
      billEdit: {},
      billEditType: '',
      billCreate: {},
      rightCompanySettings: false,
      bu: baseURL,
      ak: localStorage.apiKey,
      intervalTimersId: null
    }
  },

  mounted: function () {
    this.refresh();

    const vm = this;
    vm.$root.$on('ws_message',(data)=>{
      if (data.type === 'billChange') {
        vm.lastChangedBillId = data.billId;
        vm.refresh();
        setTimeout(function () {
          vm.lastChangedBillId = null; //to allow next animation on the same bill
        }, 1000);
      }
    });

    vm.rightCompanySettings = rightUtil.hasRight(rightUtil.codes.companySettings);

    vm.intervalTimersId=setInterval(this.refreshAllBillTimers,1000);
  },

  beforeDestroy() {
    clearInterval(this.intervalTimersId);

    this.$root.$off("ws_message");
  },

  methods: {
    refresh: function() {
      const vm = this;
      vm.loading = true;
      this.$http.post('/bill/get-all-bills-fe',{})
          .then(function (response) {
            vm.temporaryBills = response.data.temporaryBills;
            vm.permanentBills = response.data.permanentBills;
            vm.loading = false;
          });
    },
    createBill: function() {
      const vm = this;
      if(vm.billCreate.name.length > 0) {
        vm.loading = true;
        this.$http.post('/bill/create-bill', {
          name: vm.billCreate.name,
          billType: 'permanent',
          items: []
        })
            .then(function () {
              vm.showType = 'bills';
              vm.loading = false;
              vm.refresh();
            },function() {
              vm.loading = false;
            });
      }
    },
    prepareEditBill: function(billId) {
       const vm = this;
       let billInfo = vm.getBill(billId);
       if(billInfo !== null) {
         vm.billEdit = billInfo.bill;
         vm.billEditType = billInfo.type;
         vm.showType = 'editBill';
       }
    },
    renameBill: function() {
      const vm = this;
      if(vm.billEdit.name.length > 0) {
        vm.loading = true;
        this.$http.post('/bill/rename-bill', {
          billId: vm.billEdit.billId,
          name: vm.billEdit.name,
          timestamp: vm.billEdit.timestamp
        })
            .then(function () {
              vm.showType = 'bills';
              vm.loading = false;
              vm.refresh();
            });
      }
    },
    removeBill: function(billId) {
      const vm = this;
      if( confirm(vm.$t('bill.confirmDelete'))) {
        vm.loading = true;
        this.$http.post('/bill/remove-bill', {
          billId: billId,
          timestamp: vm.billEdit.timestamp
        })
            .then(function () {
              vm.showType = 'bills';
              vm.loading = false;
              vm.refresh();
            });
      }
    },
    prepareCreateBill() {
      const vm = this;
       vm.billCreate = {
         billName:'',
         number: '',
       };
      vm.showType = 'createBill';
      vm.$nextTick(() => {
        vm.$refs.billName.focus();
      });
    },
    getBill(billId) {
      const vm = this;
      for(let i=0;i<vm.temporaryBills.length;i++) {
        if(vm.temporaryBills[i].billId===billId) {
          return {
            bill: vm.temporaryBills[i],
            type:'temporary'
          };
        }
      }
      for(let i=0;i<vm.permanentBills.length;i++) {
        if(vm.permanentBills[i].billId===billId) {
          return {
            bill: vm.permanentBills[i],
            type:'permanent'
          };
        }
      }
      return null;
    },
    refreshAllBillTimers() {
      this.refreshTimers(this.temporaryBills);
      this.refreshTimers(this.permanentBills);
      this.$forceUpdate();
    },
    refreshTimers(billList) {
      for(let i=0;i<billList.length;i++) {
        let bill = billList[i];
        let sec = ((new Date()) - bill.timestamp)/1000;
        if(sec < 3600 && bill.items.length>0) {
          //const h = Math.floor(sec / 3600);
          const m = Math.floor((sec % 3600) / 60);
          const s = Math.floor((sec % 3600) % 60);
          //const hDisplay = h > 0 ? `${h.toString().length > 1 ? `${h}` : `${0}${h}`}` : '00';
          const mDisplay = m > 0 ? `${m.toString().length > 1 ? `${m}` : `${0}${m}`}` : '00';
          const sDisplay = s > 0 ? `${s.toString().length > 1 ? `${s}` : `${0}${s}`}` : '00';
          bill.caculatedTime=`${mDisplay}:${sDisplay}`;
        } else {
          bill.caculatedTime=null;
        }
      }
    },
  }
}

</script>

<style>
.bill-number {
  border-style: solid;
  background: white;
  border-width: 1px;
  padding: 3px;
  margin: 2px;
}

.timer {
  position: absolute;
  right: 0px;
  top: 0px;
  padding: 8px;
  font-size: 14px;
}

.bill-link {
  color: #212529;
  text-decoration: underline;
}

.bill-background-temp {
  background: #a5bed0;
}
.bill-background-perm {
  background: #90b5ce;
}
.lastChanged {

  animation-duration: 1s;
  animation-timing-function: linear;
  animation-delay: 0ms;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;

  animation-name: onBillAnimation;
}


@keyframes onBillAnimation {
  0% {
    transform: scale(1);
  }
  25% {
    transform: rotate(5deg);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: rotate(-5deg);
  }
  100% {
    transform: scale(1);
  }
}


</style>