import React from "react";
import { connect } from "react-redux";
import { Utility } from "../../../../../common/utility/";
import { dashboardActionTypes } from "../../../actions/dashboardActionTypes";
import * as Action from "../../../../shared/actions/action";
/**
 * Component to create map refresh control
 */
class MapRefreshControl extends React.Component{

 constructor(props){
     super(props);
    }
    
    /**
     * render html
     */
    render (){
        return (
            <div className={this.props.model.lastUpdatedOn ? " map-refresh-margin ":''}>
             { 
                 this.props.model.lastUpdatedOn ? 
                    <div className="map-refresh-control">
                        <label className="updated-on-label">Last updated: </label>
                        <label className="updated-on-value">{this.props.model.lastUpdatedOn}</label>
                    </div>    
                :""  
        }
            </div> 
        );
    }
}

function mapStateToProps(state){
    return {
        model:state.dashboardModel.middleFilterModel.panelProperties
    };
}
export default connect(mapStateToProps)(MapRefreshControl);