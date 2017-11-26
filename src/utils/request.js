import fetch from 'dva/fetch';
import { notification } from 'antd';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status !== 400) {
    notification.error({
      message: `请求错误 ${response.status}: ${response.url}`,
      description: response.statusText,
    });

  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }

  const token = window.localStorage.getItem('token');
  if (token) {
    newOptions.headers = Object.assign({ ...newOptions.headers }, {
      Authorization: `Token ${token}`,
    });
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .then(response => ({
      ...response,
      success: true,
    }))
    .catch((error) => {
      return error.response.json()
        .then(data => ({
          success: false,
          err: data,
          code: error.response.status,
        }));
    });
}
