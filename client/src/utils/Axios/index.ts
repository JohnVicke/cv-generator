import axios, { AxiosInstance } from 'axios';
import { assign, isEmpty, merge } from 'lodash';

const singleTonEnforcer = Symbol();

interface AxiosClientDefaults {
  baseURL: string;
  headers?: object;
  rest?: any;
}

class Axios {
  private axiosClient: AxiosInstance;
  static axiosInstance: Axios;

  constructor(enforcer: typeof singleTonEnforcer) {
    if (enforcer !== singleTonEnforcer) {
      throw new Error('Cannot init Axios client single instance');
    }
    this.axiosClient = axios.create();
  }

  static get instance() {
    if (!this.axiosInstance) this.axiosInstance = new Axios(singleTonEnforcer);
    return this.axiosInstance;
  }

  setDefaults(configure: AxiosClientDefaults) {
    const { baseURL, headers = {}, ...rest } = configure;
    this.axiosClient.defaults.baseURL = baseURL;
    this.axiosClient.defaults.headers = {
      ...merge(this.axiosClient.defaults.headers, headers)
    };
    this.axiosClient.defaults = {
      ...this.axiosClient.defaults,
      ...rest
    };
  }

  setBearerToken(token: string = '') {
    this.axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  get(resource: string, slug = '', config = {}) {
    const requestURL = isEmpty(slug) ? `${resource}` : `${resource}/${slug}`;
    return this.axiosClient.get(requestURL, {
      data: null,
      ...merge({ headers: this.axiosClient.defaults.headers }, config)
    });
  }

  post(resource: string, data: object, config = {}) {
    return this.axiosClient.post(
      `${resource}`,
      data,
      assign(config, this.axiosClient.defaults.headers)
    );
  }

  update(resource: string, data: object, config = {}) {
    return this.axiosClient.put(
      `${resource}`,
      data,
      assign(config, this.axiosClient.defaults.headers)
    );
  }

  put(resource: string, data: object, config = {}) {
    return this.axiosClient.put(
      `${resource}`,
      data,
      assign(config, this.axiosClient.defaults.headers)
    );
  }

  patch(resource: string, data: object, config = {}) {
    return this.axiosClient.patch(
      `${resource}`,
      data,
      assign(config, this.axiosClient.defaults.headers)
    );
  }

  delete(resource: string, data: object, config = {}) {
    return this.axiosClient.delete(`${resource}`, {
      params: data,
      ...assign(config, this.axiosClient.defaults.headers)
    });
  }
}
export default Axios.instance;
