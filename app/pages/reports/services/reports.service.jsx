import { CommonService } from "../../shared/services/common.service";
import { Constants } from "../../../common/app-settings/constants";
import { Utility } from "../../../common/utility/";
/**
 * GraphQL quesries to be send as POST in the body of the request.
 */
let ReportsService = {
 
  getSurveySubmittedList: (assignmentNames, pageNumber, pageSize,qcinstances) => {
    return CommonService.sendNonGraphQLRequest(assignmentNames, pageNumber, pageSize,qcinstances);
  },

 /**
 * Get all boroughs and sites grapQL query.
 */
  getBoroughsAndSites: function (qcinstances) {
    qcinstances = Utility.getUniqueArray(qcinstances);
    let variables = `{
                        "contextAssignmentIds": ${qcinstances},
                        "types": [{"name": "zone","properties": []},{"name": "site","properties": []}]                        
                      }`;
    let specs = {
      zone: {
        site: {
        }
      }
    };
    return CommonService.sendRequest(variables, Constants.queryTypes.select).then(response => {
      return Utility.createMappedData(response.data, specs);;
    }).catch(error => {
      throw new Error(error);
    });
  }
};

exports.ReportsService = ReportsService;