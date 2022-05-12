<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <div class="create-lesson u-container u-mr-auto u-ml-auto u-mt-17">
      <div class="u-row">
        <div class="u-col-12">
          <div class="u-text-h2 u-mb-6 add-title">Add new lesson</div>
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

          <ValidationProvider rules="required" name="Csv" v-slot="{ errors }">
            <CsvUpload
              class="u-mb-7"
              accept=".csv"
              v-model="file"
              :error="errors[0]"
            >
            </CsvUpload>
          </ValidationProvider>
        </div>
        <div class="u-col-6">
          <div class="create-lesson__teacher-list-label">To teachers</div>
          <TeacherList
            @input="onSelectTeachers"
            :value="teachers"
          >
          </TeacherList>
        </div>

        <div class="u-col-12">
          <ImportLessonTable
            :tableRows="tableRows"
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
            @click="handleSubmit(createSingle)"
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
import {mapActions, mapGetters} from 'vuex';

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
    ...mapGetters('Lessons', ['loading']),
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
  methods: {
    ...mapActions('Lessons', {
      create : 'createLesson'
    }),
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
    addTableRows() {
      const tableRowsLength = this.tableRows.length
      const rowOrder = tableRowsLength > 0 ? this.tableRows[tableRowsLength -1].order + 1 : 1;

      const newRows = this.parsedCsv.map((row, index) => {
        return {
          order: index + rowOrder,
          word: {
            isValid: true,
            value: row["Hebrew Word"],
          },
          translations: {
            isValid: true,
            values: [
              { 
                eng: row["Translation"],
                default: true,
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
    },
    updateRows(arr) {
      this.tableRows = arr;
    },
    updateImages(rowOrder, images) {
      let index = this.tableRows.findIndex(row => row.order === rowOrder);
      images.forEach(file => {
        this.tableRows[index].images.values.push({ image: file, default: false});
      });
    },
    deleteRow(rowOrder) {
      let index = this.tableRows.findIndex(row => row.order === rowOrder)
      this.tableRows.splice(index, 1);
    },
    addNewRow(row) {
      this.tableRows.push(row);
    },
    validateTableRows() {
      this.tableRows.forEach(row => {
        if(!row.word.value) {
          row.word.isValid = false;
        } else {
          row.word.isValid = true;
        }

        if(!row.translations.values.length > 0) {
          row.translations.isValid = false;
        } else {
          row.translations.isValid = true;
        }

        if(!row.quote.value) {
          row.quote.isValid = false;
        } else {
          row.quote.isValid = true;
        }

        if(!row.images.values.length > 0) {
          row.images.isValid = false;
        } else {
          row.images.isValid = true;
        }
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
          index: index + 1,
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
    createSingle() {

      this.validateTable = true;
      this.validateTableRows();

      if(!this.isTableValid) {
        return
      }
      
      this.$notify({
        title: 'Please wait',
        text: 'Lesson is uploading. This might take several minutes.',
        type: 'warn'
      });
      let postData = this.collectPostData();

      this.create(postData)
      .then(() => {
        this.$router.push({ name: 'admin-lessons-all' });
        this.$notify({
          title: 'Lesson successfully created!',
          type: 'success'
        });
      })
      .catch(({ message }) => {
        this.$notify({
          title: 'Lesson creation error',
          text: message,
          type: 'error'
        });
      });
    },
    onSelectTeachers(value) {
      this.teachers = value;
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
