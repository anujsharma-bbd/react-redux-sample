import React from "react";
import RouteWiseStatsComponent from "./route-wise-stats";
import TeamWiseStatsComponent from "./team-wise-stats";

/**
 * Boroughs statistics component.
 */
class BoroughStatsComponent extends React.Component {

    /**
     * Constructor
     */
    constructor(props) {
        super(props);
    }

    /**
     * Render view container for route and team view.
     */
    render() {

        return (
            <div className="data-view-list-item">
                <RouteWiseStatsComponent borough={this.props.borough} boroughData={this.props.boroughData} />
                <TeamWiseStatsComponent borough={this.props.borough} boroughData={this.props.boroughData} />
            </div>
        );
    }

}

export default BoroughStatsComponent;