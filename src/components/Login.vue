<template>
    <div class="row py-5 mx-0">
        <div class="d-none d-lg-block col-lg-6 align-self-center">
            <img src="./../assets/elementaryPOS.svg" width="250" class="d-block mx-auto mylogo">
            <div style="text-align: center; margin: 10px">{{ $t('login.slogan') }}</div>
            <img v-if="$i18n.locale === 'cs'" src="./../assets/screen/cs-calculator-frame.png" width="300" height="600" class="d-block mx-auto e-calculator-img">
            <img v-else-if="$i18n.locale === 'es'" src="./../assets/screen/es-calculator-frame.png" width="300" height="600" class="d-block mx-auto e-calculator-img">
            <img v-else src="./../assets/screen/en-calculator-frame.png" width="300" height="600" class="d-block mx-auto e-calculator-img">
        </div>
        <div class="col-sm-12 col-lg-6 align-self-center">
            <div class="e-rounding shadow e-login-card" ref="boxInner">
                <div class="p-3 bg-warning text-center">
                    <h1 class="h4">{{ $t('title.login') }}<br>{{ $t('title.elementaryPos') }}  - {{ $t('title.backoffice') }}</h1>
                </div>
                <div class="py-5 px-4">
                    <form>
                        <div class="form-group mb-4">
                            <label for="username" class="prihlaseni">{{ $t('form.login.username') }}</label>
                            <input v-model="login.userName" class="form-control" id="username">
                        </div>
                        <div class="form-group mb-5">
                            <label for="password">{{ $t('form.login.password') }}</label>
                            <input type="password" v-model="login.password" class="form-control" id="password" v-on:keyup.enter="loginUser()">
                        </div>
                        <a v-show="showLostPasswordLink" href="/#/lostPassword" style="color:#FF0000;">{{ $t('login.lostPasswordDetail') }}</a>
                    </form>
                    <button @click="loginUser()" class="btn btn-primary btn-lg btn-block">
                        <i v-if="!waiting" class="fas fa-sign-in-alt pr-2"></i>
                        <i v-if="waiting" class="fas fa-spinner fa-spin mr-2"></i>
                        {{ $t('button.login') }}                           
                    </button>
                </div>
                <div class="d-flex px-3 justify-content-between flex-wrap">
                  <a href="/#/emailLogin" class="text-body px-2">{{ $t('login.emailLogin') }}</a>
                </div>
                <div class="d-flex px-3 pb-3 justify-content-between flex-wrap">
                    <a href="/#/newUser" class="text-body px-2">{{ $t('login.createNew') }}</a>
                    <a href="/#/lostPassword" class="text-body px-2">{{ $t('login.lostPassword') }}</a>
                </div>
            </div>
            <div class="mt-4 e-login__ls">
                <LocaleSwitcher />
            </div>
        </div>
    </div>
</template>

<script>
    import LocaleSwitcher from "@/components/LocaleSwitcher"
    import rightUtil from "@/util/rights"
    import ga from "@/util/ga";

    export default {
        name: 'Login',
        components: { LocaleSwitcher },

        data: function () {
            return {
                login: {
                    userName: this.suggestUserName(),
                    password: '',
                    fe: true //mark this as a FE call
                },
                waiting: false,
                logoWidth: '300',
                showLostPasswordLink: false
            }
        },

        mounted: function() {
           this.logoWidth = this.$refs.boxInner.clientWidth/2;
        },

      methods: {
            suggestUserName: function () {
                var userName = this.$route.query.userName;
                if(userName) {
                  return userName;
                }
                userName = localStorage.userName;
                if(userName) {
                  return userName;
                }
                return "";
            },

            loginUser: function () {
                const vm = this;
                const sendCred = this.login;
                vm.waiting = true;
                this.$http.post('/auth/login-with-password',sendCred)
                    .then(function (response) {
                        if(response.status === 200) {
                            localStorage.role = response.data.role;
                            rightUtil.rightsToLocalStorage(response.data.rights);

                            ga.sendOfficeLogin();

                            if(rightUtil.getDefaultPage() !== null) {
                              localStorage.apiKey = response.data.apiKey;
                              localStorage.userId = response.data.userId;

                              vm.$root.$emit('login');
                            } else {
                              vm.$modal.cs_alert(vm.$t('error.userNotAdmin'));
                            }
                        }
                        vm.waiting = false;
                    },function () {
                        vm.waiting = false;
                        vm.showLostPasswordLink = true;
                    });
            }
        }
    }
</script>

