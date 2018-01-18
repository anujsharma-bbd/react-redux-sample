import React from "react";
import { connect } from 'react-redux';
import Modal from 'tg-modal';
import Select from "react-select";
import { Constants } from "../../../../../common/app-settings/constants"
import ValidationControl from '../../../../shared/controls/validation-control';
import { manageSitesActionTypes } from "../../../actions/manageSitesActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Utility } from "../../../../../common/utility/";
import { menuRenderer } from "../../../../shared/controls/menu-renderer/";

/**
 * Create Site modal component.
 */
class ManageSiteModal extends React.Component {

  /**
   * Constructor to initialize fields
   */
  constructor(props) {
    super(props);
    this.onSiteNameChange = this.onSiteNameChange.bind(this);
    this.onSiteLabelChange = this.onSiteLabelChange.bind(this);
    this.onCanvassersLimitChange = this.onCanvassersLimitChange.bind(this);
    this.validateModal = this.validateModal.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.getAction = this.getAction.bind(this);
    this.onSiteTypeChanged = this.onSiteTypeChanged.bind(this);
  }
  onSiteTypeChanged(type) {
    this.props.dispatch(Action.getAction(manageSitesActionTypes.SET_SITE_TYPE, { value: type }));
  }

  componentDidMount() {
    this.siteName.focus();
  }
  /**
    * circulate focus on modal open
 */
  setFocus(e) {
    e.preventDefault();
    if (e.keyCode == 9)
      this.siteName.focus()
  }

  /**
   * Validation function called on first name change
   */
  onSiteNameChange(e) {
    this.siteName.value = e.target.value;
  }

  /**
   *  Validation function called on last name change
   */
  onSiteLabelChange(e) {
    this.siteLabel.value = e.target.value;
  }
  /**
   *  Validation function called on canvassersLimit change
   */
  onCanvassersLimitChange(e) {
    this.canvassersLimit.value = e.target.value;
  }

  /**
   * Validate fields on modal
   */
  validateModal() {
    let isValid = true;
    if (this.siteName.value.trim().length === 0 || this.siteLabel.value.trim().length === 0 || this.canvassersLimit.value.trim().length === 0) {
      let validationMessage = null;
      // check if any of the fields length is 0 then set the validation message
      // accordingly
      switch (0) {
        case this.siteName.value.trim().length:
          validationMessage = Constants.messages.createEditSite.invalidsiteName;
          break;
        case this.siteLabel.value.trim().length:
          validationMessage = Constants.messages.createEditSite.invalidsiteLabel;
          break;
        case this.canvassersLimit.value.trim().length:
          validationMessage = Constants.messages.createEditSite.canvassersLimitRequired;
          break;
      }
      // dispatch action to show validation message
      this.props.dispatch(Action.getAction(manageSitesActionTypes.SHOW_VALIDATION_MESSAGE_MNG, {
        validationMessage: validationMessage, isPopup: false, type: Constants.validation.types.error.key
      }));
      isValid = false;
    }
    return isValid;
  }
  /**
 * on enter press
 */
  onAddUpdateSite(e) {
    let action = this.getAction();
    let selectedSiteType = this.props.model.siteTypes.find(c => c.isSelected);
    if (e.keyCode === 13) {
      if (this.validateModal()) {
        this.props.onAddUpdateDeleteSite({
          action: action, id: ((this.props.data && this.props.data != null) ? (this.props.data.id || this.props.data.siteId) : -1),
          siteName: this.siteName.value.trim(), siteLabel: this.siteLabel.value.trim(), maxCanvPerSite: this.canvassersLimit.value.trim(),
          siteType: this.props.model.siteTypes.find(c => c.isSelected).label
        });
      }
    }
  }


  getAction() {
    let action = Constants.action.none;
    this.props.data != null && (Object.keys(this.props.data).length > 0)
      ? action = Constants.action.update
      : action = Constants.action.add;
    return action;
  }
  /**
 * render html
 */
  render() {

    let action = this.getAction();
    let selectedSiteType = this.props.model.siteTypes.find(c => c.isSelected);
    let borough= this.props.model.filterModel.selectedBorough;
    return (
      <div className="container">
        <Modal
          isOpen={this.props.isOpen}
          autoWrap
          isStatic={this.props.loader}
          title={action == Constants.action.add ? "Add New Site" : "Edit Site"}
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
              <tr className="profile-first-row" style={{ borderBottom: "1px solid #eaeaea", fontStyle: "italic" }}>
                <td className="first-column">
                  <label className="bold">Borough Name</label>: <label className="bold capitalize">{this.props.data?this.props.data.boroughName:borough?borough.boroughName:null}</label>

                </td>
                <td className="sec-column">
                  <label className="bold"></label>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  &nbsp;
                </td>
              </tr>
              <tr className="profile-first-row">
                <td className="first-column">
                  <label>Site Name</label>
                  <span className="asterik">*</span>
                  <input
                    type="text"
                    className="text-control"
                    ref={(input) => (this.siteName = input)}
                    defaultValue={this.props.data ? this.props.data.siteName : ''}
                    onKeyUp={(e) => this.onAddUpdateSite(e)}
                  />
                </td>
                <td className="sec-column">
                  <label>Site Label</label>
                  <span className="asterik">*</span>
                  <input
                    type="text"
                    className="text-control"
                    ref={(input) => (this.siteLabel = input)}
                    defaultValue={this.props.data ? this.props.data.siteLabel : ''}
                    onKeyUp={(e) => this.onAddUpdateSite(e)}
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
                  <label>Canvassers Limit</label>
                  <span className="asterik">*</span>
                  <input
                    type="number"
                    className="text-control"
                    ref={(input) => (this.canvassersLimit = input)}
                    defaultValue={this.props.data && this.props.data.properties != null ? this.props.data.properties.maxCanvPerSite : ''}
                    onKeyUp={(e) => this.onAddUpdateSite(e)}
                  />
                </td>
                <td className="sec-column">
                  <label>Site Type</label>
                  {
                    <Select value={selectedSiteType} valueKey="id" labelKey="label" searchable={false} clearable={false}
                      menuRenderer={menuRenderer} disabled={false}
                      name="form-field-name" onChange={this.onSiteTypeChanged} options={this.props.model.siteTypes} />
                  }
                </td>
              </tr>
            </tbody>
          </table>
          <div className="footer-bar">
            {action == Constants.action.update
              ? (
                <button
                  className="button  pull-left remove-canvasser-button"
                  onClick={(e) => this.props.onAddUpdateDeleteSite({
                    action: Constants.action.delete,
                    id: ((this.props.data && this.props.data != null) ? this.props.data.siteId : -1),
                    siteName: this.siteName.value.trim(),
                    siteLabel: this.siteLabel.value.trim(),
                    siteType: selectedSiteType?selectedSiteType.label:null
                  })}>
                  Delete Site</button>
              )
              : Constants.emptyString
            }

            <button
              className="button pull-right canvasser-button"
              onClick={() => {
                if (this.validateModal()) {
                  this.props.onAddUpdateDeleteSite({
                    action: action,
                    id: (this.props.data ? (this.props.data.id || this.props.data.siteId) : -1),
                    siteName: this.siteName.value.trim(),
                    siteLabel: this.siteLabel.value.trim(),
                    maxCanvPerSite: this.canvassersLimit.value.trim(),
                    siteType: this.props.model.siteTypes.find(c => c.isSelected).label
                  });
                }
              }}
              onKeyDown={(e) => { this.setFocus(e) }}
            >Save Site</button>
            <div className="clear" ></div>
          </div>
        </Modal>
      </div>

    );
  }
}
/**
 * inject the current state
 */
const mapStateToProps = (state) => {
  return {
    model: state.manageSitesModel,
  }
}

export default connect(mapStateToProps)(ManageSiteModal);