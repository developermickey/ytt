<template>
  <app-container>
    <nav-header></nav-header>
    <nav-sidebar></nav-sidebar>
    <app-main class="admin-main">
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </app-main>
  </app-container>
</template>

<script>
import NavHeader from '@/components/common/App/NavHeader.vue';
import AppContainer from '@/components/common/App/AppContainer.vue';
import NavSidebar from '@/components/common/App/NavSidebar.vue';
import AppMain from '@/components/common/App/AppMain.vue';

export default {
  components: {
    NavHeader,
    NavSidebar,
    AppContainer,
    AppMain,
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins';
.admin-main{
  background: rgba(#f9f9f9, .5);
}
</style>
