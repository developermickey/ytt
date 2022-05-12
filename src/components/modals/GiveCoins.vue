<template>
  <modal name="give-coins" :width="deviceWidth" height="auto" classes="u-modal give-coins" scrollable>
    <u-card class="u-modal-card u-px-24 u-pt-24 u-pb-15">
      <div class="give-coins__cross" @click="hideModal">
        <svg
            v-svg
            symbol="icon-cross"
            size="0 0 72 72"
        />
      </div>
      <div class="give-coins__title">
        Credit coins to <span class="give-coins__title-name">{{ student.name }}</span>
      </div>
      <ValidationObserver v-slot="{ handleSubmit }">
        <form class="give-coins__form" @submit.prevent="() => handleSubmit(() => giveCoins(student.id))">
          <ValidationProvider rules="min_value:1|required" name="coins" v-slot="{ errors }">
            <div class="give-coins__field">
              <span class="give-coins__field-label">
                How much coins you want to credit?
              </span>
              <UTextField
                  :error="Boolean(errors[0])"
                  inset
                  type="number"
                  v-model="coins"
                  class="give-coins__field-input"
                  placeholder="0"
              ></UTextField>
            </div>
          </ValidationProvider>

          <div class="give-coins__preview">
            <span>Credit</span>
            <div class="give-coins__preview-coin">
              {{ coins || 0 }}
            </div>
            <span>coins</span>
          </div>

          <div class="give-coins__submit">
            <UBtn
                color="primary"
                size="x-large"
                width="262"
            >
              Submit
            </UBtn>
          </div>
        </form>
      </ValidationObserver>


    </u-card>
  </modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import UCard from '@/components/common/UCard.vue';
import UTextField from '@/components/common/UTextField.vue';


export default {
  data: () => ({
    coins: 5
  }),
  components: {
    UCard,
    UTextField
  },
  computed: {
    ...mapGetters('Coins', ['student']),
    deviceWidth(){
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      return vw > 1250 ? '1250px' : '100%'
    }
  },
  methods: {
    ...mapActions('Coins', ['chargeCoins']),
    hideModal(){
      this.$modal.hide('give-coins');
    },
    giveCoins(){
      this.chargeCoins( { userId: this.student.id, amount: this.coins })
        .then(() => {
          this.$notify({
            title: 'Coins charged',
            text: `${this.coins} coins charged to ${this.student.name}`,
            type: 'success'
          });
        })
        .catch(({ message }) => {
          this.$notify({
            title: 'Coins charge error',
            text: message,
            type: 'error'
          });
        })
      .then(this.hideModal)
    }
  },
}
</script>

<style lang="scss">
@import '@/styles/mixins';
.give-coins{

  &__title{
    font-family: Poppins, sans-serif;
    font-weight: 300;
    font-size: 48px;
    line-height: 72px;
    text-align: center;
    color: change-color(black, $alpha: 0.8);
    &-name{
      font-weight: 500;
      color: #2C4CC1;
    }
  }

  &__form{
    max-width: 664px;
    margin: 23px auto 0;
  }
  &__submit{
    margin-top: 44px;
    display: flex;
    justify-content: center;
  }
  &__cross{
    position: absolute;
    top: 38px;
    right: 58px;
    cursor: pointer;
  }
  &__field {
    display: flex;
    justify-content: center;
    align-items: center;
    &-label{
      font-family: Poppins, sans-serif;
      font-weight: 300;
      font-size: 18px;
      line-height: 27px;
      color: change-color(black, $alpha: 0.8);
      margin-right: 20px;
    }
    &-input {
      flex: 0 1 70px;
      height: 27px;
      input {
        text-align: center;
        font-weight: 500;
        font-size: 18px;
        padding: 0;
        color: change-color(#2C4CC1, $alpha: 0.8);
        height: 100%;
      }
    }
  }

  &__preview{
    background: #F8F8F8;
    border: 1px solid #E9E9E9;
    box-sizing: border-box;
    border-radius: 50px;
    padding: 20px 86px;
    margin-top: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;

    &-coin{
      background-image: url('~@/assets/svg/big-coin.svg');
      background-repeat: no-repeat;
      background-size: contain;
      height: 82px;
      width: 82px;
      margin: 0 17px 0 20px;
      font-family: Poppins, sans-serif;
      font-weight: bold;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
  }
}

@include media(">phone", "<=tablet") {
  .give-coins{
    &--form{
      max-width: 100vw;
    }

    .u-modal-card{
      padding: 45px 35px !important;
    }
    &__cross{
      svg {
        width: 20px;
        height: 20px;
      }
      
      top: 16px;
      right: 16px;
    }
    &__title{
      font-size: 28px;
      display: flex;
      flex-direction: column;

      &-name{
        font-size: 16px;
        line-height: 16px;
      }
    }
    
    &__field-label{
      font-size: 16px;
    }
    &__preview{
      padding: 0;
      font-size: 18px;
      &-coin {
        width: 40px;
        height: 40px;
        font-size: 17px;
      }
    }
  }

}
</style>
