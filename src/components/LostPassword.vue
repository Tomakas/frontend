<template>
    <div class="row py-5 mx-0">
        <div class="d-none d-lg-block col-lg-6 align-self-center">
            <img src="./../assets/elementaryPOS.svg" width="250" class="d-block mx-auto mylogo">
          <img v-if="$i18n.locale === 'cs'" src="./../assets/screen/cs-calculator-frame.png" width="300" height="600" class="d-block mx-auto e-calculator-img">
          <img v-else-if="$i18n.locale === 'es'" src="./../assets/screen/es-calculator-frame.png" width="300" height="600" class="d-block mx-auto e-calculator-img">
          <img v-else src="./../assets/screen/en-calculator-frame.png" width="300" height="600" class="d-block mx-auto e-calculator-img">
        </div>
        <div class="col-sm-12 col-lg-6 align-self-center">
            <div class="e-rounding shadow e-login-card">
                <div class="p-3 bg-warning text-center">
                    <h1 class="h4">{{ $t('title.lostPassword') }}</h1>
                </div>
                <div class="py-5 px-4">
                    <form>
                        <div class="form-group  mb-5">
                            <label for="email" class="prihlaseni">{{ $t('form.lostPassword.email') }}</label>
                            <input v-model="email" class="form-control" id="email">
                        </div>
                    </form>
                    <button @click="send()" class="btn btn-primary btn-lg btn-block">
                        <i v-if="!waiting" class="far fa-envelope pr-2"></i>
                        <i v-if="waiting" class="fas fa-spinner fa-spin mr-2"></i>
                        {{ $t('button.lostPassword') }}                           
                    </button>
                </div>
                <div class="d-flex p-4 justify-content-between">
                    <a href="/#/login" class="text-body"><i class="fas fa-sign-in-alt pr-2"></i>{{ $t('button.login') }}</a>
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

    export default {
        name: 'LostPassword',
        components: { LocaleSwitcher },

        data: function () {
            return {
                email: '',
                waiting: false
            }
        },

        methods: {
          send: function () {
                const vm = this;
                vm.waiting = true;
                this.$http.post('/user/lost-password', {email : vm.email})
                    .then(function (response) {
                        if(response.status === 200) {
                          vm.$modal.cs_alert(vm.$t('lostPassword.info'));
                          vm.$router.push('/login');
                        }
                        vm.waiting = false;
                    },function () {
                        vm.waiting = false;
                    });
            }
        }
    }
</script>

