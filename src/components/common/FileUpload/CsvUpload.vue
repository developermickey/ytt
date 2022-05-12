<template>
  <div
    class="file-upload"
    :class="classes"
  >
    <div class="file-upload__row">
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
                Add CSV
              </span>
            </div>
          </slot>
        </template>
        <div v-else class="file-upload__label-inner">
          <span class="file-upload__label-text">
            {{compFilename}}
          </span>
        </div>
      </label>
      <div
        class="file-upload__label-inner download"
        @click="downloadCSV"
      >
        Download sample.csv
      </div>
    </div>

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
  props: {
    value: {
      type: [Object, Array, File, String],
      default: () => null,
    },
    accept: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    sampleCsv: [
      { 
        'Hebrew Word': 'אֶ֖רֶץ', 
        'Translation': 'land', 
        'Quote': 'וַיֵּ֣שֶׁב יַֽעֲקֹ֔ב בְּאֶ֖רֶץ מְגוּרֵ֣י אָבִ֑יו בְּאֶ֖רֶץ כְּנָֽעַן' 
      },
    ]
  }),
  computed: {
    classes(){
      return {
        'file-upload_value_none' : !this.hasValue,
      };
    },
    hasValue(){
      return this.value !== null;
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
      this.$emit('input', event.target.files[0]);
    },
    downloadCSV: function(){
      let csv = '\ufeff' + 'Hebrew Word,Translation,Quote\n'
      this.sampleCsv.forEach(el => {
        let line = el['Hebrew Word'] + ',' + el['Translation'] + ',' + el['Quote'] + '\n'
        csv += line
      })
      let blob = new Blob([ csv ], { "type" : "csv/plain" });
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'sample.csv'
      link.click()
    }
  },

}
</script>

<style lang="scss">
@import '@/styles/vars';
@import '@/styles/mixins';

.file-upload{
  &__row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
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
    border: 1px solid #2C4CC1;
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
}
.download {
  padding: 0 30px !important;
  text-align: center;
  cursor: pointer;
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
