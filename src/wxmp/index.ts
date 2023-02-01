import axios, { AxiosResponse } from 'axios'
const request = axios.create({
  baseURL: 'https://api.weixin.qq.com'
})

declare namespace API {
  export interface ClearQuota {
    params: {
      access_token: string
    }
  }
  export function clearQuota<T, K> (data: ClearQuota): Promise<AxiosResponse<T, K>>
}

const apiMapping = {
  clearQuota: {
    url: `/cgi-bin/clear_quota`,
    method: 'POST'
  },

}

class Wxmp {
  accessToken: string = ''

  constructor() {
  }

  request() {

  }
  public setAccessToken(acceessToken: string) {
    this.setAccessToken(acceessToken)
  }

  /**
   * 获取接口调用凭据
   * @param data.appid { string }
   * @param data.secret { string }
   */
  public  getAccessToken(data: {
    appid: string
    secret: string
  }) {
    return request({
      url: '/cgi-bin/token',
      params: {
        grant_type: 'client_credential',
        appid: data.appid,
        secret: data.secret
      }
    })
  }

  /**
   * 重置 API 调用次数
   */
  public  clearQuota() {
    if (!this.accessToken) {
      return Promise.reject('access_token is required')
    }

    return request({
      url: '/cgi-bin/clear_quota',
      params: {
        access_token: this.accessToken
      }
    })
  }
  /**
   * 查询 API 调用额度
   */
  public getApiQuota() {
    if (!this.accessToken) {
      return Promise.reject('access_token is required')
    }

    return request({
      url: '/cgi-bin/openapi/quota/get',
      params: {
        access_token: this.accessToken
      }
    })
  }

  /**
   * 查询 rid 信息
   * @param rid { string }
   */
  public getRidDetail(rid: string) {
    if (!this.accessToken) {
      return Promise.reject('access_token is required')
    }

    return request({
      url: '/cgi-bin/openapi/rid/get',
      params: {
        access_token: this.accessToken,
        rid,
      }
    })
  }
}

const instance = new Wxmp()
export default instance
