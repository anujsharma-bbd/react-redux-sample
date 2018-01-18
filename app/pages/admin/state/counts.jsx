import { Constants } from "../../../common/app-settings/constants";
import moment from 'moment';
/**
 * Array of Dedmo Instance status
 */
export const countStatuses = [
    { id: 0, value: Constants.countStatus.active.value, label: Constants.countStatus.active.label },
    { id: 1, value: Constants.countStatus.inactive.value, label: Constants.countStatus.inactive.label },
    { id: 2, value: Constants.countStatus.undefinite.value, label: Constants.countStatus.undefinite.label }
];

/**
 * Counts view state
 */
export const countsState = {
    countTypes: [],
    allCountsInstance: [],
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
        routeDescriptor: false,
        siteDescriptor: false,
        status: countStatuses[2],
        type: null,
    },
    showConfirmActivateCountModal: false,
    showConfirmDeactivateCountModal: false,
    showCreateNewCountModal: false,
    newCount: {
        name: '',
        startDate: moment(),
        startTime: moment(),
        registrationStartDate: moment(),
        registrationStartTime: moment(),
        endDate: moment(),
        endTime: moment(),
        registrationEndDate: moment(),
        registrationEndTime: moment(),
        routeDescriptor: false,
        siteDescriptor: false,
        type: null,
    },
    showUpdateCountModal: false,
    countInstanceToUpdate: {
        id: 0,
        name: null,
        startDate: moment(),
        startTime: moment(),
        endDate: moment(),
        endTime: moment(),
        registrationStartDate: moment(),
        registrationStartTime: moment(),
        registrationEndDate: moment(),
        registrationEndTime: moment(),
        routeDescriptor: false,
        siteDescriptor: true,
        status: countStatuses[2],
        currentType: null,
        newType: null,
    },
    countInstanceToActivate: {
        id: 0,
        name: null,
        startDate: moment(),
        startTime: moment(),
        endDate: moment(),
        endTime: moment(),
        registrationStartDate: moment(),
        registrationStartTime: moment(),
        registrationEndDate: moment(),
        registrationEndTime: moment(),
        routeDescriptor: false,
        siteDescriptor: true,
        status: countStatuses[2],
        type: null,
    },
    countInstanceToDeactivate: {
        id: 0,
        name: null,
        startDate: moment(),
        startTime: moment(),
        endDate: moment(),
        endTime: moment(),
        registrationStartDate: moment(),
        registrationStartTime: moment(),
        registrationEndDate: moment(),
        registrationEndTime: moment(),
        routeDescriptor: false,
        siteDescriptor: true,
        status: countStatuses[2],
        type: null,
    },
    showDeleteCountModal: false,
    countInstanceToDelete: {
        id: 0,
        name: null,
        startDate: moment(),
        startTime: moment(),
        endDate: moment(),
        endTime: moment(),
        registrationStartDate: moment(),
        registrationStartTime: moment(),
        registrationEndDate: moment(),
        registrationEndTime: moment(),
        routeDescriptor: false,
        siteDescriptor: true,
        status: countStatuses[2],
        type: null,
    },
    newCountInstanceId: 0,
    isLoaderShown: false,
    showCreateNewCountValidation: false,
    newCountValidationMessage: null,
    showCannotActivateCountModal: false,
    panelProperties: {
        upperSection: {
            panelExpanded: false,
            panelReload: false,
            panelCollapsed: false,
            panelAutoReloadInterval: "2m",
            lastUpdatedOn: null,
            displayRefreshButton: false,
            panelRemoved: false
        },
        lowerSection: {
            panelExpanded: false,
            panelReload: false,
            panelCollapsed: false,
            panelAutoReloadInterval: "2m",
            lastUpdatedOn: null,
            displayRefreshButton: true,
            panelRemoved: false
        }
    },
    filters: {
        countInstanceStartDate: moment(),
        countInstanceEndDate: moment(),
        filteredCounts: []
    }
}
