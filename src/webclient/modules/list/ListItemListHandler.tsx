/// <reference path="../../webclient.d.ts"/>

import * as React from 'react';
import {bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import {IListState} from './model';
import ListFormApi from './api';
import actionsFactory from './actions';
import ListItem from './components/ListItem';
import Filter from './components/Filter';


interface IContext {
  httpClient: IHTTPClient;
}

interface IProps {
  state    : IListState;
  dispatch : Dispatch;
}

class ListItemListHandler extends React.Component<IProps, {}> {

  static contextTypes: React.ValidationMap<any> = {
    httpClient: React.PropTypes.object.isRequired,
  };

  actions: any;

  constructor(props: IProps, context: IContext) {
    super(props, context);

    const api = new ListFormApi({httpClient: context.httpClient});
    this.actions = bindActionCreators(actionsFactory({api}), props.dispatch);
  }

  componentWillMount() {
    if (typeof window !== 'undefined') {
      this.actions.search({search: ''});
    }
  }

  loadMore = () => {
    const {filter, items} = this.props.state;
    this.actions.search(filter, items.length);
  };

  render() {
    const {filter, items, count, ui} = this.props.state;

    const renderLoading = () => <div>Loading list items...</div>;

    const renderTotal = () => <div className="listform__total">Found {count} item(s)</div>;

    const renderItems = () => {
      return <div className="listform__items">
        {items.map(item => <ListItem key={item.id} item={item} />)}
        {items.length <= 0 && <div>No list items found</div>}
      </div>
    };

    const renderNextBtn = () => {
      return <div className="listform__more" onClick={this.loadMore}>
        <button type="button" className="listform__morebtn" disabled={ui.loading}>
          Load more
        </button>
      </div>
    };

    return (
      <div className="listform">
        <Filter className="listform__filter"
                filter={filter}
                onSearch={filter => this.actions.search(filter)}
                loading={ui.loading}
        />

        {renderTotal()}

        {renderItems()}

        {ui.loading === true && renderLoading()}

        {count > items.length && renderNextBtn()}
      </div>
    )
  }

}

const mapStateToProps = state => ({
  state: state && state.modules && state.modules.listform && state.modules.listform.list
});

export default connect(mapStateToProps)(ListItemListHandler);
