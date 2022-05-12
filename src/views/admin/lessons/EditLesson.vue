<template>
  <ValidationObserver v-slot="{ handleSubmit }">

    <div class="create-lesson u-container u-mr-auto u-ml-auto u-mt-17">
      <div class="u-row">
        <div class="u-col-12">
          <div class="u-text-h2 u-mb-6 add-title">Edit lesson</div>
        </div>

        <div class="u-col-6 input-block-create">
          <ValidationProvider rules="required" name="Name" v-slot="{ errors }">
            <UTextField
              label="Name"
              v-model="name"
              placeholder="Name"
              class="u-mb-12"
              :error="errors[0]"
            ></UTextField>
          </ValidationProvider>
          <ValidationProvider rules="required" name="Description" v-slot="{ errors }">
            <UTextField
              label="Description"
              placeholder="Description"
              v-model="description"
              class="u-mb-12"
              :error="errors[0]"
            ></UTextField>
          </ValidationProvider>

          <CsvUpload
            class="u-mb-7"
            accept=".csv"
            v-model="file"
          >
          </CsvUpload>
        </div>

        <div class="u-col-12">
          <ImportLessonTable
            :tableRows="tableRows"
            :editLesson="true"
            @updateImages="updateImages"
            @deleteRow="deleteRow"
            @addNewRow="addNewRow"
            @updateRows="updateRows"
          />
        </div>

        <div 
          class="u-col-12 u-flex is-justify-center"
          v-if="tableRows.length > 0"
        >
          <UBtn
            size="x-large"
            color="primary"
            @click="handleSubmit(updateLesson)"
            id="lesson_create_submit"
            :loading="loading"
            width="300"
          >
            Save
          </UBtn>
        </div>
      </div>
    </div>
  </ValidationObserver>
</template>


<script>
// import { LessonsApi, UsersApi } from "@/api";
import {mapMutations,mapActions, mapGetters} from 'vuex';
import axios from 'axios';
import { ROLE_MAP } from '@/constants/roles';
import CsvUpload from "@/components/common/FileUpload/CsvUpload.vue";
import TeacherList from "@/components/teacher/TeacherList.vue";
import UTextField from "@/components/common/UTextField";
import ImportLessonTable from "@/components/lessons/ImportLessonTable";


export default {
  data: () => ({
    name: "",
    description: "",
    teachers: [],
    file: null,
    parsedCsv: null,
    tableRows: [],
    validateTable: false,
    isTableValid: false,
  }),
  components: {
    CsvUpload,
    TeacherList,
    UTextField,
    ImportLessonTable,
  },
  computed: {
    ...mapGetters('Lessons', ['lesson', 'loading', 'editLesson']),
    ...mapGetters('Auth', ['userRole']),
  },
  watch: {
    file(newVal) {
      this.readFile();
    },
    tableRows: {
      handler(){
        if(this.validateTable) {
          this.validateTableRows();
        }
      },
      deep: true,
    }
  },
  mounted() {
    this.fetchLesson({
      id: this.$route.params.id,
    }).then( res => {
      this.name = res.data.title;
      this.description = res.data.description;
      this.teachers = res.data.teachers;
      this.setTableRowsFromApi(res.data.words);
    });
    this.SET_EDIT_LESSON();
  },
  beforeDestroy() {
    this.RESET_LESSON();
    this.RESET_EDIT_LESSON();
  },
  methods: {
    ...mapMutations('Lessons', ['RESET_LESSON', 'SET_EDIT_LESSON', 'RESET_EDIT_LESSON']),
    async fetchLesson( {id} ) {
      return await axios.get(`/admin/lessons/${id}`)
    },
    async sendLesson( {id}, data ) {
      return await axios.put(`/admin/lessons/${id}`, data)
    },
    async readFile() {
      await this.$papa.parse(this.file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
          return this.stageUploadedCsv(results);
        },
      });
    },
    stageUploadedCsv(results) {
      this.parsedCsv = results.data;
      this.addTableRows();
    },
    setTableRowsFromApi(words) {
      this.tableRows = words.map(word => {
      return {
        id: word.id,
        delete: false,
        order: word.serial,
        word: {
          isValid: true,
          value: word.word,
        },
        translations: {
            isValid: true,
            values: word.all_translations.map( translation => {
              return {
                id: translation.id,
                eng: translation.eng,
                default: translation.default,
                delete: false,
              }
            })
          },
        quote: {
          isValid: true,
          value: word.quote
        },
        images: {
          isValid: true,
          values: word.all_images.map( img => {
            return {
              id: img.id,
              image: img.image,
              default: img.default,
              delete: false,
            }
          })
        }
      }
    })
    },
    addTableRows() {
      const tableRowsLength = this.tableRows.length
      const rowOrder = tableRowsLength > 0 ? this.tableRows[tableRowsLength -1].order + 1 : 1;

      const newRows = this.parsedCsv.map((row, index) => {
        return {
          id: '',
          delete: false,
          order: index + rowOrder,
          word: {
            isValid: true,
            value: row["Hebrew Word"],
          },
          translations: {
            isValid: true,
            values: [
              { 
                id: '',
                eng: row["Translation"],
                default: true,
                delete: false,
              },
            ],
          },
          quote: {
            isValid: true,
            value: row["Quote"],
          },
          images: {
            isValid: true,
            values: [],
          },
        }
      });

      this.tableRows.push(...newRows);
      console.log(this.tableRows)
    },
    updateRows(arr) {
      this.tableRows = arr;
    },
    updateImages(rowOrder, images) {
      let index = this.tableRows.findIndex(row => row.order === rowOrder);
      images.forEach(file => {
        this.tableRows[index].images.values.push({ id: '', delete: false, image: file, default: false});
      });
    },
    deleteRow(rowOrder) {
      let index = this.tableRows.findIndex(row => row.order === rowOrder)
      this.tableRows[index].delete = true;
    },
    addNewRow(row) {
      this.tableRows.push(row);
    },
    validateTableRows() {
      this.tableRows.forEach(row => {
        row.word.isValid = true;
        row.translations.isValid = true;
        row.quote.isValid = true;
        row.images.isValid = true;
        // if(!row.word.value) {
        //   row.word.isValid = false;
        // } else {
        //   row.word.isValid = true;
        // }

        // if(!row.translations.values.length > 0) {
        //   row.translations.isValid = false;
        // } else {
        //   row.translations.isValid = true;
        // }

        // if(!row.quote.value) {
        //   row.quote.isValid = false;
        // } else {
        //   row.quote.isValid = true;
        // }

        // if(!row.images.values.length > 0) {
        //   row.images.isValid = false;
        // } else {
        //   row.images.isValid = true;
        // }
      });

      this.isTableValid = this.tableRows.every( row => {
        return row.word.isValid && 
              row.translations.isValid && 
              row.quote.isValid && 
              row.images.isValid ? true : false;
      })
    },
    collectPostData() {
      const data = this.tableRows.map( (row, index) => {
        return {
          id: row.id,
          index: index + 1,
          delete: row. delete,
          word: row.word.value,
          translations: row.translations.values,
          quote: row.quote.value,
          images: row.images.values,
        }
      })

      let postData = {
        title: this.name,
        description: this.description,
        teachers: this.teachers.map((item) => item.id),
        words: data,
      };

      return postData;
    },
    updateLesson() {

      this.validateTable = true;
      this.validateTableRows();

      if(!this.isTableValid) {
        return
      }

      console.log(this.collectPostData())
       
      this.$notify({
        title: 'Please wait',
        text: 'Lesson is uploading. This might take several minutes.',
        type: 'warn'
      });
      let postData = this.collectPostData();

      this.sendLesson({
        role: this.userRole,
        id: this.$route.params.id,
      }, postData).then(() => {
        // this.$router.push({ name: 'admin-lessons-all' });
        this.fetchLesson({
          id: this.$route.params.id,
        }).then( res => {
          this.name = res.data.title;
          this.description = res.data.description;
          this.teachers = res.data.teachers;
          this.setTableRowsFromApi(res.data.words);
        });
        this.SET_EDIT_LESSON();
        
        this.$notify({
          title: 'Lesson successfully updatetd!',
          type: 'success'
        });
      })
      .catch(({ message }) => {
        this.$notify({
          title: 'Lesson updating error',
          text: message,
          type: 'error'
        });
      });
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/mixins";
.create-lesson{
  &__teacher-list-label{
    font-weight: 300;
    font-size: 30px;
    line-height: 45px;
    margin-bottom: 17px;
  }
}
@include media(">phone", "<=tablet") {
    .input-block-create{
      max-width: unset;
      flex: auto;
    }
  .create-lesson__teacher-list-label{
    font-size: 22px;
    line-height: 26px;
  }
  .add-title{
    padding-top: 30px;
  }
}
</style>
