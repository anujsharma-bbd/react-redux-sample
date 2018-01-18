import React from "react";
import Select from "react-select";
import { connect } from "react-redux";
import fetch from "isomorphic-fetch";

import AdminCMSService from '../../../services/admin-cms.service';
import { adminActionTypes } from "../../../actions/adminActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Constants } from '../../../../../common/app-settings/constants'
import { menuRenderer } from "../../../../shared/controls/menu-renderer/";

class RightSideFilterComponent extends React.Component {

  constructor(props) {
    super(props);
    this.onKeywordSearchChange = this.onKeywordSearchChange.bind(this);
    this.onStatusSelection = this.onStatusSelection.bind(this);
    this.IsControlsDisabled = this.IsControlsDisabled.bind(this);
    this.onKeywordSearchClear = this.onKeywordSearchClear.bind(this);
  }

  componentDidMount() {
    this.options = this.props.model.rightSideModel.statusModel.options;
  }
  onKeywordSearchChange(value) {
    let convassersTabSelected =(this.props.sharedModel.tabs.filter((tab)=> tab.key===Constants.selectedAdminTab.canvasser && tab.isSelected ).length >0);
    this.props.dispatch(Action.getAction(adminActionTypes.SET_KEYWORD_SEARCH, { value: value, convassersTabSelected:convassersTabSelected })); 
}
  onStatusSelection(selection) {
    let convassersTabSelected =(this.props.sharedModel.tabs.filter((tab)=> tab.key===Constants.selectedAdminTab.canvasser && tab.isSelected ).length >0);
    this.props.dispatch(Action.getAction(adminActionTypes.SET_STATUS, {selection:selection, convassersTabSelected:convassersTabSelected}));
  }

  statusFilterOptions(filteredOptions, filterString) {
    this.options = filteredOptions.filter((option) => (option.type === filterString));
  }

  IsControlsDisabled() {
    let convassersTabSelected =(this.props.sharedModel.tabs.filter((tab)=> tab.key===Constants.selectedAdminTab.canvasser && tab.isSelected ).length >0);

    if (convassersTabSelected) {
      return !(this.props.model.rightSideModel.initialSearchedCanvassers && this.props.model.rightSideModel.initialSearchedCanvassers.length);
    }
    else {
      return !(this.props.model.rightSideModel.initialSearchedRoutes && this.props.model.rightSideModel.initialSearchedRoutes.length);
    }
  }
  onKeywordSearchClear(event){
    if(!this.IsControlsDisabled())
      this.onKeywordSearchChange('');
  }
  render() {
    let convassersTabSelected =(this.props.sharedModel.tabs.filter((tab)=> tab.key===Constants.selectedAdminTab.canvasser && tab.isSelected ).length >0);
    let model = this.props.model;
    let searchKeyword = convassersTabSelected
      ? model.rightSideModel.keywordSearchCanvModel.selectedOption
      : model.rightSideModel.keywordSearchRoutesModel.selectedOption;
    searchKeyword = searchKeyword==null ?'':searchKeyword;

    let statusSelected = convassersTabSelected
      ? model.rightSideModel.statusModel.selectedCanvOption
      : model.rightSideModel.statusModel.selectedRoutesOption;
    this.options = model.rightSideModel.statusModel.options;

    return (
      <div className="right-side-filter">
        <table cellSpacing="0" cellPadding="0" width='100%'>
          <tbody>
            <tr>
              <td className="filter-boroughs">
                <label>
                  Keyword Search
                          </label>
                          <div className = "typeable-text-box-control">
                            <input autoComplete="off" autoCorrect="off" autoCapitalize="off" type="text" onChange={(e)=>{this.onKeywordSearchChange(e.target.value)}} value={ searchKeyword } className="typeable-text-box-input" disabled={this.props.model.panelProperties.panelReload || this.IsControlsDisabled()} placeholder="Search..." />
                            <i className={(searchKeyword && searchKeyword.length)?"displaynone":"fa fa-search searchicon"} aria-hidden="true"></i>
    { (searchKeyword && searchKeyword.length) ? <span className="clear-zone" title="Clear value" onClick={ this.onKeywordSearchClear} ><span className="clear-button">×</span></span> :'' }
                          </div>
              </td>
            </tr>
            <tr>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td className="filter-sites">
                <label>
                  Status
                          </label>
                <Select valueKey="value" labelKey="label" value={statusSelected} onChange={this.onStatusSelection} disabled={this.props.model.panelProperties.panelReload || this.IsControlsDisabled()}
                   menuRenderer={menuRenderer} filterOptions={this.statusFilterOptions(this.options, convassersTabSelected ? Constants.filterStatusType.canvasser : Constants.filterStatusType.route)}
                  options={this.options} name="form-field-name" searchable={false} clearable={false} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );

  }

}

const mapStateToProps = (state) => {
  return {
    model: state.adminModel,
    sharedModel: state.sharedModel
  }
}
export default connect(mapStateToProps)(RightSideFilterComponent);
