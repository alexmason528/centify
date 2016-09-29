import { push } from 'react-router-redux';

function checkTokenExpired(auth, dispatch) {
  if (auth.isExpired()) {
    console.log('Token expired')
    dispatch(push('/login/tokenexpired'));
  }
}

export default function clientMiddleware(client) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare
      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      next({...rest, type: REQUEST});

      const actionPromise = promise(client);
      actionPromise.then(
        (result) => {
          return next({...rest, result, type: SUCCESS})
        },
        (error) => {
          checkTokenExpired(client.getAuth(), dispatch)
          throw error;
          return next({...rest, error, type: FAILURE})
        }
      ).catch((error)=> {
        checkTokenExpired(client.getAuth(), dispatch)
        throw error;
        next({...rest, error, type: FAILURE});
      });

      return actionPromise;
    };
  };
}
