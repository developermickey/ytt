<template>
  <div>
    <div class="u-container u-ml-auto u-mr-auto u-pt-15">
      <div class="u-row">
        <div class="u-col-7">
          <div class="u-flex is-align-center">
            <div class="u-text-h1 u-mr-6 list-head">Lessons</div>

          </div>
        </div>
        <div class="u-col-5">
          <!-- search -->
        </div>
        <div class="u-col-12 list-wrap">
          <u-card class="table-card u-mt-10 u-mb-20">
            <table class="u-data-table is-striped">
              <colgroup>
                <col v-for="column in columns" :key="column.value">
              </colgroup>
              <thead>
              <tr class="table-row">
                <template v-for="(column, index) in columns">
                  <th
                      v-if="index == 1"
                      :key="index"
                      class="u-text-center head"
                  >{{column.text}}</th>
                  <th
                      v-else
                      :key="index"

                      class="table--head head"
                  >{{column.text}}</th>
                </template>
              </tr>
              </thead>
              <tbody>
              <tr
                v-for="item in lessonsList"
                :key="item.id"
                @click="onClickLessonRow(item)"
              >
                <td class="u-pl-13 u-font-weight-light">
                  <svg
                      v-svg
                      symbol="icon-file"
                      size="0 0 22 22"
                      role="presentation"
                  ></svg>
                  {{item.title}}
                </td>
                <td class="u-font-weight-light u-text-center pages-col">{{item.words_count}} pages</td>
                <td class="u-text-right u-pr-25 buttons-wrap">
                  <UBtn
                      v-if="['in_progress', 'new'].includes(item.status)"
                      color="blue"
                      width="180"
                      class="button-status"
                      @click="goToPassLesson(item, $event)"
                  >
                    Pass
                  </UBtn>
                  <UBtn
                      width="180"
                      color="success"
                      outlined

                      class="button-status"
                      @click="goToPassLesson(item, $event)"
                      v-if="item.status === 'completed'"
                  >
                    Passed
                  </UBtn>
                  <UBtn
                    v-if="item.status === 'in_review'"
                    color="warning"
                    outlined
                    width="180"

                    class="button-status"
                    @click="viewLesson(item.id)"
                  >
                    In review
                  </UBtn>
                </td>
              </tr>
              </tbody>
            </table>
          </u-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { STUDENT } from '@/constants/roles';
import UCard from '@/components/common/UCard';



export default {
  components: {
    UCard
  },
  data: () => ({
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
  computed: {
    ...mapGetters('Lessons', ['lessonsList'])
  },
  methods: {
    ...mapActions('Lessons', ['fetchLessonList']),
    ...mapMutations('Lessons', ['RESET_LESSONS_LIST']),
    onClickLessonRow(lesson) {
      if(!['in_progress', 'new'].includes(lesson.status)) {
        this.viewLesson(lesson);
      } else {
        this.goToPassLesson(lesson, null);
      }
    },
    viewLesson(lesson){
      this.$router.push({name: 'student-view-lesson', params: {id: lesson.id}});
    },
    goToPassLesson(lesson, event){
      if(event !== null) {
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
      this.$router.push({ name: 'student-pass-lesson', params: { id: lesson.id } });
    },

  },
  mounted(){
    this.fetchLessonList(STUDENT);
  },
  beforeDestroy() {
    this.RESET_LESSONS_LIST();
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars';
@import '@/styles/mixins';

tr:hover .pages-col{
  color: #fff;
}
.pages-col{
  color: $clr-grey;
}

table{
  tbody{
    tr{
      cursor: pointer;
      td{
        &:hover{
          button.u-btn_color_blue{
            border: 1px solid white;
          }
        }
      }
    }
  }
}
@include media(">phone", "<=tablet") {
  .list-head{
    padding-top: 40px;
  }
  .list-wrap{
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
  .buttons-wrap{
    .button-status{
      width: 95px;
      font-size: 10px;
      height: 28px;
      margin: 2px 0;
      padding: 0 5px;
    }
  }
}
</style>
