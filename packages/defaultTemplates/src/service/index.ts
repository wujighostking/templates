import { BASE_URL, TIME_OUT } from './config'
import { Request } from './request'

const request = new Request({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  // interceptors: {
  //   request: {
  //     successFn: (config) => {
  //       console.log("instance1 request success");

  //       return config;
  //     },

  //     failureFn: (err) => {
  //       console.log("instance1 request error");

  //       return "err";
  //     },
  //   },

  //   response: {
  //     sueeceeFn: (response) => {
  //       console.log("instance1 response sueecee");

  //       return response;
  //     },
  //     failureFn: (err) => {
  //       console.log("instance1 request error");

  //       return "error";
  //     },
  //   },
  // },
})

export { request }
export default request
