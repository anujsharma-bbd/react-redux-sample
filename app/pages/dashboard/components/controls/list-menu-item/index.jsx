import React from "react";

import { Link } from 'react-router';
import * as Action from "../../../../shared/actions/action";
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";


export class ListMenu extends React.Component {

  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  /* on link click */
  onClickHandler(tabkey) {
    this.props.dispatch(Action.getAction(sharedActionTypes.SET_TAB_CHANGE, { key: tabkey }));
  }

  render() {
    return <Link to={this.props.To} className={this.props.IsSelected ? "selected-nav" : ''} onClick={(e) => this.onClickHandler(this.props.TabKey)} >{this.props.Text}</Link>
  }
}

