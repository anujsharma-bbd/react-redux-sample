import { Constants } from "../../../common/app-settings/constants"
import { countsState } from "./counts";
// admin section state
export const adminState = {
    counts: countsState,
    "panelProperties": {
        "panelAutoReloadInterval": "2m",
        "lastUpdatedOn": null,
        "panelExpanded": false,
        "displayRefreshButton": true,
        "panelReload": false,
        "panelCollapsed": false,
        "panelRemoved": false
    },
    "createTeamModel": {
        "teamName": "",
        "selectedBorough": null,
        "selectedSite": null
    },
    "filterModel": {
        "boroughs": [],
        "sites": [],
        "selectedBorough": null,
        "selectedSite": null
    },
    "rightSideModel": {
        "createCanvasserModalIsOpened": false,
        "editCanvasser": {},
        "keywordSearchCanvModel": {
            "selectedOption": null
        },
        "keywordSearchRoutesModel": {
            "selectedOption": null
        },
        "statusModel": {
            "selectedCanvOption": {
                "label": "All",
                "value": "All"
            },
            "selectedRoutesOption": {
                "label": "All",
                "value": "All"
            },
            "options": [
                {
                    "type": "canvasser",
                    "label": "All",
                    "value": "All"
                },
                {
                    "type": "canvasser",
                    "label": "Assigned",
                    "value": "assigned"
                },
                {
                    "type": "canvasser",
                    "label": "UnAssigned",
                    "value": "unAssigned"
                },
                {
                    "type": "route",
                    "label": "All",
                    "value": "All"
                },
                {
                    "type": "route",
                    "label": "Assigned",
                    "value": "assigned"
                },
                {
                    "type": "route",
                    "label": "UnAssigned",
                    "value": "unAssigned"
                }
            ]
        },
        "initialSearchedRoutes": [],
        "searchedRoutes": [],
        "initialSearchedCanvassers": [],
        "searchedCanvassers": []
    },
    "createTeamModalIsOpened": false,
    "editTeamModalIsOpened": false,
    "jumpTeamModalIsOpened": false,
    "popupLoaderShown": false,
    "routeCanvasLoaderShown": false,
    "teamUsersPopupIsOpened": false,
    "searchedTeams": [],
    "teamToEdit": {
        "users": [],
        "routes": []
    },
    "validation": {
        "message": "",
        "type": Constants.validation.types.success.key,
        "isPopup": false
    },
    selectedSegment:null,
    segment :[{id:1,name:"Site"},{id:2,name:"Site Type"},{id:3,name:"Registration Status"},{id:4,name:"User Source"}],
    selectedSiteType:null,
    siteType :[{id:1,name:"Pilot"},{id:2,name:"MTA"},{id:3,name:"None"},{id: 4,name:"Multisite"}],    
    registrationStatus:[{id:1,name:"unregistered"},{id:2,name:"cancelled"},{id:3,name:"registered"}],  
    selectedRegistrationStatus:null,
    selectedTeamForConvesser: null,
    selectedUserSource:null,
    defaultConvesserType: { id: 4, label: 'None', isSelected: true },
    convesserType: [{ id: 1, label: 'MTA', isSelected: false }, { id: 2, label: 'NYPD', isSelected: false }, { id: 3, label: 'Parks', isSelected: false }, { id: 4, label: 'None', isSelected: true }],
    selectedEmails: [],
    resetScheduleModel : false,
    scheduledEmailNotificationList : [],
    emailNotificationUsers:[],
    inputEmail: "",
    isNotificationUsersModalOpen:false,
    emailNotificationModel:{
        id:-1,
        count_instance_id: -1,
        notification_name: "",
        notification_subject:"",
        source:"",
        segment: null,
        segment_value: null,
        template: null,
        include_canc_reg: false,
        send_on_registration: false,
        send_upon_cancellation:false,
        is_active: true,
        send_now: false,
        scheduled_time:(new Date()).getTime(),
        csv_upload:null,
        fileName:null,
        isNotificationUpdate : false,
        isFileRemoved:false,
        isFileUploaded:false,
        send_only_to_csv :false,
        isUpdateDisabled:false
    }
};
