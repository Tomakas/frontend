<template>
  <div id="app" v-bind:class="{ 'e-bg-light': logged, 'e-mobile-nav': showMenu }">
    <div class="e-container">
      <div class="row flex-nowrap">
        <!-- drawer menu -->
        <div class="e-drawer e-rounding bg-primary shadow-sm pb-4" v-if="logged">
          <i class="e-menu-close__icon fas fa-times" @click="toggleMenu()"></i>          
          <div class="e-backoffice">
            <span>Elementary POS {{ $t('title.backoffice') }}</span>
          </div>
          <nav class="e-drawer-nav flex-grow-1">
            <router-link to="/overview" class="e-drawer-item" v-show="rightAllSales" @click.native="toggleMenu()">
              <i class="e-drawer-icon fas fa-chart-simple"></i>
              {{ $t('menu.overview') }}
            </router-link>
            <router-link to="/receipt-items" class="e-drawer-item" v-show="rightAllReceipts" @click.native="toggleMenu()">
              <i class="e-drawer-icon fas fa-coins"></i>
              {{ $t('menu.sales') }}
            </router-link>
            <router-link to="/receipts" class="e-drawer-item" v-show="rightAllReceipts" @click.native="toggleMenu()">
              <i class="e-drawer-icon fas fa-bars"></i>
              {{ $t('menu.receipts') }}
            </router-link>
            <router-link to="/export-sales" class="e-drawer-item" v-show="rightExportSales" @click.native="toggleMenu()">
              <i class="e-drawer-icon fas fa-file-export"></i>
              {{ $t('menu.exportSales') }}
            </router-link>
            <router-link to="/bills" class="e-drawer-item" v-show="rightOrders" @click.native="toggleMenu()">
              <i class="e-drawer-icon fas fa-note-sticky"></i>
              {{ $t('menu.bill') }}
            </router-link>
            <router-link to="/orders" class="e-drawer-item" v-show="rightOrders" @click.native="toggleMenu()">
              <i class="e-drawer-icon fas fa-mug-hot"></i>
              {{ $t('menu.orders') }}
            </router-link>
            <router-link to="/stock" class="e-drawer-item" v-show="rightStock" @click.native="toggleMenu()">
              <i class="e-drawer-icon fas fa-warehouse"></i>
              {{ $t('menu.stock') }}
            </router-link>
            <router-link to="/devices" class="e-drawer-item" v-show="rightAllSales || rightCompanySettings" @click.native="toggleMenu()">
              <i class="e-drawer-icon fas fa-calculator"></i>
              {{ $t('menu.devices') }}
            </router-link>

            <div class="e-drawer-group" v-show="rightSalesItem" v-bind:class="{'e-collapse-customers': collapseCustomers }">
              <div class="e-drawer-item" @click="toggleCollapseCustomers()">
                <i class="e-drawer-icon fas fa-address-book"></i>
                {{ $t('menu.customersSuppliers') }}
              </div>
              <div>
                <router-link to="/customers" class="e-drawer-subitem" @click.native="toggleSubmenuCustomers()">
                  {{ $t('menu.customers') }}
                </router-link>
                <router-link to="/suppliers" class="e-drawer-subitem" @click.native="toggleSubmenuCustomers()">
                  {{ $t('menu.suppliers') }}
                </router-link>
              </div>
            </div>

              <!-- sales collapse group -->
              <div class="e-drawer-group" v-show="rightSalesItem" v-bind:class="{'e-collapse-sales': collapseSales }">
                <div class="e-drawer-item" @click="toggleCollapseSales()">
                  <i class="e-drawer-icon fas fa-building"></i>
                  {{ $t('menu.saleSettings') }}
                </div>
                <div>
                  <router-link to="/items" class="e-drawer-subitem" @click.native="toggleSubmenuSales()">
                    {{ $t('menu.items') }}
                  </router-link>
                  <router-link to="/import-export" class="e-drawer-subitem" @click.native="toggleSubmenuSales()">
                    {{ $t('menu.exportImport') }}
                  </router-link>
                  <router-link to="/categories" class="e-drawer-subitem" @click.native="toggleSubmenuSales()">
                    {{ $t('menu.categories') }}
                  </router-link>
                  <router-link to="/stock-items" class="e-drawer-subitem" @click.native="toggleSubmenuSales()">
                    {{ $t('menu.stockItems') }}
                  </router-link>
                  <router-link to="/stockmix-preview" class="e-drawer-subitem" @click.native="toggleSubmenuSales()">
                    {{ $t('preview.stockmix') }}
                  </router-link>
                </div>
              </div>

            <!-- company collapse group -->
            <div class="e-drawer-group" v-show="rightCompanySettings" v-bind:class="{'e-collapse-company': collapseCompany }">
              <div class="e-drawer-item" @click="toggleCollapseCompany()">
                <i class="e-drawer-icon fas fa-building"></i>
                {{ $t('menu.companySettings') }}
              </div>
              <div>
                <router-link to="/company" class="e-drawer-subitem" @click.native="toggleSubmenuCompany()">
                  {{ $t('menu.receiptSettings') }}
                </router-link>
                <router-link to="/taxes" class="e-drawer-subitem" @click.native="toggleSubmenuCompany()">
                  {{ $t('menu.taxes') }}
                </router-link>
                <router-link to="/users" class="e-drawer-subitem" @click.native="toggleSubmenuCompany()">
                  {{ $t('menu.users') }}
                </router-link>
                <router-link to="/remote-order" class="e-drawer-subitem" @click.native="toggleSubmenuCompany()">
                  {{ $t('menu.remoteOrder') }}
                </router-link>
                <router-link to="/behaviour-detection" class="e-drawer-subitem" @click.native="toggleSubmenuCompany()">
                  {{ $t('menu.behaviourDetection') }}
                </router-link>
                <router-link to="/api" class="e-drawer-subitem" @click.native="toggleSubmenuCompany()">
                  {{ $t('menu.api') }}
                </router-link>
                <router-link v-show="role==='admin'" to="/close-company" class="e-drawer-subitem" @click.native="toggleSubmenuCompany()">
                  {{ $t('closeAccount.menu') }}
                </router-link>
              </div>
            </div>

            <router-link to="/partner" class="e-drawer-item" @click.native="toggleMenu()">
              <i class="e-drawer-icon fas fa-handshake"></i>
              {{ $t('partner.menu') }}
            </router-link>

            <router-link to="/premium" class="e-drawer-item premium" v-show="rightCompanySettings" @click.native="toggleMenu()">
              <i class="e-drawer-icon fas fa-heart"></i>
              PREMIUM
            </router-link>
          </nav>
          <div class="text-center">
            <a @click="logout()" class="text-white d-inline-block p-3" href="#"><i class="fas fa-sign-out-alt pr-2"></i>{{ $t('menu.logout') }}</a>
          </div>
        </div> <!-- drawer menu -->

        <v-dialog/>

        <main class="e-main d-flex flex-column flex-grow-1">

          <header class="e-header e-rounding py-3 shadow-sm" v-if="logged">
            <div class="row px-4 px-md-5">
              <div @click="toggleMenu()" class="e-menu__icon" aria-label="menu">
                <i class="fas fa-bars px-2" aria-hidden="true"></i>
              </div>
              <a class="e-link-secondary" href="/#/survey"><i class="far fa-comment-dots pr-1"></i>{{ $t('feedback')}}</a>
              <div class="e-logo flex-grow-1 text-center">
                <a href="https://elementarypos.com" target="_blank"><img src="./assets/elementaryPOS.svg" width="200"></a>
              </div>
              <div class="e-survey__container">
                <!-- <i class="fas fa-paper-plane pr-2"></i> -->
                <a class="e-link-secondary" href="/#/user"><i class="fa-solid fa-user pr-1"></i>{{ userName }}</a>
              </div>
              <div class="text-right">
                <LocaleSwitcher />
              </div>
            </div>
          </header>

          <section class="flex-grow-1">
            <router-view></router-view>
          </section>

          <footer class="e-footer text-secondary">
            <div class="row">
              <div class="col-sm-12 col-lg-3 mb-3">
                <h6 class="text-uppercase">{{ $t('footer.about') }}</h6>
                <a href="https://www.elementarypos.com" class="d-block text-secondary">www.elementarypos.com</a>
              </div>

              <div class="col-sm-12 col-lg-3 mb-3">
                <h6 class="text-uppercase">{{ $t('footer.app') }}</h6>
                <a :href="$t('downloadAppLink')" class="d-block text-secondary">{{ $t('downloadApp') }}</a>
              </div>

              <div class="col-sm-12 col-lg-3 mb-3">
                <h6 class="text-uppercase">{{ $t('footer.support')}}</h6>
                <a :href="'mailto:'+ $t('footer.supportEmail')" class="text-secondary">{{ $t('footer.supportEmail')}}</a>
              </div>

              <div class="col-sm-12 col-lg-3 mb-3">
                <h6 class="text-uppercase">API</h6>
                <a href="https://api.elementarypos.com" class="text-secondary">api.elementarypos.com</a>
              </div>

            </div>
            <small class="text-secondary">© 2024 Copyright: eetplus s.r.o.</small>
          </footer>

        </main>
      </div>
    </div> <!-- .e-container -->
  </div> <!-- #app -->

</template>

<script>
  import LocaleSwitcher from "@/components/LocaleSwitcher"
  import {websocketURL} from '@/config/variables'
  import rightUtil from "@/util/rights"
  import ga from "@/util/ga";

  export default {
    name: 'App',
    components: { LocaleSwitcher },

    data: function () {
      return {
        logged: false,
        showMenu: false,
        userName: '',
        email: '',
        admin: true,
        accountant: true,
        wu: websocketURL,
        connection: null,
        wsRun: false,
        wsErrors : 0,
        wsWorker: null,
        collapseCustomers: false,
        collapseSales: false,
        collapseCompany: false,
        rightAllSales: false,
        rightAllReceipts: false,
        rightOrders: false,
        rightStock: false,
        rightCompanySettings: false,
        rightSalesItem: false,
        rightExportSales: false,
        originalPath: null
      }
    },

    mounted: function () {
      const beforeLogin='/login';

      if(typeof this.$route.query.ak !== 'undefined') {
        //request comes from mobile device
        localStorage.apiKey = this.$route.query.ak;
        this.logged = true;
        this.obtainUserInfo();
        this.startWS();
      } else {
        if (typeof localStorage.apiKey !== 'undefined' && localStorage.apiKey.startsWith('ak-')) {
          //this.$router.push(afterLogin);
          this.logged = true;
          this.obtainUserInfo();
          this.startWS();
        } else {
          this.$router.push(beforeLogin).catch(()=>{}); // remove Avoided redundant navigation error message
          this.logged = false;
          this.disconnectWs();
        }
      }

      this.$root.$on('not_logged',()=>{
        this.originalPath=this.$route.path;
        this.$router.push(beforeLogin);
        localStorage.apiKey='';
        localStorage.premium='';
        this.logged = false;
        this.disconnectWs();
      });
      this.$root.$on('login',()=>{
        if(this.originalPath!==null && this.originalPath!=='/login') {
          this.$router.push(this.originalPath);
        } else {
          this.$router.push(rightUtil.getDefaultPage());
        }
        this.logged = true;
        this.obtainUserInfo();
        this.startWS();
      });

      //api key refresh
      this.apiKeyRefresh = setInterval(() => {
        this.obtainUserInfo();
      }, 1500000);

      //enable worker to keep alive websocket
      if (typeof(Worker) !== "undefined") {
        const vm = this;
        this.wsWorker = new Worker('/worker.js');
        this.wsWorker.onmessage = function () {
          if(vm.wsRun === true && vm.connection!==null) {
            //keep alive through haproxy
            vm.connection.send('');
            console.log('keep alive');
          }
        }
      }
    },

    destroyed: function() {
      if(this.wsWorker !== null) {
        this.wsWorker.terminate();
      }

      clearInterval(this.apiKeyRefresh);

      this.disconnectWs();
    },

    methods: {
      logout: function () {
        const vm = this;
        this.logged = false;
        this.$router.push('/login');
        this.$http.post('/auth/logout').then(function () {
          localStorage.apiKey='';
          localStorage.premium='';
          vm.disconnectWs();
        });
      },

      toggleMenu: function() {
        this.showMenu = !this.showMenu;
        this.collapseSales = false;
        this.collapseCompany = false;
        this.collapseCustomers = false;
      },

      toggleSubmenuSales: function() {
        this.showMenu = !this.showMenu;
        this.collapseCompany = false;
        this.collapseCustomers = false;
      },

      toggleSubmenuCompany: function() {
        this.showMenu = !this.showMenu;
        this.collapseSales = false;
        this.collapseCustomers = false;
      },

      toggleSubmenuCustomers: function() {
        this.showMenu = !this.showMenu;
        this.collapseSales = false;
        this.collapseCompany = false;
      },

      toggleCollapseSales: function() {
        this.collapseSales = !this.collapseSales;
        this.collapseCompany = false;
        this.collapseCustomers = false;
      },

      toggleCollapseCompany: function() {
        this.collapseCompany = !this.collapseCompany;
        this.collapseSales = false;
        this.collapseCustomers = false;
      },

      toggleCollapseCustomers: function() {
        this.collapseCustomers = !this.collapseCustomers;
        this.collapseSales = false;
        this.collapseCompany = false;
      },

      obtainUserInfo: function() {
        const vm = this;
        if(this.logged) {
          this.$http.post('/company/get-premium-info', {})
              .then(function (response) {
                localStorage.premium = response.data.premium;
                localStorage.userId = response.data.userId;
                localStorage.userName = response.data.userName;
                localStorage.email = response.data.email;
                localStorage.role = response.data.role;
                rightUtil.rightsToLocalStorage(response.data.rights);
                //local storage is not reactive, set some property
                vm.logged = true;
                vm.userName = response.data.userName;
                vm.email = response.data.email;
                vm.role = response.data.role;
                vm.rightAllSales = rightUtil.hasRight(rightUtil.codes.allSales);
                vm.rightAllReceipts =  rightUtil.hasRight(rightUtil.codes.allReceipts);
                vm.rightOrders = rightUtil.hasRight(rightUtil.codes.orders);
                vm.rightStock = rightUtil.hasRight(rightUtil.codes.stock);
                vm.rightCompanySettings = rightUtil.hasRight(rightUtil.codes.companySettings);
                vm.rightSalesItem = rightUtil.hasRight(rightUtil.codes.salesItem);
                vm.rightExportSales = rightUtil.hasRight(rightUtil.codes.exportSales);

                ga.sendUserId();
              });
        }
      },
      connectWs: function () {
        const vm = this;

        vm.wsRun = true;

        vm.connection = new WebSocket(this.wu + "/web-ws?ak=" + localStorage.apiKey);
        vm.connection.onmessage = function (event) {
          const data = JSON.parse(event.data);
          vm.$root.$emit('ws_message',data);
        }
        vm.connection.onerror = function() {
          console.log("WS error");
        }

        this.connection.onopen = function () {
          console.log("WS success");
          vm.wsErrors = 0;
        }

        this.connection.onclose = function () {
          console.log("WS close");
          if (vm.wsRun === true) {
            vm.wsErrors = vm.wsErrors + 1;
            let tVal = 5000;
            if(vm.wsErrors > 10) {
              tVal = 240000;
            }
            setTimeout(function () {
              if(vm.wsRun === true) {
                vm.connectWs();
              }
            }, tVal);
          }
        }
      },
      disconnectWs: function() {
        const vm = this;
        vm.wsRun = false;
        if(vm.connection !== null) {
          const conn = vm.connection;
          vm.connection = null;
          try {
            conn.close();
          } catch(e) {
            //ignore
          }
        }
      },
      startWS: function() {
        const vm = this;
        vm.disconnectWs();
        setTimeout(function () {
          vm.connectWs();
        }, 100);
      }
    }
  }
</script>

<style>
  .tooltip {
    display: block !important;
    z-index: 10000;
  }

  .tooltip .tooltip-inner {
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
  }

  .tooltip .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    z-index: 1;
  }

  .tooltip[x-placement^="top"] {
    margin-bottom: 5px;
  }

  .tooltip[x-placement^="top"] .tooltip-arrow {
    border-width: 5px 5px 0 5px;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    bottom: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
  }

  .tooltip[x-placement^="bottom"] {
    margin-top: 5px;
  }

  .tooltip[x-placement^="bottom"] .tooltip-arrow {
    border-width: 0 5px 5px 5px;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-top-color: transparent !important;
    top: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
  }

  .tooltip[x-placement^="right"] {
    margin-left: 5px;
  }

  .tooltip[x-placement^="right"] .tooltip-arrow {
    border-width: 5px 5px 5px 0;
    border-left-color: transparent !important;
    border-top-color: transparent !important;
    border-bottom-color: transparent !important;
    left: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
  }

  .tooltip[x-placement^="left"] {
    margin-right: 5px;
  }

  .tooltip[x-placement^="left"] .tooltip-arrow {
    border-width: 5px 0 5px 5px;
    border-top-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    right: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
  }

  .tooltip.popover .popover-inner {
    background: #f9f9f9;
    color: black;
    padding: 24px;
    border-radius: 5px;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.65);
  }

  .tooltip.popover .popover-arrow {
    border-color: #f9f9f9;
  }

  .tooltip[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  .tooltip[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }

  /* CUSTOM STYLES - classes with prefix "e-" */
  .e-bg-light {
    background-color: #f0f0f0;
  }

  .e-container {
    width: 100%;
    max-width: 1400px;
    padding-right: 1rem;
    padding-left: 1rem;
    margin-right: auto;
    margin-left: auto;
    overflow-x: hidden;
  }

  .e-drawer {
    display: flex;
    flex-direction: column;
    width: 260px;
    min-width: 260px;
    height: calc(100% - 2rem);
    min-height: 740px; /* need to be updated when there is new item in menu */
    margin: 1rem .5rem;
  }

  .e-menu__icon {
    display: none;
  }

  .e-menu-close__icon {
    display: none;
    color: white;
    width: 45px;
    padding: 1rem;
    padding-bottom: .25rem;
  }

  .e-backoffice {
    color: white;
    font-size: 1.1rem;
    font-weight: 500;
    border-bottom: 1px solid white;
    text-align: center;
    padding: 1rem .5rem;
  }

  .e-drawer-nav {
    display: flex;
    flex-direction: column;
    padding: .7rem;
    padding-right: 0;
  }

  .e-drawer-item {
    display: block;
    color: #fffdfa;
    font-weight: 400;
    font-size: 1.1rem;
    padding: 1rem 2rem 1rem .7rem;
    padding-right: 2rem;
    border-top-left-radius: .5rem;
    border-bottom-left-radius: .5rem;
    transition: color .15s linear;
    margin-bottom: 2px;
  }

  .e-drawer-group {
    margin-bottom: 2px;
  }

  .e-drawer-group .e-drawer-item {
    margin-bottom: 0;
  }

  .e-drawer-item.premium {
    color: #e57e17;
  }

  .e-drawer-item:hover {
    color: #97bdce;
    text-decoration: none;
  }

  .e-drawer-icon {
    opacity: .5;
    padding-right: .5rem;
    width: 30px;
    text-align: center;
  }

  .e-drawer-item.router-link-active {
    background-color: #f0f0f0;
    color: #212529;
    margin-right: -0.5rem;
  }

  .e-drawer-group .e-drawer-item {
    position: relative;
  }

  .e-drawer-group .e-drawer-item:hover {
    cursor: pointer;
  }

  .e-drawer-group.e-collapse-company .e-drawer-item,
  .e-drawer-group.e-collapse-customers .e-drawer-item,
  .e-drawer-group.e-collapse-sales .e-drawer-item {
    background-color: #f0f0f0;
    color: #212529;
    margin-right: -0.5rem;
    border-bottom-left-radius: 0;
  }

  .e-drawer-group .e-drawer-item::after {
    content: "\f107";
    position: absolute;
    left: 210px;
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
  }

  .e-drawer-group .e-drawer-subitem.router-link-active {
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-thickness: 2px;
  }

  .e-drawer-group.e-collapse-company .e-drawer-item::after,
  .e-drawer-group.e-collapse-customers .e-drawer-item::after,
  .e-drawer-group.e-collapse-sales .e-drawer-item::after {
    content: "\f106";
    position: absolute;
    left: 210px;
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
  }

  .e-drawer-group .e-drawer-item + div {
    display: none;
  }

  .e-drawer-group.e-collapse-company .e-drawer-item + div,
  .e-drawer-group.e-collapse-customers .e-drawer-item + div,
  .e-drawer-group.e-collapse-sales .e-drawer-item + div {
    display: block;
    background-color: #f0f0f0;
    color: #212529;
    margin-right: -0.5rem;
    border-bottom-left-radius: .5rem;
    padding-bottom: 1rem;
  }

  .e-drawer-subitem {
    display: block;
    color: #212529;
    padding: 5px;
    width: 100%;
    margin-left: 47px;
    font-weight: 400;
  }

  .e-drawer-subitem:hover {
    color: #212529;
    cursor: pointer;
  }

  .e-drawer-item[aria-expanded="true"] .e-drawer-icon,
  .e-drawer-item.router-link-active .e-drawer-icon {
    opacity: .8;
  }

  .e-main {
    min-height: 100vh;
  }

  .e-header {
    background-color: white;
    margin: .5rem;
    margin-top: 1rem;
  }

/*   .e-banner.danger {
    background-color: #f14242;
    color: white;
  }

  .e-banner.success {
    background-color: #419c30;
  } */

  .e-banner a {
    color: currentColor;
    text-decoration: underline;
  }

  .e-banner a:hover {
    text-decoration: none;
  }

  .e-card {
    position: relative;
    background-color: white;
    margin: .5rem;
    padding: 2rem;
    min-height: 99%;
  }

  .e-inner-card {
    height: 100%;
  }

  .e-card h1 {
    margin-bottom: 1.5rem;
  }

  .e-footer {
    text-align: center;
    background-color: #f0f0f0;
    border-top-left-radius: 3rem;
    border-top-right-radius: 3rem;
    margin-top: .5rem;
/*     margin-right: .5rem;
    margin-left: .5rem; */
    padding: 2rem;
    padding-bottom: 1rem;
  }

  .e-shadow {
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  }

  .e-rounding {
    border-radius: .5rem;
  }

  .e-calculator-img {
    filter: drop-shadow(0 .5rem 1rem rgba(0,0,0,.15));
  }

  .e-login-card {
    position: relative;
    background-color: white;
    margin: .5rem;
    max-width: 450px;
    overflow: hidden;
    padding: 0;
  }

  .e-login__ls {
    max-width: 450px;
    margin-left: .5rem;
  }

  .e-card-backdrop {
    position: fixed;
    z-index: 100;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .e-modal-row {
    height: 100%;
    overflow: auto;
  }

  .e-modal-card {
    margin-top: 3rem;
    margin-bottom: 4rem;
  }

  .e-modal-close-icon {
    position: absolute;
    right: 16px;
    top: calc(50% - 16px);
    cursor: pointer;
    padding: 8px;
    transition: color .15s linear;
  }

  .e-modal-close-icon:hover {
  color: #6c757d;
  }

  .e-not-active {
    color: #7E7E7E;
  }

  .e-user__header {
    font-weight: 600;
    font-size: 1.2rem;
    text-align: center;
  }

  .e-user__header i {
    font-size: 1rem;
  }

  .e-user__header.user_admin {
    background-color: #97bdce;
  }

  .e-user__header.e-not-active {
    background-color: rgba(0, 0, 0, .03);
  }

  .e-detail-title {
    font-weight: 600;
    font-size: .9rem;
  }

  .e-table-link {
    color: #212529;
    font-weight: 600;
  }

  .e-table-simple-link {
    color: #212529;
  }

  .e-table-link:hover {
    color: #212529;
    text-decoration: underline;
    cursor: pointer;
  }

  .e-table-simple-link:hover {
    color: #212529;
    text-decoration: underline;
    cursor: pointer;
  }

  .e-survey__container {
    color: #7E7E7E;
    margin-right: 50px;
  }

  .e-link-secondary {
    color: #7E7E7E;
    text-decoration: underline;
  }

  .e-link-secondary:hover {
    color: #7E7E7E;
    text-decoration: none;
  }

  @media screen and (max-width: 992px) {
    .e-drawer {
      display: none;
      position: fixed;
      width: 100%;
      z-index: 1000;
      margin: 0;
      min-height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .e-main {
      position: absolute;
      top: 0;
      left: 0;
      overflow-x: hidden;
      max-width: 100%;
    }

    .e-drawer-nav {
      flex-grow: 0 !important;
    }

    .e-menu__icon {
      display: block;
    }

    .e-mobile-nav .e-drawer {
      display: flex !important;
    }

    .e-mobile-nav .e-menu-close__icon {
      display: inline;
    }

    .e-backoffice {
      padding-top: 0;
    }

    .e-card {
      padding: 2rem 1rem;
    }

    .e-card h1 {
      font-size: 1.5rem;
    }

    .e-rounding:not(.e-modal-card) {
      border-radius: .25rem;
    }

    .e-rounding.e-drawer {
      border-radius: 0;
    }

    .e-login-card {
      margin: .5rem auto;
    }

    .e-login__ls {
      margin-right: auto;
      margin-left: auto;
    }

    .e-logo img {
      width: 140px;
    }

    .e-survey__container {
      order: 10;
      width: 100%;
      text-align: center;
      padding-top: 15px;
    }
  }

  @media screen and (max-width: 767px) {

  }


  @media screen and (max-width: 576px) {
    .e-btn-sm-block {
      display: block;
      width: 100%;      
    }
  }

  /* CUSTOMIZE BOOTSTRAP STYLES */
  .text-secondary {
    color: #7E7E7E !important;
  }

  .text-dark {
    color: #4D535A !important;
  }

  .text-body {
    color: #212529 !important;
  }

  .text-success {
    color: #419c30 !important;
  }

  .text-warning {
    color: darkorange !important;
  }

  .text-primary {
    color: #19415b !important;
  }

  input:-internal-autofill-selected {
    background-color: transparent !important;
  }

  .bg-primary {
    background-color: #19415b !important;
  }

  .bg-warning {
    background-color: rgba(222, 210, 49, .6) !important;
  }

  .btn {
    white-space: nowrap;
  }

  .btn.btn-primary,
  .btn.btn-primary:hover,
  .btn.btn-primary:active {
    background-color: #19415b !important;
    border-color: #19415b !important;
    color: white !important;
    font-weight: 500;
  }

  .btn.btn-success,
  .btn.btn-success:hover,
  .btn.btn-success:active {
    background-color: #419c30 !important;
    border-color: #419c30 !important;
    color: white !important;
    font-weight: 500;
  }

  .btn.btn-outline-primary,
  .btn.btn-outline-primary:hover,
  .btn.btn-outline-primary:active {
    border-color: #19415b !important;
    color: #19415b !important;
    background-color: white !important;
    font-weight: 500;
  }

  .btn.btn-danger {
    background-color: #f14242;
    border-color: #f14242;
    color: white;
    font-weight: 500;
  }

  .card-header {
    border-bottom: none !important;
    border-top-left-radius: .5rem !important;
    border-top-right-radius: .5rem !important;
    /* important for close icon: */
    position: relative;
    padding-right: 50px;
    padding-left: 50px;
  }

  label {
    font-weight: 600;
  }

  .py-5 {
    padding-bottom: 2rem !important;
    padding-top: 2rem !important;
  }

  pre {
    white-space: normal;
  }

  .table-hover tbody tr:hover {
    background-color: rgba(0,0,0,.03);
  }

  .mylogo {
    margin: 10px;
  }
</style>
