import axios from "axios";

const apiInstance = (server:any, apiKey:any) => {
 return axios.create({
    baseURL: `${server}/api`,
    headers: { id: apiKey },
  });
};

export { apiInstance };
