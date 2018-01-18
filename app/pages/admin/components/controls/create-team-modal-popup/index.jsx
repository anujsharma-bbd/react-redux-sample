import React from "react";
import ReactDOM from 'react-dom';
import Modal from 'tg-modal';
import ValidationControl from '../../../../shared/controls/validation-control';
import Select from "react-select";
import { connect } from 'react-redux';
import { AdminCMSService } from '../../../services/admin-cms.service';
import { adminActionTypes } from "../../../actions/adminActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Constants } from "../../../../../common/app-settings/constants"
import { Utility } from "../../../../../common/utility"
import { menuRenderer } from "../../../../shared/controls/menu-renderer/";
import { CommonService }  from '../../../../shared/services/common.service';
/**
 * Create new team component.
 */
class CreateTeamModal extends React.Component {

  /**
   * Constructor to initialize fields.
   */
  constructor(props) {
    super(props);
    this.onSiteChange = this.onSiteChange.bind(this);
    this.onBoroughChange = this.onBoroughChange.bind(this);
    this.validateTeamData = this.validateTeamData.bind(this);
    this.showLoader = this.showLoader.bind(this);
    this.getLatestTeamNametoCreate = this.getLatestTeamNametoCreate.bind(this);
    this.addNewTeam = this.addNewTeam.bind(this);
    this.isSFOUser = false;
  }

  /**
   * Fetches boroughs and sites on component mount.
   */
  componentDidMount() {
    this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAM_NAME, { teamName: Constants.emptyString }));
    this.isSFOUser = CommonService.isSFOUser();
       if(this.isSFOUser){
        let newValue =  this.props.model.filterModel.boroughs.find((f)=> f.boroughName.toLowerCase().indexOf("francisco")); 
        this.onBoroughChange(newValue);        
       }   
    // if borough / site already selected then show  them on popup as well  
    if (this.props.model.filterModel.selectedSite && Object.keys(this.props.model.filterModel.selectedSite).length > 0) {
      this.props.dispatch(Action.getAction(adminActionTypes.CREATE_TEAM_SET_BOROUGH_SITE, { borough: this.props.model.filterModel.selectedBorough, site: this.props.model.filterModel.selectedSite }));
      this.onSiteChange(this.props.model.filterModel.selectedSite);
    }
       
  }
  /**
   * Filter sites dropdown on borough select change.
   */
  siteFilterOptions(sites, selectedBorough) {
    if (selectedBorough) {
      this.sitesOptions = sites.filter((site) => (site.boroughId == selectedBorough.boroughId))
    }
  }
  /**
   * Sort data in boroughs dropdown.
   */
  boroughsFilterOptions(boroughs) {
    this.boroughsOptions = boroughs.sort(function (a, b) {
      return a.boroughName < b.boroughName ? -1 : a.boroughName > b.boroughName ? 1 : 0;
    })
  }

  /**
   * Borough dropdown select change function to set site filters.
   */
  onBoroughChange(value) {  
    let adminModel = this.props.model;
    if (adminModel.validation.message.length > 0) {
      this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: Constants.emptyString }));
    }
    this.props.dispatch(Action.getAction(adminActionTypes.CREATE_TEAM_SET_SITE, { value: null }));
    this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAM_NAME, { teamName: Constants.emptyString }));
    this.props.dispatch(Action.getAction(adminActionTypes.CREATE_TEAM_SET_BOROUGH, { value: value }));
    let allSites = this.props.model.filterModel.sites.filter((site) => (value && site.boroughId == value.boroughId));
    if(allSites && allSites.length==1){
        this.onSiteChange(allSites[0]);
    }
  }

  /**
   * Fetch team count for new team name.
   */
  onSiteChange(value) {
    let adminModel = this.props.model;
    if (adminModel.validation && adminModel.validation.message) {
      this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: Constants.emptyString }));
    }
    this.props.dispatch(Action.getAction(adminActionTypes.CREATE_TEAM_SET_SITE, { value: value }));
      this.getLatestTeamNametoCreate(value, false);  
  }
  getTeamName(allTeams){
        allTeams.sort(Utility.sortTeamByNameAsc("label"));
        allTeams = allTeams.filter((team)=>{
          let arr = team.label.split('_');
          if(arr.length>1){
            if(isNaN(arr[1])){
              return false;
            }
            else{
              return true;
            }
          }else{
            return false;
          }
        })
        if(allTeams.length==0){
          return "Team_1";
        }
        let lastTeam = allTeams[allTeams.length - 1];
        let newIndex = parseInt(lastTeam.label.substring(lastTeam.label.indexOf("_", 4) + 1)) + 1;
        return "Team_" + newIndex;  

  }
  // get latest Team name to be created
  getLatestTeamNametoCreate(selectedSite, isTeamCreate) {
    this.showLoader(true);  
    AdminCMSService.getTeamsForSelectedSite(null,this.props.sharedModel.selectedQCInstances).then((mappedData) => {   
      let teamNametoCreate = "Team_1";
      let teams = [];
      if(mappedData.site.length>0){
        mappedData.site.forEach((s)=>{
          if(s.team&&s.team.length>0){
           teams = teams.concat(s.team);
          }
        })
      }
      if (teams.length > 0) {   
          teamNametoCreate = this.getTeamName(teams);             
      }
      this.showLoader(false);      
      this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAM_NAME, { teamName: teamNametoCreate }));     
      if (isTeamCreate) {
        this.props.onAddTeam(teamNametoCreate); // add new team with latest team name to create
      }
    }).catch((error) => {
      this.showLoader(false);
      this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: Constants.messages.commonMessages.someErrorOccured }));
    });
  }
  // add new team
  addNewTeam(e) {
    e.preventDefault();
    this.getLatestTeamNametoCreate(this.props.model.createTeamModel.selectedSite, true);
  }
  /**
   * Validate team details for new team.
   */
  validateTeamData(e) {
    let isValid = true;
    let adminModel = this.props.model;
    if (!adminModel.createTeamModel.selectedBorough || !adminModel.createTeamModel.selectedSite) {
      this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: this.getValidationSummary(), isPopup: false, type: Constants.validation.types.error.key }));
      isValid = false;
    }
    return isValid;
  }
  showLoader(flag) {
    this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, flag));
  }
  /**
   * Set validation error messages for each validation
   */
  getValidationSummary() {
    let errorMessage = null;
    let adminModel = this.props.model;
    if (!adminModel.createTeamModel.selectedBorough) {
      if (!adminModel.createTeamModel.selectedSite) {
        errorMessage = Constants.messages.createTeamModal.invalidBoroughAndSite;
      }
      else {
        errorMessage = Constants.messages.createTeamModal.invalidSite;
      }
    } else if (!adminModel.createTeamModel.selectedSite) {
      errorMessage = Constants.messages.createTeamModal.invalidSite;
    }
    return errorMessage;
  }

  

  /**
   * Render view.
   */
  render() {
    let adminModel = this.props.model;
    let boroughs = adminModel.filterModel.boroughs; 
    this.boroughsOptions = boroughs;
    let selectedBoroughValue = adminModel.createTeamModel.selectedBorough;
    let sites = null;
    if(selectedBoroughValue){
      sites =  selectedBoroughValue.boroughId != -1 ?  adminModel.filterModel.sites.filter((site) => (site.boroughId == selectedBoroughValue.boroughId)):[];
     
     }
    let selectedSiteValue = adminModel.createTeamModel.selectedSite;
    return (
      <div className="container">
        <Modal isOpen={this.props.isOpen} autoWrap title="Add Team" isStatic={this.props.loader} onCancel={(e) => this.props.onCancel(e)}>
          <ValidationControl message={adminModel.validation.message} type={adminModel.validation.type} isPopup={adminModel.validation.isPopup} />
          {this.props.loader ? <div className="model-loader"><span className="spinner"></span></div> : ''}

          <table className="addteam-dialog">
            <tbody>
              <tr>
                <td className="team-type displaynone">
                  <label>Type</label>
                  <Select searchable={false} clearable={false} />
                </td>
                {
                   !CommonService.isNonAdmin() ? <td className="team-borough">
                  <label>Borough</label><span className="asterik">*</span>
                  <Select value={selectedBoroughValue} valueKey="boroughId" labelKey="boroughName" searchable={false} clearable={false}
                    menuRenderer={menuRenderer} filterOptions={this.boroughsFilterOptions(this.boroughsOptions)} disabled={!this.boroughsOptions || this.boroughsOptions.length == 0}
                    name="form-field-name" onChange={this.onBoroughChange} options={this.boroughsOptions} />
                </td> : null
                }
               
                <td className="team-site">
                  <label>Site</label><span className="asterik">*</span>
                  <Select value={selectedSiteValue} valueKey="siteId" labelKey="siteName" searchable={false} clearable={false}
                    menuRenderer={menuRenderer} filterOptions={this.siteFilterOptions(sites, selectedBoroughValue)} name="form-field-name" onChange={this.onSiteChange}
                    options={this.sitesOptions} disabled={!this.sitesOptions || this.sitesOptions.length == 0} />
                </td>
              </tr>
              <tr>
                <td className="team-name" colSpan="3">
                  <label>{adminModel.createTeamModel.teamName} </label>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="footer-bar">
            <a href="javascript:void(0)" className="link-button pull-left" onClick={(e) => this.props.onCancel(e)}>Cancel</a>
            <button className="button pull-right" onClick={(e) => { if (this.validateTeamData(e)) { this.addNewTeam(e) } } }>Add Team</button>
            <div className="clear"></div>
          </div>

        </Modal>
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


export default connect(mapStateToProps)(CreateTeamModal);