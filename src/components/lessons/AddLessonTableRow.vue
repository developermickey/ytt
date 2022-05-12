<template>
  <ValidationObserver 
    v-slot="{ handleSubmit }"
    class="add-row"
    tag="tr"
  >
    <td class="add-row__drag">
      <img src="@/assets/svg/more-horizontal.svg" alt="icon"  class="add-row__drag-icon">
    </td>
    <td>{{ row.order }}</td>
    <td class="add-row__hebrew">
      <!-- <ValidationProvider rules="required" name="Hebrew" v-slot="{ errors }"> -->
      <ValidationProvider name="Hebrew" v-slot="{ errors }">
        <input class="add-row__input" type="text" v-model="row.word.value">
        <div class="error">{{ errors[0] }}</div>
      </ValidationProvider>
    </td>
    <td class="add-row__translations">
      <!-- <ValidationProvider rules="required" name="Translation" v-slot="{ errors }"> -->
      <ValidationProvider name="Translation" v-slot="{ errors }">
        <input class="add-row__input" type="text" v-model="row.translations.values[0].eng">
        <div class="error">{{ errors[0] }}</div>
      </ValidationProvider>
    </td>
    <td class="add-row__quote">
      <!-- <ValidationProvider rules="required" name="Quote" v-slot="{ errors }"> -->
      <ValidationProvider name="Quote" v-slot="{ errors }">
        <input class="add-row__input" type="text" v-model="row.quote.value">
        <div class="error">{{ errors[0] }}</div>
      </ValidationProvider>
    </td>
    <td>
      <div class="add-row__upload-img">
        <UploadImages 
          :images="row.images.values"
          @changed="handleImages"
        />
      </div>
    </td>
    <td class="add-row__save">
      <div @click="handleSubmit(saveRow)">
        Save
      </div>
    </td>
  </ValidationObserver>
</template>

<script>
import UploadImages from "@/components/common/FileUpload/UploadImages";

const getDefaultRow = () => ({
  id: '',
  delete: false,
  order: 0,
  word: {
    isValid: true,
    value: '',
  },
  translations: {
    isValid: true,
    values: [
      { 
        id: '',
        eng: '',
        default: true,
        delete: false,
      },
    ],
  },
  quote: {
    isValid: true,
    value: '',
  },
  images: {
    isValid: true,
    values: [],
  },
});

export default {
  name: 'AddLessonTableRow',
  components: {
    UploadImages,
  },
  props: {
    tableRows: {
      type: Array,
      default: []
    },
  },
  data: () => ({
    row: getDefaultRow(),
  }),
  mounted() {
    const tableRowsLength = this.tableRows.length;
    const lastRowOrder = tableRowsLength > 0 ? this.tableRows[tableRowsLength -1].order : 0;
    this.row.order = lastRowOrder + 1;
  },
  methods: {
    saveRow() {
      const row = JSON.parse( JSON.stringify( this.row ) );
      console.log(row)
      this.$emit('addNewRow',row);
      Object.assign(this.row, getDefaultRow());
    },
    handleImages(images) {
      images.forEach(image => {
        this.row.images.values.push({ 
          id: '',
          image,
          default: false,
          delete: false,
          });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars';
.add-row {
  td {
    border: 1px solid #DFDFDF;
  }
  &__drag {
    text-align: center;
  }
  &__input {
    padding-left: 10px;
    background-color: #F0F0F0;
    height: 40px;
    border: none;
    outline: none;
  }
  &__save {
    text-align: center;
    cursor: pointer;
    text-decoration: underline;
    color: $clr-blue;
  }
}
.error {
  color: #EC3D2F;
  font-size: 12px;
}
</style>