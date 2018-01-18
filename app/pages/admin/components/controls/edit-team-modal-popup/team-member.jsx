import React from "react";
import { connect } from 'react-redux';
import { AdminCMSService } from '../../../services/admin-cms.service';
import { adminActionTypes } from "../../../actions/adminActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Constants } from "../../../../../common/app-settings/constants";
import { Utility } from "../../../../../common/utility";
import { GAService } from "../../../../shared/services/ga-service";

class TeamMember extends React.Component {
    constructor(props) {
        super(props);
        this.onUserRemove = this.onUserRemove.bind(this);
        this.setLeader = this.setLeader.bind(this);
    }

    onUserRemove(user) {
        let confirmMessage = Utility.stringFormat(Constants.messages.editTeamModal.memberRemoveConfirm, (user.name ? user.name : (user.email ? user.email : null)), this.props.model.teamToEdit.label);
        Utility.showConfirm(confirmMessage,
            // on confirm click
            () => {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, true));
                AdminCMSService.destroyRelationFrom(this.props.model.teamToEdit.id, user.id).then((response) => {
                    if (response.data.destroyAssignmentRelation) {

                        this.props.dispatch(Action.getAction(adminActionTypes.REMOVE_TEAM_MEMBER, { teamId: this.props.model.teamToEdit.id, userId: user.id }));
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
                        let allLeaderIds = [];                              
                         allLeaderIds.push({ id: user.id, isLeader:false });
                         AdminCMSService.setLeader(allLeaderIds)
                                    .then(response => {
                            AdminCMSService.getUsers(this.props.model.filterModel.selectedSite.siteId, this.props.sharedModel.selectedQCInstances)
                            .then(mappedData => {
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, mappedData.user));
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected: true }));

                            });
                    }).catch((err) => {
                                        this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE,
                                            { validationMessage: err.message, isPopup: false, type: Constants.validation.types.error.key }));
                                        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
                    });
                        
                        let canvasserName = Utility.replaceAtTheRateSymbol(user.name);
                        // log event on GA
                        GAService.logEvent(
                            Utility.stringFormat(Constants.google_analytics.eventLogging.actions.Admin.removeCanvasser, canvasserName, this.props.model.teamToEdit.label),
                            Utility.stringFormat(Constants.messages.google_analytics.unAssignedAt, Utility.convertToFormat(new Date(), Constants.dateTimeFormates.mmddyyyy)),
                            Constants.google_analytics.eventLogging.eventLabels.removeAssignment,
                            false);
                    } else {
                        this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: Constants.messages.commonMessages.someErrorOccured, isPopup: false, type: Constants.validation.types.error.key }));
                    }
                })
                    .catch((err) => {
                        this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: err.message, isPopup: false, type: Constants.validation.types.error.key }));
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected: true }));
                    });
            },
            // on cancel click
            () => {
                this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: Constants.emptyString }));
            },
            this.props.dispatch
        );

    }
    setLeader(Leader) {
        let allLeaderIds = [];
        this.props.model.teamToEdit.user.forEach(function (user) {
            allLeaderIds.push({ id: user.id, isLeader: (user.id != Leader.id ? false : (Leader.properties.isTeamLeader == "true" ? false : true)) });
        })
        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, true));
        AdminCMSService.setLeader(allLeaderIds)
            .then(response => {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAM_LEADER, { users: allLeaderIds }));
                AdminCMSService.getUsers(this.props.model.filterModel.selectedSite.siteId, this.props.sharedModel.selectedQCInstances)
                    .then(mappedData => {
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, mappedData.user));
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected: true }));
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
                    });
                this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: this.props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected: true }));

            }).catch((err) => {
                this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE,
                    { validationMessage: err.message, isPopup: false, type: Constants.validation.types.error.key }));
                this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, false));
            });
    }

    render() {
        return (
            <div className="team-members custom-scroll">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th className="text-center">Assign&nbsp;as&nbsp;Team&nbsp;Leader</th>
                            <th className="text-center">Status</th>
                            <th className="text-right" style={{ "width": "10px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.model.teamToEdit.user.length ?
                                this.props.model.teamToEdit.user.map((user, index) => {
                                    return (

                                        <tr key={"team-user-" + index}>
                                            <td>({(index + 1)})</td>
                                            <td className={"text-left member-name1"} >{Utility.getCanvasserDetails(user).name}</td>
                                            <td className="text-left member-email1 email_absolute1">{Utility.getCanvasserDetails(user).email}</td>
                                            <td className={"text-center"}  >
                                                <label className={"leader label label-default " + ((user.properties.isTeamLeader == "true") ? " active " : "")} onClick={() => { this.setLeader(user) }} title={(user.properties.isTeamLeader == "false") ? "Set Team Leader" : ''} >Team Leader</label>
                                            </td>
                                            <td className={"text-center "}>
                                                {
                                                    (user.countInstanceStatus && user.countInstanceStatus.length && user.countInstanceStatus[0].label == Constants.routesStatus.in_progress) ?
                                                        <label className={"label  checkedin_user"}>
                                                            {Constants.canvasserCheckedIn.checkedIn}
                                                        </label>
                                                        :
                                                        <label className={"label  not_checkedin_user"}>
                                                            {Constants.canvasserCheckedIn.notCheckedIn}
                                                        </label>
                                                }

                                            </td>
                                            <td className="text-center" style={{ paddingBottom: "4px" }}><i className="fa fa-times-circle-o remove-row-icon" onClick={() => { this.onUserRemove(user) }} title="Remove canvasser from team."></i></td>

                                        </tr>
                                    );
                                })
                                : <tr className="displaynone"><td colSpan="6"></td></tr>

                        }
                    </tbody>
                </table>
                {!this.props.model.teamToEdit.user.length ? <div className="team-row no-routes">{Constants.messages.noTeamMember}</div> : ''}
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

export default connect(mapStateToProps)(TeamMember);