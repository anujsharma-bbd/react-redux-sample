import { manageSitesActionTypes } from "../actions/manageSitesActionTypes.jsx";
import { manageSitesState } from "../state/manageSites";
import { Utility } from "../../../common/utility/index.jsx";
import { Constants } from "../../../common/app-settings/constants";
import { AuthorizationRules } from "../../shared/services/authorization.rules";

export default (state = manageSitesState, action) => {

    let stateCopy = {};
    /**
     * Creates a copy of the state on which actions will be performed.
     */
    if (manageSitesActionTypes[action.type]) {
        stateCopy = JSON.parse(JSON.stringify(state));
    }

    switch (action.type) {
        case manageSitesActionTypes.SET_BOROUGH_SITES_MNG:
            /**
             * sets boroughs and sites fetched from graphQL.
             */
            {
                let data = action.payload.data;
                if (data != null && data.zone && data.zone.length > 0) {
                    stateCopy.filterModel.boroughs = [];
                    stateCopy.allSites = [];
                    data.zone.forEach((borough) => {
                        stateCopy.filterModel.boroughs.push({ boroughId: borough.id, boroughName: borough.name });
                        if (borough.site != null && borough.site.length > 0) {
                            borough.site.forEach(site => {
                                stateCopy.allSites.push({ boroughId: borough.id, siteId: site.id, siteName: site.name, siteLabel: site.label, properties: site.properties });
                            })
                        }
                    })
                    stateCopy.filterModel.boroughs.push({ boroughId:-1, boroughName: "All"});
                    stateCopy.allSites.sort((a, b) => {
                        return (a.siteName.trim() < b.siteName.trim() ? -1 : (a.siteName.trim() > b.siteName.trim() ? 1 : 0));
                    });
                    // stateCopy.filterModel.boroughs.sort((a, b) => {
                    //     return (a.boroughName.trim() < b.boroughName.trim() ? -1 : (a.boroughName.trim() > b.boroughName.trim() ? 1 : 0));
                    // });
                }
                stateCopy.filterModel.selectedBorough = { boroughId:-1, boroughName: "All"};
                if (action.payload.setSelectedBorough) {
                    // select item if there is only one in the list of Borough/Site/Teams
                    let allBoroughs = stateCopy.filterModel.boroughs.filter(m => m.boroughId != -1);
                    if (allBoroughs && allBoroughs.length == 1) {
                        stateCopy.filterModel.selectedBorough = allBoroughs[0];
                    }
                    else
                        stateCopy.filterModel.selectedBorough = { boroughId:-1, boroughName: "All"};
                }

                return stateCopy;
            }
        case manageSitesActionTypes.SHOW_VALIDATION_MESSAGE_MNG:
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
        case manageSitesActionTypes.SET_BOROUGH_MNG:
            {
                /**
                 * Set the selected borough and filter sites on selected borough.
                 */
                stateCopy.filterModel.selectedBorough = action.payload.value;
                return stateCopy;
            }
        case manageSitesActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH_MNG:
            {
                stateCopy.panelProperties.panelReload = action.payload;
                return stateCopy;
            }
        case manageSitesActionTypes.SHOW_VALIDATION_MESSAGE_MNG:
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
        case manageSitesActionTypes.SET_PANEL_EXPAND_ADMIN_MNG:
            {
                stateCopy.panelProperties.panelExpanded = !stateCopy.panelProperties.panelExpanded;
                return stateCopy;
            }
        case manageSitesActionTypes.SET_PANEL_COLLAPSE_ADMIN_MNG:
            {
                stateCopy.panelProperties.panelCollapsed = !stateCopy.panelProperties.panelCollapsed;
                return stateCopy;
            }
        case manageSitesActionTypes.SET_PANEL_REMOVE_ADMIN_MNG:
            {
                stateCopy.panelProperties.panelRemoved = action.payload;
                return stateCopy;
            }
        case manageSitesActionTypes.SET_MANAGE_SITE_DIALOG_OPEN:
            {
                stateCopy.isManageSitesModelOpened = action.payload.IsOpen;
                stateCopy.editSiteObject = action.payload.data;
                stateCopy.editSiteObject?stateCopy.editSiteObject.boroughName  = action.payload.borough?action.payload.borough.boroughName:null:null;
                stateCopy.validation.message = action.payload.validationMessage;
                stateCopy.validation.isPopup = false;
                if (stateCopy.isManageSitesModelOpened) {
                    stateCopy.siteTypes.forEach(c => {
                        if (action.payload.data && action.payload.data.properties.siteType)
                            c.isSelected = (c.label.toLowerCase() == action.payload.data.properties.siteType.toLowerCase());
                        else
                            c.isSelected = (c.id == stateCopy.defaultSiteType.id);
                    })
                } else {
                    stateCopy.siteTypes.forEach(c => {
                        c.isSelected = (c.id == stateCopy.defaultSiteType.id);
                    })
                }
                stateCopy.validation.type = Constants.validation.types.success.key;
                return stateCopy;
            }
        case manageSitesActionTypes.SET_POPUPLOADER_TOGGLE_MNG:
            {
                stateCopy.popupLoaderShown = action.payload;
                return stateCopy;
                break;
            }
        case manageSitesActionTypes.SET_UPDATE_SITE_DETAILS:
            {
                let siteObject = action.payload.siteObject;
                if (siteObject.action == Constants.action.add) {
                    stateCopy.allSites.push({ boroughId: siteObject.boroughId, siteId: siteObject.id, siteName: siteObject.siteName, siteLabel: siteObject.siteLabel, properties: { maxCanvPerSite: siteObject.maxCanvPerSite, siteType: siteObject.siteType } });
                } else if (siteObject.action == Constants.action.update) {
                    let index = stateCopy.allSites.findIndex(site => site.siteId == siteObject.id);
                    if (stateCopy.allSites[index]["properties"]) {
                        stateCopy.allSites[index]["properties"]["maxCanvPerSite"] = siteObject.maxCanvPerSite;
                        stateCopy.allSites[index]["properties"]["siteType"] = siteObject.siteType;
                        siteObject["properties"] = stateCopy.allSites[index]["properties"]
                    }
                    else
                        stateCopy.allSites[index]["properties"] = { maxCanvPerSite: siteObject.maxCanvPerSite, siteType: siteObject.siteType };

                } else if (siteObject.action == Constants.action.delete) {
                    stateCopy.allSites = stateCopy.allSites.filter(m => m.siteId != siteObject.id);
                }
                // sort all sites again
                stateCopy.allSites.sort((a, b) => {
                    return (a.siteName.trim() < b.siteName.trim() ? -1 : (a.siteName.trim() > b.siteName.trim() ? 1 : 0));
                });
                return stateCopy;
            }
        case manageSitesActionTypes.SET_SITE_TYPE:
            {
                stateCopy.siteTypes.forEach(c => {
                    c.isSelected = (action.payload.value && (c.id == action.payload.value.id));
                })
                return stateCopy;
            }
        default:
            return state
    }

}
