/// <reference path="../../../webclient.d.ts"/>

import * as React from 'react';

interface ITaskFilterProps {
  onSearch: (filter: {search: string}) => void;
  loading?: boolean;
}

interface ITaskFilterState {
  search: string;
}

export default class TaskFilter extends React.Component<ITaskFilterProps, ITaskFilterState> {

  state: ITaskFilterState = {search: ''};

  onChange = (e) => this.setState({search: e.target.value});

  onKeyDown = (e) => {
    if (e.which === 13) {
      this.props.onSearch({search: this.state.search});
    }
  }

  render() {
    const {search} = this.state;
    const {loading} = this.props;

    return (
      <div>
        <input type="text" value={search} disabled={loading === true}
               onChange={this.onChange}
               onKeyDown={this.onKeyDown} />
      </div>
    )
  }
}
