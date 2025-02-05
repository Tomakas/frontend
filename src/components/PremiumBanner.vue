<template>
  <div>
   <div v-for="bi in bannerInfo" :key="bi.text">
     <div v-if="bi.warning" class="e-banner warning e-rounding m-2 shadow-sm d-flex align-items-center">
     <i class="fas fa-info-circle pr-3"></i>
     <p class="mb-0">
       {{ bi.text }} <br><a href="/#/premium">{{ $t('premium.info.link.title') }}</a>
     </p>
     </div>
     <div v-if="!bi.warning" class="e-banner error e-rounding m-2 shadow-sm d-flex align-items-center">
       <i class="fa-solid fa-triangle-exclamation pr-3"></i>
       <p class="mb-0">
         {{ bi.text }} <br><a href="/#/premium">{{ $t('premium.info.link.title') }}</a>
       </p>
     </div>
   </div>
    <div style="height: 2rem"/>
  </div>
</template>

<script>
    export default {
      data: function () {
        return {
          bannerInfo:[]
        }
      },
      mounted() {
        this.refreshData();
      },
      methods: {
        refreshData: function () {
          const vm = this;
          this.$http.post('/company/get-banner-info', {})
              .then(function (response) {
                if(response.status === 200) {
                  vm.bannerInfo = response.data.bannerInfo;
                }
              });
        }
      }
    }
</script>

<style>
.e-banner {
  padding: .7rem 1rem;
}

.e-banner.warning {
  background-color: #e57e17;
}
.e-banner.error {
  background-color: #ff4545;
}
</style>
