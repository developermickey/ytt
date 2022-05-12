<template>
  <div class="u-container u-ml-auto u-mr-auto u-pt-15">
    <div class="u-row">
      <div class="u-col-12">
        <div class="u-flex is-align-center head">
          <div class="u-text-h1 u-mr-6">Products</div>
          <UBtn
              :to="{ name: 'product-create' }"
              id="create_lesson_link"
              size="x-large"
              color="blue"
              width="251"
          >
            Add product
          </UBtn>
        </div>
      </div>
      <div class="u-col-5">
        <!-- search -->
      </div>
      <div class="u-col-12 u-mb-20">
        <ProductsList></ProductsList>
      </div>
    </div>
  </div>
</template>

<script>
import ProductsList from '@/components/admin/products/ProductsList';


export default {
  components: {
    ProductsList
  },
  data: () => ({
    data: [],
    currentTab: 0,
  }),
  computed: {
    
  },
  methods: {
    getItems(){
    }
  },
  mounted(){
    
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars';

.head{
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

tr:hover .pages-col{
  color: #fff;
}
.pages-col{
  color: $clr-grey;
}

.users-tabs::v-deep{
  .u-tabs__header{
    margin-bottom: 40px;
  }
}
</style>