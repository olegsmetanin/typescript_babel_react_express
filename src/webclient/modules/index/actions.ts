import {IIndexApi} from './api';
import {DATA_REQUEST} from './actionTypes';

function factory(options: {api: IIndexApi}) {

  const {api} = options;

  const requestData = (options: {a: string}) => {
    return {
      type: DATA_REQUEST,
      payload: {
        promise: api.echo(options)
      }
    }
  }

  return {
    requestData
  }
}

export default factory
