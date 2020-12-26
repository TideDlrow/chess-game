import service from '@/network/axios-config'

const request = {
  get(url, params, headers) {
    let options = {};

    if (params) {
      options.params = params
    }
    if (headers) {
      options.headers = headers
    }
    return service.get(url, options)
  },
  post(url, data, params, headers) {
    let options = {};

    if (params) {
      options.params = params
    }
    if (headers) {
      options.headers = headers
    }
    return service.post(url, data, options)
  },
  put(url, params, headers) {
    let options = {};

    if (headers) {
      options.headers = headers
    }
    return service.put(url, params, options)
  },
  delete(url, params, headers) {
    let options = {};

    if (params) {
      options.params = params
    }
    if (headers) {
      options.headers = headers
    }
    return service.delete(url, options)
  }
};

export default request;
