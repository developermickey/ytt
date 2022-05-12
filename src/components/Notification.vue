<template>
  <notifications :duration="10000">
    <template slot="body" slot-scope="{ close, item: { title, text, type } }">
      <div class="ytt-notification">
        <div class="ytt-notification__head">
          <div class="ytt-notification__icon">
            <svg
              v-svg
              :symbol="`icon-${type}`"
              size="0 0 40 40"
            />
          </div>
          <div class="ytt-notification__title">
            {{ title }}
          </div>
        </div>
        <div v-if="text" class="ytt-notification__content">
          {{ text }}
        </div>
        <div class="ytt-notification__footer">
          <span class="ytt-notification__close" @click="close">Close</span>
        </div>
      </div>
    </template>
  </notifications>
</template>

<script>
export default {

}
</script>

<style lang="scss">
@import "@/styles/mixins";
.vue-notification-group{
  top: 110px !important;
  min-width: 430px !important;

}
.vue-notification-wrapper{
  overflow: unset !important;
}

.ytt-notification{
  background: white;
  box-shadow: 0 12px 66px rgba(0, 0, 0, 0.15);
  border-radius: 50px 0 0 50px;
  padding: 30px 30px 7px 60px;
  margin-top: 35px;
  font-family: Poppins, sans-serif;


  &__head{
    display: flex;
    align-items: center;
  }
  &__icon{
    margin-right: 22px;
    display: flex;
    align-items: center;
  }
  &__title{
    font-family: inherit;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
  }
  &__content{
    margin-top: 28px;
    font-family: inherit;
    font-weight: 300;
    font-size: 14px;
    line-height: 21px;
    margin-bottom: 10px;
  }
  &__footer{
    margin-top: 12px;
    display: flex;
    justify-content: center;
  }
  &__close{
    font-family: inherit;
    font-weight: 300;
    font-size: 9px;
    line-height: 13px;
    color: #BFBFBF;
    cursor: pointer;
  }
}

@include media(">phone", "<=tablet") {
  .vue-notification-group {
    min-width: 100vw !important;
  }
  .ytt-notification{
    border-radius: 50px;
  }
}
</style>
