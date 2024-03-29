import axios from "axios";
export default {
  async getPage(params, role = "admin") {
    return await axios.get(`/${role}/lessons`, {
      params: params,
    });
  },

  create(data, role = "admin") {
    return axios.post(`/${role}/lessons`, data);
  },

  get(id) {
    return axios.get("/lessons/" + id);
  },

  update(id, data) {
    return axios.put("/lessons/" + id, data);
  },

  delete(id) {
    return axios.delete("/lessons/" + id);
  },

  pdf(file, progressHandler = null) {
    let data = new FormData();
    data.append("pdf", file);

    let options = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    if (progressHandler !== null) {
      options.onUploadProgress = progressHandler;
    }

    return axios.post("/admin/lessons/pdf", data, options);
  },

  addAccessToTeacher(lessonId, data) {
    return axios.post(`/admin/lessons/${lessonId}/users/access`, data);
  },
  addAccessToSchool(lessonId, data) {
    return axios.post(`/school/lessons/${lessonId}/users/access`, data);
  },

  getLessonLogs(params) {
    return axios.get(`/teacher/lesson-logs`, {
      params: params,
    });
  },

  addLessonLog(data) {
    return axios.post(`/teacher/lesson-logs`, data);
  },
};
