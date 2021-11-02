import axios from 'axios';

//Configure axios default instance
const Axios = axios.create({
  baseURL: 'https://localhost:5001/api/',
});

const token = localStorage.getItem("phnbToken");
if(token !== null){
  Axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
}
export default Axios;