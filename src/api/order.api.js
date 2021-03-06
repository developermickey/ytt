import axios from "axios";

export default {
  getOrderList(status) {
    return axios.get(`admin/orders?status=${status}`);
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
};
