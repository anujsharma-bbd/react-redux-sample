import React from "react";
import { connect } from 'react-redux';
import Select from "react-select";
import { adminActionTypes } from "../../../actions/adminActionTypes";
import { dashboardActionTypes } from "../../../../dashboard/actions/dashboardActionTypes";
import { reportsActionTypes } from "../../../../reports/actions/reportsActionTypes";
import { countsActionTypes } from "../../../actions/countsActionTypes";
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Utility } from "../../../../../common/utility/";
import ToolBoxControl from "../../../../shared/controls/tool-box-control/";
import { menuRenderer } from "../../../../shared/controls/menu-renderer/";
import { Constants } from "../../../../../common/app-settings/constants";
import RefreshTimeLogger from "../../controls/refresh-time-logger/";
import { Form, FormGroup, Col, Button, ControlLabel, FormControl, Checkbox, Image, Modal, Panel } from 'react-bootstrap';
import DateTimeField from "../../../../shared/controls/custom_datetime/";
import { CountService } from '../../../services/counts.service';
import { countStatuses } from '../../../state/counts';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';
import { ManageCountsHelper } from "./helper";
import CountDetailViewComponent from './count-detail-view';
/**
 * Container component for managing counts in Admin view.
 */
class ManageCountsComponent extends React.Component {

  /**
   * Constructor to initialize instance fields.
   * @param {*props of component} props 
   */
  constructor(props) {
    super(props);
    this.fetchAllCountInstance = this.fetchAllCountInstance.bind(this);
    this.activateCountInstance = this.activateCountInstance.bind(this);
    this.deactivateCountInstance = this.deactivateCountInstance.bind(this);
    this.deleteCountInstance = this.deleteCountInstance.bind(this);
    this.createNewCountInstance = this.createNewCountInstance.bind(this);
    this.updateCountInstance = this.updateCountInstance.bind(this);
    this.onActivateCount = this.onActivateCount.bind(this);
    this.onDeleteCount = this.onDeleteCount.bind(this);
    this.onUpdateCount = this.onUpdateCount.bind(this);
  }

  /**
   * Fetch all counts instances before component mounts.
   */
  componentWillMount() {
    this.fetchAllCountInstance();
  }

  /**
   * Window resize utility.
   */
  onWindowResize() {
    Utility.onWindowResize();
  }

  /**
   * Fetch all counts instance details and relevant dispatch actions.
   */
  fetchAllCountInstance() {
    this.props.dispatch(Action.getAction(countsActionTypes.SET_PANEL_RELOAD_COUNTS_VIEW_LOWER_SECTION_REFRESH, true));
    CountService.fetchAllCountInstance().then((response) => {
      this.props.dispatch(Action.getAction(countsActionTypes.SET_PANEL_RELOAD_COUNTS_VIEW_LOWER_SECTION_REFRESH, false));
      this.props.dispatch(Action.getAction(countsActionTypes.SET_ALL_COUNT_INSTANCES, response));
      this.filterStartDate.setState({ minDate: moment(), inputValue: moment().format(Constants.dateTimeFormates.countStartDate), selectedDate: moment() });
      this.filterEndDate.setState({ minDate: moment(), inputValue: moment().format(Constants.dateTimeFormates.countStartDate), selectedDate: moment() });
      this.props.dispatch(Action.getAction(adminActionTypes.SET_ADMIN_LAST_UPDATED_ON, true))
    });
  }

  fetchActiveCountInstance() {
    this.props.dispatch(Action.getAction(countsActionTypes.SET_PANEL_RELOAD_COUNTS_VIEW_UPPER_SECTION_REFRESH, true));
    CountService.fetchAllCountInstance().then((response) => {
      this.props.dispatch(Action.getAction(countsActionTypes.SET_PANEL_RELOAD_COUNTS_VIEW_UPPER_SECTION_REFRESH, false));
      this.props.dispatch(Action.getAction(countsActionTypes.SET_ALL_COUNT_INSTANCES, response));
      this.props.dispatch(Action.getAction(adminActionTypes.SET_ADMIN_LAST_UPDATED_ON, true))
    });
  }
  /**
   * 1. Calls graphQL to delete Dedmo Instance.
   * 2. Updates state of counts model.
   * 3. Show error messages if any.
   * @param {*Dedmo Instance to be deleted} countInstanceToDelete 
   */
  deleteCountInstance(countInstanceToDelete) {
    this.props.dispatch(Action.getAction(countsActionTypes.SET_LOADER, true));
    CountService.deleteCountInstance(this.props.countsModel.countInstanceToDelete).
      then((response) => {
        this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_DELETE_COUNT_MODAL, false))
        this.props.dispatch(Action.getAction(countsActionTypes.SET_LOADER, false));
        window.setTimeout(() => {
          this.props
            .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
              validationMessage: Utility.stringFormat(Constants.messages.countsModel.countInstanceDeletionSuccess, countInstanceToDelete.name),
              isPopup: false,
              type: Constants.validation.types.success.key
            }));
        }, 0);
        this.fetchAllCountInstance();
      }).catch((err) => {
        window.setTimeout(() => {
          this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_DELETE_COUNT_MODAL, false))
          this.props.dispatch(Action.getAction(countsActionTypes.SET_LOADER, false));
          this.props
            .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
              validationMessage: Utility.stringFormat(Constants.messages.countsModel.countInstanceDeletionFailure, countInstanceToDelete.name),
              isPopup: false,
              type: Constants.validation.types.error.key
            }));
        }, 0);
      });
    window.setTimeout(() => {
      this.props
        .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
          validationMessage: Constants.emptyString,
          isPopup: false,
          type: Constants.validation.types.success.key
        }));
    }, Constants.messages.defaultMessageTimeout);
  }
  deactivateCountInstance(countInstanceToDeactivate) {
    this.props.dispatch(Action.getAction(countsActionTypes.SET_LOADER, true));
    CountService.deactivateCountInstance(this.props.countsModel.countInstanceToDeactivate).
      then((response) => {
        // this.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_INSTANCE_ID, { id: countInstanceToActivate.id }));
        this.props.dispatch(Action.getAction(dashboardActionTypes.RESET, null));
        this.props.dispatch(Action.getAction(adminActionTypes.RESET, null));
        this.props.dispatch(Action.getAction(reportsActionTypes.RESET, null));
        this.props.dispatch(Action.getAction(sharedActionTypes.RESET, null));
        this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CONFIRM_DEACTIVATE_COUNT_TYPE, false))
        // this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CANNOT_DEACTIVATE_COUNT_TYPE, false));
        this.props.dispatch(Action.getAction(countsActionTypes.SET_LOADER, false));
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_ACTIVE_COUNT_INSTANCE, { countInstance: null }));
        window.setTimeout(() => {
          this.props
            .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
              validationMessage: Utility.stringFormat(Constants.messages.countsModel.countInstanceDeactivationSuccess, countInstanceToDeactivate.name),
              isPopup: false,
              type: Constants.validation.types.success.key
            }));
        }, 0);


        // CountService.getActiveCountInstance().then(mappedData => {
        //   this.props.dispatch(Action.getAction(sharedActionTypes.SET_ACTIVE_COUNT_INSTANCE, { countInstance: mappedData.countInstance }));
        // }).catch(error => {
        //   this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, false));
        // });


        this.fetchAllCountInstance();
      }).catch((err) => {
        window.setTimeout(() => {
          this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CONFIRM_DEACTIVATE_COUNT_TYPE, false));
          // this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CANNOT_ACTIVATE_COUNT_TYPE, false));
          this.props.dispatch(Action.getAction(countsActionTypes.SET_LOADER, false));
          this.props
            .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
              validationMessage: Utility.stringFormat(Constants.messages.countsModel.countInstanceDeactivationFailure, countInstanceToDeactivate.name),
              isPopup: false,
              type: Constants.validation.types.error.key
            }));
        }, 0);
      });
    window.setTimeout(() => {
      this.props
        .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
          validationMessage: Constants.emptyString,
          isPopup: false,
          type: Constants.validation.types.success.key
        }));
    }, Constants.messages.defaultMessageTimeout);
  }
  /**
   * Set the status of countInstance as "active" through the api and also updates UI.
   * @param {*} selectedCountInstance 
   */
  activateCountInstance(countInstanceToActivate) {
    this.props.dispatch(Action.getAction(countsActionTypes.SET_LOADER, true));
    CountService.activateCountInstance(this.props.countsModel.countInstanceToActivate, this.props.countsModel.allCountsInstance).
      then((response) => {
        this.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_INSTANCE_ID, { id: countInstanceToActivate.id }));
        this.props.dispatch(Action.getAction(dashboardActionTypes.RESET, null));
        this.props.dispatch(Action.getAction(adminActionTypes.RESET, null));
        this.props.dispatch(Action.getAction(reportsActionTypes.RESET, null));
        this.props.dispatch(Action.getAction(sharedActionTypes.RESET, null));
        this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CONFIRM_ACTIVATE_COUNT_TYPE, false))
        this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CANNOT_ACTIVATE_COUNT_TYPE, false));
        this.props.dispatch(Action.getAction(countsActionTypes.SET_LOADER, false));
        window.setTimeout(() => {
          this.props
            .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
              validationMessage: Utility.stringFormat(Constants.messages.countsModel.countInstanceActivationSuccess, countInstanceToActivate.name),
              isPopup: false,
              type: Constants.validation.types.success.key
            }));
        }, 0);


        CountService.getActiveCountInstance().then(mappedData => {
          this.props.dispatch(Action.getAction(sharedActionTypes.SET_ACTIVE_COUNT_INSTANCE, { countInstance: mappedData.countInstance }));
        }).catch(error => {
          this.props.dispatch(Action.getAction(dashboardActionTypes.SET_PANEL_RELOAD_DASHBOARD, false));
        });


        this.fetchAllCountInstance();
      }).catch((err) => {
        window.setTimeout(() => {
          this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CONFIRM_ACTIVATE_COUNT_TYPE, false));
          this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CANNOT_ACTIVATE_COUNT_TYPE, false));
          this.props.dispatch(Action.getAction(countsActionTypes.SET_LOADER, false));
          this.props
            .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
              validationMessage: Utility.stringFormat(Constants.messages.countsModel.countInstanceActivationFailure, countInstanceToActivate.name),
              isPopup: false,
              type: Constants.validation.types.error.key
            }));
        }, 0);
      });
    window.setTimeout(() => {
      this.props
        .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
          validationMessage: Constants.emptyString,
          isPopup: false,
          type: Constants.validation.types.success.key
        }));
    }, Constants.messages.defaultMessageTimeout);
  }
  // show error messages
  showMessage(message, key, isPopup) {
    if (isPopup) {
      this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
        validationMessage: message, isPopup: false, type: Constants.validation.types.error.key
      }));
    }
    else {
      this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
        validationMessage: message,
        isPopup: isPopup,
        type: key
      }));
    }
    if (message)
      setTimeout(() => {
        this.showMessage(Constants.emptyString);
      }, Constants.messages.messageTimeout_5000)
  }


  /**
   * Creates new counts instance by calling the api and also updating the UI.
   * @param {*} newCountInstance 
   */
  createNewCountInstance(newCountInstance) {
    if (this.props.countsModel.allCountsInstance.length > 0) {
      let item = Object.assign({}, newCountInstance);
      item.registrationEndDate = new Date(item.registrationEndDate).getTime();
      let result = Utility.isRegistrationWindowOverlap(item, this.props.countsModel.allCountsInstance)
      if (result) {
        this.showMessage(Utility.stringFormat(Constants.messages.commonMessages.registrationWindowOverlap, result), Constants.validation.types.error.key);
        return
      }

    }
    this.props.dispatch(Action.getAction(countsActionTypes.SET_LOADER, true));
    CountService.createNewCountInstance(newCountInstance, this.siteTeamDescriptorCreateFileInput.files, this.routeDescriptorCreateFileInput.files).then((response) => {
      if (response.data.createAssignment.id) {
        this.props.dispatch(Action.getAction(countsActionTypes.SET_LOADER, false));
        this.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_INSTANCE_ID, { id: response.data.createAssignment.id }));
        this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CREATE_NEW_COUNT, false));
        window.setTimeout(() => {
          this.props
            .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
              validationMessage: Utility.stringFormat(Constants.messages.countsModel.countInstanceCreationSuccess, newCountInstance.name),
              isPopup: false,
              type: Constants.validation.types.success.key
            }));
        }, 0);
        this.fetchAllCountInstance();
      }
    }).catch(
      (err) => {
        this.props.dispatch(Action.getAction(countsActionTypes.SET_LOADER, false));
        this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CREATE_NEW_COUNT, false));
        window.setTimeout(() => {
          this.props
            .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
              validationMessage: Utility.stringFormat(Constants.messages.countsModel.countInstanceCreationFailure, newCountInstance.name),
              isPopup: false,
              type: Constants.validation.types.error.key
            }));
        }, 0);
      }
      );


    window.setTimeout(() => {
      this.props
        .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
          validationMessage: Constants.emptyString,
          isPopup: false,
          type: Constants.validation.types.success.key
        }));
    }, Constants.messages.defaultMessageTimeout);

  }
  /**
   * 1. Calls graphQL to update the given Dedmo Instance.
   * 2. Updates state of the counts model.
   * 3. Shows error messages if any.
   * @param {*Dedmo Instance to be updated} countInstanceToUpdate 
   */
  updateCountInstance(countInstanceToUpdate) {
    if (this.props.countsModel.allCountsInstance.length > 0) {
      let countArray = this.props.countsModel.allCountsInstance.filter(item => item.id != countInstanceToUpdate.id);
      if (countArray.length > 0) {
        let result = Utility.isRegistrationWindowOverlap(countInstanceToUpdate, countArray)
        if (result) {
          this.showMessage(Utility.stringFormat(Constants.messages.commonMessages.registrationWindowOverlap, result), Constants.validation.types.error.key);
          return
        }
      }
    }
    this.props.dispatch(Action.getAction(countsActionTypes.SET_LOADER, true));
    CountService.updateCountInstance(countInstanceToUpdate, this.siteTeamDescriptorUpdateFileInput.files, this.routeDescriptorUpdateFileInput.files).then((response) => {
      this.props.dispatch(Action.getAction(countsActionTypes.SET_LOADER, false));
      this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_UPDATE_COUNT_MODAL, false));
      window.setTimeout(() => {
        this.props
          .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
            validationMessage: Utility.stringFormat(Constants.messages.countsModel.countInstanceUpdationSuccess, countInstanceToUpdate.name),
            isPopup: false,
            type: Constants.validation.types.success.key
          }));
      }, 0);
      this.fetchAllCountInstance();
    }).catch(
      (err) => {
        this.props.dispatch(Action.getAction(countsActionTypes.SET_LOADER, false));
        this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_UPDATE_COUNT_MODAL, false));
        window.setTimeout(() => {
          this.props
            .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
              validationMessage: Utility.stringFormat(Constants.messages.countsModel.countInstanceUpdationFailure, countInstanceToUpdate.name),
              isPopup: false,
              type: Constants.validation.types.error.key
            }));
        }, 0);
      }
      );


    window.setTimeout(() => {
      this.props
        .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
          validationMessage: Constants.emptyString,
          isPopup: false,
          type: Constants.validation.types.success.key
        }));
    }, Constants.messages.defaultMessageTimeout);

  }

  /**
   * Invoked from the bootstrap grid when column is of "Update".
   * Shows the confirm dialog to update count ans sets the count to be updated in the state.
   * @param {*} cell 
   * @param {* contains Dedmo Instance details} row 
   * @param {*} rowIndex 
   */
  onUpdateCount(cell, row, rowIndex) {
    this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_UPDATE_COUNT_MODAL, true));
    this.props.dispatch(Action.getAction(countsActionTypes.SET_COUNT_INSTANCE_TO_UPDATE, row));
  }

  /**
   * Event handler of Update column
   * @param {*} cell 
   * @param {*} row 
   * @param {*} enumObject 
   * @param {*} rowIndex 
   */
  cellUpdateButton(cell, row, enumObject, rowIndex) {
    return (
      <Button className="countsView-defaultButton" bsSize="xsmall"
        onClick={() => {
          this.onUpdateCount(cell, row, rowIndex)
          if (!row.startDate) {
            this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_DATE, { countDateValue: moment() }));
          }
          if (!row.startTime) {
            this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_TIME, { countTimeValue: moment() }));
          }
          if (!row.endDate) {
            this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_END_DATE, { countEndDateValue: moment() }));
          }
          if (!row.endTime) {
            this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_END_TIME, { countEndTimeValue: moment() }));
          }
          if (!row.registrationStartDate) {
            this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_START_DATE, { countRegistrationStartDateValue: moment() }));
          }
          if (!row.registrationStartTime) {
            this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_START_TIME, { countRegistrationStartTimeValue: moment() }));
          }
          if (!row.registrationEndDate) {
            this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_END_DATE, { countRegistrationEndDateValue: moment() }));
          }
          if (!row.registrationEndTime) {
            this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_END_TIME, { countRegistrationEndTimeValue: moment() }));
          }
        }}>
        <i className="fa fa-edit" style={{ marginRight: "6%" }}></i>
        Update
      </Button>
    )
  }

  /**
   * Invoked from the bootstrap grid when column is of "Activate".
   * Shows the confirm dialog to activate count and sets the count to be activated in the state.
   * @param {*} cell 
   * @param {*} row 
   * @param {*} rowIndex 
   */
  onActivateCount(cell, row, rowIndex) {
    if (row.status && row.status.value === Constants.countStatus.active.value) {
      //deactivate
      this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CONFIRM_DEACTIVATE_COUNT_TYPE, true));
      this.props.dispatch(Action.getAction(countsActionTypes.SET_COUNT_INSTANCE_TO_DEACTIVATE, row));

    } else {
      //activate
      if (row.siteDescriptor) {
        this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CONFIRM_ACTIVATE_COUNT_TYPE, true));
        this.props.dispatch(Action.getAction(countsActionTypes.SET_COUNT_INSTANCE_TO_ACTIVATE, row));
      } else {
        this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CANNOT_ACTIVATE_COUNT_TYPE, true));
        this.props.dispatch(Action.getAction(countsActionTypes.SET_COUNT_INSTANCE_TO_ACTIVATE, row));
      }
    }

  }

  /**
   * Event handler of Activate column
   * @param {*} cell 
   * @param {*} row 
   * @param {*} enumObject 
   * @param {*} rowIndex 
   */
  cellActivateButton(cell, row, enumObject, rowIndex) {
    return (
      <Button className="countsView-defaultButton" bsSize="xsmall"
        onClick={() => {
          this.onActivateCount(cell, row, rowIndex)
        }}>

        {(row.status && row.status.value === Constants.countStatus.active.value) ? (<i className="fa fa-stop-circle" style={{ marginRight: "7%" }}></i>)
          : (<i className="fa fa-play-circle" style={{ marginRight: "7%" }}></i>)}
        {(row.status && row.status.value === Constants.countStatus.active.value) ? "Deactivate" : "Activate"}
      </Button>
    )
  }

  /**
   * Invoked from the bootstrap grid when column is of "Delete".
   * Shows the confirm dialog to delete count and sets the count to be deleted in the state.
   * @param {*} cell 
   * @param {*} row 
   * @param {*} rowIndex 
   */
  onDeleteCount(cell, row, rowIndex) {
    this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_DELETE_COUNT_MODAL, true));
    this.props.dispatch(Action.getAction(countsActionTypes.SET_COUNT_INSTANCE_TO_DELETE, row));
  }

  /**
   * Event handler of Delete column
   * @param {*} cell 
   * @param {*} row 
   * @param {*} enumObject 
   * @param {*} rowIndex 
   */
  cellDeleteButton(cell, row, enumObject, rowIndex) {
    return (
      <Button className="countsView-defaultButton" bsSize="xsmall"
        disabled={row.status && row.status.value === Constants.countStatus.active.value}
        onClick={() => {
          this.onDeleteCount(cell, row, rowIndex)
        }}>
        <i className="fa fa-trash" style={{ marginRight: "7%" }}></i>
        Delete
      </Button>
    )
  }

  /**
     * Event handler of date column
     * @param {*} cell 
     * @param {*} row 
     * @param {*} enumObject 
     * @param {*} rowIndex 
     */
  countInstanceDateRange(cell, row, enumObject, rowIndex) {
    return (
      <div className="">
        <ControlLabel>
          {moment.unix(row.startDate / 1000).format(Constants.dateTimeFormates.countStartDate)} - {moment.unix(row.endDate / 1000).format(Constants.dateTimeFormates.countStartDate)}
        </ControlLabel>
      </div>
    )
  }

  countInstanceDisplayName(cell, row, enumObject, rowIndex) {
    return (
      <div className="">
        <ControlLabel>
          {row.type.name + " (" + (row.name) + ")"}
        </ControlLabel>
      </div>
    )
  }
  /**
   * Event handler of Actions column
   * @param {*} cell 
   * @param {*} row 
   * @param {*} enumObject 
   * @param {*} rowIndex 
   */
  countInstanceActions(cell, row, enumObject, rowIndex) {
    return (
      <div className="countsView-actions-column">
        <Col xs={4}>
          <Button className="countsView-defaultButton countsView-actions-button" bsSize="small"
            onClick={() => {
              this.onUpdateCount(cell, row, rowIndex)
              if (!row.startDate) {
                this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_DATE, { countDateValue: moment() }));
              }
              if (!row.startTime) {
                this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_TIME, { countTimeValue: moment() }));
              }
              if (!row.endDate) {
                this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_END_DATE, { countEndDateValue: moment() }));
              }
              if (!row.endTime) {
                this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_END_TIME, { countEndTimeValue: moment() }));
              }
              if (!row.registrationStartDate) {
                this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_START_DATE, { countRegistrationStartDateValue: moment() }));
              }
              if (!row.registrationStartTime) {
                this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_START_TIME, { countRegistrationStartTimeValue: moment() }));
              }
              if (!row.registrationEndDate) {
                this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_END_DATE, { countRegistrationEndDateValue: moment() }));
              }
              if (!row.registrationEndTime) {
                this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_REGISTRATION_END_TIME, { countRegistrationEndTimeValue: moment() }));
              }
            }}>
            <i className="fa fa-edit" style={{ marginRight: "6%" }}></i>
            Edit
            </Button>
        </Col>
        <Col xs={4}>
          <Button className="countsView-actions-button" bsSize="small"
            onClick={() => {
              this.onActivateCount(cell, row, rowIndex)
            }}>

            {(row.status && row.status.value === Constants.countStatus.active.value) ? (<i className="fa fa-stop-circle" style={{ marginRight: "4%" }}></i>)
              : (<i className="fa fa-play-circle" style={{ marginRight: "7%" }}></i>)}
            {(row.status && row.status.value === Constants.countStatus.active.value) ? "Deactivate" : "Activate"}
          </Button>
        </Col>
        <Col xs={4}>
          <Button className="countsView-actions-button" bsSize="small"
            disabled={row.status && row.status.value === Constants.countStatus.active.value}
            onClick={() => {
              this.onDeleteCount(cell, row, rowIndex)
            }}>
            <i className="fa fa-trash" style={{ marginRight: "7%" }}></i>
            Delete
            </Button>
        </Col>
      </div>
    )
  }


  /**
   * The render function of the ManageCountsComponent 
   */
  render() {
    let adminModel = this.props.model;
    let countsModel = this.props.countsModel;
    const options = {};
    console.log("counts==> ", countsModel)
    //return the count view
    return (
      <div>

        <div className={'manage-count-upper-section panel panel-inverse ' + (countsModel.panelProperties.upperSection.panelExpanded ? " panel-expand " : "")}  >
          {countsModel.panelProperties.upperSection.panelReload ? <div className="panel-loader-counts"><span className="spinner-small"></span></div> : ''}
          <div className="panel-heading">
            <ToolBoxControl dataModel={countsModel.panelProperties.upperSection}
              onExpand={() => {
                this.props.dispatch(Action.getAction(countsActionTypes.SET_PANEL_EXPAND_COUNTS_VIEW_UPPER_SECTION, {}));
                this.onWindowResize();
              }}
              onReload={() => {
                this.fetchActiveCountInstance();
              }}
              onCollapse={() => {
                this.props.dispatch(Action.getAction(countsActionTypes.SET_PANEL_COLLAPSE_COUNTS_VIEW_UPPER_SECTION, {}));
                this.onWindowResize();
              }}
              onRemove={() => {
                {/* this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_REMOVE_ADMIN, {})); */ }
              }}
            />
            <h4 className="panel-title"><panel>Active Count</panel></h4>
            <RefreshTimeLogger />
          </div>

          <div className={"panel-body " + (countsModel.panelProperties.upperSection.panelExpanded ? " custom-scroll " : '') + (countsModel.panelProperties.upperSection.panelCollapsed ? ' height-0 ' : '')}>
            <div className="admin-filter-bar1" style={{ border: "1px solid lightgray", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px" }}>
              <div className={"admin-teams-content countsView-panel"}>
                <CountDetailViewComponent />
              </div>
            </div>
            <div className="showConfirmDeactivateCountModalClass">
              <Modal show={countsModel.showConfirmDeactivateCountModal} onHide={() => { this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CONFIRM_DEACTIVATE_COUNT_TYPE, false)) }}>
                <Modal.Header closeButton>
                  <Modal.Title><div className="modalTitleClass">{Constants.messages.countsModel.deactivateCountModalTitle}</div></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="modalBodyClass">
                    <p>{Utility.stringFormat(Constants.messages.countsModel.deactivateCountModalBody, countsModel.countInstanceToDeactivate.name)}</p>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <div className="modalFooterClass">
                    <p>{Constants.messages.countsModel.confirmMessage}</p>
                  </div>
                  <Button onClick={(e) => { this.deactivateCountInstance(countsModel.countInstanceToDeactivate) }}>{Constants.messages.countsModel.deactivateCountModalActivateButton}</Button>
                  <Button className="countsView-defaultButton" onClick={() => { this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CONFIRM_DEACTIVATE_COUNT_TYPE, false)) }}>{Constants.messages.countsModel.deactivateCountModalCancelButton}</Button>
                </Modal.Footer>
                {countsModel.isLoaderShown ? <div className="model-loader"><span className="spinner"></span></div> : ''}
              </Modal>
            </div>
            <div className="showConfirmActivateCountModalClass">
              <Modal show={countsModel.showConfirmActivateCountModal} backdrop="static" onHide={() => { this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CONFIRM_ACTIVATE_COUNT_TYPE, false)) }}>
                <Modal.Header closeButton>
                  <Modal.Title><div className="modalTitleClass">{Constants.messages.countsModel.activateCountModalTitle}</div></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="modalBodyClass">
                    {
                      countsModel.selectedCountInstance ?
                        (<p>{Utility.stringFormat(Constants.messages.countsModel.activateCountModalBody, countsModel.countInstanceToActivate.name, (countsModel.selectedCountInstance ? countsModel.selectedCountInstance.name : null))}</p>) :
                        (<p>{Utility.stringFormat(Constants.messages.countsModel.activateCountModalOnlyBody, countsModel.countInstanceToActivate.name)}</p>)
                    }

                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <div className="modalFooterClass">
                    <p>{Constants.messages.countsModel.confirmMessage}</p>
                  </div>
                  <Button onClick={(e) => { this.activateCountInstance(countsModel.countInstanceToActivate) }}>{Constants.messages.countsModel.activateCountModalActivateButton}</Button>
                  <Button className="countsView-defaultButton" onClick={() => { this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CONFIRM_ACTIVATE_COUNT_TYPE, false)) }}>{Constants.messages.countsModel.activateCountModalCancelButton}</Button>
                </Modal.Footer>
                {countsModel.isLoaderShown ? <div className="model-loader"><span className="spinner"></span></div> : ''}
              </Modal>
            </div>
            <div className="showCannotActivateCountModalClass">
              <Modal show={countsModel.showCannotActivateCountModal} backdrop="static" onHide={() => { this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CANNOT_ACTIVATE_COUNT_TYPE, false)) }}>
                <Modal.Header closeButton>
                  <Modal.Title><div className="modalTitleClass">{Utility.stringFormat(Constants.messages.countsModel.cannotActivateCountModalTitle, countsModel.countInstanceToActivate.name)}</div></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="modalBodyClass">
                    {
                      Utility.getCountActivationErrorMessage(countsModel.countInstanceToActivate.siteDescriptor, countsModel.countInstanceToActivate.routeDescriptor)
                    }
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="countsView-defaultButton" onClick={() => { this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CANNOT_ACTIVATE_COUNT_TYPE, false)) }}>{Constants.messages.countsModel.cannotActivateCountModalOkButton}</Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div className="showConfirmDeleteCountModalClass">
              <Modal show={countsModel.showDeleteCountModal} backdrop="static" onHide={() => { this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_DELETE_COUNT_MODAL, false)) }}>
                <Modal.Header closeButton>
                  <Modal.Title><div className="modalTitleClass">{Constants.messages.countsModel.deleteCountModalTitle}</div></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="modalBodyClass">
                    <p>{Utility.stringFormat(Constants.messages.countsModel.deleteCountModalBody, countsModel.countInstanceToDelete.name)}</p>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <div className="modalFooterClass">
                    <p>{Constants.messages.countsModel.confirmMessage}</p>
                  </div>
                  <Button onClick={(e) => { this.deleteCountInstance(countsModel.countInstanceToDelete) }}>{Constants.messages.countsModel.deleteCountModalActivateButton}</Button>
                  <Button className="countsView-defaultButton" onClick={() => { this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_DELETE_COUNT_MODAL, false)) }}>{Constants.messages.countsModel.deleteCountModalCancelButton}</Button>
                </Modal.Footer>
                {countsModel.isLoaderShown ? <div className="model-loader"><span className="spinner"></span></div> : ''}
              </Modal>
            </div>
            <div className="showCreateNewCountModalClass">
              <Modal show={countsModel.showCreateNewCountModal} backdrop="static" onHide={() => { this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CREATE_NEW_COUNT, false)) }}>
                <Modal.Header closeButton>
                  <Modal.Title><div className="">Create Count</div></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <FormGroup style={{ paddingTop: "2%", paddingLeft: "1%" }}>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12, paddingTop: "5%" }}>Count Name:</ControlLabel><span className="asterik">*</span>
                      </Col>
                      <Col sm={4}>
                        <FormControl inputRef={(input) => { this.newCountInstanceName = input }} type="text" onChange={(e) => this.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_NAME, { target: e }))} />
                      </Col>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12, paddingTop: "5%" }}>Type:</ControlLabel><span className="asterik">*</span>
                      </Col>
                      <Col sm={4}>
                        <Select ref={(input) => { this.newCountInstanceCountType = input }} value={countsModel.newCount.type} valueKey="id" labelKey="name" searchable={false} clearable={false}
                          menuRenderer={menuRenderer} disabled={false} options={countsModel.countTypes} onChange={(value) => (this.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_TYPE, value)))}
                          name="form-field-name" />
                      </Col>
                    </FormGroup>
                    <div className="clear" />
                    <FormGroup style={{ paddingTop: "2%", paddingLeft: "1%" }}>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12 }}>Start Date:</ControlLabel><span className="asterik">*</span>
                      </Col>
                      <Col sm={4}>
                        <DateTimeField ref={(input) => { this.newCountInstanceStartDate = input }} value={moment(countsModel.newCount.startDate)}
                          size="md" inputFormat={Constants.dateTimeFormates.countStartDate} mode="date" onChange={
                            (newDate) => ManageCountsHelper.onCountInstanceStartDateChange(newDate, this)}
                        />
                      </Col>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12, paddingTop: "5%" }}>Start Time:</ControlLabel><span className="asterik">*</span>
                      </Col>
                      <Col sm={4}>
                        <DateTimeField ref={(input) => { this.newCountInstanceStartTime = input }} value={moment(countsModel.newCount.startTime)}
                          inputFormat={Constants.dateTimeFormates.countStartTime} mode="time" onChange={
                            (newTime) => ManageCountsHelper.onCountInstanceStartTimeChange(newTime, this)
                          } />
                      </Col>
                    </FormGroup>
                    <div className="clear" />
                    <FormGroup style={{ paddingTop: "2%", paddingLeft: "1%" }}>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12 }}>End Date:</ControlLabel><span className="asterik">*</span>
                      </Col>
                      <Col sm={4}>
                        <DateTimeField ref={(input) => { this.newCountInstanceEndDate = input }} value={moment(countsModel.newCount.endDate)}
                          minDate={moment(countsModel.newCount.startDate)}
                          size="md" inputFormat={Constants.dateTimeFormates.countStartDate} mode="date" onChange={
                            (newDate) => ManageCountsHelper.onCountInstanceEndDateChange(newDate, this)}
                        />
                      </Col>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12, paddingTop: "5%" }}>End Time:</ControlLabel><span className="asterik">*</span>
                      </Col>
                      <Col sm={4}>
                        <DateTimeField ref={(input) => { this.newCountInstanceEndTime = input }} value={moment(countsModel.newCount.endTime)}
                          minDate={moment(countsModel.newCount.startTime)}
                          inputFormat={Constants.dateTimeFormates.countStartTime} mode="time" onChange={
                            (newTime) => ManageCountsHelper.onCountInstanceEndTimeChange(newTime, this)
                          }
                        />
                      </Col>
                    </FormGroup>
                    <div className="clear" />
                    <FormGroup style={{ paddingTop: "2%", paddingLeft: "1%" }}>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12 }}>Registration Start Date:<span className="asterik">*</span></ControlLabel>
                      </Col>
                      <Col sm={4}>
                        <DateTimeField ref={(input) => { this.newCountInstanceRegistrationStartDate = input }} value={moment(countsModel.newCount.registrationStartDate)}
                          size="md" inputFormat={Constants.dateTimeFormates.countStartDate} mode="date" onChange={
                            (newDate) => ManageCountsHelper.onCountInstanceRegistrationStartDateChange(newDate, this)}
                        />
                      </Col>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12, paddingTop: "5%" }}>Registration Start Time:<span className="asterik">*</span></ControlLabel>
                      </Col>
                      <Col sm={4}>
                        <DateTimeField ref={(input) => { this.newCountInstanceRegistrationStartTime = input }} value={moment(countsModel.newCount.registrationStartTime)}
                          inputFormat={Constants.dateTimeFormates.countStartTime} mode="time" onChange={
                            (newTime) => ManageCountsHelper.onCountInstanceRegistrationStartTimeChange(newTime, this)} />
                      </Col>
                    </FormGroup>
                    <div className="clear" />
                    <FormGroup style={{ paddingTop: "2%", paddingLeft: "1%" }}>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12 }}>Registration End Date:<span className="asterik">*</span></ControlLabel>
                      </Col>
                      <Col sm={4}>
                        <DateTimeField ref={(input) => { this.newCountInstanceRegistrationEndDate = input }} value={moment(countsModel.newCount.registrationEndDate)}
                          minDate={moment(countsModel.newCount.registrationStartDate)}
                          size="md" inputFormat={Constants.dateTimeFormates.countStartDate} mode="date" onChange={
                            (newDate) => ManageCountsHelper.onCountInstanceRegistrationEndDateChange(newDate, this)}
                        />
                      </Col>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12, paddingTop: "5%" }}>Registration End Time:<span className="asterik">*</span></ControlLabel>
                      </Col>
                      <Col sm={4}>
                        <DateTimeField ref={(input) => { this.newCountInstanceRegistrationEndTime = input }} value={moment(countsModel.newCount.registrationEndTime)}
                          minDate={moment(countsModel.newCount.registrationStartTime)}
                          inputFormat={Constants.dateTimeFormates.countStartTime} mode="time" onChange={
                            (newTime) => ManageCountsHelper.onCountInstanceRegistrationEndTimeChange(newTime, this)
                          }
                        />
                      </Col>
                    </FormGroup>
                    <div className="clear" />
                    <FormGroup style={{ paddingTop: "2%", paddingLeft: "1%" }}>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12 }}>Sites/Teams:</ControlLabel><span className="asterik">*</span>
                      </Col>
                      <Col sm={10}>
                        <input type="file" ref={(input) => { this.siteTeamDescriptorCreateFileInput = input; }} accept=".csv" onChange={(e) => {
                          let file = e.target.files[0];
                          if (file) {
                            this.props.dispatch(Action.getAction(countsActionTypes.SET_SITE_DESCRIPTOR_CREATE, true));
                          } else {
                            this.props.dispatch(Action.getAction(countsActionTypes.SET_SITE_DESCRIPTOR_CREATE, false));
                          }
                        }
                        } />
                      </Col>
                    </FormGroup>

                    <FormGroup style={{ paddingTop: "2%", paddingLeft: "1%", marginTop: "3%" }}>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12 }}>Routes:</ControlLabel>
                      </Col>
                      <Col sm={10}>
                        <input type="file" accept=".json, .geojson" ref={(input) => { this.routeDescriptorCreateFileInput = input; }} onChange={(e) => {
                          let file = e.target.files[0];
                          if (file) {
                            this.props.dispatch(Action.getAction(countsActionTypes.SET_ROUTE_DESCRIPTOR_CREATE, true));
                          } else {
                            this.props.dispatch(Action.getAction(countsActionTypes.SET_ROUTE_DESCRIPTOR_CREATE, false));
                          }
                        }
                        } />
                      </Col>
                    </FormGroup>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="countsView-defaultButton" disabled={Utility.isCountInstanceCreateUpdateDisabled(countsModel)}
                    onClick={(e) => {
                      this.createNewCountInstance(countsModel.newCount)
                    }
                    }>Create</Button>
                </Modal.Footer>
                {countsModel.isLoaderShown ? <div className="model-loader"><span className="spinner"></span></div> : ''}
              </Modal>
            </div>
            <div className="showUpdateCountModalClass">
              <Modal show={countsModel.showUpdateCountModal} backdrop="static" onHide={() => { this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_UPDATE_COUNT_MODAL, false)) }}>
                <Modal.Header closeButton>
                  <Modal.Title><div className="">Update Count</div></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <FormGroup style={{ paddingTop: "2%", paddingLeft: "1%" }}>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12, paddingTop: "5%" }}>Count Name:</ControlLabel><span className="asterik">*</span>
                      </Col>
                      <Col sm={4}>
                        <FormControl type="text" defaultValue={countsModel.countInstanceToUpdate.name} ref={(input) => (this.countInstanceToUpdateNameCtrl = input)} onChange={(e) => this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_NAME, { target: e }))} />
                      </Col>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12, paddingTop: "5%" }}>Type:</ControlLabel><span className="asterik">*</span>
                      </Col>
                      <Col sm={4}>
                        <Select value={countsModel.countInstanceToUpdate.newType} valueKey="id" labelKey="name" searchable={false} clearable={false}
                          menuRenderer={menuRenderer} disabled={false} options={countsModel.countTypes} onChange={(value) => (this.props.dispatch(Action.getAction(countsActionTypes.SET_UPDATE_COUNT_TYPE, value)))}
                          name="form-field-name" />
                      </Col>
                    </FormGroup>
                    <div className="clear" />
                    <FormGroup style={{ paddingTop: "2%", paddingLeft: "1%" }}>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12 }}>Start Date:</ControlLabel><span className="asterik">*</span>
                      </Col>
                      <Col sm={4}>
                        <DateTimeField ref={(input) => { this.updateCountInstanceStartDate = input }} value={moment(countsModel.countInstanceToUpdate.startDate)} dateTime={moment(countsModel.countInstanceToUpdate.startDate)}
                          size="md" inputFormat={Constants.dateTimeFormates.countStartDate} mode="date" onChange={
                            (newDate) => ManageCountsHelper.onCountInstanceStartDateChange(newDate, this)} />
                      </Col>

                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12, paddingTop: "5%" }}>Start Time:</ControlLabel><span className="asterik">*</span>
                      </Col>
                      <Col sm={4}>
                        <DateTimeField value={countsModel.countInstanceToUpdate.startTime} dateTime={moment(countsModel.countInstanceToUpdate.startTime)}
                          mode="time" inputFormat={Constants.dateTimeFormates.countStartTime} onChange={
                            (newTime) => ManageCountsHelper.onCountInstanceStartTimeChange(newTime, this)} />
                      </Col>
                    </FormGroup>
                    <div className="clear" />

                    <FormGroup style={{ paddingTop: "2%", paddingLeft: "1%" }}>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12 }}>End Date:</ControlLabel><span className="asterik">*</span>
                      </Col>
                      <Col sm={4}>
                        <DateTimeField ref={(input) => { this.updateCountInstanceEndDate = input }} value={moment(countsModel.countInstanceToUpdate.endDate)}
                          dateTime={moment(countsModel.countInstanceToUpdate.endDate)}
                          minDate={moment(countsModel.countInstanceToUpdate.startDate)}
                          size="md" inputFormat={Constants.dateTimeFormates.countStartDate} mode="date" onChange={
                            (newDate) => ManageCountsHelper.onCountInstanceEndDateChange(newDate, this)} />
                      </Col>

                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12, paddingTop: "5%" }}>End Time:</ControlLabel><span className="asterik">*</span>
                      </Col>
                      <Col sm={4}>
                        <DateTimeField ref={(input) => { this.updateCountInstanceEndTime = input }} value={moment(countsModel.countInstanceToUpdate.endTime)}
                          dateTime={moment(countsModel.countInstanceToUpdate.endTime)}
                          minDate={moment(countsModel.countInstanceToUpdate.startTime)}
                          mode="time" inputFormat={Constants.dateTimeFormates.countStartTime} onChange={
                            (newTime) => ManageCountsHelper.onCountInstanceEndTimeChange(newTime, this)} />
                      </Col>
                    </FormGroup>
                    <div className="clear" />
                    <FormGroup style={{ paddingTop: "2%", paddingLeft: "1%" }}>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12 }}>Registration Start Date:<span className="asterik">*</span></ControlLabel>
                      </Col>
                      <Col sm={4}>
                        <DateTimeField value={moment(countsModel.countInstanceToUpdate.registrationStartDate)} dateTime={moment(countsModel.countInstanceToUpdate.registrationStartDate)}
                          size="md" inputFormat={Constants.dateTimeFormates.countStartDate} mode="date" onChange={
                            (newDate) => ManageCountsHelper.onCountInstanceRegistrationStartDateChange(newDate, this)} />
                      </Col>

                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12, paddingTop: "5%" }}>Registration Start Time:<span className="asterik">*</span></ControlLabel>
                      </Col>
                      <Col sm={4}>
                        <DateTimeField value={moment(countsModel.countInstanceToUpdate.registrationStartTime)} dateTime={moment(countsModel.countInstanceToUpdate.registrationStartTime)}
                          mode="time" inputFormat={Constants.dateTimeFormates.countStartTime} onChange={
                            (newTime) => ManageCountsHelper.onCountInstanceRegistrationStartTimeChange(newTime, this)} />
                      </Col>
                    </FormGroup>
                    <div className="clear" />
                    <FormGroup style={{ paddingTop: "2%", paddingLeft: "1%" }}>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12 }}>Registration End Date:<span className="asterik">*</span></ControlLabel>
                      </Col>
                      <Col sm={4}>
                        <DateTimeField ref={(input) => { this.updateCountInstanceRegistrationEndDate = input }} value={moment(countsModel.countInstanceToUpdate.registrationEndDate)}
                          minDate={moment(countsModel.countInstanceToUpdate.registrationStartDate)}
                          dateTime={moment(countsModel.countInstanceToUpdate.registrationEndDate)}
                          size="md" inputFormat={Constants.dateTimeFormates.countStartDate} mode="date" onChange={
                            (newDate) => ManageCountsHelper.onCountInstanceRegistrationEndDateChange(newDate, this)}
                        />
                      </Col>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12, paddingTop: "5%" }}>Registration End Time:<span className="asterik">*</span></ControlLabel>
                      </Col>
                      <Col sm={4}>
                        <DateTimeField ref={(input) => { this.updateCountInstanceRegistrationEndTime = input }} value={moment(countsModel.countInstanceToUpdate.registrationEndTime)}
                          dateTime={moment(countsModel.countInstanceToUpdate.registrationEndTime)}
                          minDate={moment(countsModel.countInstanceToUpdate.registrationStartTime)}
                          inputFormat={Constants.dateTimeFormates.countStartTime} mode="time" onChange={
                            (newTime) => ManageCountsHelper.onCountInstanceRegistrationEndTimeChange(newTime, this)
                          }
                        />
                      </Col>
                    </FormGroup>
                    <div className="clear" />
                    <FormGroup style={{ paddingTop: "2%", paddingLeft: "1%" }}>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12 }}>Sites/Teams:</ControlLabel>
                      </Col>
                      <Col sm={10}>
                        <input type="file" ref={(input) => { this.siteTeamDescriptorUpdateFileInput = input; }} accept=".csv" />
                      </Col>
                    </FormGroup>

                    <div className="clear" />

                    <FormGroup style={{ paddingTop: "2%", paddingLeft: "1%" }}>
                      <Col sm={2}>
                        <ControlLabel style={{ fontSize: 12 }}>Routes:</ControlLabel>
                      </Col>
                      <Col sm={10}>
                        <input type="file" accept=".json, .geojson" ref={(input) => { this.routeDescriptorUpdateFileInput = input; }} onChange={(e) => {
                          let file = e.target.files[0];
                          if (file) {
                            this.props.dispatch(Action.getAction(countsActionTypes.SET_ROUTE_DESCRIPTOR_UPDATE, true));
                          } else {
                            this.props.dispatch(Action.getAction(countsActionTypes.SET_ROUTE_DESCRIPTOR_UPDATE, false));
                          }
                        }
                        } />
                      </Col>
                    </FormGroup>
                    <div className="clear" />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="countsView-defaultButton"
                    disabled={Utility.isCountInstanceCreateUpdateDisabled(countsModel)}
                    onClick={(e) => { this.updateCountInstance(countsModel.countInstanceToUpdate) }}>
                    Update</Button>
                </Modal.Footer>
                {countsModel.isLoaderShown ? <div className="model-loader"><span className="spinner"></span></div> : ''}
              </Modal>
            </div>

          </div>
        </div>

        <div className={'manage-count-lower-section panel panel-inverse ' + (countsModel.panelProperties.lowerSection.panelExpanded ? " panel-expand " : "")}  >
          {countsModel.panelProperties.lowerSection.panelReload ? <div className="panel-loader-counts"><span className="spinner-small"></span></div> : ''}
          <div className="panel-heading">
            <ToolBoxControl dataModel={countsModel.panelProperties.lowerSection}
              onExpand={() => {
                this.props.dispatch(Action.getAction(countsActionTypes.SET_PANEL_EXPAND_COUNTS_VIEW_LOWER_SECTION, {}));
                this.onWindowResize();
              }}
              onReload={() => {
                this.fetchAllCountInstance();
              }}
              onCollapse={() => {
                this.props.dispatch(Action.getAction(countsActionTypes.SET_PANEL_COLLAPSE_COUNTS_VIEW_LOWER_SECTION, {}));
                this.onWindowResize();
              }}
              onRemove={() => {
                {/* this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_REMOVE_ADMIN, {})); */ }
              }}
            />
            <h4 className="panel-title"><panel>All Count Instances</panel></h4>
            <RefreshTimeLogger />
          </div>

          <div className={"panel-body " + (countsModel.panelProperties.lowerSection.panelExpanded ? " custom-scroll " : '') + (countsModel.panelProperties.lowerSection.panelCollapsed ? ' height-0 ' : '')}>

            <div className="admin-filter-bar1" style={{ border: "1px solid lightgray", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px" }}>
              <div className={"admin-teams-content"}>
                <FormGroup className="counts-view-filters">
                  <Col sm={5} style={{ paddingLeft: "1%" }}>
                    <div className="counts-view-filter-date">
                      <DateTimeField ref={(input) => { this.filterStartDate = input }} value={moment(countsModel.filters.countInstanceStartDate)}
                        defaultText="Please select start date"
                        size="md" inputFormat={Constants.dateTimeFormates.countStartDate} mode="date" onChange={
                          (newDate) => { ManageCountsHelper.onCountInstanceFiltersStartDateChange(newDate, this); }}
                      />
                    </div>
                    <div className="counts-view-filter-date">
                      <DateTimeField ref={(input) => { this.filterEndDate = input }} value={moment(countsModel.filters.countInstanceEndDate)}
                        defaultText="Please select end date"
                        minDate={moment(countsModel.filters.countInstanceStartDate)}
                        size="md" inputFormat={Constants.dateTimeFormates.countStartDate} mode="date" onChange={
                          (newDate) => { ManageCountsHelper.onCountInstanceFiltersEndDateChange(newDate, this); }}
                      />
                    </div>
                    <div>
                      <i className="fa fa-filter fa-2x" style={{ paddingTop: "1%" }} onClick={() => {
                        let startDate = moment(countsModel.filters.countInstanceStartDate);
                        let endDate = moment(countsModel.filters.countInstanceEndDate);
                        if (startDate.isValid() && endDate.isValid()) {
                          this.props.dispatch(Action.getAction(countsActionTypes.SET_FILTERED_COUNTS, { filterStartDate: startDate, filterEndDate: endDate }))
                          {/* let filteredCounts = countsModel.allCountsInstance.filter((count) => (count.startDate < startDate && count.endDate > endDate)) */ }
                        }
                      }}></i>
                    </div>
                  </Col>
                  {/* <Col sm={2}>
                    <DateTimeField ref={(input) => { this.filterEndDate = input }} value={moment(countsModel.filters.countInstanceEndDate)}
                      size="md" inputFormat={Constants.dateTimeFormates.countStartDate} mode="date" onChange={
                        (newDate) => { console.log(newDate); }}
                    />
                  </Col>
                  <Col sm={1}>
                    <i className="fa fa-filter fa-2x" onClick={()=>{console.log("filter")}}></i>
                  </Col> */}
                  <Col sm={7}>
                    <Button className="countsView-defaultButton countsView-actions-newCount" bsSize="small"
                      onClick={() => {
                        this.props.dispatch(Action.getAction(countsActionTypes.SET_SHOW_CREATE_NEW_COUNT, true))
                        this.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_TIME, { countTimeValue: moment() }));
                        this.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_DATE, { countDateValue: moment() }));
                        this.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_END_TIME, { countEndTimeValue: moment() }));
                        this.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_END_DATE, { countEndDateValue: moment() }));
                        this.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_REGISTRATION_START_DATE, { countRegistrationStartDateValue: moment() }));
                        this.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_REGISTRATION_START_TIME, { countRegistrationStartTimeValue: moment() }));
                        this.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_REGISTRATION_END_DATE, { countRegistrationEndDateValue: moment() }));
                        this.props.dispatch(Action.getAction(countsActionTypes.SET_NEW_COUNT_REGISTRATION_END_TIME, { countRegistrationEndTimeValue: moment() }));
                      }}>
                      <i className="fa fa-plus" style={{ marginRight: "4%" }}></i>
                      Create New Count
                  </Button>
                  </Col>
                </FormGroup>
                <div className="clear" />
                <FormGroup>
                  <div className="survey-grid-position-relative custom-scroll-bar">
                    <BootstrapTable options={options}
                      data={countsModel.filters.filteredCounts}
                      striped
                      hover
                      condensed
                    >
                      <TableHeaderColumn dataField='id' isKey={true} hidden={true} dataAlign='left'>Count Id</TableHeaderColumn>
                      <TableHeaderColumn dataField='name' dataAlign='left' dataFormat={this.countInstanceDisplayName.bind(this)}>Name</TableHeaderColumn>
                      <TableHeaderColumn dataField='date' dataAlign='left' width="200" dataFormat={this.countInstanceDateRange.bind(this)}>Date</TableHeaderColumn>
                      <TableHeaderColumn dataField='actionsCountInstance' width="295"
                        dataFormat={this.countInstanceActions.bind(this)} dataAlign='left'>Actions</TableHeaderColumn>
                    </BootstrapTable>
                  </div>
                </FormGroup>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return { model: state.adminModel, sharedModel: state.sharedModel, countsModel: state.countsModel }
};
export default connect(mapStateToProps)(ManageCountsComponent);

