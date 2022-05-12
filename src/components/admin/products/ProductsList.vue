<template>
  <div>
    <u-card elevation="3">
      <table class="u-data-table is-striped">
        <colgroup>
          <col v-for="column in columns" :key="column.value">
        </colgroup>
        <thead>
        <tr>
          <template v-for="(column, index) in columns">
            <th
                class="u-pl-13 u-text-left"
                v-if="index == 0"
                :key="index"
            >{{column.text}}</th>
            <th
                v-else
                class="u-text-left"
                :key="index"
            >{{column.text}}</th>
          </template>
        </tr>
        </thead>
        <tbody v-if="products && products.length">
        <tr
            v-for="item in products"
            :key="item.id"
        >
          <td class="u-pl-13">
            <div class="u-flex is-align-center">
              <div class="avatar-wrap u-mr-6">
                <img :src="item.image" alt="">
              </div>
              {{item.name}}
            </div>
          </td>
          <td class="grey-col">{{item.amount}}</td>
          <td class="u-pr-25 u-text-right">
            <div class="actions-col">
              <UIconBtn
                class="u-mx-1 qa-delete-teacher-btn"
                icon="icon-trash"
                icon-color="grey"
                icon-hover-color="blue"
                bg-hover-color="white"
                hoverable
                @click.native="deleteProductAlert(item)"
              >
              </UIconBtn>
            </div>
          </td>
        </tr>
        </tbody>
        <tbody v-else>
        <tr>
          <td class="u-text-center" colspan="4">
            No data available
          </td>
        </tr>
        </tbody>
      </table>
    </u-card>
  </div>
</template>

<script>
import UCard from '@/components/common/UCard';
import UIconBtn from "@/components/common/UIconBtn";
// eslint-disable-next-line no-unused-vars
import SelectLesson from "@/components/modals/SelectLesson";

import { mapActions, mapGetters, mapMutations } from 'vuex';
// eslint-disable-next-line no-unused-vars
import {ADMIN} from "@/constants/roles";

import DeleteProductMixin from '@/mixins/delete-product.mixin'

export default {
  components: {
    UCard,
    // SelectLesson,
    UIconBtn,
  },
  mixins: [DeleteProductMixin],
  data: () => ({
    selectedTeacher: null,
    selectedLessons: null,
    columns: [
      {
        text: 'Name',
        value: 'name',
        breakpoint: false,
      },
      {
        text: 'Amount',
        value: 'amount',
        breakpoint: false,
      },
      {
        text: '',
        value: 'actions',
        breakpoint: false,
      },
    ],
  }),
  computed: {
    ...mapGetters('Products', ['products']),
  },
  methods: {
    ...mapActions('Products', ['fetchProducts']),
    ...mapMutations('Products', ['RESET_PRODUCTS_LIST']),
  },
  mounted(){
    this.fetchProducts();
  },
  beforeDestroy() {
    this.RESET_PRODUCTS_LIST();
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars';

.avatar-wrap{
  border-radius: 50%;
  overflow: hidden;
  width: 40px;
  height: 40px;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

tr:hover .grey-col{
  color: #fff;
}
.grey-col{
  color: $clr-grey;
}

.edit-user-btn{
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
  svg{
    width: 18px;
    height: 18px;
  }
  &:hover{
    background-color: #fff;
    svg{
      fill: $clr-blue;
    }
  }
}
.actions-col{
  display: flex;
  justify-content: flex-end;
}

.login-as-icon-btn{
  position: relative;
  left: -2px;
}
</style>
