<template>
  <div class="e-card-backdrop">
    <div class="row e-modal-row justify-content-center align-items-start">
      <div class="e-modal-card col-10 col-lg-6 bg-white shadow-sm e-rounding p-0">
        <div class="card-header e-user__header">
          <span>{{ $t('shift.shiftsAndReports') }}</span>
          <i @click="closeShifts()" class="fas fa-times e-modal-close-icon"></i>
        </div>
        <div class="card-body py-5 px-4">
          <Loader v-if="loading" />
          <p></p>
          <div v-if="shiftCode===null">
          {{ $t('cash.actual') }}: {{ actualInCash }}
            <p></p>
          <table class="table table-hover e-table--responsive">
            <thead>
            <tr>
              <th>{{ $t('shift.shiftCode') }}</th>
              <th>{{ $t('shift.user') }}</th>
              <th>{{ $t('shift.start') }}</th>
              <th>{{ $t('shift.end') }}</th>
              <th>{{ $t('shift.note') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="shift in shifts" v-bind:key="shift.shiftCode">
              <td data-title="Shift code"><a href="#" @click="showZReport(shift.shiftCode)">{{ shift.shiftCode!=null?shift.shiftCode:'' }}</a></td>
              <td data-title="User">{{ shift.userName }}</td>
              <td data-title="Start">{{$d(new Date(Date.parse(shift.start)),'short')}}</td>
              <td data-title="End">{{shift.finish!=null?$d(new Date(Date.parse(shift.finish)),'short'):''}}</td>
              <td data-title="Note">{{ shift.finishNote!=null?shift.finishNote:'' }}</td>
            </tr>
            </tbody>
          </table>

            <div v-if="previous!==null || next!==null">
              <span v-if="previous!==null"><a href="#" @click="offset=previous;refresh()">{{ $t('button.previous') }}</a></span>
              <span v-else>{{ $t('button.previous') }}</span>
              &nbsp;
              <span v-if="next!==null"><a href="#" @click="offset=next;refresh()">{{ $t('button.next') }}</a></span>
              <span v-else>{{ $t('button.next') }}</span>
            </div>

          </div>

          <div class="table table-hover e-table--responsive" v-if="shiftCode!==null && loading === false">
            <h3>Z-Report</h3>
            <pre>
            Z-Report ID: {{ shiftCode }}<br>
            {{ $t('shift.cashRegister') }}: {{ zReport.cashRegisterName }} <br><br>
            {{ $t('shift.user') }}: {{ zReport.user }} <br>
            {{ $t('shift.note') }}: {{ zReport.shiftNote}}  <br><br>
            {{ $t('shift.start') }}: {{ $d(new Date(Date.parse(zReport.from)),'short') }} <br>
              {{ $t('shift.end') }}: {{ $d(new Date(Date.parse(zReport.to)),'short') }} <br><br>

            {{ $t('shift.totalCash') }}: {{ zReport.cashTotalStr }} <br>
             {{ $t('shift.totalCard') }}: {{ zReport.cardTotalStr }} <br>
              {{ $t('shift.totalBank') }}: {{ zReport.bankTotalStr }} <br>
              {{ $t('shift.totalCrypto') }}: {{ zReport.cryptoTotalStr }} <br>
               {{ $t('shift.total') }}: {{ zReport.totalStr }} <br><br>

            {{ $t('shift.issued') }}: {{ zReport.receipts }} <br>
            {{ $t('shift.cancelled') }}: {{ zReport.cancelled }} <br>
            {{ $t('shift.deleted') }}: {{ zReport.deleted }} <br>
            {{ $t('shift.printed') }}: {{ zReport.printed }} <br>
            {{ $t('shift.cashDrawerOpened') }}: {{ zReport.cashDrawerOpened }} <br><br>

            <div v-if="zReport.cashRecords.length > 0">
            {{ $t('shift.cashChange') }}:<br>
              <div v-for="cr in zReport.cashRecords" v-bind:key="cr.id">
                {{ cr.amountStr }}
                 {{cr.note}}
              </div>
            </div>
            <br>
             {{ $t('shift.shiftCash') }}: {{ zReport.shiftCashStr }}
            </pre>
          </div>
          <div class="d-flex flex-wrap-reverse justify-content-between pt-3">
            <div class="e-btn-mobile-container">
              <button @click="back()" class="btn btn-outline-secondary mr-4">
                {{ $t('button.back')}}
              </button>
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
  name: 'Shifts',
  components: { Loader },

  props: {
    deviceId: String,
  },
  data: function () {
    return {
      shifts: [],
      loading: true,
      shiftCode: null,
      zReport: {},
      previous: null,
      next: null,
      offset: 0
    }
  },

  mounted: function () {
    this.offset = 0;
    this.refresh();
  },

  methods: {
    closeShifts: function() {
      this.$emit('closeShifts','close');
    },
    back: function () {
      if(this.shiftCode != null) {
        this.shiftCode = null;
      } else {
        this.closeShifts();
      }
    },
    refresh: function() {
      const vm = this;
      vm.loading = true;
      this.$http.post('/shift/get-shifts',{
        deviceId:this.deviceId,
        offset:this.offset
      })
          .then(function (response) {
            vm.loading = false;
            vm.shifts = response.data.shifts;
            vm.actualInCash = response.data.actualInCash;
            vm.previous = response.data.previous;
            vm.next = response.data.next;
          });
    },
    showZReport: function(shiftCode) {
      this.shiftCode = shiftCode;
      const vm = this;
      vm.loading = true;
      this.$http.post('/shift/get-z-report',{shiftCode:shiftCode})
          .then(function (response) {
            vm.loading = false;
            vm.zReport = response.data;
          });
    }
  }
}

</script>