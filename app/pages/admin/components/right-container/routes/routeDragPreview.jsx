'use strict';
import React, { Component, PropTypes } from 'react';
import DragLayer from 'react-dnd/lib/DragLayer';
import { Utility } from "../../../../../common/utility";
import { Constants } from "../../../../../common/app-settings/constants";
import RouteItemComponent from "./route-item";


function collect (monitor) {
    return {
        sourceOffset: monitor.getSourceClientOffset()
    };
}

class DragPreview extends Component {



    getLayerStyles() {      
        const { sourceOffset } = this.props;     
                     // Internet Explorer 6-11
        let isIE = /*@cc_on!@*/false || !!document.documentMode;
        return {       
            left : sourceOffset? (isIE?`${sourceOffset.x}px `:`${-window.innerWidth + 240+sourceOffset.x}px `):0,      
            top: sourceOffset? `${ this.props.ItemNo * 66+ sourceOffset.y }px`:0,
            width:"200px"

        };
    }

    // get routes class to be added based on their status
    getRouteClassName(routeObject){
        let bgColor = "";
        if(routeObject && routeObject.routeStatus){
           bgColor = this.props.sharedModel.filterRoutesStatuses.find(f=> f.key.toLowerCase() == routeObject.routeStatus.toLowerCase()).layerColor;
        }

        return bgColor;
    }


    render () {
        const {connectDragSource, isDragging, routeName, routeTeam, routeId, routeObject, routeType} = this.props;
        if (!isDragging) { return  null };
       
        return (
            <div className="source-preview " style={this.getLayerStyles()} >
                  <RouteItemComponent {...this.props} onOpenRouteOnMapDialog={this.props.onOpenRouteOnMapDialog} />           
            </div>
        );
    }
}

DragPreview.propTypes = {
    isDragging: PropTypes.bool,
    sourceOffset: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    })
};

export default DragLayer(collect)(DragPreview);
