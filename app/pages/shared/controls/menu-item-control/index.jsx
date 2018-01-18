import React from "react";

import { Link, IndexLink } from 'react-router';
import { sharedActionTypes } from "../../actions/sharedActionTypes";
import * as Action from "../../actions/action";
import {Constants} from "../../../../common/app-settings/constants";
import {Utility} from "../../../../common/utility/"
export class MenuItem extends React.Component {

  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  /* on link click */
  onClickHandler(tabkey) {
    this.props.dispatch(Action.getAction(sharedActionTypes.SET_TAB_CHANGE, { key: tabkey }));
  }

  render() {
    const user = Utility.getLoginDetails();
    const jsx = (
      <li>
        <IndexLink to={this.props.To} activeClassName="selected-left-menu-item "
          onClick={() => this.onClickHandler(this.props.TabKey)} ><span className={"link-span" + (this.props.IsSelected ? " page-active " : '')}>{this.props.Text}</span></IndexLink>
      </li>
    );
    return this.props.TabKey === Constants.dashBoardViewKey.dataView && user && user.isSFOUser ? null : jsx;
  }
}

