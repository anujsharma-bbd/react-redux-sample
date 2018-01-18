import React from "react";
import { connect } from 'react-redux';
import Modal from 'tg-modal';
import TeamMember from './team-member'
import RouteList from './route-list'
import ValidationControl from '../../../../shared/controls/validation-control';
import { adminActionTypes } from "../../../actions/adminActionTypes";
import * as Action from "../../../../shared/actions/action";
import { GAService } from "../../../../shared/services/ga-service";
import { Constants } from "../../../../../common/app-settings/constants";
import { Utility } from "../../../../../common/utility";
import { AdminCMSService } from '../../../services/admin-cms.service';

class EditTeamModal extends React.Component {

    constructor(props) {
        super(props);
        this.onRemoveTeam = this.onRemoveTeam.bind(this);
        this.showSuccessMessage = this.showSuccessMessage.bind(this);
    }
    /**
     * remove team 
     */
    onRemoveTeam(eve) {
        let Team = this.props.model.teamToEdit;
        let confirmMessage = Utility.stringFormat(Constants.messages.editTeamModal.teamRemoveConfirm, Team.label, Team.label);
        Utility.showConfirm(confirmMessage,
            () => {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, true));
                AdminCMSService.removeTeam(Team.id).then((response) => {
                    if (response.data.destroyAssignment) {
                        this.props.dispatch(Action.getAction(adminActionTypes.REMOVE_TEAM, Team.id));
                        AdminCMSService.getRoutesBySite(this.props.model.filterModel.selectedSite.siteId, this.props.sharedModel.selectedQCInstances)
                            .then(mappedData => {
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTES_SEARCHED_RESULTS, mappedData.route));
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchRoutesModel.selectedOption, convassersTabSelected: false }));
                                let allLeaderIds = [];
                                this.props.model.teamToEdit.user.forEach(function (user) {
                                    allLeaderIds.push({ id: user.id, isLeader:false });
                                })
                                AdminCMSService.setLeader(allLeaderIds)
                                    .then(response => {
                                        this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAM_LEADER, { users: allLeaderIds }));
                                        AdminCMSService.getUsers(this.props.model.filterModel.selectedSite.siteId, this.props.sharedModel.selectedQCInstances)
                                                            .then(mappedData => {
                                                                window.scrollTo(0, 0);
                                                                this.showSuccessMessage(Team);
                                                                this.props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, mappedData.user));
                                                                this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected: true }));
                                                                this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
                                                                this.props.onCancel(eve);
                                                            });

                                    }).catch((err) => {
                                        this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE,
                                            { validationMessage: err.message, isPopup: false, type: Constants.validation.types.error.key }));
                                        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
                                    });
                                // log event on GA
                                GAService.logEvent(
                                    Utility.stringFormat(Constants.google_analytics.eventLogging.actions.Admin.deleteTeam, Team.label),
                                    Utility.stringFormat(Constants.messages.google_analytics.unAssignedAt, Utility.convertToFormat(new Date(), Constants.dateTimeFormates.mmddyyyy)),
                                    Constants.google_analytics.eventLogging.eventLabels.removeAssignment,
                                    false);
                            });

                    } else {
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
                        throw new Error(Constants.messages.commonMessages.someErrorOccured);
                    }
                })
                    .catch((err) => {
                        this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: err.message, isPopup: false, type: Constants.validation.types.error.key }));
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected: true }));

                    });
            },
            () => {
                this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: Constants.emptyString }));
            },
            this.props.dispatch
        )
    }
    //show hide error meessages
    showSuccessMessage(Team) {
        window.setTimeout(() => {
            this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE,
                {
                    validationMessage: Utility.stringFormat(Constants.messages.editTeamModal.teamRemoved, Team.label),
                    type: Constants.validation.types.success.key,
                    isPopup: false
                }));
            window.setTimeout(() => {
                this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE,
                    {
                        validationMessage: Constants.emptyString,
                        type: Constants.validation.types.success.key,
                        isPopup: false
                    }));
            }, Constants.messages.defaultMessageTimeout);
        }, 300);
    }
    render() {
        return (
            <div className="container edit-team-container">
                <Modal isOpen={this.props.isOpen} autoWrap title={this.props.model.teamToEdit.label} isStatic={this.props.loader} onCancel={(e) => this.props.onCancel(e)} className="myclass">
                    <ValidationControl message={this.props.model.validation.message} type={this.props.model.validation.type} isPopup={this.props.model.validation.isPopup} />
                    {this.props.loader ? <div className="model-loader"><span className="spinner"></span></div> : ''}
                    <label>{this.props.model.teamToEdit.user.length}&nbsp;Member(s)</label>
                    <button className="button remove-teams-button" onClick={(e) => this.onRemoveTeam(e)} >Delete Team</button>
                    <TeamMember />
                    <label className="label-team-routes">{this.props.model.teamToEdit.route.length}&nbsp;Route(s)</label>
                    <RouteList />
                    {/*<div className="delete-team-footer-bar">  </div>*/}
                </Modal>
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

export default connect(mapStateToProps)(EditTeamModal);