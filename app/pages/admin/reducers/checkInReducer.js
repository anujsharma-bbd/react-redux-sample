import { CheckInActionTypes } from "../actions/checkInActionTypes.jsx";
import { CheckInState } from "../state/checkInState";
import { Utility } from "../../../common/utility/index.jsx";
import { Constants } from "../../../common/app-settings/constants";
import { AuthorizationRules } from "../../shared/services/authorization.rules";

export default (state = CheckInState, action) => {

    let stateCopy = {};
    /**
     * Creates a copy of the state on which actions will be performed.
     */
    if (CheckInActionTypes[action.type]) {
        stateCopy = JSON.parse(JSON.stringify(state));
    }

    switch (action.type) {
        case CheckInActionTypes.SET_BOROUGHS_AND_SITES:
            /**
             * sets boroughs and sites fetched from graphQL.
             */
            {
                let data = action.payload;
                if (data != null && data.zone && data.zone.length > 0) {
                    stateCopy.filterModel.boroughs = [Constants.intialValueOfBorough];
                    stateCopy.filterModel.sites = [Constants.intialValueOfSite];
                    data.zone.forEach((borough) => {
                        stateCopy.filterModel.boroughs.push({ boroughId: borough.id, boroughName: borough.name });
                        if (borough.site != null && borough.site.length > 0) {
                            borough.site.forEach(site => {
                                stateCopy.filterModel.sites.push({ boroughId: borough.id, siteId: site.id, siteName: site.name });
                            })
                        }
                    })
                    stateCopy.filterModel.sites.sort((a, b) => {
                        return (a.siteName.trim() < b.siteName.trim() ? -1 : (a.siteName.trim() > b.siteName.trim() ? 1 : 0));
                    });
                }

                // let currentUserBoroughs = AuthorizationRules.getCurrentUserBoroughNames();
                // if (currentUserBoroughs) {
                //     stateCopy.filterModel.boroughs = stateCopy.filterModel.boroughs.filter((m) => currentUserBoroughs.indexOf(m.boroughName.replace(/ /g, '').toLowerCase()) > -1 || m.boroughId == -1);
                // }
                // let currentUserSites = AuthorizationRules.getCurrentUserSiteNames();
                // if (currentUserSites) {
                //     stateCopy.filterModel.sites = stateCopy.filterModel.sites.filter((m) => (currentUserSites.indexOf(m.siteName.replace(/ /g, '').toLowerCase()) > -1) || m.siteId == -1);
                // }

                // select item if there is only one in the list of Borough/Site/Teams
                let allBoroughs = stateCopy.filterModel.boroughs.filter(m => m.boroughId != -1);
                if (allBoroughs.length == 0) {
                    stateCopy.filterModel.selectedBorough = null;
                    stateCopy.filterModel.boroughs = [];
                }
                else if (allBoroughs.length > 0) {
                    stateCopy.filterModel.selectedBorough = stateCopy.filterModel.boroughs[0];
                }
                let allSites = stateCopy.filterModel.sites.filter((site) => (site.siteId != -1));
                if (allSites && allSites.length == 0) {
                    stateCopy.filterModel.selectedSite = null;
                    stateCopy.filterModel.sites = [];
                }
                else if (allSites.length > 0) {
                    stateCopy.filterModel.selectedSite = stateCopy.filterModel.sites[0];
                }
                return stateCopy;
            }
        case CheckInActionTypes.SET_BOROUGH:
            {
                /**
                 * Set the selected borough and filter sites on selected borough.
                 */
                stateCopy.filterModel.selectedBorough = action.payload.value;
                stateCopy.filterModel.selectedSite = Constants.intialValueOfSite;
                /**
                 * Filter the status dropdown on the basis of selected canvassser/route tab.
                 */
                let allSites = stateCopy.filterModel.sites.filter(s => s.siteId != -1 && stateCopy.filterModel.selectedBorough && s.boroughId == stateCopy.filterModel.selectedBorough.boroughId);

                if (allSites && allSites.length == 1) {
                    stateCopy.filterModel.selectedSite = allSites[0];
                }
                allSites = stateCopy.filterModel.sites;
                if (allSites && allSites.length > 0 && stateCopy.filterModel.selectedBorough.boroughId == -1) {
                    stateCopy.filterModel.selectedSite = allSites[0];
                }
                return stateCopy;
            }
        case CheckInActionTypes.SET_SITE:
            {
                /**
                 * Set site of the filter.
                 */
                stateCopy.filterModel.selectedSite = action.payload.value;
                return stateCopy;
            }
        case CheckInActionTypes.SET_SEARCH: {
            stateCopy.searchElement = action.payload.value.toLowerCase();
            return stateCopy;
        }
        case CheckInActionTypes.SET_PAGINATION_OBJECT: {
            stateCopy.paginationObject = action.payload;
            return stateCopy;
        }
        case CheckInActionTypes.SET_RANGE: {
            stateCopy.selectedRange = action.payload;
            return stateCopy;
        }
        case CheckInActionTypes.FILTERED_VOLUNTEER: {
            stateCopy.filteredVolunteer = action.payload;
            return stateCopy;
        }
        case CheckInActionTypes.UPDATE_VOLUNTEER: {
            let updatedObj = action.payload;
                stateCopy.volunteers.forEach((v) => {
                    if (v.id == updatedObj.id)
                        if (updatedObj.site_id) {
                            v.site = updatedObj.value
                        } else {
                            v.status = updatedObj.value
                        }
                });
                stateCopy.filteredVolunteer&&stateCopy.filteredVolunteer.forEach((v) => {
                    if (v.id == updatedObj.id)
                        if (updatedObj.site_id) {
                            v.site = updatedObj.value
                        } else {
                            v.status = updatedObj.value
                        }
                });
            return stateCopy;
        }
        case CheckInActionTypes.SET_VOLUNTEERS: {
            stateCopy.volunteers = action.payload;
            let Items=[]; 
            if (stateCopy.volunteers.length > 0) {
                stateCopy.volunteers.forEach((v) => {
                    if(v.registration_status == "registered"){
                        if (v.site)
                        v.site = { siteId: v.site.id, siteName: v.site.name }
                    else
                    v.site = Constants.intialValueOfSite
                    if (v.status == Constants.routesStatus.in_progress) {
                        v.status = { id: 1, name: Constants.canvasserCheckedIn.checkedIn }
                    } else if (v.status == Constants.routesStatus.completed) {
                        v.status = { id: 3, name: Constants.canvasserCheckedIn.checkedOut }
                    }
                    else {
                        v.status = { id: 2, name: Constants.canvasserCheckedIn.notCheckedIn }
                    }
                    Items.push(v);
                    }
                    
                })
            }
             stateCopy.volunteers = Items;
            return stateCopy;
        }
        case CheckInActionTypes.OPEN_CANVASSER_DIALOG:{
            stateCopy.createCanvasserModalIsOpened = action.payload
        }
        
        case CheckInActionTypes.SHOW_VALIDATION_MESSAGE:
        {
            if (action.payload.validationMessage === Constants.emptyString) {
                stateCopy.validation.message = Constants.emptyString;
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
            } else {
                stateCopy.validation.message = action.payload.validationMessage;
                stateCopy.validation.isPopup = action.payload.isPopup;
                stateCopy.validation.type = action.payload.type;
            }
            return stateCopy;
        }
        case CheckInActionTypes.SET_SELECTED_TEAM_FOR_CONVESSER:
        {
            stateCopy.selectedTeamForConvesser = action.payload.value;
            return stateCopy;
        }
        case CheckInActionTypes.SET_CONVESSER_TYPE:
        {
            stateCopy.convesserType.forEach(c => {
                c.isSelected = (action.payload.value && (c.id == action.payload.value.id));
            })
            return stateCopy;
        }
        case CheckInActionTypes.ADD_SINGLE_VOLUNTEER:
        {
            stateCopy.volunteers.push(action.payload) 
            return stateCopy;
        }
        case CheckInActionTypes.SET_POPUPLOADER_TOGGLE:
        {
            stateCopy.popupLoaderShown = action.payload;
            return stateCopy;
        }
        case CheckInActionTypes.SET_ADMIN_SITE:
        {
            stateCopy.adminSite = action.payload;
            return stateCopy;
        }
       /**
         *Set the teams searched for a given site and sorts the data.
         */
        case CheckInActionTypes.SET_TEAMS_SEARCHED:
        {
            stateCopy.searchedTeams = action.payload;
            stateCopy.searchedTeams.sort(Utility.sortTeamByNameAsc("label"));
            return stateCopy;
        }
        case CheckInActionTypes.CHANGE_ORDER:
        {
            debugger
            let order = action.payload;
            if(order.by != "site"&&order.by != "status"){
                if(order.order == "a2z"){
                    stateCopy.volunteers.sort((a, b) => {
                      return (a[order.by] < b[order.by] ? -1 : (a[order.by] > b[order.by] ? 1 : 0));
                  });
                  }else{
                      stateCopy.volunteers.sort((a, b) => {
                          return (a[order.by] > b[order.by] ? -1 : (a[order.by] < b[order.by] ? 1 : 0));
                      });
                  }
      
                  if(stateCopy.filteredVolunteer&&stateCopy.filteredVolunteer.length>0){
                      if(order.order == "a2z"){
                          stateCopy.filteredVolunteer.sort((a, b) => {
                            return (a[order.by] < b[order.by] ? -1 : (a[order.by] > b[order.by] ? 1 : 0));
                        });
                        }else{
                          stateCopy.filteredVolunteer.sort((a, b) => {
                                return (a[order.by] > b[order.by] ? -1 : (a[order.by] < b[order.by] ? 1 : 0));
                            });
                        }
                  }
            }else if(order.by == "site"){
                if(order.order == "a2z"){
                    stateCopy.volunteers.sort((a, b) => {
                      return (a[order.by].siteName < b[order.by].siteName ? -1 : (a[order.by].siteName > b[order.by].siteName ? 1 : 0));
                  });
                  }else{
                      stateCopy.volunteers.sort((a, b) => {
                          return (a[order.by].siteName > b[order.by].siteName ? -1 : (a[order.by].siteName < b[order.by].siteName ? 1 : 0));
                      });
                  }
      
                  if(stateCopy.filteredVolunteer&&stateCopy.filteredVolunteer.length>0){
                      if(order.order == "a2z"){
                          stateCopy.filteredVolunteer.sort((a, b) => {
                            return (a[order.by].siteName < b[order.by].siteName ? -1 : (a[order.by].siteName > b[order.by].siteName ? 1 : 0));
                        });
                        }else{
                          stateCopy.filteredVolunteer.sort((a, b) => {
                                return (a[order.by].siteName > b[order.by].siteName ? -1 : (a[order.by].siteName < b[order.by].siteName ? 1 : 0));
                            });
                        }
                  }
            }else if(order.by == "status"){
                if(order.order == "a2z"){
                    stateCopy.volunteers.sort((a, b) => {
                      return (a[order.by].name < b[order.by].name ? -1 : (a[order.by].name > b[order.by].name ? 1 : 0));
                  });
                  }else{
                      stateCopy.volunteers.sort((a, b) => {
                          return (a[order.by].name > b[order.by].name ? -1 : (a[order.by].name < b[order.by].name ? 1 : 0));
                      });
                  }
      
                  if(stateCopy.filteredVolunteer&&stateCopy.filteredVolunteer.length>0){
                      if(order.order == "a2z"){
                          stateCopy.filteredVolunteer.sort((a, b) => {
                            return (a[order.by].name < b[order.by].name ? -1 : (a[order.by].name > b[order.by].name ? 1 : 0));
                        });
                        }else{
                          stateCopy.filteredVolunteer.sort((a, b) => {
                                return (a[order.by].name > b[order.by].name ? -1 : (a[order.by].name < b[order.by].name ? 1 : 0));
                            });
                        }
                  }
            }
           
            stateCopy.listOrder= order;
            return stateCopy;
        }

        default:
            return state
    }

}
