import React from "react";
import { connect } from "react-redux";
import Modal from 'tg-modal';
import Canvasser from "./canvasser";
import { AdminCMSService } from '../../../services/admin-cms.service';
import { adminActionTypes } from "../../../actions/adminActionTypes";
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Constants } from "../../../../../common/app-settings/constants";
import { CommonService } from "../../../../shared/services/common.service";
import { Utility } from "../../../../../common/utility/";
import AuthorizedComponent from "../../../../shared/base/authorized-component";
import DownloaderAnchorControl from "../../../../shared/controls/downloader-anchor/";

const team_add_button = require("../../../../../assets/img/teams-add-button.png");

class CanvasserSearchComponent extends AuthorizedComponent {

  constructor(props) {
    super(props);
    this.onOpenDialog = this.onOpenDialog.bind(this);
    this.onOpenEditCanvasserDialog = this.onOpenEditCanvasserDialog.bind(this);
    this.canvasserDownloadCallback = this.canvasserDownloadCallback.bind(this);
    this.onDownloadClick = this.onDownloadClick.bind(this);
    this.handleCheckboxSelect = this.handleCheckboxSelect.bind(this);
    this.channelName = Utility.stringFormat("{0}-{1}", Constants.pusher.channels.canvassersDownload, Utility.getUniqueIdentifier());
    this.eventName = Constants.pusher.events.onCanvDownloadCSV;
  }
  componentDidMount() {
    let canvassersSelected = (this.props.location.pathname.indexOf(Constants.pathNames.canvasser) > 0); // current loaded then
    this.props.dispatch(Action.getAction(sharedActionTypes.SET_TAB_CHANGE, { key: canvassersSelected ? Constants.selectedAdminTab.canvasser : Constants.selectedAdminTab.route }));
  }
  onOpenDialog() {
    this.props.dispatch(Action.getAction(adminActionTypes.SET_CONVASSERS_DIALOG_OPEN, { IsOpen: true }));
  }
  // start downloading canvassers
  onDownloadClick() {
    // this.props.dispatch(Action.getAction(sharedActionTypes.SET_CANV_START_DOWNLOADING, true));
    let countInstanceId = this.props.sharedModel.selectedCountInstance.id;

    const { selectedSite, selectedBorough } = this.props.model.filterModel;
    let boroughId = selectedBorough && selectedBorough.boroughId;
    let siteId = selectedSite && selectedSite.siteId;

    CommonService.downloadCanvassers(this.channelName, this.eventName, countInstanceId, boroughId, siteId);
  }
  // download survey callback
  canvasserDownloadCallback(url) {
    console.log("canvasser File downloaded!!");
    this.props.dispatch(Action.getAction(sharedActionTypes.SET_CANV_START_DOWNLOADING, false));
  }
  onOpenEditCanvasserDialog(e, canvasserObject) {
    this.props.dispatch(Action.getAction(adminActionTypes.SET_EDIT_CANVASSER_DIALOG_OPEN, { IsOpen: true, canvasser: canvasserObject }));
  }
  handleCheckboxSelect(canvasser){

    this.props.dispatch(Action.getAction(adminActionTypes.SET_CANVASSER_SELECTED,canvasser));

    }
  render() {

    this.searchedCanvassers = this.props.model.rightSideModel.searchedCanvassers;
    // Internet Explorer 6-11
    let isIE = /*@cc_on!@*/false || !!document.documentMode;
    return (
      <div>
        <li className="nav-widget canvasserrs-search">
          <div className={isIE ? "right-side-filtered-routes-ie right-side-canvasser" : "right-side-filtered-routes"}>
            <label >Canvassers {"(" + (this.searchedCanvassers ? this.searchedCanvassers.length : 0) + ")"} </label>
            <i onClick={() => {
              if (!this.props.sharedModel.isCanvDownloading)
                this.onDownloadClick();
            }}
              className={"fa fa-download download-cavs" + (this.props.sharedModel.isCanvDownloading ? " downloading-canv " : "")} aria-hidden="true" title="Download All Canvassers for this site."></i>
            <img src={team_add_button} alt="" className="open-team-add-button" onClick={() => { this.props.model.filterModel.selectedSite ? this.onOpenDialog() : '' }} disabled={!this.props.model.filterModel.selectedSite} />
            <DownloaderAnchorControl channelName={this.channelName} eventName={this.eventName} callback={this.canvasserDownloadCallback} ></DownloaderAnchorControl>
            <div className="right-side-route-items custom-scroll"  >
              {
                this.searchedCanvassers && this.searchedCanvassers.length ?
                  this.searchedCanvassers.map((canvasser, index) => {
                    return (
                      <Canvasser handleCheckboxSelect = {(canv)=>{this.handleCheckboxSelect(canv)}} ItemNo={index} onOpenEditCanvasserDialog={(e, canvasser) => { this.onOpenEditCanvasserDialog(e, canvasser) }} canvasser={canvasser} key={index} />
                    )
                  })
                  :
                  <div className="no-records-found"></div>
              }
            </div>
          </div>

        </li>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    model: state.adminModel,
    sharedModel: state.sharedModel
  }
};
export default connect(mapStateToProps)(CanvasserSearchComponent);
