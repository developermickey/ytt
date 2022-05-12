<template>
  <div>
    <div class="u-container u-ml-auto u-mr-auto u-pt-15 store">
      <div class="u-row">
        <div class="u-col-12">
          <div class="u-flex is-align-center store__head">
            <div class="u-text-h1 u-mr-6 store__title">YTT Store</div>
            <div class="u-text-h1 u-mr-6 store__balance">
              <div class="store__balance-text">
                Earned coins
              </div>
              <div class="store__balance-count">
                {{ user.balance }}
              </div>
              <div class="store__balance-icon">
                <img src="@/assets/svg/reward.svg" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="u-col-12">
          <div class="store__list">
            <div
                v-for="product in products"
                :key="product.id"
                class="product"
            >
              <div class="product-wrap">
                <div class="product__image" :style="`background-image: url('${product.image}')`">
                </div>
                <div class="product__name">
                  {{ product.name }}
                </div>
                <div class="product__price">
                  {{ product.amount }} coins
                </div>
              </div>
              <UBtn color="blue" class="product__exchange" @click="() => purchase(product)" :disabled="product.amount > parseInt(user.balance)">Exchange</UBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';



export default {
  components: {
  },
  data: () => ({

  }),
  computed: {
    ...mapGetters('Auth', ['user']),
    ...mapGetters('Products', ['products'])
  },
  methods: {
    ...mapActions('Products', ['fetchProducts', 'purchaseProduct']),
    ...mapActions('Auth', ['fetchUser']),
    purchase(product){
      this.purchaseProduct(product.id)
      .then(() => {
        this.$notify({
          title: 'Purchased',
          text: `${product.name} purchased successfully`,
          type: 'success'
        });
      })
      .then(this.fetchProducts)
      .then(this.fetchUser)
      .catch(({ message }) => {
        this.$notify({
          title: 'Product purchase error',
          text: message,
          type: 'error'
        });
      });
    }
  },
  mounted(){
    this.fetchProducts();
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars';
@import '@/styles/mixins';

.store{

  &__head{
    display: flex;
    justify-content: space-between;
  }
  &__balance{
    font-family: Poppins, sans-serif;
    display: flex;
    align-items: center;
    padding: 13px 24px 13px 38px;
    background: white;
    box-shadow: 0 12px 66px rgba(0, 0, 0, 0.15);
    border-radius: 25px;


    &-text{
      font-weight: 300;
      font-size: 18px;
      line-height: 27px;
      color: black;
      margin-right: 60px;
    }
    &-count{
      font-weight: 500;
      font-size: 36px;
      line-height: 54px;
      color: #ECBF8C;
      margin-right: 15px;
    }
    &-icon{
      width: 55px;
      display: flex;
      flex-direction: column;
      align-items: center;
      img{
        width: 100%;
      }
    }
  }

  &__list{
    margin-top: 52px;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;

    .product{
      width: 282px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 23px 60px 20px 60px;
      background: white;
      box-shadow: 0 12px 66px rgba(0, 0, 0, 0.15);
      border-radius: 25px;
      font-family: Poppins, sans-serif;
      margin-bottom: 32px;


      &__image{
        width: 152px;
        height: 132px;
        background-size: cover;
        background-position: center;
      }
      &__name{
        margin-top: 12px;
        font-weight: 600;
        font-size: 18px;
        line-height: 27px;
        text-align: center;
        color: black;
      }
      &__price{
        margin-top: 4px;
        font-weight: 300;
        font-size: 14px;
        line-height: 21px;
        color: black;
      }
      &__exchange{
        margin-top: 22px;
      }
    }
  }
}
@include media(">phone", "<=tablet") {
  .store{
    &__head{
      justify-content: space-between;
      margin-top: 11px;
      margin-bottom: 11px;
    }

    &__balance{
      height: 50px;
      background-color: #FFFFFF;
      margin-right: 0!important;
      &-text{
        font-size: 11px;
        line-height: 14px;
        margin-right: 9px;
      }
      &-count{
        font-size: 24px;
        line-height: 36px;
      }
      &-icon {
        height: 34px;
        width: 34px;
      }
    }

    &__list{
      grid-template-columns: 1fr 1fr ;
      grid-gap: 16px;
      justify-items: center;
      margin-top: 0;

      .product{
        width: 100%;
        padding: 15px 10px;
        margin-bottom: 0;
        position: relative;
        flex-direction: column;
        justify-content: space-between;
        &-wrap{
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        &__name{
          font-size: 12px;
          line-height: 18px;
        }
        &__image{
          width: 85px;
          height: 79px;
          background-size: cover;
          background-position: center;
        }
        &__exchange{
          height: 28px;
          width: 90px;
          font-size: 10px;
          margin-top: 6px;
          position: relative;
          bottom: 0;
        }
        &__price{
          width: 90px;
          font-size: 10px;
          line-height: 16px;
          text-align: center;
        }
      }
    }
  }
}
</style>
