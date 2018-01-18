import React from "react";
import { connect } from "react-redux";

class MapLegendBar extends React.Component{

    constructor(props){
        super(props);
        this.getStyle = this.getStyle.bind(this);

    }  
    getStyle(color){
        return {
            backgroundColour:color
        };
    }
    render(){
        return (
            <div className="legend-bar"> 
             {
                 this.props.model.map((category,index)=>{
                     return (
                         (category.key!=="") ? 
                            <div className="legend-bar-item" key={index+"-bar"}>
                                <span className="bar-color" style={{backgroundColor:category.layerColor}}></span>
                                <span className="bar-name">{category.label}</span>
                            </div>
                         : ''
                     ); 
                 })
             }
            </div>
        );

    }

}

const mapStateToProps = (state)=>{
  return {
    model:state.dashboardModel.middleFilterModel.filterRoutesModel
  }
};

export default connect(mapStateToProps)(MapLegendBar);