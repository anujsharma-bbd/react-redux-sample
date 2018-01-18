import { CommonService } from "../../shared/services/common.service";
import { Constants } from "../../../common/app-settings/constants";
import { Utility } from "../../../common/utility/";

/**
 * GraphQL quesries to be send as POST in the body of the request.
 */
let ManageSitesService = {
    /**
     * Get all boroughs and sites grapQL query.
     */
    getBoroughsAndSites: function (qcinstances) {
        qcinstances = Utility.getUniqueArray(qcinstances);
        let variables = `{
                        "contextAssignmentIds": [${qcinstances}],
                        "types": [{"name": "zone","properties": []},{"name": "site","properties": ["maxCanvPerSite","siteType"]}]
                      }`;
        let specs = {
            zone: {
                site: null
            }
        };
        return CommonService.sendRequest(variables, Constants.queryTypes.select).then(response => {
            return Utility.createMappedData(response.data, specs);;
        }).catch(error => {
            throw new Error(error);
        });
    },
    /**
 * Adds Site grapQL query.
 */
    addSite: function (site, boroughId, qcinstances) {
        let parentAssignmentIds = [...qcinstances, boroughId];
        parentAssignmentIds = Utility.getUniqueArray(parentAssignmentIds);

        let mutation = `
          mutation AddSite {
            createAssignment(assignment:
              {
                name: "${ site.siteName}",
                label: "${ site.siteLabel}",
                type: "site",
                properties: [
                  {type: "maxCanvPerSite", value: "${ site.maxCanvPerSite}", typeLabel:"maxCanvPerSite"},
                  {type: "siteType", value: "${ site.siteType}", typeLabel:"siteType"}
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
   * Update Site grapQL query.
   */
    updateSite: function (site) {

        let requestPayload = `mutation UpdateSite {
                                    updateAssignment(
                                      assignmentId:${site.id}
                                      update: { 
                                        name: "${site.siteName}"
                                        label:"${site.siteLabel}"
                                        properties: [
                                                      {type: "maxCanvPerSite", newValue: "${site.maxCanvPerSite}", newTypeLabel:"maxCanvPerSite"},
                                                      {type: "siteType", newValue: "${site.siteType}", newTypeLabel:"siteType"}
                                                    ]}) {
                                      id
                                    }
                                  }`;
        return CommonService.sendRequest(null, Constants.queryTypes.mutation, requestPayload);
    },/**
   * Delete Site
   */
    deleteSite: function (site) {
        let requestPayload = `mutation DeleteSite {
                                    destroyAssignment(id:${site.id})
                            }`;
        return CommonService.sendRequest(null, Constants.queryTypes.mutation, requestPayload);
    },

};

exports.ManageSitesService = ManageSitesService;
