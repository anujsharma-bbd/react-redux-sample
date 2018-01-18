import React from "react";
import { connect } from "react-redux";
import { dashboardActionTypes } from "../../actions/dashboardActionTypes";
import * as Action from "../../../shared/actions/action";
import ReactHighcharts from 'react-highcharts'; // Expects that Highcharts was loaded in the code.
/**
 * Teams progress chart.
 * For now, this feature is not in use hence not commenting code.
 */
class TeamsProgressComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        this.model = this.props.model;
        this.dispatch = this.props.dispatch;
        let numberOfTeamsFinished = this.model.rightSideModel.numberOfTeamsFinished;
        let totalTeams = this.model.rightSideModel.totalTeams;
        let numberOfTeamsActive = this.model.rightSideModel.numberOfTeamsActive;
        let config = {
            chart: {
                type: 'bar',
                height: 150,
                // Edit chart spacing
                spacingBottom: 15,
                spacingTop: 10,
                spacingLeft: 10,
                spacingRight: 10,

                // Explicitly tell the width and height of a chart

                backgroundColor: null,
                plotBackgroundColor: null
            },
            plotOptions: {
                bar: {
                    borderWidth: 0,
                    borderRadius: 6,
                    color: '#15ADAC',
                    pointPadding: 0.4,
                    dataLabels: {
                        x: numberOfTeamsActive + numberOfTeamsFinished,
                        inside: false,
                        crop: false,
                        overflow: 'none',
                        enabled: false,
                        style: {
                            color: '#B0C9CF',
                            textShadow: 'none',
                            fontSize: '12px',
                            fontWeight: 'normal'
                        }
                    }
                }
            },
            title: {
                text: ''
            },
            yAxis: {
                lineWidth: 1,
                tickInterval: 10,
                minorGridLineWidth: 0,
                gridLineColor: 'transparent',
                minorTickLength: 0,
                tickLength: 0,
                min: 0,
                title: {
                    text: '',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                },
                max: numberOfTeamsActive + numberOfTeamsFinished
            },
            credits: { enabled: false },
            /* HighchartsConfig */
            xAxis: [{
                lineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: 'transparent',
                gridLineColor: 'transparent',
                minorTickLength: 0,
                tickLength: 0,
                categories: ['Teams Active', 'Teams Finished'],
                labels: {
                    align: 'left',
                    x: 0,
                    y: -15,
                    style: {
                        fontSize: '11px',
                        color: '#B0C9CF',
                        whiteSpace: 'nowrap'
                    }
                }
            }
                , {
                opposite: true,
                linkedTo: 0,
                categories: [numberOfTeamsActive,numberOfTeamsFinished],
                lineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: 'transparent',
                gridLineColor: 'transparent',
                minorTickLength: 0,
                tickLength: 0,
                labels: {
                    align: 'left',
                    x: 0,
                    y: -15,
                    style: {
                        fontSize: '12px',
                        color: '#B0C9CF',
                        whiteSpace: 'nowrap'
                    }
                }
            }
            ],
            series: [{
                showInLegend: false,
                name: 'Teams Progress',
                data: [numberOfTeamsActive, numberOfTeamsFinished]
            }
            ],

        };
        return (

            <div className="teams-progress-container">
                <ReactHighcharts config={config} ref="chart"></ReactHighcharts>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        model: state.dashboardModel
    }
}
export default connect(mapStateToProps)(TeamsProgressComponent);