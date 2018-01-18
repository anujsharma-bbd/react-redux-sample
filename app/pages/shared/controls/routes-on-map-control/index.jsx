import React from "react";
import ReactDOM from 'react-dom';
import Modal from 'tg-modal';
import { connect } from 'react-redux';
import Select from "react-select";
import { menuRenderer } from "../menu-renderer/";

import { sharedActionTypes } from "../../actions/sharedActionTypes";
import { dashboardActionTypes } from "../../../dashboard/actions/dashboardActionTypes";
import { adminActionTypes } from "../../../admin/actions/adminActionTypes";
import * as Action from "../../actions/action";
import { Constants } from "../../../../common/app-settings/constants"
import { Utility } from "../../../../common/utility"
import { CommonService } from '../../services/common.service';
import { DashboardMapService } from '../../../dashboard/services/dashboard-maps.service';
import { RoutesOnMapPopupService } from "../../services/route-on-map.service";
import ValidationControl from '../validation-control';

class RoutesOnMapPopup extends React.Component {

  /**
   * Constructor to initialize fields.
   */
  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.onRouteStatusChange = this.onRouteStatusChange.bind(this);
    this.showMapRoutes = this.showMapRoutes.bind(this);
    this.getBoroughNameForMap = this.getBoroughNameForMap.bind(this);
    this.showSuccessMessage = this.showSuccessMessage.bind(this);
  }
  getBoroughNameForMap() {
    let bModel = this.props.dashboardModel.rightSideModel.filtersModel.selectedBorough, sModel = this.props.dashboardModel.rightSideModel.filtersModel.selectedSite;

    if (sModel.siteId != -1) {
      let boroughId = this.props.dashboardModel.rightSideModel.sites.find((site) => site.siteId === sModel.siteId).boroughId;
      bModel = this.props.dashboardModel.rightSideModel.boroughs.find((borough) => borough.boroughId === boroughId);
    }
    return bModel;

  }
  showMapRoutes() {

  }

  //show hide error meessages
  showSuccessMessage(message, isError) {
    this.props.dispatch(Action.getAction(sharedActionTypes.SHOW_VALIDATION_MESSAGE_SHARED,
      {
        validationMessage: message,
        type: !isError ? Constants.validation.types.success.key : Constants.validation.types.error.key,
        isPopup: false
      }));
    window.setTimeout(() => {
      this.props.dispatch(Action.getAction(sharedActionTypes.SHOW_VALIDATION_MESSAGE_SHARED,
        {
          validationMessage: Constants.emptyString,
          type: Constants.validation.types.success.key,
          isPopup: false
        }));
    }, (Constants.messages.defaultMessageTimeout / 2));
  }
  componentDidMount() {
    RoutesOnMapPopupService.initRouteMap(() => {
      if (this.props.model.routesOnMap.routeObject)
        RoutesOnMapPopupService.showLayers(this.props.model.routesOnMap.routeObject, this.props.model.filterRoutesStatuses);
      this.props.dispatch(Action.getAction(sharedActionTypes.SET_ROUTE_ON_MAP_OPENED_LOADER, { popupLoaderShown: false, isOpened: true }));
    });
  }
  // on popup close handler
  onClose() {
    this.props.dispatch(Action.getAction(sharedActionTypes.SET_ROUTE_ON_MAP_OPENED_LOADER, { popupLoaderShown: false, isOpened: false }));
  }

  // on statsus change
  onRouteStatusChange(newStatus) {
    this.props.dispatch(Action.getAction(sharedActionTypes.SET_ROUTE_ON_MAP_OPENED_LOADER, { popupLoaderShown: true, isOpened: true }));
    RoutesOnMapPopupService.updateRouteStatus(this.props.model.routesOnMap.routeObject[0], newStatus, this.props.model.countInstanceStatus).then(response => {
      this.props.dispatch(Action.getAction(sharedActionTypes.SET_ROUTE_ON_MAP_OPENED_LOADER, { popupLoaderShown: false, isOpened: true }));
      if (response.errors && response.errors.length) {
        this.showSuccessMessage(Constants.messages.commonMessages.someErrorOccured, true);
      }
      else {
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_ROUTE_STATUS_ON_MAP, newStatus));
        this.showSuccessMessage(Constants.messages.routeOnMap.statusChanged, false);
        this.props.dispatch(Action.getAction(dashboardActionTypes.SET_ROUTE_STATUS_ON_MAP_DASH, { newStatus: newStatus, countInstanceStatuses: this.props.model.countInstanceStatus, routeObject: this.props.model.routesOnMap.routeObject[0] }));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTE_STATUS_ON_MAP_ADMIN, { newStatus: newStatus, countInstanceStatuses: this.props.model.countInstanceStatus, routeObject: this.props.model.routesOnMap.routeObject[0] }));
        if (this.props.model.tabs.find((tab) => (tab.isSelected == true && tab.key == Constants.dashBoardViewKey.mapView))) {
          DashboardMapService.initMap(() => {
            let status = this.props.dashboardModel.middleFilterModel.filterRoutesSelected;
            let routes = Utility.getFilteredRoutes(this.props.dashboardModel.rightSideModel.allRoutes,
              this.props.dashboardModel.rightSideModel.filtersModel.selectedBorough,
              this.props.dashboardModel.rightSideModel.filtersModel.selectedSite,
              this.props.dashboardModel.rightSideModel.filtersModel.selectedTeam);

            if (routes && routes.length) {
              DashboardMapService.showLayers({
                routes: routes,
                selectedStatus: status,
                inProgress: this.props.dashboardModel.middleFilterModel.routeProgressOn,
                selectedBorough: this.getBoroughNameForMap(),
                selectedSite: this.props.dashboardModel.rightSideModel.filtersModel.selectedSite,
                selectedSector: null
              }, (status.value == 1), this.props.dashboardModel.middleFilterModel.filterRoutesModel, this.props.dashboardModel.rightSideModel.teams, this.props.dashboardModel.middleFilterModel.routeProgressOn, false, this.props);
            }

            let allFilteredRoutes = Utility.getRoutesWithStatusFilter(routes, status);
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_MAP_NO_ROUTES_FOUND, !(allFilteredRoutes && allFilteredRoutes.length)));
          })

        }
        RoutesOnMapPopupService.initRouteMap(() => {
          RoutesOnMapPopupService.showLayers(this.props.model.routesOnMap.routeObject, this.props.model.filterRoutesStatuses);
        });
      }
    }).catch(m => {
      this.props.dispatch(Action.getAction(sharedActionTypes.SET_ROUTE_ON_MAP_OPENED_LOADER, { popupLoaderShown: false, isOpened: true }));
      this.showSuccessMessage(Constants.messages.commonMessages.someErrorOccured, true);
    })

  }

  /**
   * Render view.
   */
  render() {
    let routesOnMap = this.props.model.routesOnMap;
    let route = routesOnMap.routeObject[0];
    if (!route.countInstanceStatus || !route.countInstanceStatus.length) {
      route.countInstanceStatus = [this.props.model.countInstanceStatus.find(m => m.label.toLowerCase() == Constants.routesStatus.not_started.toLowerCase())];
    }
    let selectedStatus = this.props.model.filterRoutesStatuses.find(m => route.countInstanceStatus[0].label && m.key.toLowerCase() == route.countInstanceStatus[0].label.toLowerCase());
    return (
      <div className="container route-on-map-popup">
        <Modal isOpen={this.props.isOpen} autoWrap title={(routesOnMap.team ? ("Team : " + routesOnMap.team.label) : ("Route : " + (route.label || route.name)))} isStatic={this.props.loader} onCancel={(e) => this.onClose()} >
          {this.props.loader ? <div className="model-loader"><span className="spinner"></span></div> : ''}
          <ValidationControl message={this.props.model.validation.message} type={this.props.model.validation.type} isPopup={this.props.model.validation.isPopup} />
          <span className="site-borough-route"><label><b>Site:&nbsp;</b></label>{route.siteName} </span>
          {!routesOnMap.team ?
            <div className="route-change-status pull-right">
              <label className="pull-left"><b>Status: </b></label>
              <div className="route-select-container">
                <Select value={selectedStatus} valueKey="key" labelKey="label" searchable={false} clearable={false}
                  menuRenderer={menuRenderer} disabled={this.props.loader}
                  name="form-field-name" onChange={this.onRouteStatusChange} options={this.props.model.filterRoutesStatuses} />
              </div>
            </div>
            : ''
          }
          <div id="routeOnMapBody"></div>
          <div className="footer-bar">
            <button className="button pull-right" onClick={() => this.onClose()}>Close</button>
            <div className="clear"></div>
          </div>
        </Modal>
      </div>

    );
  }
}


const mapStateToProps = (state) => {
  return {
    model: state.sharedModel,
    dashboardModel: state.dashboardModel
  }
}


export default connect(mapStateToProps)(RoutesOnMapPopup);