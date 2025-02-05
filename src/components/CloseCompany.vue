<template>
  <div class="e-card e-rounding shadow-sm">
    <h1 class="h3" style="color: red">{{ $t('closeAccount.title') }}</h1>

    {{ $t('closeAccount.info') }}
    <p></p>
    <div class="custom-control custom-switch">
    <input type="checkbox" v-model="confirm1" class="custom-control-input" id="confirm1">
    <label class="custom-control-label" for="confirm1">{{ $t('closeAccount.confirm1')}}</label>
    </div>
    <br>
    <div class="custom-control custom-switch">
    <input type="checkbox" v-model="confirm2" class="custom-control-input" id="confirm2">
    <label class="custom-control-label" for="confirm2">{{ $t('closeAccount.confirm2')}}</label>
    </div>
    <br>
    <div class="custom-control custom-switch">
    <input type="checkbox" v-model="confirm3" class="custom-control-input" id="confirm3">
    <label class="custom-control-label" for="confirm3">{{ $t('closeAccount.confirm3')}}</label>
    </div>
    <p></p>
    <label for="password">{{ $t('closeAccount.password')}}</label>
    <input type="password" v-model="password" class="form-control" id="password">
    <p></p>
    <button @click="closeCompany()" v-show="confirm1&&confirm2&&confirm3" class="btn btn-danger"><i class="fa-solid fa-trash"></i> {{ $t('closeAccount.button')}}
    </button>


  </div>
</template>

<script>
export default {
  name: 'CloseCompany',

  data: function () {
    return {
      confirm1: false,
      confirm2: false,
      confirm3: false,
      confirm: '',
      password: ''
    };
  },

  methods: {
    closeCompany: function () {
      const vm = this;
        this.$http.post('/company/company-close', {password: vm.password})
            .then(function () {
              vm.$modal.cs_alert(vm.$t('closeAccount.success'));
            });
    }
  }
}
</script>
