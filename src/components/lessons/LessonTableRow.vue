<template>
  <tr v-if="!row.delete">
    <td class="table__drag">
      <img src="@/assets/svg/more-horizontal.svg" alt="icon"  class="table__drag-icon">
    </td>
    <td>{{ rowIndex + 1 }}</td>
    <td 
      class="table__hebrew"
      :class="{'not-valid-cell': !row.word.isValid}"
      @click.self="showEditWord = false"
    >
      <span v-show="!showEditWord">
        {{ row.word.value }}
      </span>
      <input 
        type="text" 
        name="word"
        class="table__word-input" 
        v-model="row.word.value"
        v-show="showEditWord"
        onfocus="this.value= this.value"
        ref="word"
      >
      <span 
        v-show="!showEditWord"
        class="table__word-edit-icon"
        @click="showEditWord = true"
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.625 1.87494C10.7892 1.71079 10.984 1.58058 11.1985 1.49174C11.413 1.4029 11.6429 1.35718 11.875 1.35718C12.1071 1.35718 12.337 1.4029 12.5515 1.49174C12.766 1.58058 12.9608 1.71079 13.125 1.87494C13.2892 2.0391 13.4194 2.23397 13.5082 2.44845C13.597 2.66292 13.6428 2.8928 13.6428 3.12494C13.6428 3.35709 13.597 3.58696 13.5082 3.80144C13.4194 4.01592 13.2892 4.21079 13.125 4.37494L4.6875 12.8124L1.25 13.7499L2.1875 10.3124L10.625 1.87494Z" stroke="#2C4CC1" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>

    </td>
    <td 
      :class="{'not-valid-cell': !row.translations.isValid}"
    >
      <div class="table__translations" @click.self="addtranslations">
        <div 
          class="table__translations-word" 
          :class="{'table__translations-word_default': word.default}" 
          v-for="(word,wordIndex) in row.translations.values" 
          :key="wordIndex"
          @contextmenu.prevent="showSetDefault(wordIndex)"
        >
          <template v-if="!word.delete">
            {{ word.eng }}
            <span 
              class="table__translations-word-remove" 
              @click="removetranslations(wordIndex)"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 2.5L2.5 7.5" stroke="#2C4CC1" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2.5 2.5L7.5 7.5" stroke="#2C4CC1" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <div
              v-if="showSetToDefault && translationsDefaultIndex === wordIndex" 
              class="table__item-set-default"
              @click="setDefaultTranslation(wordIndex)"
            >
              Set to default
            </div>
          </template>
        </div>
        
        <div 
          v-if="showInput"
          class="table__translations-input-box"
        >
          <input 
            type="text" 
            class="table__translations-input"
            v-model="newTranslation" 
            @keyup.enter="addtranslations"
            @blur="addtranslations"
          >
          <span @click="hideAddtranslationsInput">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9.5" fill="white" stroke="#2C4CC1"/>
              <path d="M12.5 7.5L7.5 12.5" stroke="#2C4CC1" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.5 7.5L12.5 12.5" stroke="#2C4CC1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </div>

        <div 
          class="table__translations-add"
          @click="showAddtranslationsInput"
        >
          <img src="@/assets/svg/add-icon.svg" alt="add">
        </div>
      </div>
    </td>
    <td 
      class="table__quote"
      :class="{'not-valid-cell': !row.quote.isValid}"
      @click.self="showEditQuote = false"
    >
      <span v-show="!showEditQuote">
        {{ row.quote.value }}
      </span>
      <input 
        type="text" 
        name="quote"
        class="table__quote-input" 
        v-model="row.quote.value"
        v-show="showEditQuote"
        onfocus="this.value= this.value"
        ref="quote"
      >
      <span 
        v-show="!showEditQuote"
        class="table__quote-edit-icon"
        @click="showEditQuote = true"
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.625 1.87494C10.7892 1.71079 10.984 1.58058 11.1985 1.49174C11.413 1.4029 11.6429 1.35718 11.875 1.35718C12.1071 1.35718 12.337 1.4029 12.5515 1.49174C12.766 1.58058 12.9608 1.71079 13.125 1.87494C13.2892 2.0391 13.4194 2.23397 13.5082 2.44845C13.597 2.66292 13.6428 2.8928 13.6428 3.12494C13.6428 3.35709 13.597 3.58696 13.5082 3.80144C13.4194 4.01592 13.2892 4.21079 13.125 4.37494L4.6875 12.8124L1.25 13.7499L2.1875 10.3124L10.625 1.87494Z" stroke="#2C4CC1" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>

    </td>
    <td
      :class="{'not-valid-cell': !row.images.isValid}"
    >
      <div class="table__upload-img">
        <UploadImages 
          @changed="handleImages"
          :images="row.images.values" 
          :key="row.order"
        />
      </div>
    </td>
    <td class="table__delete-row">
      <div @click="deleteRow">
        <img src="@/assets/svg/trash-2.svg" alt="icon">
      </div>
    </td>
  </tr>
      
</template>

<script>
import UploadImages from "@/components/common/FileUpload/UploadImages";
import { mapGetters } from 'vuex';
export default {
  name: 'ImportLessonTableRow',
  components: {
    UploadImages,
  },
  props: {
    row: {
      type: Object,
      default: null,
    },
    rowIndex: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    showInput: false,
    showSetToDefault: false,
    translationsDefaultIndex: 0,
    showEditQuote: false,
    showEditWord: false,
    newTranslation: '',
  }),
  computed: {
    ...mapGetters('Lessons', ['editLesson']),
  },
  methods: {
    showAddtranslationsInput() {
      this.showInput = true;
    },
    hideAddtranslationsInput() {
      this.showInput = false;
    },
    addtranslations() {
      if(this.editLesson) {
        if(this.newTranslation){
          this.row.translations.values.push({ id: '', eng: this.newTranslation, default: false, delete: false});
        }
        this.newTranslation = '';
        this.hideAddtranslationsInput();
      } else {
        if(this.newTranslation){
          this.row.translations.values.push({ eng: this.newTranslation, default: false});
        }
        this.newTranslation = '';
        this.hideAddtranslationsInput();
      }
    },
    removetranslations(wordIndex) {
      this.row.translations.values[wordIndex].delete = true;
      // this.row.translations.values.splice(wordIndex, 1)
      console.log(this.row)
      // if(this.editLesson){
      //   this.row.translations.values[wordIndex].delete = true;
      // } else {
      //   this.row.translations.values.splice(wordIndex, 1)
      // }
    },
    showSetDefault(wordIndex) {
      this.showSetToDefault = true;
      this.translationsDefaultIndex = wordIndex
    },
    hideSetDefault() {
      this.showSetToDefault = false;
      this.translationsDefaultIndex = 0;
    },
    setDefaultTranslation(wordIndex) {
      this.row.translations.values.forEach((word, index) => {
        this.row.translations.values[index] === wordIndex ? word.default = true : word.default = false
      });
      this.row.translations.values[wordIndex].default = true;
      this.showSetToDefault = false;
    },
    handleImages(images) {
      this.$emit('updateImages', this.row.order, images)
    },
    deleteRow() {
      this.$emit('deleteRow', this.row.order)
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars';
.table {
  width: 100%;
  border-collapse:separate; 
  border-spacing: 0 5px;
  tr {
    border: 1px solid #DFDFDF;
  }
  thead {
    background: #DFDFDF;
    tr {
      border: none;
    }
    th {
      height: 80px;
      vertical-align: middle;
      border: 0.8px solid #FFFFFF;
      border-top: none;
    }
    th:first-child {
      border-radius:20px 0 0 0;
      border-left: none;
    }
    th:last-child {
      border-radius:0 20px 0 0;
      border-right: none;
    }
  }
  td {
    border: 1px solid #DFDFDF;
  }
  // &__hebrew, &__quote {
  //   text-align: right;
  // }
  &__drag {
    text-align: center;
    img {
      cursor: move;
    }
  }
  &__translations {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    &-word {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      background: rgba($clr-blue, 0.1);
      color: $clr-blue;
      display: inline-block;
      padding: 0 10px;
      border-radius: 14px;
      &-remove {
        cursor: pointer;
        margin-left: 4px;
      }
      &_default {
        background: rgba($clr-blue, 0.3);
      }
    }
    &-input-box {
      position: relative;
      span {
        position: absolute;
        top: -12px;
        right: -9px;
      }
    }
    &-input {
      padding-left: 10px;
      background-color: #F0F0F0;
      width: 100%;
      height: 40px;
      border: none;
      outline: none;
    }
    &-add {
      cursor: pointer;
      align-self: center;
    }
  }
  &__quote, &__word {
    
    cursor: default;
    &-edit-icon {
    cursor: pointer;
    }
    &-input {
      padding-left: 10px;
      background-color: #F0F0F0;
      width: 100%;
      height: 40px;
      border: none;
      outline: none;
    }
  }
  &__upload-img {
    display: flex;
    align-items: center;
    img {
      margin-right: 10px;
    }
  }
  &__delete-row {
    text-align: center;
    img {
      cursor: pointer;
    }
  }
  &__item-set-default {
    position: absolute;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.08);
    background: #fff;
    padding: 7px 20px;
    cursor: pointer;
    z-index: 1;
    &:hover {
      background: $clr-blue;
      color: #fff;
    }
  }
}
.not-valid-cell{ 
 border: 1px solid red !important;
}
</style>