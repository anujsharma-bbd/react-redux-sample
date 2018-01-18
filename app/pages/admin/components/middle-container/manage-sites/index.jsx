import React from "react";
import { connect } from 'react-redux';
import { IndexRoute } from 'react-router';
import Select from "react-select";
import { ManageSitesService } from '../../../services/manage-sites.service';
import { DashboardService } from '../../../../dashboard/services/dashboard.services';
import { manageSitesActionTypes } from "../../../actions/manageSitesActionTypes";
import { adminActionTypes } from "../../../actions/adminActionTypes";
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";
import { CommonService } from '../../../../shared/services/common.service';
import * as Action from "../../../../shared/actions/action";
import { Utility } from "../../../../../common/utility/";
import ManageSitesComponent from './sites';
import ToolBoxControl from "../../../../shared/controls/tool-box-control/";
import { menuRenderer } from "../../../../shared/controls/menu-renderer/";
import { Constants } from "../../../../../common/app-settings/constants";
import ValidationControl from "../../../../shared/controls/validation-control";
import RefreshTimeLogger from "../../controls/refresh-time-logger/";
import AdminBoroughSiteFilters from "../borough-site-filters";
import ManageSiteModal from "../../controls/manage-site-modal-popup/";
import { GAService } from "../../../../shared/services/ga-service";

/**
 * Middle container for admin section
 */
class ManageSitesContainer extends React.Component {

    /**
     * Constructor to initialize fields.
     */
    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
        this.onBoroughChange = this.onBoroughChange.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onSitesReload = this.onSitesReload.bind(this);
        this.showHideLoader = this.showHideLoader.bind(this);
        this.showHidePoupLoader = this.showHidePoupLoader.bind(this);
        this.isSFOUser = false;
        this.showMessage = this.showMessage.bind(this);
        this.onDialogCancel = this.onDialogCancel.bind(this);
        this.onAddUpdateDeleteSite = this.onAddUpdateDeleteSite.bind(this);
        this.updateSiteDetails = this.updateSiteDetails.bind(this);
    }
    /**
     * Lifecycle method to be called when component did mount.
     * Initializes the fields and fetch boroughs and sites for dropdowns.
     */
    componentDidMount() {
        this.isSFOUser = CommonService.isSFOUser();
        this.getData();
    }
    // show error messages
    showMessage(message, key, isPopup) {

        if (isPopup) {
            this.props.dispatch(Action.getAction(manageSitesActionTypes.SHOW_VALIDATION_MESSAGE_MNG, {
                validationMessage: message, isPopup: false, type: Constants.validation.types.error.key
            }));
        }
        else {
            this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                validationMessage: message,
                isPopup: isPopup,
                type: key
            }));
        }
        if (message)
            setTimeout(() => {
                this.showMessage(Constants.emptyString);
     }, Constants.messages.messageTimeout_5000)
    }
    // show hide loader on popup
    showHideLoader(flag) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, flag));
    }
    // show hide loader on popup
    showHidePoupLoader(flag) {
        this.props.dispatch(Action.getAction(manageSitesActionTypes.SET_POPUPLOADER_TOGGLE_MNG, flag));
    }
    // add/update/delete a canvasser
    onAddUpdateDeleteSite(site) {
        if (site != null) {
            switch (site.action) {
                case Constants.action.add:
                    {
                        let isSiteExist = false;
                        this.props.manageSitesModel.allSites&&this.props.manageSitesModel.allSites.forEach(s=>{
                            if(s.siteName == site.siteName || s.siteLabel == site.siteLabel){
                                isSiteExist =true;
                                return;
                            }
                        })
                        if(isSiteExist){
                            this.showMessage("A site with the same name or label already exist.", Constants.validation.types.error.key, true);
                             return;
                        }
                        this.showHidePoupLoader(true);
                        ManageSitesService.addSite(site, this.props.manageSitesModel.filterModel.selectedBorough.boroughId, this.props.sharedModel.selectedQCInstances).then((response) => {
                            this.showHidePoupLoader(false);
                            if (response.data.createAssignment && response.data.createAssignment.id > 0) {
                                site.id = site.siteId = response.data.createAssignment.id;
                                site.boroughId = this.props.manageSitesModel.filterModel.selectedBorough.boroughId;
                                this.updateSiteDetails(site);
                                this.onDialogCancel();
                                Utility.scrollToTop();
                                this.showMessage(Utility.stringFormat(Constants.messages.createEditSite.siteAdded, site.siteName), Constants.validation.types.success.key, false);
                                window.setTimeout(() => {
                                    this.showMessage(Constants.emptyString, Constants.validation.types.success.key, false);
                                }, Constants.messages.defaultMessageTimeout);

                                // log event on GA
                                GAService.logEvent(
                                    Utility.stringFormat(Constants.google_analytics.eventLogging.actions.Admin.createSite, site.siteName),
                                    Utility.stringFormat(Constants.messages.google_analytics.createdAt, Utility.convertToFormat(new Date(), Constants.dateTimeFormates.mmddyyyy)),
                                    Constants.google_analytics.eventLogging.eventLabels.addAssignment,
                                    false);

                            } else {
                                this.showMessage(Constants.messages.commonMessages.someErrorOccured, Constants.validation.types.error.key, true);
                            }
                        }).catch((err) => {
                            this.showHidePoupLoader(false);
                            this.showMessage(err.message, Constants.validation.types.error.key, true)
                        });

                        break;
                    }
                case Constants.action.update: {
                    let isSiteExist = false;
                    let newFilterData = this.props.manageSitesModel.allSites.filter(x=>x.siteName != this.props.manageSitesModel.editSiteObject.siteName)
                    newFilterData.forEach(s=>{
                        if(s.siteName == site.siteName || s.siteLabel == site.siteLabel){
                            isSiteExist =true;
                            return;
                        }
                    })
                    if(isSiteExist){
                        this.showMessage("A site with the same name or label already exist.", Constants.validation.types.error.key, true);
                         return;
                    }
                    //update canvasser     
                    this.showHidePoupLoader(true);
                    ManageSitesService.updateSite(site).then((response) => {
                        this.showHidePoupLoader(false);
                        if (response.data.updateAssignment && response.data.updateAssignment.id > 0) {
                            site.siteId = site.id = response.data.updateAssignment.id;
                            this.updateSiteDetails(site);
                            this.onDialogCancel();
                            Utility.scrollToTop();
                            this.showMessage(Utility.stringFormat(Constants.messages.createEditSite.siteUpdated, site.siteName), Constants.validation.types.success.key, false);
                            window.setTimeout(() => {
                                this.showMessage(Constants.emptyString, Constants.validation.types.success.key, false);
                            }, Constants.messages.defaultMessageTimeout);

                            // log event on GA
                            GAService.logEvent(
                                Utility.stringFormat(Constants.google_analytics.eventLogging.actions.Admin.updateSite, site.siteName),
                                Utility.stringFormat(Constants.messages.google_analytics.updatedAt, Utility.convertToFormat(new Date(), Constants.dateTimeFormates.mmddyyyy)),
                                Constants.google_analytics.eventLogging.eventLabels.updateAssignment,
                                false);
                        }
                        else {
                            this.showMessage(Constants.messages.commonMessages.someErrorOccured, Constants.validation.types.error.key, true);
                        }
                    }).catch((error) => {
                        this.showHidePoupLoader(false);
                        this.showMessage(error.message, Constants.validation.types.error.key, true);
                    });
                    break;
                }
                case Constants.action.delete:
                    {
                        let name = site.siteName;
                        let confirmMessage = Utility.stringFormat(Constants.messages.createEditSite.siteDeleteConfimMsg, name);
                        let hasNotification = false;
                        let notificationMsg = "";

                        Utility.showConfirm(confirmMessage,
                            () => {
                                this.showHidePoupLoader(true);
                                ManageSitesService.deleteSite(site).then((response) => {
                                    this.showHidePoupLoader(false);
                                    if (response.data && response.data.destroyAssignment) {
                                        Utility.scrollToTop();
                                        site.siteId = site.id;
                                        this.updateSiteDetails(site);
                                        this.onDialogCancel();
                                        this.showMessage(Utility.stringFormat(Constants.messages.createEditSite.siteDeleted, name), Constants.validation.types.success.key, false);
                                        window.setTimeout(() => {
                                            this.showMessage(Constants.emptyString, Constants.validation.types.success.key, false);
                                        }, Constants.messages.defaultMessageTimeout);
                                        this.props.dispatch(Action.getAction(adminActionTypes.SET_ADMIN_LAST_UPDATED_ON,true))
                                        // log event on GA
                                        GAService.logEvent(
                                            Utility.stringFormat(Constants.google_analytics.eventLogging.actions.Admin.deleteSite, name),
                                            Utility.stringFormat(Constants.messages.google_analytics.deletedAt, Utility.convertToFormat(new Date(), Constants.dateTimeFormates.mmddyyyy)),
                                            Constants.google_analytics.eventLogging.eventLabels.removeAssignment,
                                            false);
                                    }
                                    else {
                                        this.showMessage(response.error.message, Constants.validation.types.error.key, true);
                                    }
                                }).catch((err) => {
                                    this.showHidePoupLoader(false);
                                    this.showMessage(err.message, Constants.validation.types.error.key, true)
                                });
                            },
                            () => {
                                this.showMessage(Constants.emptyString, Constants.validation.types.error.key, true)
                            },
                            this.props.dispatch, { notification: hasNotification ? notificationMsg : null } // options
                        );
                        break;
                    }
            }
        }
    }
    /**
     * Calls graphQL to fetch boroguhs and associated sites.
     */
    getData() {
        this.props.dispatch(Action.getAction(manageSitesActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH_MNG, true));
        DashboardService.getActiveCountInstance().then(mappedData => {
            this.props.dispatch(Action.getAction(sharedActionTypes.SET_ACTIVE_COUNT_INSTANCE, mappedData));
            if (this.props.sharedModel.selectedQCInstances.length > 0) {
                this.fetchSites(true);
            } else {
                this.showMessage(Utility.stringFormat(Constants.messages.countsModel.noActiveCountInstanceFound));
            }
            this.props.dispatch(Action.getAction(adminActionTypes.SET_ADMIN_LAST_UPDATED_ON,true))
        }).catch(error => {
            this.showMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
        });
    }
    updateSiteDetails(siteObject) {
        this.props.dispatch(Action.getAction(manageSitesActionTypes.SET_UPDATE_SITE_DETAILS, { siteObject: siteObject }));
    }

    /**
     * Function called when Borough select change event is fired to set the borough as selecetd value and site as null.
     */
    onBoroughChange(value) {
        this.props.dispatch(Action.getAction(manageSitesActionTypes.SET_BOROUGH_MNG, { value: value }));
    }
    onDialogCancel(e) {
        this.props.dispatch(Action.getAction(manageSitesActionTypes.SET_MANAGE_SITE_DIALOG_OPEN, { IsOpen: false, isCreating: false }));
    }
    /**
     * Calls graphQL to fetch teams for selected site.
     */
    fetchSites(setSelectedBorough) {
        ManageSitesService.getBoroughsAndSites(this.props.sharedModel.selectedQCInstances)
            .then(response => {
                this.props.dispatch(Action.getAction(manageSitesActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH_MNG, false));
                this.props.dispatch(Action.getAction(manageSitesActionTypes.SET_BOROUGH_SITES_MNG, { data: response, setSelectedBorough: setSelectedBorough }));
            })
            .catch((error) => {
                //Show validation error on any error response from service.
                this.props.dispatch(Action.getAction(manageSitesActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH_MNG, false));
                this.showMessage(error.message, Constants.validation.types.error);
            });
    }
    onWindowResize() {
        Utility.onWindowResize();
    }

    // teams Reload on auto refresh
    onSitesReload() {
        if (this.props.manageSitesModel.filterModel.selectedBorough) {
            this.props.dispatch(Action.getAction(manageSitesActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH_MNG, true));
            this.props.dispatch(Action.getAction(adminActionTypes.SET_ADMIN_LAST_UPDATED_ON,true))
            this.fetchSites(false);
        }
    }
    /**
     * Render View method.
     */
    render() {
        let manageSitesModel = this.props.manageSitesModel;
        let boroughs = manageSitesModel.filterModel.boroughs;
        let selectedBoroughValue = manageSitesModel.filterModel.selectedBorough;
        let sites = selectedBoroughValue && selectedBoroughValue.boroughId!=-1 ? manageSitesModel.allSites.filter((site) => ( site.boroughId == selectedBoroughValue.boroughId)): manageSitesModel.allSites;
        return (
            <div className={'panel panel-inverse ' + (manageSitesModel.panelProperties.panelExpanded ? " panel-expand " : "")}  >
                <div className="panel-heading">
                    <ToolBoxControl dataModel={manageSitesModel.panelProperties}
                        onExpand={() => {
                            this.props.dispatch(Action.getAction(manageSitesActionTypes.SET_PANEL_EXPAND_ADMIN_MNG, {}));
                            this.onWindowResize();
                        }}
                        onReload={() => {
                            this.onSitesReload();
                        }}
                        onCollapse={() => {
                            this.props.dispatch(Action.getAction(manageSitesActionTypes.SET_PANEL_COLLAPSE_ADMIN_MNG, {}));
                            this.onWindowResize();
                        }}
                        onRemove={() => {
                            this.props.dispatch(Action.getAction(manageSitesActionTypes.SET_PANEL_REMOVE_ADMIN_MNG, {}));
                        }}
                    />
                    <h4 className="panel-title"><panel>Manage Sites</panel>
                    </h4>
                    <RefreshTimeLogger />
                </div>
                <div className={"panel-body " + (manageSitesModel.panelProperties.panelExpanded ? " custom-scroll " : '') + (manageSitesModel.panelProperties.panelCollapsed ? ' height-0 ' : '')}>
                    <div className="admin-filter-bar">
                        <AdminBoroughSiteFilters IsSFUser={this.isSFOUser} SelectedBoroughValue={selectedBoroughValue} MenuRenderer={menuRenderer}
                            OnBoroughChange={this.onBoroughChange} BoroughsOptions={boroughs} Sites={sites} SelectedBoroughValue={selectedBoroughValue}
                            BoroughDisabled={manageSitesModel.panelProperties.panelReload || (!boroughs || boroughs.length <= 1)}
                            hideBoroughs={false} hideSites={true}
                        />
                    </div>
                    <div className={"admin-teams-content "}>
                        <ManageSitesComponent showMessage= {(a,b,c)=>this.showMessage(a,b,c)} data={sites} boroughs = {boroughs} />
                        {manageSitesModel.panelProperties.panelReload ? <div className="panel-loader"><span className="spinner-small"></span></div> : ''}
                    </div>
                </div>
                {
                    this.props.manageSitesModel.isManageSitesModelOpened ?
                        <ManageSiteModal isOpen={this.props.manageSitesModel.isManageSitesModelOpened}
                            loader={this.props.manageSitesModel.popupLoaderShown}
                            data={this.props.manageSitesModel.editSiteObject}
                            onCancel={(e) => this.onDialogCancel(e)} loader={this.props.manageSitesModel.popupLoaderShown}
                            onAddUpdateDeleteSite={(site) => this.onAddUpdateDeleteSite(site)} />
                        : null
                }
            </div>

        )

    }

}

const mapStateToProps = (state) => {
    return {
        manageSitesModel: state.manageSitesModel,
        sharedModel: state.sharedModel
    }
}

export default connect(mapStateToProps)(ManageSitesContainer);
