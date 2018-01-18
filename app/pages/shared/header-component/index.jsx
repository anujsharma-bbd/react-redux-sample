import React from "react";
import { connect } from "react-redux";
import { Link,IndexLink  } from 'react-router';
import Favicon from "react-favicon";
const header_logo = require("../../../assets/img/dss_logo_white_sm.png");
const profile_logo = require("../../../assets/img/user-rbs.jpg");
const favIcon = require("../../../assets/img/demo_ico.png");

import { sharedActionTypes } from "../actions/sharedActionTypes";
import * as Action from "../actions/action";
import { LoginService }  from "../../login/services/login.service.jsx";

class AppHeader extends React.Component{

  constructor(props){
   super(props);
   this.setLogOut = this.setLogOut.bind(this);
   this.onProfileMenuOpen = this.onProfileMenuOpen.bind(this);  
   this.onClickLeftMenuToggle = this.onClickLeftMenuToggle.bind(this); 
  }
  setLogOut(){
      this.props.dispatch(Action.getAction(sharedActionTypes.SET_LOG_OUT, {}));
      LoginService.setLogout();
  }
  onProfileMenuOpen(){
       this.props.dispatch(Action.getAction(sharedActionTypes.SET_TOGGLE_PROFILE_MENU, null));
       
       // listner
       let addClickListner = ()=>{
           this.props.dispatch(Action.getAction(sharedActionTypes.SET_DOCUMENT_CLICK, false));
           // REMOVE EVENT LISTNER
           document.removeEventListener("click",addClickListner);
       };
       // add onclick listner
       document.addEventListener("click", addClickListner);
  }
  // toggling left and right menu
  onClickLeftMenuToggle(flag){

       if(flag)
            this.props.dispatch(Action.getAction(sharedActionTypes.SET_LEFT_MENU_SMALL_SCREEN_TOGGLED,{}));   
        else
            this.props.dispatch(Action.getAction(sharedActionTypes.SET_RIGHT_MENU_SMALL_SCREEN_TOGGLED,{}));  

  }
  render(){
      let loginDetails = this.props.sharedModel.loginDetails;

      return (
          <div id="header"className="header navbar navbar-default navbar-fixed-top">  
            <Favicon url={[favIcon]} />
            <div className="container-fluid">
                <div className="navbar-header">
                    <button  className="navbar-toggle pull-left" onClick={ ()=> { this.onClickLeftMenuToggle(true) }} data-click="sidebar-toggled">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <button  className="navbar-toggle pull-right" onClick={ ()=> { this.onClickLeftMenuToggle(false) }} data-click="right-sidebar-toggled">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                  
                     <Link  to="/dashboard/mapview" className="navbar-brand"  activeClassName="selected-left-menu-item">
                        <img src={header_logo} alt="DSS" width="190" height="33" />
                     </Link>
                </div>               
               
                     <ul className="nav navbar-nav navbar-right">
                            <li className="dropdown navbar-user">
                            <a href="javascript:;" className="dropdown-toggle" onClick={this.onProfileMenuOpen}>
                               {/* <img src={profile_logo} alt="" /> */} 
                                <span className=" text-white">{loginDetails.displayName}</span> <b className={"caret text-white"+(this.props.sharedModel.profileMenu.isOpened ?" carat-up ":'')}></b>
                            </a>
                            <ul className={"dropdown-menu"+(!this.props.sharedModel.profileMenu.isOpened ? " displaynone " :'')}>
                                {
                                    /* <li className="arrow"></li>
                                        <li><a href="javascript:;"><span className="badge badge-danger pull-right">2</span> Inbox</a></li>
                                        <li><a href="javascript:;">Calendar</a></li>
                                        <li><a href="javascript:;">Setting</a></li>
                                    */
                                }
                                    <li className="disabled" ><a href="javascript:;">Edit Profile</a></li>
                                    <li className="divider"></li>
                                <li><a href="javascript:void(0);" onClick={()=> this.setLogOut() }>Log Out</a></li>
                            </ul>
                        </li>
                     </ul>
            </div>
           
        </div>
       
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sharedModel: state.sharedModel
  }
};
export default connect(mapStateToProps)(AppHeader);