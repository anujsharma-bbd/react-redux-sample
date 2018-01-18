import React from "react";
import { connect } from "react-redux";
import { Utility } from "../../../../../common/utility/";
import { adminActionTypes } from "../../../actions/adminActionTypes";
import * as Action from "../../../../shared/actions/action";
/**
 * Component to create map refresh control
 */
class RefreshTimeLogger extends React.Component {

    constructor(props) {
        super(props);
    }
    /**
     * call whem Component complete its cycle 
     */
    componentWillUnmount() {
        Utility.clearAdminInterval();
        Utility.abortAllPromises(() => {
            // hide loader image
            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
        });
    }
    /**
     * render html
     */
    render() {
        return (
            <div>
                {this.props.model.lastUpdatedOn ?
                    <div className="map-refresh-control custom-last-update">
                        <label style={{ color: "#FFF"}} className="updated-on-label">Last updated: </label>
                        <label style={{ color: "#FFF"}} className="updated-on-value">{this.props.model.lastUpdatedOn}</label>
                    </div>
                    : ""}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        model: state.adminModel.panelProperties
    };
}
export default connect(mapStateToProps)(RefreshTimeLogger);