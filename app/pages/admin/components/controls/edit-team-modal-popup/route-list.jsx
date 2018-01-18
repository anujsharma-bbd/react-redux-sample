import React from "react";
import { connect } from 'react-redux';
import { AdminCMSService } from '../../../services/admin-cms.service';
import { adminActionTypes } from "../../../actions/adminActionTypes";
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";
import { GAService } from "../../../../shared/services/ga-service";
import * as Action from "../../../../shared/actions/action";
import { Constants } from "../../../../../common/app-settings/constants";
import { Utility } from "../../../../../common/utility";
import RouteType from "../route-type/"
/**
 * Component to list of routes
 */
class RouteList extends React.Component {
    constructor(props) {
        super(props);
        this.onRouteRemove = this.onRouteRemove.bind(this);
        this.onRouteAllRemove = this.onRouteAllRemove.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.onOpenRouteOnMapDialog = this.onOpenRouteOnMapDialog.bind(this);
    }
    // open route in map
    onOpenRouteOnMapDialog(routeObject) {
        routeObject.boroughName = this.props.model.filterModel.selectedBorough.boroughName;
        routeObject.siteName = this.props.model.filterModel.selectedSite.siteName;
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_ROUTE_ON_MAP_OPENED, { isOpened: true, popupLoaderShown: true, routeObject: [routeObject] }));
    }
    /**
     * Remove routes from the list
     */
    onRouteRemove(route) {
        let confirmMessage = Utility.stringFormat(Constants.messages.editTeamModal.routeRemoveConfirm, (route.name || route.routeName), this.props.model.teamToEdit.label);
        Utility.showConfirm(confirmMessage,
            // on confirm click
            () => {
                this.showLoader(true);
                AdminCMSService.destroyRelationForRouteFromTeam(route.id, this.props.model.teamToEdit.id).then((response) => {
                    if (response.data.destroyAssignmentRelation) {
                        this.props.dispatch(Action.getAction(adminActionTypes.REMOVE_TEAM_ROUTE, { teamId: this.props.model.teamToEdit.id, routeId: route.id }));
                        this.showLoader(false);
                        AdminCMSService.getRoutesBySite(this.props.model.filterModel.selectedSite.siteId, this.props.sharedModel.selectedQCInstances)
                            .then(mappedData => {
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTES_SEARCHED_RESULTS, mappedData.route));
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchRoutesModel.selectedOption, convassersTabSelected: false }));
                            });
                        // log event on GA
                        GAService.logEvent(
                            Utility.stringFormat(Constants.google_analytics.eventLogging.actions.Admin.removeRoute, (route.label || route.name || route.routeName), this.props.model.teamToEdit.label),
                            Utility.stringFormat(Constants.messages.google_analytics.unAssignedAt, Utility.convertToFormat(new Date(), Constants.dateTimeFormates.mmddyyyy)),
                            Constants.google_analytics.eventLogging.eventLabels.removeAssignment,
                            false);

                        window.setTimeout(() => {
                            this.showMessage(Constants.emptyString);
                        }, Constants.messages.defaultMessageTimeout);

                    } else {
                        console.log("Destroy relation of route to team failure.");
                        throw new Error(Constants.messages.commonMessages.someErrorOccured);
                    }
                }).catch((err) => {
                    this.showMessage(err.message);
                    this.showLoader(false);
                });
            },
            // on cancel click
            () => {
                this.showMessage(Constants.emptyString);
            },
            this.props.dispatch
        )

    }
    /**
     * Remove all routes from the list in one go
     */
    onRouteAllRemove() {
        let confirmMessage = Utility.stringFormat(Constants.messages.editTeamModal.allRoutesRemoveConfirm, this.props.model.teamToEdit.label);
        Utility.showConfirm(confirmMessage,
            // on confirm button
            () => {
                if (this.props.model.teamToEdit.route && this.props.model.teamToEdit.route.length > 0) {
                    let routeIds = [];
                    this.showLoader(true);
                    this.props.model.teamToEdit.route.forEach((routeObj, index) => {
                        routeIds.push(routeObj.id);
                    })
                    AdminCMSService.destroyRelationOfAllFrom(this.props.model.teamToEdit.id, routeIds).then((response) => {
                        this.props.dispatch(Action.getAction(adminActionTypes.REMOVE_TEAM_ALL_ROUTE, { teamId: this.props.model.teamToEdit.id }));
                        this.showLoader(false);
                        AdminCMSService.getRoutesBySite(this.props.model.filterModel.selectedSite.siteId, this.props.sharedModel.selectedQCInstances)
                            .then(mappedData => {
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTES_SEARCHED_RESULTS, mappedData.route));
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchRoutesModel.selectedOption, convassersTabSelected: false }));
                            });

                        // log event on GA
                        GAService.logEvent(
                            Utility.stringFormat(Constants.google_analytics.eventLogging.actions.Admin.removeAllRoutes, this.props.model.teamToEdit.label),
                            Utility.stringFormat(Constants.messages.google_analytics.unAssignedAt, Utility.convertToFormat(new Date(), Constants.dateTimeFormates.mmddyyyy)),
                            Constants.google_analytics.eventLogging.eventLabels.removeAssignment,
                            false);
                    }).catch((err) => {
                        this.showMessage(err.message);
                        this.showLoader(false);
                    });
                }
            },
            // on cancel button
            () => {
                this.showMessage(Constants.emptyString);
            },
            this.props.dispatch)

    }
    // show message
    showMessage(message, type) {
        if (!type) {
            type = Constants.validation.types.error.key;
        }
        this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: message, isPopup: false, type: type }));
    }
    // show hide loader
    showLoader(flag) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, flag));
    }
    /**
     * render route list
     */
    render() {
        return (
            <div>
                <button className="button remove-routes-button" disabled={!this.props.model.teamToEdit.route.length} onClick={() => { this.onRouteAllRemove() }} >Remove All Routes</button>
                <div className="clear"></div>

                <div className="team-members custom-scroll">

                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Route</th>
                                <th>Area</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Type</th>
                                <th className="text-center" style={{ "width": "20px" }}>View&nbsp;On&nbsp;Map</th>
                                <th className="text-right" style={{ "width": "10px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.model.teamToEdit.route.length ?
                                    this.props.model.teamToEdit.route.map((route, index) => {
                                        return (
                                            <tr className="" key={"team-route-" + index}>
                                                <td className="">({(index + 1)}) </td>
                                                <td>{Utility.getSubwayRouteName(route)}</td>
                                                <td className="text-center">
                                                    {(route.properties.needsNypd && route.properties.needsNypd.toLowerCase() === Constants.routeNeedNYPD.true.toLowerCase()) ? <span className="need_nypd_admin  need_nypd_admin_active">NYPD</span> : null}
                                                    {(route.properties.park && route.properties.park.toLowerCase() === Constants.isPark.true.toLowerCase()) ? <span className="ispark" style={{ marginLeft: "5px" }}>Park</span> : null}
                                                </td>
                                                <td className="text-center">
                                                    {
                                                        route.countInstanceStatus && route.countInstanceStatus.length > 0
                                                            ? (route.countInstanceStatus[0].label.toLowerCase() == Constants.routesStatus.not_started
                                                                ? <label className="label label-danger">Not Started</label> : (route.countInstanceStatus[0].label.toLowerCase() == Constants.routesStatus.completed)
                                                                    ? <label className="label label-success">Completed</label> : (route.countInstanceStatus[0].label.toLowerCase() == Constants.routesStatus.in_progress)
                                                                        ? <label className="label label-warning">In Progress</label> : <label className="label label-danger">Not Started</label>
                                                            ) :
                                                            <label className="label label-danger">Not Started</label>
                                                    }
                                                </td>

                                                <td className="text-center" style={{ padding: "3px" }}>
                                                    <span style={{ height: "10px" }}>
                                                        <RouteType team={this.props.model.teamToEdit} route={route} />
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <i className="fa fa-map route-icon" onClick={() => { this.onOpenRouteOnMapDialog(route) }} title="View/Edit Route Map" style={{ color: Utility.getBackgroundColor(route, this.props.sharedModel.filterRoutesStatuses), marginTop: '3px' }} ></i>
                                                </td>

                                                <td className="text-right">
                                                    <i className="fa fa-times-circle-o remove-row-icon" onClick={() => { this.onRouteRemove(route) }} title="Remove route from team."></i>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    : <tr className="displaynone"><td colSpan="7"></td></tr>

                            }
                        </tbody>
                    </table>
                    {!this.props.model.teamToEdit.route.length ? <div className="team-row no-routes">{Constants.messages.noTeamRoute}</div> : ''}
                </div>
            </div>
        )
    }
}
/**
 * inject the current state
 */
const mapStateToProps = (state) => {
    return {
        model: state.adminModel,
        sharedModel: state.sharedModel
    }
}

export default connect(mapStateToProps)(RouteList);