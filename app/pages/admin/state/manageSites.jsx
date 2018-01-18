import { Constants } from "../../../common/app-settings/constants";

export const manageSitesState = {
    allSites: [],
    isManageSitesModelOpened: false,
    popupLoaderShown: false,
    isCreatingSite: false,
    editSiteObject: null,
    panelProperties: {
        "panelAutoReloadInterval": "2m",
        "lastUpdatedOn": null,
        "panelExpanded": false,
        "displayRefreshButton": true,
        "panelReload": false,
        "panelCollapsed": false,
        "panelRemoved": false
    },
    filterModel: {
        "boroughs": [],
        "sites": [],
        "selectedBorough": null,
        "selectedSite": null
    },
    "validation": {
        "message": "",
        "type": Constants.validation.types.success.key,
        "isPopup": false
    },
    defaultSiteType: { id: 3, label: 'None', isSelected: true },
    siteTypes: [{ id: 1, label: 'MTA', isSelected: false }, { id: 2, label: 'Pilot', isSelected: false }, { id: 3, label: 'None', isSelected: true }, { id: 4, label: 'Multisite', isSelected: false }]
};