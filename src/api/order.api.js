import axios from "axios";

export default {
  getOrderList() {
    return axios.get(`admin/orders`);
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
};
