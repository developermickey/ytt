<template>
  <div class="socials-auth">
    <div class="socials-auth__container">
      <FacebookSignInButton/>
      <GoogleSignInButton/>
    </div>
  </div>
</template>

<script>
import FacebookSignInButton from '@/components/partials/SocialsAuth/FacebookSignInButton';
import GoogleSignInButton from '@/components/partials/SocialsAuth/GoogleSignInButton';

export default {
  name: "SocialAuth",
  data: () => ({
    username: 'admin',
    password: 'admin',
    isAutomatic: false,
  }),
  components: {
    GoogleSignInButton,
    FacebookSignInButton
  },
}
</script>

<style lang="scss" scoped>
.socials-auth{
  &__container{
    display: flex;
    justify-content: space-between;
  }
}
</style>
