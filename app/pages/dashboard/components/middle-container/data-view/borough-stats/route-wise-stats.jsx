import React from "react";
import { connect } from "react-redux";
import { DashboardService } from '../../../../services/dashboard.services';
import { dashboardActionTypes } from "../../../../actions/dashboardActionTypes";
import * as Action from "../../../../../shared/actions/action";
import CircularProgressChartComponent from "../../../controls/circular-progress-chart";
import { Constants } from "../../../../../../common/app-settings/constants";
import { Utility } from "../../../../../../common/utility/";

/**
 * Route Statistics component for data view.
 */
class RouteWiseStatsComponent extends React.Component {
    /**
     * Constructor to initialize fields.
     */
    constructor(props) {
        super(props);
        //initialize all statistics with zero.
        this.stats = {
            completed: 0,
            inprogress: 0,
            notstarted: 0,
            totalTeams: 0,
            submittedSurveys: 0,
            completesPercentage: 0
        };
        //set color codes ; background color should be removed
        this.colors = { 
            inprogress: Constants.colorCodes.inProgressRoutes, 
            completed: Constants.colorCodes.completedRoutes, 
            background: "#7F8489", 
            notstarted: Constants.colorCodes.notStartedRoutes 
        };
        this.getBoroughStats = this.getBoroughStats.bind(this);
        //get boroughs statistics.
        this.getBoroughStats(this.props.boroughData);
    }
    /**
     * Get boroughs statis on receiving props.
     */
    componentWillReceiveProps() {
        this.getBoroughStats(this.props.boroughData);
    }
    /**
     * Get boroughs stats
     */
    getBoroughStats(data) {       
        let stats = Utility.getRoutesStats(data.routes);
        this.stats.completed = stats.completed;
        this.stats.inprogress = stats.inprogress;
        this.stats.notstarted = stats.notstarted;
        this.stats.completesPercentage =  Utility.getRoutePercentage(data.routes.length,stats.inprogress,stats.completed,stats.notstarted);
        this.stats.totalTeams = data.teams.length;
    }
    /**
     * Render view
     */
    render() {
        let boroughSurveys = this.props.model.middleFilterModel.dataViewData.boroughsSurveys;
        return (
            <div className="data-list-top">
                <img src={require("../../../../../../assets/img/borough-" + this.props.borough.boroughName.toLowerCase().replace('_','').replace(' ','') + ".png")} alt="" className="borough-icon" />

                <label className="data-list-header">
                    {this.props.borough.boroughName}
                </label>
                <div className="zone-stats">

                    <div className="stats-left">
                        <div className="progressBar">
                            <CircularProgressChartComponent edgeSize={80} radius={50} circleStrokeWidth={9} circleStroke="#1a2229" circleFill="transparent"
                                progressStroke="orange" value={this.stats.completesPercentage} unit="percent" displayPercentLabel={true} displayProgressLabel={false} percentLabelClassName="percentLabel-dataview" progressLabelClassName="progressLabel"
                                maxValue={100} animated={false} />
                        </div>
                    </div>

                    <div className="stats-right">
                        <div className="stats-list-item">
                            <label className="pull-left">Completed </label>
                            <label className="pull-right" style={{ color: this.colors.completed }}>{this.stats.completed}</label>
                            <div className="clear"></div>
                        </div>
                        <div className="stats-list-item">
                            <label className="pull-left">In Progress </label>
                            <label className="pull-right" style={{ color: this.colors.inprogress }}>{this.stats.inprogress}</label>
                            <div className="clear"></div>
                        </div>
                        <div className="stats-list-item">
                            <label className="pull-left">Not Started </label>
                            <label className="pull-right" style={{ color: this.colors.notstarted }}>{this.stats.notstarted}</label>
                            <div className="clear"></div>
                        </div>
                        <div className="stats-list-item">
                            <label className="pull-left">Total Teams </label>
                            <label className="pull-right text-underline">{this.stats.totalTeams}</label>
                            <div className="clear"></div>
                        </div>
                    </div>

                </div>
                <div className="data-list-top-bottom">
                    <label className="pull-left margin-top-3px">
                        Submitted Surveys: <label className="surverys-count">{this.props.borough.submittedFormsCount ? this.props.borough.submittedFormsCount : "NA"}</label>
                    </label>
                    <label className="pull-right displaynone">
                        Details <i className="fa fa-arrow-circle-o-right details-right-arrow"></i>
                    </label>
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
export default connect(mapStateToProps)(RouteWiseStatsComponent);