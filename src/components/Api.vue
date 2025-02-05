<template>
    <div class="e-card e-rounding shadow-sm">
        <h1 class="h3">API key</h1>
        <Loader v-if="loading" />

        <div v-if="!loading">
            <p>{{$t('api.info')}}</p>           

            <p>See <a href="https://api.elementarypos.com" target="_blank">the API documentation</a> for more information.<p>

            <div class="my-4">
                <b>Security API Key:</b>
                <div v-if="apiEnabled">{{apiKey}}</div>
                <div v-if="!apiEnabled">
                <i>{{$t('api.disabled')}}</i>
                </div>
            </div>

            
            <div v-if="!apiEnabled">
                <button @click="enable()" class="btn btn-primary">
                    <i v-if="updateApiKey" class="fas fa-spinner fa-spin mr-2"></i>{{$t('button.enableAPI')}}
                </button>
            </div>
            <div v-if="apiEnabled">
                <button @click="disable()" class="btn btn-danger">
                    <i v-if="updateApiKey" class="fas fa-spinner fa-spin mr-2"></i>{{$t('button.disableAPI')}}
                </button>
            </div>

          <div v-if="apiEnabled" class="mt-5">
            {{$t('api.info3')}}
            <br>
            {{$t('api.info2')}} <b>api@elementarypos.com</b>.
          </div>
        </div>
      <div style="margin-top: 30px">
        <h1 class="h3">WordPress</h1>
        <p>There is also a <a href="https://wordpress.org/plugins/elementary-pos/" target="_blank">WordPress plugin</a> available.</p>
      </div>
      <div style="margin-top: 30px"></div>
      <h1 class="h3">Webhook</h1>
      <div>
        <div class="my-4">
        Webhook is called, in case of an event in the Elementary POS. You can connect your system with Elementary POS. For example, if a receipt has been created, your system will be notified.
          And the system can turn on a light bulb for example :) Your endpoint must return HTTP status <span style="background-color: yellowgreen;padding: 3px">200</span>.
        In case of an error, the call is repeated. If there are too many errors, the webhook will be disconnected automatically. <br>
        Specify your URL to call:
        <input v-model="webhookURI" placeholder="https://mysystem.com/pos"/><br>
        </div>

        <div class="my-4">
          URL will be called with <b>type</b> and <b>id</b> query parameters (HTTP GET method).<br>
          For example {{ webhookURI }}?<b>type</b>=receipt_created&<b>id</b>=RECEIPT_UUID<br>
          For more information about webhook types please check <a href="https://api.elementarypos.com" target="_blank">Elementary POS webhook documentation</a>.
        </div>

        <div>
        <button v-show="!webhookEnabled" @click="enableWebhook()" class="btn btn-primary">Enable webhook</button>
        <button v-show="webhookEnabled" @click="disableWebhook()" class="btn btn-danger">Disable webhook</button>
        </div>
        <div>
          <b>Webhook status:</b>
          <span v-if="webhookState==='initialized'" style="color: dodgerblue"> Testing ...</span>
          <span v-if="webhookState==='healthy'" style="color: green"> Healthy - activated</span>
          <span v-if="webhookState==='warning'"  style="color: orange"> Warning - some problems</span>
          <span v-if="webhookState==='error'" style="color: orangered"> Error - disabled</span>
          <span v-if="webhookState==='off'" style="color: lightseagreen"> Disabled</span>
        </div>
        <div>
          <span style="color: orangered">{{ webhookMessage }}</span>
        </div>
      </div>

    </div>
</template>

<script>
    import Loader from "@/components/Loader"

    export default {
        name: 'Api',
        components: { Loader },

        data: function () {
            return {
                loading: true,
                updateApiKey: false,
                apiKey: null,
                apiEnabled: false,
                webhookURI : '',
                webhookState : '',
                webhookMessage: '',
                webhookEnabled: false,
                updateWebhook: false
            }
        },

        mounted: function () {
          this.refresh();
        },

        methods: {
            refresh: function () {
                const vm = this;
                vm.loading = true;
                this.$http.post('/company/get-api-key')
                    .then(function (response) {
                        vm.apiKey = response.data.apiKey;
                        vm.apiEnabled = response.data.enabled;
                        vm.loading = false;
                    });
                vm.refreshWebhook();
            },
            setApi: function (enable) {
                const vm = this;
                vm.updateApiKey = true;
                this.$http.post('/company/enable-api-key', {enable:enable})
                    .then(function () {
                        vm.updateApiKey = false;
                        vm.refresh();
                    },function () {
                        vm.updateApiKey = false;
                    });
            },
            enable: function () {
              this.setApi(true);
            },
            disable: function () {
               if(confirm("Are you sure you want to disable API?")) {
                 this.setApi(false);
               }
            },
            enableWebhook: function () {
              const vm = this;
              vm.updateWebhook = true;
              this.$http.post('/webhook/enable-webhook', {uri:vm.webhookURI})
                  .then(function () {
                    vm.updateWebhook = false;
                    vm.refreshWebhook();
                  },function () {
                    vm.updateWebhook = false;
                    vm.refreshWebhook();
                  });
            },
            disableWebhook: function () {
             const vm = this;
              if(confirm("Are you sure you want to disable Webhook?")) {
                vm.updateWebhook = true;
                this.$http.post('/webhook/disable-webhook', {})
                    .then(function () {
                      vm.updateWebhook = false;
                      vm.refreshWebhook();
                    }, function () {
                      vm.updateWebhook = false;
                      vm.refreshWebhook();
                    });
              }
            },
            refreshWebhook: function() {
              const vm = this;
              this.$http.post('/webhook/get-webhook-settings', {})
                  .then(function (response) {
                    vm.webhookURI = response.data.uri;
                    vm.webhookState = response.data.state;
                    vm.webhookMessage = response.data.message;
                    vm.webhookEnabled = response.data.enabled;

                    if(vm.webhookState === 'initialized') {
                      setTimeout(function() { vm.refreshWebhook(); }, 3000);
                    }
                  });
            }
        }
    }
</script>
