<template>
  <div
    class="file-upload"
    :class="classes"
  >
    <label
      class="file-upload__label"
      :for="uuid"
    >
      <template v-if="!hasValue">
        <slot name="default-label">
          <div class="file-upload__label-inner">
            <svg
              v-svg
              symbol="plus"
            >
            </svg>
            <span class="file-upload__label-text">
              Add file
            </span>
          </div>
        </slot>
      </template>
      <div v-else class="file-upload__label-inner">
        <svg
          v-if="hasPdf"
          v-svg
          symbol="pdf-file"
        ></svg>
        <div
          class="file-upload__image-preview"
          :style="{ 'background-image': `url(${compImagePreview})` }"
          v-if="hasImage"
        ></div>

        <span class="file-upload__label-text">
          {{compFilename}}
        </span>
      </div>
    </label>
    <div class="file-upload__messages">{{error}}</div>
    <input
      :id="uuid"
      type="file"
      :accept="accept"
      @change="onSelectFile"
      class="file-upload__input"
    >
  </div>
</template>

<script>
import UUID from '@/mixins/uuid.mixin';

export default {
  mixins: [ UUID ],
  data: () => ({
    imagePreview: null,
  }),
  props: {
    apiFunc: {
      type: Function,
    },
    value: {
      type: [Object, Array, File, String],
      default: () => null,
    },
    accept: {
      type: String,
      default: '',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
  },
  computed: {
    classes(){
      return {
        'file-upload_value_none' : !this.hasValue,
        'file-upload_value_pdf' : this.hasPdf,
        'file-upload_value_image' : this.hasImage,
      };
    },
    hasValue(){
      return this.value !== null;
    },
    hasPdf(){
      return this.hasValue && this.value.type === 'application/pdf';
    },
    hasImage(){
      return this.hasValue && this.accept === 'image/*';
    },
    compImagePreview(){
      let compImagePreview;
      if(this.hasImage){
        if(typeof this.value === 'string'){
          compImagePreview = this.value;
        }
        else{
          compImagePreview = this.imagePreview;
        }
      }
      return compImagePreview;
    },
    compFilename(){
      let compFilename;
      if(typeof this.value === 'string'){
        compFilename = this.value.split('/').pop();
      }
      else{
        compFilename = this.value.name;
      }
      return compFilename;
    }
  },
  methods: {
    onSelectFile(event){

      if(this.multiple){
        this.$emit('input', event.target.files);
      }
      else{
        this.$emit('input', event.target.files[0]);
        const reader = new FileReader
        reader.onload = e => {
          this.imagePreview = e.target.result
        }
        reader.readAsDataURL(event.target.files[0]);
      }
    },
  },

}
</script>

<style lang="scss">
@import '@/styles/vars';
@import '@/styles/mixins';

.file-upload{
  &__label{
    cursor: pointer;

  }
  &__label-inner{
    height: 60px;
    border-radius: 62px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    min-width: 218px;
    padding-right: 50px;
    padding-left: 50px;
    background-color: #fff;
  }

  &__label-text{
    font-weight: 300;
  }

  &__input{
    display: none;
  }

  &__messages{
    color: $clr-error;
    margin-top: 10px;
    font-size: 14px;
  }

  &__image-preview{
    background-color: red;
    height: 60px;
    width: 60px;
    position: absolute;
    left: 0;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
  }

  &_value_none{
    .file-upload__label-inner{
      border: 1px solid $clr-blue;
      svg{
        fill: none;
        stroke: $clr-blue;
        width: 20px;
        height: 20px;
        margin-right: 12px;
      }
    }
  }
  &_value_pdf{
    .file-upload__label-inner{
      svg{
        width: 25px;
        height: 26px;
        margin-right: 12px;
      }
    }
  }

  &_value_image{
    .file-upload__label-inner {
      padding-left: 70px;
    }
  }

  &_value_pdf,
  &_value_image{
    .file-upload__label-inner {
      box-shadow: 0px 12px 66px rgba(0, 0, 0, 0.03);
    }
  }
}

@include media(">phone", "<=tablet") {
  .file-upload{
    &__label-inner{
      height: 40px;
      min-width: 175px;
      padding-right: 25px;
      padding-left: 25px;
    }
    &__label-text{
      font-size: 16px;
    }
  }
}
</style>
