<template>
  <div>

    <div class="u-container u-ml-auto u-mr-auto u-pt-15">
      <div class="u-row">
        <div class="u-col-7">
          <div class="u-flex is-align-center">
            <div class="u-text-h1 u-mr-6">Lessons</div>
          </div>
        </div>
        <div class="u-col-5">
          <!-- search -->
        </div>
        <div class="u-col-12">
          <u-card class="table-card u-mt-10 u-mb-20">
            <table class="u-data-table is-striped">
              <colgroup>
                <col v-for="column in columns" :key="column.value">
              </colgroup>
              <thead>
              <tr class="table--row">
                <template v-for="(column, index) in columns">
                  <th
                      v-if="index == 1"
                      :key="index"
                      class="u-text-center head"
                  >{{ column.text }}
                  </th>
                  <th
                      v-else
                      :key="index"
                      class="table--head head"
                  >{{ column.text }}
                  </th>
                </template>
              </tr>
              </thead>
              <tbody>
              <tr class="table--row" v-for="item in items" :key="item.id">
                <td class="u-pl-13 u-font-weight-light">
                  <svg
                      v-svg
                      symbol="icon-file"
                      size="0 0 22 22"
                      role="presentation"
                  ></svg>
                  {{ item.title }}
                </td>
                <td class="u-font-weight-light u-text-center pages-col">{{ item.words_count }} pages</td>
                <td class="u-text-right u-pr-25">
                  <UBtn
                      class="u-mr-2 button--view"
                      :to="{ name: 'teacher-lessons-view', params: { id: item.id }}"
                  >
                    View lesson
                  </UBtn>
                  <UBtn
                      id="select_student_modal_open"
                      class="select--student"
                      @click="openSelectStudentModal(item)"
                  >
                    Add to student
                  </UBtn>
                </td>
              </tr>
              </tbody>
            </table>
          </u-card>
        </div>
      </div>
    </div>

    <SelectStudent
        v-model="selectedStudents"
        @save="shareLessonToStudent"
        multiple
    ></SelectStudent>
  </div>
</template>

<script>
import {LessonsApi} from '@/api';
import {mapActions, mapMutations} from 'vuex';
import UCard from '@/components/common/UCard';

import SelectStudent from '@/components/modals/SelectStudent';


export default {
  components: {
    UCard,
    SelectStudent,
  },
  data: () => ({
    items: [{"id":34,"title":"Chumash 2","description":"English","url":"https://api.yourtorahtutors.com/storage/lessons/34/pdf/AC5pI62vCgDDeFXIbsyzFhym1u9A6W.pdf","path":"public/lessons/34/pdf/AC5pI62vCgDDeFXIbsyzFhym1u9A6W.pdf","hidden":0,"created_at":"2020-12-10T10:31:36.000000Z","updated_at":"2020-12-10T10:31:36.000000Z","words_count":315,"status":"new","last_word":null,"students":[{"id":3,"pivot":{"lesson_id":34,"user_id":3}},{"id":4,"pivot":{"lesson_id":34,"user_id":4}},{"id":12,"pivot":{"lesson_id":34,"user_id":12}},{"id":25,"pivot":{"lesson_id":34,"user_id":25}},{"id":38,"pivot":{"lesson_id":34,"user_id":38}},{"id":39,"pivot":{"lesson_id":34,"user_id":39}},{"id":58,"pivot":{"lesson_id":34,"user_id":58}},{"id":62,"pivot":{"lesson_id":34,"user_id":62}}]},{"id":41,"title":"Gemara 1","description":"english","url":"https://api.yourtorahtutors.com/storage/lessons/41/pdf/46shBEg4EdfcjCjMwiLpUnIejOcFFF.pdf","path":"public/lessons/41/pdf/46shBEg4EdfcjCjMwiLpUnIejOcFFF.pdf","hidden":0,"created_at":"2020-12-24T20:04:16.000000Z","updated_at":"2020-12-24T20:04:16.000000Z","words_count":259,"status":"new","last_word":null,"students":[{"id":32,"pivot":{"lesson_id":41,"user_id":32}},{"id":46,"pivot":{"lesson_id":41,"user_id":46}},{"id":49,"pivot":{"lesson_id":41,"user_id":49}},{"id":50,"pivot":{"lesson_id":41,"user_id":50}},{"id":58,"pivot":{"lesson_id":41,"user_id":58}}]},{"id":42,"title":"Chumash 1 Yiddish","description":"yiddish","url":"https://api.yourtorahtutors.com/storage/lessons/42/pdf/Bc0hrpf0ZoCjfT8cdy2wgA8li434sE.pdf","path":"public/lessons/42/pdf/Bc0hrpf0ZoCjfT8cdy2wgA8li434sE.pdf","hidden":0,"created_at":"2020-12-27T20:47:56.000000Z","updated_at":"2020-12-27T20:47:56.000000Z","words_count":231,"status":"new","last_word":null,"students":[{"id":4,"pivot":{"lesson_id":42,"user_id":4}},{"id":44,"pivot":{"lesson_id":42,"user_id":44}},{"id":54,"pivot":{"lesson_id":42,"user_id":54}}]},{"id":44,"title":"Chumash  one","description":"English","url":"https://api.yourtorahtutors.com/storage/lessons/44/pdf/Aao6WHKippCsO7R1QxK6aZkFdKwlox.pdf","path":"public/lessons/44/pdf/Aao6WHKippCsO7R1QxK6aZkFdKwlox.pdf","hidden":0,"created_at":"2021-01-06T19:56:28.000000Z","updated_at":"2021-01-06T19:56:28.000000Z","words_count":231,"status":"new","last_word":null,"students":[{"id":3,"pivot":{"lesson_id":44,"user_id":3}},{"id":4,"pivot":{"lesson_id":44,"user_id":4}},{"id":12,"pivot":{"lesson_id":44,"user_id":12}},{"id":38,"pivot":{"lesson_id":44,"user_id":38}},{"id":58,"pivot":{"lesson_id":44,"user_id":58}},{"id":62,"pivot":{"lesson_id":44,"user_id":62}}]}],
    selectedStudents: [],
    selectedLesson: null,
    columns: [
      {
        text: 'Name',
        value: 'name',
        breakpoint: false,
      },
      {
        text: 'Lessons',
        value: 'pages',
        breakpoint: false,
      },
      {
        text: '',
        value: 'actions',
        breakpoint: false,
      },
    ],
  }),
  computed: {},
  methods: {
    ...mapActions('Lessons', ['addAccessForStudents']),
    ...mapMutations('Lessons', ['RESET_LESSONS_LIST']),
    getItems() {
      LessonsApi.getPage({}, 'teacher').then(response => {
        this.items = response.data;
      });
    },
    shareLessonToStudent() {
      this.addAccessForStudents({
        lessonId: this.selectedLesson.id,
        students: this.selectedStudents.map(e => e.id),
      }).then(() => {
        this.$notify({
          title: 'Lesson saved',
          type: 'success'
        });
      }).catch(({message}) => {
        this.$notify({
          title: 'Error',
          text: message,
          type: 'error'
        });
      })

    },
    openSelectStudentModal(lesson) {

      this.selectedLesson = lesson;
      this.selectedStudents = [...lesson.students];
      this.$modal.show('select-student');
    },
  },
  mounted() {
    this.getItems();
  },
  beforeDestroy() {
    this.RESET_LESSONS_LIST();
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars';
@import '@/styles/mixins';

tr:hover .pages-col {
  color: #fff;
}

.pages-col {
  color: $clr-grey;
}

@include media(">phone", "<=tablet") {
  .select--student,.button--view{
    width: 95px;
    font-size: 10px;
    height: 28px;
    margin: 2px 0;
    padding: 0 5px;

  }
  .select--student{
    margin-right: 5px;
  }
  .u-col-12 {
    padding: 0;
  }
  .u-text-h1 {
    font-size: 26px !important;
    margin-top: 20px;
    margin-bottom: 14px;
  }
  .table-card.u-mt-10 {
    margin-top: 0 !important;
  }
  .u-data-table .u-pl-13 {
    height: 38px;
    font-size: 10px;
    padding-left: 15px !important;
    display: flex;
    align-items: center;
    .icon{
      margin-right: 8px;
    }
  }
  .table--head {
    margin-left: 39px;
  }
  .table--head, .u-text-center {
    font-size: 10px;
    padding-top: 13px;
    padding-bottom: 7px;
    &.head{
      border-bottom: 1px solid rgb(0 0 0 / 3%);
    }

  }
  .pages-col{
    padding: 0;
    font-size: 9px;
  }
  .u-text-right.u-pr-25{
    text-align: center;
    padding-right: 5px!important;
  }
  .u-data-table td{
    padding: 0;
  }
  .table--row{
    vertical-align: middle;
  }
}
</style>
