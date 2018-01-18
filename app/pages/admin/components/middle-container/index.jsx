import React from "react";
import { connect } from 'react-redux';
import ValidationControl from "../../../shared/controls/validation-control";
import EditTeamModal from "../controls/edit-team-modal-popup/";
import JumpTeamModal from "../controls/jump-team-modal-popup/";
import CreateTeamModal from "../controls/create-team-modal-popup/";
import * as Action from "../../../shared/actions/action";
import { adminActionTypes } from "../../actions/adminActionTypes";

import Modal from 'tg-modal';
import Select from "react-select";
import { AdminCMSService } from '../../services/admin-cms.service';
import { sharedActionTypes } from "../../../shared/actions/sharedActionTypes";
import { CommonService } from '../../../shared/services/common.service';
import { GAService } from '../../../shared/services/ga-service';
import { Utility } from "../../../../common/utility/";
import ToolBoxControl from "../../../shared/controls/tool-box-control/";
import { menuRenderer } from "../../../shared/controls/menu-renderer/";
import { Constants } from "../../../../common/app-settings/constants";
import RefreshTimeLogger from "../controls/refresh-time-logger/";
const team_add_button = require("../../../../assets/img/teams-add-button.png");

/**
 * Middle container for admin section
 */
class AdminMiddleContainer extends React.Component {

    componentDidMount() {
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_TAB_CHANGE, { key: this.props.children.props.route.path }));
    }

    /**
     * Constructor to initialize fields.
     */
    constructor(props) {
        super(props);
    }

    /**
     * Closes the jump team popup .
     */
    onCancelEditTeamDialog(e) {
        if (e.persist())
            e.preventDefault();
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EDIT_TEAM_DIALOG_OPEN, { IsOpen: false }));
    }
    /**
     * Closes the jump team popup .
     */
    onCancelJumpTeamDialog(e) {
        e.preventDefault();
        this.props.dispatch(Action.getAction(adminActionTypes.SET_JUMP_TEAM_DIALOG_OPEN, { IsOpen: false }));
    }

    /**
     * Closes the team dialog.
     */
    onCancelCreateTeamDialog(e) {
        e.preventDefault();
        this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAM_DIALOG_OPEN, { IsOpen: false }));
    }

    //show hide error meessages
    showErrorMessage(message, errorType) {
        this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: message, type: errorType.key }));
    }

    /**
     * Calls graphQL to add new team and assign relationship to the selected site.
     */
    onAddTeam(teamName) {
        if (teamName) {
            this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, true));
            this.showErrorMessage(Constants.emptyString, Constants.validation.types.success);
            //Adds team and assign relation of the newly added team with the given site and refreshing data of teams.
            AdminCMSService.addTeam(teamName, [this.props.model.createTeamModel.selectedSite.siteId, ...this.props.sharedModel.selectedQCInstances]).then(
                (response) => {
                    if (response.data.createAssignment.id > 0) {
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAM_DIALOG_OPEN, { IsOpen: false }));
                        this.showErrorMessage(Utility.stringFormat(Constants.messages.createTeamModal.teamAdded, teamName), Constants.validation.types.success);
                        window.setTimeout(() => {
                            this.showErrorMessage(Constants.emptyString, Constants.validation.types.success);
                        }, Constants.messages.defaultMessageTimeout);
                        if (this.props.model.filterModel.selectedSite && this.props.model.filterModel.selectedSite.siteId == this.props.model.createTeamModel.selectedSite.siteId)
                            this.fetchTeams(this.props.model.filterModel.selectedSite, false);

                        // log event on GA
                        GAService.logEvent(
                            Utility.stringFormat(Constants.google_analytics.eventLogging.actions.Admin.createTeam, teamName),
                            Utility.stringFormat(Constants.messages.google_analytics.createdAt, Utility.convertToFormat(new Date(), Constants.dateTimeFormates.mmddyyyy)),
                            Constants.google_analytics.eventLogging.eventLabels.addAssignment,
                            false);

                    }
                    else {
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
                        this.showErrorMessage(Constants.messages.commonMessages.someErrorOccured, Constants.validation.types.error);
                    }
                }
            ).catch((error) => {
                //Show validation error on any error response from service.
                this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
                this.showErrorMessage(error.message, Constants.validation.types.error);
            });
        }
        else {
            //Show validation error on any error response from service.
            this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
            this.showErrorMessage(Constants.messages.createTeamModal.invalidTeamName, Constants.validation.types.error);
        }
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
    // gives screen is in full view or not 
    // returns true/false
    isFullView() {
        let currentPath = this.props.children.props.route.path;
        return (currentPath == Constants.selectedAdminTab.count) || (currentPath == Constants.selectedAdminTab.sites  ||(currentPath == Constants.selectedAdminTab.manageEmail)  ||(currentPath == Constants.selectedAdminTab.checkIn));
    }
    render() {
        let adminModel = this.props.model;
        return (
            <div id="content" className={"content " + (this.isFullView() ? " data-view-full-stage " : '')}>
                <div className="validation_success_main">
                    <ValidationControl message={adminModel.validation.message} type={adminModel.validation.type} isPopup={adminModel.validation.isPopup} />
                </div>
                <h1 className="page-header admin-header-custom">Admin</h1>
                <div className="clear"></div>
                <div className="padding20">
                    {
                        this.props.children
                    }
                    {
                        this.props.model.editTeamModalIsOpened ?
                            <EditTeamModal isOpen={this.props.model.editTeamModalIsOpened} onCancel={(e) => this.onCancelEditTeamDialog(e)} loader={this.props.model.popupLoaderShown} />
                            : ''
                    }
                    {
                        this.props.model.createTeamModalIsOpened ?
                            <CreateTeamModal isOpen={this.props.model.createTeamModalIsOpened} onAddTeam={(e) => this.onAddTeam(e)} onCancel={(e) => this.onCancelCreateTeamDialog(e)} loader={this.props.model.popupLoaderShown} />
                            : ''
                    }
                    {
                        this.props.model.jumpTeamModalIsOpened ?
                            <JumpTeamModal isOpen={this.props.model.jumpTeamModalIsOpened} onCancel={(e) => this.onCancelJumpTeamDialog(e)} loader={this.props.model.popupLoaderShown} />
                            : ''
                    }
                </div>

            </div>
        );
    }

}
const mapStateToProps = (state) => {
    return {
        model: state.adminModel,
        sharedModel: state.sharedModel
    }
}

export default connect(mapStateToProps)(AdminMiddleContainer);