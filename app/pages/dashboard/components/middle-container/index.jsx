import React from "react";
import { connect } from 'react-redux';
import Select from "react-select";
import ToggleButton from 'react-toggle-button';
import { Link, IndexLink } from 'react-router';
import MapLegendBar from "./legend-bar/";
import { DashboardMapService } from "../../services/dashboard-maps.service";
import { dashboardActionTypes } from "../../actions/dashboardActionTypes";
import { sharedActionTypes } from "../../../shared/actions/sharedActionTypes";
import * as Action from "../../../shared/actions/action";
import ToolBoxControl from "../../../shared/controls/tool-box-control/";
import FilterComponent from "../right-container/filter.component";
import { DashboardService } from '../../services/dashboard.services';
import { CommonService } from '../../../shared/services/common.service';
import { Utility } from "../../../../common/utility/";
import MapRefreshControl from "../controls/map-refresh-control/";
import { menuRenderer } from "../../../shared/controls/menu-renderer/";
import ValidationControl from "../../../shared/controls/validation-control";
import { Constants } from "../../../../common/app-settings/constants";
import { ListMenu } from "../controls/list-menu-item/"

class DashboardMiddleContainer extends React.Component {

    constructor(props) {
        super(props);
        this.keys = { mapview: Constants.dashBoardViewKey.mapView, listview: Constants.dashBoardViewKey.listView, dataview: Constants.dashBoardViewKey.dataView, filterSector: Constants.dashBoardViewKey.filterSector, filterRoute: Constants.dashBoardViewKey.filterRoute, progressToggle: Constants.dashBoardViewKey.progressToggle, keywordsearch: Constants.dashBoardViewKey.keywordsearch };
        this.onFilterChange = this.onFilterChange.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onMapReload = this.onMapReload.bind(this);
        this.showMapRoutes = this.showMapRoutes.bind(this);
        this.getBoroughNameForMap = this.getBoroughNameForMap.bind(this);
        this.registerAutoRefresh = this.registerAutoRefresh.bind(this);
        this.showErrorMessage = this.showErrorMessage.bind(this);
        this.loadAllRoutes = this.loadAllRoutes.bind(this);
    }
    /**
     * call whem Component complete its cycle
     */
    componentWillUnmount() {
        Utility.clearInterval();
        Utility.abortAllPromises(() => {
            // hide loader image
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, false));

        });
    }
    registerAutoRefresh() {
        Utility.setInterval(() => {
            Utility.abortAllPromises(() => {
                this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, false));
            });
            this.onMapReload();

        }, this.props.model.middleFilterModel.panelProperties.panelAutoReloadInterval);
    }
    getBoroughNameForMap() {
        let bModel = this.props.model.rightSideModel.filtersModel.selectedBorough, sModel = this.props.model.rightSideModel.filtersModel.selectedSite;

        if (sModel.siteId != -1) {
            let boroughId = this.props.model.rightSideModel.sites.find((site) => site.siteId === sModel.siteId).boroughId;
            bModel = this.props.model.rightSideModel.boroughs.find((borough) => borough.boroughId === boroughId);
        }
        return bModel;

    }
    // on Zone/Site/Team change event
    onFilterChange(type, selection) {

        if (type === this.keys.filterRoute) {

            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_FILTER_ROUTE, selection));
            let status = selection, routes = Utility.getFilteredRoutes(this.props.model.rightSideModel.allRoutes,
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
                }, (selection.value == 1), this.props.model.middleFilterModel.filterRoutesModel, this.props.model.rightSideModel.teams, this.props.model.middleFilterModel.routeProgressOn, false, this.props);
            }

            let allFilteredRoutes = Utility.getRoutesWithStatusFilter(routes, status);
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_MAP_NO_ROUTES_FOUND, !(allFilteredRoutes && allFilteredRoutes.length)));
        }
        else if (type === this.keys.progressToggle) {
            selection = !selection;
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_ROUTE_PROGRESS, selection));
            let status = this.props.model.middleFilterModel.filterRoutesSelected, routes = Utility.getFilteredRoutes(this.props.model.rightSideModel.allRoutes,
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
                }, (this.props.model.middleFilterModel.filterRoutesSelected.value == 1), this.props.model.middleFilterModel.filterRoutesModel, this.props.model.rightSideModel.teams, selection, true, this.props);
            }

            let allFilteredRoutes = Utility.getRoutesWithStatusFilter(routes, status);
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_MAP_NO_ROUTES_FOUND, !(allFilteredRoutes && allFilteredRoutes.length)));
        }
        else if (type === this.keys.keywordsearch) {
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_MAP_KEYWORD_SEARCH, selection));
            DashboardMapService.setMap({
                keySearch: selection,
                status: selection,
                inProgress: this.props.model.middleFilterModel.routeProgressOn
            });
        }


    }
    onWindowResize() {
        Utility.onWindowResize();
    }
    onMapReload() {
        this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, true));
        this.props.dispatch(Action.getAction(dashboardActionTypes.SET_LOADING_SURVEYS, true));
        window.mapPromises = [];

        let filterPromise = DashboardService.getActiveCountInstance().then(mappedData => {
            this.props.dispatch(Action.getAction(sharedActionTypes.SET_ACTIVE_COUNT_INSTANCE, mappedData));

            if (this.props.sharedModel.selectedQCInstances.length > 0) {
                DashboardService.getFiltersData(this.props.sharedModel.selectedQCInstances)
                    .then(mappedData => {
                        this.props.dispatch(Action.getAction(dashboardActionTypes.SET_FILTERS_ON_RELOAD, mappedData));
                        this.props.dispatch(Action.getAction(sharedActionTypes.SET_COUNT_INSTANCE_STATUS, mappedData.countInstanceStatus));
                        this.loadAllRoutes();
                    }).catch((error) => {
                        this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, false));
                        this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
                    });
            } else {
                this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, false));
                this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, "No active counts."));
            }

        }).catch(error => {
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, false));
            this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
        });



        window.mapPromises.push(filterPromise);
    }
    // loads all routes
    loadAllRoutes() {
        // fetch all routes for all boroughs then apply filtering after filter change on right side
        let promiseRoutes = DashboardService.getRoutesList(this.props.sharedModel.selectedQCInstances)
            .then(mappedData => {
                // all routes shown on MAP
                this.props.dispatch(Action.getAction(dashboardActionTypes.SET_ROUTES_DATA, mappedData));
                // show routes on google map if map view tab is selected
                if (((this.props.sharedModel.tabs.filter((tab, index) => tab.key == this.keys.mapview && tab.isSelected)).length > 0)) {
                    this.showMapRoutes();
                }

                // mark timespan request executed on
                this.props.dispatch(Action.getAction(dashboardActionTypes.SET_MAP_LAST_UPDATED_ON, {}));
            });
        window.mapPromises.push(promiseRoutes);
    }
    // show messages
    showErrorMessage(message, type) {
        if (!type) {
            type = Constants.validation.types.error;
        }
        this.props.dispatch(Action.getAction(dashboardActionTypes.SET_DASHBOARD_ERROR_MESSAGE, { message: message, type: type }));
        window.setTimeout(() => {
            this.showErrorMessage(Utility.stringFormat(Constants.emptyString, Constants.emptyString));
        }, Constants.messages.defaultMessageTimeout);
    }
    // show all routes on Map
    showMapRoutes(stopWindowResize = false) {
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

            if (!stopWindowResize)
                this.onWindowResize();

        }, 0);
    }
    render() {

        let model = this.props.model;
        let mapviewTabSelected = ((this.props.sharedModel.tabs.filter((tab, index) => tab.key == this.keys.mapview && tab.isSelected)).length > 0);
        let dataviewTabSelected = ((this.props.sharedModel.tabs.filter((tab, index) => tab.key == this.keys.dataview && tab.isSelected)).length > 0);
        let routeProgressOn = model.middleFilterModel.routeProgressOn;
        let selectTab = this.props.sharedModel.tabs && this.props.sharedModel.tabs.find((tab) => tab.category === Constants.menuCategory.dashboard && tab.isSelected)
        let tabText = selectTab && selectTab.text;
        return (
            <div id="content" className={"content " + (dataviewTabSelected ? " data-view-full-stage " : '')}>

                <div className="clearfix hide" >
                    <h1 className="page-header">Dashboard</h1>
                    <div className="right-side-navigator nav-route-canv">
                        {

                            this.props.sharedModel.tabs.filter((tab) => tab.category === Constants.menuCategory.dashboard).map((tab, index) => {
                                return (CommonService.isSFOUser() && tab.key == Constants.dashBoardViewKey.dataView) ? '' :
                                    <ListMenu dispatch={this.props.dispatch} key={"tab-" + index} TabKey={tab.key} To={'/' + tab.category + '/' + tab.key + '/'} Text={tab.text} IsSelected={tab.isSelected}>
                                    </ListMenu>
                            }
                            )
                        }
                    </div>
                </div>
                <div className="clear"></div>
                <div className="validation_success_main center-horizontal">
                    <ValidationControl message={model.validation.message} type={model.validation.type.key} isPopup={model.validation.isPopup} />
                </div>
                <div className={" panel panel-inverse btmZero" + (model.middleFilterModel.panelProperties.panelExpanded ? " panel-expand " : '')}>
                    <div className={"panel-heading " + (selectTab.category == Constants.menuCategory.dashboard ? " border-radius-0 ":'')}>
                        <ToolBoxControl dataModel={model.middleFilterModel.panelProperties}
                            onExpand={() => {
                                this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_EXPAND_DASHBOARD, {}));
                                this.onWindowResize();
                            }}
                            onReload={() => {
                                this.onMapReload();
                            }}
                            onCollapse={() => {
                                this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_COLLAPSE_DASHBOARD, {}));
                                this.onWindowResize();
                            }}
                            onRemove={() => {
                                this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_REMOVE_DASHBOARD, {}));
                            }}
                        />
                        <MapRefreshControl />
                        <h4 className="panel-title">Dashboard {tabText}</h4>
                    </div>
                    <div className={"panel-body " + (model.middleFilterModel.panelProperties.panelExpanded ? " custom-scroll " : '') + (model.middleFilterModel.panelProperties.panelCollapsed ? ' height-0 ' : '')}>
                        <div>
                            <div className={"dashbaord-filter-bar" + (dataviewTabSelected ? " displaynone " : "")}>
                                <table cellSpacing="0" cellPadding="0" className="dash-filter-table">
                                    <tbody>
                                        <tr>
                                            <td className="filter-keywordsearch displaynone">
                                                <label>
                                                    Keyword Search
                                                            </label>
                                                <Select menuRenderer={menuRenderer} disabled={true || model.middleFilterModel.panelProperties.panelReload} searchable={true} options={model.middleFilterModel.searchKeywords.options} value={model.middleFilterModel.searchKeywords.selectedOption} onChange={(value) => { this.onFilterChange(this.keys.keywordsearch, value) }} />
                                            </td>

                                            <td className="filter-routes">
                                                <label>
                                                    Filter by Progress
                                                            </label>
                                                <Select menuRenderer={menuRenderer} searchable={false} options={model.middleFilterModel.filterRoutesModel} disabled={model.middleFilterModel.filterRoutesModel.length == 0} value={model.middleFilterModel.filterRoutesSelected} clearable={false} onChange={(value) => { this.onFilterChange(this.keys.filterRoute, value) }} disabled={model.middleFilterModel.panelProperties.panelReload} />
                                            </td>
                                            <td className="filter-progress">
                                                {
                                                    mapviewTabSelected ?
                                                        <div>
                                                            <label>
                                                                Track Progress
                                                                        </label>
                                                            <span className={routeProgressOn ? 'toggle-button toggle-on' : 'toggle-button toggle-off'}>
                                                                <ToggleButton value={routeProgressOn} disabled={model.middleFilterModel.panelProperties.panelReload} onToggle={(e) => this.onFilterChange(this.keys.progressToggle, routeProgressOn)} />
                                                            </span> </div>
                                                        : ''
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <span className="legend">Legend</span>                                
                                <MapLegendBar />
                            </div>
                            <div className="dahsboard-content">
                                {
                                    this.props.children
                                }
                                {model.middleFilterModel.panelProperties.panelReload || ((mapviewTabSelected && !model.middleFilterModel.panelProperties.geoJSONLoaded)) ? <div className="panel-loader"><span className="spinner-small"></span></div> : ''}
                            </div>

                        </div>

                    </div>
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

export default connect(mapStateToProps)(DashboardMiddleContainer);
