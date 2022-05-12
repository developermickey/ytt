<template>
  <div
    class="c-nav-sidebar u-flex is-flex-column"
    :class="{ 'c-nav-sidebar-hidden': !getSidebarStatus }"
    ref="sidebar"
  >
    <div
      class="c-nav-sidebar__user u-flex is-align-center is-flex-column is-justify-center u-mt-13"
    >
      <div class="c-nav-sidebar__user__avatar u-mb-2">
        <img :src="user.avatar" alt="" />
      </div>
      <div class="c-nav-sidebar__user__name u-font-weight-light">
        {{ user.name }}
      </div>

      <div class="c-nav-sidebar__user-coins" v-if="showCoins">
        <div class="c-nav-sidebar__user-coins-label">My coins</div>
        <div class="c-nav-sidebar__user-coins-count">{{ user.balance }}</div>
        <img
          class="c-nav-sidebar__user-coins-icon"
          src="@/assets/svg/coin.svg"
        />
      </div>
    </div>

    <div class="c-nav-sidebar__nav-list">
      <router-link
        v-for="item in navItems[user.role_id]"
        :key="item.id"
        class="c-nav-sidebar__nav-item u-flex is-align-center"
        active-class="is-active"
        :to="item.to"
      >
        <div v-if="item.pngIcon">
          <img
            height="32px"
            width="32px"
            class="u-mr-4"
            :src="require(`@/assets/svg/${item.icon}.svg`)"
            alt=""
          />
        </div>
        <div v-else>
          <svg
            v-svg
            :symbol="item.icon"
            size="0 0 32 32"
            role="presentation"
            class="u-mr-5"
          ></svg>
        </div>

        {{ item.text }}
      </router-link>
    </div>
    <div class="c-nav-sidebar__info-list">
      <UBtn
        v-for="item in infoItems"
        :key="item.id"
        :href="item.href"
        class="c-nav-sidebar__info-item"
        tag="a"
      >
        {{ item.text }}
      </UBtn>
    </div>

    <div class="c-nav-sidebar__logout" @click="logout">
      <svg v-svg symbol="icon-logout" class="u-mr-3" size="0 0 14 21"></svg>
      Log out
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { ADMIN, TEACHER, STUDENT } from "@/constants/roles";

export default {
  data: () => ({
    navItems: {
      [ADMIN]: [
        {
          id: 1,
          text: "Lessons",
          to: { name: "admin-lessons-all" },
          icon: "icon-file",
          active: true,
        },
        {
          id: 2,
          text: "Users",
          to: { name: "admin-users-all" },
          icon: "icon-user-group",
          active: false,
        },
        {
          id: 3,
          text: "Settings",
          to: { name: "admin-settings" },
          icon: "icon-settings",
          active: false,
        },
        {
          id: 4,
          text: "Store",
          to: { name: "product-list" },
          icon: "icon-store",
          active: false,
        },
        {
          id: 5,
          text: "Orders",
          to: { name: "order-list" },
          icon: "list-active",
          active: false,
          pngIcon: true,
        },
      ],
      [TEACHER]: [
        {
          id: 1,
          text: "Lessons",
          to: { name: "teacher-lessons-all" },
          icon: "icon-file",
          active: true,
        },
        {
          id: 2,
          text: "Students",
          to: { name: "teacher-students-all" },
          icon: "icon-user-group",
          active: false,
        },
        {
          id: 3,
          text: "Settings",
          to: { name: "teacher-settings" },
          icon: "icon-settings",
          active: false,
        },
      ],
      [STUDENT]: [
        {
          id: 1,
          text: "Lessons",
          to: { name: "student-lessons-all" },
          icon: "icon-file",
          active: true,
        },
        {
          id: 2,
          text: "Store",
          to: { name: "student-store" },
          icon: "icon-store",
          active: false,
        },
        // {
        //   id: 2,
        //   text: 'Settings',
        //   to: {name: 'student-settings'},
        //   icon: 'icon-settings',
        //   active: false,
        // },
      ],
    },
    infoItems: [
      {
        id: 1,
        text: "Contacts",
        href: "https://yourtorahtutors.com/contact-us/",
      },
      {
        id: 2,
        text: "About us",
        href: "https://yourtorahtutors.com/about-us/",
      },
    ],
  }),
  computed: {
    ...mapGetters("Auth", ["user"]),
    ...mapGetters("Application", ["getSidebarStatus"]),
    showCoins() {
      return this.user.role_id === STUDENT;
    },
  },
  methods: {
    ...mapActions("Auth", ["logout"]),
    ...mapMutations("Application", {
      setAppLeft: "setLeft",
    }),
  },
  mounted() {
    // this.$store.commit('Application/setLeft', this.$refs.sidebar.offsetWidth);
    this.setAppLeft(this.$refs.sidebar.offsetWidth);
  },
  beforeDestroy() {
    this.setAppLeft(0);
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars";
@import "@/styles/mixins";
.c-nav-sidebar {
  background: url("~@/assets/sidebar-bg.png") no-repeat center;
  /* background-image: url('@/assets/sidebar-bg.png') no-repeat center; */
  background-size: cover;
  width: 390px;
  position: fixed;
  top: 0px;
  height: 100vh;
  padding-top: 110px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  &__user {
    &__avatar {
      border: 3px solid $clr-primary;
      border-radius: 50%;
      width: 78px;
      height: 78px;
      overflow: hidden;
      & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    &__name {
      color: #fff;
      font-size: 36px;
      text-align: center;
    }

    &-coins {
      font-size: 18px;
      color: #fff;
      display: flex;
      align-items: center;
      font-weight: 300;
      margin-top: 20px;
      &-count {
        font-size: 24px;
        font-weight: 500;
        color: $clr-primary;
        margin-right: 7px;
        margin-left: 16px;
      }
      &-icon {
        width: 29px;
        height: 29px;
      }
    }
  }

  &__nav-list {
    margin-top: 20px;
    margin-bottom: 0;
  }
  &__info-list {
    display: none;
  }
  &__nav-item {
    height: 98px;
    padding-left: 80px;
    color: #fff;
    cursor: pointer;
    text-decoration: none;
    svg {
      fill: #fff;
    }
    &.is-active {
      background: #fff;
      color: #000;
      svg {
        fill: $clr-blue;
      }
    }
  }
  &__logout {
    color: #fff;
    margin-top: 20px;
    margin-bottom: 50px;
    margin-left: 60px;
    cursor: pointer;
    display: flex;
    align-items: center;
    svg {
      fill: none;
    }
  }
}
@include media(">phone", "<=tablet") {
  .c-nav-sidebar {
    width: 236px;
    padding-top: 60px;
    transition: 0.2s;
    z-index: 3;
    &__user {
      display: none;
    }

    &__nav-item {
      height: 60px;
      padding-left: 18px;

      .icon {
        width: 16px;
      }
    }
    &__nav-list {
      margin-top: 37px;
      margin-bottom: 0;
    }
    &-hidden {
      transform: translateX(-240px);
    }
    &__info-list {
      display: block;
      margin: 16px;
      padding-top: 14px;
      border-top: 1px solid rgb(255 255 255 / 20%);
      .c-nav-sidebar__info-item {
        font-family: Poppins;
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 21px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        color: #ffffff;
        opacity: 0.5;
        text-decoration: none;
        background: transparent !important;
        padding: 0;
      }
    }
  }
}
</style>
