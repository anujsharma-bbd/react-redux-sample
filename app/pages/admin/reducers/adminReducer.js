import { adminActionTypes } from "../actions/adminActionTypes.jsx";
import { countsActionTypes } from "../actions/countsActionTypes.jsx";
import { adminState } from "../state/";
import { Utility } from "../../../common/utility/index.jsx";
import { Constants } from "../../../common/app-settings/constants";
import { AuthorizationRules } from "../../shared/services/authorization.rules";

export default (state = adminState, action) => {

    let stateCopy = {};
    /**
     * Creates a copy of the state on which actions will be performed.
     */
    if (adminActionTypes[action.type]) {
        stateCopy = JSON.parse(JSON.stringify(state));
    }

    switch (action.type) {
        case adminActionTypes.SET_BOROUGHS_AND_SITES:
            /**
             * sets boroughs and sites fetched from graphQL.
             */
            {
                let data = action.payload;
                if (data != null && data.zone && data.zone.length > 0) {
                    stateCopy.filterModel.boroughs = [];
                    stateCopy.filterModel.sites = [];
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

                let currentUserBoroughs = AuthorizationRules.getCurrentUserBoroughNames();
                if (currentUserBoroughs) {
                    stateCopy.filterModel.boroughs = stateCopy.filterModel.boroughs.filter((m) => currentUserBoroughs.indexOf(m.boroughName.replace(/ /g, '').toLowerCase()) > -1 || m.boroughId == -1);
                }
                let currentUserSites = AuthorizationRules.getCurrentUserSiteNames();
                if (currentUserSites) {
                    stateCopy.filterModel.sites = stateCopy.filterModel.sites.filter((m) => (currentUserSites.indexOf(m.siteName.replace(/ /g, '').toLowerCase()) > -1) || m.siteId == -1);
                }

                // select item if there is only one in the list of Borough/Site/Teams
                let allBoroughs = stateCopy.filterModel.boroughs.filter(m => m.boroughId != -1);
                if (allBoroughs && allBoroughs.length == 1) {
                    stateCopy.createTeamModel.selectedBorough = stateCopy.filterModel.selectedBorough = allBoroughs[0];
                }
                else
                    stateCopy.filterModel.selectedBorough = null;

                let allSites = stateCopy.filterModel.sites.filter((site) => (site.siteId != -1));
                if (allSites && allSites.length == 1) {
                    stateCopy.createTeamModel.selectedSite = stateCopy.filterModel.selectedSite = allSites[0];
                }
                else
                    stateCopy.filterModel.selectedSite = null;
                 stateCopy.searchedTeams = [];

                return stateCopy;
            }
        case adminActionTypes.REMOVE_ROUTE_FROM_TEAM:
            /**
             * Removes a route from team.
             */
            {
                if (action.payload && action.payload.team) {
                    let route = action.payload.route;
                    let team = action.payload.team;
                    if (stateCopy.searchedTeams.filter((sTeam) => (sTeam.id == team.id)).length == 1)
                        stateCopy.searchedTeams.filter((sTeam) => (sTeam.id == team.id))[0].route.push(route);
                    let allTeams = stateCopy
                        .searchedTeams
                        .filter((sTeam) => (sTeam.id != team.id));
                    for (let teamIndex = 0; teamIndex < allTeams.length; teamIndex++) {
                        let routeIndexToRemove = (allTeams[teamIndex].route.findIndex((rRoute) => (rRoute.id == route.id)));
                        if (routeIndexToRemove > -1) {
                            allTeams[teamIndex]
                                .route
                                .splice(routeIndexToRemove, 1);
                            break;
                        }
                    }
                }
                return stateCopy;
            }
        case adminActionTypes.REMOVE_CANVASSER_FROM_TEAM:
            /**
             * Removes canvasser from team.
             */
            {
                let team = action.payload.team;
                let canvasser = action.payload.canvasser;
                if (stateCopy.searchedTeams.filter((sTeam) => (sTeam.id == team.id)).length == 1)
                    stateCopy.searchedTeams.filter((sTeam) => (sTeam.id == team.id))[0].user.push(canvasser);
                let allTeams = stateCopy
                    .searchedTeams
                    .filter((sTeam) => (sTeam.id != team.id));
                for (let teamIndex = 0; teamIndex < allTeams.length; teamIndex++) {
                    let canvasserIndexToRemove = (allTeams[teamIndex].user.findIndex((user) => (user.id == canvasser.id)));
                    if (canvasserIndexToRemove > -1) {
                        allTeams[teamIndex]
                            .user
                            .splice(canvasserIndexToRemove, 1);
                        break;
                    }
                }
                return stateCopy;
            }

        case adminActionTypes.SET_TEAMS_SEARCHED:
            /**
             *Set the teams searched for a given site and sorts the data.
             */
            {
                stateCopy.searchedTeams = action.payload;
                stateCopy.searchedTeams.sort(Utility.sortTeamByNameAsc("label"));
                stateCopy.panelProperties.panelReload = false;
                stateCopy.teamsCountNeedingEscorts = Utility.getTeamsNeedingEscort(action.payload);
                if (stateCopy.searchedTeams && stateCopy.searchedTeams.length) {
                    stateCopy.searchedTeams.forEach(team => {
                        team.route.forEach(route => {
                            route.routeStatus = (route.countInstanceStatus && route.countInstanceStatus.length ? route.countInstanceStatus[0].label : Constants.routesStatus.not_started);
                            route.routeType = route.properties.type;
                            route.station = route.properties.station;
                            route.properties = route.properties;
                            route.multipolygonCoordinates = route.properties.multipolygonCoordinates;
                            route.pointCoordinates = route.properties.pointCoordinates;
                            route.countInstanceStatus = route.countInstanceStatus;
                        })
                    })

                }
                return stateCopy;
            }

        case adminActionTypes.SET_KEYWORD_SEARCH:
            /**
             * Filter data when keyword search is performed.
             */
            {
                // Filter data when keyword search is performed on canvasser. Filtering is
                // applied on canvassers's firtName, lastName, email and canvasser's status.
                if (action.payload.convassersTabSelected) {
                    stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption = action.payload.value;

                    if (stateCopy.rightSideModel.statusModel.selectedCanvOption.value != Constants.defaultSelectedOption)
                        stateCopy.rightSideModel.searchedCanvassers = stateCopy.rightSideModel.initialSearchedCanvassers.filter((canvasser) => (canvasser.canvasserStatus === stateCopy.rightSideModel.statusModel.selectedCanvOption.value));
                    else
                        stateCopy.rightSideModel.searchedCanvassers = stateCopy.rightSideModel.initialSearchedCanvassers;
                    if (stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption)
                        stateCopy.rightSideModel.searchedCanvassers = stateCopy.rightSideModel.searchedCanvassers.filter((canvasser) =>
                            ((canvasser.name && canvasser.name.toLowerCase().indexOf(action.payload.value.toLowerCase()) >= 0)
                                || (canvasser.properties.firstName && canvasser.properties.firstName.toLowerCase().indexOf(action.payload.value.toLowerCase()) >= 0)
                                || (canvasser.properties.lastName && canvasser.properties.lastName.toLowerCase().indexOf(action.payload.value.toLowerCase()) >= 0)));

                } else {
                    // Filter data when keyword search is performed on routes. Filtering is applied
                    // on route name and status.
                    stateCopy.rightSideModel.keywordSearchRoutesModel.selectedOption = action.payload.value;
                    stateCopy.rightSideModel.searchedRoutes = stateCopy.rightSideModel.initialSearchedRoutes.filter((item) => (Constants.routeStatusKey.assigned.key == stateCopy.rightSideModel.statusModel.selectedRoutesOption.value ? (item.team && item.team.length) : (Constants.routeStatusKey.unAssigned.key == stateCopy.rightSideModel.statusModel.selectedRoutesOption.value ? (!item.team || (item.team.length == 0)) : true)));

                    if (stateCopy.rightSideModel.keywordSearchRoutesModel.selectedOption)
                        stateCopy.rightSideModel.searchedRoutes = stateCopy.rightSideModel.searchedRoutes.filter((route) => (route.name && route.name.toLowerCase().indexOf(action.payload.value.toLowerCase()) >= 0));
                }
                return stateCopy;
            }
        case adminActionTypes.SET_STATUS:
            /**
             * Filter data on status change.
             */
            {
                //Filtering on canvasser's data.
                if (action.payload.convassersTabSelected) {
                    stateCopy.rightSideModel.statusModel.selectedCanvOption = action.payload.selection;
                    if (stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption) {
                        stateCopy.rightSideModel.searchedCanvassers = stateCopy.rightSideModel.initialSearchedCanvassers.filter((canvasser) =>
                            ((canvasser.name && canvasser.name.toLowerCase().indexOf(stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption.toLowerCase()) >= 0)
                                || (canvasser.properties.firstName && canvasser.properties.firstName.toLowerCase().indexOf(stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption.toLowerCase()) >= 0)
                                || (canvasser.properties.lastName && canvasser.properties.lastName.toLowerCase().indexOf(stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption.toLowerCase()) >= 0)
                                || (canvasser.properties.email && canvasser.properties.email.toLowerCase().indexOf(stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption.toLowerCase()) >= 0)));
                    }
                    else
                        stateCopy.rightSideModel.searchedCanvassers = stateCopy.rightSideModel.initialSearchedCanvassers;

                    if (stateCopy.rightSideModel.statusModel.selectedCanvOption.value != Constants.defaultSelectedOption)
                        stateCopy.rightSideModel.searchedCanvassers = stateCopy.rightSideModel.searchedCanvassers.filter((item) => (item.canvasserStatus === stateCopy.rightSideModel.statusModel.selectedCanvOption.value));
                } else {
                    //Filtering on route's data.
                    stateCopy.rightSideModel.statusModel.selectedRoutesOption = action.payload.selection;

                    if (stateCopy.rightSideModel.keywordSearchRoutesModel.selectedOption)
                        stateCopy.rightSideModel.searchedRoutes = stateCopy.rightSideModel.initialSearchedRoutes.filter((route) => (route.name.toLowerCase().indexOf(stateCopy.rightSideModel.keywordSearchRoutesModel.selectedOption.toLowerCase()) >= 0));
                    else
                        stateCopy.rightSideModel.searchedRoutes = stateCopy.rightSideModel.initialSearchedRoutes;

                    stateCopy.rightSideModel.searchedRoutes = stateCopy.rightSideModel.searchedRoutes.filter((item) => (Constants.routeStatusKey.assigned.key == stateCopy.rightSideModel.statusModel.selectedRoutesOption.value ? (item.team && item.team.length) : (Constants.routeStatusKey.unAssigned.key == stateCopy.rightSideModel.statusModel.selectedRoutesOption.value ? (!item.team || (item.team.length == 0)) : true)));

                }
                return stateCopy;
            }
        case adminActionTypes.SET_CANVASSERS_SEARCHED_RESULTS:
            {
                /**
                 * Set canvasser's searched results for given borough and site.
                 */
                stateCopy.rightSideModel.initialSearchedCanvassers = action.payload;
                if (!stateCopy.rightSideModel.hasOwnProperty("initialSearchedCanvassers")) {
                    stateCopy.rightSideModel["initialSearchedCanvassers"] = [];
                }

                //below two for loop shgould be deleted when service in-iplace.

                stateCopy
                    .rightSideModel
                    .initialSearchedCanvassers
                    .forEach((canvasser) => {
                        if (!canvasser.hasOwnProperty("canvasserStatus")) {
                            canvasser["canvasserStatus"] = Constants.emptyString;
                        }
                    });

                stateCopy.rightSideModel.initialSearchedCanvassers.forEach((canvasser) => {
                    if (canvasser.team.length === 0) {
                        canvasser.canvasserStatus = Constants.canvasserStatus.unAssigned.key;
                    } else {
                        canvasser.canvasserStatus = Constants.canvasserStatus.assigned.key;
                    }
                })
                stateCopy.rightSideModel.searchedCanvassers = stateCopy.rightSideModel.initialSearchedCanvassers;
                return stateCopy;
            }

        case adminActionTypes.SET_ROUTES_SEARCHED_RESULTS:
            {
                //Set routes searched results for a given borough and site.
                if (action.payload) {
                    action.payload.forEach(route => {
                        route.routeStatus = (route.countInstanceStatus && route.countInstanceStatus.length ? route.countInstanceStatus[0].label : Constants.routesStatus.not_started);
                        route.routeType = route.properties.type;
                        route.station = route.properties.station;
                        route.properties = route.properties;
                        route.multipolygonCoordinates = route.properties.multipolygonCoordinates;
                        route.pointCoordinates = route.properties.pointCoordinates;
                        route.countInstanceStatus = route.countInstanceStatus;
                    })
                }
                stateCopy.rightSideModel.searchedRoutes = action.payload;
                stateCopy.rightSideModel.initialSearchedRoutes = stateCopy.rightSideModel.searchedRoutes;
                stateCopy.routeCanvasLoaderShown = false;
                return stateCopy;
            }

        case adminActionTypes.SET_LOG_OUT:
            {
                return adminState; // Reset to Original State after Logout
            }
        case adminActionTypes.SET_EDIT_CANVASSER_DIALOG_OPEN:
            {
                /**
                 * Update state for when canvassers dialog is opened in edit mode to prefilled the data like firstName, last Name and email.
                 */
                stateCopy.rightSideModel.createCanvasserModalIsOpened = action.payload.IsOpen;
                if (stateCopy.rightSideModel.createCanvasserModalIsOpened) {
                    stateCopy.rightSideModel.editCanvasser = action.payload.canvasser;
                    stateCopy.convesserType.forEach(c => {
                        if (action.payload.canvasser && action.payload.canvasser.properties.canvasserType)
                            c.isSelected = (c.label.toLowerCase() == action.payload.canvasser.properties.canvasserType.toLowerCase());
                        else
                            c.isSelected = (c.id == stateCopy.defaultConvesserType.id);
                    })
                } else {
                    stateCopy.rightSideModel.editCanvasser = null;
                    stateCopy.convesserType.forEach(c => {
                        c.isSelected = (c.id == stateCopy.defaultConvesserType.id);
                    })
                }
                stateCopy.validation.message = Constants.emptyString;
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case adminActionTypes.SET_CONVASSERS_DIALOG_OPEN:
            {
                /**
                 * Set flag for canvasser's dialog is opened.
                 */
                stateCopy.rightSideModel.createCanvasserModalIsOpened = action.payload.IsOpen;
                if (!stateCopy.rightSideModel.createCanvasserModalIsOpened) {
                    stateCopy.rightSideModel.editCanvasser = null;
                    stateCopy.convesserType.forEach(c => {
                        c.isSelected = (c.id == stateCopy.defaultConvesserType.id);
                    })
                } //removing edit data
                stateCopy.validation.message = Constants.emptyString;
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case adminActionTypes.SET_TEAM_DIALOG_OPEN:
            {
                /**
                 * Set flag when team dialog is opened.
                 */
                stateCopy.createTeamModalIsOpened = action.payload.IsOpen;
                stateCopy.validation.message = Constants.emptyString;
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case adminActionTypes.SET_EDIT_TEAM_DIALOG_OPEN:
            {
                /**
                 * Set state when team dialog is opened in edit mode to prefilled the teams data like of canvassers and routes.
                 */
                stateCopy.editTeamModalIsOpened = action.payload.IsOpen;
                stateCopy.teamToEdit = action.payload.teamOpened;
                stateCopy.validation.message = action.payload.validationMessage;
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case adminActionTypes.SET_TEAM_USER_POP_UP_OPEN:
            {
                /**
                 * Set state when team dialog is opened in edit mode to prefilled the teams data like of canvassers and routes.
                 */
                stateCopy.teamUsersPopupIsOpened = action.payload.IsOpen;
                return stateCopy;
            }
        case adminActionTypes.SET_JUMP_TEAM_DIALOG_OPEN:
            {
                /**
                 * Set flag when jump team dialog is opened.
                 */
                stateCopy.jumpTeamModalIsOpened = action.payload.IsOpen;
                stateCopy.teamToEdit = action.payload.teamOpened;
                stateCopy.validation.message = action.payload.validationMessage;
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case adminActionTypes.SET_BOROUGH:
            {
                /**
                 * Set the selected borough and filter sites on selected borough.
                 */
                stateCopy.filterModel.selectedBorough = action.payload.value;
                stateCopy.filterModel.sites.filter((site) => (stateCopy.filterModel.selectedBorough && site.boroughId == stateCopy.filterModel.selectedBorough.boroughId));
                /**
                 * Set initial teams, routes and canvassers to empty array and also the temporary array containg searched canvassers and routes.
                 */
                stateCopy.searchedTeams = [];
                stateCopy.rightSideModel.searchedRoutes = [];
                stateCopy.rightSideModel.searchedCanvassers = [];
                stateCopy.rightSideModel.initialSearchedRoutes = [];
                stateCopy.rightSideModel.initialSearchedCanvassers = [];
                stateCopy.routeCanvasLoaderShown = false;
                stateCopy.panelProperties.panelReload = false;
                stateCopy.rightSideModel.keywordSearchRoutesModel.selectedOption = Constants.emptyString;
                stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption = Constants.emptyString;
                /**
                 * Filter the status dropdown on the basis of selected canvassser/route tab.
                 */
                stateCopy.rightSideModel.statusModel.selectedRoutesOption = stateCopy.rightSideModel.statusModel.options.filter((option) => (option.type == Constants.filterStatusType.route && option.value == Constants.defaultSelectedOption))[0];
                stateCopy.rightSideModel.statusModel.selectedCanvOption = stateCopy.rightSideModel.statusModel.options.filter((option) => (option.type == Constants.filterStatusType.canvasser && option.value == Constants.defaultSelectedOption))[0];
                let allSites = stateCopy.filterModel.sites.filter(s => s.siteId != -1 && stateCopy.filterModel.selectedBorough && s.boroughId == stateCopy.filterModel.selectedBorough.boroughId);

                if (allSites && allSites.length == 1) {
                    stateCopy.filterModel.selectedSite = allSites[0];
                    stateCopy.createTeamModel.selectedSite = allSites[0];
                }
                return stateCopy;
            }
        case adminActionTypes.SET_SITE:
            {
                /**
                 * Set site of the filter.
                 */
                stateCopy.filterModel.selectedSite = action.payload.value;
                stateCopy.createTeamModel.selectedSite = action.payload.value;

                if (action.payload.showLoader) {
                    stateCopy.panelProperties.panelReload = true;
                    stateCopy.routeCanvasLoaderShown = true;
                }
                /**
                 * Set initial teams, routes and canvassers to empty array and also the temporary array containg searched canvassers and routes.
                 */
                stateCopy.validation.message = Constants.emptyString;
                stateCopy.rightSideModel.keywordSearchRoutesModel.selectedOption = Constants.emptyString;
                stateCopy.rightSideModel.keywordSearchCanvModel.selectedOption = Constants.emptyString;
                stateCopy.rightSideModel.searchedRoutes = [];
                stateCopy.rightSideModel.searchedCanvassers = [];
                stateCopy.rightSideModel.initialSearchedRoutes = [];
                stateCopy.rightSideModel.initialSearchedCanvassers = [];
                /**
                 * Filter the status dropdown on the basis of selected canvassser/route tab.
                 */
                stateCopy.rightSideModel.statusModel.selectedRoutesOption = stateCopy.rightSideModel.statusModel.options.filter((option) => (option.type == Constants.filterStatusType.route && option.value == Constants.defaultSelectedOption))[0];
                stateCopy.rightSideModel.statusModel.selectedCanvOption = stateCopy.rightSideModel.statusModel.options.filter((option) => (option.type == Constants.filterStatusType.canvasser && option.value == Constants.defaultSelectedOption))[0];
                return stateCopy;
            }
        case adminActionTypes.SET_PANEL_EXPAND_ADMIN:
            {
                stateCopy.panelProperties.panelExpanded = !stateCopy.panelProperties.panelExpanded;
                return stateCopy;
            }
        case adminActionTypes.SET_PANEL_COLLAPSE_ADMIN:
            {
                stateCopy.panelProperties.panelCollapsed = !stateCopy.panelProperties.panelCollapsed;
                return stateCopy;
            }
        case adminActionTypes.SET_PANEL_REMOVE_ADMIN:
            {
                stateCopy.panelProperties.panelRemoved = action.payload;
                return stateCopy;
            }
        case adminActionTypes.CREATE_TEAM_SET_SITE:
            {
                stateCopy.createTeamModel.selectedSite = action.payload.value;
                return stateCopy;
            }
        case adminActionTypes.CREATE_TEAM_SET_BOROUGH:
            {
                let selectedSite;
                stateCopy.createTeamModel.selectedBorough = action.payload.value;
                let allSites = stateCopy.filterModel.sites.filter((site) => (action.payload.value && site.boroughId == action.payload.value.boroughId));
                allSites.sort((a, b) => {
                    return (a.siteName.trim() < b.siteName.trim()
                        ? -1
                        : (a.siteName.trim() > b.siteName.trim()
                            ? 1
                            : 0));
                });
                if (allSites && allSites.length == 1) {
                    stateCopy.createTeamModel.selectedSite = allSites[0];
                }
                return stateCopy;
            }
        case adminActionTypes.CREATE_TEAM_SET_BOROUGH_SITE:
            {
                stateCopy.createTeamModel.selectedBorough = action.payload.borough;
                stateCopy.createTeamModel.selectedSite = action.payload.site;
                return stateCopy;
            }
        case adminActionTypes.REMOVE_TEAM_MEMBER:
            {
                /**
                 * Removes a canvasser from the team.
                 */
                let teamCurrent = stateCopy.searchedTeams.find((team, index) => team.id === action.payload.teamId);
                let currentUser = teamCurrent.user.find((user) => user.id == action.payload.userId);
                teamCurrent.user = teamCurrent.user.filter((user) => user.id !== action.payload.userId);
                let index = stateCopy.searchedTeams.findIndex(team => team.id === action.payload.teamId);
                stateCopy.searchedTeams[index] = teamCurrent;
                stateCopy.teamToEdit = teamCurrent;
                stateCopy.validation.message = Utility.stringFormat(Constants.messages.editTeamModal.memberRemoved, currentUser.name);
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case adminActionTypes.REMOVE_TEAM_ROUTE:
            {
                /**
                 * Removes a route from the team.
                 */
                let teamCurrent = stateCopy.searchedTeams.find((team) => team.id == action.payload.teamId);
                let routeCurrent = teamCurrent.route.find((route) => route.id == action.payload.routeId);
                teamCurrent.route = teamCurrent.route.filter((route) => route.id != action.payload.routeId);
                let index = stateCopy.searchedTeams.findIndex(team => team.id == action.payload.teamId);
                stateCopy.searchedTeams[index] = teamCurrent;
                stateCopy.teamToEdit = teamCurrent;
                stateCopy.validation.message = Utility.stringFormat(Constants.messages.editTeamModal.routeRemoved, routeCurrent.name);
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case adminActionTypes.REMOVE_TEAM_ALL_ROUTE:
            {
                /**
                 * Removes all routes from the team.
                 */
                let teamCurrent = stateCopy.searchedTeams.find((team, index) => team.id === action.payload.teamId);
                teamCurrent.route.length = 0;
                let index = stateCopy.searchedTeams.findIndex(team => team.id === action.payload.teamId);
                stateCopy.searchedTeams[index] = teamCurrent;
                stateCopy.teamToEdit = teamCurrent;
                stateCopy.validation.message = Constants.messages.editTeamModal.allRoutesRemoved;
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case adminActionTypes.SHOW_VALIDATION_MESSAGE:
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
        case adminActionTypes.SET_POPUPLOADER_TOGGLE:
            {
                stateCopy.popupLoaderShown = !stateCopy.popupLoaderShown;
                return stateCopy;
            }
        case adminActionTypes.RESET_CREATE_TEAM_MODEL:
            {
                stateCopy.createTeamModel.teamName = Constants.emptyString;
                stateCopy.createTeamModel.selectedSite = null;
                stateCopy.createTeamModel.selectedBorough = null;
                return stateCopy;
            }
        case adminActionTypes.SET_ROUTE_CANVAS_LOADER_TOGGLE:
            {
                stateCopy.routeCanvasLoaderShown = action.payload.showCanvRoutLoader;
                stateCopy.panelProperties.panelReload = action.payload.showTeamLoader;
                return stateCopy;
            }
        case adminActionTypes.SET_TEAM_LEADER:
            {
                if (stateCopy.teamToEdit && stateCopy.teamToEdit.user) {

                    stateCopy.teamToEdit.user.forEach((user) => {
                        user.properties.isTeamLeader = (action.payload.users.find(u => u.id == user.id).isLeader).toString();
                    })
                    stateCopy.searchedTeams.forEach(team => {
                        if (team.id == stateCopy.teamToEdit.id) {
                            team.user.forEach((user) => {
                                user.properties.isTeamLeader = (action.payload.users.find(u => u.id == user.id).isLeader).toString();
                            })
                        }
                    })
                }
                return stateCopy;
            }
        case adminActionTypes.SET_TEAM_NAME:
            {
                stateCopy.createTeamModel.teamName = action.payload.teamName;
                return stateCopy;
            }
        case adminActionTypes.REMOVE_TEAM:
            {
                stateCopy.searchedTeams = stateCopy.searchedTeams.filter(t => t.id && action.payload != t.id);
                return stateCopy;
            }
        case adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH:
            {
                stateCopy.panelProperties.panelReload = action.payload;
                return stateCopy;
            }
        case adminActionTypes.SET_ADMIN_LAST_UPDATED_ON:
            {
                stateCopy.panelProperties.lastUpdatedOn = Utility.formatAMPM(new Date());
                return stateCopy;
            }
        case adminActionTypes.SET_ROUTE_TYPE:
            {
                stateCopy.teamToEdit.routes.find((route) => (action.payload.routeId === route.id)).routeType = action.payload.routeType.label;
                return stateCopy;
            }
        case adminActionTypes.SET_RIGHT_SIDE_LOADERS:
            {
                stateCopy.panelProperties.panelReload = action.payload;
                stateCopy.routeCanvasLoaderShown = action.payload;
                return stateCopy;
            }
        case adminActionTypes.SET_SELECTED_TEAM_FOR_CONVESSER:
            {
                stateCopy.selectedTeamForConvesser = action.payload.value;
                return stateCopy;
            }
        case adminActionTypes.SET_CONVESSER_TYPE:
            {
                stateCopy.convesserType.forEach(c => {
                    c.isSelected = (action.payload.value && (c.id == action.payload.value.id));
                })
                return stateCopy;
            }
        case adminActionTypes.SET_ROUTE_STATUS_ON_MAP_ADMIN:
            {
                let countInstanceStatuses = action.payload.countInstanceStatuses;
                let newStatus = action.payload.newStatus;
                let routeObject = action.payload.routeObject;
                if (routeObject.id) {
                    if (stateCopy.rightSideModel.initialSearchedRoutes && stateCopy.rightSideModel.initialSearchedRoutes.length)
                        for (let i = 0; i < stateCopy.rightSideModel.initialSearchedRoutes.length; i++) {
                            let route = stateCopy.rightSideModel.initialSearchedRoutes[i];
                            if ((route.id == routeObject.id)) {
                                route.routeStatus = newStatus.key;
                                route.countInstanceStatus = [countInstanceStatuses.find(m => m.label.toLowerCase() == newStatus.key.toLowerCase())];
                                break;
                            }
                        }
                    if (stateCopy.rightSideModel.searchedRoutes && stateCopy.rightSideModel.searchedRoutes.length)
                        for (let i = 0; i < stateCopy.rightSideModel.searchedRoutes.length; i++) {
                            let route = stateCopy.rightSideModel.searchedRoutes[i];
                            if ((route.id == routeObject.id)) {
                                route.routeStatus = newStatus.key;
                                route.countInstanceStatus = [countInstanceStatuses.find(m => m.label.toLowerCase() == newStatus.key.toLowerCase())];
                                break;
                            }
                        }

                    if (stateCopy.teamToEdit && stateCopy.teamToEdit.route && stateCopy.teamToEdit.route.length) {
                        for (let i = 0; i < stateCopy.teamToEdit.route.length; i++) {
                            let route = stateCopy.teamToEdit.route[i];
                            if (route.id == routeObject.id) {
                                route.countInstanceStatus = [countInstanceStatuses.find(m => m.label.toLowerCase() == newStatus.key.toLowerCase())];
                                break;
                            }
                        }
                    }
                    if (stateCopy.searchedTeams && stateCopy.searchedTeams.length) {
                        loop_teams:
                        for (let j = 0; j < stateCopy.searchedTeams.length; j++) {
                            let team = stateCopy.searchedTeams[j]
                            if (team.route.length) {
                                loop_routes:
                                for (let i = 0; i < team.route.length; i++) {
                                    let route = team.route[i];
                                    if ((route.id == routeObject.id)) {
                                        route.countInstanceStatus = [countInstanceStatuses.find(m => m.label.toLowerCase() == newStatus.key.toLowerCase())];
                                        break loop_teams;
                                    }
                                }
                            }
                        }
                    }

                }
                return stateCopy;
            }
        case adminActionTypes.RESET: {
            stateCopy = adminState;
            return stateCopy;
        }
        case adminActionTypes.SET_REMOVE_EMAILS: {
            let removingEmail = action.payload.value;
            let restEmails = stateCopy.selectedEmails.filter(m => m.value != removingEmail.value);
            let restUsers = stateCopy.userEmailIds.filter(m => m.value != removingEmail.value);
            stateCopy.selectedEmails = restEmails;
            stateCopy.userEmailIds = restUsers;
            return stateCopy;
        }
        case adminActionTypes.SET_INPUT_EMAILS: {
            stateCopy.inputEmail = action.payload;
            return stateCopy;
        }
        case adminActionTypes.SET_ADD_EMAILS: {
            let value = action.payload.value.value.toLowerCase();
            if (!stateCopy.selectedEmails.find(m => m.value.toLowerCase() == value)) {
                action.payload.value.emailId = action.payload.value.key = action.payload.value.id = action.payload.value.name = action.payload.value.value = value;
                action.payload.value.isSelected = true;
                stateCopy.selectedEmails.push(action.payload.value);
            }

            let userIds = stateCopy.userEmailIds && stateCopy.userEmailIds.length > 0 ? stateCopy.selectedEmails.concat(stateCopy.userEmailIds) : stateCopy.selectedEmails;
            var unique = userIds.filter(function (elem, index, self) {
                return index == self.indexOf(elem);
            })
            stateCopy.userEmailIds = unique;
            stateCopy.inputEmail = Constants.emptyString;
            stateCopy.validation.message = Constants.emptyString;
            return stateCopy;
        }
        case adminActionTypes.SET_ADD_BULK_EMAILS: {
            let pastedEmails = action.payload;
            let arrEmails = pastedEmails.split(",");
            if (stateCopy.selectedEmails.length == 0)
                stateCopy.selectedEmails = [];
            if (arrEmails && arrEmails.length) {
                arrEmails.forEach(pasteEmail => {
                    pasteEmail = pasteEmail.trim();
                    if (Utility.validateEmail(pasteEmail)) {
                        if (stateCopy.selectedEmails.filter(m => m.value.toLowerCase() == pasteEmail.toLowerCase()).length == 0)
                            stateCopy.selectedEmails.push({
                                name: pasteEmail.toLowerCase(),
                                value: pasteEmail.toLowerCase(),
                                key: pasteEmail.toLowerCase(),
                                id: pasteEmail.toLowerCase(),
                                emailId: pasteEmail.toLowerCase(),
                                isSelected: true
                            });
                    }
                })
                stateCopy.inputEmail = "";
                stateCopy.validation.message = Constants.emptyString;
                let userIds = stateCopy.userEmailIds && stateCopy.userEmailIds.length > 0 ? stateCopy.selectedEmails.concat(stateCopy.userEmailIds) : stateCopy.selectedEmails;
                var unique = userIds.filter(function (elem, index, self) {
                    return index == self.indexOf(elem);
                })
                stateCopy.userEmailIds = unique;
            }
            else {
                stateCopy.validation.message = Constants.inviteEmail.invalidEmail;
                stateCopy.validation.isPopup = false;
                stateCopy.validation.type = Constants.validation.types.error.key;
            }
            return stateCopy;
        }
        case adminActionTypes.GET_REGISTERED_USERS: {
            let userIds = [];
            action.payload.length > 0 && action.payload.forEach((id) => {
                userIds.push({
                    emailId: id,
                    isSelected: false,
                    name: id
                })
            })
            var unique = userIds.filter(function (elem, index, self) {
                return index == self.indexOf(elem);
            })
            stateCopy.userEmailIds = unique;
            return stateCopy;
        }
        case adminActionTypes.CSV_UPLOADED_USERS: {
            let userIds = [];
            action.payload.length > 0 && action.payload.forEach((id) => {
                userIds.push({
                    emailId: id,
                    isSelected: true,
                    name: id
                })
            })
            let newUserIDs = stateCopy.userEmailIds && stateCopy.userEmailIds.length > 0 ? userIds.concat(stateCopy.userEmailIds) : userIds;
            var unique = newUserIDs.filter(function (elem, index, self) {
                return index == self.indexOf(elem);
            })
            stateCopy.userEmailIds = unique;
            return stateCopy;
        }
        case adminActionTypes.SELECT_ALL_USERS: {
            if (!action.payload) {
                stateCopy.isAllSelected = stateCopy.isAllSelected ? !stateCopy.isAllSelected : true;
                stateCopy.userEmailIds && stateCopy.userEmailIds.forEach((user => {
                    user.isSelected = stateCopy.isAllSelected;
                }))
            } else {
                let isAllSelect = true;
                stateCopy.isAllSelected ? !stateCopy.isAllSelected : true;
                stateCopy.userEmailIds && stateCopy.userEmailIds.forEach((user => {
                    if (user.emailId == action.payload.emailId) {
                        user.isSelected = !action.payload.isSelected;
                    }
                }))
                let users = stateCopy.userEmailIds.filter(user => !user.isSelected)
                stateCopy.isAllSelected = users.length > 0 ? false : true;
            }
            return stateCopy;
        }
        case adminActionTypes.RESET_ALL_INVITEES: {
            stateCopy.isAllSelected = false
            stateCopy.userEmailIds && stateCopy.userEmailIds.forEach((user => {
                user.isSelected = false;
            }))
            stateCopy.selectedEmails = [];
            stateCopy.inputEmail = null;
            return stateCopy;
        }
        case adminActionTypes.SET_REMINDER_TIME: {
            stateCopy.reminderTime = action.payload;
            return stateCopy;
        }
        case adminActionTypes.SET_INVITEEMAILS_CSV_UPLOADED: {
            stateCopy.isInviteEmailsCSVUploaded = action.payload;
            return stateCopy;
        }
        case adminActionTypes.SET_TEMPLATES: {
            stateCopy.TemplatesForReminder = action.payload;
            return stateCopy;
        }
        case adminActionTypes.SET_USER_SOURCE: {
            stateCopy.userSource = action.payload;
            return stateCopy;
        }
        case adminActionTypes.SET_SELECTED_TEMPLATES: {
            stateCopy.SelectedTemplateForReminder = action.payload;
            return stateCopy;
        }
        case adminActionTypes.SET_SELECTED_SEGMENT: {
            stateCopy.selectedSegment = action.payload;
            return stateCopy;
        }
        case adminActionTypes.SET_SELECTED_SITE_TPYE: {
            stateCopy.selectedSiteType = action.payload;
            return stateCopy;
        }
        case adminActionTypes.SET_SELECTED_REGISTRATION_STATUS: {
            stateCopy.selectedRegistrationStatus = action.payload;
            return stateCopy;
        }
        case adminActionTypes.SET_SELECTED_USER_SOURCE:{
            let option=Constants.intialValue;
            // id could be different as we creating id on local using index
            stateCopy.userSource&& stateCopy.userSource.forEach((value)=>{
                if(value.name == action.payload.name){
                    option = value;
                }
            })
            stateCopy.selectedUserSource = option;
            return stateCopy;
        }
        case adminActionTypes.RESET_SCHEDULE_MODEL: {
            stateCopy.resetScheduleModel = action.payload;
            return stateCopy;
        }
        case adminActionTypes.SET_NOTIFICATION_USERS_LIST: {
            stateCopy.emailNotificationUsers = action.payload.sort((a,b)=>{
                return (a>b?1:(a<b)?-1:0)
            });;
            return stateCopy;
        }
        case adminActionTypes.SET_SCHEDULE_NOTIFICATION_LIST: {
            let currentTimeStamp = (new Date()).getTime();
            let list = [];
            action.payload.forEach(item => {
                if (item.send_at) {
                    let dateTimeStamp = parseInt(item.send_at);
                    if ( dateTimeStamp < currentTimeStamp) {
                        item.isSent = true;
                    } else {
                        item.isSent = false;
                    }
                    let newDate = new Date(dateTimeStamp)
                    item.send_at = newDate.toLocaleDateString( ) + " : " + newDate.toLocaleTimeString( )
                }

                list.push(item);
            })
            list.sort(function (a, b) {
                var keyA = new Date(a.updated_at),
                    keyB = new Date(b.updated_at);
                // Compare the 2 dates
                if (a.id < b.id) return 1;
                if (a.id > b.id) return -1;
                return 0;
            });
            stateCopy.scheduledEmailNotificationList = list;
            return stateCopy;
        }
        case adminActionTypes.SET_EMAIL_NOTIFICATION_MODEL: {
            if(stateCopy.emailNotificationModel.hasOwnProperty(action.payload.prop))
            stateCopy.emailNotificationModel[action.payload.prop] = action.payload.value;
            return stateCopy;
        }
        case adminActionTypes.SET_SHOW_CSV_UPLOAD_MODAL: {
            stateCopy.showCSVUploadModel = action.payload;
            return stateCopy;
        }
        case adminActionTypes.SET_PAGINATION_OBJECT: {
            stateCopy.paginationObject = action.payload;
            return stateCopy;
        }
        case adminActionTypes.RESET_NOTIFICATION: {
            stateCopy.emailNotificationModel = adminState.emailNotificationModel;
            return stateCopy;
        }
        case adminActionTypes.SET_PAGINATION_USERS_OBJECT: {
            if(action.payload.itemList.length>0){
                let itemList = action.payload.itemList.sort((a,b)=>{
                return (a>b?1:(a<b)?-1:0)
            });
            action.payload.itemList = itemList;
            }            
            stateCopy.paginationUsersObject = action.payload;
            return stateCopy;
        }
        case adminActionTypes.SET_NOTIFICATION_USERS_MODAL: {
            stateCopy.isNotificationUsersModalOpen = action.payload;
            return stateCopy;
        }
        case adminActionTypes.UPDATE_EMAIL_NOTIFICATION: {
            let list = []
            let currentTimeStamp = (new Date()).getTime();
            stateCopy.scheduledEmailNotificationList.forEach(item => {
                if (item.id === action.payload.id) {
                    let newItem = action.payload;
                    if (newItem.send_at) {
                    let dateTimeStamp = parseInt(newItem.send_at);
                    if ( dateTimeStamp < currentTimeStamp) {
                        newItem.isSent = true;
                    } else {
                        newItem.isSent = false;
                    }
                    let newDate = new Date(dateTimeStamp)
                    newItem.send_at = newDate.toLocaleDateString( ) + " : " + newDate.toLocaleTimeString( )
                }
                    list.push(newItem);
                } else {
                    list.push(item)
                }

            })
            stateCopy.scheduledEmailNotificationList = list;
            return stateCopy;
        }
        case adminActionTypes.SET_CANVASSER_SELECTED: {
            let selectedUserArray = [];
            let user = null
            if (stateCopy.rightSideModel.selectedUsers && stateCopy.rightSideModel.selectedUsers.length > 0) {
                stateCopy.rightSideModel.selectedUsers.forEach(obj => {
                    if (obj.id == action.payload.id) {
                        user = action.payload;
                    } else {
                        selectedUserArray.push(obj);
                    }
                });
            }
            if (!user) {
                selectedUserArray.push(action.payload);
            }
            stateCopy.rightSideModel.selectedUsers = selectedUserArray;
            return stateCopy;
        }
        default:
            return state
    }

}
