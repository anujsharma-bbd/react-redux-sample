import React from "react";
import { connect } from 'react-redux';
import { DashboardService } from '../../../../dashboard/services/dashboard.services';
import { adminActionTypes } from "../../../actions/adminActionTypes";
import { AdminCMSService } from '../../../services/admin-cms.service';
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";
import { CommonService } from '../../../../shared/services/common.service';
import * as Action from "../../../../shared/actions/action";
import { Utility } from "../../../../../common/utility/";
import ToolBoxControl from "../../../../shared/controls/tool-box-control/";
import { Constants } from "../../../../../common/app-settings/constants";
import RefreshTimeLogger from "../../controls/refresh-time-logger/";
import { GAService } from "../../../../shared/services/ga-service";
import EmailNotificationComponent from "./email-notifications"
import { menuRenderer } from "../../../../shared/controls/menu-renderer/";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DateTimeField from "../../../../shared/controls/custom_datetime/";
import Pagination from "react-js-pagination";
import { Modal } from 'react-bootstrap';
import ToggleButton from 'react-toggle-button';

import moment from 'moment';
/**
 * component to send reminder emails to site members.
 */
class ManageEmail extends React.Component {
    /**
     * Constructor to initialize fields.
     */
    constructor(props) {
        super(props)
        this.isSFOUser = false;
        this.showErrorMessage = this.showErrorMessage.bind(this);
        this.onChangeDateTime = this.onChangeDateTime.bind(this);
        this.setDateTime = this.setDateTime.bind(this);
        this.getTimeStamp = this.getTimeStamp.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this)
        this.includeCancelledRegistration = this.includeCancelledRegistration.bind(this)
        this.sendUponRegistration = this.sendUponRegistration.bind(this);
        this.sendUponCancellation = this.sendUponCancellation.bind(this);
        this.onChangeOnlyCSV = this.onChangeOnlyCSV.bind(this)
        this.resetAll = this.resetAll.bind(this);
        this.onToggleNotification = this.onToggleNotification.bind(this);
        this.listEmailNotification = this.listEmailNotification.bind(this);
        this.getEmailNotification = this.getEmailNotification.bind(this);
        this.sendImmediately = this.sendImmediately.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.deleteEmailNotification = this.deleteEmailNotification.bind(this);
        this.showNotificationUsersModal = this.showNotificationUsersModal.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.currentDate = (new Date()).getTime();
    }

    componentWillMount() {
        this.listEmailNotification();
        this.setDateTime((new Date()).getTime())
    }

    /**
   * Lifecycle method to be called when component did mount.
   * Initializes the fields and fetch boroughs and sites for dropdowns.
   */
    componentDidMount() {
        this.isSFOUser = CommonService.isSFOUser();
        //        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));


        //  this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
    }
    onWindowResize() {
        Utility.onWindowResize();
    }
    handlePageChange(pageNo) {
        let firstIndex = (pageNo - 1) * this.props.model.paginationObject.itemsCountPerPage;
        let lastIndex = firstIndex + this.props.model.paginationObject.itemsCountPerPage;
        if (this.props.model.scheduledEmailNotificationList.length < lastIndex) {
            lastIndex = this.props.model.scheduledEmailNotificationList.length;
        }
        let paginationObj = {
            itemsCountPerPage: this.props.model.paginationObject.itemsCountPerPage,
            totalItemsCount: this.props.model.paginationObject.totalItemsCount,
            pageRangeDisplayed: this.props.model.paginationObject.pageRangeDisplayed,
            activePage: pageNo,
            itemList: this.props.model.scheduledEmailNotificationList.slice(firstIndex, lastIndex),
        }
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PAGINATION_OBJECT, paginationObj));
    }


    listEmailNotification() {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
        CommonService.listEmailNotifications().then(response => {
            response.email_notifications.length > 0 ?
                this.props.dispatch(Action.getAction(adminActionTypes.SET_SCHEDULE_NOTIFICATION_LIST, response.email_notifications))
                : this.props.dispatch(Action.getAction(adminActionTypes.SET_SCHEDULE_NOTIFICATION_LIST, []));
            let paginationObj = {};
            this.props.model.scheduledEmailNotificationList.length == 0 ?
                paginationObj = {
                    activePage: 1,
                    itemsCountPerPage: 5,
                    pageRangeDisplayed: 5,
                    itemList: this.props.model.scheduledEmailNotificationList.slice(0, 5),
                    totalItemsCount: 1
                } :
                paginationObj = {
                    activePage: 1,
                    itemsCountPerPage: 5,
                    pageRangeDisplayed: 5,
                    itemList: this.props.model.scheduledEmailNotificationList.slice(0, 5),
                    totalItemsCount: this.props.model.scheduledEmailNotificationList.length
                }
            this.props.dispatch(Action.getAction(adminActionTypes.SET_PAGINATION_OBJECT, paginationObj));

            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
        }).catch(error => {
            this.showMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
        });
    }
    showNotificationUsersModal(value) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_NOTIFICATION_USERS_MODAL, value));
    }
    handleUserPageChange(pageNo) {
        let firstIndex = (pageNo - 1) * this.props.model.paginationUsersObject.itemsCountPerPage;
        let lastIndex = firstIndex + this.props.model.paginationUsersObject.itemsCountPerPage;
        if (this.props.model.emailNotificationUsers.length < lastIndex) {
            lastIndex = this.props.model.emailNotificationUsers.length;
        }
        let paginationObj = {
            itemsCountPerPage: this.props.model.paginationUsersObject.itemsCountPerPage,
            totalItemsCount: this.props.model.paginationUsersObject.totalItemsCount,
            pageRangeDisplayed: this.props.model.paginationUsersObject.pageRangeDisplayed,
            activePage: pageNo,
            itemList: this.props.model.emailNotificationUsers.slice(firstIndex, lastIndex),
        }
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PAGINATION_USERS_OBJECT, paginationObj));
    }
    fetchUsers(id) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
        CommonService.fetchNotificationFilteredUsers(id).then(response => {
            if (response.status == 200 && response.users.length > 0) {
                // let fakelist = ["1abc@bn.com", "2zx@nb.com", "3abc@bn.com", "4zx@nb.com", "5abc@bn.com", "6zx@nb.com", "7abc@bn.com", "8zx@nb.com", "9abc@bn.com", "10zx@nb.com", "11abc@bn.com", "12zx@nb.com", "13abc@bn.com", "zx@nb.com", "abc@bn.com", "zx@nb.com", "abc@bn.com", "zx@nb.com", "abc@bn.com", "zx@nb.com", "abc@bn.com", "zx@nb.com", "abc@bn.com", "zx@nb.com", "abc@bn.com", "zx@nb.com", "abc@bn.com", "zx@nb.com", "abc@bn.com", "zx@nb.com", "abc@bn.com", "zx@nb.com", "abc@bn.com", "zx@nb.com", "abc@bn.com", "zx@nb.com", "abc@bn.com", "zx@nb.com", "abc@bn.com", "zx@nb.com", "abc@bn.com", "zx@nb.com", "abc@bn.com", "zx@nb.com", "abc@bn.com", "-12zx@nb.com", "-11abc@bn.com", "-10zx@nb.com", "-9abc@bn.com", "-8zx@nb.com", "-7abc@bn.com", "-6zx@nb.com", "-5abc@bn.com", "-4zx@nb.com", "-3abc@bn.com", "-2zx@nb.com", "-1xc@bc.com"];
                let users = response.users;
                this.props.dispatch(Action.getAction(adminActionTypes.SET_NOTIFICATION_USERS_LIST, users));
                let paginationUsersObj = {
                    activePage: 1,
                    itemsCountPerPage: 10,
                    pageRangeDisplayed: 5,
                    itemList: this.props.model.emailNotificationUsers.slice(0, 10),
                    totalItemsCount: this.props.model.emailNotificationUsers.length
                }
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PAGINATION_USERS_OBJECT, paginationUsersObj));
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                this.showNotificationUsersModal(true);

            } else {
                this.showErrorMessage(Utility.stringFormat(Constants.messages.commonMessages.noDataFound), Constants.validation.types.error);
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));

            }
        }).catch(error => {
            this.showMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
        });
    }

    onToggleNotification(value) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
        CommonService.updateStatusEmailNotifications({ "id": value.id }).then(response => {
            if (response.status == 200) {
                let message = Constants.emptyString;
                if (response.email_notification.is_active) {
                    message = response.email_notification.notification_name + " is activated."

                } else {
                    message = response.email_notification.notification_name + " is deactivated."
                }
                this.showErrorMessage(Utility.stringFormat(message), Constants.validation.types.success);
            } else {
                this.showMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
            }
            this.props.dispatch(Action.getAction(adminActionTypes.UPDATE_EMAIL_NOTIFICATION, response.email_notification));
            this.handlePageChange(this.props.model.paginationObject.activePage);
            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));

        }).catch(error => {
            this.showMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
        });
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
    resetAll() {
        let initialValue = { id: -1, name: '--select--' };
        let resetObj = {
            countInstance: initialValue,
            segment: initialValue,
            siteType: initialValue,
            template: { template_id: -1, template_name: '--select--' },
            registrationStatus: initialValue,
            site: null
        }
        this.child.setTo(resetObj);
        this.props.dispatch(Action.getAction(adminActionTypes.RESET_NOTIFICATION, { value: this.currentDate }));
        this.includeCancelledRegistration({ value: false })
        this.sendUponRegistration({ value: false });
        this.sendUponCancellation({ value: false });
        this.onChangeOnlyCSV({ value: false });
        this.sendImmediately({ value: false });
    }
    deleteEmailNotification(id, name) {
        let message = Utility.stringFormat(Constants.messages.deleteNotification, name);
        Utility.showConfirm(message, () => {
            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
            CommonService.deleteEmailNotification(id).then(response => {
                this.showMessage(Utility.stringFormat(Utility.stringFormat(Constants.messages.commonMessages.reminderDelete, name)));
                this.listEmailNotification();
                this.resetAll();
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
            }).catch(error => {
                this.showMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
            });
        }, () => {
            this.showMessage(Constants.emptyString, Constants.validation.types.error.key)
        },
            this.props.dispatch,
            {})
    }
    sendUponRegistration(obj) {
        let isChecked = obj ? obj.value : !this.props.model.emailNotificationModel.send_on_registration;
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.send_on_registration, value: isChecked }));

    }
    onChangeOnlyCSV(obj) {
        let isChecked = obj ? obj.value : !this.props.model.emailNotificationModel.send_only_to_csv ;
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.send_only_to_csv , value: isChecked }));

    }
    sendUponCancellation(obj) {
        let isChecked = obj ? obj.value : !this.props.model.emailNotificationModel.send_upon_cancellation;
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.send_upon_cancellation, value: isChecked }));

    }
    sendImmediately(obj) {
        let isChecked = obj ? obj.value : !this.props.model.emailNotificationModel.send_now;

        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.send_now, value: isChecked }));

    }
    includeCancelledRegistration(obj) {
        let isChecked = obj ? obj.value : !this.props.model.emailNotificationModel.include_canc_reg;

        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.include_canc_reg, value: isChecked }));

    }
    setDateTime(time) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.scheduled_time, value: time }));

    }

    onChangeDateTime(newTime, type) {
        if (newTime !== Constants.messages.countsModel.invalidDate) {
            newTime = JSON.parse(newTime);
            let objDate = (new Date()).getTime();
            this.currentDate = newTime;
            if (Constants.dateTimeType.time == type) {
                newTime = this.getTimeStamp(newTime, this.props.model.emailNotificationModel.scheduled_time)
            }
            else {
                newTime = this.getTimeStamp(this.props.model.emailNotificationModel.scheduled_time, newTime)
            }
            this.setDateTime(newTime)
            if (objDate < newTime) {
                this.props
                    .dispatch(Action.getAction(adminActionTypes.SHOW_VALIDATION_MESSAGE, {
                        validationMessage: Constants.emptyString,
                        isPopup: false,
                        type: Constants.validation.types.success.key
                    }));

            } else {
                this.showErrorMessage(Utility.stringFormat(Constants.messages.countsModel.reminderEmailTime), Constants.validation.types.error);
            }
        }
    }

    getTimeStamp(date1, date2) {
        let date = new Date(date1);
        let hh = date.getHours();
        let mm = date.getMinutes();
        let oldDate = new Date(date2);
        let convertDate = oldDate.getFullYear() + "/" + (oldDate.getMonth() + 1) + "/" + oldDate.getDate() + " " + hh + ":" + mm + ":00";
        return Math.round(new Date(convertDate).getTime());
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
        }, Constants.messages.messageTimeout_5000);
    }
    getEmailNotification(id) {
        this.resetAll();
        let selectNotification = this.props.model.scheduledEmailNotificationList.find(n => n.id == id)
        console.log("selectNotification", selectNotification)
        let countName = this.props.countsModel.filters.filteredCounts.find(c => c.id == selectNotification.count_instance_id).name;
        let site, siteType, registrationStatus, userSource = null;
        let segmentObj = { id: selectNotification.segment_type_id, name: selectNotification.segment_type_value };
        let segment = this.props.model.segment.find(s => s.name == selectNotification.segment)
        if (selectNotification.segment == Constants.segment.site) {
            site = segmentObj;
        } else if (selectNotification.segment == Constants.segment.siteType) {
            siteType = segmentObj;
        } else if (selectNotification.segment == Constants.segment.registrationStatus) {
            registrationStatus = segmentObj;
        }else if (selectNotification.segment == Constants.segment.userSource) {
            userSource = segmentObj;
        }
        let csv_upload_name = null;
        if (selectNotification.csv_file.url && selectNotification.csv_file.url.includes('/')) {
            let csv_upload = selectNotification.csv_file.url.split('/');
            csv_upload_name = csv_upload[csv_upload.length - 1];
        }
        let resetObj = {
            countInstance: { id: selectNotification.count_instance_id, name: countName },
            segment: segment,
            siteType: siteType,
            template: { template_id: selectNotification.template_id, template_name: selectNotification.template_name },
            site: site,
            registrationStatus: registrationStatus,
            userSource:userSource,
            csv_upload_name: csv_upload_name
        }

        this.child.setTo(resetObj);
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.notification_name, value: selectNotification.notification_name }));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.source, value: selectNotification.source }));

        if (selectNotification.notification_subject)
            this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.notification_subject, value: selectNotification.notification_subject }));
        else
            this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.notification_subject, value: Constants.emptyString }));
        this.sendUponRegistration({ value: selectNotification.send_on_registration })
        this.sendUponCancellation({ value: selectNotification.send_upon_cancellation })
        this.onChangeOnlyCSV({value:selectNotification.send_only_to_csv })
        this.sendImmediately({ value: selectNotification.send_now })
        this.includeCancelledRegistration({ value: selectNotification.include_canc_reg })
        this.currentDate = new Date(selectNotification.send_at);
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.isNotificationUpdate, value: true }));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.id, value: selectNotification.id }));
        this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.scheduled_time, value: this.currentDate.getTime() }));
        if(selectNotification.send_upon_cancellation || selectNotification.send_on_registration || !selectNotification.is_active || !selectNotification.send_now && !selectNotification.isSent){
            //do nothing 
        }else{
            this.props.dispatch(Action.getAction(adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL, { prop: Constants.emailNotificationModel.isUpdateDisabled, value: true }));
            
        }
    }

    render() {
        let adminModel = this.props.model;
        let countsModel = this.props.countsModel;
        let boroughs = adminModel.filterModel.boroughs;
        this.boroughsOptions = boroughs;
        let selectedBoroughValue = adminModel.filterModel.selectedBorough;
        let sites = adminModel.filterModel.sites;
        let selectedSiteValue = adminModel.filterModel.selectedSite;
        console.log("adminModel", adminModel.emailNotificationUsers)
        return (
            <div className={'panel panel-inverse ' + (adminModel.panelProperties.panelExpanded ? " panel-expand " : "")}  >
                <div className="panel-heading">
                    <ToolBoxControl dataModel={adminModel.panelProperties}
                        onExpand={() => {
                            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_EXPAND_ADMIN, {}));
                            this.onWindowResize();
                        }}
                        onReload={() => {
                            this.resetAll();
                            this.listEmailNotification();
                        }}
                        onCollapse={() => {
                            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_COLLAPSE_ADMIN, {}));
                            this.onWindowResize();
                        }}
                        onRemove={() => {
                            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_REMOVE_ADMIN, {}));
                        }}
                    />
                    <h5 className="panel-title"><panel>Manage Email</panel>
                    </h5>
                </div>
                <Modal show={adminModel.isNotificationUsersModalOpen} onHide={() => { this.showNotificationUsersModal(false) }}>
                    <Modal.Header closeButton>
                        <Modal.Title><div className="modalTitleClass">Users List</div></Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="modalBodyClass">
                            <div className="recipients_no">
                                {adminModel.emailNotificationUsers && adminModel.emailNotificationUsers.length} Recipients.
                                </div>
                            <div>
                                {
                                    adminModel.paginationUsersObject && adminModel.emailNotificationUsers.map((item, index) => {
                                        let firstIndex = (adminModel.paginationUsersObject.activePage - 1) * adminModel.paginationUsersObject.itemsCountPerPage;
                                        let lastIndex = firstIndex + this.props.model.paginationUsersObject.itemsCountPerPage;
                                        let currentIndex = index;
                                        if (currentIndex >= firstIndex && currentIndex < lastIndex)
                                            return <div className="usergrid" key={"user" + index}>{item}</div>
                                    })
                                }
                            </div>

                            <div className="pagination-users">
                                {adminModel.paginationUsersObject ? <Pagination
                                    firstPageText={<i className='glyphicon glyphicon-chevron-left' />}
                                    lastPageText={<i className='glyphicon glyphicon-chevron-right' />}
                                    prevPageText={<i className='glyphicon glyphicon-menu-left' />}
                                    nextPageText={<i className='glyphicon glyphicon-menu-right' />}
                                    activePage={this.props.model.paginationUsersObject.activePage}
                                    itemsCountPerPage={this.props.model.paginationUsersObject.itemsCountPerPage}
                                    totalItemsCount={this.props.model.paginationUsersObject.totalItemsCount}
                                    pageRangeDisplayed={this.props.model.paginationUsersObject.pageRangeDisplayed}
                                    onChange={(e) => { this.handleUserPageChange(e) }}
                                /> : null}
                            </div>
                            <div className="controls-list">
                                <button type="button" onClick={() => { this.showNotificationUsersModal(false) }} className="invitees-btn button-site pull-right " >Close </button>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="modalFooterClass">
                            <p></p>
                        </div>
                    </Modal.Footer>
                </Modal>
                <div className={"panel-body " + (adminModel.panelProperties.panelExpanded ? " custom-scroll " : '') + (adminModel.panelProperties.panelCollapsed ? ' height-0 ' : '')}>
                    <div className="sendReminderPD" >

                        {
                            <EmailNotificationComponent
                                currentDate={this.currentDate}
                                onChangeDateTime={(newTime, type) => this.onChangeDateTime(newTime, type)}
                                uploadCSV={(e) => this.uplaodCSV(e)}
                                includeCancelledRegistration={(e) => this.includeCancelledRegistration(e)}
                                sendImmediately={(e) => this.sendImmediately(e)}
                                sendUponRegistration={(e) => this.sendUponRegistration(e)}
                                sendUponCancellation={(e) => this.sendUponCancellation(e)}
                                onChangeOnlyCSV={(e) => this.onChangeOnlyCSV(e)}
                                resetAll={() => { this.resetAll() }}
                                listEmailNotification={() => { this.listEmailNotification() }}
                                onRef={ref => (this.child = ref)} />
                        }

                        {adminModel.panelProperties.panelReload ? <div className="panel-loader"><span className="spinner-small"></span></div> : ''}
                    </div>
                    <div className="notification-list">
                        <div className="notification_grid_row row notification_grid_header">
                            {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 notificatin_list_sno">
                                <h5>S.No.</h5>
                            </div> */}
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 notificatin_list_row">
                                <h5>Notification</h5>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 notificatin_list_row">
                                <h5>Schedule Date</h5>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 notificatin_list_row">
                                <h5>Status</h5>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 notificatin_list_row">
                                <h5>Action</h5>
                            </div>
                        </div>
                        {this.props.model.paginationObject && this.props.model.paginationObject.itemList.length > 0 ? this.props.model.paginationObject.itemList.map((notification, index) =>

                            <div className="notification_grid_row row " key={"row_" + index}>
                                {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 notificatin_list_sno">
                                    {(this.props.model.paginationObject.activePage - 1) * this.props.model.paginationObject.itemsCountPerPage + index + 1}
                                </div> */}
                                <div className="pad-bot-7 break-word pad-top-6 ccol-lg-3 col-md-3 col-sm-3 col-xs-3  notificatin_list_row">
                                    <a className="select_notification" onClick={() => { this.getEmailNotification(notification.id); notification.isUpdate = true; }}>   {notification.notification_name} </a>
                                </div>
                                <div className="pad-bot-7  pad-top-6 col-lg-3 col-md-3 col-sm-3 col-xs-3  notificatin_list_row">

                                    {notification.send_on_registration ? "On Registration" : notification.send_upon_cancellation ? "Upon Cancellation" : notification.send_at}
                                </div>
                                <div className={"pad-bot-3 col-lg-3 col-md-3 col-sm-3 col-xs-3  notificatin_list_row"}>
                                    {notification.send_upon_cancellation || notification.send_on_registration || !notification.is_active || !notification.send_now && !notification.isSent ?
                                        <span className={notification.is_active ? 'toggle-button toggle-on' : 'toggle-button toggle-off'}>

                                            <ToggleButton key={'tb_' + index} value={notification.is_active} onToggle={(e) => this.onToggleNotification(notification)} />

                                        </span> : "notification sent"}
                                </div>
                                <div className="pad-bot-7  pad-top-6 col-lg-3 col-md-3 col-sm-3 col-xs-3  notificatin_list_row">
                                    {!notification.send_on_registration && !notification.send_upon_cancellation ? <span> <a className="select_notification" onClick={() => { this.fetchUsers(notification.id); }}>   {Constants.action.viewUsers} </a><span>{Constants.symbol.dash}</span></span> : null}
                                    <a className="select_notification" onClick={() => { this.deleteEmailNotification(notification.id, notification.notification_name); }}>   {Constants.action.delete} </a>

                                </div>

                            </div>

                        ) : null}
                        {this.props.model.paginationObject ? <Pagination
                            firstPageText={<i className='glyphicon glyphicon-chevron-left' />}
                            lastPageText={<i className='glyphicon glyphicon-chevron-right' />}
                            prevPageText={<i className='glyphicon glyphicon-menu-left' />}
                            nextPageText={<i className='glyphicon glyphicon-menu-right' />}
                            activePage={this.props.model.paginationObject.activePage}
                            itemsCountPerPage={this.props.model.paginationObject.itemsCountPerPage}
                            totalItemsCount={this.props.model.paginationObject.totalItemsCount}
                            pageRangeDisplayed={this.props.model.paginationObject.pageRangeDisplayed}
                            onChange={(e) => { this.handlePageChange(e) }}
                        /> : null}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        model: state.adminModel,
        countsModel: state.countsModel,
        sharedModel: state.sharedModel
    }
}

export default connect(mapStateToProps)(ManageEmail);
