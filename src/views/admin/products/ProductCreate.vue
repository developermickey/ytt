<template>
  <ContentContainer>
    <div class="u-text-h2 edit-user__title">Product Create</div>

    <ProductCreate></ProductCreate>
  </ContentContainer>
</template>

<script>
import ContentContainer from "@/components/common/ContentContainer";
import ProductCreate from "@/components/products/ProductCreate";

export default {
  components: {
    ContentContainer,
    ProductCreate,
  }
}
</script>

<style lang="scss">
.edit-user{
  &__title{
    margin-bottom: 40px;
  }
}
</style>