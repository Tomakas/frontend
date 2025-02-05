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
                  <h1 class="h4">{{ $t('title.newUser') }}</h1>                  
              </div>
              <div class="py-5 px-4">
                <p class="h5">{{ $t('title.downloadAPP') }}</p>
                <a class="d-block text-center" href='https://play.google.com/store/apps/details?id=com.elementarypos.client&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
                  <img height="100" alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/>
                </a>
                <u class="d-block pt-4">
                  <a class="text-body" :href="$t('downloadAppLink')">{{ $t('downloadApp')}}</a>
                </u>
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
        name: 'NewUser',
        components: { LocaleSwitcher },
    }
</script>

