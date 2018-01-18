import { reportsState } from "../state/";
import { reportsActionTypes } from "../actions/reportsActionTypes";
import { AuthorizationRules } from "../../shared/services/authorization.rules";
import { Constants } from "../../../common/app-settings/constants";
export default (state = reportsState, action) => {

    let stateCopy = {};
    /**
     * Create a copy of the state on which actions will be performed.
     */
    if (reportsActionTypes[action.type]) {
        stateCopy = JSON.parse(JSON.stringify(state));
    }

    switch (action.type) {
        case reportsActionTypes.DONWLOAD_SURVEYS_EXCEL:
            {
                stateCopy.isDownloadingReport = action.payload;
                return stateCopy;
            }
        case reportsActionTypes.SET_PANEL_EXPAND_REPORTS:
            {
                stateCopy.panelProperties.panelExpanded = !stateCopy.panelProperties.panelExpanded;
                return stateCopy;
            }
        case reportsActionTypes.SET_PANEL_RELOAD_REPORTS:
            {
                if (stateCopy.surveySubmittedModel.data)
                    stateCopy.surveySubmittedModel.data.length = 0;
                if (stateCopy.surveySubmittedModel.headers)
                    stateCopy.surveySubmittedModel.headers.length = 0;
                if (stateCopy.surveySubmittedModel.jsonData)
                    stateCopy.surveySubmittedModel.jsonData.length = 0;
                stateCopy.surveySubmittedModel.submittedSurveyGridModel.currentPage = 1;
                stateCopy.surveySubmittedModel.submittedSurveyGridModel.totalEntries = 0;
                stateCopy.surveySubmittedModel.submittedSurveyGridModel.totalPages = 0;
                stateCopy.panelProperties.panelReload = action.payload;
                return stateCopy;
            }
        case reportsActionTypes.SET_PANEL_COLLAPSE_REPORTS:
            {
                stateCopy.panelProperties.panelCollapsed = !stateCopy.panelProperties.panelCollapsed;
                return stateCopy;
            }
        case reportsActionTypes.SET_PANEL_REMOVE_REPORTS:
            {
                stateCopy.panelProperties.panelRemoved = action.payload;
                return stateCopy;
            }
        case reportsActionTypes.SET_BOROUGHS_AND_SITES_REPORTS:
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
                    stateCopy.filterModel.boroughs.sort((a, b) => {
                        return (a.boroughName.trim() < b.boroughName.trim() ? -1 : (a.boroughName.trim() > b.boroughName.trim() ? 1 : 0));
                    });


                    let currentUserBoroughs = AuthorizationRules.getCurrentUserBoroughNames();
                    if (currentUserBoroughs) {
                        stateCopy.filterModel.boroughs = stateCopy.filterModel.boroughs.filter((m) => currentUserBoroughs.indexOf(m.boroughName.replace(/ /g, '').toLowerCase()) > -1 || m.boroughId == -1);
                    }
                    let currentUserSites = AuthorizationRules.getCurrentUserSiteNames();
                    if (currentUserSites) {
                        stateCopy.filterModel.sites = stateCopy.filterModel.sites.filter((m) => (currentUserSites.indexOf(m.siteName.replace(/ /g, '').toLowerCase()) > -1) || m.siteId == -1);
                    }
                    return stateCopy;
                }

            }

        case reportsActionTypes.SET_SITE_REPORTS:
            {
                stateCopy.filterModel.selectedSite = action.payload.value;
                return stateCopy;
            }
        case reportsActionTypes.SET_BOROUGH_REPORTS:
            {
                stateCopy.filterModel.selectedBorough = action.payload.value;
                stateCopy.filterModel.selectedSite = null;
                return stateCopy;
            }
        case reportsActionTypes.SET_REPORTS_SURVEYS_SUBMITTED_LIST:
            {
                stateCopy.surveySubmittedModel.data.length = 0;
                stateCopy.surveySubmittedModel.headers.length = 0;
                stateCopy.surveySubmittedModel.jsonData.length = 0;
                stateCopy.surveySubmittedModel.jsonData = action.payload.value;
                if (action.payload.headerAnddata && action.payload.headerAnddata.length > 0) {
                    stateCopy.surveySubmittedModel.headers = action.payload.headerAnddata[0];
                }
                if (action.payload.headerAnddata && action.payload.headerAnddata.length > 1) {
                    stateCopy.surveySubmittedModel.data = action.payload.headerAnddata.slice(1);
                }
                stateCopy.surveySubmittedModel.submittedSurveyGridModel.currentPage = action.payload.submittedSurveyGridModel.current_page;
                stateCopy.surveySubmittedModel.submittedSurveyGridModel.perPage = action.payload.submittedSurveyGridModel.per_page;
                stateCopy.surveySubmittedModel.submittedSurveyGridModel.totalEntries = action.payload.submittedSurveyGridModel.total_entries;
                stateCopy.surveySubmittedModel.submittedSurveyGridModel.totalPages = action.payload.submittedSurveyGridModel.total_pages;
                return stateCopy;
            }
        case reportsActionTypes.SHOW_VALIDATION_MESSAGE:
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
        case reportsActionTypes.RESET: {
            stateCopy = reportsState;
            return stateCopy;
        }
        default:
            return state;
    }

};