/// <reference path="../../../webclient.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as reactMixin from 'react-mixin';

import {FormData} from '../model';
import * as LinkedStateMixin from "react-addons-linked-state-mixin";


interface IProps extends React.Props<EditForm> {
  data   : FormData;
  saving : boolean;
  onSave : (data: FormData) => void;
  errors : any;
}

interface IState extends FormData {
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
          <input type="number" valueLink={this.linkState<number>('id')} />
          {errors && errors['instance.id']
            ? <div className="error">{errors['instance.id'].map(e => e.msg).join(', ')}</div>
            : null
          }
        </div>
        <div>
          <label>Name:</label>
          <input type="text" valueLink={this.linkState<string>('name')} />
        </div>
        <div>
          <label>Descriptions:</label>
          <textarea valueLink={this.linkState<string>('description')} rows={3} />
        </div>
        <div>
          <label>Valid till:</label>
          <input type="text" valueLink={this.linkState<string>('validTill')} />
        </div>
        <div>
          <label>Type code:</label>
          <input type="text" valueLink={this.linkState<string>('typeCode')} />
          {errors && errors['instance.typeCode']
            ? <div className="error">{errors['instance.typeCode'].map(e => e.msg).join(', ')}</div>
            : null
          }
        </div>
        <div>
          <label>Enabled:</label>
          <input type="checkbox" checkedLink={this.linkState<boolean>('enabled')} />
        </div>
        <div>
          <button type="button" disabled={saving} onClick={this.save}>
            {!saving ? 'Save' : 'Saving...'}
          </button>
        </div>
        {errors && errors['general']
          ? <div className="error">{errors['general'].map(e => e.msg).join(', ')}</div>
          : null
        }
      </div>
    )

  }

}
