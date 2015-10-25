import * as React from 'react';
import {Link} from 'react-router';
import GetData from '../commands/GetData';
import IHTTPClient from '../../framework/server/interfaces/IHTTPClient';
import IInvoke from '../../framework/server/interfaces/IInvoke';

interface IIndexHandlerContext {
  httpClient: IHTTPClient;
  invoke: IInvoke;
  cache: any;
}

interface IIndexHandlerProps {
}

export default class IndexHandler extends React.Component<IIndexHandlerProps, {}> {

context: IIndexHandlerContext;

static contextTypes: React.ValidationMap<any> = {
  httpClient: React.PropTypes.object.isRequired,
  invoke: React.PropTypes.func.isRequired,
  cache: React.PropTypes.object.isRequired,
  //router: React.PropTypes.func.isRequired
}

static async fillCache(state, cache, invoke, httpClient) {
  //console.log('IndexHandler fillCache');
  var data = await invoke(new GetData({
    data: {a: 'a'},
    httpClient,
    siteroot: 'http://localhost:3000'
  }));

  cache.set('index', data);

}

componentWillMount() {
  var cache = this.context.cache.get('index');
  if (cache) {
    this.setState(cache);
  }
}

  render() {
    return <div>
      Home content. State: {JSON.stringify(this.state)}
    </div>;
  }

}
