import { sharedActionTypes } from "../actions/sharedActionTypes";
import { sharedState } from "../state/";
import { Constants } from "../../../common/app-settings/constants"
import { countStatuses } from "../../admin/state/counts";

export default (state = sharedState, action) => {

    let stateCopy = {};
    /**
     * Create a copy of the state on which actions will be performed.
     */
    if (sharedActionTypes[action.type]) {
        stateCopy = JSON.parse(JSON.stringify(state));
    }

    switch (action.type) {

        case sharedActionTypes.SET_LEFT_MENU_EXPANDED:
            {
                stateCopy.leftMenuExpaned = !stateCopy.leftMenuExpaned;
                return stateCopy;
            }
        case sharedActionTypes.SET_RIGHT_SIDE_EXPANDED:
            {
                stateCopy.isRightPanelExpanded = !stateCopy.isRightPanelExpanded;
                return stateCopy;
            }
        case sharedActionTypes.SET_TAB_CHANGE:
            {
                stateCopy
                    .tabs
                    .forEach((tab, index) => {
                        tab.isSelected = (tab.key === action.payload.key);
                    })
                let category = stateCopy
                    .tabs
                    .filter((tab) => tab.key == action.payload.key)[0]
                    .category;
                stateCopy
                    .menuPanels
                    .forEach((panel) => {
                        panel.isOpened = (panel.value == category);
                    })
                return stateCopy;
            }
        case sharedActionTypes.SET_LOGIN_USERNAME:
            {
                stateCopy.loginDetails.userName = action.payload.value;
                return stateCopy;
            }
        case sharedActionTypes.SET_LOGIN_PASSWORD:
            {
                stateCopy.loginDetails.password = action.payload.value;
                return stateCopy;
            }
        case sharedActionTypes.SET_LOGIN_REMEMBERME:
            {
                stateCopy.loginDetails.rememberMe = action.payload.value;
                return stateCopy;
            }
        case sharedActionTypes.SET_LOGIN_ERROR_MESSAGE:
            {
                stateCopy.loginDetails.errorMessage = action.payload.value;
                return stateCopy;
            }
        case sharedActionTypes.SET_LOGGED_IN:
            {
                stateCopy.loginDetails.isloggedIn = action.payload.isLoggedIn;
                stateCopy.loginDetails.userName = action.payload.userName;
                stateCopy.loginDetails.displayName = action.payload.displayName;
                return stateCopy;
            }
        case sharedActionTypes.SET_LOG_OUT:
            {
                return sharedState; // Reset to Original State after Logout
            }
        case sharedActionTypes.SET_LEFT_MENU_TOGGLE:
            {
                if (stateCopy.menuPanels && stateCopy.leftMenuExpaned) {
                    stateCopy
                        .menuPanels
                        .forEach((panel) => {
                            if (panel.value == action.payload.panel.value) {
                                panel.isOpened = !panel.isOpened;
                            } else {
                                panel.isOpened = false;
                            }
                        })
                }
                return stateCopy;
            }
        case sharedActionTypes.SET_TOGGLE_PROFILE_MENU:
            {
                stateCopy.profileMenu.isOpened = !stateCopy.profileMenu.isOpened;
                return stateCopy;
            }
        case sharedActionTypes.SET_DOCUMENT_CLICK:
            {
                stateCopy.profileMenu.isOpened = action.payload;
                return stateCopy;
            }
        case sharedActionTypes.SET_LEFT_MENU_SMALL_SCREEN_TOGGLED:
            {
                stateCopy.smallScreenLeftMenuOpened = !stateCopy.smallScreenLeftMenuOpened;
                return stateCopy;
            }
        case sharedActionTypes.SET_RIGHT_MENU_SMALL_SCREEN_TOGGLED:
            {
                stateCopy.smallScreenRightMenuOpened = !stateCopy.smallScreenRightMenuOpened;
                return stateCopy;
            }
        case sharedActionTypes.SET_ROUTE_ON_MAP_OPENED:
            {
                stateCopy.routesOnMap.isOpened = action.payload.isOpened;
                stateCopy.routesOnMap.popupLoaderShown = action.payload.popupLoaderShown;
                if (action.payload.routeObject)
                    stateCopy.routesOnMap.routeObject = action.payload.routeObject;
                stateCopy.routesOnMap.team = action.payload.team;
                return stateCopy;
            }
        case sharedActionTypes.SET_ROUTE_ON_MAP_OPENED_LOADER:
            {
                stateCopy.routesOnMap.isOpened = action.payload.isOpened;
                stateCopy.routesOnMap.popupLoaderShown = action.payload.popupLoaderShown;
                return stateCopy;
            }
        case sharedActionTypes.SET_ROUTE_STATUS_ON_MAP:
            {
                if (stateCopy.routesOnMap.routeObject && stateCopy.routesOnMap.routeObject.length) {
                    stateCopy.routesOnMap.routeObject[0].routeStatus = action.payload.key;
                    stateCopy.routesOnMap.routeObject[0].countInstanceStatus = [stateCopy.countInstanceStatus.find(m => m.label.toLowerCase() == action.payload.key.toLowerCase())];
                }
                return stateCopy;
            }
        case sharedActionTypes.SET_COUNT_INSTANCE_STATUS:
            {
                stateCopy.countInstanceStatus = action.payload || [];
                return stateCopy;
            }
        case sharedActionTypes.SHOW_VALIDATION_MESSAGE_SHARED:
            {
                if (action.payload.validationMessage === Constants.emptyString) {
                    stateCopy.validation.message = Constants.emptyString;
                    stateCopy.validation.isPopup = false;
                    stateCopy.validation.type = Constants.validation.types.success.key;
                } else {
                    stateCopy.validation.message = action.payload.validationMessage;
                    stateCopy.validation.isPopup = action.payload.isPopup;
                    stateCopy.validation.type = action.payload.type;
                }
                return stateCopy;
            }
        case sharedActionTypes.SET_SHOW_CONFIRM_DIALOG:
            {
                stateCopy.confirmModal.isShowing = action.payload.isShowing;
                stateCopy.confirmModal.message = action.payload.message;
                stateCopy.confirmModal.options = action.payload.options;
                if (!action.payload.isShowing) {
                    stateCopy.confirmModal.message = Constants.emptyString;
                    stateCopy.confirmModal.options = null;
                }
                return stateCopy;
            }
        case sharedActionTypes.SET_DOWNLOADING_FLAG:
            {
                stateCopy.downloading.isDownloading = action.payload;
                return stateCopy;
            }
        case sharedActionTypes.SET_ACTIVE_COUNT_INSTANCE: {
            stateCopy.selectedQCInstances = [];
            let activeCountInstance = null;
            if (action.payload.countInstance) {
                activeCountInstance = action.payload.countInstance.find((countInstance) => (countInstance.properties.status == Constants.countStatus.active.value));
            }
            if (activeCountInstance) {
                stateCopy.selectedQCInstances.push(activeCountInstance.id);
                //selected Dedmo Instance on dashboard
                stateCopy.selectedCountInstance.id = activeCountInstance.id;
                stateCopy.selectedCountInstance.name = activeCountInstance.name;
                stateCopy.selectedCountInstance.startDate = activeCountInstance.properties.startDate == "null" ? null : activeCountInstance.properties.startDate;
                stateCopy.selectedCountInstance.routeDescriptor = true;
                stateCopy.selectedCountInstance.siteDescriptor = true;
                stateCopy.selectedCountInstance.status = (!activeCountInstance.properties.status) ? countStatuses[1] : ((activeCountInstance.properties.status == Constants.countStatus.inactive.value) ? countStatuses[1] : countStatuses[0]);
                stateCopy.selectedCountInstance.type = activeCountInstance.countType.length > 0 ? activeCountInstance.countType[0] : null;
            } else {
                stateCopy.selectedCountInstance = {
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
                }
            }
            return stateCopy;
        }
        case sharedActionTypes.SET_SELECTED_COUNT_INSTANCE_ON_DASHBOARD: {
            let activeCountInstance = action.payload.countInstance;
            if (activeCountInstance) {
                //selected Dedmo Instance on dashboard
                stateCopy.selectedCountInstance.id = activeCountInstance.id;
                stateCopy.selectedCountInstance.name = activeCountInstance.name;
                stateCopy.selectedCountInstance.startDate = activeCountInstance.startDate;
                stateCopy.selectedCountInstance.startTime = activeCountInstance.startTime;
                stateCopy.selectedCountInstance.endDate = activeCountInstance.endDate;
                stateCopy.selectedCountInstance.endTime = activeCountInstance.endTime;
                stateCopy.selectedCountInstance.registrationStartDate = activeCountInstance.registrationStartDate;
                stateCopy.selectedCountInstance.registrationStartTime = activeCountInstance.registrationStartTime;
                stateCopy.selectedCountInstance.registrationEndDate = activeCountInstance.registrationEndDate;
                stateCopy.selectedCountInstance.registrationEndTime = activeCountInstance.registrationEndTime;
                stateCopy.selectedCountInstance.routeDescriptor = true;
                stateCopy.selectedCountInstance.siteDescriptor = true;
                stateCopy.selectedCountInstance.status = activeCountInstance.status;
                stateCopy.selectedCountInstance.type = activeCountInstance.type;
            }
            return stateCopy;
        }
        case sharedActionTypes.SET_CANV_START_DOWNLOADING:
            {
                stateCopy.isCanvDownloading = action.payload;
                return stateCopy;
            }
        default:
            return state;
    }

}