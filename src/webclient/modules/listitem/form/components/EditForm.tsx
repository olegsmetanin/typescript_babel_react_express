/// <reference path="../../../../webclient.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as reactMixin from 'react-mixin';

import {IListItem} from '../../../../../common/model';
import * as LinkedStateMixin from "react-addons-linked-state-mixin";

import Error from './Error';


interface IProps extends React.Props<EditForm> {
  data   : IListItem;
  saving : boolean;
  onSave : (data: FormData) => void;
  errors : any;
}

interface IState extends IListItem {
}

@reactMixin.decorate(LinkedStateMixin)
export default class EditForm extends React.Component<IProps, IState> implements React.LinkedStateMixin {

  state: IState = this.props.data;

  //injected with mixin
  linkState: <T>(key: string) => React.ReactLink<T>;

  save = () => {
    const data = Object.assign({}, this.state, {id: Number(this.state.id)});//convert string id to number
    this.props.onSave(data);
  };

  render() {
    const {saving, errors} = this.props;

    return (
      <div className="editform">
        <div>
          <label>Id:</label>
          <input type="text" valueLink={this.linkState<number>('id')} />
          <Error propPath="instance.id" errors={errors} />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" valueLink={this.linkState<string>('name')} />
          <Error propPath="instance.name" errors={errors} />
        </div>
        <div>
          <label>Descriptions:</label>
          <textarea valueLink={this.linkState<string>('description')} rows={3} />
          <Error propPath="instance.description" errors={errors} />
        </div>
        <div>
          <label>Valid till:</label>
          <input type="text" valueLink={this.linkState<string>('validTill')} />
          <Error propPath="instance.validTill" errors={errors} />
        </div>
        <div>
          <label>Type code:</label>
          <input type="text" valueLink={this.linkState<string>('typeCode')} />
          <Error propPath="instance.typeCode" errors={errors} />
        </div>
        <div>
          <label>Enabled:</label>
          <input type="checkbox" checkedLink={this.linkState<boolean>('enabled')} />
          <Error propPath="instance.enabled" errors={errors} />
        </div>
        <div>
          <button type="button" disabled={saving} onClick={this.save}>
            {!saving ? 'Save' : 'Saving...'}
          </button>
        </div>
        <Error errors={errors} />
      </div>
    )

  }

}
