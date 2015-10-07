import { default as isomorphicFetch } from 'isomorphic-fetch';

const API_URL = window.__env.API_URL

export default function fetch(urlPath, options) {
  const completeUrl = API_URL + urlPath;
  return isomorphicFetch(completeUrl, options);
}
