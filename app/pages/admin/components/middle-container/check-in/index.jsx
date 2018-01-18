import React from "react";
import { connect } from 'react-redux';
import { DashboardService } from '../../../../dashboard/services/dashboard.services';
import { adminActionTypes } from "../../../actions/adminActionTypes";
import { CheckInActionTypes } from "../../../actions/checkInActionTypes";
import { AdminCMSService } from '../../../services/admin-cms.service';
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";
import { CommonService } from '../../../../shared/services/common.service';
import * as Action from "../../../../shared/actions/action";
import { Utility } from "../../../../../common/utility/";
import Select from "react-select";
import ToolBoxControl from "../../../../shared/controls/tool-box-control/";
import { Constants } from "../../../../../common/app-settings/constants";
import RefreshTimeLogger from "../../controls/refresh-time-logger/";
import { menuRenderer } from "../../../../shared/controls/menu-renderer/";
import CheckInBoroughsSitesFilter from "./boroughs-sites-filter";
import CreateCanvasserModal from "./create-canvasser";
import Volunteer from "./volunteer"
import { AuthorizationRules } from "../../../../shared/services/authorization.rules";
import Pagination from "react-js-pagination";

const canvasser_add_btn = require("../../../../../assets/img/add_canvasser.png");
const a2z = require("../../../../../assets/img/a2z.png");
const z2a = require("../../../../../assets/img/z2a.png");



import moment from 'moment';
/**
 * component to send reminder emails to site members.
 */
class CheckIn extends React.Component {
    /**
     * Constructor to initialize fields.
     */
    constructor(props) {
        super(props)
        this.isSFOUser = false;
        this.searchFor = this.searchFor.bind(this);
        this.fetchBoroughsAndSites = this.fetchBoroughsAndSites.bind(this);
        this.onBoroughChange = this.onBoroughChange.bind(this);
        this.onSiteChange = this.onSiteChange.bind(this);
        this.fetchVolunteers = this.fetchVolunteers.bind(this);
        this.goToPage = this.goToPage.bind(this);
        this.onRangeChange = this.onRangeChange.bind(this);
        this.onVolunteerChange = this.onVolunteerChange.bind(this);
        this.onKeywordSearchClear = this.onKeywordSearchClear.bind(this);
        this.onOpenDialog = this.onOpenDialog.bind(this);
        this.onAddUpdateDeleteCanvasser = this.onAddUpdateDeleteCanvasser.bind(this);
        this.returnFilteredVolunteers = this.returnFilteredVolunteers.bind(this);
        this.sortBy = this.sortBy.bind(this);
        this.getAdminSite = this.getAdminSite.bind(this);
        this.timeOut = null;
        this.addClass ={
            
        }
    }

    componentWillMount() {

    }

    /**
   * Lifecycle method to be called when component did mount.
   * Initializes the fields and fetch boroughs and sites for dropdowns.
   */
    componentDidMount() {
        this.isSFOUser = CommonService.isSFOUser();
        this.boroughsOptions = null;
        this.fetchBoroughsAndSites();

    }
    onOpenDialog() {
        this.fetchTeams()

    }

    getAdminSite() {
        let currentUserSites = AuthorizationRules.getCurrentUserSiteNames();
        if (currentUserSites) {
            let sites = this.props.checkInModel.filterModel.sites.filter((m) => (currentUserSites.indexOf(m.siteName.replace(/ /g, '').toLowerCase()) > -1));
            this.props.dispatch(Action.getAction(CheckInActionTypes.SET_ADMIN_SITE, { isSuperAdmin: false, sites: sites }));
        }else{
            this.props.dispatch(Action.getAction(CheckInActionTypes.SET_ADMIN_SITE, {isSuperAdmin:true,sites:[]}));
        }
    }
    // on closing the dialog
    onCancelDialog() {
        this.props.dispatch(Action.getAction(CheckInActionTypes.OPEN_CANVASSER_DIALOG, { IsOpen: false }));
        this.props.dispatch(Action.getAction(CheckInActionTypes.SHOW_VALIDATION_MESSAGE, { validationMessage: Constants.emptyString }));
    }
    // show hide loader on popup
    showHideLoader(flag) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_POPUPLOADER_TOGGLE, flag));
    }
    onAddUpdateDeleteCanvasser(canvasser) {
        this.showHideLoader(true);
        AdminCMSService.checkUserExists(canvasser.email).then(exists => {
            if (!exists) {
                AdminCMSService.addCanvasser(canvasser, this.props.checkInModel.filterModel.selectedSite.siteId, canvasser.teamId, this.props.sharedModel.selectedQCInstances).then((response) => {
                    if (response.data.createAssignment && response.data.createAssignment.id > 0) {
                        canvasser.id = response.data.createAssignment.id;
                        canvasser.name = canvasser.firstName + ' ' + canvasser.lastName;
                        canvasser.site = this.props.checkInModel.filterModel.selectedSite;
                        canvasser.status = this.props.checkInModel.status[1];
                        canvasser.registration_status = "registered";
                        this.props.dispatch(Action.getAction(CheckInActionTypes.SET_SELECTED_TEAM_FOR_CONVESSER, { value: null }));
                        this.props.dispatch(Action.getAction(CheckInActionTypes.SET_CONVESSER_TYPE, { value: { id: 4, label: 'None', isSelected: true } }));
                        let items = this.props.checkInModel.filteredVolunteer;
                        items.push(canvasser)
                        this.props.dispatch(Action.getAction(CheckInActionTypes.FILTERED_VOLUNTEER, items));
                        // Make a new timeout set to go off in 800ms
                        this.timeOut = setTimeout(() => { this.handlePageChange(1); }, 300);
                        this.props.dispatch(Action.getAction(CheckInActionTypes.ADD_SINGLE_VOLUNTEER, canvasser));

                        this.showMessage(Utility.stringFormat(Constants.messages.createEditCanvasser.canvasserAdded, canvasser.firstName + " " + canvasser.lastName), Constants.validation.types.success.key);
                        this.onCancelDialog();
                        this.showHideLoader(false);

                    } else {
                        this.showHideLoader(false);
                        this.showMessage(Constants.messages.commonMessages.someErrorOccured, Constants.validation.types.error.key);
                    }
                }).catch((err) => {

                    this.showHideLoader(false);
                    this.showMessage(err.message, Constants.validation.types.error.key)
                });
            }
            else {
                this.showHideLoader(false);
                this.showMessage(Constants.messages.createEditCanvasser.emailIdAlreadyExists, Constants.validation.types.error.key);
            }
        }).catch((err) => {
            this.showHideLoader(false);
            this.showMessage(err.message, Constants.validation.types.error.key)
        });
    }
    fetchVolunteers() {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
        return CommonService.getVolunteers(this.props.sharedModel.selectedQCInstances).then(mappedData => {
            if (mappedData.status == 200) {

                mappedData.users && mappedData.users.length > 0 && this.props.dispatch(Action.getAction(CheckInActionTypes.SET_VOLUNTEERS, mappedData.users))
                let paginationObj;
                this.props.checkInModel.volunteers.length > 0 ?
                    paginationObj = {
                        activePage: 1,
                        itemsCountPerPage: 10,
                        pageRangeDisplayed: 5,
                        itemList: this.props.checkInModel.volunteers.slice(0, 10),
                        totalItemsCount: this.props.checkInModel.volunteers.length
                    } : null
                paginationObj && this.props.dispatch(Action.getAction(CheckInActionTypes.SET_PAGINATION_OBJECT, paginationObj));
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                return true;
            }

        })
            .catch((error) => {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                this.showMessage(Constants.messages.commonMessages.someErrorOccured, Constants.validation.types.error.key);
                return false;
            });
    }

    // reload all teams
    fetchTeams() {
        let selecetdSite = this.props.checkInModel.filterModel.selectedSite;
        if (!selecetdSite || selecetdSite.siteId == -1) {
            this.showMessage(Constants.messages.selectSite, Constants.validation.types.error);
            return;
        }
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
        return AdminCMSService.getTeamsForSelectedSite(this.props.checkInModel.filterModel.selectedSite, this.props.sharedModel.selectedQCInstances).then(mappedData => {
            this.props.dispatch(Action.getAction(CheckInActionTypes.SET_TEAMS_SEARCHED, mappedData.site[0].team));
            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
            this.props.dispatch(Action.getAction(CheckInActionTypes.OPEN_CANVASSER_DIALOG, { IsOpen: true }));
            return true;
        }).catch((error) => {
            //Show validation error on any error response from service.
            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
            this.showMessage(error.message, Constants.validation.types.error);
            return false;
        });
    }
    onKeywordSearchClear() {
        this.props.dispatch(Action.getAction(CheckInActionTypes.SET_SEARCH, { value: Constants.emptyString }));
        this.props.dispatch(Action.getAction(CheckInActionTypes.FILTERED_VOLUNTEER, null));

        this.timeOut && clearTimeout(this.timeOut);
        this.timeOut = setTimeout(() => {
            this.onBoroughChange(this.props.checkInModel.filterModel.selectedBorough);
            this.onSiteChange(this.props.checkInModel.filterModel.selectedSite);
        }, 300);
    }
    searchFor(event) {
        event.preventDefault()
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
        this.props.dispatch(Action.getAction(CheckInActionTypes.SET_SEARCH, { value: event.target.value }));

        this.timeOut && clearTimeout(this.timeOut);
        let items = [];
        let { checkInModel } = this.props;
        let userList = checkInModel.volunteers;
        // Make a new timeout set to go off in 800ms
        this.timeOut = setTimeout(() => {
            try {
                // let filteredVolunteer = this.props.checkInModel.filteredVolunteer;
                //   let userList = filteredVolunteer ? filteredVolunteer : this.props.checkInModel.volunteers;
                let searchEle = this.props.checkInModel.searchElement;
                if (searchEle && searchEle != '') {
                    userList.forEach((v) => {
                        if (v.name && v.name.toLowerCase().indexOf(searchEle) != -1 || v.email && v.email.toLowerCase().indexOf(searchEle) != -1) {
                            items.push(v)
                        }
                    })
                    if (checkInModel.filterModel.selectedBorough.boroughId == -1 && checkInModel.filterModel.selectedSite.siteId == -1)
                        this.props.dispatch(Action.getAction(CheckInActionTypes.FILTERED_VOLUNTEER, items));
                    else {
                        this.returnFilteredVolunteers(searchEle);
                    }
                } else {
                    if (checkInModel.filterModel.selectedBorough.boroughId == -1 && checkInModel.filterModel.selectedSite.siteId == -1)
                        this.props.dispatch(Action.getAction(CheckInActionTypes.FILTERED_VOLUNTEER, null));
                    else {
                        this.returnFilteredVolunteers(searchEle);
                    }
                }
                this.handlePageChange(1);
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));

            } catch (e) {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                console.log("error in search", e)
            }

        }, 1000);

    }
    returnFilteredVolunteers(searchEle) {
        this.timeOut && clearTimeout(this.timeOut);
        let { adminModel, checkInModel } = this.props;
        let selectedBoroughValue = checkInModel.filterModel.selectedBorough;
        let value = checkInModel.filterModel.selectedSite;
        let items = [];
        if (selectedBoroughValue.boroughId == -1) {
            if (value && value.siteId == -1) {
                items = null;
            } else {

                checkInModel.volunteers.forEach((v) => {
                    if (value.siteId == v.site.siteId) {
                        items.push(v)
                    }
                })

            }
        } else {
            if (value && value.siteId == -1) {

                let selectedBoroughValue = checkInModel.filterModel.selectedBorough;
                let sites = [];
                let allSites = checkInModel.filterModel.sites;
                sites = allSites.filter((s) => s.siteId == -1 || s.boroughId == selectedBoroughValue.boroughId);
                checkInModel.volunteers.forEach((v) => {
                    let isExist = false;
                    sites.forEach((s) => {
                        if (s.siteId == v.site.siteId) {
                            isExist = true;
                        }
                    })
                    if (isExist) {
                        items.push(v)
                    }
                })

            }
            else if (value) {

                this.props.checkInModel.volunteers.forEach((v) => {
                    if (value.siteId == v.site.siteId) {
                        items.push(v)
                    }
                })

            }

        }
        if (searchEle) {
            items = items.filter((v) =>
                v.name && v.name.toLowerCase().indexOf(searchEle) != -1 || v.email && v.email.toLowerCase().indexOf(searchEle) != -1
            )
        }
        this.props.dispatch(Action.getAction(CheckInActionTypes.FILTERED_VOLUNTEER, items));
        // Make a new timeout set to go off in 800ms
        this.timeOut = setTimeout(() => { this.handlePageChange(1); }, 300);
    }

    sortBy(order) {
        this.props.dispatch(Action.getAction(CheckInActionTypes.CHANGE_ORDER, order));
        let key = order.by+order.order;
        this.addClass = {};
        this.addClass[key]=true;
        
        this.timeOut && clearTimeout(this.timeOut);
        this.timeOut = setTimeout(() => {
            this.handlePageChange(1);
        }, 300);

    }
    onVolunteerChange(obj) {
        Utility.showConfirm(obj.message, () => {
            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
            delete obj.message;
            obj.count_instance_id = this.props.sharedModel.selectedQCInstances[0];
            if (obj.status) {
                if (obj.status == Constants.canvasserCheckedIn.checkedIn) {
                    obj.status = Constants.routesStatus.in_progress;
                }
                else if (obj.status == Constants.canvasserCheckedIn.checkedOut) {
                    obj.status = Constants.routesStatus.completed
                } else {
                    obj.status = Constants.routesStatus.not_started
                }
            }

            CommonService.updateVolunteer(obj).then(response => {
                if (response.status == 200) {
                    this.props.dispatch(Action.getAction(CheckInActionTypes.UPDATE_VOLUNTEER, obj));
                } else {
                    this.showMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
                }
                let checkInModel =this.props.checkInModel;
                if (checkInModel.filteredVolunteer && checkInModel.filteredVolunteer.length > 0 && !obj.status && checkInModel.filterModel.selectedSite.siteId != -1) {
                    let items = [];
                    items = this.props.checkInModel.filteredVolunteer.filter(u => u.id != obj.id)
                    this.props.dispatch(Action.getAction(CheckInActionTypes.FILTERED_VOLUNTEER, items));
                    this.timeOut = setTimeout(() => {
                        this.handlePageChange(this.props.checkInModel.paginationObject.activePage)
                    }, 300);
                }else
                this.handlePageChange(this.props.checkInModel.paginationObject.activePage)
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                //change site for captain if status changed to checkd in
                if (!checkInModel.adminSite.isSuperAdmin && obj.status && obj.value.id == 1) {
                    let site = this.props.checkInModel.adminSite.sites[0];
                    obj.status = null;
                    obj.site_id = site.siteId;
                    obj.value = site;
                    this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
                    CommonService.updateVolunteer(obj).then(response => {
                        if (response.status == 200) {
                            this.props.dispatch(Action.getAction(CheckInActionTypes.UPDATE_VOLUNTEER, obj));
                        } else {
                            this.showMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
                        }
                        if (checkInModel.filteredVolunteer && checkInModel.filteredVolunteer.length > 0 && !obj.status && checkInModel.filterModel.selectedSite.siteId != -1) {
                            let items = [];
                            items =   checkInModel.filteredVolunteer.filter(u => u.id != obj.id)
                            this.props.dispatch(Action.getAction(CheckInActionTypes.FILTERED_VOLUNTEER, items));
                            this.timeOut = setTimeout(() => {
                                this.handlePageChange(checkInModel.paginationObject.activePage)
                            }, 300);
                        }else
                        this.handlePageChange(checkInModel.paginationObject.activePage)
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                    }).catch(error => {
                        console.log("Error in onVolunteerChange==>", error)
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                        this.showMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
                    });
                }
            }).catch(error => {
                console.log("Error in onVolunteerChange==>", error)
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                this.showMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message));
            });
        }, () => {
            this.showMessage(Constants.emptyString, Constants.validation.types.error.key)
        },
            this.props.dispatch,
            {})
    }
    goToPage(event) {
        event.preventDefault();
        let paginationObj = this.props.checkInModel.paginationObject;
        if (isNaN(event.target.value)) {
            this.props.dispatch(Action.getAction(CheckInActionTypes.SET_PAGINATION_OBJECT, paginationObj));
        } else {
            this.handlePageChange(event.target.value)
        }
    }
    onWindowResize() {
        Utility.onWindowResize();
    }
    handlePageChange(pageNo) {
        pageNo = parseInt(pageNo);
        let filteredVolunteer = this.props.checkInModel.filteredVolunteer;
        let userList = filteredVolunteer ? filteredVolunteer : this.props.checkInModel.volunteers;
        let firstIndex = (pageNo - 1) * this.props.checkInModel.paginationObject.itemsCountPerPage;
        let lastIndex = firstIndex + this.props.checkInModel.paginationObject.itemsCountPerPage;
        let oldPaginationObject = this.props.checkInModel.paginationObject;
        if (userList.length < lastIndex) {
            lastIndex = this.props.checkInModel.volunteers.length;
        }
        let paginationObj = {
            itemsCountPerPage: oldPaginationObject.itemsCountPerPage,
            totalItemsCount: userList.length,
            pageRangeDisplayed: oldPaginationObject.pageRangeDisplayed,
            activePage: pageNo,
            itemList: userList.slice(firstIndex, lastIndex),
        }
        this.props.dispatch(Action.getAction(CheckInActionTypes.SET_PAGINATION_OBJECT, paginationObj));
    }

    onRangeChange(range) {

        let paginationObj = this.props.checkInModel.paginationObject;
        paginationObj.itemsCountPerPage = range.range;
        this.props.dispatch(Action.getAction(CheckInActionTypes.SET_RANGE, range));
        if (range.range * paginationObj.activePage < paginationObj.totalItemsCount)
            this.handlePageChange(paginationObj.activePage)
        else {
            this.handlePageChange(1)
        }
    }

    /**
    * Calls graphQL to fetch boroguhs and associated sites.
    */
    fetchBoroughsAndSites() {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));

        DashboardService.getActiveCountInstance().then(mappedData => {
            this.props.dispatch(Action.getAction(sharedActionTypes.SET_ACTIVE_COUNT_INSTANCE, mappedData));

            if (this.props.sharedModel.selectedQCInstances.length > 0) {

                AdminCMSService.getBoroughsAndSites(this.props.sharedModel.selectedQCInstances)
                    .then(response => {
                        this.props.dispatch(Action.getAction(CheckInActionTypes.SET_BOROUGHS_AND_SITES, response));
                        this.props.dispatch(Action.getAction(sharedActionTypes.SET_COUNT_INSTANCE_STATUS, response.countInstanceStatus));
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                        this.fetchVolunteers();
                        this.getAdminSite();
                    }
                    )
                    .catch((error) => {
                        //Show validation error on any error response from service.
                        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                        this.showMessage(error.message, Constants.validation.types.error);
                    });

            } else {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                this.showMessage(Utility.stringFormat(Constants.messages.countsModel.noActiveCountInstanceFound), Constants.validation.types.error);

            }

        }).catch(error => {
            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
            this.showMessage(Utility.stringFormat(Constants.messages.commonMessages.exceptionOnPageLoad, error.message), Constants.validation.types.error);
        });

    }
    /**
    * Function called when Site selecte change event fired. Shows the loader and fetches teams for the selected site from GraphQL.
    */
    onSiteChange(value) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_SITE, { value: value, showLoader: false }));
        this.props.dispatch(Action.getAction(CheckInActionTypes.SET_SEARCH, { value: Constants.emptyString }));
        this.timeOut && clearTimeout(this.timeOut);
        let { adminModel, checkInModel } = this.props;
        let selectedBoroughValue = checkInModel.filterModel.selectedBorough;
        let items = [];
        if (selectedBoroughValue.boroughId == -1) {
            if (value && value.siteId == -1) {
                this.props.dispatch(Action.getAction(CheckInActionTypes.FILTERED_VOLUNTEER, null));
                this.timeOut = setTimeout(() => { this.handlePageChange(1); }, 300);
            } else {

                this.props.checkInModel.volunteers.forEach((v) => {
                    if (value.siteId == v.site.siteId) {
                        items.push(v)
                    }
                })
                this.props.dispatch(Action.getAction(CheckInActionTypes.FILTERED_VOLUNTEER, items));
                // Make a new timeout set to go off in 800ms
                this.timeOut = setTimeout(() => { this.handlePageChange(1); }, 300);
            }
        } else {
            if (value && value.siteId == -1) {

                let selectedBoroughValue = checkInModel.filterModel.selectedBorough;
                let sites = [];
                let allSites = checkInModel.filterModel.sites;
                sites = allSites.filter((s) => s.siteId == -1 || s.boroughId == selectedBoroughValue.boroughId);
                this.props.checkInModel.volunteers.forEach((v) => {
                    let isExist = false;
                    sites.forEach((s) => {
                        if (s.siteId == v.site.siteId) {
                            isExist = true;
                        }
                    })
                    if (isExist) {
                        items.push(v)
                    }
                })
                this.props.dispatch(Action.getAction(CheckInActionTypes.FILTERED_VOLUNTEER, items));
                // Make a new timeout set to go off in 800ms
                this.timeOut = setTimeout(() => { this.handlePageChange(1); }, 300);
            }
            else if (value) {

                this.props.checkInModel.volunteers.forEach((v) => {
                    if (value.siteId == v.site.siteId) {
                        items.push(v)
                    }
                })
                this.props.dispatch(Action.getAction(CheckInActionTypes.FILTERED_VOLUNTEER, items));
                // Make a new timeout set to go off in 800ms
                this.timeOut = setTimeout(() => { this.handlePageChange(1); }, 300);

            }
        }

        //this.fetchTeams(value, true);
    }
    /**
        * Function called when Borough select change event is fired to set the borough as selecetd value and site as null.
        */
    onBoroughChange(value) {
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, true));
        this.props.dispatch(Action.getAction(CheckInActionTypes.SET_SEARCH, { value: Constants.emptyString }));
        this.props.dispatch(Action.getAction(CheckInActionTypes.SET_BOROUGH, { value: value }));
        this.timeOut && clearTimeout(this.timeOut);
        if (value && value.boroughId == -1) {
            this.props.dispatch(Action.getAction(CheckInActionTypes.FILTERED_VOLUNTEER, null));
            this.timeOut = setTimeout(() => { this.handlePageChange(1); }, 300);
        } else {
            let { adminModel, checkInModel } = this.props;
            let selectedBoroughValue = value;
            let sites = [];
            let items = [];
            let allSites = checkInModel.filterModel.sites;
            sites = allSites.filter((s) => s.siteId == -1 || s.boroughId == selectedBoroughValue.boroughId);
            this.props.checkInModel.volunteers.forEach((v) => {
                let isExist = false;
                sites.forEach((s) => {
                    if (s.siteId == v.site.siteId) {
                        isExist = true;
                    }
                })
                if (isExist) {
                    items.push(v)
                }
            })
            this.props.dispatch(Action.getAction(CheckInActionTypes.FILTERED_VOLUNTEER, items));

            // Make a new timeout set to go off in 800ms
            this.timeOut = setTimeout(() => { this.handlePageChange(1); }, 300);

        }
        this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
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


    render() {
        let { adminModel, checkInModel } = this.props;
        let boroughs = checkInModel.filterModel.boroughs;
        this.boroughsOptions = boroughs;
        let selectedBoroughValue = checkInModel.filterModel.selectedBorough;
        let sites = null;
        let allSites = checkInModel.filterModel.sites;
        if (selectedBoroughValue)
            sites = selectedBoroughValue.boroughId == -1 ? allSites : allSites.filter((s) => s.siteId == -1 || s.boroughId == selectedBoroughValue.boroughId);;
        let selectedSiteValue = checkInModel.filterModel.selectedSite;
        let status = checkInModel.status;
        allSites = allSites.filter(s => s.siteName != "All");
        let totalPage = checkInModel.paginationObject.totalItemsCount / checkInModel.paginationObject.itemsCountPerPage;
        totalPage > 1 ? totalPage = Math.ceil(totalPage) : totalPage = 1
        let filteredVolunteer = this.props.checkInModel.filteredVolunteer;
        let userList = filteredVolunteer ? filteredVolunteer : this.props.checkInModel.volunteers;
        let searchKeyword = checkInModel.searchElement;
        console.log("props", checkInModel)
        return (
            <div className={'panel panel-inverse ' + (adminModel.panelProperties.panelExpanded ? " panel-expand " : "")}  >
                <div className="panel-heading">
                    <ToolBoxControl dataModel={adminModel.panelProperties}
                        onExpand={() => {
                            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_EXPAND_ADMIN, {}));
                            this.onWindowResize();
                        }}
                        onReload={() => {
                            this.fetchBoroughsAndSites();
                            // this.fetchVolunteers();
                        }}
                        onCollapse={() => {
                            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_COLLAPSE_ADMIN, {}));
                            this.onWindowResize();
                        }}
                        onRemove={() => {
                            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_REMOVE_ADMIN, {}));
                        }}
                    />
                    <h5 className="panel-title"><panel>Check In - (Volunteers)</panel>
                    </h5>
                </div>


                <div className={"panel-body " + (adminModel.panelProperties.panelExpanded ? " custom-scroll " : '') + (adminModel.panelProperties.panelCollapsed ? ' height-0 ' : '')}>
                    <div className="checkin-filters row">
                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                            <input type="text" value={checkInModel.searchElement} onChange={(e) => { this.searchFor(e) }} placeholder="Search for user name or email" className="form-control" />
                            <i className={(searchKeyword && searchKeyword.length) ? "displaynone" : "fa fa-search search_ele"} aria-hidden="true"></i>
                            {(searchKeyword && searchKeyword.length) ? <span className="clear_zone_checkin" title="Clear value" onClick={this.onKeywordSearchClear} ><span className="clear-button">×</span></span> : ''}
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                            <img title="Add new canvasser" src={canvasser_add_btn} alt="" className="open-team-add-button" onClick={() => { checkInModel.filterModel.selectedSite ? this.onOpenDialog() : '' }} disabled={!selectedSiteValue || selectedSiteValue.siteId == -1} />

                        </div >
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <CheckInBoroughsSitesFilter IsSFUser={this.isSFOUser} SelectedBoroughValue={selectedBoroughValue} MenuRenderer={menuRenderer}
                                OnBoroughChange={this.onBoroughChange} BoroughsOptions={this.boroughsOptions} Sites={sites} SelectedBoroughValue={selectedBoroughValue}
                                SelectedSiteValue={selectedSiteValue} OnSiteChange={this.onSiteChange}
                                SitesOptions={sites}
                            />
                        </div>


                    </div>
                    {adminModel.panelProperties.panelReload ? <div className="panel-loader"><span className="spinner-small"></span></div> : null}

                    <div className="checkIn-user-list">
                        <div className="checkIn_row row">
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                                < span className="checkin-info">
                                    Total Volunteers:
                                    <label className="space_left">
                                        {userList.length}
                                    </label>
                                </span>
                                < span className="checkin-info">
                                    Checked In:
                                    <label className="space_left">
                                        {userList.filter((v => v.status && v.status.name == Constants.canvasserCheckedIn.checkedIn)).length}
                                    </label>
                                </span>
                                < span className="checkin-info">
                                    Checked Out:
                                    <label className="space_left">
                                        {userList.filter((v => v.status && v.status.name == Constants.canvasserCheckedIn.checkedOut)).length}
                                    </label>
                                </span>
                            </div>
                        </div>
                        <div className="ceckin-grid-row row ceckin-grid-header">
                            {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 notificatin_list_sno">
                                <h5>S.No.</h5>
                            </div> */}
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12 notificatin_list_row">
                                <h5>Name
                                <img src={a2z} alt="" className={this.addClass.namea2z?"checkin-order-img sort_active":"checkin-order-img"} onClick={() => this.sortBy({ by: "name", order: "a2z" })} disabled={!(checkInModel.paginationObject.itemList && checkInModel.paginationObject.itemList.length > 0)} />
                                    <img src={z2a} alt="" className={this.addClass.namez2a?"checkin-order-img sort_active":"checkin-order-img"} onClick={() => this.sortBy({ by: "name", order: "z2a" })} disabled={!(checkInModel.paginationObject.itemList && checkInModel.paginationObject.itemList.length > 0)} />

                                </h5>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 notificatin_list_row">
                                <h5>Email
                                <img src={a2z} alt="" className={this.addClass.emaila2z?"checkin-order-img sort_active":"checkin-order-img"} onClick={() => this.sortBy({ by: "email", order: "a2z" })} disabled={!(checkInModel.paginationObject.itemList && checkInModel.paginationObject.itemList.length > 0)} />
                                    <img src={z2a} alt="" className={this.addClass.emailz2a?"checkin-order-img sort_active":"checkin-order-img"} onClick={() => this.sortBy({ by: "email", order: "z2a" })} disabled={!(checkInModel.paginationObject.itemList && checkInModel.paginationObject.itemList.length > 0)} />

                                </h5>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 notificatin_list_row">
                                <h5>Status

                                <img src={a2z} alt="" className={this.addClass.statusa2z?"checkin-order-img sort_active":"checkin-order-img"} onClick={() => this.sortBy({ by: "status", order: "a2z" })} disabled={!(checkInModel.paginationObject.itemList && checkInModel.paginationObject.itemList.length > 0)} />
                                    <img src={z2a} alt="" className={this.addClass.statusz2a?"checkin-order-img sort_active":"checkin-order-img"} onClick={() => this.sortBy({ by: "status", order: "z2a" })} disabled={!(checkInModel.paginationObject.itemList && checkInModel.paginationObject.itemList.length > 0)} />

                                </h5>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 notificatin_list_row">
                                <h5>Site
                                <img src={a2z} alt="" className={this.addClass.sitea2z?"checkin-order-img sort_active":"checkin-order-img"} onClick={() => this.sortBy({ by: "site", order: "a2z" })} disabled={!(checkInModel.paginationObject.itemList && checkInModel.paginationObject.itemList.length > 0)} />
                                <img src={z2a} alt="" className={this.addClass.sitez2a?"checkin-order-img sort_active":"checkin-order-img"} onClick={() => this.sortBy({ by: "site", order: "z2a" })} disabled={!(checkInModel.paginationObject.itemList && checkInModel.paginationObject.itemList.length > 0)} />

                                </h5>
                            </div>
                        </div>
                        {checkInModel.paginationObject.itemList && checkInModel.paginationObject.itemList.length > 0 ? checkInModel.paginationObject.itemList.map((volunteer, index) =>

                            <Volunteer onVolunteerChange={(obj) => this.onVolunteerChange(obj)} adminSite={this.props.checkInModel.adminSite} key={index} volunteer={volunteer} status={status} sites={allSites} index={index} />

                        ) : <div className="ceckin-grid-row  row no_record">No Record Found</div>}

                        {checkInModel.paginationObject.totalItemsCount > 10 ? <div className="ceckin-grid-row  row ">
                            <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 notificatin_list_row filter_row_bt">
                                <div className="checkin_left_div">


                                    <Select value={checkInModel.selectedRange} valueKey="id" labelKey="range" searchable={false} clearable={false}
                                        menuRenderer={menuRenderer} name="form-field-name" onChange={this.onRangeChange}
                                        options={checkInModel.range} />
                                </div>
                                <div className="checkin_rgt_div">Volunteers per page</div>

                            </div>
                            <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 notificatin_list_row filter_row_bt">
                                <div className="checkin_left_div">
                                    <input className="check_in_input form-control" disabled={!totalPage || totalPage < 1} type="text" value={isNaN(checkInModel.paginationObject.activePage) ? '' : checkInModel.paginationObject.activePage} onChange={(e) => { this.goToPage(e) }} placeholder="Enter specific page no" />
                                </div>
                                <div className="checkin_rgt_div"> Go to page out of {totalPage}
                                </div>

                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 notificatin_list_row">
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 notificatin_list_row float_right_ul">
                                <Pagination
                                    firstPageText={<i className='glyphicon glyphicon-chevron-left' />}
                                    lastPageText={<i className='glyphicon glyphicon-chevron-right' />}
                                    prevPageText={<i className='glyphicon glyphicon-menu-left' />}
                                    nextPageText={<i className='glyphicon glyphicon-menu-right' />}
                                    activePage={checkInModel.paginationObject.activePage}
                                    itemsCountPerPage={checkInModel.paginationObject.itemsCountPerPage}
                                    totalItemsCount={checkInModel.paginationObject.totalItemsCount}
                                    pageRangeDisplayed={checkInModel.paginationObject.pageRangeDisplayed}
                                    onChange={(e) => { this.handlePageChange(e) }}
                                />
                            </div>

                        </div> : null
                        }

                    </div>
                </div >
                {checkInModel.createCanvasserModalIsOpened && checkInModel.createCanvasserModalIsOpened.IsOpen
                    ? <CreateCanvasserModal
                        isOpen={checkInModel.createCanvasserModalIsOpened.IsOpen}
                        loader={checkInModel.popupLoaderShown}
                        data={null}
                        dispatch={this.props.dispatch}
                        model={{ convesserType: checkInModel.convesserType, selectedTeamForConvesser: checkInModel.selectedTeamForConvesser, searchedTeams: checkInModel.searchedTeams, validation: checkInModel.validation }}
                        onDelete={(e) => this.onCancelDialog(e)}
                        onCancel={(e) => this.onCancelDialog(e)}
                        onAddUpdateDeleteCanvasser={(newCanvasser) => this.onAddUpdateDeleteCanvasser(newCanvasser)} />
                    : null}
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        adminModel: state.adminModel,
        checkInModel: state.checkInModel,
        sharedModel: state.sharedModel
    }
}

export default connect(mapStateToProps)(CheckIn);
