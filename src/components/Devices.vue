<template>
    <div class="e-card e-rounding shadow-sm">
        <h1 class="h3">{{ $t('title.devicesInfo') }}</h1>

      <div class="d-flex mb-2 justify-content-md-end justify-content-center" v-show="showAddDeviceInfo===false">
        <button v-if="rightCompanySettings" @click="showAddDeviceInfo=true" class="btn btn-primary m-2">
          <i class="fas fa-plus pr-1"></i> {{ $t('button.newDevice') }}
        </button>
      </div>

      <div class="e-card-backdrop" v-if="showAddDeviceInfo===true">
        <div class="row e-modal-row justify-content-center align-items-start">
          <div class="e-modal-card col-10 col-lg-5 bg-white shadow-sm e-rounding p-0">
            <div class="card-header e-user__header">
              <span>{{$t('device.download')}}</span>
              <i @click="showAddDeviceInfo = false" class="fas fa-times e-modal-close-icon"></i>
            </div>
            <div class="card-body py-5 px-4">
              <div style="margin: 20px">
          <img v-if="$i18n.locale === 'cs'" style="margin-left: auto; margin-right: auto; display: block;" src="./../assets/screen/cs-calculator-frame.png" width="100" height="200">
          <img v-if="$i18n.locale === 'en'" style="margin-left: auto; margin-right: auto; display: block;" src="./../assets/screen/en-calculator-frame.png" width="50" height="100">
          <img v-if="$i18n.locale === 'es'" style="margin-left: auto; margin-right: auto; display: block;" src="./../assets/screen/es-calculator-frame.png" width="50" height="100">
              </div>
           <ol>
             <li><a :href="$t('device.downloadUrl')"  target="_blank">{{$t('device.download')}}</a>.</li>
             <li>{{ $t('device.userNameInfo')}}: <b>{{ getUserName() }}</b></li>
             <li> {{ $t('device.info3')}}</li>
           </ol>
              <div class="d-flex flex-wrap-reverse justify-content-center pt-3">
                <div class="e-btn-mobile-container">
                  <a :href="$t('device.downloadUrl')" class="btn btn-primary" target="_blank">{{$t('button.download')}}</a>
                </div>
              </div>
        </div>
          </div>
        </div>
      </div>
        <Loader v-if="loading" />                
                
        <div v-if="!loading" class="row">
            <div class="col-12 col-lg-6 mt-2 mb-2" v-for="device in devices" v-bind:key="device.deviceId">
                <div class="e-inner-card shadow-sm e-rounding">
                    <div class="card-header e-user__header" v-bind:class="{ 'e-not-active': !device.active }">
                        <i class="fas fa-mobile-alt pr-1"></i>
                        <span>
                            {{device.name}}
                        </span>
                    </div>
                    <div class="card-body py-5 px-4" v-bind:class="{ 'e-not-active': !device.active }">
                        <p v-if="device.oldVersion && device.active">
                         <span style="color: darkred"><i class="fa-solid fa-triangle-exclamation"></i> {{ $t('warning.oldVersion') }}</span>
                        </p>
                        <p v-if="device.synced && device.active" class="phone_synced pb-2" v-tooltip="$t('tooltip.deviceAllUpdated')">
                            <i class="fas fa-check pr-1"></i>
                            {{ $t('text.deviceAllUpdated') }}
                        </p>
                        <p v-if="!device.synced && device.active" class="phone_not_synced pb-2" v-tooltip="$t('tooltip.deviceNotUpdated')">
                            <i class="fas fa-plug pr-1"></i>
                            {{ $t('text.deviceNotUpdated') }}
                        </p>
                        <div class="e-detail-title">{{ $t('form.deviceName') }}</div>
                        <div class="pb-3">{{device.name}}</div>

                        <div class="e-detail-title">{{ $t('form.appVersion') }}</div>
                        <div class="pb-3" v-if="device.oldVersion && device.active" style="color: darkred">{{device.appVersion}}</div>
                        <div class="pb-3" v-if="!device.oldVersion || !device.active">{{device.appVersion}}</div>

                        <div class="e-detail-title">{{ $t('form.deviceLastUsed') }}</div>
                        <div class="pb-3"><span v-if="device.lastUsed!==null">{{$d(new Date(Date.parse(device.lastUsed)),'short')}}</span></div>

                        <div class="e-detail-title">{{ $t('deviceMode.title') }}</div>
                        <div class="pb-3">{{ $t('deviceMode.label.' + device.deviceMode) }}</div>

                        <div class="e-detail-title">{{ $t('form.ownerUserName') }}</div>
                        <div class="pb-3">{{device.ownerUserName}}</div>

                        <div class="e-detail-title">{{ $t('device.allowed_users')}}</div>
                        <div class="pb-3">
                           <span v-for="(au, index) in device.allowedUsers" v-bind:key="au.userId">
                           <span v-if="index !== 0">, </span><span>{{ au.userName }}</span>
                           </span>
                        </div>

                        <div v-if="device.deviceMode==='cashRegister'" class="e-detail-title">{{ $t('form.cashRegister') }}</div>
                        <div v-if="device.deviceMode==='cashRegister'" class="pb-3">{{device.cashRegister}}</div>

                       <!--
                        <div class="e-detail-title">{{ $t('form.totalReceipts') }}</div>
                        <div class="pb-3">{{device.receiptNum}}</div>
                        -->

                      <div class="pb-3">
                        <a href="#" @click="cashJournalOffset=0;readCashJournal(device.deviceId)">{{ $t('button.cashLog') }}</a><br>
                        <a href="#" @click="showShifts = true; deviceId = device.deviceId">{{ $t('shift.shiftsAndReports') }}</a></div>
                        <div class="d-flex justify-content-end">
                         <button v-if="rightCompanySettings" @click="prepareEditDevice(device.deviceId)" class="btn btn-outline-primary">
                           {{ $t('button.editDevice') }}
                         </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      <div class="e-card-backdrop" v-if="!loading && showEditDevice">
        <div class="row e-modal-row justify-content-center align-items-start">
          <div class="e-modal-card col-10 col-lg-6 bg-white shadow-sm e-rounding p-0">
            <div class="card-header e-user__header">
              <span>{{ $t('button.editDevice') }}</span>
              <i @click="showEditDevice = false" class="fas fa-times e-modal-close-icon"></i>
            </div>
            <div class="card-body py-5 px-4">
              <form>
                <div class="form-group mb-4">
                  <label for="deviceName">{{ $t('form.deviceName') }}</label>
                  <input v-model="device.name" class="form-control" id="deviceName">
                </div>
              </form>
              <p></p>
              <b>{{ $t('device.allowed_users')}}:</b>
              <div v-for="user in device.users" v-bind:key="user.userId">
                <input type="checkbox"  v-model="user.allowedForDevice" /> {{ user.userName}}
              </div>
              <div class="d-flex flex-wrap-reverse justify-content-between pt-3">
                <div>
                  <button v-if="device.active" @click="deactivateDevice(device.deviceId)" class="btn btn-danger mr-4">
                    {{ $t('button.deactivateDevice') }}
                  </button>
                </div>
                <div class="e-btn-mobile-container">
                  <button @click="showEditDevice = false" class="btn btn-outline-secondary mr-4">
                    {{ $t('button.back')}}
                  </button>
                  <button @click="editDevice()" class="btn btn-primary">
                    {{ $t('button.save') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="e-card-backdrop" v-if="!loading && showCashJournal">
        <div class="row e-modal-row justify-content-center align-items-start">
          <div class="e-modal-card col-10 col-lg-6 bg-white shadow-sm e-rounding p-0">
            <div class="card-header e-user__header">
              <span>{{ $t('button.cashLog') }}</span>
              <i @click="showCashJournal = false" class="fas fa-times e-modal-close-icon"></i>
            </div>
            <div class="card-body py-5 px-4">
              <h3>{{ $t('cash.actual') }}: {{ cash.actualInCash }}</h3>
              <p></p>
              <table class="table table-hover e-table--responsive">
                <thead>
                <tr>
                  <th>{{ $t('cash.date') }}</th>
                  <th style="text-align: right;">{{ $t('cash.amount') }}</th>
                  <th>{{ $t('cash.user') }}</th>
                  <th>{{ $t('cash.note') }}</th>
                </tr>
                </thead>
                <tbody>
                  <tr v-for="cr in cash.cashRecords" v-bind:key="cr.cardRecordId">
                    <td :data-title="$t('cash.date')">{{$d(new Date(Date.parse(cr.dateTime)),'short')}}</td>
                    <td :data-title="$t('cash.amount')" style="text-align: right;">
                    <span v-if="cr.amount <0" class="amount_negative">{{ cr.amountStr }} </span>
                    <span v-if="cr.amount >0" class="amount_positive">{{ cr.amountStr }} </span>
                    <span v-if="cr.amount === 0" class="amount_zero">{{ cr.amountStr }} </span>
                    </td>
                    <td :data-title="$t('cash.user')">{{ cr.userName }}</td>
                    <td :data-title="$t('cash.note')">{{ cr.note }}</td>
                  </tr>
                </tbody>
              </table>

              <div v-if="cash.previous!==null || cash.next!==null">
              <span v-if="cash.previous!==null"><a href="#" @click="cashJournalOffset=cash.previous;readCashJournal(cash.deviceId)">{{ $t('button.previous') }}</a></span>
              <span v-else>{{ $t('button.previous') }}</span>
              &nbsp;
              <span v-if="cash.next!==null"><a href="#" @click="cashJournalOffset=cash.next;readCashJournal(cash.deviceId)">{{ $t('button.next') }}</a></span>
              <span v-else>{{ $t('button.next') }}</span>
              </div>

              <div class="d-flex flex-wrap-reverse justify-content-between pt-3">
                <div class="e-btn-mobile-container">
                  <button @click="showCashJournal = false" class="btn btn-outline-secondary mr-4">
                    {{ $t('button.back')}}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Shifts v-if="showShifts" :device-id="deviceId" @closeShifts="showShifts=false"/>

    </div>
</template>

<script>
    import Loader from "@/components/Loader"
    import Shifts from "@/components/Shifts"
    import rightUtil from "@/util/rights"

    export default {
        name: 'Devices',
        components: { Loader, Shifts },

        data: function () {
            return {
                devices: [],
                device: {
                },
                cash: {
                },
                showEditDevice: false,
                showCashJournal: false,
                loading: true,
                showAddDeviceInfo: false,
                showShifts: false,
                deviceId: null,
                rightCompanySettings: false,
                cashJournalOffset: 0
            }
        },

        mounted: function () {
            this.setupRefresh();

            this.rightCompanySettings = rightUtil.hasRight(rightUtil.codes.companySettings);
        },

        destroyed: function() {
            clearInterval(this.inl);
        },

        methods: {
            refresh: function(loadingStatus) {
                const vm = this;
                vm.loading = loadingStatus;
                this.$http.post('/device/get-devices')
                    .then(function (response) {
                        vm.loading = false;
                        vm.devices = response.data.devices;
                    });
            },
          deactivateDevice: function(deviceId) {
                if(confirm(this.$t('warning.deactivateDevice'))) {
                  const vm = this;
                  vm.loading = true;
                  this.$http.post('/device/deactivate-device',{deviceId: deviceId})
                      .then(function () {
                        vm.showEditDevice = false;
                        vm.refresh(true);
                      });
                }
            },
          setupRefresh: function() {
            this.refresh(true);

            //setup periodic refresh
            this.inl = setInterval(() => {
              this.refresh(false);
            }, 4000);
          },
          getUserName: function () {
              return localStorage.userName;
          },
          readCashJournal: function(deviceId) {
            const vm = this;
            vm.loading = true;
            this.$http.post('/cash/get-cash-records',{
              deviceId:deviceId,
              offset: vm.cashJournalOffset
            })
                .then(function (response) {
                  vm.loading = false;
                  vm.cash = response.data;
                  vm.showCashJournal = true;
                });
          },
          prepareEditDevice: function (deviceId) {
            const vm = this;
            vm.loading = true;
            this.$http.post('/device/get-device',{deviceId:deviceId})
                .then(function (response) {
                  vm.loading = false;
                  vm.device = response.data;
                  vm.showEditDevice = true;
                });
          },
          editDevice: function () {
            const vm = this;
            //prepare users
            let allowedUsers = [];
            for(let i=0; i<vm.device.users.length; i++) {
              const user = vm.device.users[i];
              if(user.allowedForDevice === true) {
                allowedUsers.push(user.userId);
              }
            }
            this.$http.post('/device/update-device',{
              deviceId: vm.device.deviceId,
              name: vm.device.name,
              allowedUsers: allowedUsers
            }).then(function () {
                  vm.showEditDevice = false;
                  vm.refresh();
                });
          }
        }
    }

</script>

<style>
    .phone_synced {
        color: green;
    }
    .phone_not_synced {
        color: darkorange;
    }
    .amount_positive {
         color: green;
         font-weight: bold;
    }
    .amount_negative {
      color: red;
      font-weight: bold;
    }
    .amount_zero {
      color: black;
      font-weight: bold;
    }
</style>