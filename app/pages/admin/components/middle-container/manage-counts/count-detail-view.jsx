import React from "react";
import { connect } from 'react-redux';
import { countsActionTypes } from "../../../actions/countsActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Constants } from "../../../../../common/app-settings/constants";
import { FormGroup, Col, Button, ControlLabel, Panel, Well } from 'react-bootstrap';
import moment from 'moment';
/**
 * Container component for managing counts in Admin view.
 */
class CountDetailViewComponent extends React.Component {

    /**
     * Constructor to initialize instance fields.
     * @param {*props of component} props 
     */
    constructor(props) {
        super(props);
        this.onUpdateCount = this.onUpdateCount.bind(this);
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
    render() {

        let countsModel = this.props.countsModel;
        let selectedCountInstanceStartDate, selectedCountInstanceStartTime, selectedCountInstanceEndDate, selectedCountInstanceEndTime,
            selectedCountInstanceRegistrationStartDate, selectedCountInstanceRegistrationStartTime, selectedCountInstanceRegistrationEndDate, selectedCountInstanceRegistrationEndTime;
        //set initial start and end date of Dedmo Instance and web registration
        if (countsModel.selectedCountInstance && countsModel.selectedCountInstance.startDate) {
            selectedCountInstanceStartDate = moment.unix(countsModel.selectedCountInstance.startDate / 1000);
        }
        if (countsModel.selectedCountInstance && countsModel.selectedCountInstance.startTime) {
            selectedCountInstanceStartTime = moment.unix(countsModel.selectedCountInstance.startTime / 1000);
        }
        if (countsModel.selectedCountInstance && countsModel.selectedCountInstance.endDate) {
            selectedCountInstanceEndDate = moment.unix(countsModel.selectedCountInstance.endDate / 1000);
        }
        if (countsModel.selectedCountInstance && countsModel.selectedCountInstance.endTime) {
            selectedCountInstanceEndTime = moment.unix(countsModel.selectedCountInstance.endTime / 1000);
        }
        if (countsModel.selectedCountInstance && countsModel.selectedCountInstance.registrationStartDate) {
            selectedCountInstanceRegistrationStartDate = moment.unix(countsModel.selectedCountInstance.registrationStartDate / 1000);
        }
        if (countsModel.selectedCountInstance && countsModel.selectedCountInstance.registrationStartTime) {
            selectedCountInstanceRegistrationStartTime = moment.unix(countsModel.selectedCountInstance.registrationStartTime / 1000);
        }
        if (countsModel.selectedCountInstance && countsModel.selectedCountInstance.registrationEndDate) {
            selectedCountInstanceRegistrationEndDate = moment.unix(countsModel.selectedCountInstance.registrationEndDate / 1000);
        }
        if (countsModel.selectedCountInstance && countsModel.selectedCountInstance.registrationEndTime) {
            selectedCountInstanceRegistrationEndTime = moment.unix(countsModel.selectedCountInstance.registrationEndTime / 1000);
        }

        return (
            <div>
                <Panel collapsible expanded={(countsModel.selectedCountInstance && countsModel.selectedCountInstance.id != 0)}>
                    <FormGroup style={{ paddingTop: "6px" }}>
                        <Col sm={6}>
                            <ControlLabel style={{ color: "#304F66", fontSize: "15px", fontWeight: "semi-bold", paddingLeft: "3px", paddingTop: "5px" }} >{countsModel.selectedCountInstance ? (countsModel.selectedCountInstance.type ? (countsModel.selectedCountInstance.type.name + " (" + countsModel.selectedCountInstance.name + ")") : countsModel.selectedCountInstance.name) : null}</ControlLabel>
                        </Col>
                        <Col sm={6}>
                            <Button className="countsView-defaultButton countsView-actions-newCount" bsSize="small"
                                onClick={() => {
                                    this.onUpdateCount(null, countsModel.selectedCountInstance, -1)
                                }}>
                                <i className="fa fa-edit" style={{ marginRight: "4%" }}></i>
                                Edit Active Count
                            </Button>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Well className="count-detail-view-well">
                            <div>
                                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                    <ControlLabel style={{ fontSize: 12, fontWeight: "600" }}>Name:</ControlLabel>
                                    <ControlLabel style={{ paddingLeft: "4%" }}>{countsModel.selectedCountInstance ? countsModel.selectedCountInstance.name : null}</ControlLabel>
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                    <ControlLabel style={{ fontSize: 12, fontWeight: "600" }}>Type:</ControlLabel>
                                    <ControlLabel style={{ paddingLeft: "4%" }}>{countsModel.selectedCountInstance && countsModel.selectedCountInstance.type? countsModel.selectedCountInstance.type.name : null}</ControlLabel>

                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                    <ControlLabel style={{ fontSize: 12, fontWeight: "600" }}>Sites/Teams:</ControlLabel>
                                    <ControlLabel style={{ paddingLeft: "17%" }}>{countsModel.selectedCountInstance && countsModel.selectedCountInstance.siteDescriptor ? Constants.countsView.isUploaded : Constants.countsView.notUploaded}</ControlLabel>
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                    <ControlLabel style={{ fontSize: 12, fontWeight: "600" }}>Routes:</ControlLabel>
                                    <ControlLabel style={{ paddingLeft: "26%" }}>{countsModel.selectedCountInstance && countsModel.selectedCountInstance.routeDescriptor ? Constants.countsView.isUploaded : Constants.countsView.notUploaded}</ControlLabel>
                                </div>
                            </div>
                            <div>
                                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                    <ControlLabel style={{ fontSize: 12, fontWeight: "600" }}>Date:</ControlLabel>
                                    <ControlLabel style={{ paddingLeft: "6%" }}>{selectedCountInstanceStartDate ? moment(selectedCountInstanceStartDate).format(Constants.dateTimeFormates.countStartDate) : null}&nbsp;-&nbsp;{selectedCountInstanceEndDate ? moment(selectedCountInstanceEndDate).format(Constants.dateTimeFormates.countStartDate) : null}</ControlLabel>
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                    <ControlLabel style={{ fontSize: 12, fontWeight: "600" }}>Time:</ControlLabel>
                                    <ControlLabel style={{ paddingLeft: "4%" }}>{selectedCountInstanceStartTime ? moment(selectedCountInstanceStartTime).format(Constants.dateTimeFormates.countStartTime) : null}&nbsp;-&nbsp;{selectedCountInstanceEndTime ? moment(selectedCountInstanceEndTime).format(Constants.dateTimeFormates.countStartTime) : null}</ControlLabel>
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                    <ControlLabel style={{ fontSize: 12, fontWeight: "600" }}>Registration Date:</ControlLabel>
                                    <ControlLabel style={{ paddingLeft: "6%" }}>{selectedCountInstanceRegistrationStartDate ? moment(selectedCountInstanceRegistrationStartDate).format(Constants.dateTimeFormates.countStartDate) : null}&nbsp;-&nbsp;{selectedCountInstanceRegistrationEndDate ? moment(selectedCountInstanceRegistrationEndDate).format(Constants.dateTimeFormates.countStartDate) : null}</ControlLabel>
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                    <ControlLabel style={{ fontSize: 12, fontWeight: "600" }}>Registration Time:</ControlLabel>
                                    <ControlLabel style={{ paddingLeft: "4%" }}>{selectedCountInstanceRegistrationStartTime ? moment(selectedCountInstanceRegistrationStartTime).format(Constants.dateTimeFormates.countStartTime) : null}&nbsp;-&nbsp;{selectedCountInstanceRegistrationEndTime ? moment(selectedCountInstanceRegistrationEndTime).format(Constants.dateTimeFormates.countStartTime) : null}</ControlLabel>
                                </div>
                            </div>
                        </Well>
                    </FormGroup>
                    <div className="clear" />
                </Panel>
                <Panel collapsible expanded={!(countsModel.selectedCountInstance && countsModel.selectedCountInstance.id != 0)}>
                    <FormGroup>
                        <Col sm={12}>
                            <ControlLabel style={{ fontSize: 14, fontWeight: 500, marginLeft: "40%" }}>Please activate count to view details.</ControlLabel>
                        </Col>
                    </FormGroup>
                </Panel>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return { countsModel: state.countsModel }
};
export default connect(mapStateToProps)(CountDetailViewComponent);

