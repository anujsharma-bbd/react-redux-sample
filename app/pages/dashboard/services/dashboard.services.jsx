import { CommonService } from "../../shared/services/common.service";
import { Constants } from "../../../common/app-settings/constants";
import { Utility } from "../../../common/utility/";
/**
 * GraphQL queries for dashboard view.
 */
let DashboardService = {
  /**
   * Get all routes and the sites and teams withtin the route grapQL query.
   */
  getRoutesList: function (qcinstances) {
    let variables = `{
                        "contextAssignmentIds": [${qcinstances}],
                        "types": [
                                  {"name": "route","properties": ["type" ,"station","multipolygon_coordinates", "point_coordinates","park","needs_nypd"]},
                                  {"name": "site","properties": []},
                                  {"name": "countInstanceStatus","properties": []},
                                  {"name": "team", "properties": ["location"]}
                                ]
                      }`;
    let specs = {
      route: {
        site: null,
        team: null,
        countInstanceStatus: null
      }
    };

    return CommonService.sendRequest(variables, Constants.queryTypes.select).then(response => {
      const x = Utility.createMappedData(response.data, specs);
      return x
    }).catch(error => {
      throw new Error(error);
    });

  },

  /**
   * Get surveys sumiited count by areaName where areaName is in ("all", "zone","site","team")
   * In case of "all", the id parameter is not required.
   */
  getSurveysSubmitted: function (areaName, id, sites) {

    if (areaName != Constants.surveysSubmittedType.all && areaName != Constants.surveysSubmittedType.borough) {
      var requestPayload = `{
            submittedForms: submittedForms(filterType: "${areaName}", id: ${id})
        }
        `;
      return CommonService.sendRequest(requestPayload);
    }
    else {
      // if all borouhs selected then show sum of all sites surveys submitted
      if (sites) {
        let requestPayload = "";
        if (areaName == Constants.surveysSubmittedType.borough) {
          sites = sites.filter(m => m.boroughId == id);
        }
        sites.forEach(m => {
          requestPayload += m.siteId != -1 ? ("site_" + m.siteId) + ":submittedForms(filterType:\"site\",id:" + m.siteId + ") " : ' ';
        });
        requestPayload = "{ " + requestPayload + " }"
        return CommonService.sendRequest(requestPayload).then((response) => {
          if (response.data) {
            let sum = 0;
            Object.keys(response.data).forEach(x => {
              sum += parseInt(response.data[x]);
            })
            return { data: { submittedForms: sum } };
          }
          else
            return 0;
        })
      }
    }
  },
  getSurveysSubmittedCountByAreaAndId: function (area, contextAssignmentIds) {
    let variables = null, specs = "";
    const cString = `[${contextAssignmentIds.join(",")}]`
    if (area === Constants.surveysSubmittedType.all) {
      variables = `{
                        "contextAssignmentIds": ${cString},
                        "types": [
                                  {"name": "countInstance", "properties": ["submitted_forms_count"]}
                                ]
                      }`;
      specs = {
        countInstance: null
      };
    } else if (area === Constants.surveysSubmittedType.borough) {
      variables = `{
                        "contextAssignmentIds": ${cString},
                        "types": [
                                  {"name": "zone", "properties": ["submitted_forms_count"]}
                                ]
                      }`;
      specs = {
        zone: null
      };
    } else if (area === Constants.surveysSubmittedType.site) {
      variables = `{
                        "contextAssignmentIds": ${cString},
                        "types": [
                                  {"name": "site", "properties": ["submitted_forms_count"]}
                                ]
                      }`;
      specs = {
        site: null
      };
    } else if (area === Constants.surveysSubmittedType.team) {
      variables = `{
                        "contextAssignmentIds": ${cString},
                        "types": [
                                  {"name": "team", "properties": ["submitted_forms_count"]}
                                ]
                      }`;
      specs = {
        team: null
      };
    }
    return CommonService.sendRequest(variables, Constants.queryTypes.select).then(response => {
      return Utility.createMappedData(response.data, specs);
    }).catch(error => {
      throw new Error(error);
    });
  },
  /**
 * Get filters data for dashbboard grapQL query.
 */
  getFiltersData: function (qcInstance) {
    let variables = `{
                        "contextAssignmentIds": [${qcInstance}],
                        "types": [
                                  {"name": "zone","properties": ["submitted_forms_count"]},
                                  {"name": "site","properties": ["submitted_forms_count"]},
                                  {"name": "team", "properties": ["location","submitted_forms_count","coordinates"]},
                                  {"name":"countInstanceStatus", "properties":[]}
                                ]
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
      const x = Utility.createMappedData(response.data, specs);
      return x
    }).catch(error => {
      throw new Error(error);
    });

  },
  /**
   * Get surveys submitted for all teams grapQL query.
   */
  getSurveysSubmittedAllTeams: function (teams) {
    let teamIds = [];
    teams.forEach((team) => {
      if (team && team.teamId)
        teamIds.push(team.teamId);
    });

    let variables = `{
                        "contextAssignmentIds": [${teamIds}],
                        "types": [
                                  {"name": "team", "properties": ["submitted_forms_count"]}
                                ]
                      }`;
    let specs = {
      team: null
    };
    return CommonService.sendRequest(variables, Constants.queryTypes.select).then(response => {
      return Utility.createMappedData(response.data, specs);
    }).catch(error => {
      throw new Error(error);
    });
  },

  /**
   * Get surveys submitted for all boroughs grapQL query.
   */
  getSurveysSubmittedAllBoroughs: function (boroughs, allsites) {
    let boroughIds = [];
    boroughs.forEach((borough) => {
      if (borough && borough.boroughId)
        boroughIds.push(borough.boroughId);
    });

    let variables = `{
                        "contextAssignmentIds": [${boroughIds}],
                        "types": [
                                  {"name": "zone", "properties": ["submitted_forms_count"]}
                                ]
                      }`;
    let specs = {
      zone: null
    };

    return CommonService.sendRequest(variables, Constants.queryTypes.select).then(response => {
      return Utility.createMappedData(response.data, specs);
    }).catch(error => {
      throw new Error(error);
    });

  },

  getActiveCountInstance: function () {
    let variables = `{
                        "contextAssignmentIds": [],
                        "types": [
                                  {"name":"countInstance", "properties":["status", "startDate"]},
                                  { "name":"countType", "properties":[]}
                                ]
                      }`;
    let specs = {
      countInstance: {
        countType: {
        }
      }
    };
    return CommonService.sendRequest(variables, Constants.queryTypes.select).then(response => {
      const x = Utility.createMappedData(response.data, specs);
      return x
    }).catch(error => {
      throw new Error(error);
    });

  },

};

exports.DashboardService = DashboardService;
