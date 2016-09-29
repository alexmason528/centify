import superagent from 'superagent';

const methods = ['get', 'post', 'put', 'patch', 'del'];

export function formatUrl(path) {
  if (path.substr(0, 4).toLowerCase() == 'http') {
    return path;
  }
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  return __API_URL__ + adjustedPath;
}

export default class ApiClient {
  constructor(auth) {
    this.auth = auth;

    methods.forEach((method) =>
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        // console.log('request data: ', params, data)
        const request = superagent[method](formatUrl(path));

        if (params) {
          request.query(params);
        }

        const id_token = localStorage.getItem('id_token')
        if (id_token) {
          request.set('Authorization', 'Bearer ' + id_token)
        }
        request.set('Accept', 'application/json')
        request.set('Content-Type', 'application/json')
        // console.log('send request: ', id_token);
        if (data) {
          request.send(data);
        }

        request.end((err, { body } = {}) => err ? reject(body || err) : resolve(body));
      }));
  }
  
  getAuth = () => {
    return this.auth;
  }
}
