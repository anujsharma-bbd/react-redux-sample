import React from "react";
import { connect } from 'react-redux';
import { IndexRoute } from 'react-router';
import Modal from 'tg-modal';
import Select from "react-select";
import { AdminCMSService } from '../../../services/admin-cms.service';
import { DashboardService } from '../../../../dashboard/services/dashboard.services';
import { adminActionTypes } from "../../../actions/adminActionTypes";
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";
import { dashboardActionTypes } from "../../../../dashboard/actions/dashboardActionTypes";
import { CommonService } from '../../../../shared/services/common.service';
import { GAService } from '../../../../shared/services/ga-service';
import * as Action from "../../../../shared/actions/action";
import { Utility } from "../../../../../common/utility/";
import EditTeamModal from "../../controls/edit-team-modal-popup/";
import JumpTeamModal from "../../controls/jump-team-modal-popup/";
import CreateTeamModal from "../../controls/create-team-modal-popup/";
import Team from './team';
import ToolBoxControl from "../../../../shared/controls/tool-box-control/";
import { menuRenderer } from "../../../../shared/controls/menu-renderer/";
import { Constants } from "../../../../../common/app-settings/constants";
import ValidationControl from "../../../../shared/controls/validation-control";
import RefreshTimeLogger from "../../controls/refresh-time-logger/";
import AdminBoroughSiteFilters from "../borough-site-filters";
import MapLegendBar from "../../../../dashboard/components/middle-container/legend-bar/"
const team_add_button = require("../../../../../assets/img/teams-add-button.png");


/**
 * Middle container for admin section
 */
class ManageTeamContainer extends React.Component {

    /**
     * Constructor to initialize fields.
     */
    constructor(props) {
        super(props);
        this.onOpenCreateTeamDialog = this.onOpenCreateTeamDialog.bind(this);
        this.onOpenEditTeamDialog = this.onOpenEditTeamDialog.bind(this);
        this.onOpenJumpTeamDialog = this.onOpenJumpTeamDialog.bind(this);
        this.fetchBoroughsAndSites = this.fetchBoroughsAndSites.bind(this);
        this.onBoroughChange = this.onBoroughChange.bind(this);
        this.onSiteChange = this.onSiteChange.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.fetchCanvassers = this.fetchCanvassers.bind(this);
        this.fetchRoutes = this.fetchRoutes.bind(this);
        this.loadRoutesAndCanvs = this.loadRoutesAndCanvs.bind(this);
        // this.onAddTeam = this.onAddTeam.bind(this);
        this.showErrorMessage = this.showErrorMessage.bind(this);
        this.registerAutoRefresh = this.registerAutoRefresh.bind(this);
        this.onTeamsReload = this.onTeamsReload.bind(this);
        this.setFilteredRoutesCanvassers = this.setFilteredRoutesCanvassers.bind(this);
        this.isSFOUser = false;
        this.onOpenRouteOnMapDialog = this.onOpenRouteOnMapDialog.bind(this);
    }

    // open route in map
    onOpenRouteOnMapDialog(routeObject, team) {
        routeObject.forEach((element) => {
            element.boroughName = this.props.model.filterModel.selectedBorough.boroughName;
            element.siteName = this.props.model.filterModel.selectedSite.siteName;
            if (!element.countInstanceStatus || !element.countInstanceStatus.length) {
                element.countInstanceStatus = [this.props.sharedModel.countInstanceStatus.find(m => m.label.toLowerCase() == Constants.routesStatus.not_started.toLowerCase())];
            }
        });
        if (team)
            routeObject.team = team;
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_ROUTE_ON_MAP_OPENED, { isOpened: true, popupLoaderShown: true, routeObject: routeObject, team: team }));
    }
    /**
     * Set team dialog Open status to true.
     */
    onOpenCreateTeamDialog() {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAM_DIALOG_OPEN, { IsOpen: true }));
    }

    /**
     * Opens the team popup with the given team.
     */
    onOpenEditTeamDialog(e, teamObject) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EDIT_TEAM_DIALOG_OPEN, { IsOpen: true, teamOpened: teamObject }));
    }
    /**
     * Opens the team popup with the given jump team.
     */
    onOpenJumpTeamDialog(e, teamObject) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_JUMP_TEAM_DIALOG_OPEN, { IsOpen: true, teamOpened: teamObject }));
    }

componentWillMount(){

}


    /**
     * Lifecycle method to be called when component did mount.
     * Initializes the fields and fetch boroughs and sites for dropdowns.
     */
    componentDidMount() {
        this.isSFOUser = CommonService.isSFOUser();
      //  this.props.dispatch(Action.getAction(adminActionTypes.SET_SITE, { value: null }));
    //    this.props.dispatch(Action.getAction(adminActionTypes.SET_BOROUGH, { value: null }));
        this.boroughsOptions = null;
        if(!this.props.model.filterModel.selectedSite || this.props.model.filterModel.selectedSite.siteId==-1){
            this.props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, []));
          }
        this.fetchBoroughsAndSites();
    }

    /**
     * Calls graphQL to fetch boroguhs and associated sites.
     */
    fetchBoroughsAndSites() {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
            DashboardService.getActiveCountInstance().then(mappedData => {
            this.props.dispatch(Action.getAction(sharedActionTypes.SET_ACTIVE_COUNT_INSTANCE, mappedData));

            if (this.props.sharedModel.selectedQCInstances.length > 0) {

                AdminCMSService.getBoroughsAndSites(this.props.sharedModel.selectedQCInstances)
                    .then(response => {
                        // this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_BOROUGHS_AND_SITES, response));
                        this.props.dispatch(Action.getAction(sharedActionTypes.SET_COUNT_INSTANCE_STATUS, response.countInstanceStatus));

                        // if there is site selcted then fetch all teams of this site
                        if (this.props.model.filterModel.selectedSite)
                            this.onSiteChange(this.props.model.filterModel.selectedSite);
                    }
                    )
                    .catch((error) => {
                        //Show validation error on any error response from service.
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                        this.showErrorMessage(error.message, Constants.validation.types.error);
                    });


            } else {
                this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, false));
                this.showErrorMessage(Utility.stringFormat(Constants.messages.countsModel.noActiveCountInstanceFound), Constants.validation.types.error);

            }

        }).catch(error => {
            this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, false));
            this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message), Constants.validation.types.error);
        });
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
    }
    //show hide error meessages
    showErrorMessage(message, errorType) {
        this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: message, type: errorType.key }));
        window.setTimeout(() => {
            this.props
                .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                    validationMessage: Constants.emptyString,
                    isPopup: false,
                    type: Constants.validation.types.success.key
                }));
        }, Constants.messages.defaultMessageTimeout);
    }

    /**
     * Function called when Borough select change event is fired to set the borough as selecetd value and site as null.
     */
    onBoroughChange(value) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_SITE, { value: null }));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_BOROUGH, { value: value }));
        this.showErrorMessage(Constants.emptyString, Constants.validation.types.success);
        this.props.dispatch(Action.getAction(adminActionTypes.CREATE_TEAM_SET_SITE, { value: null }));
        this.props.dispatch(Action.getAction(adminActionTypes.CREATE_TEAM_SET_BOROUGH, { value: value }));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
        window.setTimeout(() => {
            if (this.props.model.filterModel.selectedSite) {
                this.onSiteChange(this.props.model.filterModel.selectedSite);
            }else{
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
            }
        }, 0)
    }

    /**
     * Function called when Site selecte change event fired. Shows the loader and fetches teams for the selected site from GraphQL.
     */
    onSiteChange(value) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_SITE, { value: value, showLoader: true }));
        this.fetchTeams(value, true);
    }

    /**
     * Calls graphQL to fetch teams for selected site.
     */
    fetchTeams(selectedSite, loadCanvasserRoutes) {
        if (selectedSite) {
            this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTE_CANVAS_LOADER_TOGGLE, { showCanvRoutLoader: loadCanvasserRoutes, showTeamLoader: true }));
            if (loadCanvasserRoutes)
                this.loadRoutesAndCanvs(selectedSite);
            AdminCMSService.getTeamsForSelectedSite(selectedSite, this.props.sharedModel.selectedQCInstances)
                .then(mappedData => {
                    this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAMS_SEARCHED, mappedData.site[0].team));
                }).catch((error) => {
                    /**
                     * Show validation error on any error response from service.
                     */
                    this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                    this.showErrorMessage(error.message, Constants.validation.types.error);
                });
        }
    }
    // new filtrered records
    setFilteredRoutesCanvassers() {
        let convassersTabSelected = (this.props.sharedModel.tabs.filter((tab) => tab.key === Constants.selectedAdminTab.canvasser && tab.isSelected).length > 0);
        this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected: convassersTabSelected }));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_STATUS, { selection: this.props.model.rightSideModel.statusModel.selectedCanvOption, convassersTabSelected: convassersTabSelected }));
    }
    /**
    * Calls graphQL to fetch routes for selected site.
    */
    fetchRoutes(selectedSite) {
        AdminCMSService.getRoutesBySite(selectedSite.siteId, this.props.sharedModel.selectedQCInstances)
            .then(mappedData => {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTES_SEARCHED_RESULTS, mappedData.route));
                // mark timespan request executed on
                this.props.dispatch(Action.getAction(adminActionTypes.SET_ADMIN_LAST_UPDATED_ON, {}));
                this.setFilteredRoutesCanvassers();
            }).catch((error) => {
                this.showErrorMessage(error.message, Constants.validation.types.error);
            });
    }

    /**
    * Calls graphQL to fetch canvassers for selected site.
    */
    fetchCanvassers(selectedSite) {
        AdminCMSService.getUsers(selectedSite.siteId, this.props.sharedModel.selectedQCInstances)
            .then(mappedData => {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, mappedData.user));
                this.setFilteredRoutesCanvassers();
            }).catch((error) => {
                this.showErrorMessage(error.message, Constants.validation.types.error);
            });
    }
    /**
     * Loads data for canvassers and routes for selected site.
     */
    loadRoutesAndCanvs(selectedSite) {
        window.setTimeout(() => {
            this.fetchCanvassers(selectedSite);
            this.fetchRoutes(selectedSite);
        }, 0)

    }

    onWindowResize() {
        Utility.onWindowResize();
    }

    // reister auto refresh
    registerAutoRefresh() {
        Utility.setAdminInterval(() => {

            Utility.abortAllPromises(() => {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
            });
            this.onTeamsReload();

        }, this.props.model.panelProperties.panelAutoReloadInterval);
    }
    // teams Reload on auto refresh
    onTeamsReload() {
        if (this.props.model.filterModel.selectedSite) {
            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
            this.props.dispatch(Action.getAction(adminActionTypes.SET_RIGHT_SIDE_LOADERS, true));
            this.fetchTeams(this.props.model.filterModel.selectedSite, true);
        }
    }
    /**
     * Render View method.
     */
    render() {
        let adminModel = this.props.model;
        let boroughs = adminModel.filterModel.boroughs;
        this.boroughsOptions = boroughs;
        let selectedBoroughValue = adminModel.filterModel.selectedBorough;
        let sites = null;
        if(selectedBoroughValue){
             sites =  selectedBoroughValue.boroughId != -1 ?  adminModel.filterModel.sites.filter((site) => (site.boroughId == selectedBoroughValue.boroughId)):[];
            
        }
        let selectedSiteValue = adminModel.filterModel.selectedSite;
        let searchedTeams = this.props.model.searchedTeams;     
        let isRouteSelected = this.props.sharedModel.tabs.length>0?this.props.sharedModel.tabs.filter((tab) => tab.category === "admin" && tab.key === "routes")[0].isSelected:false;
        return (
            <div className={'panel panel-inverse ' + (adminModel.panelProperties.panelExpanded ? " panel-expand " : "")}  >
                <div className="panel-heading">
                    <ToolBoxControl dataModel={adminModel.panelProperties}
                        onExpand={() => {
                            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_EXPAND_ADMIN, {}));
                            this.onWindowResize();
                        }}
                        onReload={() => {
                            this.onTeamsReload();
                        }}
                        onCollapse={() => {
                            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_COLLAPSE_ADMIN, {}));
                            this.onWindowResize();
                        }}
                        onRemove={() => {
                            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_REMOVE_ADMIN, {}));
                        }}
                    />
                    <h4 className="panel-title"><panel>Teams ({searchedTeams.length}) </panel>
                        <img src={team_add_button} alt="" className="open-team-add-button" width="20px" onClick={this.onOpenCreateTeamDialog} /></h4>
                    <RefreshTimeLogger />
                </div>
                <div className={"panel-body " + (adminModel.panelProperties.panelExpanded ? " custom-scroll " : '') + (adminModel.panelProperties.panelCollapsed ? ' height-0 ' : '')}>
                    <div className="admin-filter-bar">
                        <AdminBoroughSiteFilters IsSFUser={this.isSFOUser} SelectedBoroughValue={selectedBoroughValue} MenuRenderer={menuRenderer}
                            OnBoroughChange={this.onBoroughChange} BoroughsOptions={this.boroughsOptions} Sites={sites} SelectedBoroughValue={selectedBoroughValue}
                            BoroughDisabled={adminModel.panelProperties.panelReload || (!this.boroughsOptions || this.boroughsOptions.length <= 1)}
                            SelectedSiteValue={selectedSiteValue} OnSiteChange={this.onSiteChange}
                            SitesOptions={sites} SiteDisabled={adminModel.panelProperties.panelReload || (!sites || sites.length <= 1)}
                        />
                        {isRouteSelected&&<span className="legend">Legend</span>}
                         {isRouteSelected&&<MapLegendBar  />}
                    </div>
                    {(searchedTeams && searchedTeams.length) ? <label className='need-escort-count'>{Constants.teamsNeedingEscorts}&nbsp;<b>{adminModel.teamsCountNeedingEscorts}</b></label> : ''}
                    <div className={"admin-teams-content " + (searchedTeams && searchedTeams.length ? " admin_bg-color " : '')}>
                        {

                            searchedTeams && searchedTeams.length ?
                                searchedTeams.map((team, index) => {
                                    return (
                                        <Team onOpenEditTeamDialog={(e, teamObj) => { team.isJumpTeam ? this.onOpenJumpTeamDialog(e, teamObj) : this.onOpenEditTeamDialog(e, teamObj) }}
                                            team={team} key={index}
                                            onOpenRouteOnMapDialog={this.onOpenRouteOnMapDialog} showAllUsers={this.showAllUsers} />
                                    );
                                }) :
                                ((searchedTeams && searchedTeams.length == 0) && selectedSiteValue && !adminModel.panelProperties.panelReload) ? <div className="no-teams-found-message"> {Constants.messages.noRecordFound}</div> :
                                    <div className="select-borough-site-label">{!this.props.model.filterModel.selectedSite ? (this.isSFOUser ? Constants.messages.selectBoroughSiteSF : Constants.messages.selectBoroughSite) : ''}</div>
                        }
                        {adminModel.panelProperties.panelReload ? <div className="panel-loader"><span className="spinner-small"></span></div> : ''}
                    </div>                    
                </div>
            </div>

        )

    }

}


const mapStateToProps = (state) => {
    return {
        model: state.adminModel,
        sharedModel: state.sharedModel
    }
}

export default connect(mapStateToProps)(ManageTeamContainer);
