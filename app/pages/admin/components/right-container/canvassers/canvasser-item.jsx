import React from "react";
import { connect } from "react-redux";
import { Utility } from "../../../../../common/utility/";
import { Constants } from "../../../../../common/app-settings/constants";
const double_vertical_liner = require("../../../../../assets/img/double-vertical-liner.png");
const team_icon = require("../../../../../assets/img/teams-icon.png");
const leader_icon = require("../../../../../assets/img/man.svg");
class CanvasserItemComponent extends React.Component {

    constructor(props) {
        super(props);
    }



    render() {
        let { canvasser } = this.props;

        let canvasserStatusClass = "not_checkedin_user"
        let canvasserStatusString = Constants.canvasserCheckedIn.notCheckedIn
        if (canvasser.countInstanceStatus && canvasser.countInstanceStatus.length) {
            if (canvasser.countInstanceStatus[0].label == Constants.routesStatus.in_progress) {
                canvasserStatusClass = "checkedin_user"
                canvasserStatusString = Constants.canvasserCheckedIn.checkedIn
            }
            else if(canvasser.countInstanceStatus[0].label == Constants.routesStatus.completed){
                canvasserStatusClass = "checkedout_user"
                canvasserStatusString = Constants.canvasserCheckedIn.checkedOut
            }
        }
        let isFind = false;
        let selectedUsers = this.props.model.rightSideModel.selectedUsers;
        if (this.props.model.rightSideModel.selectedUsers && this.props.model.rightSideModel.selectedUsers.length > 0) {
            selectedUsers.forEach(obj => {
                if (obj.id == canvasser.id) {
                    isFind = true
                }
            });
        }
        canvasser.isSelected = isFind;

        return (
            <div className="right-side-route-item" >
                <div className="team-left">
                    {
                        canvasser.team.length == 0 ? <div className="canvasser-unassigned-team" /> : <img src={double_vertical_liner} className="double-liner" />
                    }

                    <div className="team-details">
                        <label className="members-count">
                            <input className="bulk_checkbox"
                                name={Utility.getCanvasserDetails(canvasser).email}
                                type="checkbox"
                                checked={canvasser.isSelected}
                                onChange={(e) => {
                                    console.log("e", e)
                                    this.props.handleCheckboxSelect(canvasser)
                                }
                                }
                            />
                            <label onClick={(e) => { this.props.onOpenEditCanvasserDialog(e, canvasser) }} className="canvasser-name ellipses"> {canvasser.properties.isTeamLeader == "true" ? <img width="20px" height="20px" src={leader_icon} title="team leader" /> : null} {Utility.getCanvasserDetails(canvasser).name}</label>
                        </label>
                        <label className="ellipses">
                            {
                                <span>{Utility.getCanvasserDetails(canvasser).email}</span>
                            }
                        </label>
                        <label className="members-route">
                            {
                                <div className="ellipses">
                                    <span className={canvasserStatusClass}>
                                        {
                                            canvasserStatusString
                                        }
                                    </span>
                                    <span className={canvasser.team.length == 0 ? 'unassigned-team' : 'canvasser-assigned-team-name'}>{canvasser.team.length == 0 ? 'Unassigned Team' : canvasser.team[0].label}</span>
                                </div>}
                        </label>
                    </div>
                </div>
                <div className="clear"></div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        model: state.adminModel
    }
};
export default connect(mapStateToProps)(CanvasserItemComponent);
