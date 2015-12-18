/// <reference path="../../../webclient.d.ts"/>

import * as React from 'react';
import {IListItemsFilter} from '../model';

interface IProps {
  filter     : IListItemsFilter;
  onSearch   : (filter: IListItemsFilter) => void;
  loading    : boolean;
  className? : string;
}

interface IState extends IListItemsFilter { }

export default class Filter extends React.Component<IProps, IState> {

  state: IState = this.props.filter;

  componentWillReceiveProps(nextProps: IProps) {
    this.setState(nextProps.filter);
  }

  onChange = (e) => this.setState({search: e.target.value});

  onKeyDown = (e) => {
    if (e.which === 13) {
      this.props.onSearch(this.state);
    }
  };

  onSearch = () => {
    this.props.onSearch(this.state);
  };

  render() {
    const {search} = this.state;
    const {loading, className} = this.props;

    return (
      <div className={className}>
        <input type="text"
               value={search}
               disabled={loading}
               onChange={this.onChange}
               onKeyDown={this.onKeyDown} />
        <button type="button"
                onClick={this.onSearch}
                disabled={loading}>
          {!loading ? 'Search' : 'Searching...'}
        </button>
      </div>
    )
  }
}
