import * as React from 'react';
//require('./Layout.scss');


//function Router(target: any) {
//    target.contextTypes = target.contextTypes || {};
//    target.contextTypes.router = React.PropTypes.func.isRequired;
//}

//interface IRouterContext {
//    router: ReactRouter.Router;
//}

interface ILayoutProps extends React.Props<any> {
}

export default class Layout extends React.Component<ILayoutProps, {}> {

//context: IRouterContext;

//static contextTypes = {
//    router: React.PropTypes.func.isRequired
//}

  render() {
    return <div>{this.props.children}</div>;
  }

}
