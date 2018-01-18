import React from "react";
import { connect } from "react-redux";
import { Line } from 'rc-progress';
import { DashboardService } from '../../../../services/dashboard.services';
import { dashboardActionTypes } from "../../../../actions/dashboardActionTypes";
import * as Action from "../../../../../shared/actions/action";
import { Constants } from "../../../../../../common/app-settings/constants";
import { Utility } from "../../../../../../common/utility/";
/**
 * Team Statistics component for data view
 */
class TeamWiseStatsComponent extends React.Component {
    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.colors = { background: "#7F8489" };
        this.getBoroughStats = this.getBoroughStats.bind(this);
        this.getTeams = this.getTeams.bind(this);
    }
    /**
     * Get boroughs stats for team and site
     */
    getBoroughStats(teamId, siteId) {

        let totalRoutes = this.props.boroughData.routes.filter((route) => (route.siteId === siteId && route.teamId == teamId));
        let stats = Utility.getRoutesStats(totalRoutes);
        return {
            percent: Utility.getRoutePercentage(totalRoutes.length,stats.inprogress,stats.completed,stats.notstarted)
        };
    }

    /**
     * Get team for given site.
     */
    getTeams(siteId) {
        let teams = this.props.boroughData.teams.filter((team) => team.siteId === siteId);
        teams.forEach((team) => {
            team.percent = this.getBoroughStats(team.teamId, siteId).percent;
            team.color = (team.percent == 0 ? Constants.colorCodes.notStartedRoutes : (team.percent == 100 ? Constants.colorCodes.completedRoutes : Constants.colorCodes.inProgressRoutes));
        });
        return teams;
    }
    /**
     * Render route stats view.
     */
    render() {

        return (
            <div>
                <div className="data-list-bottom custom-scroll">
                    {
                        this.props.boroughData.sites.map((site, index) =>
                            <div key={"borough-site-index-" + index} >
                                <label className="data-list-site-header">
                                    {site.siteName}
                                </label>
                                <div className="data-list-route">
                                  
                                        {
                                            this.getTeams(site.siteId).map((team, teamindex) =>

                                                <div className="data-list-routes-item clearfix" key={"site-team-key-" + teamindex} style={{ color: team.color,fontSize:'9px', padding:"5px 0" }}>
                                                    <div className="data-list-route-name col-xs-2 p-0 p-r-10">
                                                        {team.teamLabel}
                                                    </div>
                                                    <div className="data-list-progress-bar col-xs-8 ">
                                                        <Line percent={team.percent} strokeWidth="7" strokeColor={team.color} trailWidth="7" trailColor={this.colors.background} />
                                                    </div>
                                                    <div className="data-list-route-percent col-xs-1 p-0">
                                                        {team.percent + "%"}
                                                    </div>
                                                    <div className="data-list-submitted-surveys col-xs-1 p-0" title={team.submittedFormsCount ? team.submittedFormsCount : ''} >
                                                        { team.submittedFormsCount ? team.submittedFormsCount : ''}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="clear">
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

export default connect(mapStateToProps)(TeamWiseStatsComponent);