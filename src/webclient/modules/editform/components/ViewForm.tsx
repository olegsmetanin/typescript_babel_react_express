/// <reference path="../../../webclient.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {FormData} from '../model';

interface IProps extends React.Props<ViewForm> {
  data   : FormData;
  onEdit : () => void;
}

export default class ViewForm extends React.Component<IProps, {}> {

  render() {
    const data: FormData = this.props.data;

    return (
      <div>
        <div><b>#{' '}{data.id}</b>{' '}<h3>{data.name}</h3></div>

        <div><pre style={{padding: '20px'}}>{data.description}</pre></div>

        <div style={{textDecoration: data.enabled ? 'none' : 'line-through'}}>
          <label>Valid till</label>
          <i>{new Date(data.validTill).toLocaleDateString()}</i>
        </div>

        <h4>{data.typeCode}</h4>

        <hr />

        <div>
          <button type="button" onClick={this.props.onEdit}>Edit</button>
        </div>

      </div>
    )

  }

}
