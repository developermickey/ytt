<template>
  <div class="u-container u-ml-auto u-mr-auto u-pt-15">
    <div v-if="loading">
      <Loader class="loader" :show="loading" :fixedPosition="false" />
    </div>
    <u-card elevation="3">
      <table v-if="!loading" class="u-data-table ">
        <thead>
          <tr>
            <template v-for="(column, index) in columns">
              <th class="text-center px-2 py-4" :key="index">
                {{ column.text }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody v-if="schoolList && schoolList.length">
          <tr v-for="item in schoolList" class="text-center" :key="item.id">
            <td class="">{{ item.name }}</td>
            <td class="">{{ item.city }}</td>
            <td class="">{{ item.principal_name }}</td>
            <td class="">{{ item.email }}</td>
            <td class="">
              <div v-for="(i, index) in item.assigned_teacher" :key="index">
                <p class="mx-4">{{ i.name }}</p>
              </div>
            </td>
            <td class="">
              <div class=" d-flex justify-content-center">
                <UIconBtn
                  class="u-mx-1 qa-delete-teacher-btn"
                  icon="icon-pencil"
                  icon-color="grey"
                  icon-hover-color="blue"
                  bg-hover-color="white"
                  hoverable
                  @click.native="viewSchool(item)"
                >
                </UIconBtn>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td class="u-text-center" colspan="4">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </u-card>
  </div>
</template>

<script>
import UCard from "@/components/common/UCard";
import UIconBtn from "@/components/common/UIconBtn";
import Loader from "@/components/Loader";

export default {
  components: {
    UCard,
    // SelectLesson,
    UIconBtn,
    Loader,
  },
  data: () => ({
    orderList: [],
    columns: [
      {
        text: "School Name",
      },
      {
        text: "Location",
      },
      {
        text: "Principle Name",
      },
      {
        text: "Principal Email",
      },
      {
        text: "Assignrd Teacher",
      },
      {
        text: "View",
        value: "actions",
      },
    ],
  }),

  methods: {
    viewSchool(item) {
      this.$router.push({
        name: "admin-school-create",
        query: { id: item.id },
      });
      // this.$router.push({ to: `/create-school`, query: item.id });
    },
  },
  async mounted() {
    let self = this;
    await self.$store.dispatch("School/fetchSchoolList");
  },
  computed: {
    schoolList() {
      return this.$store.getters["School/schoolList"];
    },
    loading() {
      return this.$store.getters["School/loading"];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars";

.avatar-wrap {
  border-radius: 50%;
  overflow: hidden;
  width: 40px;
  height: 40px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

tbody tr:hover {
  color: #fff;
}
.grey-col {
  color: $clr-grey;
}

.edit-user-btn {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
  svg {
    width: 18px;
    height: 18px;
  }
  &:hover {
    background-color: #fff;
    svg {
      fill: $clr-blue;
    }
  }
}
.actions-col {
  display: flex;
  justify-content: flex-end;
}

.login-as-icon-btn {
  position: relative;
  left: -2px;
}
.loader {
  position: inherit !important;
}
</style>
