import React from "react";
import { connect } from "react-redux";
/**
 * Component to create Tool Box Control
 */
class ToolBoxControl extends React.Component
{
    constructor(props){
        super(props);
        this.keys = {
            expand: "expand",
            relaod: "relaod",
            collapse: "collapse",
            remove: "remove"
        };
        
    }
/**
 * render html code
 */   
render(){
        let dataModel=this.props.dataModel;
        return (
            <div className="panel-heading-btn">
                   <a href="javascript:void(0);" title='Expand / Compress' className="btn btn-xs btn-icon btn-circle btn-default" onClick={()=> this.props.onExpand() }><i className="fa fa-expand"></i></a>
                   {this.props.dataModel.displayRefreshButton ?<a href="javascript:void(0);" className="btn btn-xs btn-icon btn-circle btn-success" title="Reload" onClick={()=> this.props.onReload() }><i className="fa fa-repeat"></i></a>:''}
                   <a href="javascript:void(0);" className="btn btn-xs btn-icon btn-circle btn-warning displaynone" onClick={()=> this.props.onCollapse() } title='Collapse / Expand'><i className={dataModel.panelCollapsed?"fa fa-plus":"fa fa-minus"}></i></a>
                   <a href="javascript:void(0);" className="btn btn-xs btn-icon btn-circle btn-danger displaynone" data-click="panel-remove" onClick={()=> this.props.onRemove() }><i className="fa fa-times"></i></a>
            </div>
        );
    };
}
/**
 * initialize current state
 */
function mapStateToProps(state){
    return {
        model:state
    };
}
export default ToolBoxControl;