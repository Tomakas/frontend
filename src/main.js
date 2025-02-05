import Vue from 'vue'
import VueRouter from 'vue-router'
import Axios from 'axios'
import App from './App.vue'
import routes from './routes';
import VModal from 'vue-js-modal'
import {baseURL} from './config/variables'
import VTooltip from 'v-tooltip'
import i18n from './i18n'
import VueSuggestion from 'vue-suggestion';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VModal, { dialog: true });
Vue.use(VTooltip, {defaultTrigger: 'hover click'});
Vue.use(VueSuggestion);

const router = new VueRouter({routes});

const DEVELOP = process.env.NODE_ENV === "development";

Vue.prototype.$modal.cs_alert = function(message) {
  vue.$modal.show('dialog', {
    title: vue.$t('dialog.info'),
    text: message,
    buttons: [
      {
        title: 'OK',       // Button title
        default: true,    // Will be triggered by default if 'Enter' pressed.
      }
    ]
  })
};

Vue.prototype.$http = Axios.create({
  baseURL: baseURL
});

Vue.prototype.$http.interceptors.request.use((config) => {
  /** In dev, intercepts request and logs it into console for dev */
  if (DEVELOP) { console.info("✉️ ", config); }
  config.headers['X-Api-Key'] = localStorage.apiKey;
  return config;
}, (error) => {
  if (DEVELOP) { console.error("✉️ ", error); }
  return Promise.reject(error);
});

Vue.prototype.$http.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.data) {
    if(error.response.status===401) {
      vue.$root.$emit('not_logged');
    } else {
      vue.$modal.cs_alert(error.response.data.message);
    }
    return Promise.reject(error.response.data);
  }
  return Promise.reject(error.message);
});


const vue = new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')

