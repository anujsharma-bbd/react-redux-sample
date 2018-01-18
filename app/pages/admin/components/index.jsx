import React from "react";
import { connect } from 'react-redux';

import AdminMiddleContainer from "./middle-container/";
import AdminRightContainerComponent from "./right-container/";
import {Utility} from "../../../common/utility/";
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import {compose } from 'redux'; 
import AuthorizedComponent from '../../shared/base/authorized-component';


/**
 * AdminCMS component container for Middle and Right components of admin section.
 */
class AdminCMS extends AuthorizedComponent{
  
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
            <AdminMiddleContainer children={this.props.main} location={this.props.location} />
            <AdminRightContainerComponent children={this.props.children} location={this.props.location} />        
       </div>       
   );
  }
}

const mapStateToProps = (state) => {
   return {
    model:state.adminModel
  }
}

//export default connect(mapStateToProps)(AdminCMS);
export default compose(connect(mapStateToProps), DragDropContext(TouchBackend({ enableMouseEvents: true, delayTouchStart : Utility.isTouchDevice()? 100:0 })))(AdminCMS); 


