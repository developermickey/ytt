import axios from "axios";

export default {
  assignTeacher(studentId, teacherId) {
    return axios.post(`/admin/users/${studentId}/teacher`, {
      teacher: teacherId,
    });
  },
  async changeStudentStatus(payload) {
    let data = new FormData();
    data.append("id", payload.studentId);
    data.append("status", payload.status);
    return await axios.post(`admin/status`, data);
  },
  async callStudent(payload) {
    let data = new FormData();
    data.append("id", payload.id);
    data.append("calledDate", payload.calledDate);
    return await axios.post(`admin/called`, data);
  },
  async comment(payload) {
    let data = new FormData();
    data.append("id", payload.id);
    data.append("comment", payload.comment);
    return await axios.post(`admin/comment`, data);
  },
};
