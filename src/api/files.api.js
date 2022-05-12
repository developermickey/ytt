import axios from 'axios';

export default {

  upload(file, progressHandler = null) {

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

    return axios.post('/media', data, options);
  },
}
