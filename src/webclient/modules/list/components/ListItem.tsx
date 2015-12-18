/// <reference path="../../../webclient.d.ts"/>

import * as React from 'react';
import {IListItem} from '../model';


interface IProps extends React.Props<ListItem> {
  item: IListItem;
}

export default class ListItem extends React.Component<IProps, {}> {

  render() {
    const {item} = this.props;

    return (
      <div className="list-item">
        <div className="list-item__title">
          #{item.id}&ndash;{item.name}
        </div>
        <div className={`list-item__validTill${!item.enabled ? '-disabled' : ''}`}>
          {item.validTill}
        </div>
        <div className="list-item__description">
          {item.description}
        </div>
        <div className="list-item__typeCode">{item.typeCode}</div>
      </div>
    )
  }

}
