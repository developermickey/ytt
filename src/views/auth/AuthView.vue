<template>
  <app-container class="l-auth">
    <nav-header></nav-header>
    <app-main class="u-flex is-flex-column is-align-center">
      <div class="l-auth__nav u-flex is-justify-center is-align-center">
<!--        <router-link class="l-auth__nav-item"-->
<!--          :class="{ 'is-active' : !loginActive}"-->
<!--          :to="{ name: 'auth-register' }"-->
<!--        >-->
<!--          Sign up-->
<!--        </router-link>-->
<!--        <div class="l-auth__nav-divider"></div>-->
        <h3 class="l-auth__nav-item">
          {{ this.title }}
        </h3>
      </div>
      <transition name="fade" mode="out-in">
        <router-view class="l-auth__view-content"/>
      </transition>
    </app-main>
  </app-container>
</template>

<script>
import NavHeader from '@/components/common/App/NavHeader.vue';
import AppContainer from '@/components/common/App/AppContainer.vue';
import AppMain from '@/components/common/App/AppMain.vue';

const routeTitlesMap = {
  'auth-login': 'Log in',
  'auth-reset-password': 'Reset Password',
  'auth-invite': 'Create your account',
  'auth-register': 'Register your account',
};

export default {
  components: {
    NavHeader,
    AppContainer,
    AppMain,
  },
  computed: {
    loginActive(){
      return this.$route.name === 'auth-login';
    },
    title(){
      return routeTitlesMap[this.$route.name];
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars';
@import '@/styles/mixins';

.l-auth{
  background: url('~@/assets/auth-bg.jpg') no-repeat center;
  background-size: cover;
  &__nav{
    font-size: 64px;
    margin-top: 60px;
    margin-bottom: 25px;
  }
  &__nav-divider{
    background-color: #fff;
    height: 110px;
    width: 1px;
    margin: 0 45px;
  }
  &__nav-item{
    color: #fff;
    text-decoration: none;
    margin: 0;
    text-align: center;
    font-weight: bold;
  }
  &__view-content{
    margin-bottom: 100px;
  }
}

@include media(">phone", "<=tablet") {
  .l-auth{

    &__nav{
      font-weight: normal;
      font-size: 28px;
      line-height: 42px;
      margin-top: 90px;
      margin-bottom: 0;
    }
  }
}
</style>
