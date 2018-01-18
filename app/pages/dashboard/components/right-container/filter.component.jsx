import React from "react";
import Select from "react-select"; // dropdown control
import { connect } from "react-redux";
import fetch from "isomorphic-fetch"; // ajax service call
import RouteProgressComponent from './routes-progress.component';
import { DashboardMapService } from "../../services/dashboard-maps.service";
import { DashboardService } from '../../services/dashboard.services';
import { dashboardActionTypes } from "../../actions/dashboardActionTypes";
import { sharedActionTypes } from "../../../shared/actions/sharedActionTypes";
import * as Action from "../../../shared/actions/action";
import { Utility } from "../../../../common/utility/";
import { menuRenderer } from "../../../shared/controls/menu-renderer/";
import { CommonService } from '../../../shared/services/common.service';
import { Constants } from "../../../../common/app-settings/constants";

/**
 * FilterComponent.
 * Containing borough, site and team dropdowns.
 * Filters data in dropdown based on their selected dependent value and sorts the data in dropdowns.
 * Also, contains RouteProgressComponent .
 */
class FilterComponent extends React.Component {

  /**
   * Constructor to initialize fields
   */
  constructor(props) {
    super(props);
    this.onBoroughKeywordSearchChange = this.onBoroughKeywordSearchChange.bind(this);
    this.onSiteKeywordSearchChange = this.onSiteKeywordSearchChange.bind(this);
    this.onTeamKeywordSearchChange = this.onTeamKeywordSearchChange.bind(this);
    this.fetchFiltersData = this.fetchFiltersData.bind(this);
    this.showMapRoutes = this.showMapRoutes.bind(this);
    this.loadAllRoutes = this.loadAllRoutes.bind(this);
    this.getBoroughNameForMap = this.getBoroughNameForMap.bind(this);
    this.keys = { mapview: Constants.dashBoardViewKey.mapView, listview: Constants.dashBoardViewKey.listView, dataview: Constants.dashBoardViewKey.dataView };
    this.getSelectedTab = this.getSelectedTab.bind(this);
    this.showErrorMessage = this.showErrorMessage.bind(this);
    this.changeTeamIdforSafari = this.changeTeamIdforSafari.bind(this);
    this.isSFOUser = false;
  }

  /**
   * Fetch filters data before a component will mount.
   */
  componentDidMount() {
    this.isSFOUser = CommonService.isSFOUser();
    this.fetchFiltersData();
    this.filteredSites = this.props.model.rightSideModel.sites;
    this.filteredTeams = this.props.model.rightSideModel.teams;
  }

  /**
   * The component should only update if the nextProps have selectedBorough, selectedSite and selectedTeam
   */
  shouldComponentUpdate(nextProps, nextState) {
    return ((Object.keys(nextProps.model.rightSideModel.filtersModel.selectedBorough).length > 0) && (Object.keys(nextProps.model.rightSideModel.filtersModel.selectedSite).length > 0) && (Object.keys(nextProps.model.rightSideModel.filtersModel.selectedTeam).length > 0));
  }

  /**
   * Gets the selected tab - MapView, ListView or DataView
   */
  getSelectedTab() {
    let key = Constants.emptyString;
    if ((this.props.location.pathname.toLowerCase().indexOf(this.keys.mapview) >= 0) || (this.props.location.pathname.toLowerCase() === Constants.pathNames.dashboard[0]) || (this.props.location.pathname.toLowerCase() === Constants.pathNames.dashboard[1]))
      key = this.keys.mapview;
    else if (this.props.location.pathname.toLowerCase().indexOf(this.keys.listview) >= 0)
      key = this.keys.listview;
    else if (this.props.location.pathname.toLowerCase().indexOf(this.keys.dataview) >= 0)
      key = this.keys.dataview;

    return key;
  }

  /**
   * Loads all data required for all view on dashboard like MapView, ListView and DataView
   * The function fetches surveys submitted, routes list and dispatches action to update state.
   */
  loadAllRoutes() {
    this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, true));

    // fetch all routes for all boroughs then apply filtering after filter change on right side
    const contextAssignmentIds = this.props.sharedModel.selectedQCInstances
    DashboardService.getRoutesList(contextAssignmentIds)
      .then(mappedData => {
        this.props.dispatch(Action.getAction(dashboardActionTypes.SET_ROUTES_DATA, mappedData));
        this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, false));
        if (this.getSelectedTab() == this.keys.mapview) {
          // show routes on google map
          this.showMapRoutes();
        }
        // mark timespan request executed on
        this.props.dispatch(Action.getAction(dashboardActionTypes.SET_MAP_LAST_UPDATED_ON, {}));
      })
      .catch(error => {
        this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, false));
        this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
      }
      );
  }

  /**
   * Event handler when borough dropdown selected value changes
   */
  onBoroughKeywordSearchChange(value) {
    this.props.dispatch(Action.getAction(dashboardActionTypes.SET_DASH_BOROUGH, { value: value }));
    let flag = (value.boroughId == -1 ? Constants.surveysSubmittedType.all : Constants.surveysSubmittedType.borough);

    const qcis = this.props.sharedModel.selectedQCInstances
    let contextAssignmentIds;
    if (value.boroughId == -1) {
      contextAssignmentIds = qcis
    } else {
      contextAssignmentIds = qcis.concat([value.boroughId])
    }
    this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, true));
    DashboardService.getSurveysSubmittedCountByAreaAndId(flag, contextAssignmentIds)
      .then(mappedData => {
        this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, false));
        this.props.dispatch(Action.getAction(dashboardActionTypes.SET_SURVEYS_SUBMITTED, { area: flag, data: mappedData }));
      }).catch(error => {
        this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, false));
        this.showErrorMessage(Constants.messages.commonMessages.someErrorOccured);
      });


    if (this.getSelectedTab() == this.keys.mapview) {
      // show routes on google map
      this.showMapRoutes();
    }
  }
  /**
   * Event handler when site dropdown selected value changes
   */
  onSiteKeywordSearchChange(value) {
    this.props.dispatch(Action.getAction(dashboardActionTypes.SET_DASH_SITE, { value: value }));
    this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, true));
    const qcis = this.props.sharedModel.selectedQCInstances
    let contextAssignmentIds;
    if (value.siteId === -1) {
      if (this.props.model.rightSideModel.filtersModel.selectedBorough.boroughId === -1) {
        contextAssignmentIds = qcis
        DashboardService.getSurveysSubmittedCountByAreaAndId(Constants.surveysSubmittedType.all, contextAssignmentIds)
          .then(mappedData => {
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, false));
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_SURVEYS_SUBMITTED, { area: Constants.surveysSubmittedType.all, data: mappedData }));
          })
          .catch(error => {
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, false));
            this.showErrorMessage(Constants.messages.commonMessages.someErrorOccured);
          });
      } else {
        contextAssignmentIds = qcis.concat([this.props.model.rightSideModel.filtersModel.selectedBorough.boroughId])
        DashboardService.getSurveysSubmittedCountByAreaAndId(Constants.surveysSubmittedType.borough, contextAssignmentIds)
          .then(mappedData => {
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, false));
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_SURVEYS_SUBMITTED, { area: Constants.surveysSubmittedType.borough, data: mappedData }));
          })
          .catch(error => {
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, false));
            this.showErrorMessage(Constants.messages.commonMessages.someErrorOccured);
          });
      }
    } else {
      contextAssignmentIds = qcis.concat([value.siteId])
      DashboardService.getSurveysSubmittedCountByAreaAndId(Constants.surveysSubmittedType.site, contextAssignmentIds)
        .then(mappedData => {
          this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, false));
          this.props.dispatch(Action.getAction(dashboardActionTypes.SET_SURVEYS_SUBMITTED, { area: Constants.surveysSubmittedType.site, data: mappedData }));
        })
        .catch(error => {
          this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, false));
          this.showErrorMessage(Constants.messages.commonMessages.someErrorOccured);
        });
    }
    if (this.getSelectedTab() == this.keys.mapview) {
      // show routes on google map
      this.showMapRoutes();
    }
  }


  /**
   * Event handler when team dropdown selected value changes
   */
  onTeamKeywordSearchChange(value) {
    this.props.dispatch(Action.getAction(dashboardActionTypes.SET_DASH_TEAM, { value: value }));
    this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, true));
    //set surveys submitted to all if selected borough or site or team is "All" otherwise the selected borough or site or team
    const qcis = this.props.sharedModel.selectedQCInstances;
    let contextAssignmentIds;
    if (value.teamId == -1) {
      if (this.props.model.rightSideModel.filtersModel.selectedSite.siteId == -1) {
        if (this.props.model.rightSideModel.filtersModel.selectedBorough.boroughId == -1) {
          contextAssignmentIds = qcis
          DashboardService.getSurveysSubmittedCountByAreaAndId(Constants.surveysSubmittedType.all, contextAssignmentIds)
            .then(mappedData => {
              this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, false));
              this.props.dispatch(Action.getAction(dashboardActionTypes.SET_SURVEYS_SUBMITTED, { area: Constants.surveysSubmittedType.all, data: mappedData }));
            })
            .catch(error => {
              this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, false));
              this.showErrorMessage(Constants.messages.commonMessages.someErrorOccured);
            });
        } else {
          contextAssignmentIds = qcis.concat([this.props.model.rightSideModel.filtersModel.selectedBorough.boroughId])
          DashboardService.getSurveysSubmittedCountByAreaAndId(Constants.surveysSubmittedType.borough, contextAssignmentIds)
            .then(mappedData => {
              this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, false));
              this.props.dispatch(Action.getAction(dashboardActionTypes.SET_SURVEYS_SUBMITTED, { area: Constants.surveysSubmittedType.borough, data: mappedData }));
            })
            .catch(error => {
              this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, false));
              this.showErrorMessage(Constants.messages.commonMessages.someErrorOccured);
            });
        }

      } else {
        contextAssignmentIds = qcis.concat([this.props.model.rightSideModel.filtersModel.selectedSite.siteId])
        DashboardService.getSurveysSubmittedCountByAreaAndId(Constants.surveysSubmittedType.site, contextAssignmentIds)
          .then(mappedData => {
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, false));
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_SURVEYS_SUBMITTED, { area: Constants.surveysSubmittedType.site, data: mappedData }));
          })
          .catch(error => {
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, false));
            this.showErrorMessage(Constants.messages.commonMessages.someErrorOccured);
          });
      }
    }
    else {
      contextAssignmentIds = qcis.concat([value.teamId])
      DashboardService.getSurveysSubmittedCountByAreaAndId(Constants.surveysSubmittedType.team, contextAssignmentIds)
        .then(mappedData => {
          this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, false));
          this.props.dispatch(Action.getAction(dashboardActionTypes.SET_SURVEYS_SUBMITTED, { area: Constants.surveysSubmittedType.team, data: mappedData }));
        })
        .catch(error => {
          this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, false));
          this.showErrorMessage(Constants.messages.commonMessages.someErrorOccured);
        });
    }
    if (this.getSelectedTab() == this.keys.mapview) {
      // show routes on google map
      this.showMapRoutes();
    }
  }

  /**
   * Show routes on map.
   */
  showMapRoutes() {
    window.setTimeout(() => {

      let status = this.props.model.middleFilterModel.filterRoutesSelected;
      let routes = Utility.getFilteredRoutes(this.props.model.rightSideModel.allRoutes,
        this.props.model.rightSideModel.filtersModel.selectedBorough,
        this.props.model.rightSideModel.filtersModel.selectedSite,
        this.props.model.rightSideModel.filtersModel.selectedTeam);
      DashboardMapService.showLayers({
        routes: routes,
        selectedStatus: status,
        inProgress: this.props.model.middleFilterModel.routeProgressOn,
        selectedBorough: this.getBoroughNameForMap(),
        selectedSite: this.props.model.rightSideModel.filtersModel.selectedSite,
        selectedSector: null
      }, (status.value == 1), this.props.model.middleFilterModel.filterRoutesModel, this.props.model.rightSideModel.teams, this.props.model.middleFilterModel.routeProgressOn, false, this.props);

      let allFilteredRoutes = Utility.getRoutesWithStatusFilter(routes, status);
      this.props.dispatch(Action.getAction(dashboardActionTypes.SET_MAP_NO_ROUTES_FOUND, !(allFilteredRoutes && allFilteredRoutes.length)));

    }, 0);

  }

  /**
   * Fetch data for filters from the service.
   * Also, show team markers on map and loads routes data.
   */
  fetchFiltersData() {
    this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, true));

    DashboardService.getActiveCountInstance().then(mappedData => {
      this.props.dispatch(Action.getAction(sharedActionTypes.SET_ACTIVE_COUNT_INSTANCE, mappedData));

      if (this.props.sharedModel.selectedQCInstances.length > 0) {
        DashboardService.getFiltersData(this.props.sharedModel.selectedQCInstances)
          .then(mappedData => {
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_FILTERS, mappedData));
            this.props.dispatch(Action.getAction(sharedActionTypes.SET_COUNT_INSTANCE_STATUS, mappedData.countInstanceStatus));
            this.loadAllRoutes();
          })
          .catch(error => {
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, false));
            this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
          });

      } else {
        this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, false));
        this.showErrorMessage(Utility.stringFormat(Constants.messages.countsModel.noActiveCountInstanceFound));
      }

    }).catch(error => {
      this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, false));
      this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
    });


  }
  showErrorMessage(message, type) {
    if (!type) {
      type = Constants.validation.types.error;
    }
    this.props.dispatch(Action.getAction(dashboardActionTypes.SET_DASHBOARD_ERROR_MESSAGE, { message: message, type: type }));
    window.setTimeout(() => {
      this.showErrorMessage(Utility.stringFormat(Constants.emptyString, Constants.emptyString));
    }, Constants.messages.defaultMessageTimeout);
  }
  /**
   * Get borough name for map from the selected borough
   */
  getBoroughNameForMap() {
    //get selected borough and site
    let bModel = this.props.model.rightSideModel.filtersModel.selectedBorough, sModel = this.props.model.rightSideModel.filtersModel.selectedSite;
    //get borough for the selected site
    if (sModel.siteId != -1) {
      let Borough = this.props.model.rightSideModel.sites.find((site) => site.siteId === sModel.siteId);
      if (Borough && Borough.boroughId) {
        bModel = this.props.model.rightSideModel.boroughs.find((borough) => borough.boroughId === Borough.boroughId);
      }
    }
    return bModel;

  }

  /**
   * Filter options for borough dropdown.
   * This functions sorts the values in borough dropdown list.
   */
  boroughsFilterOptions(boroughs) {
    boroughs.sort(function (a, b) {
      return a.boroughName.trim() < b.boroughName.trim() ? -1 : a.boroughName.trim() > b.boroughName.trim() ? 1 : 0;
    });
    // if there is only one borough set that selected
    let allboroughs = boroughs.filter(m => m.boroughId != -1);
    if (allboroughs && allboroughs.length == 1) {
      boroughs = allboroughs;
    }
  }

  /**
   * Filter options for Site dropdown.
   * This functions first filters the sites based on the borough selected and then sorts the sites data.
   */
  siteFilterOptions(selectedBoroughValue) {
    if (selectedBoroughValue.boroughId == -1) {
      this.filteredSites = this.props.model.rightSideModel.sites.filter((site) => (site.siteId == -1));
    } else {
      this.filteredSites = this.props.model.rightSideModel.sites.filter((site) => (site.siteId == -1 || site.boroughId == selectedBoroughValue.boroughId));
    }
    this.filteredSites.sort(function (a, b) {
      return a.siteName.trim() < b.siteName.trim() ? -1 : a.siteName.trim() > b.siteName.trim() ? 1 : 0;
    });

    // if there is only one site make that selected in drop down
    let allSites = this.filteredSites.filter(m => m.siteId != -1);
    if (allSites && allSites.length == 1)
      this.filteredSites = allSites;

  }

  /**
   * Filter options for Team dropdown.
   * This functions first filters the teams based on the site selected and then sorts the filtered teams data.
   */
  teamFilterOptions(selectedBoroughValue, selectedSiteValue) {

    if (selectedBoroughValue.boroughId == -1 || selectedSiteValue.siteId == -1) {
      this.filteredTeams = this.props.model.rightSideModel.teams.filter((team) => (team.teamId == -1));
    }
    else {
      this.filteredTeams = this.props.model.rightSideModel.teams.filter((team) => (team.teamId == -1 || (team.siteId == selectedSiteValue.siteId && team.boroughId == selectedBoroughValue.boroughId)));
    }
    this.filteredTeams.sort(Utility.sortTeamByNameAsc("teamLabel"));

    // if there is only one team make that selected
    let allTeams = this.filteredTeams.filter(m => m.teamId != -1);
    if (allTeams && allTeams.length == 1)
      this.filteredTeams = allTeams;
    this.changeTeamIdforSafari();
  }
  // option All is coming at bottom in Safari
  changeTeamIdforSafari() {
    if (this.filteredTeams && this.filteredTeams.length) {
      this.filteredTeams.forEach((team, index) => {
        if (team.teamId == -1 && index == this.filteredTeams.length - 1) {
          let lastObj = this.filteredTeams.pop();
          this.filteredTeams.splice(0, 0, lastObj);
        }
      })
    };
  }

  /**
   * FilterComponent render
   */
  render() {

    let selectedBoroughValue = this.props.model.rightSideModel.filtersModel.selectedBorough;
    let selectedSiteValue = this.props.model.rightSideModel.filtersModel.selectedSite;
    let selectedTeamValue = this.props.model.rightSideModel.filtersModel.selectedTeam;
    this.isSFOUser = CommonService.isSFOUser();
    return (
      <div className="right-side-filter">
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            {
              !this.isSFOUser ? <tr><td className="filter-boroughs">
                <label>Borough</label>
                <Select value={selectedBoroughValue} valueKey="boroughId" labelKey="boroughName" searchable={false} clearable={false}
                  menuRenderer={menuRenderer} filterOptions={this.boroughsFilterOptions(this.props.model.rightSideModel.boroughs)}
                  name="boroughSelect" onChange={this.onBoroughKeywordSearchChange} options={this.props.model.rightSideModel.boroughs}
                  disabled={this.props.model.middleFilterModel.panelProperties.panelReload || (this.props.model.rightSideModel.boroughs && this.props.model.rightSideModel.boroughs.length <= 1)} />
              </td>
              </tr>
                : null}
            {
              !this.isSFOUser ? <tr>
                <td>&nbsp;</td>
              </tr> : null
            }
            <tr>
              <td className="filter-boroughs">
                <label>Site</label>
                <Select value={selectedSiteValue} valueKey="siteId" labelKey="siteName" searchable={false} clearable={false}
                  menuRenderer={menuRenderer} filterOptions={this.siteFilterOptions(selectedBoroughValue)} name="siteSelect" onChange={this.onSiteKeywordSearchChange}
                  options={this.filteredSites} disabled={this.props.model.middleFilterModel.panelProperties.panelReload || (this.filteredSites && this.filteredSites.length <= 1)} />
              </td>
            </tr>
            <tr>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td className="filter-boroughs">
                <label>Team </label>
                <Select value={selectedTeamValue} valueKey="teamId" labelKey="teamLabel" searchable={false} clearable={false}
                  menuRenderer={menuRenderer} filterOptions={this.teamFilterOptions(selectedBoroughValue, selectedSiteValue)} name="teamSelect" onChange={this.onTeamKeywordSearchChange}
                  options={this.filteredTeams} disabled={this.props.model.middleFilterModel.panelProperties.panelReload || (this.filteredTeams && this.filteredTeams.length <= 1)} />
              </td>
            </tr>
            <tr>
              <td>&nbsp;</td>
            </tr>
          </tbody>
        </table>
        <div className="route-progress-component-container">
          {/** RouteProgressComponent showing circular progress chart, routes in progress and number of surveys submitted.*/}
          <RouteProgressComponent />
        </div>
      </div>
    );


  }

}

const mapStateToProps = (state) => {
  return {
    model: state.dashboardModel,
    sharedModel: state.sharedModel
  }
}
export default connect(mapStateToProps)(FilterComponent);
