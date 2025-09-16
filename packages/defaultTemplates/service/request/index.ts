import type { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from 'axios'
import axios from 'axios'

interface Options extends CreateAxiosDefaults {
  interceptors?: {
    request?: {
      successFn?: (...args: any[]) => any
      failureFn?: (...args: any[]) => any
    }

    response?: {
      successFn?: (...args: any[]) => any
      failureFn?: (...args: any[]) => any
    }
  }
}

interface Config extends AxiosRequestConfig {
  interceptors?: {
    request?: {
      successFn?: (...args: any[]) => any
    }
    response?: {
      successFn?: (...args: any[]) => any
    }
  }
}

type ConfigOptions = Omit<Config, 'method'>

class Request {
  instance: AxiosInstance

  constructor(config: Options) {
    this.instance = axios.create(config)

    // 请求拦截器存在
    const requestInterceptors = config?.interceptors?.request
    if (requestInterceptors) {
      this.instance.interceptors.request.use(
        requestInterceptors?.successFn,
        requestInterceptors?.failureFn,
      )
    }

    // 返回响应中的 data 属性
    typeof window === 'object'
    && this.instance.interceptors.response.use(res => res?.data)

    // 响应拦截器存在
    const responseInterceptors = config?.interceptors?.response
    if (responseInterceptors) {
      this.instance.interceptors.response.use(
        responseInterceptors?.successFn,
        responseInterceptors?.failureFn,
      )
    }
  }

  request(config: Config) {
    const resuestInterceptors = config.interceptors
    if (resuestInterceptors && resuestInterceptors.request) {
      config = resuestInterceptors?.request?.successFn?.(config)
    }

    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then((res) => {
          if (resuestInterceptors?.response) {
            res = resuestInterceptors?.response?.successFn?.(res)
          }

          resolve(res)
        })
        .catch(err => reject(err))
    })
  }

  get(config: ConfigOptions) {
    return this.request({ ...config, method: 'GET' })
  }

  post(config: ConfigOptions) {
    return this.request({ ...config, method: 'POST' })
  }

  delete(config: ConfigOptions) {
    return this.request({ ...config, method: 'DELETE' })
  }

  put(config: ConfigOptions) {
    return this.request({ ...config, method: 'PUT' })
  }

  patch(config: ConfigOptions) {
    return this.request({ ...config, method: 'PATCH' })
  }
}

export { Request }
export default Request
