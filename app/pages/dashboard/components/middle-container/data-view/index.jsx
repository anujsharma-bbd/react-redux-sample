import React from "react";
import { connect } from "react-redux";
import * as Action from "../../../../shared/actions/action";
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";
import { dashboardActionTypes } from "../../../actions/dashboardActionTypes";
import { DashboardService } from '../../../services/dashboard.services';
import BoroughStatsComponent from "./borough-stats/";
import { Constants } from "../../../../../common/app-settings/constants"
import AuthorizedComponent from "../../../../shared/base/authorized-component";
import MapRefreshControl from "../../controls/map-refresh-control/";


/**
 * DataView component 
 */
class DataViewComponent extends AuthorizedComponent {

    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.getBoroughData = this.getBoroughData.bind(this);
    }

    /**
     * Set tab to dataview on component mount.
     */
    componentDidMount() {
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_TAB_CHANGE, { key: Constants.dashBoardViewKey.dataView }));
    }

    /**
     * Get boroughs data for data view.
     */
    getBoroughData(boroughId) {
        return {
            routes: this.props.model.rightSideModel.allRoutes.filter((route) => route.boroughId === boroughId),
            teams: this.props.model.rightSideModel.teams.filter((team) => team.boroughId === boroughId),
            sites: this.props.model.rightSideModel.sites.filter((site) => site.boroughId === boroughId)
        };
    }

    /**
     * Render.
     */
    render() {
        let boroughs = this.props.model.rightSideModel.boroughs.filter((borough) => borough.boroughId !== -1);

        return (
        <div className="dataview-tb"> 
        
            <div className="data-view-container data-view-list">
                {
                    boroughs.map((borough, index) => {
                        return <BoroughStatsComponent key={"borough-statss-item-" + index} borough={borough} boroughData={this.getBoroughData(borough.boroughId)} />
                    })
                }
            </div>
          </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        model: state.dashboardModel
    };
}
export default connect(mapStateToProps)(DataViewComponent);