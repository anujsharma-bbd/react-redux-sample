import React from "react";
import { connect } from 'react-redux';

import ReportsMiddelContainerComponent from "./middle-container/";
import ReportsRightContainerComponent from "./right-container/";
import {Utility} from "../../../common/utility/";
import AuthorizedComponent from '../../shared/base/authorized-component';


/**
 * ReportsContainer component container for Middle and Right components of admin section.
 */
class ReportsContainer extends AuthorizedComponent{
  
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
            <ReportsMiddelContainerComponent children={this.props.children} location={this.props.location} />
            <ReportsRightContainerComponent location={this.props.location} />
       </div>       
   );
  }
}

const mapStateToProps = (state) => {
   return {
    model:state.reportsModel
  }
}

export default connect(mapStateToProps)(ReportsContainer);


