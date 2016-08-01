import superagent from 'superagent';

const config = {
  domain: 'https://staging-api.centify.com',
}

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  if (path.substr(0, 4).toLowerCase() == 'http') {
    return path;
  }
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  return config.domain + adjustedPath;
}

export default class ApiClient {
  constructor() {
    methods.forEach((method) =>
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
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

        if (data) {
          request.send(data);
        }

        request.end((err, { body } = {}) => err ? reject(body || err) : resolve(body));
      }));
  }
  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" from issue #14.
   * https://github.com/erikras/react-redux-universal-hot-example/issues/14
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
  empty() {}
}
