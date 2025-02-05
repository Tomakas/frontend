<template>
  <div class="e-card e-rounding shadow-sm">
    <PremiumBanner/>

    <h1 class="h3">{{ $t('order.title.actual')}}</h1>

    <div class="row justify-content-md-center">
      <div class="col-lg-8 col-md-8 col-sm-12">
        <transition-group class="list-group" name="list-complete" tag="ul">
          <li class="list-complete-item" v-for="order in ordersCreated" :key="order.orderId">
            {{order.billName}} ({{order.createUserName}})
            <br>
            <b>{{order.quantity}} x {{order.text}}</b>
            <br>
            <button class="btn btn-primary" @click="done(order.orderId,'finished')">
              <i class="far fa-check-circle"></i>
              {{ $t('order.button.finish')}}</button>
          </li>
        </transition-group>
      </div>
    </div>

    <p></p>
    <h1 class="h3">{{ $t('order.title.finished') }}</h1>

    <div class="row justify-content-md-center">
      <div class="col-lg-8 col-md-8 col-sm-12">
        <transition-group class="list-group" name="list-complete" tag="ul">
          <li class="list-complete-item" v-for="order in ordersFinished" :key="order.orderId">
            {{ $t('order.deliverTo')}}: <b>{{order.billName}}</b> ({{order.createUserName}})
            <br>
            {{order.quantity}} x {{order.text}}
            <br>
            <button class="btn btn-primary" @click="done(order.orderId,'deleted')">
              <i class="fas fa-arrow-right"></i>
              {{ $t('order.button.deliver')}}</button>
          </li>
        </transition-group>
      </div>
    </div>

    <div style="color: grey" v-show="ordersCreated.length === 0 && ordersFinished.length===0">
      <i class="fas fa-info-circle"></i> {{ $t('order.noOrders')}}
    </div>

  </div>
</template>

<script>
import PremiumBanner from "@/components/PremiumBanner";

export default {
  name: 'Orders',
  components: {PremiumBanner},
  data: function () {
    return {
      ak: localStorage.apiKey,
      ordersCreated: [],
      ordersFinished: []
    }
  },
  mounted() {
    const vm = this;
    vm.refreshData();
    vm.$root.$on('ws_message',(data)=>{
      if (data.type === 'orderCreate' || data.type === 'orderUpdate') {
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
      this.$http.post('/order/get-orders', {secondsBack:3600})
          .then(function (response) {
            if(response.status === 200) {
              vm.ordersCreated = response.data.ordersCreated;
              vm.ordersFinished = response.data.ordersFinished;
            }
          });
    },

    done: function(orderId,state) {
      const vm = this;
      this.$http.post('/order/set-order-state', {orderId:orderId,orderState:state})
          .then(function (response) {
            if(response.status === 200) {
              vm.refreshData();
            }
          });
    }
  }
}
</script>


<style>
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin: 10px;
  padding: 10px;
  background-color: #F4F4F4;
}
.list-complete-enter, .list-complete-leave-to, .list-complete-leave-active
  /* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(230px);
}
.list-complete-leave-active {
  position: absolute;
}

</style>

