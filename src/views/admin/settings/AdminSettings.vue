<template>
  <div>
    <div class="u-container u-ml-auto u-mr-auto u-pb-10">
      <div class="u-row">
        <div class="u-col-12">
          <u-card
            class="settings-container u-px-20 u-py-16 u-my-10"
            elevation="1"
          >
            <div class="u-flex head-wrap">
              <div class="u-text-h2 u-mr-auto head-text">Add users</div>
              <div class="settings-buttons__wrap">
                <UBtn
                  class="u-mx-2"
                  :to="{ name: 'admin-student-create' }"
                  color="primary"
                  size="x-large"
                  id="admin_create_student_link"
                >
                  Add student
                </UBtn>
                <UBtn
                  class="u-mx-2"
                  :to="{ name: 'admin-teacher-create' }"
                  color="primary"
                  size="x-large"
                  id="create_teacher_link"
                >
                  Add teacher
                </UBtn>
                <UBtn
                  class="u-mx-2"
                  :to="{ name: 'admin-school-create' }"
                  color="primary"
                  size="x-large"
                  id="create_school_link"
                >
                  Add School
                </UBtn>
              </div>
            </div>
          </u-card>
        </div>

        <div class="u-col-12">
          <UserSettings></UserSettings>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UCard from "@/components/common/UCard";

import UserSettings from "@/components/settings/UserSettings";

export default {
  components: {
    UCard,
    UserSettings,
  },
};
</script>

<style lang="scss">
@import "@/styles/mixins";

.settings-container {
  border-radius: 62px;
}

.settings-buttons__wrap {
  display: flex;
}

@include media(">phone", "<=tablet") {
  .head-wrap {
    display: flex;
    flex-direction: column;

    .head-text {
      text-align: center;
      margin-right: 0 !important;
    }
  }
  .settings-buttons__wrap {
    margin-top: 20px;
    justify-content: space-around;
    .u-mx-2 {
      height: 34px;
      width: 95px;
    }
  }
  .settings-container {
    padding: 45px 50px !important;
  }
}
</style>
