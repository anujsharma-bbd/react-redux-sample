import React from "react";
import { connect } from "react-redux";
import FilterComponent from './filter.component.jsx';
import TeamsProgressComponent from './teams-progress.component';
import { sharedActionTypes } from "../../../shared/actions/sharedActionTypes";
import * as Action from "../../../shared/actions/action";
import { Utility } from "../../../../common/utility/";
import { Constants } from "../../../../common/app-settings/constants";

/**
 * DashboardRightContainer component.
 */
class DashboardRightContainer extends React.Component {

  /**
   * Constructor to initialize fields.
   */
  constructor(props) {
    super(props);
    this.onExpand = this.onExpand.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.keys = { mapview: Constants.dashBoardViewKey.mapView, listview: Constants.dashBoardViewKey.listView, dataview: Constants.dashBoardViewKey.dataView };
  }

  /**
   * Event handler for right side panel expand.
   */
  onExpand() {
    this.props.dispatch(Action.getAction(sharedActionTypes.SET_RIGHT_SIDE_EXPANDED, {}));
    this.onWindowResize();
  }

  /**
   * Window resize event handler
   */
  onWindowResize() {
    Utility.onWindowResize();
  }

  /**
   * DashboardRightContainer render
   */
  render() {
    let dataviewTabSelected = ((this.props.sharedModel.tabs.filter((tab, index) => tab.key == this.keys.dataview && tab.isSelected)).length > 0);
    return (

      <div className={(dataviewTabSelected ? " displaynone " : "")}>
        <div id="sidebar-right"  className={"sidebar sidebar-right rightside-bar-dashboard " + ( this.props.sharedModel.smallScreenRightMenuOpened ? " right_menu_small_screen_toggled ":'')}>
          <div className="right-side-bar-minify-button-container">
            <ul className="nav m-t-10">
              <li className="nav-widget">
                <div className="admin-right-container admin-right-container-ext">
                  <FilterComponent location={this.props.location} />
                </div>
              </li>
              <li className="nav-widget minify-button-container">
                <a href="javascript:void(0);" className="sidebar-minify-btn right-side-bar-minify-button" onClick={this.onExpand}>
                  <i className="fa  fa-angle-double-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="right-side-bar-bg-overlay">
          <a href="javascript:void(0);" className="sidebar-minify-btn right-side-bar-minify-button" onClick={this.onExpand}>
            <i className="fa  fa-angle-double-left"></i>
          </a>
        </div>
      </div>


    );
  }

}

let mapStateToProps = (state) => {
  return {
    model: state.dashboardModel,
    sharedModel: state.sharedModel
  }
};
export default connect(mapStateToProps)(DashboardRightContainer);