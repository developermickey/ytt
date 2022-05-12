import axios from 'axios';

export default {
  getPage(params, role = 'admin'){
    //Possible params
    // role - teacher, student
    return axios.get(`/${role}/users`, {
      params: params
    });
  },

  getSingle(id, role = 'admin'){
    return axios.get(role + '/users/' + id);
  },

  getRoles(){
    return axios.get('/roles');
  },

  create(data){

    let options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    
    return axios.post('/admin/users', data, options);
  },
  
  update(id, data){
    return axios.put('/admin/users/' + id, data);
  },

  uploadAvatar(file, progressHandler = null) {

    let data = new FormData();
    data.append('files[]', file);

    let options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }

    if(progressHandler !== null){
      options.onUploadProgress = progressHandler;
    }

    return axios.post('/users/avatar', data, options);
  },

  addAccessToLesson(userId, data){
    return axios.post(`/admin/users/${userId}/lessons/access`, data);
  },


  
}
