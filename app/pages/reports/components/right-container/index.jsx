import React from "react";
import { connect } from "react-redux";
import { Constants } from "../../../../common/app-settings/constants"
import { Utility } from "../../../../common/utility/"
import { reportsActionTypes } from "../../actions/reportsActionTypes";
import { sharedActionTypes } from "../../../shared/actions/sharedActionTypes";
import { GAService } from "../../../shared/services/ga-service";
import * as Action from "../../../shared/actions/action";
import { CommonService } from "../../../shared/services/common.service";
import { PusherService } from "../../../shared/services/pusher-service";
import DownloaderAnchorControl from "../../../shared/controls/downloader-anchor/";

class ReportsRightContainerComponent extends React.Component {

  constructor(props) {
    super(props);
    this.onExpand = this.onExpand.bind(this);
    this.onExcelDownload = this.onExcelDownload.bind(this);
    this.surveyDownloadCallback = this.surveyDownloadCallback.bind(this);
    this.channelName = Utility.stringFormat("{0}-{1}", Constants.pusher.channels.name, Utility.getUniqueIdentifier());
    this.eventName = Constants.pusher.events.onDownloadSubmittedSurveyCSV;
  }
  // download excel file containing all surveys submitted yet for all sites
  onExcelDownload() {

    let assignmentNames = [this.props.sharedModel.selectedCountInstance.name, "survey"];
    let fileName = "";
    if (this.props.model.filterModel.selectedBorough) {
      assignmentNames.push(this.props.model.filterModel.selectedBorough.boroughName);
      fileName = this.props.model.filterModel.selectedBorough.boroughName;
    }
    if (this.props.model.filterModel.selectedSite) {
      assignmentNames.push(this.props.model.filterModel.selectedSite.siteName);
      fileName = this.props.model.filterModel.selectedSite.siteName;
    }

    // log event on GA download clicked
    GAService.logEvent(
      Utility.stringFormat(Constants.google_analytics.eventLogging.actions.Reports.downloadReportClicked),
      Utility.stringFormat(Constants.messages.google_analytics.clickedAt, Utility.convertToFormat(new Date(), Constants.dateTimeFormates.mmddyyyy)),
      Constants.google_analytics.eventLogging.eventLabels.download,
      false);

    this.props.dispatch(Action.getAction(sharedActionTypes.SET_DOWNLOADING_FLAG, true));

    CommonService.postDownloadExcel(assignmentNames, fileName, this.props.dispatch, this.channelName, this.eventName);
  }

  onExpand() {
    this.props.dispatch(Action.getAction(sharedActionTypes.SET_RIGHT_SIDE_EXPANDED, {}));
  }
  // download survey callback 
  surveyDownloadCallback(url) {
    Utility.reportsDownloadedSuccessfully();// log to Google Analytics
    this.props.dispatch(Action.getAction(sharedActionTypes.SET_DOWNLOADING_FLAG, false));
  }
  render() {

    const { sharedModel, model } = this.props;
    return (
      <div>
        <div id="sidebar-right" className={"sidebar sidebar-right " + (sharedModel.smallScreenRightMenuOpened ? " right_menu_small_screen_toggled " : '')}>
          <div className="position-relative">
            <ul className="nav m-t-10">
              <li className="nav-widget">
                <div className="reports-download-excel">
                  <div className="text-center">
                    <button title={this.props.model.filterModel.selectedBorough ? null : Constants.messages.reportsModel.downloadSurvey} className="btn donwload-button" disabled={!model.surveySubmittedModel.submittedSurveyGridModel.totalEntries || sharedModel.downloading.isDownloading} onClick={() => { this.onExcelDownload(); }}>{sharedModel.downloading.isDownloading ? sharedModel.downloading.downloadingText : sharedModel.downloading.downloadText} <i className="fa fa-download downloadicon" aria-hidden="true"></i></button>
                    <DownloaderAnchorControl channelName={this.channelName} eventName={this.eventName} callback={this.surveyDownloadCallback} ></DownloaderAnchorControl>
                  </div>
                </div>
                {/*<div className="reports-notification"> This report contains all the Surveys Submitted for all Sites.</div>*/}
              </li>
              <li className="nav-widget minify-button-container">
                <a
                  href="javascript:;"
                  className="sidebar-minify-btn right-side-bar-minify-button-admin minify-reports-button"
                  onClick={this.onExpand}>
                  <i className="fa  fa-angle-double-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="right-side-bar-bg-overlay">
          <a
            href="javascript:void(0);"
            className="sidebar-minify-btn right-side-bar-minify-button minify-reports-button"
            onClick={this.onExpand}>
            <i className="fa  fa-angle-double-left"></i>
          </a>
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return { model: state.reportsModel, sharedModel: state.sharedModel }
};
export default connect(mapStateToProps)(ReportsRightContainerComponent);