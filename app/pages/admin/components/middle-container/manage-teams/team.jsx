import React, { PropTypes } from "react";
import { connect } from 'react-redux';
import Modal from 'tg-modal';
import Select from "react-select";
import { compose } from 'redux';
import { DropTarget } from 'react-dnd';
import { Utility } from "../../../../../common/utility";
import { adminActionTypes } from "../../../actions/adminActionTypes";
import * as Action from "../../../../shared/actions/action";
import { GAService } from "../../../../shared/services/ga-service";

import { Constants } from "../../../../../common/app-settings/constants";
import { AdminCMSService } from "../../../services/admin-cms.service";
const team_icon = require("../../../../../assets/img/teams-icon.png");
const route_icon = require("../../../../../assets/img/route-icon.png");
const double_vertical_liner = require("../../../../../assets/img/double-vertical-liner.png");
import { Popover, OverlayTrigger } from 'react-bootstrap';

const teamListTarget = {
  drop(props, monitor) {
    let ToggleLoaders = function (showCanvRoutLoader, showTeamLoader) {
      props.dispatch(Action.getAction(adminActionTypes.SET_ROUTE_CANVAS_LOADER_TOGGLE, {
        showCanvRoutLoader: showCanvRoutLoader,
        showTeamLoader: showTeamLoader
      }));
    }
    if (monitor.getItemType() === Constants.dragType.canvasser) {
      let canvasser = monitor.getItem();
      //hit service to add canvasser to team and dispatch
      let team = props.team;
      let destroyRelationFromTeamId = -1;
      let allTeams = props
        .model
        .searchedTeams
        .filter((sTeam) => (sTeam.id != team.id));
      for (let teamIndex = 0; teamIndex < allTeams.length; teamIndex++) {
        let canvasserIndexToRemove = (allTeams[teamIndex].user.findIndex((user) => (user.id == canvasser.canvasserToBeDropped.canvasser.id)));
        if (canvasserIndexToRemove > -1) {
          destroyRelationFromTeamId = allTeams[teamIndex].id;
          break;
        }
      }
      // first add canvasser to team and then dispatch action to remove the same
      // canvasser from the other team to reinstantiate the DOM
      let createRelationWithTeamId = team.id;
      let assigneeId = canvasser.canvasserToBeDropped.canvasser.id;
      let confirmMessage = Utility.stringFormat(Constants.messages.assignCanvasserToTeam, canvasser.canvasserToBeDropped.canvasser.name, team.label);

      function assignRelationCanvasserToTeam() {
        // start loader on right side
        ToggleLoaders(true, true);
        if (destroyRelationFromTeamId != -1) {
          AdminCMSService
            .destroyRelationCanvasserToTeam(destroyRelationFromTeamId, assigneeId)
            .then((response) => {

              if (response.data.destroyAssignmentRelation == null) {
                // console.log("Destroy relation of canvasser to team failure.", response.errors[0].message, canvasser);
                props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                  validationMessage: Utility.stringFormat(Constants.messages.assignCanvasserToTeamFailure, canvasser.canvasserToBeDropped.canvasser.name, canvasser.canvasserToBeDropped.canvasser.team[0].name),
                  isPopup: false,
                  type: Constants.validation.types.warning.key
                }));
                window.setTimeout(() => {
                  props
                    .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                      validationMessage: Constants.emptyString,
                      isPopup: false,
                      type: Constants.validation.types.success.key
                    }));
                }, Constants.messages.defaultMessageTimeout);
                // hide loader on right side
                ToggleLoaders(false, false);
                props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected: true }));
              } else {
                AdminCMSService.removeTeamLeaderfromCanvasser(canvasser.canvasserToBeDropped.canvasser.id).then((response) => {
                  canvasser.canvasserToBeDropped.canvasser.properties.isTeamLeader = "false";
                  AdminCMSService.assignRelationCanvasserToTeam(createRelationWithTeamId, assigneeId)
                    .then((response) => {
                      if (response.data.createAssignmentRelation.id > 0) {
                        props.dispatch(Action.getAction(adminActionTypes.REMOVE_CANVASSER_FROM_TEAM, {
                          team: team,
                          canvasser: canvasser.canvasserToBeDropped.canvasser
                        }));
                        AdminCMSService
                          .getUsers(props.model.filterModel.selectedSite.siteId, props.sharedModel.selectedQCInstances)

                          .then(mappedData => {
                            props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, mappedData.user));
                            // hide loader on right side
                            ToggleLoaders(false, false);
                            props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected: true }));
                          });
                        let canvasserName = Utility.replaceAtTheRateSymbol(canvasser.canvasserToBeDropped.canvasser.name);
                        // log event on GA
                        GAService.logEvent(
                          Utility.stringFormat(Constants.google_analytics.eventLogging.actions.Admin.assignCanvasser, canvasserName, team.label),
                          Utility.stringFormat(Constants.messages.google_analytics.assignedAt, Utility.convertToFormat(new Date(), Constants.dateTimeFormates.mmddyyyy)),
                          Constants.google_analytics.eventLogging.eventLabels.addAssignment,
                          false);

                      } else {
                        props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                          validationMessage: Utility.stringFormat(Constants.messages.assignCanvasserToTeamFailure, canvasser.canvasserToBeDropped.canvasser.name, canvasser.canvasserToBeDropped.canvasser.team[0].name),
                          isPopup: false,
                          type: Constants.validation.types.warning.key
                        }));
                        window.setTimeout(() => {
                          props
                            .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                              validationMessage: Constants.emptyString,
                              isPopup: false,
                              type: Constants.validation.types.success.key
                            }));
                        }, Constants.messages.defaultMessageTimeout);
                        // hide loader on right side
                        ToggleLoaders(false, false);
                        props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected: true }));

                      }
                    })
                    .catch((err) => {
                      props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                        validationMessage: Utility.stringFormat(Constants.messages.assignCanvasserToTeamFailure, canvasser.canvasserToBeDropped.canvasser.name, canvasser.canvasserToBeDropped.canvasser.team[0].name),
                        isPopup: false,
                        type: Constants.validation.types.warning.key
                      }));
                      window.setTimeout(() => {
                        props
                          .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                            validationMessage: Constants.emptyString,
                            isPopup: false,
                            type: Constants.validation.types.success.key
                          }));
                      }, Constants.messages.defaultMessageTimeout);
                      // hide loader on right side
                      ToggleLoaders(false, false);
                    });

                }).catch((err) => {
                  console.log(err.message);
                  // hide loader on right side
                  ToggleLoaders(false, false);
                });


              }
            })
            .catch((err) => {
              console.log(err.message);
              // hide loader on right side
              ToggleLoaders(false, false);
            });

        } else {
          AdminCMSService
            .assignRelationCanvasserToTeam(createRelationWithTeamId, assigneeId)
            .then((response) => {
              if (response.data.createAssignmentRelation.id > 0) {
                props.dispatch(Action.getAction(adminActionTypes.REMOVE_CANVASSER_FROM_TEAM, {
                  team: team,
                  canvasser: canvasser.canvasserToBeDropped.canvasser
                }));
                AdminCMSService
                  .getUsers(props.model.filterModel.selectedSite.siteId, props.sharedModel.selectedQCInstances)
                  .then(mappedData => {
                    props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS, mappedData.user));
                    // hide loader on right side
                    ToggleLoaders(false, false);
                    props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected: true }));

                  });
                let canvasserName = Utility.replaceAtTheRateSymbol(canvasser.canvasserToBeDropped.canvasser.name);
                // log event on GA
                GAService.logEvent(
                  Utility.stringFormat(Constants.google_analytics.eventLogging.actions.Admin.assignCanvasser, canvasserName, team.label),
                  Utility.stringFormat(Constants.messages.google_analytics.assignedAt, Utility.convertToFormat(new Date(), Constants.dateTimeFormates.mmddyyyy)),
                  Constants.google_analytics.eventLogging.eventLabels.addAssignment,
                  false);

              } else {
                props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                  validationMessage: Utility.stringFormat(Constants.messages.assignCanvasserToTeamFailure, canvasser.canvasserToBeDropped.canvasser.name, team.label),
                  isPopup: false,
                  type: Constants.validation.types.warning.key
                }));
                window.setTimeout(() => {
                  props
                    .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                      validationMessage: Constants.emptyString,
                      isPopup: false,
                      type: Constants.validation.types.success.key
                    }));
                }, Constants.messages.defaultMessageTimeout);
                // hide loader on right side
                ToggleLoaders(false, false);
                props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: props.model.rightSideModel.keywordSearchCanvModel.selectedOption, convassersTabSelected: true }));

              }
            })
            .catch((err) => {
              props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                validationMessage: Utility.stringFormat(Constants.messages.assignCanvasserToTeamFailure, canvasser.canvasserToBeDropped.canvasser.name, team.label),
                isPopup: false,
                type: Constants.validation.types.warning.key
              }));
              window.setTimeout(() => {
                props
                  .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                    validationMessage: Constants.emptyString,
                    isPopup: false,
                    type: Constants.validation.types.success.key
                  }));
              }, Constants.messages.defaultMessageTimeout);
              // hide loader on right side
              ToggleLoaders(false, false);
            });
        }

      }

      if (canvasser.canvasserToBeDropped.canvasser.canvasserStatus === "NCI") {
        Utility.showConfirm(confirmMessage,
          () => {
            // proceed func callback
            assignRelationCanvasserToTeam();
          },
          () => {
            // cancel func callback
          }
          , this.props.dispatch);
      } else {
        assignRelationCanvasserToTeam();
      }
    } else if (monitor.getItemType() === Constants.dragType.route) {
      let route = monitor.getItem();
      let team = props.team;

      let destroyRelationFromTeamId = -1;
      let allTeams = props.model.searchedTeams.filter((sTeam) => (sTeam.id != team.id));
      for (let teamIndex = 0; teamIndex < allTeams.length; teamIndex++) {
        let routeIndexToRemove = (allTeams[teamIndex].route.findIndex((rRoute) => (rRoute.id == route.routeToBeDropped.routeId)));
        if (routeIndexToRemove > -1) {
          destroyRelationFromTeamId = allTeams[teamIndex].id;
          break;
        }
      }
      // first add canvasser to team and then dispatch action to remove the same
      // canvasser from the other team to reinstantiate the DOM
      let createRelationWithTeamId = team.id;
      let assigneeId = route.routeToBeDropped.routeId;
      // start loader on right side
      ToggleLoaders(true, true);
      AdminCMSService.assignRelationRouteToTeam(destroyRelationFromTeamId, createRelationWithTeamId, assigneeId).then((response) => {
        if ((destroyRelationFromTeamId != -1 && response.data.destroyAssignmentRelation) || (destroyRelationFromTeamId == -1)) {
          if (response.data.createAssignmentRelation.id > 0) {

            props.dispatch(Action.getAction(adminActionTypes.REMOVE_ROUTE_FROM_TEAM, {
              team: team, route: {
                id: route.routeToBeDropped.routeId,
                name: route.routeToBeDropped.routeObject.label,
                routeName: route.routeToBeDropped.routeObject.label,
                status: route.routeToBeDropped.routeStatus,
                routeStatus: route.routeToBeDropped.routeStatus,
                routeType: route.routeToBeDropped.routeType,
                needNypd: route.routeToBeDropped.routeObject.properties.needsNypd,
                properties: route.routeToBeDropped.routeObject.properties,
                countInstanceStatus: route.routeToBeDropped.routeObject.countInstanceStatus
              }
            }));
            AdminCMSService
              .getRoutesBySite(props.model.filterModel.selectedSite.siteId, props.sharedModel.selectedQCInstances).then(mappedData => {
                props.dispatch(Action.getAction(adminActionTypes.SET_ROUTES_SEARCHED_RESULTS, mappedData.route));
                ToggleLoaders(false, false);
                props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: props.model.rightSideModel.keywordSearchRoutesModel.selectedOption, convassersTabSelected: false }));

              });
            // log event on GA
            GAService.logEvent(
              Utility.stringFormat(Constants.google_analytics.eventLogging.actions.Admin.assignRoute, route.routeToBeDropped.routeObject.label, team.label),
              Utility.stringFormat(Constants.messages.google_analytics.assignedAt, Utility.convertToFormat(new Date(), Constants.dateTimeFormates.mmddyyyy)),
              Constants.google_analytics.eventLogging.eventLabels.addAssignment,
              false);

          } else {
            ToggleLoaders(false, false);
          }

        } else {
          ToggleLoaders(false, false);
        }
      });
    }
  },

  canDrop(props, monitor) {
    if (monitor.getItemType() === Constants.dragType.canvasser) {
      let canvasser = monitor.getItem();
      let team = props.team;
      //add validation check to add canvasser

      if (team.user.findIndex((user) => (user.id == canvasser.canvasserToBeDropped.canvasser.id)) != -1) {
        return false;
      }
      return true;
    } else if (monitor.getItemType() === Constants.dragType.route) {
      let route = monitor.getItem();
      let team = props.team;
      //add validation check to add route
      if (team.route.findIndex((r) => (r.id == route.routeToBeDropped.routeId)) != -1) {
        return false;
      }
      return true;
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
};

class Team extends React.Component {
  constructor(props) {
    super(props);
  }

  onCancelDialog(e) {
    e.preventDefault();
    this.dispatch(Action.getAction(adminActionTypes.SET_TEAM_DIALOG_OPEN, { IsOpen: false }));
  }
  // return assigned routes
  getAssignedRoutes() {
    let assignedRoutes = this.props.team.route;
    if (assignedRoutes) {
      assignedRoutes.forEach((route) => {
        let sector = '';
        let subSector = ''
        let i = 0;
        let routeName = route.name.trim();
        for (i = 0; i < routeName.length; i = i + 1) {
          if (parseInt(routeName[i]) || routeName[i] == 0) {
            sector = sector.toString() + routeName[i].toString();
          } else {
            subSector = subSector + routeName[i];
          }
        }
        route.sector = sector;
        route.subSector = subSector;
      });
      assignedRoutes.sort((a, b) => {
        if (a.sector === b.sector) {
          return a.subSector > b.subSector ? 1 : a.subSector < b.subSector ? -1 : 0;
        }
        return parseInt(a.sector) > parseInt(b.sector) ? 1 : -1;
      });
    }
    return assignedRoutes;
  }

  // showTooltip() {
  //   this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAM_USER_POP_UP_OPEN, { IsOpen: true }));
  // }
  // hideTooltip() {
  //   this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAM_USER_POP_UP_OPEN, { IsOpen: false }));
  // }

  /**
   * render html code
   */
  render() {
    const { connectDropTarget, isOver } = this.props;
    const team = this.props.team;
    const popoverClick = (
      <Popover id="popover-trigger-focus" title={team.user.length + " Member(s)"} style={{ width: "100%" }}>
        <div className="team-all-members team-all-members-pop-over">
          <div className="table-responsive table-pop-over custom-scroll-bar">
            {team.user.length != 0 ?
              <table className="table m-b-0">
                <thead>
                  <tr>
                    <th width="10" style={{ "background": "#cddae5" }}>#</th>
                    <th style={{ "background": "#cddae5" }}>Name</th>
                    <th style={{ "background": "#cddae5" }}>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    team.user.map((user, index) =>
                      <tr key={"team-member-key" + index} className={user.properties.isTeamLeader == "true" ? 'teamleader_row' : ''}>
                        <td>{index + 1}</td>
                        <td>
                          {Utility.getCanvasserDetails(user).name}

                        </td>
                        <td className="member-email">{Utility.getCanvasserDetails(user).email}</td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
              : null
            }
          </div>
        </div>
      </Popover>
    );
    let assignedRoutes = this.getAssignedRoutes();
    return (
      connectDropTarget(
        team ?
          <div className="col-lg-4 col-md-6 col-sm-12 team-row-wrap">
            <div className="team-row" key={team.id}>
              <div className="clearfix">
                <div className="col-md-8">
                  <div className="clearfix">
                    <div className="col-sm-6  p-10 f-s-16">
                      <span onClick={(e) => { this.props.onOpenEditTeamDialog(e, team) }} className="team-name-admin-label">{team.label}</span>
                    </div>
                    <div className="col-sm-6 p-10 p-t-20 p-top-18 text-center">
                      {team.user.length === 0 ? <label className="members-count no-members">{team.user.length + " "}Members</label> :
                        <label className="members-count">{team.user.length + " "} {team.user.length === 1 ? 'Member' : 'Members'} </label>}
                    </div>
                    <div className="col-sm-12">
                      <div className="team-all-members tile">
                        <div className="table-responsive custom-scroll-bar">

                          <table className="table m-b-0">
                            <thead>
                              <tr>
                                <th width="10">#</th>
                                <th>Name</th>
                                <th>Email</th>
                              </tr>
                            </thead>
                            {team.user.length != 0 ?
                              <tbody onClick={(e) => { this.props.onOpenEditTeamDialog(e, team) }}>
                                {
                                  team.user.map((user, index) => {
                                    return (index < 5) ?
                                      <tr key={"team-member-key" + index} className={user.properties.isTeamLeader == "true" ? 'teamleader_row' : ''}>
                                        <td>{index + 1}</td>
                                        <td>
                                          {Utility.getCanvasserDetails(user).name}
                                        </td>
                                        <td className="member-email">{Utility.getCanvasserDetails(user).email}</td>
                                      </tr> : null
                                  }
                                  )
                                }
                              </tbody> : <tbody />
                            }
                          </table>

                        </div>
                      </div>
                      {
                        team.user && team.user.length ?
                          <OverlayTrigger trigger={"click"} rootClose={true} placement="bottom" overlay={popoverClick}>
                            <a className="member-view-all">View All Members <i className="fa fa-chevron-down f-s-16" ></i></a>
                          </OverlayTrigger>
                          : ''
                      }
                    </div>
                  </div>
                </div>
                <div className="col-md-4  p-l-0">
                  <div className="">
                    <div className="team-details">
                      {team.route.length === 0 ? <label className="members-count no-members p-10 p-l-2 p-t-20">{team.route.length + " "}Routes</label> :
                        <label className="members-count p-10 p-l-2 p-t-20 ">{team.route.length + " "} {team.route.length === 1 ? 'Route' : 'Routes'}
                          <i className="fa fa-map-o pull-right map-db cursor-pointer" onClick={() => { this.props.onOpenRouteOnMapDialog(team.route, team) }}></i>
                        </label>
                      }
                      <div className="members-route all-routes-under-team custom-scroll-bar">
                        <table className="custom-scroll-bar routes-in-pre">
                          <tbody>
                            {
                              team.route.length == 0 ? <tr><td><span className="unassigned-team">Unassigned Route</span></td></tr> :
                                assignedRoutes.map((route, index) =>
                                  <tr key={"teams-routes-" + index}>
                                    <td>
                                      {Utility.getSubwayRouteName(route)}
                                      {((route.properties.needsNypd && route.properties.needsNypd.toLowerCase() === Constants.routeNeedNYPD.true.toLowerCase()) ? <span className="need_nypd_admin  need_nypd_admin_active" style={{ marginLeft: "5px" }}>NYPD</span> : '')}
                                      {(route.properties.park && route.properties.park.toLowerCase() === Constants.isPark.true.toLowerCase()) ? <span className="ispark" style={{ marginLeft: "5px" }}>Park</span> : null}
                                      {team.route.length - 1 === index ? '' : ''}
                                    </td>
                                  </tr>
                                )
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className="clear">
              </div>

              {isOver ? <div className='drag-hover' /> : ''}

            </div>
          </div>

          : ''
      ));
  }

}

/**
 * initialize current state
 */
const mapStateToProps = (state) => {
  return { model: state.adminModel, sharedModel: state.sharedModel }
}

Team.propTypes = {
  isOver: PropTypes.bool.isRequired
};

export default compose(connect(mapStateToProps), DropTarget([
  Constants.dragType.canvasser, Constants.dragType.route
], teamListTarget, collect))(Team);