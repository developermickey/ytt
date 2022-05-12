<template>
  <UBtn
    class="facebook-btn"
    color="blue"
    size="medium"
    block
  >
    <span class="facebook-btn__text">
      Sign in with Facebook
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
.facebook-btn{
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
      background-image: url('~@/assets/svg/facebook.svg');
      background-repeat: no-repeat;
      position: absolute;
      height: 18px;
      width: 10px;
      background-size: contain;
      left: -32px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

}

@include media(">phone", "<=tablet") {
  .facebook-btn {
    margin-top: 10px;
    height: 40px;
    font-size: 12px;
  }
}
</style>
