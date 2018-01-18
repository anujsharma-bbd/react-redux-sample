import React from "react";
import { connect } from "react-redux";
import { Constants } from "../../../../../common/app-settings/constants";
const route_map = require("../../../../../assets/img/route-map.png");
const double_liner = require("../../../../../assets/img/double-vertical-liner.png");
import { Utility } from "../../../../../common/utility";

class RouteItemComponent extends React.Component
{

    constructor(props){
        super(props);
        this.getRouteClassName = this.getRouteClassName.bind(this);
        this.getBGColor = this.getBGColor.bind(this);
    }
     // get routes class to be added based on their status
    getRouteClassName(routeObject) {
        let classname = " route-unassigned-team ";
        if (routeObject && routeObject.team && routeObject.team.length) {
            classname = " route-assigned-team ";
        }

        return classname;
    }
     // get routes class to be added based on their status
    getBGColor(routeObject) {
        let bgColor = "";
        if (routeObject && routeObject.countInstanceStatus && routeObject.countInstanceStatus.length) {
            bgColor = this.props.sharedModel.filterRoutesStatuses.find(f => f.key.toLowerCase() == routeObject.countInstanceStatus[0].label.toLowerCase()).layerColor;
        }
        else
            bgColor = this.props.sharedModel.filterRoutesStatuses.find(f => f.key.toLowerCase() == Constants.routesStatus.not_started.toLowerCase()).layerColor;

        return bgColor;
    }
    render(){
         const {  routeName, routeTeam, routeId, routeObject, routeType } = this.props;
            // Internet Explorer 6-11
        let isIE = /*@cc_on!@*/false || !!document.documentMode;
        let classes = routeTeam === 'Unassigned Team' ? "members-route no-members unassigned-team-to-route" : "members-route ";
        return (
            <div className={"right-side-route-item all-routes-right " + this.getRouteClassName(routeObject) } key={routeName}  >
                    <div className="team-left">
                        { (routeObject && routeObject.team && routeObject.team.length) ? <img src={double_liner} className="double-liner" /> :'' }
                        <div className="team-details" style={{ paddingLeft: "5px" }}>
                            <label className="members-count ellipses">{Utility.getSubwayRouteName(routeObject)}  </label>
                            <label className={isIE?`routes-label ${classes}`: classes}>{routeTeam}</label>
                            <div className="route_flags">
                                {(routeObject.properties.needsNypd && routeObject.properties.needsNypd.toLowerCase() === Constants.routeNeedNYPD.true.toLowerCase()) ? <span className="need_nypd  need_nypd_active">NYPD</span> : null}
                                {(routeObject.properties.park && routeObject.properties.park.toLowerCase() === Constants.isPark.true.toLowerCase()) ? <span className="ispark" style={(routeObject.properties.needsNypd && routeObject.properties.needsNypd.toLowerCase() === Constants.routeNeedNYPD.true.toLowerCase()) ? {marginLeft:"5px"}:{marginLeft:"0px"}}>Park</span> : null}
                            </div>
                        </div>
                        <i className="fa fa-map route-icon routelist-route-map-icon" title="View/Edit Route Map" style={{ color: this.getBGColor(routeObject),marginTop:'12px' }} onClick={() => { this.props.onOpenRouteOnMapDialog(routeObject) } }  ></i>
                    </div>

                    <div className="clear">
                    </div>
                </div>
        );
    }
}

const mapStatToProps = (state)=>{
    return { 
        model:state.model,
        sharedModel:state.sharedModel,
     };
};
export default connect(mapStatToProps)(RouteItemComponent);