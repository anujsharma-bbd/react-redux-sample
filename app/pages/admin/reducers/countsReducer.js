import { countsActionTypes } from "../actions/countsActionTypes.jsx";
import { countsState, countStatuses } from "../state/counts";
import { Constants } from "../../../common/app-settings/constants";
import moment from 'moment';
export default (state = countsState, action) => {

    let stateCopy = {};
    /**
     * Creates a copy of the state on which actions will be performed.
     */
    if (countsActionTypes[action.type]) {
        stateCopy = JSON.parse(JSON.stringify(state));
    }

    switch (action.type) {
        case countsActionTypes.SET_ALL_COUNT_INSTANCES: {
            if (action.payload) {
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
                    routeDescriptor: false,
                    siteDescriptor: false,
                    status: countStatuses[2],
                    type: null,
                }
                stateCopy.countTypes = [];
                stateCopy.allCountsInstance = [];
                stateCopy.filters.filteredCounts = [];
                if (action.payload.countType) {
                    stateCopy.countTypes = action.payload.countType;
                }
                if (action.payload.countInstance) {
                    let countInstances = action.payload.countInstance;
                    if (countInstances) {
                        countInstances.forEach((countInstance) => {
                            stateCopy.allCountsInstance.push({
                                id: countInstance.id,
                                name: countInstance.name,
                                startDate: Date.parse(countInstance.properties.startDate) == NaN ? null : countInstance.properties.startDate,
                                startTime: Date.parse(countInstance.properties.startTime) == NaN ? null : countInstance.properties.startTime,
                                endDate: Date.parse(countInstance.properties.endDate) == NaN ? null : countInstance.properties.endDate,
                                endTime: Date.parse(countInstance.properties.endTime) == NaN ? null : countInstance.properties.endTime,
                                registrationStartDate: Date.parse(countInstance.properties.registrationStartDate) == NaN ? null : countInstance.properties.registrationStartDate,
                                registrationStartTime: Date.parse(countInstance.properties.registrationStartTime) == NaN ? null : countInstance.properties.registrationStartTime,
                                registrationEndDate: Date.parse(countInstance.properties.registrationEndDate) == NaN ? null : countInstance.properties.registrationEndDate,
                                registrationEndTime: Date.parse(countInstance.properties.registrationEndTime) == NaN ? null : countInstance.properties.registrationEndTime,
                                routeDescriptor: (countInstance.properties.routeDescriptor == null) ? false : JSON.parse(countInstance.properties.routeDescriptor),
                                siteDescriptor: (countInstance.properties.siteDescriptor == null) ? false : JSON.parse(countInstance.properties.siteDescriptor),
                                status: (!countInstance.properties.status) ? countStatuses[1] : ((countInstance.properties.status == Constants.countStatus.inactive.value) ? countStatuses[1] : countStatuses[0]),
                                type: countInstance.countType.length > 0 ? countInstance.countType[0] : null,
                                updatedAt: Date.parse(countInstance.properties.updatedAt) == NaN ? null : countInstance.properties.updatedAt
                            });
                        });
                        stateCopy.allCountsInstance.sort(function (a, b) {
                            if (a.updatedAt && b.updatedAt)
                                return moment(JSON.parse(a.updatedAt)) < moment(JSON.parse(b.updatedAt)) ? 1 : moment(JSON.parse(a.updatedAt)) > moment(JSON.parse(b.updatedAt)) ? -1 : 0;
                            else return 0;
                        });
                    }
                    stateCopy.selectedCountInstance = stateCopy.allCountsInstance.find((countInstance) => (countInstance.status.value == Constants.countStatus.active.value));
                    stateCopy.filters.filteredCounts = [...stateCopy.allCountsInstance];
                    stateCopy.panelProperties.upperSection.displayRefreshButton = (stateCopy.selectedCountInstance != undefined && stateCopy.selectedCountInstance && stateCopy.selectedCountInstance.id != 0);
                }
            }
            stateCopy.filters.countInstanceStartDate = moment();
            stateCopy.filters.countInstanceEndDate = moment();
            return stateCopy;
        }
        case countsActionTypes.SET_ALL_COUNT_INSTANCES_FOR_REMINDER: {
            if (action.payload) {
                stateCopy.selectedCountInstanceForReminder = {
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
                }
                stateCopy.countTypes = [];
                stateCopy.allCountsInstance = [];
                stateCopy.filters.filteredCounts = [];
                if (action.payload.countType) {
                    stateCopy.countTypes = action.payload.countType;
                }
                if (action.payload.countInstance) {
                    let countInstances = action.payload.countInstance;
                    if (countInstances) {
                        countInstances.forEach((countInstance) => {
                            stateCopy.allCountsInstance.push({
                                id: countInstance.id,
                                name: countInstance.name,
                                startDate: Date.parse(countInstance.properties.startDate) == NaN ? null : countInstance.properties.startDate,
                                startTime: Date.parse(countInstance.properties.startTime) == NaN ? null : countInstance.properties.startTime,
                                endDate: Date.parse(countInstance.properties.endDate) == NaN ? null : countInstance.properties.endDate,
                                endTime: Date.parse(countInstance.properties.endTime) == NaN ? null : countInstance.properties.endTime,
                                registrationStartDate: Date.parse(countInstance.properties.registrationStartDate) == NaN ? null : countInstance.properties.registrationStartDate,
                                registrationStartTime: Date.parse(countInstance.properties.registrationStartTime) == NaN ? null : countInstance.properties.registrationStartTime,
                                registrationEndDate: Date.parse(countInstance.properties.registrationEndDate) == NaN ? null : countInstance.properties.registrationEndDate,
                                registrationEndTime: Date.parse(countInstance.properties.registrationEndTime) == NaN ? null : countInstance.properties.registrationEndTime,
                                routeDescriptor: (countInstance.properties.routeDescriptor == null) ? false : JSON.parse(countInstance.properties.routeDescriptor),
                                siteDescriptor: (countInstance.properties.siteDescriptor == null) ? false : JSON.parse(countInstance.properties.siteDescriptor),
                                status: (!countInstance.properties.status) ? countStatuses[1] : ((countInstance.properties.status == Constants.countStatus.inactive.value) ? countStatuses[1] : countStatuses[0]),
                                type: countInstance.countType.length > 0 ? countInstance.countType[0] : null,
                                updatedAt: Date.parse(countInstance.properties.updatedAt) == NaN ? null : countInstance.properties.updatedAt
                            });
                        });
                        stateCopy.allCountsInstance.sort(function (a, b) {
                            if (a.startDate && b.startDate)
                                return moment(JSON.parse(a.startDate)) > moment(JSON.parse(b.startDate)) ? 1 : moment(JSON.parse(a.startDate)) < moment(JSON.parse(b.startDate)) ? -1 : 0;
                            else return 0;
                        });
                    }
                    let upcomingCounts = stateCopy.allCountsInstance.filter(ci => ci.startDate >= (new Date()).getTime());
                    let pastCount = stateCopy.allCountsInstance.filter(ci => ci.startDate < (new Date()).getTime());;
                    let order =1;
                    upcomingCounts.forEach((item, index) => {
                        if (index == 0) {
                            item.name = item.name + ' ' + '(upcoming)'
                        }else{
                            item.name = item.name + ' ' + '(next upcoming)'
                        }
                        item.order= order++;
                    });
                    pastCount.forEach(item => {
                        if (item.status.value == "active") {
                            item.name = item.name + ' ' + '(active)'
                        }
                        item.order= order++;
                    });                    
                    let mergeArray = upcomingCounts.concat(pastCount);
                    stateCopy.filters.filteredCounts = mergeArray;
                    stateCopy.filters.filteredCounts ? stateCopy.selectedCountInstanceForReminder = stateCopy.filters.filteredCounts[0] : null;
                    stateCopy.selectedCountInstanceForReminder = { id: -1, "name": "--select--" }
                }
            }
            stateCopy.filters.countInstanceStartDate = moment();
            stateCopy.filters.countInstanceEndDate = moment();
            return stateCopy;
        }
        case countsActionTypes.SET_NEW_COUNT_DATE: {
            stateCopy.newCount.startDate = action.payload.countDateValue;
            return stateCopy;
        }
        case countsActionTypes.SET_NEW_COUNT_TIME: {
            stateCopy.newCount.startTime = action.payload.countTimeValue;
            return stateCopy;
        }
        case countsActionTypes.SET_NEW_COUNT_END_DATE: {
            stateCopy.newCount.endDate = action.payload.countEndDateValue;
            return stateCopy;
        }
        case countsActionTypes.SET_NEW_COUNT_END_TIME: {
            stateCopy.newCount.endTime = action.payload.countEndTimeValue;
            return stateCopy;
        }
        case countsActionTypes.SET_NEW_COUNT_REGISTRATION_START_DATE: {
            stateCopy.newCount.registrationStartDate = action.payload.countRegistrationStartDateValue;
            return stateCopy;
        }
        case countsActionTypes.SET_NEW_COUNT_REGISTRATION_END_DATE: {
            stateCopy.newCount.registrationEndDate = action.payload.countRegistrationEndDateValue;
            return stateCopy;
        }
        case countsActionTypes.SET_NEW_COUNT_REGISTRATION_START_TIME: {
            stateCopy.newCount.registrationStartTime = action.payload.countRegistrationStartTimeValue;
            return stateCopy;
        }
        case countsActionTypes.SET_NEW_COUNT_REGISTRATION_END_TIME: {
            stateCopy.newCount.registrationEndTime = action.payload.countRegistrationEndTimeValue;
            return stateCopy;
        }
        case countsActionTypes.SET_NEW_COUNT_TYPE: {
            stateCopy.newCount.type = action.payload;
            return stateCopy;
        }
        case countsActionTypes.SET_SHOW_UPDATE_COUNT_MODAL: {
            stateCopy.showUpdateCountModal = action.payload;
            return stateCopy;
        }
        case countsActionTypes.SET_COUNT_INSTANCE_TO_UPDATE: {
            stateCopy.countInstanceToUpdate.id = action.payload.id;
            stateCopy.countInstanceToUpdate.name = action.payload.name;
            if (action.payload.startDate) {
                if (moment(action.payload.startDate).isValid())
                    stateCopy.countInstanceToUpdate.startDate = Date.parse(action.payload.startDate);
                else stateCopy.countInstanceToUpdate.startDate = JSON.parse(action.payload.startDate);
            } else stateCopy.countInstanceToUpdate.startDate = moment(stateCopy.countInstanceToUpdate.startDate)

            if (action.payload.startTime) {
                if (moment(action.payload.startTime).isValid())
                    stateCopy.countInstanceToUpdate.startTime = Date.parse(action.payload.startTime);
                else stateCopy.countInstanceToUpdate.startTime = JSON.parse(action.payload.startTime);
            }
            if (action.payload.endDate) {
                if (moment(action.payload.endDate).isValid())
                    stateCopy.countInstanceToUpdate.endDate = Date.parse(action.payload.endDate);
                else stateCopy.countInstanceToUpdate.endDate = JSON.parse(action.payload.endDate);
            } else stateCopy.countInstanceToUpdate.endDate = moment(stateCopy.countInstanceToUpdate.endDate)

            if (action.payload.endTime) {
                if (moment(action.payload.endTime).isValid())
                    stateCopy.countInstanceToUpdate.endTime = Date.parse(action.payload.endTime);
                else stateCopy.countInstanceToUpdate.endTime = JSON.parse(action.payload.endTime);
            }
            if (action.payload.registrationStartDate) {
                if (moment(action.payload.registrationStartDate).isValid())
                    stateCopy.countInstanceToUpdate.registrationStartDate = Date.parse(action.payload.registrationStartDate);
                else stateCopy.countInstanceToUpdate.registrationStartDate = JSON.parse(action.payload.registrationStartDate);
            } else stateCopy.countInstanceToUpdate.registrationStartDate = moment(stateCopy.countInstanceToUpdate.registrationStartDate)

            if (action.payload.registrationStartTime) {
                if (moment(action.payload.registrationStartTime).isValid())
                    stateCopy.countInstanceToUpdate.registrationStartTime = Date.parse(action.payload.registrationStartTime);
                else stateCopy.countInstanceToUpdate.registrationStartTime = JSON.parse(action.payload.registrationStartTime);
            }
            if (action.payload.registrationEndDate) {
                if (moment(action.payload.registrationEndDate).isValid())
                    stateCopy.countInstanceToUpdate.registrationEndDate = Date.parse(action.payload.registrationEndDate);
                else stateCopy.countInstanceToUpdate.registrationEndDate = JSON.parse(action.payload.registrationEndDate);
            } else stateCopy.countInstanceToUpdate.registrationEndDate = moment(stateCopy.countInstanceToUpdate.registrationEndDate)

            if (action.payload.registrationEndTime) {
                if (moment(action.payload.registrationEndTime).isValid())
                    stateCopy.countInstanceToUpdate.registrationEndTime = Date.parse(action.payload.registrationEndTime);
                else stateCopy.countInstanceToUpdate.registrationEndTime = JSON.parse(action.payload.registrationEndTime);
            }
            stateCopy.countInstanceToUpdate.routeDescriptor = action.payload.routeDescriptor;
            stateCopy.countInstanceToUpdate.status = action.payload.status;
            stateCopy.countInstanceToUpdate.currentType = action.payload.type;
            stateCopy.countInstanceToUpdate.newType = action.payload.type;
            return stateCopy;
        }
        case countsActionTypes.SET_SHOW_DELETE_COUNT_MODAL: {
            stateCopy.showDeleteCountModal = action.payload;
            return stateCopy;
        }
        case countsActionTypes.SET_COUNT_INSTANCE_TO_DELETE: {
            stateCopy.countInstanceToDelete = action.payload;
            return stateCopy;
        }
        case countsActionTypes.SET_SHOW_CREATE_NEW_COUNT: {

            stateCopy.showCreateNewCountModal = action.payload;
            stateCopy.newCount = {
                name: '',
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
                type: null,
            }
            return stateCopy;
        }
        case countsActionTypes.SET_COUNT_INSTANCE_TO_ACTIVATE: {
            stateCopy.countInstanceToActivate = action.payload;
            return stateCopy;
        }
        case countsActionTypes.SET_SHOW_CONFIRM_ACTIVATE_COUNT_TYPE: {
            stateCopy.showConfirmActivateCountModal = action.payload;
            return stateCopy;
        }
        case countsActionTypes.SET_SHOW_CANNOT_ACTIVATE_COUNT_TYPE: {
            stateCopy.showCannotActivateCountModal = action.payload;
            return stateCopy;
        }
        case countsActionTypes.SET_NEW_COUNT_NAME: {
            stateCopy.newCount.name = action.payload.target.target.value;
            return stateCopy;
        }
        case countsActionTypes.SET_ROUTE_DESCRIPTOR_CREATE: {
            stateCopy.newCount.routeDescriptor = action.payload;
            return stateCopy;
        }
        case countsActionTypes.SET_SITE_DESCRIPTOR_CREATE: {
            stateCopy.newCount.siteDescriptor = action.payload;
            return stateCopy;
        }
        case countsActionTypes.SET_UPDATE_COUNT_NAME: {
            stateCopy.countInstanceToUpdate.name = action.payload.target.target.value;
            return stateCopy;
        }
        case countsActionTypes.SET_UPDATE_COUNT_DATE: {
            stateCopy.countInstanceToUpdate.startDate = action.payload.countDateValue;
            return stateCopy;
        }
        case countsActionTypes.SET_UPDATE_COUNT_TIME: {
            stateCopy.countInstanceToUpdate.startTime = action.payload.countTimeValue;
            return stateCopy;
        }
        case countsActionTypes.SET_UPDATE_COUNT_END_DATE: {
            stateCopy.countInstanceToUpdate.endDate = action.payload.countEndDateValue;
            return stateCopy;
        }
        case countsActionTypes.SET_UPDATE_COUNT_END_TIME: {
            stateCopy.countInstanceToUpdate.endTime = action.payload.countEndTimeValue;
            return stateCopy;
        }
        case countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_START_DATE: {
            stateCopy.countInstanceToUpdate.registrationStartDate = action.payload.countRegistrationStartDateValue;
            return stateCopy;
        }
        case countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_START_TIME: {
            stateCopy.countInstanceToUpdate.registrationStartTime = action.payload.countRegistrationStartTimeValue;
            return stateCopy;
        }
        case countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_END_DATE: {
            stateCopy.countInstanceToUpdate.registrationEndDate = action.payload.countRegistrationEndDateValue;
            return stateCopy;
        }
        case countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_END_TIME: {
            stateCopy.countInstanceToUpdate.registrationEndTime = action.payload.countRegistrationEndTimeValue;
            return stateCopy;
        }
        case countsActionTypes.SET_UPDATE_COUNT_ROUTE_DESCRIPTOR: {
            stateCopy.countInstanceToUpdate.routeDescriptor = action.payload.routeDescriptor;
            return stateCopy;
        }
        case countsActionTypes.SET_UPDATE_COUNT_TEAM_DESCRIPTOR: {
            stateCopy.countInstanceToUpdate.siteDescriptor = action.payload.siteDescriptor;
            return stateCopy;
        }
        case countsActionTypes.SET_ROUTE_DESCRIPTOR_UPDATE: {
            stateCopy.countInstanceToUpdate.routeDescriptor = action.payload;
            return stateCopy;
        }
        case countsActionTypes.SET_SITE_DESCRIPTOR_UPDATE: {
            stateCopy.countInstanceToUpdate.siteDescriptor = action.payload;
            return stateCopy;
        }
        case countsActionTypes.SET_UPDATE_COUNT_TYPE: {
            stateCopy.countInstanceToUpdate.newType = action.payload;
            return stateCopy;
        }

        case countsActionTypes.SET_NEW_COUNT_INSTANCE_ID: {
            stateCopy.newCountInstanceId = action.payload.id;
            return stateCopy;
        }
        case countsActionTypes.SET_LOADER: {
            stateCopy.isLoaderShown = action.payload;
            return stateCopy
        }
        case countsActionTypes.SET_NEW_COUNT_VALIDATION_MESSAGE: {
            stateCopy.showCreateNewCountValidation = true;
            stateCopy.newCountValidationMessage = action.payload.validationMessage;
        }
        case countsActionTypes.SET_SHOW_CONFIRM_DEACTIVATE_COUNT_TYPE: {
            stateCopy.showConfirmDeactivateCountModal = action.payload;
            return stateCopy;
        }
        case countsActionTypes.SET_COUNT_INSTANCE_TO_DEACTIVATE: {
            stateCopy.countInstanceToDeactivate = action.payload;
            return stateCopy;
        }
        case countsActionTypes.SET_PANEL_EXPAND_COUNTS_VIEW_UPPER_SECTION:
            {
                stateCopy.panelProperties.upperSection.panelExpanded = !stateCopy.panelProperties.upperSection.panelExpanded;
                return stateCopy;
            }
        case countsActionTypes.SET_PANEL_COLLAPSE_COUNTS_VIEW_UPPER_SECTION:
            {
                stateCopy.panelProperties.upperSection.panelCollapsed = !stateCopy.panelProperties.upperSection.panelCollapsed;
                return stateCopy;
            }
        case countsActionTypes.SET_PANEL_EXPAND_COUNTS_VIEW_LOWER_SECTION:
            {
                stateCopy.panelProperties.lowerSection.panelExpanded = !stateCopy.panelProperties.lowerSection.panelExpanded;
                return stateCopy;
            }
        case countsActionTypes.SET_PANEL_COLLAPSE_COUNTS_VIEW_LOWER_SECTION:
            {
                stateCopy.panelProperties.lowerSection.panelCollapsed = !stateCopy.panelProperties.lowerSection.panelCollapsed;
                return stateCopy;
            }
        case countsActionTypes.SET_PANEL_RELOAD_COUNTS_VIEW_UPPER_SECTION_REFRESH:
            {
                stateCopy.panelProperties.upperSection.panelReload = action.payload;
                return stateCopy;
            }
        case countsActionTypes.SET_PANEL_RELOAD_COUNTS_VIEW_LOWER_SECTION_REFRESH:
            {
                stateCopy.panelProperties.lowerSection.panelReload = action.payload;
                return stateCopy;
            }
        case countsActionTypes.SET_FILTERS_COUNT_INSTANCE_START_DATE:
            {
                stateCopy.filters.countInstanceStartDate = action.payload.countStartDateValue;
                return stateCopy;
            }
        case countsActionTypes.SET_FILTERS_COUNT_INSTANCE_END_DATE:
            {
                stateCopy.filters.countInstanceEndDate = action.payload.countEndDateValue;
                return stateCopy;
            }
        case countsActionTypes.SET_SELECTED_COUNT_INSTANCE_FOR_REMINDER:
            {
                stateCopy.selectedCountInstanceForReminder = action.payload;
                return stateCopy;
            }
        case countsActionTypes.SET_FILTERED_COUNTS: {
            let startDate = action.payload.filterStartDate;
            let endDate = action.payload.filterEndDate;
            let filteredCounts = stateCopy.allCountsInstance.filter((count) => (
                (
                    moment(JSON.parse(count.startDate)).isSameOrAfter(startDate, Constants.unitsOfdate.year)
                    && moment(JSON.parse(count.startDate)).isSameOrAfter(startDate, Constants.unitsOfdate.month)
                    && moment(JSON.parse(count.startDate)).isSameOrAfter(startDate, Constants.unitsOfdate.day)
                )
                &&
                (
                    moment(JSON.parse(count.endDate)).isSameOrBefore(endDate, Constants.unitsOfdate.year)
                    && moment(JSON.parse(count.endDate)).isSameOrBefore(endDate, Constants.unitsOfdate.month)
                    && moment(JSON.parse(count.endDate)).isSameOrBefore(endDate, Constants.unitsOfdate.day)
                )
            ));
            stateCopy.filters.filteredCounts = [...filteredCounts];
            return stateCopy;
        }
        case countsActionTypes.SET_FILTERED_COUNTS_FOR_REMINDER: {
            let startDate = action.payload.filterStartDate;
            let endDate = action.payload.filterEndDate;
            debugger
            let filteredCounts = stateCopy.allCountsInstance.filter((count) => (
                (
                    moment(JSON.parse(count.startDate)).isSameOrAfter(startDate, Constants.unitsOfdate.year)
                    && moment(JSON.parse(count.startDate)).isSameOrAfter(startDate, Constants.unitsOfdate.month)
                    && moment(JSON.parse(count.startDate)).isSameOrAfter(startDate, Constants.unitsOfdate.day)
                )
                &&
                (
                    moment(JSON.parse(count.endDate)).isSameOrBefore(endDate, Constants.unitsOfdate.year)
                    && moment(JSON.parse(count.endDate)).isSameOrBefore(endDate, Constants.unitsOfdate.month)
                    && moment(JSON.parse(count.endDate)).isSameOrBefore(endDate, Constants.unitsOfdate.day)
                )
            ));
            // stateCopy.filters.filteredCounts = filteredCounts.filter(ci=>ci.startDate>(new Date()).getTime());
            stateCopy.filters.filteredCounts ? stateCopy.selectedCountInstanceForReminder = stateCopy.filters.filteredCounts[0] : null;
            stateCopy.selectedCountInstanceForReminder = { id: -1, "name": "--select--" }
            return stateCopy;
        }
        case countsActionTypes.SET_FILTERED_SITES: {
            stateCopy.SitesForReminder = action.payload;
            if (stateCopy.SitesForReminder && stateCopy.SitesForReminder.length > 0)
                stateCopy.SelectedSiteForReminder = stateCopy.SitesForReminder[0]
            return stateCopy;
        }
        case countsActionTypes.SET_SELECTED_SITE: {
            stateCopy.SelectedSiteForReminder = action.payload;
            return stateCopy;
        }
        default:
            return state;
    }

}
