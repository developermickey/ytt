<template>
  <div class="u-container u-ml-auto u-mr-auto u-pt-15">
    <div class="u-row">
      <div class="u-col-7">
        <div class="u-flex is-align-center">
          <div class="u-text-h1 u-mr-6 users-title">Users</div>
        </div>
      </div>
      <div class="u-col-5 search-box">
        <u-text-field
          placeholder="Search"
          v-model="searchQuery"
          @input="handleSearch"
        >
        </u-text-field>
      </div>
      <div class="u-col-12 u-mb-20 list-wrap">
        <u-tabs class="users-tabs" v-model="currentTab">
          <u-tab label="Teachers">
            <TeachersList></TeachersList>
          </u-tab>
          <u-tab label="Students">
            <StudentsList v-if="currentTab === 1"></StudentsList>
          </u-tab>
        </u-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { LessonsApi } from "@/api";
import { debounce } from "@/helpers/debounce";
import UTabs from "@/components/common/UTabsIndepended/UTabs";
import UTab from "@/components/common/UTabsIndepended/UTab";
import TeachersList from "@/components/school/users/TeachersList";
import StudentsList from "@/components/school/users/StudentsList";
import UTextField from "@/components/common/UTextField";
import { mapMutations } from "vuex";

export default {
  components: {
    UTabs,
    UTab,
    UTextField,
    TeachersList,
    StudentsList,
  },
  data: () => ({
    data: [],
    currentTab: 0,
    searchQuery: "",
  }),
  computed: {},
  watch: {
    currentTab() {
      this.searchQuery = "";
      this.searchFilter();
    },
  },
  methods: {
    ...mapMutations("Teachers", ["FILTER_TEACHER_LIST"]),
    ...mapMutations("Students", ["FILTER_STUDENTS_LIST"]),
    getItems() {
      LessonsApi.getPage((response) => {
        console.log(response);
      });
    },
    searchFilter() {
      if (this.currentTab === 0) {
        this.FILTER_TEACHER_LIST(this.searchQuery);
      }
      if (this.currentTab === 1) {
        this.FILTER_STUDENTS_LIST(this.searchQuery);
      }
    },
    handleSearch: debounce(function() {
      this.searchFilter();
    }, 300),
  },
  mounted() {},
};
</script>

<style lang="scss">
.search-box {
  .u-text-field__input-wrap {
    &:before {
      display: none;
    }
  }
  .u-text-field input {
    background: url("~@/assets/svg/search.svg") no-repeat 15px center #fff;
    background-size: 17px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 50px;
    padding: 2px 20px 0 45px;
  }
}
</style>

<style lang="scss" scoped>
@import "@/styles/vars";
@import "@/styles/mixins";

tr:hover .pages-col {
  color: #fff;
}
.pages-col {
  color: $clr-grey;
}

.users-tabs::v-deep {
  .u-tabs__header {
    margin-bottom: 40px;
  }
}
@include media(">phone", "<=tablet") {
  .users-title {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .list-wrap {
    padding: 0;
  }
}
</style>
