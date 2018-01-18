import { Constants } from "../../../common/app-settings/constants"
import { Users } from "./users";

// shared state for all components
export
    const
    sharedState = {
        confirmModal: {
            isShowing: false,
            message: "",
            options: null
        },
        downloading: {
            isDownloading: false,
            downloadingText: 'Downloading...',
            downloadText: "Download"
        },
        leftMenuExpaned: true,
        isRightPanelExpanded: true,
        smallScreenLeftMenuOpened: false,
        smallScreenRightMenuOpened: false,
        countType: "quarterlyCount", //quarterlycount for qc otherwise hopecount.
        selectedQCInstances: [],
        selectedQCInstanceName: "",
        isCanvDownloading: false,
        selectedCountInstance: {
            id: 0,
            name: null,
            startDate: null,
            startTime: null,
            endDate: null,
            endTime: null,
            registrationStartDate: null,
            registrationStartTime: null,
            registrationEndDate: null,
            registrationEndTime: null,
            status: null,
            routeDescriptor: null,
            teamDescriptor: null,
            type: null
        },
        routesOnMap: {
            isOpened: false,
            popupLoaderShown: false,
            routeObject: null
        },
        countInstanceStatus: [],
        filterRoutesStatuses: [{
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
        }],
        "menuPanels": [
            {
                "text": "Dashboard",
                "value": Constants.menuCategory.dashboard,
                "isOpened": false,
                "iconClass": "fa fa-map-o"
            },
            {
                "text": "Admin",
                "value": Constants.menuCategory.admin,
                "isOpened": false,
                "iconClass": "fa fa-user"
            },
            {
                "text": "Reports",
                "value": Constants.menuCategory.reports,
                "isOpened": false,
                "iconClass": "fa fa-bar-chart"
            }
        ],
        "profileMenu": {
            "isOpened": false
        },
        "tabs": [
            {
                "key": "mapview",
                "text": "Map View",
                "isSelected": true,
                "category": Constants.menuCategory.dashboard
            },
            {
                "key": "listview",
                "text": "List View",
                "isSelected": false,
                "category": Constants.menuCategory.dashboard
            },
            {
                "key": "dataview",
                "text": "Data View",
                "isSelected": false,
                "category": Constants.menuCategory.dashboard
            },
            {
                "key": "canvassers",
                "text": "Canvassers",
                "isSelected": true,
                "category": Constants.menuCategory.admin
            },
            {
                "key": "routes",
                "text": "Routes",
                "isSelected": false,
                "category": Constants.menuCategory.admin
            },
            {
                "key": "counts",
                "text": "Counts",
                "isSelected": false,
                "category": Constants.menuCategory.admin
            },
            {
                "key": "sites",
                "text": "Manage Sites",
                "isSelected": false,
                "category": Constants.menuCategory.admin
            },
            {
                "key": "surveysSubmitted",
                "text": "Surveys Submitted",
                "isSelected": false,
                "category": Constants.menuCategory.reports
            },
            {
                "key": "manageEmail",
                "text": "Manage Email",
                "isSelected": false,
                "category": Constants.menuCategory.admin
            },
            {
                "key": "checkIn",
                "text": "Check In",
                "isSelected": false,
                "category": Constants.menuCategory.admin
            }
        ],
        validation: {
            "message": "",
            "type": Constants.validation.types.success.key,
            "isPopup": false
        },
        "loginDetails": {
            "userName": "",
            "password": "",
            "errorMessage": "",
            "rememberMe": false,
            "displayName": "",
            "isloggedIn": false,
            "userId": null,
            "users": Users
        }
    };
