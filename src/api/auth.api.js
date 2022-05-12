import axios from 'axios';

export default {

  login: data => axios.post('/auth/login', data),

  getCurrentUser: token =>
    axios.get(
      '/user',
      token
        ? {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        : undefined
    ),
  
  register: data => axios.post('/auth/register', data)

  // reg(data) {
  //   return env.API.post('/auth/reg', data);
  // },
  // sendByMail(email){
  //   return env.API.post('/auth/recover', {email:email})
  // },
  // verifyCode(token ){
  //   return env.API.put('/auth/recover/code', {token: token})
  // },
  // changePass(token, pass){
  //   return env.API.put('/auth/recover/pass', {token: token, pass: pass})
  // },
}
