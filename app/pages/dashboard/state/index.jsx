import { Constants } from "../../../common/app-settings/constants"

// dashboard section state
export const dashboardState = {
  "middleFilterModel": {
    "panelProperties": {
      "panelAutoReloadInterval": "1m",
      "lastUpdatedOn": null,
      "displayRefreshButton": true,
      "panelExpanded": false,
      "panelReload": false,
      "panelCollapsed": false,
      "panelRemoved": false,
      "geoJSONLoaded":false,
      "mapNoRoutesFound":false
    },
    "searchKeywords": {
      "selectedOption": null,
      "options": []
    },
    "filterRoutesModel": [
      {
        "value": 1,
        "label": "Show All",
        "key": ""
      },
      {
        "value": 3,
        "label": "Not Started",
        "layerColor": "#ff0000",
        "key": "not_started",
        "opacity": 0.88
      },
      {
        "value": 2,
        "label": "In Progress",
        "layerColor": "#f7b047",
        "key": "in_progress"
      },
      {
        "value": 4,
        "label": "Completed",
        "layerColor": "#01ABAB",
        "key": "completed"
      }
    ],
    "filterRoutesSelected": {
      "value": 1,
      "label": "Show All",
      "key": ""
    },
    "dataViewData": {
      "teamsSurveys": null,
      "boroughsSurveys": null
    },
    "routeProgressOn": false
  },
  "rightSideModel": {
    "isSurveysLoading":true,
    "filtersModel": {
      "selectedBorough": {},
      "selectedSite": {},
      "selectedTeam": {}
    },
    "defaultOptionAll":{
      borough:{boroughId:-1,boroughName:"All"},
      site:{siteId:-1,siteName:"All"},
      team:{teamId:-1,teamName:"All",teamLabel:"All"}
    },
    "completedRoutes": 0,
    "totalRoutes": 0,
    "routesInProgress": 0,
    "surveysSubmitted": 0,
    "numberOfTeamsFinished": 0,
    "numberOfTeamsActive": 0,
    "totalTeams": 0,
    "boroughs": [
      {
        "boroughId": -1,
        "boroughName": "All"
      }
    ],
    "sites": [
      {
        "boroughId": -1,
        "siteId": -1,
        "siteName": "All"
      }
    ],
    "teams": [
      {
        "boroughId": -1,
        "siteId": -1,
        "teamId": -1,
        "teamName": "All",
        "teamLabel": "All",
        "lat": 0,
        "lon": 0
      }
    ],
    "filteredSites": [],
    "filteredTeams": [],
    "allRoutes": []
  },
  "searchedRoutes": [],
  "validation": {
    "message": "",
    "type": Constants.validation.types.success.key,
    "isPopup": false
  }
};