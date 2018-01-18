import React from "react";
import { connect } from "react-redux";
import { Constants } from "../../../../../common/app-settings/constants";
import { DashboardMapService } from "../../../services/dashboard-maps.service";
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";
import { dashboardActionTypes } from "../../../actions/dashboardActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Utility } from "../../../../../common/utility/";
import AuthorizedComponent from "../../../../shared/base/authorized-component";


class MapViewComponent extends AuthorizedComponent {

  constructor(props) {
    super(props);
    this.showMapRoutes = this.showMapRoutes.bind(this);
    this.getBoroughNameForMap = this.getBoroughNameForMap.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(Action.getAction(sharedActionTypes.SET_TAB_CHANGE, { key: Constants.dashBoardViewKey.mapView }));
    this.props.dispatch(Action.getAction(dashboardActionTypes.SET_MAP_JSON_LOADED, false));
    // initialise the google map
    DashboardMapService.initMap(() => {
      this.showMapRoutes();
      this.props.dispatch(Action.getAction(dashboardActionTypes.SET_MAP_JSON_LOADED, true));
    });

  }
  getBoroughNameForMap() {
    let bModel = this.props.model.rightSideModel.filtersModel.selectedBorough, sModel = this.props.model.rightSideModel.filtersModel.selectedSite;

    if (sModel.siteId != -1) {
      let boroughId = this.props.model.rightSideModel.sites.find((site) => site.siteId === sModel.siteId).boroughId;
      bModel = this.props.model.rightSideModel.boroughs.find((borough) => borough.boroughId === boroughId);
    }
    return bModel;

  }
  showMapRoutes() {
    window.setTimeout(() => {

      let status = this.props.model.middleFilterModel.filterRoutesSelected;
      let routes = Utility.getFilteredRoutes(this.props.model.rightSideModel.allRoutes,
        this.props.model.rightSideModel.filtersModel.selectedBorough,
        this.props.model.rightSideModel.filtersModel.selectedSite,
        this.props.model.rightSideModel.filtersModel.selectedTeam);

      if (routes && routes.length) {
        DashboardMapService.showLayers({
          routes: routes,
          selectedStatus: status,
          inProgress: this.props.model.middleFilterModel.routeProgressOn,
          selectedBorough: this.getBoroughNameForMap(),
          selectedSite: this.props.model.rightSideModel.filtersModel.selectedSite,
          selectedSector: null
        }, (status.value == 1), this.props.model.middleFilterModel.filterRoutesModel, this.props.model.rightSideModel.teams, this.props.model.middleFilterModel.routeProgressOn, false, this.props);
      }

      let allFilteredRoutes = Utility.getRoutesWithStatusFilter(routes, status);
      this.props.dispatch(Action.getAction(dashboardActionTypes.SET_MAP_NO_ROUTES_FOUND, !(allFilteredRoutes && allFilteredRoutes.length)));
    }, 0);
  }
  render() {
    return (
      <div className="dashboard-view  map-view">
        {this.props.model.middleFilterModel.panelProperties.mapNoRoutesFound && !(this.props.model.middleFilterModel.panelProperties.panelReload) ? <div className="no-routes-on-map">{Constants.messages.noRoutesOnMap}</div> : ''}
        <div id="mapviewBody" className={(this.props.model.middleFilterModel.panelProperties.panelCollapsed ? ' height-0 ' : '')}></div>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    model: state.dashboardModel
  }
};

export default connect(mapStateToProps)(MapViewComponent);