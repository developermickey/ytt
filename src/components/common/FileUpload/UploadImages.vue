<template>
  <div
    class="container"
    @dragover.prevent="dragOver"
    @dragleave.prevent="dragLeave"
    @drop.prevent="drop($event)"
  >
    <div class="drop" v-show="dropped == 2"></div>
    <!-- Error Message -->
    <div v-show="error" class="error">
      {{ error }}
    </div>
    <!-- To inform user how to upload image -->
    
    <div class="imgsPreview" v-show="images.length > 0">
      <template v-for="(img, i) in images" >
        <div 
          class="imageHolder"
          :class="{'defaultImg': img.default}" 
          v-if="!img.delete"
          :key="img.image"
          @contextmenu.prevent="showSetDefault(i)"
        >
            <img :src="img.image" />
            <span class="delete" @click="deleteImg(i)">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="9.5" fill="white" stroke="#2C4CC1"/>
                <path d="M12.5 7.5L7.5 12.5" stroke="#2C4CC1" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.5 7.5L12.5 12.5" stroke="#2C4CC1" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <div
              v-if="showSetToDefault && imgDefaultIndex === i" 
              class="setDefault"
              @click="setDefaultImg(i)"
            >
              Set to default
            </div>
        </div>
      </template>
      
    </div>

    <div class="beforeUpload">
      <input
        type="file"
        style="z-index: 1"
        accept="image/*"
        ref="uploadInput"
        @change="previewImgs"
        multiple
      />
      <img src="@/assets/svg/upload.svg" alt="">
      <div class="mainMessage">
        {{ uploadMsg ? uploadMsg : "Drag&Drop or Upload" }}
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: "UploadImages",
  data() {
    return {
      error: "",
      files: [],
      dropped: 0,
      showSetToDefault: false,
      imgDefaultIndex: 0,
    };
  },
  props: {
    max: Number,
    uploadMsg: String,
    maxError: String,
    fileError: String,
    clearAll: String,
    images: Array,
  },
  computed: {
    ...mapGetters('Lessons', ['editLesson'])
  },
  methods: {
    dragOver() {
      this.dropped = 2;
    },
    dragLeave() {
      this.dropped = 0;
    },
    drop(e) {
      let status = true;
      let files = Array.from(e.dataTransfer.files)
      if (e && files) {
        files.forEach((file) => {
          if (file.type.startsWith("image") === false) status = false;
        });
        if (status == true) {
          if (
            this.$props.max &&
            files.length + this.files.length > this.$props.max
          ) {
            this.error = this.$props.maxError
              ? this.$props.maxError
              : `Maximum files is` + this.$props.max;
          } else {
            this.files.push(...files);
            this.previewImgs();
          }
        } else {
          this.error = this.$props.fileError
            ? this.$props.fileError
            : `Unsupported file type`;
        }
      }
      this.dropped = 0;
    },
    readAsDataURL(file) {
      return new Promise(function (resolve, reject) {
        let fr = new FileReader();
        fr.onload = function () {
          resolve(fr.result);
        };
        fr.onerror = function () {
          reject(fr);
        };
        fr.readAsDataURL(file);
      });
    },
    deleteImg(index) {
      if(this.editLesson) {
        this.images[index].delete = true;
      } else {
        this.images.splice(index, 1);
      }
      this.$refs.uploadInput.value = null;
    },
    previewImgs(event) {
      if (
        this.$props.max &&
        event &&
        event.currentTarget.files.length + this.files.length > this.$props.max
      ) {
        this.error = this.$props.maxError
          ? this.$props.maxError
          : `Maximum files is` + this.$props.max;
        return;
      }
      if (this.dropped == 0) this.files.push(...event.currentTarget.files);
      this.error = "";
      
      let readers = [];
      if (!this.files.length) return;
      for (let i = 0; i < this.files.length; i++) {
        readers.push(this.readAsDataURL(this.files[i]));
      }
      Promise.all(readers).then((values) => {
        this.$emit("changed", values);
        this.files = [];
      });
    },
    showSetDefault(index) {
      this.showSetToDefault = true;
      this.imgDefaultIndex = index
    },
    setDefaultImg(index) {
      console.log(index);
      this.images.forEach((img, index) => {
        this.images[index] === index ? img.default = true : img.default = false
      });
      this.images[index].default = true;
      this.showSetToDefault = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars';
.container {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  padding: 15px 27px;
  position: relative;
}
.drop {
  width: 100%;
  height: 100%;
  top: 0;
  border-radius: 10px;
  position: absolute;
  background-color: #f4f6ff;
  left: 0;
  border: 3px dashed #a3a8b1;
}
.error {
  text-align: center;
  color: red;
  font-size: 15px;
}
.beforeUpload {
  border: 1px dashed #939393;
  position: relative;
  text-align: center;
}
.beforeUpload input {
  width: 100%;
  margin: auto;
  height: 100%;
  opacity: 0;
  position: absolute;
  background: red;
  display: block;
}
.beforeUpload input:hover {
  cursor: pointer;
}
.imgsPreview .imageHolder {
  width: 150px;
  height: 150px;
  background: #fff;
  position: relative;
  margin: 10px 0;
  display: inline-block;
}
.imgsPreview .imageHolder img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.imgsPreview .imageHolder .delete {
  position: absolute;
  top: -12px;
  right: -9px;
  color: #fff;
}
.imgsPreview .imageHolder .delete:hover {
  cursor: pointer;
}
.imgsPreview .plus {
  text-align: center;
  border: 1px dashed #939393;
  border-radius: 5px;
}
.plus:hover {
  cursor: pointer;
}
.clearButton {
  color: #2d3748;
  position: absolute;
  top: 7px;
  right: 7px;
  background: none;
  border: none;
  cursor: pointer;
}
.defaultImg{
  border: 1px solid $clr-blue;
}
.setDefault {
    position: absolute;
    top: 50px;
    left: 1px;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.08);
    background: #fff;
    padding: 7px 20px;
    cursor: pointer;
    &:hover {
      background: $clr-blue;
      color: #fff;
    }
  }
</style>