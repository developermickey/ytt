<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th style="width: 70px;"></th>
          <th scope="col" style="width: 70px;">#</th>
          <th scope="col" style="width: 20%;">Hebrew</th>
          <th scope="col" style="width: 20%;">Translations</th>
          <th scope="col" >Quote</th>
          <th scope="col" style="width: 240px;">Image</th>
          <th scope="col" style="width: 70px;">Actions</th>
        </tr>
      </thead>
      <draggable 
        :list="tableRows"
        @input="updateRows"
        tag="tbody" 
        handle=".table__drag-icon"
      >
          <LessonTableRow 
            v-for="(row, index) in tableRows" 
            :key="row.order" 
            :row="row"
            :rowIndex="index"
            @updateImages="updateImages"
            @deleteRow="deleteRow"
          />
      </draggable>
      <AddLessonTableRow 
        v-if="showAddRow"
        :tableRows="tableRows"
        @addNewRow="addNewRow"
      />
    </table>
    <div 
      class="add-row-btn u-col-12 u-flex is-justify-center"
      @click="showAddRow = true"
    >
      + Add row
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import LessonTableRow from "@/components/lessons/LessonTableRow";
import AddLessonTableRow from "@/components/lessons/AddLessonTableRow";
export default {
  name: 'ImportLessonTable',
  components: {
    draggable,
    LessonTableRow,
    AddLessonTableRow
  },
  props: {
    tableRows: {
      type: Array,
      default: () => null,
    }
  },
  data: () => ({
    drag: false,
    showAddRow: false,
  }),
  methods: {
    updateImages(rowOrder, images) {
      this.$emit("updateImages", rowOrder, images);
    },
    deleteRow(order) {
      this.$emit("deleteRow", order);
    },
    addNewRow(row) {
      this.$emit("addNewRow", row);
      this.showAddRow = false;
    },
    updateRows(newArr) {
      this.$emit('updateRows', newArr);
    }
  }
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
}
.add-row-btn{
  background-color: $clr-primary;
  color: #fff;
  font-weight: bold;
  padding: 16px;
  margin-bottom: 30px;
  cursor: pointer;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>