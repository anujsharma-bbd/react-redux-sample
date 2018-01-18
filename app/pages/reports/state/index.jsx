import { Constants } from "../../../common/app-settings/constants"


// dashboard section state
export const reportsState = { 
    "isDownloadingReport":false,
    "panelProperties": {
                "panelExpanded": false,
                "displayRefreshButton": false,
                "panelReload": false,
                "panelCollapsed": false,
                "panelRemoved": false
    },
    "validation": {
                "message": "",
                "type":  Constants.validation.types.success.key,
                "isPopup": false
    },
     "filterModel": {
                "boroughs": [],
                "sites": [],
                "selectedBorough": null,
                "selectedSite": null
            },
      "surveySubmittedModel":{
          headers:[],
          data: [],
          jsonData: [],
          submittedSurveyGridModel:{
              currentPage:1,
              perPage:17,
              totalEntries:0,
              totalPages:0,
          }

      }
};
