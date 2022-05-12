<template>
  <div class="no-mobile">
    <p class="no-mobile__sorry">SORRY!</p>
    <p class="no-mobile__not-mob">Web app is not available from mobile device</p>
    <p class="no-mobile__desk">Come back to us from your <span>desktop device</span></p>
    <img src="@/assets/no-access-from-mobile.png" class="no-mobile__image" alt="">
    <UBtn class="no-mobile__back" tag="a" href="https://yourtorahtutors.com">
      Back
    </UBtn>
  </div>
</template>

<script>
export default {
  name: "NoAccessFromMobile"
}
</script>

<style lang="scss" scoped>
  .no-mobile{
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 90%;
    margin: 0 auto;

    &__sorry{
      font-family: Poppins, sans-serif;
      font-weight: 600;
      font-size: 38px;
      line-height: 57px;
      color: black;
      margin-top: 43px;
    }

    &__not-mob{
      font-family: Poppins, sans-serif;
      font-size: 14px;
      line-height: 19px;
      color: #575757;
      margin-top: 7px;
    }
    &__desk{
      font-family: Poppins, sans-serif;
      font-size: 11px;
      line-height: 16px;
      text-align: center;
      text-transform: capitalize;
      color: #C1C1C1;
      span{
        color: #575757;
      }
    }

    &__image{
      margin-top: 70px;
      max-width: 100%;

    }
    &__back{
      margin-top: 56px;
    }

  }
</style>