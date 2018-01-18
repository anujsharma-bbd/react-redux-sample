import React from 'react';
import store from '../app/pages/shared/store';
import adminReducer from '../app/pages/admin/reducers/adminReducer';
import { Constants } from "../app/common/app-settings/constants";
import {Utility} from "../app/common/utility/"
import {storageMock} from "./storageMock"
  // mock the localStorage
window.localStorage = storageMock();
// admin reducer object initilization
describe(('Admin Reducer'), () => {
    let initialState = {
        "panelProperties": {
            "panelAutoReloadInterval": "2m",
            "lastUpdatedOn": null,
            "panelExpanded": false,
            "displayRefreshButton": false,
            "panelReload": false,
            "panelCollapsed": false,
            "panelRemoved": false
        },
        "createTeamModel": {
            "teamName": "",
            "selectedBorough": null,
            "selectedSite": null
        },
        "filterModel": {
            "boroughs": [],
            "sites": [],
            "selectedBorough": null,
            "selectedSite": null
        },
        "rightSideModel": {
            "createCanvasserModalIsOpened": false,
            "editCanvasser": {},
            "keywordSearchCanvModel": {
                "selectedOption": null
            },
            "keywordSearchRoutesModel": {
                "selectedOption": null
            },
            "statusModel": {
                "selectedCanvOption": {
                    "label": "All",
                    "value": "All"
                },
                "selectedRoutesOption": {
                    "label": "All",
                    "value": "All"
                },
                "options": [
                    {
                        "type": "canvasser",
                        "label": "All",
                        "value": "All"
                    },
                    {
                        "type": "canvasser",
                        "label": "Assigned",
                        "value": "assigned"
                    },
                    {
                        "type": "canvasser",
                        "label": "UnAssigned",
                        "value": "unAssigned"
                    },
                    {
                        "type": "route",
                        "label": "All",
                        "value": "All"
                    },
                    {
                        "type": "route",
                        "label": "Not Started",
                        "value": Constants.routesStatus.not_started
                    },
                    {
                        "type": "route",
                        "label": "In Progress",
                        "value": Constants.routesStatus.in_progress
                    },
                    {
                        "type": "route",
                        "label": "Completed",
                        "value": Constants.routesStatus.completed
                    }
                ]
            },
            "searchedCanvassers": [],
            "initialSearchedRoutes": [],
            "initialSearchedCanvassers": [],
            "searchedRoutes": []
        },
        "createTeamModalIsOpened": false,
        "editTeamModalIsOpened": false,
        "jumpTeamModalIsOpened": false,
        "popupLoaderShown": false,
        "routeCanvasLoaderShown": false,
        "searchedTeams": [],
        "teamToEdit": {
            "users": [],
            "routes": []
        },
        "validation": {
            "message": "",
            "type": Constants.validation.types.success.key,
            "isPopup": false
        }
    }
        ;

    it('should handle action SET_RIGHT_SIDE_LOADERS', () => {
        expect(adminReducer(store.getState().adminModel, { type: 'SET_RIGHT_SIDE_LOADERS', payload: true })).toEqual(
            { "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": null, "teamName": "" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [] }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": { "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": { "options": [{"label": "All", "type": "canvasser", "value": "All"}, {"label": "Assigned", "type": "canvasser", "value": "assigned"}, {"label": "UnAssigned", "type": "canvasser", "value": "unAssigned"}, {"label": "All", "type": "route", "value": "All"}, {"label": "Assigned", "type": "route", "value": "assigned"}, {"label": "UnAssigned", "type": "route", "value": "unAssigned"}], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" } } }, "routeCanvasLoaderShown": true, "searchedTeams": [], "teamToEdit": { "routes": [], "users": [] }, "validation": { "isPopup": false, "message": "", "type": "Success" } });
    });

    it('should handle action SET_ROUTE_TYPE', () => {
        initialState.teamToEdit.routes = [{
            id: 0,
            routeType: "Subway"
        }]
        expect(adminReducer(initialState, {
            type: 'SET_ROUTE_TYPE', payload: {
                routeId: 0, routeType: {
                    value: 1, label: "Park"
                }
            }
        })).toEqual(
            {
                "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": null, "teamName": "" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [] }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": false, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": { "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": { "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" } } }, "routeCanvasLoaderShown": false, "searchedTeams": [], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Park" }], "users": [] }, "validation":
                { "isPopup": false, "message": "", "type": "Success" }
            }
            );
    })

    it('should handle action SET_PANEL_RELOAD_ADMIN_REFRESH', () => {
        initialState.panelProperties.panelReload = true;
        expect(adminReducer(initialState, { type: 'SET_PANEL_RELOAD_ADMIN_REFRESH', payload: true })).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": null, "teamName": "" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [] }, "jumpTeamModalIsOpened": false, "panelProperties": {
                "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval":
                "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false
            }, "popupLoaderShown": false, "rightSideModel": { "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": { "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" } } }, "routeCanvasLoaderShown": false, "searchedTeams": [], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [] }, "validation": { "isPopup": false, "message": "", "type": "Success" }
        });
    });

    it('should handle action REMOVE_TEAM', () => {
        initialState.searchedTeams = [{ id: 0 }, { id: 1 }, { id: 2 }];
        expect(adminReducer(initialState, { type: 'REMOVE_TEAM', payload: 0 })).toEqual({ "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": null, "teamName": "" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [] }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": { "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": { "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" } } }, "routeCanvasLoaderShown": false, "searchedTeams": [{ "id": 1 }, { "id": 2 }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [] }, "validation": { "isPopup": false, "message": "", "type": "Success" } })
    });

    it('should handle action SET_TEAM_NAME', () => {
        initialState.createTeamModel.teamName = 'Team_1';
        expect(adminReducer(initialState, { type: 'SET_TEAM_NAME', payload: 'Team_2' })).toEqual({ "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": null, "teamName": undefined }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [] }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": { "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": { "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" } } }, "routeCanvasLoaderShown": false, "searchedTeams": [{ "id": 0 }, { "id": 1 }, { "id": 2 }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [] }, "validation": { "isPopup": false, "message": "", "type": "Success" } });
    });

    it('should handle action SET_TEAM_LEADER', () => {
        initialState.teamToEdit.users = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
        initialState.searchedTeams = [{ teamId: 0, users: [{ id: 4 }, { id: 1 }] }, { teamId: 1, users: [{ id: 2 }, { id: 3 }] }]

        expect(adminReducer(initialState, { type: 'SET_TEAM_LEADER', payload: { Leader: { id: 2 } } })).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": null, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": {
                "boroughs":
                [], "selectedBorough": null, "selectedSite": null, "sites": []
            }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": {
                    "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" },
                    { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" }
                }
            }, "routeCanvasLoaderShown": false, "searchedTeams": [{ "teamId": 0, "users": [{ "id": 4 }, { "id": 1 }] }, { "teamId": 1, "users": [{ "id": 2 }, { "id": 3 }] }],
            "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1, "isTeamLeader": "false" }, { "id": 2, "isTeamLeader": "true" }, { "id": 3, "isTeamLeader": "false" }, { "id": 4, "isTeamLeader": "false" }] }, "validation": { "isPopup": false, "message": "", "type": "Success" }
        });


    });

    it('should handle action SET_ROUTE_CANVAS_LOADER_TOGGLE', () => {
        initialState.routeCanvasLoaderShown = true;
        initialState.panelProperties.panelReload = true;

        expect(adminReducer(initialState, { type: 'SET_ROUTE_CANVAS_LOADER_TOGGLE', payload: { showCanvRoutLoader: false, showTeamLoader: false } })).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": null, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": {
                "boroughs":
                [], "selectedBorough": null, "selectedSite": null, "sites": []
            }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": false, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null },
                "searchedCanvassers": [], "searchedRoutes": [], "statusModel": {
                    "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" },
                    { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" }
                }
            }, "routeCanvasLoaderShown": false, "searchedTeams": [{ "teamId": 0, "users": [{ "id": 4 }, { "id": 1 }] }, { "teamId": 1, "users": [{ "id": 2 }, { "id": 3 }] }]
            , "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": { "isPopup": false, "message": "", "type": "Success" }
        });
    });

    it('should handle action RESET_CREATE_TEAM_MODEL', () => {
        expect(adminReducer(initialState, { type: 'RESET_CREATE_TEAM_MODEL', payload: null })).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": null, "teamName": "" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [] }, "jumpTeamModalIsOpened": false, "panelProperties": {
                "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval":
                "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false
            }, "popupLoaderShown": false, "rightSideModel": { "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": { "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" } } }, "routeCanvasLoaderShown": true, "searchedTeams": [{ "teamId": 0, "users": [{ "id": 4 }, { "id": 1 }] }, { "teamId": 1, "users": [{ "id": 2 }, { "id": 3 }] }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": { "isPopup": false, "message": "", "type": "Success" }
        });
    });

    it('should handle action REMOVE_TEAM_ALL_ROUTE', () => {
        initialState.searchedTeams = [{ id: 1, routes: [{ id: 0 }, { id: 1 }, { id: 2 },] }, { id: 2, routes: [{ id: 3 }, { id: 4 }] }];

        expect(adminReducer(initialState, { type: 'REMOVE_TEAM_ALL_ROUTE', payload: { teamId: 2 } })).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": null, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": {
                "boroughs":
                [], "selectedBorough": null, "selectedSite": null, "sites": []
            }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": {
                    "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" },
                    { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" }
                }
            }, "routeCanvasLoaderShown": true, "searchedTeams": [{ "id": 1, "routes": [{ "id": 0 }, { "id": 1 }, { "id": 2 }] }, { "id": 2, "routes": [] }], "teamToEdit": { "id": 2, "routes": [] }, "validation": { "isPopup": false, "message": "All routes have been removed from the team.", "type": "Success" }
        });
    });
    it('should handle action REMOVE_TEAM_ROUTE', () => {
        initialState.searchedTeams = [{ id: 1, routes: [{ id: 0 }, { id: 1 }, { id: 2 },] }, { id: 2, routes: [{ id: 3 }, { id: 4 }] }];
        expect((adminReducer(initialState, { type: 'REMOVE_TEAM_ROUTE', payload: { teamId: 1, routeId: 2 } }))).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": null, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [] }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": {
                    "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" },
                    { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" }
                }
            }, "routeCanvasLoaderShown": true, "searchedTeams": [{ "id": 1, "routes": [{ "id": 0 }, { "id": 1 }] }, { "id": 2, "routes": [{ "id": 3 }, { "id": 4 }] }], "teamToEdit": { "id": 1, "routes": [{ "id": 0 }, { "id": 1 }] }, "validation": { "isPopup": false, "message": "Route \"undefined\" has been removed from the team.", "type": "Success" }
        });
    });
    it('should handle action REMOVE_TEAM_MEMBER', () => {
        initialState.searchedTeams = [{ id: 1, users: [{ id: 0 }, { id: 1 }, { id: 2 },] }, { id: 2, users: [{ id: 3 }, { id: 4 }] }];
        expect((adminReducer(initialState, { type: 'REMOVE_TEAM_MEMBER', payload: { teamId: 1, userId: 0 } }))).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": null, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [] }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": {
                    "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" },
                    { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" }
                }
            }, "routeCanvasLoaderShown": true, "searchedTeams": [{ "id": 1, "users": [{ "id": 1 }, { "id": 2 }] }, { "id": 2, "users": [{ "id": 3 }, { "id": 4 }] }], "teamToEdit": { "id": 1, "users": [{ "id": 1 }, { "id": 2 }] }, "validation": { "isPopup": false, "message": "Member \"undefined\" has been removed from the team.", "type": "Success" }
        });
    });
    it('should handle action CREATE_TEAM_SET_BOROUGH_SITE', () => {
        initialState.filterModel.sites = [{ boroughId: 0 }, { boroughId: 1 }, { boroughId: 2 }, { boroughId: 3 }]
        expect((adminReducer(initialState, { type: 'CREATE_TEAM_SET_BOROUGH_SITE', payload: { borough: { boroughId: 0 }, site: { boroughId: 0, sitesId: 0 } } }))).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": { "boroughId": 0 }, "selectedSite": { "boroughId": 0, "sitesId": 0 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 0 }, { "boroughId": 1 }, { "boroughId": 2 }, { "boroughId": 3 }] }, "jumpTeamModalIsOpened":
            false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": {
                    "options": [{
                        "label"
                        : "All", "type": "canvasser", "value": "All"
                    }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, {
                        "label": "All",
                        "type": "route", "value": "All"
                    }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" }
                }
            }, "routeCanvasLoaderShown": true, "searchedTeams": [{ "id": 1, "users": [{ "id": 0 }, { "id": 1 }, { "id": 2 }] }, { "id": 2, "users": [{ "id": 3 }, { "id": 4 }] }], "teamToEdit": {
                "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 },
                { "id": 3 }, { "id": 4 }]
            }, "validation": { "isPopup": false, "message": "", "type": "Success" }
        });
    });

    it('should handle action CREATE_TEAM_SET_BOROUGH', () => {
        initialState.filterModel.sites = [{ boroughId: 1, siteId: 0, siteName: "Hunter College" },
        { boroughId: 1, siteId: 1, siteName: "Brooklyn" },
        { boroughId: 1, siteId: 2, siteName: "Hostos" },
        { boroughId: 1, siteId: 3, siteName: "LaGuardia" }]
        expect((adminReducer(initialState, { type: 'CREATE_TEAM_SET_BOROUGH', payload: { boroughId: 2 } }))).toEqual({ "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": undefined, "selectedSite": null, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 1, "siteName": "Brooklyn" }, { "boroughId": 1, "siteId": 2, "siteName": "Hostos" }, { "boroughId": 1, "siteId": 0, "siteName": "Hunter College" }, { "boroughId": 1, "siteId": 3, "siteName": "LaGuardia" }] }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": { "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": { "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" } } }, "routeCanvasLoaderShown": true, "searchedTeams": [{ "id": 1, "users": [{ "id": 0 }, { "id": 1 }, { "id": 2 }] }, { "id": 2, "users": [{ "id": 3 }, { "id": 4 }] }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": { "isPopup": false, "message": "", "type": "Success" } });
    });

    it('should handle action CREATE_TEAM_SET_SITE', () => {
        initialState.createTeamModel.selectedSite = { boroughId: 1, siteId: 1 };
        expect((adminReducer(initialState, { type: 'CREATE_TEAM_SET_SITE', payload: { value: { boroughId: 1, siteId: 2 } } }))).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 2 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 0, "siteName": "Hunter College" }, { "boroughId": 1, "siteId": 1, "siteName": "Brooklyn" }, { "boroughId": 1, "siteId": 2, "siteName": "Hostos" }, { "boroughId": 1, "siteId": 3, "siteName": "LaGuardia" }] }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": {
                    "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption":
                    { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" }
                }
            }, "routeCanvasLoaderShown": true, "searchedTeams": [{
                "id": 1, "users": [{ "id": 0 }, { "id": 1 }, { "id": 2 }]
            }, { "id": 2, "users": [{ "id": 3 }, { "id": 4 }] }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": {
                "isPopup": false,
                "message": "", "type": "Success"
            }
        });

    });

    it('should handle action SET_SITE', () => {
        expect((adminReducer(initialState, { type: 'SET_SITE', payload: { value: { boroughId: 1, siteId: 1 }, showLoader: true } }))).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": {
                "boroughs": [], "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "sites": [{ "boroughId": 1, "siteId": 0, "siteName": "Hunter College" }, {
                    "boroughId": 1, "siteId"
                    : 1, "siteName": "Brooklyn"
                }, { "boroughId": 1, "siteId": 2, "siteName": "Hostos" }, { "boroughId": 1, "siteId": 3, "siteName": "LaGuardia" }]
            }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": "" }, "keywordSearchRoutesModel": { "selectedOption": "" }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": {
                    "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }],
                    "selectedCanvOption": { "label": "All", "type": "canvasser", "value": "All" }, "selectedRoutesOption": { "label": "All", "type": "route", "value": "All" }
                }
            }, "routeCanvasLoaderShown": true, "searchedTeams": [{ "id": 1, "users": [{ "id": 0 }, { "id": 1 }, { "id": 2 }] }, { "id": 2, "users": [{ "id": 3 }, { "id": 4 }] }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": { "isPopup": false, "message": "", "type": "Success" }
        });
    });

    it('should handle action SET_BOROUGH', () => {
        initialState.filterModel.sites = [{ boroughId: 1, siteId: 1 }, { boroughId: 1, siteId: 2 }, { boroughId: 1, siteId: 3 }, { boroughId: 1, siteId: 4 }, { boroughId: 2, siteId: 1 }, { boroughId: 2, siteId: 2 }, { boroughId: 3, siteId: 1 }, { boroughId: 3, siteId: 2 }];
        expect((adminReducer(initialState, { type: 'SET_BOROUGH', payload: { boroughId: 2 } }))).toEqual({ "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": undefined, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 1 }, { "boroughId": 1, "siteId": 2 }, { "boroughId": 1, "siteId": 3 }, { "boroughId": 1, "siteId": 4 }, { "boroughId": 2, "siteId": 1 }, { "boroughId": 2, "siteId": 2 }, { "boroughId": 3, "siteId": 1 }, { "boroughId": 3, "siteId": 2 }] }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": false, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": { "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": "" }, "keywordSearchRoutesModel": { "selectedOption": "" }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": { "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "type": "canvasser", "value": "All" }, "selectedRoutesOption": { "label": "All", "type": "route", "value": "All" } } }, "routeCanvasLoaderShown": false, "searchedTeams": [], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": { "isPopup": false, "message": "", "type": "Success" } });
    });

    it('should handle action SET_JUMP_TEAM_DIALOG_OPEN', () => {
        expect((adminReducer(initialState, { type: 'SET_JUMP_TEAM_DIALOG_OPEN', payload: { IsOpen: true, teamOpened: true } }))).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 1 }, { "boroughId": 1, "siteId": 2 }, { "boroughId": 1, "siteId": 3 }, { "boroughId": 1, "siteId": 4 }, { "boroughId": 2, "siteId": 1 }, { "boroughId": 2, "siteId": 2 }, { "boroughId": 3, "siteId": 1 }, { "boroughId": 3, "siteId": 2 }] }, "jumpTeamModalIsOpened": true, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": {
                    "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }],
                    "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" }
                }
            }, "routeCanvasLoaderShown": true, "searchedTeams": [{
                "id": 1, "users": [{ "id": 0 },
                { "id": 1 }, { "id": 2 }]
            }, { "id": 2, "users": [{ "id": 3 }, { "id": 4 }] }], "teamToEdit": true, "validation": { "isPopup": false, "message": undefined, "type": "Success" }
        });
    });

    it('should handle action SET_EDIT_TEAM_DIALOG_OPEN', () => {
        expect((adminReducer(initialState, { type: 'SET_EDIT_TEAM_DIALOG_OPEN', payload: { IsOpen: true, teamOpened: true } }))).toEqual(
            {
                "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "teamName": "Team_1" }, "editTeamModalIsOpened": true, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 1 }, { "boroughId": 1, "siteId": 2 }, { "boroughId": 1, "siteId": 3 }, { "boroughId": 1, "siteId": 4 }, { "boroughId": 2, "siteId": 1 }, { "boroughId": 2, "siteId": 2 }, { "boroughId": 3, "siteId": 1 }, { "boroughId": 3, "siteId": 2 }] }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                    "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": {
                        "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" },
                        { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }],
                        "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" }
                    }
                }, "routeCanvasLoaderShown": true, "searchedTeams": [{
                    "id": 1, "users": [{ "id": 0 },
                    { "id": 1 }, { "id": 2 }]
                }, { "id": 2, "users": [{ "id": 3 }, { "id": 4 }] }], "teamToEdit": true, "validation": { "isPopup": false, "message": undefined, "type": "Success" }
            });
    });

    it('should handle action SET_TEAM_DIALOG_OPEN', () => {
        expect((adminReducer(initialState, { type: 'SET_TEAM_DIALOG_OPEN', payload: { IsOpen: true } }))).toEqual({
            "createTeamModalIsOpened": true, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 1 }, { "boroughId": 1, "siteId": 2 }, { "boroughId": 1, "siteId": 3 }, { "boroughId": 1, "siteId": 4 }, { "boroughId": 2, "siteId": 1 }, { "boroughId": 2, "siteId": 2 }, { "boroughId": 3, "siteId": 1 }, { "boroughId": 3, "siteId": 2 }] }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": {
                    "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" },
                    { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }],
                    "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" }
                }
            }, "routeCanvasLoaderShown": true, "searchedTeams": [{
                "id": 1, "users": [{ "id": 0 },
                { "id": 1 }, { "id": 2 }]
            }, { "id": 2, "users": [{ "id": 3 }, { "id": 4 }] }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": { "isPopup": false, "message": "", "type": "Success" }
        });
    });

    it('should handle action SET_CONVASSERS_DIALOG_OPEN', () => {
        expect((adminReducer(initialState, { type: 'SET_CONVASSERS_DIALOG_OPEN', payload: { IsOpen: true } }))).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 1 }, { "boroughId": 1, "siteId": 2 }, { "boroughId": 1, "siteId": 3 }, { "boroughId": 1, "siteId": 4 }, { "boroughId": 2, "siteId": 1 }, { "boroughId": 2, "siteId": 2 }, { "boroughId": 3, "siteId": 1 }, { "boroughId": 3, "siteId": 2 }] }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": true, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": {
                    "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" },
                    { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }],
                    "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" }
                }
            }, "routeCanvasLoaderShown": true, "searchedTeams": [{
                "id": 1, "users": [{ "id": 0 },
                { "id": 1 }, { "id": 2 }]
            }, { "id": 2, "users": [{ "id": 3 }, { "id": 4 }] }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": { "isPopup": false, "message": "", "type": "Success" }
        });
    });

    it('should handle action SET_EDIT_CANVASSER_DIALOG_OPEN', () => {
        expect((adminReducer(initialState, { type: 'SET_EDIT_CANVASSER_DIALOG_OPEN', payload: { IsOpen: true } }))).toEqual({ "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 1 }, { "boroughId": 1, "siteId": 2 }, { "boroughId": 1, "siteId": 3 }, { "boroughId": 1, "siteId": 4 }, { "boroughId": 2, "siteId": 1 }, { "boroughId": 2, "siteId": 2 }, { "boroughId": 3, "siteId": 1 }, { "boroughId": 3, "siteId": 2 }] }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": { "createCanvasserModalIsOpened": true, "editCanvasser": undefined, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": { "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" } } }, "routeCanvasLoaderShown": true, "searchedTeams": [{ "id": 1, "users": [{ "id": 0 }, { "id": 1 }, { "id": 2 }] }, { "id": 2, "users": [{ "id": 3 }, { "id": 4 }] }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": { "isPopup": false, "message": "", "type": "Success" } });
    });

    it('should handle action SET_LOG_OUT', () => {
        expect((adminReducer(initialState, { type: 'SET_LOG_OUT', payload: {} }))).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": null, "teamName": "" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [] }, "jumpTeamModalIsOpened": false, "panelProperties": {
                "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval":
                "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": false, "panelRemoved": false
            }, "popupLoaderShown": false, "rightSideModel": { "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": { "options": [{"label": "All", "type": "canvasser", "value": "All"}, {"label": "Assigned", "type": "canvasser", "value": "assigned"}, {"label": "UnAssigned", "type": "canvasser", "value": "unAssigned"}, {"label": "All", "type": "route", "value": "All"}, {"label": "Assigned", "type": "route", "value": "assigned"}, {"label": "UnAssigned", "type": "route", "value": "unAssigned"}], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" } } }, "routeCanvasLoaderShown": false, "searchedTeams": [], "teamToEdit": { "routes": [], "users": [] }, "validation": { "isPopup": false, "message": "", "type": "Success" }
        });
    });

    it('should handle action SET_ROUTES_SEARCHED_RESULTS', () => {
        let searchedRoutes = [{ routeId: 1, routeStatus: 'not_started' }, { routeId: 2, routeStatus: 'not_started' }, { routeId: 3, routeStatus: 'not_started' }, { routeId: 4, routeStatus: 'in_progress' },
        { routeId: 5, routeStatus: 'in_progress' }, { routeId: 6, routeStatus: 'completed' }, { routeId: 7, routeStatus: 'completed' }];

        expect((adminReducer(initialState, { type: 'SET_ROUTES_SEARCHED_RESULTS', payload: searchedRoutes }))).toEqual({ "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 1 }, { "boroughId": 1, "siteId": 2 }, { "boroughId": 1, "siteId": 3 }, { "boroughId": 1, "siteId": 4 }, { "boroughId": 2, "siteId": 1 }, { "boroughId": 2, "siteId": 2 }, { "boroughId": 3, "siteId": 1 }, { "boroughId": 3, "siteId": 2 }] }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": { "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [], "initialSearchedRoutes": [{ "routeId": 1, "routeStatus": "not_started" }, { "routeId": 2, "routeStatus": "not_started" }, { "routeId": 3, "routeStatus": "not_started" }, { "routeId": 4, "routeStatus": "in_progress" }, { "routeId": 5, "routeStatus": "in_progress" }, { "routeId": 6, "routeStatus": "completed" }, { "routeId": 7, "routeStatus": "completed" }], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [{ "routeId": 1, "routeStatus": "not_started" }, { "routeId": 2, "routeStatus": "not_started" }, { "routeId": 3, "routeStatus": "not_started" }, { "routeId": 4, "routeStatus": "in_progress" }, { "routeId": 5, "routeStatus": "in_progress" }, { "routeId": 6, "routeStatus": "completed" }, { "routeId": 7, "routeStatus": "completed" }], "statusModel": { "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" } } }, "routeCanvasLoaderShown": false, "searchedTeams": [{ "id": 1, "users": [{ "id": 0 }, { "id": 1 }, { "id": 2 }] }, { "id": 2, "users": [{ "id": 3 }, { "id": 4 }] }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": { "isPopup": false, "message": "", "type": "Success" } });
    });

    it('should handle action SET_CANVASSERS_SEARCHED_RESULTS', () => {
        let searchedCanvassers = [{ id: 1, name: "Test 1", teams: [{ id: 1, name: "Team_1" }] }, { id: 2, name: "Test 2", teams: [{ id: 3, name: "Team_2" }] }, { id: 3, name: "Test 3", teams: [{ id: 3, name: "Team_3" }] },
        { id: 4, name: "Test 4", teams: [{ id: 4, name: "Team_4" }] }, { id: 5, name: "Test 5", teams: [{ id: 5, name: "Team_5" }] }, { id: 6, name: "Test 6", teams: [{ id: 6, name: "Team_6" }] }];

        expect((adminReducer(initialState, { type: 'SET_CANVASSERS_SEARCHED_RESULTS', payload: searchedCanvassers }))).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 1 }, { "boroughId": 1, "siteId": 2 }, { "boroughId": 1, "siteId": 3 }, { "boroughId": 1, "siteId": 4 }, { "boroughId": 2, "siteId": 1 }, { "boroughId": 2, "siteId": 2 }, { "boroughId": 3, "siteId": 1 }, { "boroughId": 3, "siteId": 2 }] }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [{ "canvasserStatus": "assigned", "id": 1, "name": "Test 1", "teams": [{ "id": 1, "name": "Team_1" }] }, { "canvasserStatus": "assigned", "id": 2, "name": "Test 2", "teams": [{ "id": 3, "name": "Team_2" }] }, { "canvasserStatus": "assigned", "id": 3, "name": "Test 3", "teams": [{ "id": 3, "name": "Team_3" }] }, { "canvasserStatus": "assigned", "id": 4, "name": "Test 4", "teams": [{ "id": 4, "name": "Team_4" }] }, { "canvasserStatus": "assigned", "id": 5, "name": "Test 5", "teams": [{ "id": 5, "name": "Team_5" }] }, { "canvasserStatus": "assigned", "id": 6, "name": "Test 6", "teams": [{ "id": 6, "name": "Team_6" }] }], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": null }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [{ "canvasserStatus": "assigned", "id": 1, "name": "Test 1", "teams": [{ "id": 1, "name": "Team_1" }] }, { "canvasserStatus": "assigned", "id": 2, "name": "Test 2", "teams": [{ "id": 3, "name": "Team_2" }] }, { "canvasserStatus": "assigned", "id": 3, "name": "Test 3", "teams": [{ "id": 3, "name": "Team_3" }] }, { "canvasserStatus": "assigned", "id": 4, "name": "Test 4", "teams": [{ "id": 4, "name": "Team_4" }] }, { "canvasserStatus": "assigned", "id": 5, "name": "Test 5", "teams": [{ "id": 5, "name": "Team_5" }] },
                { "canvasserStatus": "assigned", "id": 6, "name": "Test 6", "teams": [{ "id": 6, "name": "Team_6" }] }], "searchedRoutes": [], "statusModel": {
                    "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, {
                        "label": "Completed", "type": "route", "value": "completed"
                    }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" }
                }
            }, "routeCanvasLoaderShown": true, "searchedTeams": [{
                "id": 1, "users": [{
                    "id":
                    0
                }, { "id": 1 }, { "id": 2 }]
            }, { "id": 2, "users": [{ "id": 3 }, { "id": 4 }] }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": { "isPopup": false, "message": "", "type": "Success" }
        });
    });

    it('should handle action SET_STATUS for canvasser tab selected', () => {
        initialState.rightSideModel.initialSearchedCanvassers = [
            { id: 1, name: 'Sumit Kumar Verma', firstName: 'Sumit', lastName: 'Verma', email: 'sumit.verma@nagarro.com', canvasserStatus: 'assigned' },
            { id: 2, name: 'Anuj Sharma', firstName: 'Anuj', lastName: 'Sharma', email: 'anuj.sharma01@nagarro.com', canvasserStatus: 'assigned' },
            { id: 3, name: 'Sanni Kumar', firstName: 'Sanni', lastName: 'Kumar', email: 'sanni.kumar@nagarro.com', canvasserStatus: 'assigned' },
            { id: 4, name: 'Abhishek Verma', firstName: 'Abhishek', lastName: 'Verma', email: 'abhishek.verma@nagarro.com', canvasserStatus: 'unAssigned' },
            { id: 5, name: 'Vivek Kumar', firstName: 'Vivek', lastName: 'Kumar', email: 'vivek@nagarro.com', canvasserStatus: 'unAssigned' },
        ];
        initialState.rightSideModel.keywordSearchCanvModel.selectedOption = 'Verma';
        initialState.rightSideModel.statusModel.selectedCanvOption.value = 'assigned';
        expect((adminReducer(initialState, { type: 'SET_STATUS', payload: { convassersTabSelected: true, selection: { label: 'All', value: 'All' } } }))).toEqual(
            {
                "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel":
                {
                    "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 1 }, { "boroughId": 1, "siteId": 2 }, { "boroughId": 1, "siteId": 3 }, {
                        "boroughId": 1, "siteId": 4
                    }, { "boroughId": 2, "siteId": 1 }, { "boroughId": 2, "siteId": 2 }, { "boroughId": 3, "siteId": 1 }, { "boroughId": 3, "siteId": 2 }]
                }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": { "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [{ "canvasserStatus": "assigned", "email": "sumit.verma@nagarro.com", "firstName": "Sumit", "id": 1, "lastName": "Verma", "name": "Sumit Kumar Verma" }, { "canvasserStatus": "assigned", "email": "anuj.sharma01@nagarro.com", "firstName": "Anuj", "id": 2, "lastName": "Sharma", "name": "Anuj Sharma" }, { "canvasserStatus": "assigned", "email": "sanni.kumar@nagarro.com", "firstName": "Sanni", "id": 3, "lastName": "Kumar", "name": "Sanni Kumar" }, { "canvasserStatus": "unAssigned", "email": "abhishek.verma@nagarro.com", "firstName": "Abhishek", "id": 4, "lastName": "Verma", "name": "Abhishek Verma" }, { "canvasserStatus": "unAssigned", "email": "vivek@nagarro.com", "firstName": "Vivek", "id": 5, "lastName": "Kumar", "name": "Vivek Kumar" }], "initialSearchedRoutes": [], "keywordSearchCanvModel": { "selectedOption": "Verma" }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [{ "canvasserStatus": "assigned", "email": "sumit.verma@nagarro.com", "firstName": "Sumit", "id": 1, "lastName": "Verma", "name": "Sumit Kumar Verma" }, { "canvasserStatus": "unAssigned", "email": "abhishek.verma@nagarro.com", "firstName": "Abhishek", "id": 4, "lastName": "Verma", "name": "Abhishek Verma" }], "searchedRoutes": [], "statusModel": { "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "All" } } }, "routeCanvasLoaderShown": true, "searchedTeams": [{ "id": 1, "users": [{ "id": 0 }, { "id": 1 }, { "id": 2 }] }, { "id": 2, "users": [{ "id": 3 }, { "id": 4 }] }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": {
                    "isPopup": false, "message"
                    : "", "type": "Success"
                }
            });
    });

    it('should handle action SET_STATUS for routes tab selected', () => {
        initialState.rightSideModel.initialSearchedRoutes = [
            { id: 1, name: 'T319', routeStatus: 'in_progress' },
            { id: 2, name: 'T219', routeStatus: 'in_progress' },
            { id: 3, name: 'T519', routeStatus: 'not_started' },
            { id: 4, name: 'T619', routeStatus: 'not_started' },
            { id: 5, name: 'T719', routeStatus: 'not_started' },
            { id: 6, name: 'T379', routeStatus: 'completed' },
            { id: 7, name: 'T3159', routeStatus: 'completed' },
            { id: 8, name: 'T3196', routeStatus: 'completed' },
        ];

        initialState.rightSideModel.keywordSearchCanvModel.selectedOption = '5';
        initialState.rightSideModel.statusModel.selectedRoutesOption.value = 'completed';

        expect((adminReducer(initialState, { type: 'SET_STATUS', payload: { convassersTabSelected: false, selection: { label: 'All', value: 'All' } } }))).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": { "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 1 }, { "boroughId": 1, "siteId": 2 }, { "boroughId": 1, "siteId": 3 }, { "boroughId": 1, "siteId": 4 }, { "boroughId": 2, "siteId": 1 }, { "boroughId": 2, "siteId": 2 }, { "boroughId": 3, "siteId": 1 }, { "boroughId": 3, "siteId": 2 }] }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": { "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [{ "canvasserStatus": "assigned", "email": "sumit.verma@nagarro.com", "firstName": "Sumit", "id": 1, "lastName": "Verma", "name": "Sumit Kumar Verma" }, { "canvasserStatus": "assigned", "email": "anuj.sharma01@nagarro.com", "firstName": "Anuj", "id": 2, "lastName": "Sharma", "name": "Anuj Sharma" }, { "canvasserStatus": "assigned", "email": "sanni.kumar@nagarro.com", "firstName": "Sanni", "id": 3, "lastName": "Kumar", "name": "Sanni Kumar" }, { "canvasserStatus": "unAssigned", "email": "abhishek.verma@nagarro.com", "firstName": "Abhishek", "id": 4, "lastName": "Verma", "name": "Abhishek Verma" }, { "canvasserStatus": "unAssigned", "email": "vivek@nagarro.com", "firstName": "Vivek", "id": 5, "lastName": "Kumar", "name": "Vivek Kumar" }], "initialSearchedRoutes": [{ "id": 1, "name": "T319", "routeStatus": "in_progress" }, { "id": 2, "name": "T219", "routeStatus": "in_progress" }, { "id": 3, "name": "T519", "routeStatus": "not_started" }, { "id": 4, "name": "T619", "routeStatus": "not_started" }, { "id": 5, "name": "T719", "routeStatus": "not_started" }, { "id": 6, "name": "T379", "routeStatus": "completed" }, { "id": 7, "name": "T3159", "routeStatus": "completed" }, { "id": 8, "name": "T3196", "routeStatus": "completed" }], "keywordSearchCanvModel": { "selectedOption": "5" }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [{ "id": 1, "name": "T319", "routeStatus": "in_progress" }, { "id": 2, "name": "T219", "routeStatus": "in_progress" }, { "id": 3, "name": "T519", "routeStatus": "not_started" }, { "id": 4, "name": "T619", "routeStatus": "not_started" }, { "id": 5, "name": "T719", "routeStatus": "not_started" }, { "id": 6, "name": "T379", "routeStatus": "completed" }, { "id": 7, "name": "T3159", "routeStatus": "completed" }, { "id": 8, "name": "T3196", "routeStatus": "completed" }], "statusModel": { "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "assigned" }, "selectedRoutesOption": { "label": "All", "value": "All" } } }, "routeCanvasLoaderShown": true, "searchedTeams": [{ "id": 1, "users": [{ "id": 0 }, { "id": 1 }, { "id": 2 }] }, { "id": 2, "users": [{ "id": 3 }, { "id": 4 }] }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": {
                "isPopup": false, "message": "", "type":
                "Success"
            }
        });
    });

    it('should handle action SET_KEYWORD_SEARCH for canvasser tab selected', () => {
        initialState.rightSideModel.initialSearchedCanvassers = [
            { id: 1, name: 'Sumit Kumar Verma', firstName: 'Sumit', lastName: 'Verma', email: 'sumit.verma@nagarro.com', canvasserStatus: 'assigned' },
            { id: 2, name: 'Anuj Sharma', firstName: 'Anuj', lastName: 'Sharma', email: 'anuj.sharma01@nagarro.com', canvasserStatus: 'assigned' },
            { id: 3, name: 'Sanni Kumar', firstName: 'Sanni', lastName: 'Kumar', email: 'sanni.kumar@nagarro.com', canvasserStatus: 'assigned' },
            { id: 4, name: 'Abhishek Verma', firstName: 'Abhishek', lastName: 'Verma', email: 'abhishek.verma@nagarro.com', canvasserStatus: 'unAssigned' },
            { id: 5, name: 'Vivek Kumar', firstName: 'Vivek', lastName: 'Kumar', email: 'vivek@nagarro.com', canvasserStatus: 'unAssigned' },
        ];
        initialState.rightSideModel.statusModel.selectedCanvOption.value = 'All';

        expect((adminReducer(initialState, { type: 'SET_KEYWORD_SEARCH', payload: { convassersTabSelected: true, value: 'kumar' } }))).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": {
                "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 1 }, { "boroughId": 1, "siteId": 2 }, { "boroughId": 1, "siteId": 3 }, {
                    "boroughId": 1, "siteId": 4
                }, { "boroughId": 2, "siteId": 1 }, { "boroughId": 2, "siteId": 2 }, { "boroughId": 3, "siteId": 1 }, { "boroughId": 3, "siteId": 2 }]
            }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [{ "canvasserStatus": "assigned", "email": "sumit.verma@nagarro.com", "firstName": "Sumit", "id": 1, "lastName": "Verma", "name": "Sumit Kumar Verma" }, { "canvasserStatus": "assigned", "email": "anuj.sharma01@nagarro.com", "firstName": "Anuj", "id": 2, "lastName": "Sharma", "name": "Anuj Sharma" }, { "canvasserStatus": "assigned", "email": "sanni.kumar@nagarro.com", "firstName": "Sanni", "id": 3, "lastName": "Kumar", "name": "Sanni Kumar" }, { "canvasserStatus": "unAssigned", "email": "abhishek.verma@nagarro.com", "firstName": "Abhishek", "id": 4, "lastName": "Verma", "name": "Abhishek Verma" }, { "canvasserStatus": "unAssigned", "email": "vivek@nagarro.com", "firstName": "Vivek", "id": 5, "lastName": "Kumar", "name": "Vivek Kumar" }], "initialSearchedRoutes": [{ "id": 1, "name": "T319", "routeStatus": "in_progress" }, { "id": 2, "name": "T219", "routeStatus": "in_progress" }, { "id": 3, "name": "T519", "routeStatus": "not_started" }, { "id": 4, "name": "T619", "routeStatus": "not_started" }, { "id": 5, "name": "T719", "routeStatus": "not_started" }, { "id": 6, "name": "T379", "routeStatus": "completed" }, {
                    "id": 7, "name"
                    : "T3159", "routeStatus": "completed"
                }, { "id": 8, "name": "T3196", "routeStatus": "completed" }], "keywordSearchCanvModel": { "selectedOption": "kumar" }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [{ "canvasserStatus": "assigned", "email": "sumit.verma@nagarro.com", "firstName": "Sumit", "id": 1, "lastName": "Verma", "name": "Sumit Kumar Verma" }, { "canvasserStatus": "assigned", "email": "sanni.kumar@nagarro.com", "firstName": "Sanni", "id": 3, "lastName": "Kumar", "name": "Sanni Kumar" }, { "canvasserStatus": "unAssigned", "email": "vivek@nagarro.com", "firstName": "Vivek", "id": 5, "lastName": "Kumar", "name": "Vivek Kumar" }], "searchedRoutes": [], "statusModel": {
                    "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, {
                        "label": "Not Started", "type": "route", "value":
                        "not_started"
                    }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }
                    , "selectedRoutesOption": { "label": "All", "value": "completed" }
                }
            }, "routeCanvasLoaderShown": true, "searchedTeams": [{ "id": 1, "users": [{ "id": 0 }, { "id": 1 }, { "id": 2 }] }, {
                "id": 2, "users": [{ "id": 3 }
                    , { "id": 4 }]
            }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": { "isPopup": false, "message": "", "type": "Success" }
        });
    });

    it('should handle action SET_KEYWORD_SEARCH for routes tab selected', () => {
        initialState.rightSideModel.initialSearchedRoutes = [
            { id: 1, name: 'T319', routeStatus: 'in_progress' },
            { id: 2, name: 'T219', routeStatus: 'in_progress' },
            { id: 3, name: 'T519', routeStatus: 'not_started' },
            { id: 4, name: 'T619', routeStatus: 'not_started' },
            { id: 5, name: 'T719', routeStatus: 'not_started' },
            { id: 6, name: 'T379', routeStatus: 'completed' },
            { id: 7, name: 'T3159', routeStatus: 'completed' },
            { id: 8, name: 'T3196', routeStatus: 'completed' },
        ];

        initialState.rightSideModel.statusModel.selectedRoutesOption.value = 'completed';
        expect((adminReducer(initialState, { type: 'SET_KEYWORD_SEARCH', payload: { convassersTabSelected: false, value: '19' } }))).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": {
                "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 1 }, { "boroughId": 1, "siteId": 2 }, { "boroughId": 1, "siteId": 3 }, {
                    "boroughId": 1, "siteId": 4
                }, { "boroughId": 2, "siteId": 1 }, { "boroughId": 2, "siteId": 2 }, { "boroughId": 3, "siteId": 1 }, { "boroughId": 3, "siteId": 2 }]
            }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [{ "canvasserStatus": "assigned", "email": "sumit.verma@nagarro.com", "firstName": "Sumit", "id": 1, "lastName": "Verma", "name": "Sumit Kumar Verma" }, { "canvasserStatus": "assigned", "email": "anuj.sharma01@nagarro.com", "firstName": "Anuj", "id": 2, "lastName": "Sharma", "name": "Anuj Sharma" }, { "canvasserStatus": "assigned", "email": "sanni.kumar@nagarro.com", "firstName": "Sanni", "id": 3, "lastName": "Kumar", "name": "Sanni Kumar" }, { "canvasserStatus": "unAssigned", "email": "abhishek.verma@nagarro.com", "firstName": "Abhishek", "id": 4, "lastName": "Verma", "name": "Abhishek Verma" }, { "canvasserStatus": "unAssigned", "email": "vivek@nagarro.com", "firstName": "Vivek", "id": 5, "lastName": "Kumar", "name": "Vivek Kumar" }], "initialSearchedRoutes": [{ "id": 1, "name": "T319", "routeStatus": "in_progress" }, { "id": 2, "name": "T219", "routeStatus": "in_progress" }, {
                    "id": 3, "name": "T519", "routeStatus":
                    "not_started"
                }, { "id": 4, "name": "T619", "routeStatus": "not_started" }, { "id": 5, "name": "T719", "routeStatus": "not_started" }, { "id": 6, "name": "T379", "routeStatus": "completed" }, {
                    "id": 7, "name"
                    : "T3159", "routeStatus": "completed"
                }, { "id": 8, "name": "T3196", "routeStatus": "completed" }], "keywordSearchCanvModel": { "selectedOption": "5" }, "keywordSearchRoutesModel": { "selectedOption": "19" },
                "searchedCanvassers": [], "searchedRoutes": [{"id": 1, "name": "T319", "routeStatus": "in_progress"}, {"id": 2, "name": "T219", "routeStatus": "in_progress"}, {"id": 3, "name": "T519", "routeStatus": "not_started"}, {"id": 4, "name": "T619", "routeStatus": "not_started"}, {"id": 5, "name": "T719", "routeStatus": "not_started"}, {"id": 8, "name": "T3196", "routeStatus": "completed"}], "statusModel": { "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "completed" } }
            }, "routeCanvasLoaderShown": true, "searchedTeams": [{ "id": 1, "users": [{ "id": 0 }, { "id": 1 }, { "id": 2 }] }, {
                "id":
                2, "users": [{ "id": 3 }, { "id": 4 }]
            }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": {
                "isPopup": false, "message": "",
                "type": "Success"
            }
        });
    });

    it('should handle action SET_TEAMS_SEARCHED', () => {
        let searchedTeams = [
            { id: 1, name: 'Team_1' },
            { id: 2, name: 'Team_2' },
            { id: 3, name: 'Team_3' },
            { id: 4, name: 'Team_4' },
            { id: 5, name: 'Team_5' },
            { id: 6, name: 'Team_6' },
        ];

        expect((adminReducer(initialState, { type: 'SET_TEAMS_SEARCHED', payload: searchedTeams }))).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": {
                "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 1 }, { "boroughId": 1, "siteId": 2 }, { "boroughId": 1, "siteId": 3 }, {
                    "boroughId": 1, "siteId": 4
                }, { "boroughId": 2, "siteId": 1 }, { "boroughId": 2, "siteId": 2 }, { "boroughId": 3, "siteId": 1 }, { "boroughId": 3, "siteId": 2 }]
            }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": false, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [{ "canvasserStatus": "assigned", "email": "sumit.verma@nagarro.com", "firstName": "Sumit", "id": 1, "lastName": "Verma", "name": "Sumit Kumar Verma" }, { "canvasserStatus": "assigned", "email": "anuj.sharma01@nagarro.com", "firstName": "Anuj", "id": 2, "lastName": "Sharma", "name": "Anuj Sharma" }, { "canvasserStatus": "assigned", "email": "sanni.kumar@nagarro.com", "firstName": "Sanni", "id": 3, "lastName": "Kumar", "name": "Sanni Kumar" }, { "canvasserStatus": "unAssigned", "email": "abhishek.verma@nagarro.com", "firstName": "Abhishek", "id": 4, "lastName": "Verma", "name": "Abhishek Verma" }, { "canvasserStatus": "unAssigned", "email": "vivek@nagarro.com", "firstName": "Vivek", "id": 5, "lastName": "Kumar", "name": "Vivek Kumar" }], "initialSearchedRoutes": [{ "id": 1, "name": "T319", "routeStatus": "in_progress" }, { "id": 2, "name": "T219", "routeStatus": "in_progress" }, {
                    "id": 3, "name": "T519", "routeStatus"
                    : "not_started"
                }, { "id": 4, "name": "T619", "routeStatus": "not_started" }, { "id": 5, "name": "T719", "routeStatus": "not_started" }, { "id": 6, "name": "T379", "routeStatus": "completed" }, { "id": 7, "name": "T3159", "routeStatus": "completed" }, { "id": 8, "name": "T3196", "routeStatus": "completed" }], "keywordSearchCanvModel": { "selectedOption": "5" }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": {
                    "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, {
                        "label"
                        : "In Progress", "type": "route", "value": "in_progress"
                    }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption":
                    { "label": "All", "value": "completed" }
                }
            }, "routeCanvasLoaderShown": true, "searchedTeams": [{ "id": 1, "name": "Team_1" }, { "id": 2, "name": "Team_2" }, { "id": 3, "name": "Team_3" }, { "id": 4, "name": "Team_4" }, { "id": 5, "name": "Team_5" }, { "id": 6, "name": "Team_6" }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": { "isPopup": false, "message": "", "type": "Success" }
        });
    });

    it('should handle action REMOVE_CANVASSER_FROM_TEAM', () => {
        initialState.searchedTeams = [
            { id: 1, name: 'Team_1', users: [{ id: 1 }, { id: 2 }] },
            { id: 2, name: 'Team_2', users: [{ id: 3 }, { id: 4 }] },
            { id: 3, name: 'Team_3', users: [] },
        ];

        expect((adminReducer(initialState, { type: 'REMOVE_CANVASSER_FROM_TEAM', payload: { team: { id: 1 }, canvasser: { id: 2 } } }))).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": {
                "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 1 }, { "boroughId": 1, "siteId": 2 }, { "boroughId": 1, "siteId": 3 }, {
                    "boroughId": 1, "siteId": 4
                }, { "boroughId": 2, "siteId": 1 }, { "boroughId": 2, "siteId": 2 }, { "boroughId": 3, "siteId": 1 }, { "boroughId": 3, "siteId": 2 }]
            }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [{ "canvasserStatus": "assigned", "email": "sumit.verma@nagarro.com", "firstName": "Sumit", "id": 1, "lastName": "Verma", "name": "Sumit Kumar Verma" }, { "canvasserStatus": "assigned", "email": "anuj.sharma01@nagarro.com", "firstName": "Anuj", "id": 2, "lastName": "Sharma", "name": "Anuj Sharma" }, { "canvasserStatus": "assigned", "email": "sanni.kumar@nagarro.com", "firstName": "Sanni", "id": 3, "lastName": "Kumar", "name": "Sanni Kumar" }, { "canvasserStatus": "unAssigned", "email": "abhishek.verma@nagarro.com", "firstName": "Abhishek", "id": 4, "lastName": "Verma", "name": "Abhishek Verma" }, { "canvasserStatus": "unAssigned", "email": "vivek@nagarro.com", "firstName": "Vivek", "id": 5, "lastName": "Kumar", "name": "Vivek Kumar" }], "initialSearchedRoutes": [{ "id": 1, "name": "T319", "routeStatus": "in_progress" }, { "id": 2, "name": "T219", "routeStatus": "in_progress" }, {
                    "id": 3, "name": "T519", "routeStatus":
                    "not_started"
                }, { "id": 4, "name": "T619", "routeStatus": "not_started" }, { "id": 5, "name": "T719", "routeStatus": "not_started" }, { "id": 6, "name": "T379", "routeStatus": "completed" }, { "id": 7, "name": "T3159", "routeStatus": "completed" }, { "id": 8, "name": "T3196", "routeStatus": "completed" }], "keywordSearchCanvModel": { "selectedOption": "5" }, "keywordSearchRoutesModel": { "selectedOption": null }, "searchedCanvassers": [], "searchedRoutes": [], "statusModel": {
                    "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, {
                        "label":
                        "In Progress", "type": "route", "value": "in_progress"
                    }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption":
                    { "label": "All", "value": "completed" }
                }
            }, "routeCanvasLoaderShown": true, "searchedTeams": [{ "id": 1, "name": "Team_1", "users": [{ "id": 1 }, { "id": 2 }, { "id": 2 }] }, {
                "id": 2, "name": "Team_2", "users":
                [{ "id": 3 }, { "id": 4 }]
            }, { "id": 3, "name": "Team_3", "users": [] }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": { "isPopup": false, "message": "", "type": "Success" }
        });
    });

    it('should handle action REMOVE_ROUTE_FROM_TEAM', () => {
        initialState.searchedTeams = [
            { id: 1, name: 'Team_1', routes: [{ id: 1 }, { id: 2 }] },
            { id: 2, name: 'Team_2', routes: [{ id: 3 }, { id: 4 }] },
            { id: 3, name: 'Team_3', routes: [] },
        ];

        expect((adminReducer(initialState, { type: 'REMOVE_ROUTE_FROM_TEAM', payload: { team: { id: 2 }, route: { id: 4 } } }))).toEqual({
            "createTeamModalIsOpened": false, "createTeamModel": { "selectedBorough": null, "selectedSite": { "boroughId": 1, "siteId": 1 }, "teamName": "Team_1" }, "editTeamModalIsOpened": false, "filterModel": {
                "boroughs": [], "selectedBorough": null, "selectedSite": null, "sites": [{ "boroughId": 1, "siteId": 1 }, { "boroughId": 1, "siteId": 2 }, { "boroughId": 1, "siteId": 3 }, {
                    "boroughId": 1, "siteId": 4
                }, { "boroughId": 2, "siteId": 1 }, { "boroughId": 2, "siteId": 2 }, { "boroughId": 3, "siteId": 1 }, { "boroughId": 3, "siteId": 2 }]
            }, "jumpTeamModalIsOpened": false, "panelProperties": { "displayRefreshButton": false, "lastUpdatedOn": null, "panelAutoReloadInterval": "2m", "panelCollapsed": false, "panelExpanded": false, "panelReload": true, "panelRemoved": false }, "popupLoaderShown": false, "rightSideModel": {
                "createCanvasserModalIsOpened": false, "editCanvasser": {}, "initialSearchedCanvassers": [{ "canvasserStatus": "assigned", "email": "sumit.verma@nagarro.com", "firstName": "Sumit", "id": 1, "lastName": "Verma", "name": "Sumit Kumar Verma" }, { "canvasserStatus": "assigned", "email": "anuj.sharma01@nagarro.com", "firstName": "Anuj", "id": 2, "lastName": "Sharma", "name": "Anuj Sharma" }, { "canvasserStatus": "assigned", "email": "sanni.kumar@nagarro.com", "firstName": "Sanni", "id": 3, "lastName": "Kumar", "name": "Sanni Kumar" }, { "canvasserStatus": "unAssigned", "email": "abhishek.verma@nagarro.com", "firstName": "Abhishek", "id": 4, "lastName": "Verma", "name": "Abhishek Verma" }, { "canvasserStatus": "unAssigned", "email": "vivek@nagarro.com", "firstName": "Vivek", "id": 5, "lastName": "Kumar", "name": "Vivek Kumar" }], "initialSearchedRoutes": [{ "id": 1, "name": "T319", "routeStatus": "in_progress" }, { "id": 2, "name": "T219", "routeStatus": "in_progress" }, {
                    "id": 3, "name": "T519", "routeStatus":
                    "not_started"
                }, { "id": 4, "name": "T619", "routeStatus": "not_started" }, { "id": 5, "name": "T719", "routeStatus": "not_started" }, { "id": 6, "name": "T379", "routeStatus": "completed" }, {
                    "id": 7, "name"
                    : "T3159", "routeStatus": "completed"
                }, { "id": 8, "name": "T3196", "routeStatus": "completed" }], "keywordSearchCanvModel": { "selectedOption": "5" }, "keywordSearchRoutesModel": { "selectedOption": null },
                "searchedCanvassers": [], "searchedRoutes": [], "statusModel": { "options": [{ "label": "All", "type": "canvasser", "value": "All" }, { "label": "Assigned", "type": "canvasser", "value": "assigned" }, { "label": "UnAssigned", "type": "canvasser", "value": "unAssigned" }, { "label": "All", "type": "route", "value": "All" }, { "label": "Not Started", "type": "route", "value": "not_started" }, { "label": "In Progress", "type": "route", "value": "in_progress" }, { "label": "Completed", "type": "route", "value": "completed" }], "selectedCanvOption": { "label": "All", "value": "All" }, "selectedRoutesOption": { "label": "All", "value": "completed" } }
            }, "routeCanvasLoaderShown": true, "searchedTeams": [{ "id": 1, "name": "Team_1", "routes": [{ "id": 1 }, { "id": 2 }] }, {
                "id": 2, "name": "Team_2", "routes": [{
                    "id": 3
                }, { "id": 4 }, { "id": 4 }]
            }, { "id": 3, "name": "Team_3", "routes": [] }], "teamToEdit": { "routes": [{ "id": 0, "routeType": "Subway" }], "users": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }] }, "validation": { "isPopup": false, "message": "", "type": "Success" }
        });
    });

    it('should handle action SET_ADMIN_LAST_UPDATED_ON', () => {

        let ExpectedTime = Utility.formatAMPM(new Date());
        expect(adminReducer(store.getState().adminModel, { type: 'SET_ADMIN_LAST_UPDATED_ON', payload: true }).panelProperties.lastUpdatedOn).toEqual(ExpectedTime);
    });

    it('should handle action SET_POPUPLOADER_TOGGLE', () => {    
        expect(adminReducer(store.getState().adminModel, { type: 'SET_POPUPLOADER_TOGGLE', payload: true }).popupLoaderShown).toEqual(true);
    });

    it('should handle action SHOW_VALIDATION_MESSAGE', () => {  
        let validation = {message:"",isPopup:false, type:"Success"}  
        expect(adminReducer(store.getState().adminModel, { type: 'SHOW_VALIDATION_MESSAGE', payload: {validationMessage : ""} }).validation).toEqual(validation);
        let validation2 = {message:"yes",isPopup:true, type:"error"}  
        expect(adminReducer(store.getState().adminModel, { type: 'SHOW_VALIDATION_MESSAGE', payload: {validationMessage : "yes", isPopup:true, type:"error"} }).validation).toEqual(validation2);
 });
  it('should handle action SET_PANEL_REMOVE_ADMIN', () => {    
        expect(adminReducer(store.getState().adminModel, { type: 'SET_PANEL_REMOVE_ADMIN', payload: false }).panelProperties.panelRemoved).toEqual(false);
    });
     it('should handle action SET_PANEL_COLLAPSE_ADMIN', () => {    
        expect(adminReducer(store.getState().adminModel, { type: 'SET_PANEL_COLLAPSE_ADMIN', payload: false }).panelProperties.panelCollapsed).toEqual(true);
    });
     it('should handle action SET_PANEL_RELOAD_ADMIN', () => {    
        expect(adminReducer(store.getState().adminModel, { type: 'SET_PANEL_RELOAD_ADMIN', payload: false }).panelProperties.panelReload).toEqual(true);
    });
    it('should handle action SET_PANEL_EXPAND_ADMIN', () => {    
        expect(adminReducer(store.getState().adminModel, { type: 'SET_PANEL_EXPAND_ADMIN', payload: false }).panelProperties.panelExpanded).toEqual(true);
    });
    it('should handle action SET_BOROUGHS_AND_SITES', () => {    
        expect(adminReducer(store.getState().adminModel, { type: 'SET_BOROUGHS_AND_SITES', payload: null })).toEqual(store.getState().adminModel);
        let data = {"boroughs":[{"id":12186,"name":"San Francisco","sites":[{"id":12187,"name":"Mission"},{"id":12188,"name":"Bayview"},{"id":12189,"name":"Civic Center"},{"id":12190,"name":"Sunset"}]}]}
       expect(adminReducer(store.getState().adminModel, { type: 'SET_BOROUGHS_AND_SITES', payload: data })).toEqual(store.getState().adminModel);

});
});
