import React from "react";
import Modal from 'tg-modal';
import Select from "react-select";
import ValidationControl from '../../../../shared/controls/validation-control';

const team_icon = require("../../../../../assets/img/teams-icon.png");
const route_map = require("../../../../../assets/img/route-map.png");
const single_vertical = require("../../../../../assets/img/single-vertical-liner.png");

/**
 * Component for Jump team modal
 */
class JumpTeamModal extends React.Component{

  constructor(props){
    super(props);
  }
  /**
   * Render html for team Modal
   */
  render(){
     return (
       <div className="container jump-team-container">
            <Modal isOpen={this.props.isOpen} autoWrap title="Jump Team" isStatic={this.props.loader}  onCancel={(e)=> this.props.onCancel(e) } className="myclass">
            <ValidationControl message={this.props.model.validation.message} type={this.props.model.validation.type} isPopup={this.props.model.validation.isPopup} />
             {this.props.loader ? <div className="model-loader"><span className="spinner"></span></div> : ''}
               <div className="team-members custom-scroll">
                     <div className="team-row ">
                        1. <span className="member-name">Roman Moran</span> <span className="member-email">moran.roman@gmail.com</span> 
                        <img src={team_icon} alt="" className="team-icon"/>
                        <i className="fa fa-times-circle-o remove-row-icon"></i>
                     </div>
                     <div className="team-row">
                        2. <span className="member-name">Warren Richards</span> <span className="member-email">moran.roman@gmail.com</span> 
                        <img src={team_icon} alt="" className="team-icon"/>
                        <i className="fa fa-times-circle-o remove-row-icon"></i>
                     </div>
                     <div className="team-row">
                        3. <span className="member-name">Roman Moran</span> <span className="member-email">moran.roman@gmail.com</span> 
                        <img src={team_icon} alt="" className="team-icon"/>
                        <i className="fa fa-times-circle-o remove-row-icon"></i>
                     </div>
                     <div className="team-row">
                        4. <span className="member-name">Warren Richards</span> <span className="member-email">moran.roman@gmail.com</span> 
                        <img src={team_icon} alt="" className="team-icon"/>
                        <i className="fa fa-times-circle-o remove-row-icon"></i>
                     </div>
                     <div className="team-row">
                        5. <span className="member-name">Roman Moran</span> <span className="member-email">moran.roman@gmail.com</span> 
                        <img src={team_icon} alt="" className="team-icon"/>
                        <i className="fa fa-times-circle-o remove-row-icon"></i>
                     </div>
                      <div className="team-row">
                        6. <span className="member-name">Warren Richards</span> <span className="member-email">moran.roman@gmail.com</span> 
                        <img src={team_icon} alt="" className="team-icon"/>
                        <i className="fa fa-times-circle-o remove-row-icon"></i>
                     </div>
                      <div className="team-row">
                        7. <span className="member-name">Roman Moran</span> <span className="member-email">moran.roman@gmail.com</span> 
                        <img src={team_icon} alt="" className="team-icon"/>
                        <i className="fa fa-times-circle-o remove-row-icon"></i>
                     </div>
               </div>
               <div className="team-routes custom-scroll">
                     <div className="team-row">
                        <div className="team-routes-left">
                            <img src={route_map} className="map-route" />
                            <span className="team-route-name">Route 3a</span> 
                        </div>
                        <div className="team-routes-right">
                           <img src={single_vertical} className="single-liner" />
                            <span className="team-route-type">Type : Non-subway</span>
                        </div>
                        <i className="fa fa-times-circle-o remove-row-icon"></i>
                        <div className="clear"></div>
                     </div>   
                      <div className="team-row">
                        <div className="team-routes-left">
                            <img src={route_map} className="map-route" />
                            <span className="team-route-name">Route 3b</span> 
                        </div>
                        <div className="team-routes-right">
                           <img src={single_vertical} className="single-liner" />
                            <span className="team-route-type">Type : Subway</span>
                        </div>
                        <i className="fa fa-times-circle-o remove-row-icon"></i>
                        <div className="clear"></div>
                     </div>       
                      <div className="team-row">
                        <div className="team-routes-left">
                            <img src={route_map} className="map-route" />
                            <span className="team-route-name">Route 3c</span> 
                        </div>
                        <div className="team-routes-right">
                           <img src={single_vertical} className="single-liner" />
                            <span className="team-route-type">Type : Non-subway</span>
                        </div>
                        <i className="fa fa-times-circle-o remove-row-icon"></i>
                        <div className="clear"></div>
                     </div>       
                      <div className="team-row">
                        <div className="team-routes-left">
                            <img src={route_map} className="map-route" />
                            <span className="team-route-name">Route 3d</span> 
                        </div>
                        <div className="team-routes-right">
                           <img src={single_vertical} className="single-liner" />
                            <span className="team-route-type">Type : Non-subway</span>
                        </div>
                        <i className="fa fa-times-circle-o remove-row-icon"></i>
                        <div className="clear"></div>
                     </div>                         
               </div>
                <div className="footer-bar">
                   <a href="javascript:void(0)" className="link-button pull-left delete-button red-delete-canv">Delete</a>
                    <button className="button remove-routes-button pull-right">Remove All Routes</button>
                    <div className="clear"></div>
                </div>
                <div className="jump-team-asign-bourogh-site">
                   <div className="assign-filter-bar">
                                <table  cellSpacing="0" cellPadding="0" >
                                <tbody>
                                    <tr>
                                      <td className="filter-boroughs">
                                            <label>
                                              Borough
                                            </label>
                                            <Select  searchable  />
                                      </td>
                                      <td  className="filter-sites">
                                            <label>
                                              Site
                                            </label>                          
                                            <Select searchable  />
                                      </td>
                                      <td className="assign-sites">
                                             <button className="button reassign-button">Reassign</button>
                                             <div className="clear"></div>
                                      </td>

                                    </tr>
                                    </tbody>
                                </table>            
                          </div>
                </div>
             </Modal>
        </div>

     );
  }
}

export default JumpTeamModal;