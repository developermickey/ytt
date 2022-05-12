<template>
  <div>
    <h3>Log history</h3>
    <div class="line"></div>
    <table class="u-data-table log-table">
      <colgroup>
        <col v-for="column in columns" :key="column.value">
      </colgroup>
      <thead>
      <tr>
        <template v-for="(column, index) in columns">
          <th
              class="u-pl-13 u-text-left table-head"
              v-if="index == 0"
              :key="index"
          >{{column.text}}</th>
          <th
              v-else
              class="u-text-left table-head"
              :key="index"
          >{{column.text}}</th>
        </template>
      </tr>
      </thead>
      <tbody v-if="items && items.length">
      <tr
          v-for="item in items"
          :key="item.id"
      >
        <td class="u-pl-13">{{item.date}}</td>
        <td class="grey-col">{{item.word_count}}</td>
        <td class="grey-col">{{item.duration}}</td>
        <td class="grey-col">{{item.words_per_min ? item.words_per_min : 0}}</td>
        <td class="grey-col">{{item.teacher_name}}</td>
      </tr>
      </tbody>
      <tbody v-else>
      <tr>
        <td class="u-text-center" colspan="5">
          No data available
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { LessonsApi } from '@/api';
import { mapGetters } from 'vuex';

export default {
  name: "LessonLogHistory",
  data: () => ({
    columns: [
      {
        text: 'Data',
        value: 'data',
        breakpoint: false,
      },
      {
        text: 'Words passed',
        value: 'words_passed',
        breakpoint: false,
      },
      {
        text: 'Duration(sec)',
        value: 'duration',
        breakpoint: false,
      },
      {
        text: 'Words per min',
        value: 'words_per_min',
        breakpoint: false,
      },
      {
        text: 'Teacher',
        value: 'teacher',
        breakpoint: false,
      },
    ],
    items: [],
  }),
  computed: {
    ...mapGetters('Lessons', ['lesson']),
    ...mapGetters('Students', ['student']),
    ...mapGetters('Auth', { teacher: 'user' }),
  },
  mounted() {
    this.getLessonLogs();
  },
  methods: {
    async getLessonLogs() {
      const logs = await LessonsApi.getLessonLogs({
        student_id: this.student.id,
        teacher_id: this.teacher.id,
        lesson_id: this.lesson.id
      })

      this.items = logs.data.map( ({id, date, duration, word_count, teacher_name}) => {
        const mins = duration/60;
        const words_per_min = Math.round(word_count/mins);
        return {
          id,
          date,
          word_count,
          duration,
          words_per_min,
          teacher_name
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/vars';
h3 {
  text-align: center;
  font-size: 27px;
  font-weight: 300;
  margin: 30px;
}
.line {
  width: 100%;
  height: 3px;
  background-color: $clr-blue;
  margin-bottom: 30px;
}
.log-table {
  background: #fff;
  tr {
    border-bottom: 1px solid #e6e6e6;
  }
}
</style>
