import { default as isomorphicFetch } from 'isomorphic-fetch';

const API_URL = '//localhost:8081'

export default function fetch(urlPath, options) {
  const completeUrl = API_URL + urlPath;
  return isomorphicFetch(completeUrl, options);
}
