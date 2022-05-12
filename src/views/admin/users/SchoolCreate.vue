<template>
  <div>
    <div v-if="loading">
      <Loader class="loader" :show="loading" :fixedPosition="false" />
    </div>
    <div v-else>
      <ValidationObserver v-slot="{ handleSubmit }">
        <div class="u-flex is-flex-column u-flex-grow u-pb-25 screen-container">
          <div class="u-container u-mr-auto u-ml-auto">
            <div class="u-row">
              <div class="head">
                <div class="u-text-h2 u-mb-10 u-mt-10 head-title">
                  Add School
                </div>
                <!-- <UBtn
              class="head-btn"
              :to="{ name: 'admin-teacher-invite' }"
              color="blue"
              >Add via Principal Email invite</UBtn
            > -->
              </div>
            </div>
            <div class="u-row create-wrap">
              <div class="u-col-6 u-mb-8 create-item">
                <ValidationProvider
                  rules="required"
                  name="School Name"
                  v-slot="{ errors }"
                >
                  <u-text-field
                    label="School Name"
                    placeholder="School Name"
                    v-model.trim="school.name"
                    :error="errors[0]"
                  >
                  </u-text-field>
                </ValidationProvider>
              </div>
              <div class="u-col-6 u-mb-8 create-item">
                <ValidationProvider
                  rules="required"
                  name="Principle Name"
                  v-slot="{ errors }"
                >
                  <u-text-field
                    label="Principle Name"
                    placeholder="Principle Name"
                    v-model.trim="school.principle_name"
                    :error="errors[0]"
                  >
                  </u-text-field>
                </ValidationProvider>
              </div>
              <div class="u-col-6 u-mb-8 create-item">
                <ValidationProvider
                  rules="required"
                  name="School Phone Number"
                  v-slot="{ errors }"
                >
                  <u-text-field
                    label="School Phone Number"
                    placeholder="School Phone Number"
                    v-model.trim="school.phone"
                    :error="errors[0]"
                  >
                  </u-text-field>
                </ValidationProvider>
              </div>
              <div class="u-col-6 u-mb-8 create-item">
                <ValidationProvider
                  rules="required"
                  name="Principal Contact Number"
                  v-slot="{ errors }"
                >
                  <u-text-field
                    label="Principal Contact Number"
                    placeholder="Principal Contact Number"
                    v-model.trim="school.principal_phone"
                    :error="errors[0]"
                  >
                  </u-text-field>
                </ValidationProvider>
              </div>
              <div class="u-col-6 u-mb-8 create-item">
                <ValidationProvider
                  rules="required|email"
                  name="Principal Email"
                  v-slot="{ errors }"
                >
                  <u-text-field
                    label="Principal Email"
                    placeholder="Principal Email"
                    v-model="school.email"
                    :error="errors[0]"
                  >
                  </u-text-field>
                </ValidationProvider>
              </div>

              <div class="u-col-6 u-mb-8 create-item">
                <ValidationProvider
                  rules="required"
                  name="City"
                  v-slot="{ errors }"
                >
                  <u-text-field
                    label="City"
                    placeholder="City"
                    v-model="school.city"
                    :error="errors[0]"
                  >
                  </u-text-field>
                </ValidationProvider>
              </div>
              <div class="u-col-6 u-mb-8 create-item">
                <ValidationProvider
                  rules="min:6|max:20|required"
                  name="Password"
                  v-slot="{ errors }"
                >
                  <u-text-field
                    label="Password"
                    placeholder="Password"
                    type="password"
                    v-model="school.password"
                    :error="errors[0]"
                  >
                  </u-text-field>
                </ValidationProvider>
              </div>
              <div class="u-col-6 u-mb-8 create-item">
                <ValidationProvider
                  rules="min:6|max:20|required|confirmed:Password"
                  name="Repeat password"
                  v-slot="{ errors }"
                >
                  <u-text-field
                    label="Repeat password"
                    placeholder="Repeat password"
                    type="password"
                    v-model="school.password_confirmation"
                    :error="errors[0]"
                  >
                  </u-text-field>
                </ValidationProvider>
              </div>
              <div class="u-col-6 u-mb-8 create-item">
                {{ school.assigned_teacher }}
                <label for="teacher">Select Teacher</label>
                <multiselect
                  v-model="assigned_teacher"
                  :options="teacherList === null ? [] : teacherList"
                  :close-on-select="false"
                  label="name"
                  :track-by="'id'"
                  placeholder="Select Teacher"
                  :multiple="true"
                  :value="'id'"
                  :option-height="500"
                ></multiselect>
              </div>
              <div class="u-col-6 avatar-block">
                <label>Avatar</label>
                <file-upload v-model="school.avatar" accept="image/*">
                  <template v-slot:default-label>
                    <UBtn
                      size="large"
                      color="primary"
                      tag="div"
                      class="add-photo"
                    >
                      Add photo
                    </UBtn>
                  </template>
                </file-upload>
              </div>
            </div>
          </div>
          <div class="u-flex is-justify-center mt-5">
            <UBtn
              class="save-button"
              size="x-large"
              color="primary"
              @click="handleSubmit(submit)"
              id="create_school_submit"
              width="320"
              :loading="loading"
            >
              Save
            </UBtn>
          </div>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import UTextField from "@/components/common/UTextField";
import FileUpload from "@/components/common/FileUpload/FileUpload";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import { ADMIN } from "@/constants/roles";
import { mapActions, mapGetters } from "vuex";
import Multiselect from "vue-multiselect";
import Loader from "@/components/Loader";
import axios from "axios";
extend("required", {
  ...required,
  message: `{_field_} is required`,
});
export default {
  components: {
    UTextField,
    FileUpload,
    Multiselect,
    Loader,
  },
  data: () => ({
    school: {
      name: "",
      principle_name: "",
      phone: "",
      principal_phone: "",
      email: "",
      city: "",
      password: "",
      password_confirmation: "",
      assigned_teachers_id: [],
      avatar: null,
    },
    assigned_teacher: [],
  }),
  methods: {
    ...mapActions("Teachers", ["fetchTeachersList"]),
    async submit() {
      this.school.assigned_teachers_id = this.assigned_teacher.map((x) => {
        return x.id;
      });
      console.log(this.school);
      const formData = new FormData();
      for (let field in this.school) {
        console.log(typeof this.school[field], field);
        formData.append(field, this.school[field]);
      }

      axios.post("/admin/school", formData).then((e) => {
        console.log(e);
      });
    },
  },
  async mounted() {
    await this.fetchTeachersList(ADMIN);
  },
  computed: {
    ...mapGetters("Teachers", {
      teacherList: "filteredTeachersList",
      loading: "loading",
    }),
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss" scoped>
@import "@/styles/mixins";

.screen-container {
  min-height: 100%;
}

label {
  font-size: 24px;
  color: #000;
  font-weight: 300;
  line-height: 46px;
  display: inline-block;
}

.add-photo {
  margin-top: 11px;
}

.head {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@include media(">phone", "<=tablet") {
  .create-wrap {
    flex-wrap: nowrap;
    flex-direction: column;

    .create-item {
      flex: auto;
      max-width: unset;
    }
  }
  .head {
    padding-top: 40px;

    .head-title {
      font-size: 24px;
      padding-left: 20px;
    }

    .head-btn {
      padding: 0 20px;
      margin-right: 5px;
    }
  }
  .avatar-block {
    label {
      font-size: 20px;
    }

    .add-photo {
      font-size: 14px;
      height: 40px;
      padding: 0 20px;
    }
  }
  .save-button {
    height: 40px;
  }
}
.loader {
  position: inherit !important;
}
</style>
<style>
.multiselect {
  font-size: 22px !important;
}

.multiselect__placeholder {
  font-size: 20px;
}
.multiselect__select:before {
  top: 90%;
}
.multiselect__tag {
  color: white;
  font-size: 20px;
  background: #2c4cc1;
}
.multiselect__tag-icon:after {
  color: white;
  font-size: 20px;
}
</style>
