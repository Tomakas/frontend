<template>
    <div class="e-card e-rounding shadow-sm">
      <img src="./../assets/lock_keyboard.png" class="d-block mx-auto">
<p></p>
      <h1 class="h3">{{ $t('behaviour.detection.title') }}</h1>
      {{ $t('behaviour.detection.description')}}
      <p></p>
      <div class="custom-control custom-switch">
        <input type="checkbox" class="custom-control-input" role="switch" id="enableBehaviourDetection" v-model="enableBehaviourDetection" @change="save()">
        <label class="custom-control-label" for="enableBehaviourDetection">{{ $t('behaviour.detection.enable') }}</label>
      </div>
      <p></p>
      <h1 class="h4">{{$t('behaviour.table.title')}}</h1>
      <table class="table table-hover e-table--responsive">
        <thead>
        <tr>
          <th>{{ $t('stock.history.table.date') }}</th>
          <th>{{ $t('shift.user') }}</th>
          <th>{{ $t('behaviour.table.problem') }}</th>
          <th>{{ $t('shift.note') }}</th>
          <th> <button @click="deleteAllEvents" class="btn btn-primary">
            {{ $t('behaviour.deleteAll') }}
          </button></th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" v-bind:key="event.userEventId">
            <td :data-title="$t('stock.history.table.date')">{{$d(new Date(Date.parse(event.createdAt)),'short')}}</td>
            <td :data-title="$t('shift.user')">{{ event.user.userName}} </td>
            <td :data-title="$t('behaviour.table.problem')">{{ translateType(event.type) }}</td>
            <td :data-title="$t('shift.note')">
              <div v-if="event.receiptData!==null && event.type==='receiptMultiplePrinted'">
                <button @click="goToReceipt(event.receiptData.receiptNum);">{{ event.receiptData.receiptNum}}</button>: {{ event.receiptData.totalStr}}
              </div>
              <div v-if="event.receiptData!==null && event.type==='receiptDateTooDifferent'">
                <button @click="goToReceipt(event.receiptData.receiptNum);">{{ event.receiptData.receiptNum}}</button>: {{ event.receiptData.dateTime}}
              </div>
              <div v-if="event.receiptData!==null && event.type==='receiptDeleted'">
                {{ event.receiptData.totalStr}}
              </div>
              <div v-if="event.receiptData!==null && event.type==='customerChanged'">
                <button @click="goToReceipt(event.receiptData.receiptNum);">{{ event.receiptData.receiptNum}}</button>: {{ event.receiptData.totalStr}} {{ event.receiptData.oldCustomer}} -> {{ event.receiptData.newCustomer}}
              </div>
              <div v-if="event.billItemData!==null">
                <span style="background: #bebcbc; padding: 1px" v-show="event.billItemData.orderCreated===false">no order</span>
                 {{ event.billItemData.billName}}: {{ event.billItemData.quantityStr}} x {{ event.billItemData.item}}, {{ event.billItemData.priceStr}}
              </div>
            </td>
            <td><button @click="deleteEvent(event.userEventId)" class="btn btn-primary">{{ $t('behaviour.delete') }}</button></td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
export default {
  name: 'BehaviourDetection',
  data: function () {
    return {
      email: localStorage.email,
      loading: false,
      enableBehaviourDetection: false,
      events : []
    }
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh: function() {
      const vm = this;
      vm.loading = true;
      this.$http.post('/behaviour/get-user-events',{})
          .then(function (response) {
            vm.events = response.data.list;
            vm.enableBehaviourDetection= response.data.enabled;
            vm.loading = false;
          });
    },
      save : function() {
        let vm = this;
        this.$http.post('/behaviour/save-settings',{
          enable: vm.enableBehaviourDetection
        }).then(function (){},function (){
          //not business
          vm.enableBehaviourDetection=false;
        });
    },
    deleteEvent: function(eventId) {
      const vm = this;
      vm.loading = true;
      this.$http.post('/behaviour/delete-event',{
        eventId: eventId
      })
          .then(function () {
            vm.refresh();
          });
    },
    deleteAllEvents: function() {
      const vm = this;
      if( confirm(vm.$t('behaviour.confirmDelete'))) {
      vm.loading = true;
      this.$http.post('/behaviour/delete-all-events')
          .then(function () {
            vm.refresh();
          });
      }
    },
    translateType: function(type) {
      return this.$t('behaviour.type.'+type);
    },
    goToReceipt(code) {
      let url = '/receipt-items?queryName='+encodeURIComponent(code);
      this.$router.push(url);
    },
  }
}
</script>
<style>

</style>

