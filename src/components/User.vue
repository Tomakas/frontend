<template>
    <div class="e-card e-rounding shadow-sm">
      <Loader v-if="loading" />

      <div v-if="!loading && type==='show'" class="row">
        <div class="col-12 col-lg-6 mt-2 mb-2">
          <div class="e-inner-card shadow-sm e-rounding">
            <div class="card-header e-user__header" v-bind:class="{'e-not-active': user.role==='none',user_admin: user.role ==='admin'}">
              <i class="fas fa-user-cog pr-1" aria-hidden="true" v-if="user.role === 'admin'"></i>
              <i class="fas fa-user pr-1" aria-hidden="true" v-if="user.role !== 'admin'"></i>
              <span>
                    {{user.userName}}
                  </span>
            </div>
            <div class="card-body py-5 px-4" v-bind:class="{ 'e-not-active': user.role==='none' }">
              <div class="e-detail-title">{{ $t('form.user.userName') }}</div>
              <div class="pb-3">{{user.userName}}</div>

              <div class="e-detail-title">{{ $t('form.user.role') }}</div>
              <div class="pb-3">{{getRoleName(user.role)}}</div>

              <div v-if="user.emailConfirmed!==null" class="e-detail-title">{{ $t('form.user.email') }}</div>
              <div v-if="user.emailConfirmed!==null" class="pb-3">{{user.emailConfirmed}}</div>

              <div v-if="user.emailNotConfirmed!==null" class="e-detail-title"><i v-tooltip="$t('tooltip.emailNotConfirmed')" style="color: darkorange" class="fa-solid fa-triangle-exclamation"></i> {{ $t('form.user.emailNotConfirmed') }}</div>
              <div v-if="user.emailNotConfirmed!==null" class="pb-3">{{user.emailNotConfirmed}}</div>

              <div class="d-flex flex-wrap-reverse justify-content-end">
                <button @click="prepareChangePassword()" class="btn btn-outline-primary mb-2">
                  {{ $t('button.changePassword') }}
                </button>
                <button @click="type='email'" class="btn btn-outline-primary ml-4 mb-2">
                  {{ $t('button.changeEmail') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-lg-6 align-self-center">
        <div class="e-rounding shadow e-login-card" ref="boxInner" v-if="type==='email'">
          <div class="py-5 px-4">
            <form>
              <div class="form-group mb-4">
                <label for="email">{{ $t('form.user.email') }}</label>
                <input v-model="user.email" class="form-control" id="email">
              </div>
            </form>
            <div class="d-flex justify-content-end">
              <button @click="type='show'" class="btn btn-outline-secondary mr-4">
                {{ $t('button.back')}}
              </button>
              <button @click="updateEmail()" class="btn btn-primary">
                {{ $t('button.save') }}
              </button>
            </div>
          </div>
        </div>

        <div class="e-rounding shadow e-login-card" ref="boxInner" v-if="type==='password'">
          <div class="py-5 px-4">
            <form>
              <div class="form-group mb-5">
                <label for="password">{{ $t('form.user.currentPassword') }}</label>
                <input type="password" v-model="password" class="form-control" id="password">
              </div>
              <div class="form-group mb-5">
                <label for="newPassword">{{ $t('form.user.newPassword') }}</label>
                <input type="password" v-model="newPassword" class="form-control" id="newPassword">
              </div>
              <div class="form-group mb-5">
                <label for="newPassword2">{{ $t('form.user.newPasswordAgain') }}</label>
                <input type="password" v-model="newPassword2" class="form-control" id="newPassword2">
              </div>
            </form>
            <div class="d-flex justify-content-end">
              <button @click="type='show'" class="btn btn-outline-secondary mr-4">
                {{ $t('button.back')}}
              </button>
              <button @click="updatePassword()" class="btn btn-primary">
                {{ $t('button.save') }}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
</template>

<script>
import Loader from "@/components/Loader.vue";

export default {
  name: 'User',
  components: {Loader},

  data: function () {
    return {
      user: {
        userName: '',
        email: '',
        role: '',
        emailNotConfirmed: null,
        emailConfirmed: null
      },
      password: '',
      newPassword: '',
      newPassword2: '',
      loading: false,
      type: 'show'
    }
  },

  mounted: function () {
    this.refresh();
  },

  methods: {
    refresh: function () {
      const vm = this;
      vm.loading = true;
      this.$http.post('/user/get-user', {})
          .then(function (response) {
            vm.loading = false;
            vm.user = response.data;
          });
    },
    getRoleName: function (role) {
      return this.$t('role.' + role);
    },
    prepareChangePassword: function() {
      this.type = 'password';
      this.password = '';
      this.newPassword = '';
      this.newPassword2 = '';
    },
    updateEmail: function () {
      const vm = this;
      this.$http.post('/user/change-email', {email: vm.user.email})
          .then(function (response) {
            vm.loading = false;
            vm.type = 'show';
            vm.refresh();
            if(response.data.confirmEmailSent === true) {
              vm.$modal.cs_alert(vm.$t('message.confirmationEmail'));
            }
          });
    },
    updatePassword: function () {
      const vm = this;
      if (vm.newPassword !== vm.newPassword2) {
        vm.$modal.cs_alert(vm.$t('message.passwordsDoNotMatch'));
      } else {
        this.$http.post('/user/change-password', {
          oldPassword: vm.password,
          newPassword: vm.newPassword2
        })
            .then(function () {
              vm.loading = false;
              vm.type = 'show';
            });
      }
    }
  }
}

</script>