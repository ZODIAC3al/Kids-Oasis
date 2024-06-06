import axios from "axios";

const Api = axios.create({
  baseURL: "https://kids-oasis-smti.onrender.com/api/v1/users/", //your api URL
});

export default Api;
