import { CommonService } from "../../shared/services/common.service";
import { Constants } from "../../../common/app-settings/constants";
import { Utility } from "../../../common/utility/";

/**
 * GraphQL quesries to be send as POST in the body of the request.
 */
let AdminCMSService = {
  /**
   * Add team grapQL query.
   */
  addTeam: function (teamName, qcinstances) {
    qcinstances = Utility.getUniqueArray(qcinstances);
    let mutation = `
    mutation AddTeam {
      createAssignment(assignment: {name:  "${ teamName}", label:  "${teamName}", type: "team"},contextAssignmentIds:[${qcinstances}]) {
        id
      }
  }
    `;
    return CommonService.sendRequest(null, Constants.queryTypes.mutation, mutation);
  },
  /**
  * remove team grapQL query.
  */
  removeTeam: function (teamId) {
    let requestPayload = `
    mutation DestroyTeam {
      destroyAssignment(id:${teamId})
    }
    `;
    return CommonService.sendRequest(null, Constants.queryTypes.mutation, requestPayload);
  },

  /**
 * Destroy relation of canvasser from team.
 */
  destroyRelationCanvasserToTeam: function (destroyRelationFromTeamId, assigneeId) {
    let requestPayload = `
    mutation AssignRelationToTeam {
      destroyAssignmentRelation(parentAssignmentId: ${destroyRelationFromTeamId}, childAssignmentId: ${assigneeId})
    }
    `;
    return CommonService.sendRequest(null, Constants.queryTypes.mutation, requestPayload);
  },
  /**
   * Assign relationship between canvasser and team grapQL query.
   */
  assignRelationCanvasserToTeam: function (createRelationWithTeamId, assigneeId) {
    let requestPayload = `
    mutation AssignRelationToTeam {
      createAssignmentRelation(parentAssignmentId: ${createRelationWithTeamId}, childAssignmentId: ${assigneeId}) {
        id
        assignment1Id
        assignment2Id
      }
    }
    `;
    return CommonService.sendRequest(null, Constants.queryTypes.mutation, requestPayload);
  },

  /**
 * Assign relation between route and team grapQL query.
 */
  assignRelationRouteToTeam: function (destroyRelationFromTeamId, createRelationWithTeamId, assigneeId) {
    let requestPayload;
    if (destroyRelationFromTeamId != -1) {
      requestPayload = `
    mutation AssignRelationToTeam {
      destroyAssignmentRelation(parentAssignmentId: ${assigneeId}, childAssignmentId: ${destroyRelationFromTeamId})
      createAssignmentRelation(parentAssignmentId: ${assigneeId}, childAssignmentId: ${createRelationWithTeamId}) {
        id
        assignment1Id
        assignment2Id
      }
    }
    `
    } else {
      requestPayload = `
    mutation AssignRelationToTeam {
      createAssignmentRelation(parentAssignmentId: ${assigneeId}, childAssignmentId: ${createRelationWithTeamId}) {
        id
        assignment1Id
        assignment2Id
      }
    }
    `
    };
    return CommonService.sendRequest(null, Constants.queryTypes.mutation, requestPayload);
  },

  /**
 * Remove relation between assignments grapQL query.
 */
  destroyRelationFrom: function (fromId, assigneeId) {
    let requestPayload = `
                mutation DestroyRelationFromTeam {
                  destroyAssignmentRelation(parentAssignmentId: ${fromId}, childAssignmentId: ${assigneeId})
                  updateAssignment(assignmentId:${fromId}, update:{
                                  properties:[
                                    {
                                      type:"isTeamLeader",
                                      newValue: "false",
                                      newTypeLabel:"isTeamLeader"
                                    }
                                  ]
                                }){
                                  id
                                }
            }`;
    return CommonService.sendRequest(null, Constants.queryTypes.mutation, requestPayload);

  },
  /**
* Remove relation between assignments grapQL query.
*/
  destroyRelationForRouteFromTeam: function (fromId, assigneeId) {
    let requestPayload = `
                mutation DestroyRelationFromTeam {
                  destroyAssignmentRelation(parentAssignmentId: ${fromId}, childAssignmentId: ${assigneeId})
            }`;
    return CommonService.sendRequest(null, Constants.queryTypes.mutation, requestPayload);

  },
  /**
 * Removes relation of allIds from fromId grapQL query.
 */
  destroyRelationOfAllFrom: function (fromId, allIds) {
    let str = "";

    for (let index = 0; index < allIds.length; index++) {
      str += "destroy" + index + ":destroyAssignmentRelation(parentAssignmentId: " + allIds[index] + ", childAssignmentId: " + fromId + ") ";
    }
    let requestPayload = "\
    mutation destroyAllAssignments{\
      " + str + "\
    }\
    ";
    return CommonService.sendRequest(null, Constants.queryTypes.mutation, requestPayload);
  },
  /**
 * Adds canvasser grapQL query.
 */
  addCanvasser: function (newCanvasser, siteId, teamId, qcinstances) {
    let parentAssignmentIds = [...qcinstances, siteId];

    if (teamId && teamId > 0)
      parentAssignmentIds.push(teamId);

    parentAssignmentIds = Utility.getUniqueArray(parentAssignmentIds);
    let firstName = newCanvasser.firstName;
    let lastName = newCanvasser.lastName;
    let email = newCanvasser.email.toLowerCase();
    let name = firstName + " " + lastName;
    let mutation = `
          mutation AddCanvasser {
            createAssignment(assignment:
              {
                name: "${ email}",
                label: "${ name}",
                type: "user",
                properties: [
                  {type: "firstName", value: "${ firstName}", typeLabel:"firstName"},
                  {type: "registration_status", value: "registered", typeLabel:""},
                  {type: "lastName", value: "${ lastName}", typeLabel:"lastName"},
                  {type: "canvasserType", value: "${ newCanvasser.type.label}", typeLabel:"canvasserType"}
                ]
              },contextAssignmentIds:[${parentAssignmentIds}]
            )
            {
              id
            }
        }`;
    return CommonService.sendRequest(null, Constants.queryTypes.mutation, mutation);
  },
  /**
   * Update canvasser grapQL query.
   */
  updateCanvasser: function (canvasser) {
    let firstName = canvasser.firstName;
    let lastName = canvasser.lastName;
    let email = canvasser.email.toLowerCase();
    let name = firstName + " " + lastName;
    let isTeamLeader = canvasser.isTeamLeader;
    let requestPayload = `mutation UpdateCanvasser {
                                    updateAssignment(
                                      assignmentId:${canvasser.id}
                                      update: { 
                                        name: "${email}"
                                        label:"${name}"
                                        properties: [
                                                      {type: "firstName", newValue: "${firstName}", newTypeLabel:"firstName"},
                                                      {type: "lastName", newValue: "${lastName}", newTypeLabel:"lastName"},
                                                      {type: "email", newValue: "${email}", newTypeLabel:"email"},
                                                      {type: "isTeamLeader", newValue: "${isTeamLeader}", newTypeLabel:"isTeamLeader"},
                                                      {type: "canvasserType", newValue: "${canvasser.type.label}", newTypeLabel:"canvasserType"}
                                                    ]}) {
                                      id
                                    }
                                  }`;
    return CommonService.sendRequest(null, Constants.queryTypes.mutation, requestPayload);
  },
  /**
     * Update canvasser grapQL query.
     */
  removeTeamLeaderfromCanvasser: function (canvasserId) {
    let requestPayload = `mutation UpdateCanvasser {
                                    updateAssignment(
                                      assignmentId:${canvasserId}
                                      update: { 
                                        properties: [                                                      
                                                      {type: "isTeamLeader", newValue: "false", newTypeLabel:"isTeamLeader"},
                                                    ]}) {
                                      id
                                    }
                                  }`;
    return CommonService.sendRequest(null, Constants.queryTypes.mutation, requestPayload);
  },
  /**
   * Delete Canvasser
   */
  deleteCanvasser: function (canvasser) {
    let requestPayload = `mutation DeleteCanvasser {
                                    destroyAssignment(id:${canvasser.id})
                            }`;
    return CommonService.sendRequest(null, Constants.queryTypes.mutation, requestPayload);
  },
  /**
   * Get all canvassers for a give site Id grapQL query.
   */
  getUsers: function (siteId, qcinstances) {
    qcinstances = Utility.getUniqueArray(qcinstances);
    const contextAssignmentIds = qcinstances.concat(siteId).join(",")
    let variables = `{
                        "contextAssignmentIds": [${contextAssignmentIds}],
                        "types": [{"name": "team", "properties": []},{"name": "user", "properties": ["email","firstName","lastName","canvasserType","isTeamLeader"]},{"name": "countInstanceStatus", "properties": []}]
                      }`;
    let specs = {
      user: {
        team: null,
        countInstanceStatus: null
      }
    };
    return CommonService.sendRequest(variables, Constants.queryTypes.select).then(response => {
      return Utility.createMappedData(response.data, specs);;
    }).catch(error => {
      throw new Error(error);
    });
  },
  /**
   * Get all volunteers for a give Dedmo Instance grapQL query.
   */
  getVolunteers: function (qcinstances) {
    qcinstances = Utility.getUniqueArray(qcinstances);
    let variables = `{
                        "contextAssignmentIds": [${qcinstances}],
                        "types": [{"name": "team", "properties": []},{"name": "user", "properties": ["email","firstName","lastName","canvasserType","isTeamLeader"]},{"name": "countInstanceStatus", "properties": []}]
                      }`;
    let specs = {
      user: {
        team: null,
        countInstanceStatus: null
      }
    };
    return CommonService.sendRequest(variables, Constants.queryTypes.select).then(response => {
      return Utility.createMappedData(response.data, specs);;
    }).catch(error => {
      throw new Error(error);
    });
  },
  /**
   * Get all boroughs and sites grapQL query.
   */
  getBoroughsAndSites: function (qcinstances) {
    qcinstances = Utility.getUniqueArray(qcinstances);
    let variables = `{
                        "contextAssignmentIds": [${qcinstances}],
                        "types": [{"name": "zone","properties": []},{"name": "site","properties": []},
                                  {"name": "team", "properties": ["location"]},
                                  {"name":"countInstanceStatus", "properties":[]}]
                      }`;
    let specs = {
      zone: {
        site: {
          team: null
        }
      },
      countInstanceStatus: null
    };
    return CommonService.sendRequest(variables, Constants.queryTypes.select).then(response => {
      return Utility.createMappedData(response.data, specs);;
    }).catch(error => {
      throw new Error(error);
    });
  },
  /**
 * Get teams for selected site grapQL query.
 */
  getTeamsForSelectedSite: function (selectedSite, qcinstances) {
    let contextAssignmentIds;
    if(selectedSite)
    contextAssignmentIds = qcinstances.concat([selectedSite.siteId]).join(",")
    else
     contextAssignmentIds = qcinstances;
    let variables = `{
                        "contextAssignmentIds": [${contextAssignmentIds}],
                        "types": [{"name": "site", "properties": []},{"name": "team", "properties": ["location"]},{"name": "user", "properties": ["email","firstName","lastName","isTeamLeader"]},{"name": "route", "properties": ["type","station","needs_nypd","multipolygon_coordinates", "point_coordinates","park"]},{"name": "countInstanceStatus", "properties": []}]
                      }`;
    let specs = {
      site: {
        team: {
          route: {
            countInstanceStatus: null
          },
          user: {
            countInstanceStatus: null
          },
          location: null
        }
      }
    };
    return CommonService.sendRequest(variables, Constants.queryTypes.select).then(response => {
      return Utility.createMappedData(response.data, specs);;
    }).catch(error => {
      throw new Error(error);
    });
  },

  /**
   * Get routes for a given site grapQL query.
   */
  getRoutesBySite: function (siteId, qcinstances) {
    const contextAssignmentIds = qcinstances.concat(siteId).join(",")
    let variables = `{
                        "contextAssignmentIds": [${contextAssignmentIds}],
                        "types": [{"name": "team", "properties": []},{"name": "route", "properties": ["type","station","needs_nypd","multipolygon_coordinates","park", "point_coordinates"]},{"name": "countInstanceStatus", "properties": []}]
                      }`;
    let specs = {
      route: {
        team: null,
        countInstanceStatus: null
      }
    }
    return CommonService.sendRequest(variables, Constants.queryTypes.select).then(response => {
      return Utility.createMappedData(response.data, specs);;
    }).catch(error => {
      throw new Error(error);
    });
  },
  updateRouteType: function (routeId, routeType) {
    let requestPayload = `
    mutation UpdateRouteType{
      updateAssignment(assignmentId: ${routeId}, update: {
      properties: [
        {
          type:"type"
          newValue: \"${routeType}\"
        }
      ]
    }){
      id
    }
  }
    `;
    return CommonService.sendRequest(requestPayload);

  },
  /**
   * set team leader.
   */
  setLeader: function (allLeaderIds) {
    let requestData = "";
    allLeaderIds.forEach((user, index) => {
      requestData += `a${index + 1}: updateAssignment(assignmentId:${user.id}, update:{
                      properties:[
                        {
                          type:"isTeamLeader",
                          newValue: "${user.isLeader}"
                        }
                      ]
                    })
                    {
                      id
                    }`
    })
    let requestPayload = `mutation UpdateCanvasser{   ${requestData} } `;

    return CommonService.sendRequest(null, Constants.queryTypes.mutation, requestPayload);
  },
  // cheeck user exists or not
  checkUserExists: (email) => {
    return CommonService.checkUserExists(email).then((response) => {
      return response.ci_exists && response.status; // 'true' if user exists , else 'false'
    });
  }
};

exports.AdminCMSService = AdminCMSService;
