<template>
    <div class="e-card e-rounding shadow-sm">
      <h1 class="h3">{{ $t('survey.question') }}</h1>

      <Loader v-if="sending" />

        <div class="row mx-md-5 my-md-5 justify-content-center" v-if="sent === false">
          <div class="col-6 col-md-3 my-3">
            <div class="e-radio__container shadow-sm e-rounding text-center" v-bind:class="{ selected_option: satisfaction ==='s1' }">
              <label  for="s1">             
                <input type="radio" id="s1" name="satisfaction" value="s1" v-model="satisfaction">
                <i class="far fa-laugh-wink fa-2x pb-3 e-icon-s1"></i>
                <p>{{ $t('survey.s1') }}</p>
              </label>
            </div>
          </div>
          <div class="col-6 col-md-3 my-3">
            <div class="e-radio__container shadow-sm e-rounding text-center" v-bind:class="{ selected_option: satisfaction ==='s2' }">
              <label  for="s2">
                <input type="radio" id="s2" name="satisfaction" value="s2" v-model="satisfaction">
                <i class="far fa-smile fa-2x pb-3 e-icon-s2"></i>
                <p>{{ $t('survey.s2') }}</p>
              </label>
            </div>
          </div>
          <div class="col-6 col-md-3 my-3">
            <div class="e-radio__container shadow-sm e-rounding text-center" v-bind:class="{ selected_option: satisfaction ==='s3' }">
              <label  for="s3"> 
                <input type="radio" id="s3" name="satisfaction" value="s3" v-model="satisfaction">                
                <i class="far fa-meh fa-2x pb-3 e-icon-s3"></i>
                <p>{{ $t('survey.s3') }}</p>
              </label>
            </div>
          </div>
          <div class="col-6 col-md-3 my-3">
            <div class="e-radio__container shadow-sm e-rounding text-center" v-bind:class="{ selected_option: satisfaction ==='s4' }">
              <label  for="s4">  
                <input type="radio" id="s4" name="satisfaction" value="s4" v-model="satisfaction">                
                <i class="far fa-frown fa-2x pb-3 e-icon-s4"></i>
                <p>{{ $t('survey.s4')}}</p>
              </label>
            </div>
          </div>
        </div>
      <div class="row justify-content-center pt-3" v-if="satisfaction!==null && sent === false">
        <div class="col-10 col-md-6">
          <span v-if="satisfaction==='s1'">{{ $t('survey.question.s1') }}</span>
          <span v-if="satisfaction==='s2'">{{ $t('survey.question.s2') }}</span>
          <span v-if="satisfaction==='s3'">{{ $t('survey.question.s3') }}</span>
          <span v-if="satisfaction==='s4'">{{ $t('survey.question.s4') }}</span>
          <br>
          <textarea class="form-control" rows="4" cols="40" v-model="comment"></textarea>
          <div class="text-right pt-3" v-if="satisfaction!==null && sent === false">
            <button @click="send()" class="btn btn-primary">
              {{ $t('survey.send') }}
            </button>
          </div>
        </div>
      </div>
      <div class="row mt-md-5 justify-content-center" v-if="satisfaction!==null && sent === true">
        <div class="col-10 col-md-6 text-center">
          <h1>{{ $t('survey.thanks') }}</h1>
          <a class="e-link-secondary" href="https://www.elementarypos.com">www.elementarypos.com</a>
          <div class="mt-5" v-if="satisfaction==='s1' && sent === true && hideG===false">
            <p>{{ $t('survey.review') }}</p>
            <div style="margin: auto;width: 50%;">
              <a href="https://play.google.com/store/apps/details?id=com.elementarypos.client"
                  class="btn btn-primary m-2">{{ $t('yes') }}</a>
              <button @click="hideG=true" class="btn btn-primary m-2">
                {{ $t('no') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import Loader from "@/components/Loader";

export default {
    name: 'Survey',
    components: Loader,

    data: function () {
        return {
            code: this.$route.query.code,
            sending: false,
            satisfaction: null,
            sent: false,
            hideG: false,
            comment: ''
        }
    },

    methods: {
        send: function() {
          const vm = this;
          vm.sending = true;
          let url;
          if(typeof vm.code !== 'undefined') {
            //deprecated without api key
            url = '/survey/insert-survey';
          } else {
            //with api key
            url = '/survey/insert-survey-ak';
          }
          this.$http.post(url,{code: vm.code, satisfaction: vm.satisfaction, comment: vm.comment})
              .then(function () {
                vm.sending = false;
                vm.sent = true;
                vm.scrollToTop();
              });
        },
        scrollToTop: function() {
        window.scrollTo(0,0);
      }
    }
  }
</script>

<style>
.e-radio__container {
  height: 100%;
}

.e-radio__container label {
  height: 100%;
  width: 100%;
  cursor: pointer;
  padding: 2rem 1rem;
}
.e-radio__container input {
    position: absolute;
    visibility: hidden;
}

.e-radio__container .far {
  color: silver;
  transition: color .15s linear;
}

.selected_option {
  background-color: khaki;
}

.e-radio__container p {
  margin-bottom: 0;
}

.e-radio__container:hover .e-icon-s1,
input[type="radio"]:checked + .e-icon-s1 {
  color: green;
}

.e-radio__container:hover .e-icon-s2,
input[type="radio"]:checked + .e-icon-s2 {
  color: yellowgreen;
}

.e-radio__container:hover .e-icon-s3,
input[type="radio"]:checked + .e-icon-s3 {
  color: dimgrey;
}

.e-radio__container:hover .e-icon-s4,
input[type="radio"]:checked + .e-icon-s4 {
  color: darkred;
}

@media screen and (max-width: 767px) {
  .e-radio__container label {
    padding: 1rem;
  }

  .far.e-icon-s1 {
    color: green;
  }

  .far.e-icon-s2 {
    color: yellowgreen;
  }

  .far.e-icon-s3 {
    color: dimgrey;
  }

  .far.e-icon-s4 {
    color: darkred;
  }
}
</style>