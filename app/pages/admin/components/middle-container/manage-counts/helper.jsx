import { countsActionTypes } from "../../../actions/countsActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Utility } from "../../../../../common/utility/";
import { Constants } from "../../../../../common/app-settings/constants";
import moment from 'moment';


let ManageCountsHelper = {
    /**
   * Event handler when Dedmo Instance start date changes while creating or updating count.
   * @param {*newDate} newDate 
   */
    onCountInstanceStartDateChange(newDate, manageCountsComponent) {
        debugger;
        if (newDate !== Constants.messages.countsModel.invalidDate) {
            newDate = JSON.parse(newDate);
            let startDate, endDate;
            //handling start date change for create count
            if (manageCountsComponent.props.countsModel.showCreateNewCountModal) {
                manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_DATE, { countDateValue: newDate }));
                startDate = moment(newDate);
                endDate = moment(manageCountsComponent.props.countsModel.newCount.endDate);
                if (startDate.isSameOrAfter(endDate, Constants.unitsOfdate.year) && startDate.isSameOrAfter(endDate, Constants.unitsOfdate.month) && startDate.isSameOrAfter(endDate, Constants.unitsOfdate.day)) {
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_END_DATE, { countEndDateValue: newDate }));
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_END_TIME, { countEndTimeValue: manageCountsComponent.props.countsModel.newCount.startTime }));
                    //setting the end date and time value equal to start date and start time
                    manageCountsComponent.newCountInstanceEndDate.setState({ minDate: moment(newDate), inputValue: moment(newDate).format(Constants.dateTimeFormates.countStartDate), selectedDate: moment(newDate) });
                    manageCountsComponent.newCountInstanceEndTime.setState({ inputValue: moment(manageCountsComponent.props.countsModel.newCount.startTime).format(Constants.dateTimeFormates.countStartTime), selectedDate: moment(manageCountsComponent.props.countsModel.newCount.startTime) });
                }
            } else if (manageCountsComponent.props.countsModel.showUpdateCountModal) {
                //handling start date change for update count
                manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_DATE, { countDateValue: newDate }));
                startDate = moment(newDate);
                endDate = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.endDate);
                if (startDate.isSameOrAfter(endDate, Constants.unitsOfdate.year) && startDate.isSameOrAfter(endDate, Constants.unitsOfdate.month) && startDate.isSameOrAfter(endDate, Constants.unitsOfdate.day)) {
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_END_DATE, { countEndDateValue: newDate }));
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_END_TIME, { countEndTimeValue: manageCountsComponent.props.countsModel.countInstanceToUpdate.startTime }));
                    //setting the end date and time value equal to start date and start time        
                    manageCountsComponent.updateCountInstanceEndDate.setState({ minDate: moment(newDate), inputValue: moment(newDate).format(Constants.dateTimeFormates.countStartDate), selectedDate: moment(newDate) });
                    manageCountsComponent.updateCountInstanceEndTime.setState({ inputValue: moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.startTime).format(Constants.dateTimeFormates.countStartTime), selectedDate: moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.startTime) });
                }
            }
        }
    },

    /**
     * Event handler when Dedmo Instance start time changes while creating or updating count.
     * @param {*newTime} newTime 
     */
    onCountInstanceStartTimeChange(newTime, manageCountsComponent) {
        if (newTime !== Constants.messages.countsModel.invalidDate) {
            newTime = JSON.parse(newTime);
            let startDate, endDate;
            if (manageCountsComponent.props.countsModel.showCreateNewCountModal) {
                //handling start time change for create count.
                manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_TIME, { countTimeValue: newTime }));
                startDate = moment(manageCountsComponent.props.countsModel.newCount.startDate);
                endDate = moment(manageCountsComponent.props.countsModel.newCount.endDate);
                //if start date and end date are equal and new start time is after end time then update end time as well.
                if (startDate.isSame(endDate, Constants.unitsOfdate.year) && startDate.isSame(endDate, Constants.unitsOfdate.month) && startDate.isSame(endDate, Constants.unitsOfdate.day) && moment(newTime).isAfter(manageCountsComponent.props.countsModel.newCount.endTime)) {
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_END_TIME, { countEndTimeValue: newTime }));
                    manageCountsComponent.newCountInstanceEndTime.setState({ inputValue: moment(newTime).format(Constants.dateTimeFormates.countStartTime), selectedDate: moment(newTime) });
                }
            } else if (manageCountsComponent.props.countsModel.showUpdateCountModal) {
                //handling start time change for create count.
                manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_TIME, { countTimeValue: newTime }));
                startDate = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.startDate);
                endDate = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.endDate);
                //if start date and end date are equal and new start time is after end time then update end time as well.      
                if (startDate.isSame(endDate, Constants.unitsOfdate.year) && startDate.isSame(endDate, Constants.unitsOfdate.month) && startDate.isSame(endDate, Constants.unitsOfdate.day) && moment(newTime).isAfter(manageCountsComponent.props.countsModel.countInstanceToUpdate.endTime)) {
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_END_TIME, { countEndTimeValue: newTime }));
                    manageCountsComponent.updateCountInstanceEndTime.setState({ inputValue: moment(newTime).format(Constants.dateTimeFormates.countStartTime), selectedDate: moment(newTime) });
                }
            }
        }

    },

    /**
     * Event handler when Dedmo Instance end changes while creating or updating count.
     */
    onCountInstanceEndDateChange(newDate, manageCountsComponent) {
        if (newDate !== Constants.messages.countsModel.invalidDate) {
            newDate = JSON.parse(newDate);
            let startDate, endDate, startTime, endTime, isEndTimeBeforeStartTime;

            if (manageCountsComponent.props.countsModel.showCreateNewCountModal) {
                manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_END_DATE, { countEndDateValue: newDate }));
                startDate = moment(manageCountsComponent.props.countsModel.newCount.startDate);
                endDate = moment(newDate);
                startTime = moment(manageCountsComponent.props.countsModel.newCount.startTime);
                endTime = moment(manageCountsComponent.props.countsModel.newCount.endTime);
                isEndTimeBeforeStartTime = Utility.getMinutesOfDay(endTime) < Utility.getMinutesOfDay(startTime);
                if (startDate.isSame(endDate, Constants.unitsOfdate.year) && startDate.isSame(endDate, Constants.unitsOfdate.month) && startDate.isSame(endDate, Constants.unitsOfdate.day) && isEndTimeBeforeStartTime) {
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_END_TIME, { countEndTimeValue: manageCountsComponent.props.countsModel.newCount.startTime }));
                    startTime = moment(manageCountsComponent.props.countsModel.newCount.startTime);
                    manageCountsComponent.newCountInstanceEndTime.state.selectedDate = startTime;
                    manageCountsComponent.newCountInstanceEndTime.state.inputValue = startTime.format(Constants.dateTimeFormates.countStartTime);
                }
            } else if (manageCountsComponent.props.countsModel.showUpdateCountModal) {
                manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_END_DATE, { countEndDateValue: newDate }));
                startDate = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.startDate);
                endDate = moment(newDate);
                startTime = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.startTime);
                endTime = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.endTime);
                isEndTimeBeforeStartTime = Utility.getMinutesOfDay(endTime) < Utility.getMinutesOfDay(startTime);

                if (startDate.isSame(endDate, Constants.unitsOfdate.year) && startDate.isSame(endDate, Constants.unitsOfdate.month) && startDate.isSame(endDate, Constants.unitsOfdate.day) && isEndTimeBeforeStartTime) {
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_END_TIME, { countEndTimeValue: manageCountsComponent.props.countsModel.countInstanceToUpdate.startTime }));
                    startTime = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.startTime);
                    manageCountsComponent.updateCountInstanceEndTime.state.selectedDate = startTime;
                    manageCountsComponent.updateCountInstanceEndTime.state.inputValue = startTime.format(Constants.dateTimeFormates.countStartTime);
                }
            }
        }
    },
    /**
     * Event handler when Dedmo Instance end time changes while create or update count.
     * @param {*newTime} newTime 
     */
    onCountInstanceEndTimeChange(newTime, manageCountsComponent) {
        if (newTime !== Constants.messages.countsModel.invalidDate) {
            newTime = JSON.parse(newTime);
            let startDate, endDate, startTime, newTimeMoment;
            if (manageCountsComponent.props.countsModel.showCreateNewCountModal) {
                //handling end time change for create count.
                startDate = moment(manageCountsComponent.props.countsModel.newCount.startDate);
                endDate = moment(manageCountsComponent.props.countsModel.newCount.endDate);
                //if start date and end date are same then check for end time. if end time is less than start time then update the end time to start time.
                if (startDate.isSame(endDate, Constants.unitsOfdate.year) && startDate.isSame(endDate, Constants.unitsOfdate.month) && startDate.isSame(endDate, Constants.unitsOfdate.day)) {
                    startTime = moment(manageCountsComponent.props.countsModel.newCount.startTime);
                    newTimeMoment = moment(newTime);
                    let isEndTimeBeforeStartTime = Utility.getMinutesOfDay(newTimeMoment) > Utility.getMinutesOfDay(startTime);
                    if (isEndTimeBeforeStartTime) {
                        manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_END_TIME, { countEndTimeValue: newTime }));
                    } else {
                        manageCountsComponent.newCountInstanceEndTime.state.selectedDate = startTime;
                        manageCountsComponent.newCountInstanceEndTime.state.inputValue = startTime.format(Constants.dateTimeFormates.countStartTime);
                    }
                } else {
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_END_TIME, { countEndTimeValue: newTime }));
                }
            } else if (manageCountsComponent.props.countsModel.showUpdateCountModal) {
                //handling end time change for create count.
                startDate = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.startDate);
                endDate = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.endDate);

                //if start date and end date are same then check for end time. if end time is less than start time then update the end time to start time.
                if (startDate.isSame(endDate, Constants.unitsOfdate.year) && startDate.isSame(endDate, Constants.unitsOfdate.month) && startDate.isSame(endDate, Constants.unitsOfdate.day)) {
                    startTime = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.startTime);
                    newTimeMoment = moment(newTime);
                    let isEndTimeBeforeStartTime = Utility.getMinutesOfDay(newTimeMoment) > Utility.getMinutesOfDay(startTime);
                    if (isEndTimeBeforeStartTime) {
                        manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_END_TIME, { countEndTimeValue: newTime }));
                    } else {
                        manageCountsComponent.updateCountInstanceEndTime.state.selectedDate = startTime;
                        manageCountsComponent.updateCountInstanceEndTime.state.inputValue = startTime.format(Constants.dateTimeFormates.countStartTime);
                    }
                } else {
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_END_TIME, { countEndTimeValue: newTime }));
                }
            }
        }
    },
    /**
           * Event handler when Dedmo Instance web registration start date changes while create or update count.
           * @param {*newDate} newDate 
           */
    onCountInstanceRegistrationEndDateChange(newDate, manageCountsComponent) {
        if (newDate !== Constants.messages.countsModel.invalidDate) {
            newDate = JSON.parse(newDate);
            let registrationStartDate, registrationEndDate, registrationStartTime, registrationEndTime, isEndTimeBeforeStartTime;
            if (manageCountsComponent.props.countsModel.showCreateNewCountModal) {
                manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_REGISTRATION_END_DATE, { countRegistrationEndDateValue: newDate }));
                registrationStartDate = moment(manageCountsComponent.props.countsModel.newCount.registrationStartDate);
                registrationEndDate = moment(newDate);
                registrationStartTime = moment(manageCountsComponent.props.countsModel.newCount.registrationStartTime);
                registrationEndTime = moment(manageCountsComponent.props.countsModel.newCount.registrationEndTime);
                isEndTimeBeforeStartTime = Utility.getMinutesOfDay(registrationEndTime) < Utility.getMinutesOfDay(registrationStartTime);
                if (registrationStartDate.isSame(registrationEndDate, Constants.unitsOfdate.year) && registrationStartDate.isSame(registrationEndDate, Constants.unitsOfdate.month) && registrationStartDate.isSame(registrationEndDate, Constants.unitsOfdate.day) && isEndTimeBeforeStartTime) {
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_REGISTRATION_END_TIME, { countRegistrationEndTimeValue: manageCountsComponent.props.countsModel.newCount.registrationStartTime }));
                    registrationStartTime = moment(manageCountsComponent.props.countsModel.newCount.registrationStartTime);
                    manageCountsComponent.newCountInstanceRegistrationEndTime.state.selectedDate = registrationStartTime;
                    manageCountsComponent.newCountInstanceRegistrationEndTime.state.inputValue = registrationStartTime.format(Constants.dateTimeFormates.countStartTime);
                }

            } else if (manageCountsComponent.props.countsModel.showUpdateCountModal) {
                manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_END_DATE, { countRegistrationEndDateValue: newDate }));
                registrationStartDate = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.registrationStartDate);
                registrationEndDate = moment(newDate);
                registrationStartTime = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.registrationStartTime);
                registrationEndTime = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.registrationEndTime);
                isEndTimeBeforeStartTime = Utility.getMinutesOfDay(registrationEndTime) < Utility.getMinutesOfDay(registrationStartTime);
                if (registrationStartDate.isSame(registrationEndDate, Constants.unitsOfdate.year) && registrationStartDate.isSame(registrationEndDate, Constants.unitsOfdate.month) && registrationStartDate.isSame(registrationEndDate, Constants.unitsOfdate.day) && isEndTimeBeforeStartTime) {
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_END_TIME, { countRegistrationEndTimeValue: manageCountsComponent.props.countsModel.countInstanceToUpdate.registrationStartTime }));
                    registrationStartTime = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.registrationStartTime);
                    manageCountsComponent.updateCountInstanceRegistrationEndTime.state.selectedDate = registrationStartTime;
                    manageCountsComponent.updateCountInstanceRegistrationEndTime.state.inputValue = registrationStartTime.format(Constants.dateTimeFormates.countStartTime);
                }
            }
        }
    },

    /**
   * Event handler when Dedmo Instance web registration start time changes while create or update count.
   * @param {*newTime} newTime 
   */
    onCountInstanceRegistrationEndTimeChange(newTime, manageCountsComponent) {
        if (newTime !== Constants.messages.countsModel.invalidDate) {
            newTime = JSON.parse(newTime);
            let startDate, endDate, startTime, newTimeMoment;

            if (manageCountsComponent.props.countsModel.showCreateNewCountModal) {
                //handling web registration start time change for create count.
                startDate = moment(manageCountsComponent.props.countsModel.newCount.registrationStartDate);
                endDate = moment(manageCountsComponent.props.countsModel.newCount.registrationEndDate);

                if (startDate.isSame(endDate, Constants.unitsOfdate.year) && startDate.isSame(endDate, Constants.unitsOfdate.month) && startDate.isSame(endDate, Constants.unitsOfdate.day)) {
                    startTime = moment(manageCountsComponent.props.countsModel.newCount.registrationStartTime);
                    newTimeMoment = moment(newTime);
                    let isEndTimeBeforeStartTime = Utility.getMinutesOfDay(newTimeMoment) > Utility.getMinutesOfDay(startTime);
                    if (isEndTimeBeforeStartTime) {
                        manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_REGISTRATION_END_TIME, { countRegistrationEndTimeValue: newTime }));
                    } else {
                        manageCountsComponent.newCountInstanceRegistrationEndTime.state.selectedDate = startTime;
                        manageCountsComponent.newCountInstanceRegistrationEndTime.state.inputValue = startTime.format(Constants.dateTimeFormates.countStartTime);
                    }
                } else {
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_REGISTRATION_END_TIME, { countRegistrationEndTimeValue: newTime }));
                }
            } else if (manageCountsComponent.props.countsModel.showUpdateCountModal) {
                //handling web registration start time change for update count.
                startDate = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.registrationStartDate);
                endDate = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.registrationEndDate);

                if (startDate.isSame(endDate, Constants.unitsOfdate.year) && startDate.isSame(endDate, Constants.unitsOfdate.month) && startDate.isSame(endDate, Constants.unitsOfdate.day)) {
                    startTime = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.registrationStartTime);
                    newTimeMoment = moment(newTime);
                    let isEndTimeBeforeStartTime = Utility.getMinutesOfDay(newTimeMoment) > Utility.getMinutesOfDay(startTime);
                    if (isEndTimeBeforeStartTime) {
                        manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_END_TIME, { countRegistrationEndTimeValue: newTime }));
                    } else {
                        manageCountsComponent.updateCountInstanceRegistrationEndTime.state.selectedDate = startTime;
                        manageCountsComponent.updateCountInstanceRegistrationEndTime.state.inputValue = startTime.format(Constants.dateTimeFormates.countStartTime);
                    }
                } else {
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_END_TIME, { countRegistrationEndTimeValue: newTime }));
                }
            }
        }
    },
    /**
       * Event handler when Dedmo Instance web registration start date changes while create or update count.
       * @param {*newDate} newDate 
       */
    onCountInstanceRegistrationStartDateChange(newDate, manageCountsComponent) {
        if (newDate !== Constants.messages.countsModel.invalidDate) {
            newDate = JSON.parse(newDate);
            let startDate, endDate;
            if (manageCountsComponent.props.countsModel.showCreateNewCountModal) {
                //handling web registration start date change for create count.
                manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_REGISTRATION_START_DATE, { countRegistrationStartDateValue: newDate }));
                startDate = moment(newDate);
                endDate = moment(manageCountsComponent.props.countsModel.newCount.registrationEndDate);
                //check if web registration start and end dates are equal then set the web registration end date and end time to start date. 
                if (startDate.isSameOrAfter(endDate, Constants.unitsOfdate.year) && startDate.isSameOrAfter(endDate, Constants.unitsOfdate.month) && startDate.isSameOrAfter(endDate, Constants.unitsOfdate.day)) {
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_REGISTRATION_END_DATE, { countRegistrationEndDateValue: newDate }));
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_REGISTRATION_END_TIME, { countRegistrationEndTimeValue: manageCountsComponent.props.countsModel.newCount.registrationStartTime }));
                    manageCountsComponent.newCountInstanceRegistrationEndDate.setState({ minDate: moment(newDate), inputValue: moment(newDate).format(Constants.dateTimeFormates.countStartDate), selectedDate: moment(newDate) });
                    manageCountsComponent.newCountInstanceRegistrationEndTime.setState({ inputValue: moment(manageCountsComponent.props.countsModel.newCount.registrationStartTime).format(Constants.dateTimeFormates.countStartTime), selectedDate: moment(manageCountsComponent.props.countsModel.newCount.registrationStartTime) });
                }
            } else if (manageCountsComponent.props.countsModel.showUpdateCountModal) {
                //handling web registration start date change for update count.
                manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_START_DATE, { countRegistrationStartDateValue: newDate }));
                startDate = moment(newDate);
                endDate = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.endDate);
                //check if web registration start and end dates are equal then set the web registration end date and end time to start date. 
                if (startDate.isSameOrAfter(endDate, Constants.unitsOfdate.year) && startDate.isSameOrAfter(endDate, Constants.unitsOfdate.month) && startDate.isSameOrAfter(endDate, Constants.unitsOfdate.day)) {
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_END_DATE, { countRegistrationEndDateValue: newDate }));
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_END_TIME, { countRegistrationEndTimeValue: manageCountsComponent.props.countsModel.countInstanceToUpdate.registrationStartTime }));
                    manageCountsComponent.updateCountInstanceRegistrationEndDate.setState({ minDate: moment(newDate), inputValue: moment(newDate).format(Constants.dateTimeFormates.countStartDate), selectedDate: moment(newDate) });
                    manageCountsComponent.updateCountInstanceRegistrationEndTime.setState({ inputValue: moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.registrationStartTime).format(Constants.dateTimeFormates.countStartTime), selectedDate: moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.registrationStartTime) });
                }
            }
        }
    },

    /**
     * Event handler when Dedmo Instance web registration start time changes while create or update count.
     * @param {*newTime} newTime 
     */
    onCountInstanceRegistrationStartTimeChange(newTime, manageCountsComponent) {
        if (newTime !== Constants.messages.countsModel.invalidDate) {
            newTime = JSON.parse(newTime);
            let registrationStartDate, registrationEndDate;
            if (manageCountsComponent.props.countsModel.showCreateNewCountModal) {
                //handling web registration start time change for create count.
                manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_REGISTRATION_START_TIME, { countRegistrationStartTimeValue: newTime }));
                registrationStartDate = moment(manageCountsComponent.props.countsModel.newCount.registrationStartDate);
                registrationEndDate = moment(manageCountsComponent.props.countsModel.newCount.registrationEndDate);
                //set end time to start time if start and end date of web registration are same and new start time is after end time
                if (registrationStartDate.isSame(registrationEndDate, Constants.unitsOfdate.year) && registrationStartDate.isSame(registrationEndDate, Constants.unitsOfdate.month) && registrationStartDate.isSame(registrationEndDate, Constants.unitsOfdate.day) && moment(newTime).isAfter(manageCountsComponent.props.countsModel.newCount.registrationEndTime)) {
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_REGISTRATION_END_TIME, { countRegistrationEndTimeValue: newTime }));
                    manageCountsComponent.newCountInstanceRegistrationEndTime.setState({ inputValue: moment(newTime).format(Constants.dateTimeFormates.countStartTime), selectedDate: moment(newTime) });
                }
            } else if (manageCountsComponent.props.countsModel.showUpdateCountModal) {
                //handling web registration start time change for update count.
                manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_START_TIME, { countRegistrationStartTimeValue: newTime }));
                registrationStartDate = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.registrationStartDate);
                registrationEndDate = moment(manageCountsComponent.props.countsModel.countInstanceToUpdate.registrationEndDate);
                //set end time to start time if start and end date of web registration are same and new start time is after end time
                if (registrationStartDate.isSame(registrationEndDate, Constants.unitsOfdate.year) && registrationStartDate.isSame(registrationEndDate, Constants.unitsOfdate.month) && registrationStartDate.isSame(registrationEndDate, Constants.unitsOfdate.day) && moment(newTime).isAfter(manageCountsComponent.props.countsModel.countInstanceToUpdate.registrationEndTime)) {
                    manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_END_TIME, { countRegistrationEndTimeValue: newTime }));
                    manageCountsComponent.updateCountInstanceRegistrationEndTime.setState({ inputValue: moment(newTime).format(Constants.dateTimeFormates.countStartTime), selectedDate: moment(newTime) });
                }
            }
        }
    },

    /**
   * Event handler when Dedmo Instance start date changes while creating or updating count.
   * @param {*newDate} newDate 
   */
    onCountInstanceFiltersStartDateChange(newDate, manageCountsComponent) {
        if (newDate !== Constants.messages.countsModel.invalidDate) {
            newDate = JSON.parse(newDate);
            let startDate, endDate;
            //handling start date change for update count
            manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_FILTERS_COUNT_INSTANCE_START_DATE, { countStartDateValue: newDate }));
            startDate = moment(newDate);
            endDate = moment(manageCountsComponent.props.countsModel.filters.countInstanceEndDate);
            if (startDate.isSameOrAfter(endDate, Constants.unitsOfdate.year) && startDate.isSameOrAfter(endDate, Constants.unitsOfdate.month) && startDate.isSameOrAfter(endDate, Constants.unitsOfdate.day)) {
                manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_FILTERS_COUNT_INSTANCE_END_DATE, { countEndDateValue: newDate }));
                //setting the end date and time value equal to start date and start time        
                manageCountsComponent.filterEndDate.setState({ minDate: moment(newDate), inputValue: moment(newDate).format(Constants.dateTimeFormates.countStartDate), selectedDate: moment(newDate) });
            }
        }
    },

    onCountInstanceFiltersEndDateChange(newDate, manageCountsComponent) {
        if (newDate !== Constants.messages.countsModel.invalidDate) {
            newDate = JSON.parse(newDate);
            manageCountsComponent.props.dispatch(Action.getAction(countsActionTypes.SET_FILTERS_COUNT_INSTANCE_END_DATE, { countEndDateValue: newDate }));
        }
    }

};

exports.ManageCountsHelper = ManageCountsHelper;