import React from "react";
import { connect } from "react-redux";
import { dashboardActionTypes } from "../../actions/dashboardActionTypes";
import * as Action from "../../../shared/actions/action";
import CircularProgressChartComponent from '../controls/circular-progress-chart/';
import { DashboardService } from '../../services/dashboard.services';
import {Utility} from "../../../../common/utility";
import {Constants} from "../../../../common/app-settings/constants";

/**
 * RouteProgressComponent.
 * Contains Circular progress bar chart and routes in progress and Surveys Submitted count.
 */
class RouteProgressComponent extends React.Component {
    /**
     * constructor to initialize fields.
     */
    constructor(props) {
        super(props);
    }

    /**
     * RouteProgressComponent render.
     */
    render() {
        this.model = this.props.model;
        this.dispatch = this.props.dispatch;
        let information = Utility.stringFormat(Constants.messages.routeProgress.routesCompletedInformation,this.model.rightSideModel.completedRoutes, this.model.rightSideModel.totalRoutes);
        let percentage = this.model.rightSideModel.totalRoutes != 0 ? parseFloat(parseFloat((this.model.rightSideModel.completedRoutes / this.model.rightSideModel.totalRoutes) * 100).toFixed(1)) : 0;
        return (
            <div >
                <div>
                    <label className="labelElement">Routes Completed</label>
                </div>
                <div className="progressBar">
                {/** Circular Radial progress bar */}
                    <CircularProgressChartComponent edgeSize={165} radius={75} circleStrokeWidth={9} circleStroke="#1a2229" circleFill="transparent"
                        progressStroke="orange" value={percentage} unit="percent" displayPercentLabel={true} displayProgressLabel={true} percentLabelClassName="percentLabel" progressLabelClassName="progressLabel"
                        currentValue={this.model.rightSideModel.completedRoutes} maxValue={this.model.rightSideModel.totalRoutes}
                        animated={false} fps={0} progressRate={1} />
                </div>
                <div className="divContaining2Divs">
                    <div className="halfOfParent">
                        <div>
                            <label className="labelElement">Routes in Progress</label>
                        </div>
                        <div>
                            <label className="labelElementBig">{this.model.rightSideModel.routesInProgress}</label>
                        </div>
                    </div>
                    <div className="halfOfParent">
                        <div>
                            <label className="labelElement">Surveys Submitted</label>
                        </div>
                        <div>
                            <label className={"labelElementBig " + ((this.props.model.rightSideModel.isSurveysLoading ) ? " surveys-loading " :'')}>
                                {this.model.rightSideModel.surveysSubmitted}
                            </label>
                        </div>
                    </div>
                </div>
            </div >);

    }
}

const mapStateToProps = (state) => {
    return {
        model: state.dashboardModel
    }
}

export default connect(mapStateToProps)(RouteProgressComponent);