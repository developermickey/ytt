import axios from "axios";

export default {
  getOrderList(status) {
    return axios.get(`admin/orders?status=${status}`);
  },
  getOrderListSchool(status) {
    return axios.get(`school/orders?status=${status}`);
  },
  getOrderDetailsSchool(payload) {
    let formData = new FormData();
    formData.append("order_id", payload.order_id);
    return axios.post(`school/order/detail`, formData);
  },
  changeOrderStatusSchool(payload) {
    let formData = new FormData();
    formData.append("order_id", payload.order_id);
    formData.append("status", payload.status);
    return axios.post(`school/order/status`, formData);
  },
  getTransaction() {
    return axios.get(`admin/students/payment`);
  },

  getOrderDetails(payload) {
    let formData = new FormData();
    formData.append("order_id", payload.order_id);
    return axios.post(`admin/order/detail`, formData);
  },
  changeOrderStatus(payload) {
    let formData = new FormData();
    formData.append("order_id", payload.order_id);
    formData.append("status", payload.status);
    return axios.post(`admin/order/status`, formData);
  },
  deleteOrder(id) {
    return axios.delete(`/admin/orders/${id}`);
  },
  deleteOrderSchool(id) {
    return axios.delete(`/school/orders/${id}`);
  },
};
