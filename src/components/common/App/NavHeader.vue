<template>
  <div class="c-nav-header u-flex is-align-center" ref="navHeader">
    <div class="c-nav-header--sidebar-button">
      <img
          v-if="!$route.path.includes('/auth')"
          @click="setSidebar(!getSidebarStatus)"
          :src="getSidebarStatus ? require('@/assets/svg/sidebarClose.svg') :
          require('@/assets/svg/sidebarButton.svg')"
          :key="getSidebarStatus"
          alt=""
      >
    </div>
    <div class="c-nav-header__logo">
      <img src="@/assets/logo.svg" alt="">
    </div>
    <div class="c-nav-header__nav-outer u-flex">
      <div class="c-nav-header__nav-wrap nav--wrap-desktop u-flex is-align-center">
        <div class="c-nav-header__menu d-flex">
          <!--          <router-link class="c-nav-header__menu__item"-->
          <!--            v-for="item in navItems"-->
          <!--            :key="item.id"-->
          <!--            :to="item.to"-->
          <!--          >-->
          <UBtn
              v-for="item in navItems"
              :key="item.id"
              :href="item.href"
              class="c-nav-header__menu__item"
              tag="a"
          >
            {{ item.text }}
          </UBtn>
          <!--            <span class="u-font-weight-light">{{item.text}}</span>-->
          <!--          </router-link>-->
        </div>
        <div class="c-nav-header__append u-ml-auto">
          <div class="u-flex is-align-center is-justify-center">
            <UBtn
                color="primary"
                size="medium"
                href="https://yourtorahtutors.com"
                tag="a"
            >
              Back to site
            </UBtn>
            <span class="random-letters u-ml-6">B”H</span>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex';

export default {
  components: {},
  data: () => ({
    navItems: [
      {
        id: 1,
        text: 'Contacts',
        href: 'https://yourtorahtutors.com/contact-us/'
      },
      {
        id: 2,
        text: 'About us',
        href: 'https://yourtorahtutors.com/about-us/'
      },
    ]
  }),
  methods: {
    ...mapMutations({
      setAppTop: 'Application/setTop',
      setSidebar: 'Application/setSidebarStatus'
    }),
  },
  computed: {
    ...mapGetters('Application', ['getSidebarStatus'])
  },
  mounted() {
    this.setAppTop(this.$refs.navHeader.offsetHeight);
  },
  beforeDestroy() {
    this.setAppTop(0);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins";

.c-nav-header {
  position: fixed;
  contain: layout;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  flex: 1 1 auto;
  max-width: 100%;

  height: 110px;
  background-color: #fff;
  display: flex;
  box-shadow: 0px 12px 66px rgba(0, 0, 0, 0.15);

  &__logo {
    padding-left: 80px;
    width: 390px;
  }

  &__menu {
    &__item {
      color: #2C2C2C;
      text-decoration: none;
      margin-right: 48px;
      background: transparent !important;
      padding: 0;
    }
  }

  &__nav-outer {
    flex-grow: 1;
  }

  &__nav-wrap {
    flex: 0 0 91.666666%;
    max-width: 91.666666%;
  }

  &--sidebar-button {
    display: none;
  }
}

.random-letters {
  color: #A3A3A3;
  font-size: 17px;
  white-space: nowrap;
  word-break: keep-all;
}

@include media(">phone", "<=tablet") {
  .c-nav-header {
    height: 58px;
    padding: 7px 0;
    top: -1px;
    left: -1px;
    right: -1px;

    &__logo {
      padding-left: 0;
      width: 100%;
      display: flex;

      img {
        margin-left: 50%;
        width: 45px;
        height: 45px;
      }
    }

    &--sidebar-button {
      display: block;
      position: absolute;
      left: 16px;
    }

    &__nav-outer {
      .c-nav-header__menu.d-flex {
        display: none;

      }
      .c-nav-header__append .u-btn.u-btn_size_medium.u-btn_color_primary{
        display: none;
      }
      .random-hebrew.u-ml-6{
        margin-right: 10px;
        margin-left: 0!important;
      }
    }
  }
}
</style>
