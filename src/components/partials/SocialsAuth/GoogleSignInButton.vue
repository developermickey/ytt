<template>
  <UBtn
    class="google-btn"
    size="medium"
    color="red"
    block
  >
    <span class="google-btn__text">
      Sign in with Google
    </span>
  </UBtn>
</template>

<script>
export default {
name: "FacebookSignInButton"
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins";
.google-btn{
  font-family: Poppins, sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 107.5%;
  height: 52px;
  flex-basis: calc(50% - 15px);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.102437);

  &__text{
    position: relative;

    &:before{
      content: '';
      background-image: url('~@/assets/svg/google.svg');
      background-repeat: no-repeat;
      position: absolute;
      height: 19px;
      width: 19px;
      background-size: contain;
      left: -44px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

}
@include media(">phone", "<=tablet") {
  .google-btn {
    margin-top: 10px;
    height: 40px;
    font-size: 12px;
  }
}
</style>
