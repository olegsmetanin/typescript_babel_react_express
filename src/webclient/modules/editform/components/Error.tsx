/// <reference path="../../../webclient.d.ts"/>

import * as React from 'react';


interface IProps {
  propPath? : string;
  errors?   : any;
}

export default class Error extends React.Component<IProps, {}> {

  render() {
    const {propPath = 'general', errors} = this.props;

    return !errors || !errors[propPath] || !errors[propPath].length ? null :
      <ul className="errors-view">
        {
          errors[propPath].map((e, i) => <li key={i} className="error-item">{e.msg}</li>)
        }
      </ul>
  }

}
