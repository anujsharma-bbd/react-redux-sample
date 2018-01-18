import React from "react";
import Select from "react-select";
import { connect } from 'react-redux';
import { countsActionTypes } from "../../../actions/countsActionTypes";
import { CountService } from '../../../services/counts.service';
import { countStatuses } from '../../../state/counts';
import { menuRenderer } from "../../../../shared/controls/menu-renderer/";
import * as Action from "../../../../shared/actions/action";
import { CommonService } from "../../../../shared/services/common.service";
import DateTimeField from "../../../../shared/controls/custom_datetime/";
import { ManageCountsHelper } from "../manage-counts/helper";
import { Constants } from "../../../../../common/app-settings/constants";
import RefreshTimeLogger from "../../controls/refresh-time-logger/";
import { adminActionTypes } from "../../../actions/adminActionTypes";
import { ManageSitesService } from '../../../services/manage-sites.service';
import { Utility } from "../../../../../common/utility/";
import { Modal } from 'react-bootstrap';

import moment from 'moment';


/**
 * contaon filters to select countInstance and site
 */
class EmailNotificationComponent extends React.Component {
    /**
    * Constructor to initialize fields.
    */
    constructor(props) {
        super(props);
        this.templateOptions = null;
        this.countInstanceOptions = null;
        this.sitesForReminder = null;
        this.segment = null;
        this.siteType = null;
        this.registrationStatus = null;
        this.onSiteChange = this.onSiteChange.bind(this);
        this.siteFilterOptions = this.siteFilterOptions.bind(this);
        this.fetchAllCountInstance = this.fetchAllCountInstance.bind(this);
        this.onCountInstanceChange = this.onCountInstanceChange.bind(this);
        this.countInstanceFilterOptions = this.countInstanceFilterOptions.bind(this);
        this.templateFilterOptions = this.templateFilterOptions.bind(this);
        this.onSegmentChange = this.onSegmentChange.bind(this);
        this.segmentOptions = this.segmentOptions.bind(this);
        this.onSiteTypeChange = this.onSiteTypeChange.bind(this);
        this.onTemplateChange = this.onTemplateChange.bind(this);
        this.siteTypeFilterOptions = this.siteTypeFilterOptions.bind(this);
        this.registrationStausFilterOptions = this.registrationStausFilterOptions.bind(this);
        this.onRegistrationStausChange = this.onRegistrationStausChange.bind(this);
        this.resetAsetToll = this.setTo.bind(this);
        this.showCSVUploadModal = this.showCSVUploadModal.bind(this);
        this.resetUploadedCSV = this.resetUploadedCSV.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubjectInputChange = this.onSubjectInputChange.bind(this);
        this.setNotificationEmail = this.setNotificationEmail.bind(this);
        this.removeAttachment = this.removeAttachment.bind(this);
        this.onSourceChange = this.onSourceChange.bind(this);
        this.onUserSourceChange = this.onUserSourceChange.bind(this);
      
    }

    componentDidMount() {
        // this.isSFOUser = CommonService.isSFOUser();  
        this.fetchAllCountInstance();
        this.props.onRef(this)
        this.props && this.props.resetAll();

    }
    componentWillMount() {
        this.props.onRef(undefined)

    }

    setTo(obj) {
        this.onCountInstanceChange(obj.countInstance, obj.segment, obj.siteType, obj.site, obj.registrationStatus,obj.userSource);//Constants.intialValue)
        this.onTemplateChange(obj.template);
        if (obj.csv_upload_name) {
            this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.fileName, value: obj.csv_upload_name }));
        }
    }
    /**
 * Fetch all counts instance details and relevant dispatch actions.
 */
    fetchAllCountInstance() {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
        CountService.fetchAllCountInstance().then((response) => {
            this.props.dispatch(Action.getAction(countsActionTypes.SET_ALL_COUNT_INSTANCES_FOR_REMINDER, response));
            // for calender might be use later
            //this.filterStartDate.setState({ minDate: moment(), inputValue: moment().format(Constants.dateTimeFormates.countStartDate), selectedDate: moment() });
            //this.filterEndDate.setState({ minDate: moment(), inputValue: moment().format(Constants.dateTimeFormates.countStartDate), selectedDate: moment() });
            CommonService.fetchTemplates().then((response) => {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                if (response.status == 200) {
                    this.props.dispatch(Action.getAction(adminActionTypes.SET_TEMPLATES, response.templates))
                    this.onTemplateChange({ template_id: -1, template_name: '--select--' });
                }                
            }).catch(error => {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message), Constants.validation.types.error);
            });
          
        }).catch(error => {
            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
            this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message), Constants.validation.types.error);
        });
    }
    onSubjectInputChange(event) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.notification_subject, value: event.target.value }));

    }
    onSourceChange(event) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.source, value: event.target.value }));
    }
    onInputChange(event) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.notification_name, value: event.target.value }));
    }
    showCSVUploadModal(value) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_SHOW_CSV_UPLOAD_MODAL, value));
    }
    removeAttachment() {
        Utility.showConfirm(Constants.messages.removeAttachment, () => {
            this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.fileName, value: null }));
            this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.isFileRemoved, value: true }));
            this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.send_only_to_csv , value: false }));
            this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.source, value: Constants.emptyString }));
        }, () => {
            this.showMessage(Constants.emptyString, Constants.validation.types.error.key)
        },
            this.props.dispatch,
            {})
    }

    onCountInstanceChange(value, segment, siteType, site, registrationStatus,userSource) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
        this.props.dispatch(Action.getAction(countsActionTypes.SET_SELECTED_COUNT_INSTANCE_FOR_REMINDER, value));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.count_instance_id, value: value.id }));
        let selectedSegment = segment ? segment : Constants.intialValue;
        let selectedSiteType = siteType ? siteType :Constants.intialValue;
        let selectedSite = site ? site : Constants.intialValue;
        let selectedRegistrationStaus = registrationStatus ? registrationStatus : Constants.intialValue;
        let selectedUserSource = userSource? userSource:Constants.intialValue
        if (value.id != -1) {
           
            ManageSitesService.getBoroughsAndSites([value.id]).then(response => {
                if (response.zone && response.zone.length > 0) {
                    let sites = []
                    response.zone.forEach(zone => {
                        if (zone.site && zone.site.length > 0)
                            sites = sites.concat(zone.site)
                    })
                    this.props.dispatch(Action.getAction(countsActionTypes.SET_FILTERED_SITES, sites));
                }
                CommonService.fetchUserSource(value.id ).then((response) => {
                    this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));                    
                    try{
                        if (response.status == 200) {
                            let options= [];
                            if(response.source && response.source.length>0){
                                response.source.forEach((value,index)=>{
                                    if(value && value!=Constants.emptyString)
                                    options.push({id:index+1,name:value})
                                })
                            }
                            this.props.dispatch(Action.getAction(adminActionTypes.SET_USER_SOURCE, options))
                            this.onUserSourceChange(Constants.intialValue);
                        }else{
                            let options= [];
                            this.props.dispatch(Action.getAction(adminActionTypes.SET_USER_SOURCE, options))
                            this.onUserSourceChange(Constants.intialValue);
                        }
                        this.onSegmentChange(selectedSegment);
                        this.onSiteTypeChange(selectedSiteType);
                        this.onSiteChange(selectedSite);
                        this.onRegistrationStausChange(selectedRegistrationStaus);
                        this.onUserSourceChange(selectedUserSource);
                        //to validate last selected segment value in case of update
                        siteType ? this.onSiteTypeChange(selectedSiteType) : site ? this.onSiteChange(selectedSite) : null;
                    }catch(error ){
                        console.log("error in notification =>onCountInstanceChange",error)
                    }
                }).catch(error => {
                    this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                    this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message), Constants.validation.types.error);
                });
                
            }).catch(error => {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message), Constants.validation.types.error);
            })
        } else {
            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
            this.props.dispatch(Action.getAction(countsActionTypes.SET_FILTERED_SITES, []));
            this.onSegmentChange(selectedSegment);
            this.onSiteTypeChange(selectedSiteType);
            this.onSiteChange(selectedSite);
            this.onRegistrationStausChange(selectedRegistrationStaus);
            this.onUserSourceChange(selectedUserSource);
            //to validate last selected segment value in case of update  
            siteType ? this.onSiteTypeChange(selectedSiteType) : site ? this.onSiteChange(selectedSite) : null;

        }
    }

    onSegmentChange(value) {
        // debugger;
        this.props.dispatch(Action.getAction(adminActionTypes.SET_SELECTED_SEGMENT, value));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.segment, value: value }));
        value.id == 2 && this.onSiteTypeChange(Constants.intialValue)
        value.id == 1 && this.onSiteChange(Constants.intialValue)
        value.id == 3 && this.onRegistrationStausChange(Constants.intialValue)
        value.id == 4 && this.onUserSourceChange(Constants.intialValue)
    }

    onSiteChange(value) {
        this.props.dispatch(Action.getAction(countsActionTypes.SET_SELECTED_SITE, value));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.segment_value, value: { id: value.id, name: value.name } }));

    }

    onSiteTypeChange(value) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_SELECTED_SITE_TPYE, value));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.segment_value, value: value }));

    }
    onRegistrationStausChange(value) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_SELECTED_REGISTRATION_STATUS, value));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.segment_value, value: value }));

    }
    onUserSourceChange(value){
        this.props.dispatch(Action.getAction(adminActionTypes.SET_SELECTED_USER_SOURCE, value));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.segment_value, value: value }));
  
    }
    onTemplateChange(value) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_SELECTED_TEMPLATES, value));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.template, value: { id: value.template_id, name: value.template_name } }));

    }

    /**
     * Sort count Instances.
     */
    countInstanceFilterOptions(countInstances) {
        let countInstanceArray = [{ id: -1, name: "--select--" }]
        this.countInstanceOptions = countInstances.sort(function (a, b) {
            let value = 0;
            a.order < b.order ? (value = -1) : (a.order > b.order ? (value = 1) : (value = 0));
            return value;
        })
        // if there is only one Dedmo Instance set that selected
        let allcountInstances = countInstances.filter(m => m.countInstanceId != -1);
        if (allcountInstances && allcountInstances.length == 1) {
            // this.onCountInstanceChange(allcountInstances[0])
        } else {
            this.countInstanceOptions = countInstanceArray.concat(this.countInstanceOptions);
        }
    }

    templateFilterOptions(templates) {
        let templatesArray = [{ template_id: -1, template_name: '--select--' }]
        if (templates) {
            this.templateOptions = templates.sort(function (a, b) {
                let value = 0;
                a.template_name < b.template_name ? (value = -1) : (a.template_name > b.template_name ? (value = 1) : (value = 0));
                return value;
            })
        }
        if (templates && templates.length > 0)
            this.templateOptions = templatesArray.concat(this.templateOptions);
    }
    segmentOptions(segment) {
        let segmentArray = [Constants.intialValue]
        if (segment) {
            this.segment = segment.sort(function (a, b) {
                let value = 0;
                a.name < b.name ? (value = -1) : (a.name > b.name ? (value = 1) : (value = 0));
                return value;
            })
        }
        if (segment && segment.length > 0)
            this.segment = segmentArray.concat(this.segment);
    }
    siteFilterOptions(sites) {
        let siteArray = [Constants.intialValue]
        if (sites) {
            this.sitesForReminder = sites.sort(function (a, b) {
                let value = 0;
                a.name < b.name ? (value = -1) : (a.name > b.name ? (value = 1) : (value = 0));
                return value;
            })
        }
        if (sites && sites.length > 0)
            this.sitesForReminder = siteArray.concat(this.sitesForReminder);
    }
    siteTypeFilterOptions(siteTypeList) {
        let siteTypeArray = [Constants.intialValue]
        if (siteTypeList) {
            this.siteType = siteTypeList.sort(function (a, b) {
                let value = 0;
                a.name < b.name ? (value = -1) : (a.name > b.name ? (value = 1) : (value = 0));
                return value;
            })
        }
        if (siteTypeList && siteTypeList.length > 0)
            this.siteType = siteTypeArray.concat(this.siteType);
    }
    registrationStausFilterOptions(registrationStatusList) {
        let registrationStatusArray = [Constants.intialValue]
        if (registrationStatusList) {
            this.registrationStatus = registrationStatusList.sort(function (a, b) {
                let value = 0;
                a.name < b.name ? (value = -1) : (a.name > b.name ? (value = 1) : (value = 0));
                return value;
            })
        }
        if (registrationStatusList && registrationStatusList.length > 0)
            this.registrationStatus = registrationStatusArray.concat(this.registrationStatus);
    }
    userSourceFilterOptions(userSourceList) {
        let userSourceArray = [Constants.intialValue]
        if (userSourceList) {
            this.userSource = userSourceList.sort(function (a, b) {
                let value = 0;
                a.name < b.name ? (value = -1) : (a.name > b.name ? (value = 1) : (value = 0));
                return value;
            })
        }
        if (userSourceList && userSourceList.length > 0)
            this.userSource = userSourceArray.concat(this.userSource);
    }
    resetUploadedCSV() {
        this.InviteEmailsCSV.value = ''
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.csv_upload, value: null }));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.fileName, value: Constants.emptyString }));
    }

    //show hide error meessages
    showErrorMessage(message, errorType) {
        this.props.dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: message, type: errorType.key }));
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

    // schedule email notification 
    setNotificationEmail() {
        let model = this.props.model.emailNotificationModel;
        let csv_upload = this.InviteEmailsCSV ? this.InviteEmailsCSV.files : null;
        if (!model || model.count_instance_id == -1 || model.template.id == -1) {
            this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.validationFailed), Constants.validation.types.error);
            return;
        }
        if (model.notification_subject == Constants.emptyString) {
            this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.subjectError), Constants.validation.types.error);
            return;
        }
        if (model.notification_name == Constants.emptyString) {
            this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.nameError), Constants.validation.types.error);
            return;
        }
        model.notification_name = model.notification_name.substr(0, 200);
        if (model.segment.id != -1 && model.segment_value.id == -1) {
            this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.segmentError, model.segment.name), Constants.validation.types.error);
            return;
        }
        if (!model.send_upon_cancellation && !model.send_on_registration && !model.send_now && model.scheduled_time < (new Date()).getTime()) {
            this.showErrorMessage(Utility.stringFormat(Constants.messages.countsModel.reminderEmailTime), Constants.validation.types.error);
            return;
        }
        if (!model.isNotificationUpdate) {
            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
            CommonService.addEmailNotification(model, csv_upload).then(response => {
                this.showMessage(Utility.stringFormat(Utility.stringFormat(Constants.messages.commonMessages.reminderSet)));
                this.props.listEmailNotification();
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                this.props.resetAll();
                this.InviteEmailsCSV.value = '';
            }).catch(error => {
                this.showMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
            });
        }
        else if (model.isNotificationUpdate && model.id != -1) {
            if (this.props.model.emailNotificationModel.notification_name == Constants.emptyString) {
                this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.enterName), Constants.validation.types.error);
                return;
            }
            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
            CommonService.updateEmailNotification(model, csv_upload).then(response => {
                console.log("response=update=>", response)
                this.showMessage(Utility.stringFormat(Utility.stringFormat(Constants.messages.commonMessages.reminderUpdate)));
                this.props.listEmailNotification();
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.isNotificationUpdate, value: false }));
                this.props.resetAll();
                this.InviteEmailsCSV.value = '';
            }).catch(error => {
                this.showMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
            });
        }
    }

    render() {
        let adminModel = this.props.model;
        let countsModel = this.props.countsModel;
        let minDate = (new Date()).getTime();
        const options = {};
        console.log("emailNotificationModel", adminModel.emailNotificationModel)
        let csvOnlyDisabled = adminModel.emailNotificationModel.fileName&&!adminModel.emailNotificationModel.isFileUploaded? 
                              false: adminModel.emailNotificationModel.isFileUploaded && !adminModel.emailNotificationModel.fileName? false:true;
        return <div>

            <div className="reminderrow row">

                <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                    <label>
                        Email Notifications Subject<span className="asterik-white red-color">*</span>
                    </label>
                    <input type="text" value={adminModel.emailNotificationModel.notification_subject} onChange={(e) => { this.onSubjectInputChange(e) }} placeholder="Enter notification subject" className="form-control" />

                </div>
                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <label>
                        Email Notifications<span className="asterik-white red-color">*</span>
                    </label>
                    <input type="text" value={adminModel.emailNotificationModel.notification_name} onChange={(e) => { this.onInputChange(e) }} placeholder="Enter notification name" className="form-control" />

                </div>
            </div>
            <div className="reminderrow row">

                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <label>
                        Dedmo Instance<span className="asterik-white red-color">*</span>
                    </label>
                    <Select value={countsModel.selectedCountInstanceForReminder} valueKey="id" labelKey="name" searchable={false} clearable={false}
                        menuRenderer={menuRenderer} filterOptions={this.countInstanceFilterOptions(countsModel.filters.filteredCounts)} disabled={false} className="reminderSelect"
                        name="form-field-name" onChange={(value) => this.onCountInstanceChange(value)} options={this.countInstanceOptions} />
                </div>
                {adminModel.emailNotificationModel.fileName ? <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <label>
                        CSV<span className="asterik-white"></span>
                    </label>
                    <br />
                    <label>
                        {adminModel.emailNotificationModel.fileName}
                    </label><a className="removefile" title="remove file" onClick={() => this.removeAttachment()}>X</a>
                </div> :
                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                        <label>
                            CSV<span className="asterik-white"></span>
                        </label>
                        <input className="csv-upload-btn button-site " disabled={adminModel.emailNotificationModel.send_upon_cancellation} type="file" ref={(input) => { this.InviteEmailsCSV = input  }}
                        onChange={(e) => {
                            let file = e.target.files[0];
                            if (file) {
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.isFileUploaded, value: true }));
                                
                            } else {
                                this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.isFileUploaded, value: false }));
                                
                            }
                          }
                          }  accept=".csv" />
                    </div>
                }

                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                        <label>
                            CSV Source<span className="asterik-white red-color"></span>
                        </label>
                        <input type="text"   disabled={csvOnlyDisabled } value={adminModel.emailNotificationModel.source} onChange={(e) => { this.onSourceChange(e) }} placeholder="Enter csv source" className="form-control" />
                    </div>
 

            </div>
            <div className="reminderrow row">
                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <label>
                        Templates<span className="asterik-white red-color">*</span>
                    </label>
                    <Select value={adminModel.SelectedTemplateForReminder} valueKey="template_id" labelKey="template_name" searchable={false} clearable={false}
                        className="reminderSelect" menuRenderer={menuRenderer} filterOptions={this.templateFilterOptions(adminModel.TemplatesForReminder)} name="form-field-name" onChange={(value) => this.onTemplateChange(value)}
                        options={this.templateOptions} disabled={!this.templateOptions || this.templateOptions.length == 0} />
                </div>
                <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <label>
                        Segment <span className="asterik-white red-color"></span>
                    </label>
                    <Select value={adminModel.selectedSegment} valueKey="id" labelKey="name" searchable={false} clearable={false}
                        className="reminderSelect" menuRenderer={menuRenderer} filterOptions={this.segmentOptions(adminModel.segment)} name="form-field-name" onChange={(value) => this.onSegmentChange(value)}
                        options={this.segment} disabled={!this.segment || this.segment.length == 0 || !countsModel.selectedCountInstanceForReminder || countsModel.selectedCountInstanceForReminder.id == -1} />

                </div>
                {adminModel.selectedSegment && adminModel.selectedSegment.name == Constants.segment.site ? <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <label>
                        {Constants.segment.site}<span className="asterik-white red-color"></span>
                    </label>
                    <Select value={countsModel.SelectedSiteForReminder} valueKey="id" labelKey="name" searchable={false} clearable={false}
                        className="reminderSelect" menuRenderer={menuRenderer} filterOptions={this.siteFilterOptions(countsModel.SitesForReminder)} name="form-field-name" onChange={(value) => this.onSiteChange(value)}
                        options={this.sitesForReminder} disabled={!this.sitesForReminder || this.sitesForReminder.length == 0} />

                </div> : null}
                {adminModel.selectedSegment && adminModel.selectedSegment.name == Constants.segment.siteType ? <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <label>
                        {Constants.segment.siteType}<span className="asterik-white red-color"></span>
                    </label>
                    <Select value={adminModel.selectedSiteType} valueKey="id" labelKey="name" searchable={false} clearable={false}
                        className="reminderSelect" menuRenderer={menuRenderer} filterOptions={this.siteTypeFilterOptions(adminModel.siteType)} name="form-field-name" onChange={(value) => this.onSiteTypeChange(value)}
                        options={this.siteType} disabled={!this.siteType || this.siteType.length == 0} />

                </div> : null}
                {adminModel.selectedSegment && adminModel.selectedSegment.name == Constants.segment.registrationStatus ? <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <label>
                        {Constants.segment.registrationStatus}<span className="asterik-white red-color"></span>
                    </label>
                    <Select value={adminModel.selectedRegistrationStatus} valueKey="id" labelKey="name" searchable={false} clearable={false}
                        className="reminderSelect" menuRenderer={menuRenderer} filterOptions={this.registrationStausFilterOptions(adminModel.registrationStatus)} name="form-field-name" onChange={(value) => this.onRegistrationStausChange(value)}
                        options={this.registrationStatus} disabled={!this.registrationStatus || this.registrationStatus.length == 0} />

                </div> : null}
                {adminModel.selectedSegment && adminModel.selectedSegment.name == Constants.segment.userSource ? <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <label>
                        {Constants.segment.userSource}<span className="asterik-white red-color"></span>
                    </label>
                    <Select value={adminModel.selectedUserSource} valueKey="id" labelKey="name" searchable={false} clearable={false}
                        className="reminderSelect" menuRenderer={menuRenderer} filterOptions={this.userSourceFilterOptions(adminModel.userSource)} name="form-field-name" onChange={(value) => this.onUserSourceChange(value)}
                        options={this.userSource} disabled={!this.userSource || this.userSource.length == 0} />

                </div> : null}
            </div>
            <div className="reminderrow row">
                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <label> Date </label>
                    <span ></span>

                    <DateTimeField value={this.props.currentDate}
                        dateTime={moment(this.props.currentDate)} minDate={moment(minDate)}
                        disabled={adminModel.emailNotificationModel.send_upon_cancellation || adminModel.emailNotificationModel.send_on_registration || adminModel.emailNotificationModel.send_now}
                        size="md" inputFormat={Constants.dateTimeFormates.countStartDate} mode="date" onChange={
                            (newDate) => this.props.onChangeDateTime(newDate, Constants.dateTimeType.date)}
                    />
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <label> Time </label>
                    <span ></span>
                    <DateTimeField
                        dateTime={moment(this.props.currentDate)}
                        value={this.props.currentDate}
                        disabled={adminModel.emailNotificationModel.send_upon_cancellation || adminModel.emailNotificationModel.send_on_registration || adminModel.emailNotificationModel.send_now}
                        inputFormat={Constants.dateTimeFormates.countStartTime} mode="time" onChange={
                            (newTime) => { this.props.onChangeDateTime(newTime, Constants.dateTimeType.time) }
                        }
                    />

                </div>
            </div>

            <div className="reminderrow row">
                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <span><input type="checkbox" disabled={adminModel.emailNotificationModel.send_on_registration || adminModel.emailNotificationModel.send_upon_cancellation}
                        checked={adminModel.emailNotificationModel.send_now} name="sendImmediately" onChange={() => this.props.sendImmediately(null)} /> </span>
                    <span className="mg2px f-s-14" >Send Immediately </span>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <span><input disabled={adminModel.emailNotificationModel.send_now || adminModel.emailNotificationModel.send_upon_cancellation} type="checkbox"
                        checked={adminModel.emailNotificationModel.send_on_registration} name="sendUponRegistration" onChange={() => this.props.sendUponRegistration(null)} /> </span>
                    <span className="mg2px f-s-14" >Send upon registration</span>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <span><input type="checkbox" checked={adminModel.emailNotificationModel.send_upon_cancellation}
                        disabled={adminModel.emailNotificationModel.send_on_registration || adminModel.emailNotificationModel.send_on_registration}
                        name="sendUponCancellation" onChange={() => this.props.sendUponCancellation(null)} /> </span>
                    <span className="mg2px f-s-14" >Send upon cancellation </span>
                </div>

            </div>
            <div className="reminderrow row">
            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                    <span><input type="checkbox" checked={adminModel.emailNotificationModel.send_only_to_csv}
                        disabled={csvOnlyDisabled }
                        name="sendonlytoCSV" onChange={() => this.props.onChangeOnlyCSV(null)} /> </span>
                    <span className="mg2px f-s-14" >Send only to CSV recipients</span>
                </div>
            </div>
            <div className="reminderrow row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">

                    {adminModel.emailNotificationModel.isNotificationUpdate ? <div >
                        <button type="button" onClick={() => this.setNotificationEmail()} disabled={adminModel.emailNotificationModel.isUpdateDisabled} className="pull-right add-site-btn button-site " >
                            <i className="fa fa fa-send-o mgr-5" aria-hidden="true">
                            </i>{Constants.action.update}
                        </button>
                        <button type="button" onClick={() => { this.props.resetAll(); this.InviteEmailsCSV?this.InviteEmailsCSV.value = '':null;  }} className="pull-right mr-10 add-site-btn button-site " >
                            {Constants.action.cancel}
                        </button>
                    </div> : <div >
                            <button type="button" onClick={() => this.setNotificationEmail()} className="pull-right add-site-btn button-site " >
                                <i className="fa fa fa-send-o mgr-5" aria-hidden="true">
                                </i>{Constants.action.scheduleEmail}
                            </button>
                            <button type="button" onClick={() => { this.props.resetAll(); this.InviteEmailsCSV?this.InviteEmailsCSV.value = '':null; }} className="pull-right mr-10 add-site-btn button-site " >
                                {Constants.action.reset}
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return { model: state.adminModel, sharedModel: state.sharedModel, countsModel: state.countsModel }
};
export default connect(mapStateToProps)(EmailNotificationComponent);

