import {ICatchApi} from './api';
import {THROW_REQUEST, AUTH_ONLY_REQUEST} from './actionTypes';

function factory(options: {api: ICatchApi}) {

  const {api} = options;

  const requestThrowEndpoint = (counter: number) => {
    return {
      type: THROW_REQUEST,
      payload: {
        promise: api.throw(counter),
        data: counter,
      }
    };
  };

  const requestSecuredEndpoint = () => {
    return {
      type: AUTH_ONLY_REQUEST,
      payload: {
        promise: api.authonly()
      }
    };
  };

  return {
    requestThrowEndpoint,
    requestSecuredEndpoint,
  }
}

export default factory
