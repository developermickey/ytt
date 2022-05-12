<template>
  <div>
    <Loader :show="loading"/>
    <Notification/>
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Notification from '@/components/Notification';
import Loader from '@/components/Loader';

export default {
  mounted(){
    //hide to get mobile version
    // if((typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1))
    //   this.$router.push({ name: 'no-access-from-mobile' });
  },
  computed: {
    ...mapGetters(['loading'])
  },
  components: {
    Notification,
    Loader
  },
  methods: {
    ...mapActions('Auth', ['fetchUser', 'navigateToStartPage'])
  }
}
</script>
