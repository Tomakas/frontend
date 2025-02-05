<template>
    <div class="e-card e-rounding shadow-sm">
      <PremiumBanner/>
      <h1 class="h3">{{ $t('title.userManagementInfo') }}</h1>

      <Loader v-if="loading" />        
      
        <div class="d-flex mb-2 justify-content-md-end justify-content-center" v-if="!loading">
          <button @click="prepareAddUser()" class="btn btn-primary m-2">
            <i class="fas fa-plus pr-1"></i> {{ $t('button.addUser') }}
          </button>
        </div>

        <div v-if="!loading" class="row">
          <div class="col-12 col-lg-6 mt-2 mb-2" v-for="user in users" v-bind:key="user.userId">
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

                <div v-if="user.emailNotConfirmed!==null" class="e-detail-title">{{ $t('form.user.emailNotConfirmed') }} <i v-tooltip="$t('tooltip.emailNotConfirmed')" style="color: darkorange" class="fa-solid fa-triangle-exclamation"></i></div>
                <div v-if="user.emailNotConfirmed!==null" class="pb-3">{{user.emailNotConfirmed}}</div>

                <div class="d-flex justify-content-end">
                  <button @click="prepareEditUser(user.userId)" class="btn btn-outline-primary">
                    <!-- <i class="fas fa-user-edit pr-1"></i> -->
                    {{ $t('button.editUser') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>

      <div class="e-card-backdrop" v-if="!loading && showUser">
        <div class="row e-modal-row justify-content-center align-items-start">
          <div class="e-modal-card col-10 col-lg-6 bg-white shadow-sm e-rounding p-0">
            <div class="card-header e-user__header" v-bind:class="{ 'e-not-active': user.role==='none',user_admin: user.role ==='admin' }">
              <span v-if="user.userId !== null">{{ $t('button.editUser') }}</span>
              <span v-if="user.userId === null">{{ $t('button.addUser') }}</span>
              <i @click="showUser = false" class="fas fa-times e-modal-close-icon"></i>
            </div>
            <div class="card-body py-5 px-4">
              <form>
                <div class="form-group mb-4">
                  <label for="userName">{{ $t('form.user.userName') }}</label> <i v-show="user.userId === null" v-tooltip="$t('tooltip.user.username')" class="far fa-question-circle"></i>
                  <input v-model="user.userName" class="form-control" id="userName" :disabled="user.userId !== null">
                </div>
                <div class="form-group mb-4">
                  <label for="email">{{ $t('form.user.email') }}</label> <i v-show="user.userId === null" v-tooltip="$t('tooltip.user.email')" class="far fa-question-circle"></i>
                  <input v-model="user.email" class="form-control" id="email">
                </div>
                <div class="form-group mb-4">
                  <label for="role">{{ $t('form.user.role') }}</label> <i v-tooltip="$t('tooltip.user.role')" class="far fa-question-circle"></i>
                  <select v-model="user.role" class="form-control" id="role" @change="readRoleRights(user.role)">
                    <option v-for="r in user.userId === null?rolesCreate:roles" v-bind:value="r"
                            v-bind:key="r">
                      {{ getRoleName(r) }}
                    </option>
                  </select>
                </div>


                <div v-if="user.role === 'custom'" >
                  <div style="margin: 10px; color: #04084c">{{ $t('rights.customInfoApp')}}</div>
                  <div class="d-flex flex-wrap-reverse ">
                  <div class="col-12 col-lg-6 mt-2 mb-2">
                    <div class="e-inner-card shadow-sm e-rounding">
                      <div class="card-header e-user__header">
                        <span>
                    {{ $t('rights.cashRegister') }}
                  </span>
                      </div>
                      <div class="card-body py-5 px-4">
                        <RightSetting :right-id="rc.shiftSales" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <RightSetting :right-id="rc.allSales" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <p></p>
                        <RightSetting :edit="true" :right-id="rc.deleteReceipt" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <RightSetting :edit="true" :right-id="rc.createNegativeReceipt" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <RightSetting :edit="true" :right-id="rc.updateBill" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <RightSetting :edit="true" :right-id="rc.addDiscount" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <RightSetting :edit="true" :right-id="rc.orders" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <RightSetting :edit="true" :right-id="rc.stock" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <RightSetting :edit="true" :right-id="rc.createCustomer" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <RightSetting :edit="true" :right-id="rc.updateCustomer" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <p></p>
                        <RightSetting :edit="true" :right-id="rc.cashRegisterSettings" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <RightSetting :edit="true" :right-id="rc.salesItem" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <RightSetting :edit="true" :right-id="rc.companySettings" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                      </div>
                    </div>
                  </div>
                  <div class="mb-4"></div>
                  <div class="col-12 col-lg-6 mt-2 mb-2">
                    <div class="e-inner-card shadow-sm e-rounding">
                      <div class="card-header e-user__header">
                        <span>
                     {{ $t('rights.office') }}
                  </span>
                      </div>
                      <div class="card-body py-5 px-4">
                        <RightSetting :right-id="rc.allReceipts" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <RightSetting :right-id="rc.allSales" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <RightSetting :right-id="rc.exportSales" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <p></p>
                        <RightSetting :edit="true" :right-id="rc.orders" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <RightSetting :edit="true" :right-id="rc.stock" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <RightSetting :edit="true" :right-id="rc.salesItem" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>
                        <RightSetting :edit="true" :right-id="rc.companySettings" :right-model="user.rights" @changeRight="rightChanged($event)"></RightSetting>

                      </div>
                    </div>
                  </div>
                  </div>
                </div>

                <div v-if="user.role !== 'custom' && user.role !=='none'" class="form-group mb-4">
                  <div v-if="!showRightDetails"><a href="#" @click="showRightDetails=true">{{ $t('rights.showDetail') }}</a></div>
                  <div v-if="showRightDetails">
                    <div v-if="showRightDetails"><a href="#" @click="showRightDetails=false">{{ $t('rights.hideDetail') }}</a></div>

                    <div class="d-flex flex-wrap-reverse ">
                      <div class="col-12 col-lg-6 mt-2 mb-2">
                        <div class="e-inner-card shadow-sm e-rounding">
                          <div class="card-header e-user__header">
                        <span>
                    {{ $t('rights.cashRegister') }}
                  </span>
                          </div>
                          <div class="card-body py-5 px-4">
                            <RightSetting :right-id="rc.shiftSales" :right-model="roleRights" disabled="true"></RightSetting>
                            <RightSetting :right-id="rc.allSales" :right-model="roleRights" disabled="true"></RightSetting>
                            <p></p>
                            <RightSetting :edit="true" :right-id="rc.deleteReceipt" :right-model="roleRights" disabled="true"></RightSetting>
                            <RightSetting :edit="true" :right-id="rc.createNegativeReceipt" :right-model="roleRights" disabled="true"></RightSetting>
                            <RightSetting :edit="true" :right-id="rc.updateBill" :right-model="roleRights" disabled="true"></RightSetting>
                            <RightSetting :edit="true" :right-id="rc.addDiscount" :right-model="roleRights" disabled="true"></RightSetting>
                            <RightSetting :edit="true" :right-id="rc.orders" :right-model="roleRights" disabled="true"></RightSetting>
                            <RightSetting :edit="true" :right-id="rc.createCustomer" :right-model="roleRights" disabled="true"></RightSetting>
                            <RightSetting :edit="true" :right-id="rc.updateCustomer" :right-model="roleRights" disabled="true"></RightSetting>
                            <p></p>
                            <RightSetting :edit="true" :right-id="rc.cashRegisterSettings" :right-model="roleRights" disabled="true"></RightSetting>
                            <RightSetting :edit="true" :right-id="rc.salesItem" :right-model="roleRights" disabled="true"></RightSetting>
                            <RightSetting :edit="true" :right-id="rc.companySettings" :right-model="roleRights" disabled="true"></RightSetting>
                          </div>
                        </div>
                      </div>
                      <div class="mb-4"></div>
                      <div class="col-12 col-lg-6 mt-2 mb-2">
                        <div class="e-inner-card shadow-sm e-rounding">
                          <div class="card-header e-user__header">
                        <span>
                     {{ $t('rights.office') }}
                  </span>
                          </div>
                          <div class="card-body py-5 px-4">
                            <RightSetting :right-id="rc.allReceipts" :right-model="roleRights" disabled="true"></RightSetting>
                            <RightSetting :right-id="rc.allSales" :right-model="roleRights" disabled="true"></RightSetting>
                            <RightSetting :right-id="rc.exportSales" :right-model="roleRights" disabled="true"></RightSetting>
                            <p></p>
                            <RightSetting :edit="true" :right-id="rc.orders" :right-model="roleRights" disabled="true"></RightSetting>
                            <RightSetting :edit="true" :right-id="rc.stock" :right-model="roleRights" disabled="true"></RightSetting>
                            <RightSetting :edit="true" :right-id="rc.salesItem" :right-model="roleRights" disabled="true"></RightSetting>
                            <RightSetting :edit="true" :right-id="rc.companySettings" :right-model="roleRights" disabled="true"></RightSetting>

                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </form>
              <div class="d-flex flex-wrap-reverse justify-content-between pt-3">
                <div>
                  <button v-if="user.userId !== null" @click="removeUser(user.userId)" class="btn btn-danger mr-4">
                    {{ $t('button.deleteUser')}}
                  </button>
                </div>

                <div class="e-btn-mobile-container">
                <button @click="showUser = false" class="btn btn-outline-secondary mr-3">
                  {{ $t('button.back')}}
                </button>
                <button v-if="user.userId === null" @click="createUser()" class="btn btn-primary">
                  {{ $t('button.createUser')}}
                </button>
                <button v-else @click="editUser()" class="btn btn-primary">
                  {{ $t('button.save') }}
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import Loader from "@/components/Loader"
    import PremiumBanner from "@/components/PremiumBanner";
    import RightSetting from "@/components/util/RightSetting.vue";
    import rightUtil from "@/util/rights";

    export default {
        name: 'Users',
        components: { Loader, PremiumBanner,RightSetting },

        data: function () {
            return {
                users: [],
                user: {
                  userId: null,
                  userName: '',
                  email: '',
                  role: 'user',
                  rights: []
                },
                roles: ['none','temp','user','accountant','custom','admin'],
                rolesCreate: ['temp','user','accountant','custom','admin'],
                loading: true,
                showUser: false,
                rc: rightUtil.codes,
                roleRights: [],
                showRightDetails: false
            }
        },

        mounted: function () {
            this.refresh();
        },

        methods: {
            refresh: function() {
                const vm = this;
                vm.loading = true;
                this.$http.post('/user/get-user-list')
                    .then(function (response) {
                        vm.loading = false;
                        vm.users = response.data.users;
                    });
            },
            getRoleName: function(role) {
                return this.$t('role.'+role);
            },
          prepareAddUser: function () {
            this.clearUser();
            this.showUser = true;
          },
          prepareEditUser: function (userId) {
            const vm = this;
            vm.loading = true;
            this.$http.post('/user/get-user',{userId:userId})
                .then(function (response) {
                  vm.loading = false;
                  vm.user = response.data;
                  vm.showUser = true;

                  vm.readRoleRights(vm.user.role);
                });
          },
          editUser: function () {
            const vm = this;
            this.$http.post('/user/update-user',{
              userId: vm.user.userId,
              userName: vm.user.userName,
              email: vm.user.email,
              role: vm.user.role,
              rights: vm.user.rights
            })
                .then(function (response) {
                  vm.showUser = false;
                  vm.refresh();
                  if(response.data.confirmEmailSent === true) {
                    vm.$modal.cs_alert(vm.$t('message.confirmationEmail'));
                  }
                });
          },
          clearUser : function() {
              this.user = {
                  userId: null,
                  userName: '',
                  email: '',
                  role: 'user',
                  rights: []
              }
              this.readRoleRights(this.user.role);
              this.showRightDetails = false;
          },
          createUser: function() {
            const vm = this;
            this.$http.post('/user/add-new-user',{
              userName: vm.user.userName,
              email: vm.user.email,
              role: vm.user.role,
              rights: vm.user.rights
            })
                .then(function () {
                  vm.refresh();
                  vm.showUser = false;
                  vm.$modal.cs_alert(vm.$t('dialog.createUser') + ' ' + vm.user.email);
                });
          },
          isActualUser: function(userId) {
              return localStorage.userId === userId;
          },
          rightChanged: function (data) {
              const index = this.user.rights.indexOf(data.rightId);
              if(index!==-1) {
                this.user.rights.splice(index,1);
              }
              if(data.present === true) {
                this.user.rights.push(data.rightId);
              }
          },
          readRoleRights: function(role) {
            const vm = this;
            this.$http.post('/user/get-role-rights',{
              role: role,
            })
                .then(function (response) {
                  vm.roleRights = response.data.roleRights;
                });
          },
          removeUser: function (userId) {
            if( confirm(this.$t('confirm.deleteUser'))) {
              const vm = this;
              vm.loading = true;
              this.$http.post('/user/delete-user', {userId: userId})
                  .then(function () {
                    vm.loading = false;
                    vm.showUser = false;
                    vm.refresh();
                  },function() {
                    vm.loading = false;
                    vm.showUser = false;
                  });
            }
          }
        }
    }

</script>