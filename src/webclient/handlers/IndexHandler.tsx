import * as React from 'react';
var ReactRouter = require('react-router');
const { Link } = ReactRouter;
import GetData from '../commands/GetData';
import IHTTPClient from '../../framework/common/http/IHTTPClient';
import IInvoke from '../../framework/common/invoke/IInvoke';
var DocumentMeta = require('react-document-meta');

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

  static async fillCache(cache, invoke, httpClient) {
    var data = await invoke(new GetData({
      data: {a: 'a'},
      httpClient
    }));

    cache.set('index', data);

  }

  componentWillMount() {
    var data = this.context.cache.get('index');
    if (data) {
      this.setState(data);
    }
  }

  async componentDidMount() {
    let { invoke, httpClient } = this.context;
    var data = await invoke(new GetData({
      data: {a: 'a'},
      httpClient
    }));
    if (typeof data !== 'undefined') {
      this.setState(data);
    }
  }

  render() {
    return <div>
      <DocumentMeta
        title={'React-blog: Home'}
      />
      Home content. State: {JSON.stringify(this.state)}
    </div>;
  }

}
