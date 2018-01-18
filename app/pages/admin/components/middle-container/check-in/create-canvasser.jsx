import React from "react";
import { connect } from 'react-redux';
import Modal from 'tg-modal';
import Select from "react-select";
import { Constants } from "../../../../../common/app-settings/constants"
import ValidationControl from '../../../../shared/controls/validation-control';
import { CheckInActionTypes } from "../../../actions/checkInActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Utility } from "../../../../../common/utility/";
import { menuRenderer } from "../../../../shared/controls/menu-renderer/";

/**
 * Create canvasser modal component.
 */
class CreateCanvasserModal extends React.Component {

  /**
   * Constructor to initialize fields
   */
  constructor(props) {
    super(props);
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.validateModal = this.validateModal.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.OnTeamChanged = this.OnTeamChanged.bind(this);
    this.OnConvesserTypeChanged = this.OnConvesserTypeChanged.bind(this);
  }
  /**
    * set focus on modal open
  */
  componentWillMount() {

  }

  componentDidMount() {
    this.firstName.focus();
  }
  /**
    * circulate focus on modal open
 */
  setFocus(e) {
    e.preventDefault();
    if (e.keyCode == 9)
      this.firstName.focus()
  }

  /**
   * Validation function called on first name change
   */
  onFirstNameChange(e) {
    this.firstName.value = e.target.value;
    if (this.firstName.value.trim().length > 0 && this.props.model.validation.message.length > 0) {
      this.props.dispatch(Action.getAction(CheckInActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: Constants.emptyString }));
    }
  }
  /**
   * set convesser type
   */

  OnConvesserTypeChanged(type) {
    this.props.dispatch(Action.getAction(CheckInActionTypes.SET_CONVESSER_TYPE, { value: type }));
  }
  /**
   * set selected team variable
   */

  OnTeamChanged(team) {
    this.props.dispatch(Action.getAction(CheckInActionTypes.SET_SELECTED_TEAM_FOR_CONVESSER, { value: team }));
  }

  /**
   *  Validation function called on last name change
   */
  onLastNameChange(e) {
    this.lastName.value = e.target.value;
    if (this.lastName.value.trim().length > 0 && this.props.model.validation.message.length > 0) {
      this.props.dispatch(Action.getAction(CheckInActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: Constants.emptyString }));
    }
  }

  /**
   *  Validation function called on email change
   */
  onEmailChange(e) {
    this.email.value = e.target.value;
    if (this.email.value.trim().length > 0 && this.props.model.validation.message.length > 0) {
      this.props.dispatch(Action.getAction(CheckInActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: Constants.emptyString }));
    }
  }

  /**
   * Validate fields on modal
   */
  validateModal() {
    let isValid = true;
    if (this.firstName.value.trim().length === 0 || this.lastName.value.trim().length === 0 || this.email.value.trim().length === 0 || !Utility.validateEmail(this.email.value.trim())) {
      let validationMessage = null;
      // check if any of the fields length is 0 then set the validation message
      // accordingly
      switch (0) {
        case this.firstName.value.trim().length:
          validationMessage = Constants.messages.createEditCanvasser.invalidFirstName;
          break;
        case this.lastName.value.trim().length:
          validationMessage = Constants.messages.createEditCanvasser.invalidLastName;
          break;
        case this.email.value.trim().length:
          validationMessage = Constants.messages.createEditCanvasser.emailRequired;
          break;
        default:
          if (!Utility.validateEmail(this.email.value.trim())) {
            validationMessage = Constants.messages.createEditCanvasser.invalidEmail;
          } else {
            validationMessage = Constants.emptyString;
          }
      }
      // dispatch action to show validation message
      this.props.dispatch(Action.getAction(CheckInActionTypes.SHOW_VALIDATION_MESSAGE, {
        validationMessage: validationMessage, isPopup: false, type: Constants.validation.types.error.key
      }));
      isValid = false;
    }
    return isValid;
  }
  /**
 * on enter press
 */
  onAddUpdateCanvassser(e) {
    let action = Constants.action.add;
    if (e.keyCode === 13) {
      if (this.validateModal()) {
        this.props.onAddUpdateDeleteCanvasser({
          action: action, 
          id:-1,
          firstName: this.firstName.value.trim(), 
          lastName: this.lastName.value.trim(), 
          email: this.email.value.trim(),
          teamId: this.props.model.selectedTeamForConvesser ? this.props.model.selectedTeamForConvesser.id : null,
          teamName: this.props.model.selectedTeamForConvesser ? this.props.model.selectedTeamForConvesser.label : null,
          type: this.props.model.convesserType.find(c=>c.isSelected)
        });
      }
    }
  }
  /**
 * render html
 */
  render() {
    let action = Constants.action.add;
    let selectedCanvType = this.props.model.convesserType.find(c=>c.isSelected);
console.log("props",this.props)
    return (
      <div className="container">
        <Modal
          isOpen={this.props.isOpen}
          autoWrap
          isStatic={this.props.loader}
          title=  "Canvasser Info"
          onCancel={(e) => this.props.onCancel(e)}>
          <ValidationControl
            message={this.props.model.validation.message}
            type={this.props.model.validation.type}
            isPopup={this.props.model.validation.isPopup} /> {this.props.loader
              ? <div className="model-loader">
                <span className="spinner"></span>
              </div>
              : ''}
          <table className="convasser-info-dialog">
            <tbody>
              <tr className="profile-first-row">
                <td className="first-column">
                  <label>First Name</label>
                  <span className="asterik">*</span>
                  <input
                    type="text"
                    className="text-control"
                    ref={(input) => (this.firstName = input)}
                    defaultValue={ ''}
                    onKeyUp={(e) => this.onAddUpdateCanvassser(e)}
                  />
                </td>
                <td className="sec-column">
                  <label>Last Name</label>
                  <span className="asterik">*</span>
                  <input
                    type="text"
                    className="text-control"
                    ref={(input) => (this.lastName = input)}
                    defaultValue={''}
                    onKeyUp={(e) => this.onAddUpdateCanvassser(e)}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  &nbsp;
                </td>
              </tr>
              <tr className="profile-first-row">
                <td className="first-column">
                  <label>Email</label>
                  <span className="asterik">*</span>
                  <input
                    type="text"
                    className="text-control"
                    ref={(input) => (this.email = input)} 
                    //disabled={this.props.data ? (this.props.data.email ? "disabled" : "") : ""}
                    defaultValue={ ''}
                    onKeyUp={(e) => this.onAddUpdateCanvassser(e)}
                  />
                </td>
                <td className="sec-column">
                  <span className="teamtype">
                    <label>Team</label>
                    {

                      <Select value={this.props.model.selectedTeamForConvesser} valueKey="id" labelKey="label" searchable={false} clearable={true}
                        menuRenderer={menuRenderer} disabled={false}
                        name="form-field-name" onChange={this.OnTeamChanged} options={this.props.model.searchedTeams} />
                    }  </span>
                  <span className="teamtype">
                    <label>Canvasser Type</label>
                    {
                      <Select value={selectedCanvType} valueKey="id" labelKey="label" searchable={false} clearable={false}
                        menuRenderer={menuRenderer} disabled={false}
                        name="form-field-name" onChange={this.OnConvesserTypeChanged} options={this.props.model.convesserType} />
                    }
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="footer-bar">
            {action == Constants.action.update
              ? (
                <button
                  className="button  pull-left remove-canvasser-button"
                  onClick={(e) => this.props.onAddUpdateDeleteCanvasser({
                    action: Constants.action.delete,
                    id: ((this.props.data && this.props.data != null) ? this.props.data.id : -1),
                    firstName: this.firstName.value.trim(),
                    lastName: this.lastName.value.trim(),
                    email: this.email.value.trim(),
                    teams: this.props.data && this.props.data.team ? this.props.data.team : [],
                    teamId: this.props.model.selectedTeamForConvesser ? this.props.model.selectedTeamForConvesser.id : null,
                    teamName: this.props.model.selectedTeamForConvesser ? this.props.model.selectedTeamForConvesser.label : null,
                    type: this.props.model.convesserType.find(c=>c.isSelected)

                  })}>
                  Delete Canvasser</button>
              )
              : Constants.emptyString
            }

            <button
              className="button pull-right canvasser-button"
              onClick={() => {
                if (this.validateModal()) {
                  this
                    .props
                    .onAddUpdateDeleteCanvasser({
                      action: action,
                      id: ((this.props.data && this.props.data != null)
                        ? this.props.data.id
                        : -1),
                      firstName: this
                        .firstName
                        .value
                        .trim(),
                      lastName: this
                        .lastName
                        .value
                        .trim(),
                      email: this
                        .email
                        .value
                        .trim(),
                      teamId: this.props.model.selectedTeamForConvesser ? this.props.model.selectedTeamForConvesser.id : null,
                      teamName: this.props.model.selectedTeamForConvesser ? this.props.model.selectedTeamForConvesser.label : null,
                      type: this.props.model.convesserType.find(c=>c.isSelected)
                    });
                }
              }}
              onKeyDown={(e) => { this.setFocus(e) }}
            >{action == Constants.action.update
              ? 'Update Profile Info'
              : 'Add Canvasser'}</button>
            <div className="clear" ></div>
          </div>
        </Modal>
      </div>

    );
  }
}

export default CreateCanvasserModal;
