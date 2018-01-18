import React from "react";
import { connect } from 'react-redux';
import DashboardMiddleContainer from "./middle-container/";
import DashboardRightContainer from "./right-container/";
import AuthorizedComponent from "../../shared/base/authorized-component";

/**
 * WebDashboard container component for dashboard middle and right component containers.
 */
class WebDashboard extends AuthorizedComponent{
  /**
   * Constructor
   */
  constructor(props){
    super(props);    
  }
  
  /**
   * Render view.
   */
  render(){
   
    return (
       <div>
           <DashboardMiddleContainer children={this.props.children} location={this.props.location} />
           <DashboardRightContainer location={this.props.location}/>
       </div>
   );
  }
}

const mapStateToProps = (state) => {
   return {
    model:state.dashboardModel
  }
}

export default connect(mapStateToProps)(WebDashboard);


