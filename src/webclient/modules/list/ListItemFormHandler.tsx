/// <reference path="../../webclient.d.ts"/>

import * as React from 'react';
import {bindActionCreators, Store, Dispatch} from 'redux';
import {connect} from 'react-redux';

class ListItemFormHandler extends React.Component<{}, {}> {

  render() {
    return (
      <div>TODO edit form for list item</div>
    )
  }

}

export default connect(/*TODO mapStateToProps*/)(ListItemFormHandler);
