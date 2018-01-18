import React from 'react';
import store from '../app/pages/shared/store';
import { sharedActionTypes } from "../app/pages/shared/actions/sharedActionTypes";
import sharedReducer from '../app/pages/shared/reducers/sharedReducer';
import {sharedState, Users} from '../app/pages/shared/state';
import { Constants } from "../app/common/app-settings/constants";


// shared reducer object initilization
describe(('Shared Reducer'), () => {

    it('should set SET_LEFT_MENU_EXPANDED', ()=> {
    expect(sharedReducer(sharedState, { type: 'SET_LEFT_MENU_EXPANDED', payload: true })).toEqual({
   "filterRoutesStatuses":[
      {
         "key":"not_started",
         "label":"Not Started",
         "layerColor":"#ff0000",
         "opacity":0.88,
         "value":3
      },
      {
         "key":"in_progress",
         "label":"In Progress",
         "layerColor":"#f7b047",
         "value":2
      },
      {
         "key":"completed",
         "label":"Completed",
         "layerColor":"#01ABAB",
         "value":4
      }
   ],
   "isRightPanelExpanded":true,
   "leftMenuExpaned":false,
   "loginDetails":{
      "displayName":"",
      "errorMessage":"",
      "isloggedIn":false,
      "password":"",
      "rememberMe":false,
      "userId":null,
      "userName":"",
      "users":[
         {
            "displayName":"Command Center",
            "isSFOUser":false,
            "password":"Work@demotest1!",
            "roles":[
               "admin"
            ],
            "userId":1,
            "userName":"commandcenter"
         },
         {
            "displayName":"SF-Command Center",
            "isSFOUser":true,
            "password":"sfcount!",
            "roles":[
               "sfUser"
            ],
            "userId":2,
            "userName":"commandcenter"
         },
         {
            "displayName":"SF 2 -Command Center",
            "isSFOUser":true,
            "password":"sf2count!",
            "roles":[
               "sfUser"
            ],
            "userId":3,
            "userName":"commandcenter"
         },
         {
            "displayName":"La Guardia - Command Center",
            "isSFOUser":false,
            "password":"dc@laguardia",
            "roles":[
               "admin"
            ],
            "userId":4,
            "userName":"dclaguardia"
         },
         {
            "displayName":"Hostos - Command Center",
            "isSFOUser":false,
            "password":"dc@hostos",
            "roles":[
               "admin"
            ],
            "userId":5,
            "userName":"dchostos"
         },
         {
            "displayName":"College Hunter - Command Center",
            "isSFOUser":false,
            "password":"dc@collegehunter",
            "roles":[
               "admin"
            ],
            "userId":6,
            "userName":"dccollegehunter"
         },
         {
            "displayName":"Brooklyn College - Command Center",
            "isSFOUser":false,
            "password":"dc@brooklyncollege",
            "roles":[
               "admin"
            ],
            "userId":7,
            "userName":"dcbrooklyncollege"
         }
      ]
   },
   "menuPanels":[
      {
         "iconClass":"fa fa-television",
         "isOpened":false,
         "text":"Dashboard",
         "value":"dashboard"
      },
      {
         "iconClass":"fa fa-user",
         "isOpened":false,
         "text":"Admin",
         "value":"admin"
      },
      {
         "iconClass":"fa fa-bar-chart",
         "isOpened":false,
         "text":"Reports",
         "value":"reports"
      }
   ],
   "profileMenu":{
      "isOpened":false
   },
   "routesOnMap":{
      "isOpened":false,
      "popupLoaderShown":false,
      "routeObject":null
   },
   "smallScreenLeftMenuOpened":false,
   "smallScreenRightMenuOpened":false,
   "tabs":[
      {
         "category":"dashboard",
         "isSelected":true,
         "key":"mapview",
         "text":"Map View"
      },
      {
         "category":"dashboard",
         "isSelected":false,
         "key":"listview",
         "text":"List View"
      },
      {
         "category":"dashboard",
         "isSelected":false,
         "key":"dataview",
         "text":"Data View"
      },
      {
         "category":"admin",
         "isSelected":true,
         "key":"canvassers",
         "text":"Canvassers"
      },
      {
         "category":"admin",
         "isSelected":false,
         "key":"routes",
         "text":"Routes"
      },
      {
         "category":"reports",
         "isSelected":false,
         "key":"downloadsurveys",
         "text":"Download Surveys"
      }
      ]})
    })

  it('should set SET_RIGHT_SIDE_EXPANDED', ()=> {
      expect(sharedReducer(sharedState, { type: 'SET_RIGHT_SIDE_EXPANDED', payload: true })).toEqual({
   "filterRoutesStatuses":[
      {
         "key":"not_started",
         "label":"Not Started",
         "layerColor":"#ff0000",
         "opacity":0.88,
         "value":3
      },
      {
         "key":"in_progress",
         "label":"In Progress",
         "layerColor":"#f7b047",
         "value":2
      },
      {
         "key":"completed",
         "label":"Completed",
         "layerColor":"#01ABAB",
         "value":4
      }
   ],
   "isRightPanelExpanded":false,
   "leftMenuExpaned":true,
   "loginDetails":{
      "displayName":"",
      "errorMessage":"",
      "isloggedIn":false,
      "password":"",
      "rememberMe":false,
      "userId":null,
      "userName":"",
      "users":[
         {
            "displayName":"Command Center",
            "isSFOUser":false,
            "password":"Work@demotest1!",
            "roles":[
               "admin"
            ],
            "userId":1,
            "userName":"commandcenter"
         },
         {
            "displayName":"SF-Command Center",
            "isSFOUser":true,
            "password":"sfcount!",
            "roles":[
               "sfUser"
            ],
            "userId":2,
            "userName":"commandcenter"
         },
         {
            "displayName":"SF 2 -Command Center",
            "isSFOUser":true,
            "password":"sf2count!",
            "roles":[
               "sfUser"
            ],
            "userId":3,
            "userName":"commandcenter"
         },
         {
            "displayName":"La Guardia - Command Center",
            "isSFOUser":false,
            "password":"dc@laguardia",
            "roles":[
               "admin"
            ],
            "userId":4,
            "userName":"dclaguardia"
         },
         {
            "displayName":"Hostos - Command Center",
            "isSFOUser":false,
            "password":"dc@hostos",
            "roles":[
               "admin"
            ],
            "userId":5,
            "userName":"dchostos"
         },
         {
            "displayName":"College Hunter - Command Center",
            "isSFOUser":false,
            "password":"dc@collegehunter",
            "roles":[
               "admin"
            ],
            "userId":6,
            "userName":"dccollegehunter"
         },
         {
            "displayName":"Brooklyn College - Command Center",
            "isSFOUser":false,
            "password":"dc@brooklyncollege",
            "roles":[
               "admin"
            ],
            "userId":7,
            "userName":"dcbrooklyncollege"
         }
      ]
   },
   "menuPanels":[
      {
         "iconClass":"fa fa-television",
         "isOpened":false,
         "text":"Dashboard",
         "value":"dashboard"
      },
      {
         "iconClass":"fa fa-user",
         "isOpened":false,
         "text":"Admin",
         "value":"admin"
      },
      {
         "iconClass":"fa fa-bar-chart",
         "isOpened":false,
         "text":"Reports",
         "value":"reports"
      }
   ],
   "profileMenu":{
      "isOpened":false
   },
   "routesOnMap":{
      "isOpened":false,
      "popupLoaderShown":false,
      "routeObject":null
   },
   "smallScreenLeftMenuOpened":false,
   "smallScreenRightMenuOpened":false,
   "tabs":[
      {
         "category":"dashboard",
         "isSelected":true,
         "key":"mapview",
         "text":"Map View"
      },
      {
         "category":"dashboard",
         "isSelected":false,
         "key":"listview",
         "text":"List View"
      },
      {
         "category":"dashboard",
         "isSelected":false,
         "key":"dataview",
         "text":"Data View"
      },
      {
         "category":"admin",
         "isSelected":true,
         "key":"canvassers",
         "text":"Canvassers"
      },
      {
         "category":"admin",
         "isSelected":false,
         "key":"routes",
         "text":"Routes"
      },
      {
         "category":"reports",
         "isSelected":false,
         "key":"downloadsurveys",
         "text":"Download Surveys"
      }
      ]})
});

 it('should set SET_TAB_CHANGE', ()=> {
    // sharedState.tabs = [{"key":"mapview","text":"Map View","isSelected":true,"category":"dashboard"},{"key":"listview","text":"List View","isSelected":false,"category":"dashboard"},{"key":"dataview","text":"Data View","isSelected":false,"category":"dashboard"},{"key":"canvassers","text":"Canvassers","isSelected":true,"category":"admin"},{"key":"routes","text":"Routes","isSelected":false,"category":"admin"},{"key":"downloadsurveys","text":"Download Surveys","isSelected":false,"category":"reports"}];
    expect(sharedReducer(sharedState, { type: 'SET_TAB_CHANGE', payload: {key:'mapview' }})).toEqual({"filterRoutesStatuses": [{"key": "not_started", "label": "Not Started", "layerColor": "#ff0000", "opacity": 0.88, "value": 3}, {"key": "in_progress", 
    "label": "In Progress", "layerColor": "#f7b047", "value": 2}, {"key": "completed", "label": "Completed", "layerColor": "#01ABAB", "value": 4}], "isRightPanelExpanded": true, "leftMenuExpaned": true, "loginDetails": {"displayName": "", "errorMessage": "", "isloggedIn": false, 
"password": "", "rememberMe": false, "userId": null, "userName": "", "users": [{"displayName": "Command Center", "isSFOUser": false, "password": "Work@demotest1!", "roles": ["admin"], "userId": 1, "userName": "commandcenter"}, {"displayName": "SF-Command Center", "isSFOUser": true, 
"password": "sfcount!", "roles": ["sfUser"], "userId": 2, "userName": "commandcenter"}, {"displayName": "SF 2 -Command Center", "isSFOUser": true, "password": "sf2count!", "roles": ["sfUser"], "userId": 3, "userName": "commandcenter"}, {"displayName": "La Guardia - Command Center",
 "isSFOUser": false, "password": "dc@laguardia", "roles": ["admin"], "userId": 4, "userName": "dclaguardia"}, {"displayName": "Hostos - Command Center", "isSFOUser": false, "password": "dc@hostos", "roles": ["admin"], "userId": 5, "userName": "dchostos"}, 
 {"displayName": "College Hunter - Command Center", "isSFOUser": false, "password": "dc@collegehunter", "roles": ["admin"], "userId": 6, "userName": "dccollegehunter"}, {"displayName": "Brooklyn College - Command Center", "isSFOUser": false, "password": "dc@brooklyncollege", "roles": ["admin"], "userId": 7, "userName": "dcbrooklyncollege"}]}, "menuPanels": [{"iconClass": "fa fa-television", "isOpened": true, "text": "Dashboard", "value": "dashboard"}, {"iconClass": "fa fa-user", "isOpened": false, "text": "Admin", "value": "admin"}, {"iconClass": "fa fa-bar-chart", "isOpened": false, "text": "Reports", "value": "reports"}], "profileMenu": {"isOpened": false}, "routesOnMap": {"isOpened": false, "popupLoaderShown": false, "routeObject": null}, "smallScreenLeftMenuOpened": false, "smallScreenRightMenuOpened": false, "tabs": [{"category": "dashboard", "isSelected": true, 
 "key": "mapview", "text": "Map View"}, {"category": "dashboard", "isSelected": false, "key": "listview", "text": "List View"}, {"category": "dashboard", "isSelected": false, "key": "dataview", "text": "Data View"}, {"category": "admin", "isSelected": false, "key": "canvassers", "text": "Canvassers"}, {"category": "admin", "isSelected": false, "key":"routes", "text": "Routes"}, {"category": "reports", "isSelected": false, "key": "downloadsurveys", "text": "Download Surveys"}]})
 })

 it('should set SET_LOGIN_USERNAME', ()=> {
      expect(sharedReducer(sharedState, { type: 'SET_LOGIN_USERNAME', payload: {value:'commandcenter' }})).toEqual({"filterRoutesStatuses": [{"key": "not_started", "label": "Not Started", "layerColor": "#ff0000", "opacity": 0.88, "value": 3}, {"key": "in_progress", 
    "label": "In Progress", "layerColor": "#f7b047", "value": 2}, {"key": "completed", "label": "Completed", "layerColor": "#01ABAB", "value": 4}], "isRightPanelExpanded": true, "leftMenuExpaned": true, "loginDetails": {"displayName": "", "errorMessage": "", "isloggedIn": false, 
"password": "", "rememberMe": false, "userId": null, "userName": "commandcenter", "users": [{"displayName": "Command Center", "isSFOUser": false, "password": "Work@demotest1!", "roles": ["admin"], "userId": 1, "userName": "commandcenter"}, {"displayName": "SF-Command Center", "isSFOUser": true, 
"password": "sfcount!", "roles": ["sfUser"], "userId": 2, "userName": "commandcenter"}, {"displayName": "SF 2 -Command Center", "isSFOUser": true, "password": "sf2count!", "roles": ["sfUser"], "userId": 3, "userName": "commandcenter"}, {"displayName": "La Guardia - Command Center",
 "isSFOUser": false, "password": "dc@laguardia", "roles": ["admin"], "userId": 4, "userName": "dclaguardia"}, {"displayName": "Hostos - Command Center", "isSFOUser": false, "password": "dc@hostos", "roles": ["admin"], "userId": 5, "userName": "dchostos"}, 
 {"displayName": "College Hunter - Command Center", "isSFOUser": false, "password": "dc@collegehunter", "roles": ["admin"], "userId": 6, "userName": "dccollegehunter"}, {"displayName": "Brooklyn College - Command Center", "isSFOUser": false, "password": "dc@brooklyncollege", "roles": ["admin"], "userId": 7, "userName": "dcbrooklyncollege"}]}, "menuPanels": [{"iconClass": "fa fa-television", "isOpened": false, "text": "Dashboard", "value": "dashboard"}, {"iconClass": "fa fa-user", "isOpened": false, "text": "Admin", "value": "admin"}, {"iconClass": "fa fa-bar-chart", "isOpened": false, "text": "Reports", "value": "reports"}], "profileMenu": {"isOpened": false}, "routesOnMap": {"isOpened": false, "popupLoaderShown": false, "routeObject": null}, "smallScreenLeftMenuOpened": false, "smallScreenRightMenuOpened": false, "tabs": [{"category": "dashboard", "isSelected": true, 
 "key": "mapview", "text": "Map View"}, {"category": "dashboard", "isSelected": false, "key": "listview", "text": "List View"}, {"category": "dashboard", "isSelected": false, "key": "dataview", "text": "Data View"}, {"category": "admin", "isSelected": true, "key": "canvassers", "text": "Canvassers"}, {"category": "admin", "isSelected": false, "key":"routes", "text": "Routes"}, {"category": "reports", "isSelected": false, "key": "downloadsurveys", "text": "Download Surveys"}]})
 })

  it('should set SET_LOGIN_PASSWORD', ()=> {
      expect(sharedReducer(sharedState, { type: 'SET_LOGIN_PASSWORD', payload: {value:'Work@demotest1!' }})).toEqual({"filterRoutesStatuses": [{"key": "not_started", "label": "Not Started", "layerColor": "#ff0000", "opacity": 0.88, "value": 3}, {"key": "in_progress", 
    "label": "In Progress", "layerColor": "#f7b047", "value": 2}, {"key": "completed", "label": "Completed", "layerColor": "#01ABAB", "value": 4}], "isRightPanelExpanded": true, "leftMenuExpaned": true, "loginDetails": {"displayName": "", "errorMessage": "", "isloggedIn": false, 
"password": "Work@demotest1!", "rememberMe": false, "userId": null, "userName": "", "users": [{"displayName": "Command Center", "isSFOUser": false, "password": "Work@demotest1!", "roles": ["admin"], "userId": 1, "userName": "commandcenter"}, {"displayName": "SF-Command Center", "isSFOUser": true, 
"password": "sfcount!", "roles": ["sfUser"], "userId": 2, "userName": "commandcenter"}, {"displayName": "SF 2 -Command Center", "isSFOUser": true, "password": "sf2count!", "roles": ["sfUser"], "userId": 3, "userName": "commandcenter"}, {"displayName": "La Guardia - Command Center",
 "isSFOUser": false, "password": "dc@laguardia", "roles": ["admin"], "userId": 4, "userName": "dclaguardia"}, {"displayName": "Hostos - Command Center", "isSFOUser": false, "password": "dc@hostos", "roles": ["admin"], "userId": 5, "userName": "dchostos"}, 
 {"displayName": "College Hunter - Command Center", "isSFOUser": false, "password": "dc@collegehunter", "roles": ["admin"], "userId": 6, "userName": "dccollegehunter"}, {"displayName": "Brooklyn College - Command Center", "isSFOUser": false, "password": "dc@brooklyncollege", "roles": ["admin"], "userId": 7, "userName": "dcbrooklyncollege"}]}, "menuPanels": [{"iconClass": "fa fa-television", "isOpened": false, "text": "Dashboard", "value": "dashboard"}, {"iconClass": "fa fa-user", "isOpened": false, "text": "Admin", "value": "admin"}, {"iconClass": "fa fa-bar-chart", "isOpened": false, "text": "Reports", "value": "reports"}], "profileMenu": {"isOpened": false}, "routesOnMap": {"isOpened": false, "popupLoaderShown": false, "routeObject": null}, "smallScreenLeftMenuOpened": false, "smallScreenRightMenuOpened": false, "tabs": [{"category": "dashboard", "isSelected": true, 
 "key": "mapview", "text": "Map View"}, {"category": "dashboard", "isSelected": false, "key": "listview", "text": "List View"}, {"category": "dashboard", "isSelected": false, "key": "dataview", "text": "Data View"}, {"category": "admin", "isSelected": true, "key": "canvassers", "text": "Canvassers"}, {"category": "admin", "isSelected": false, "key":"routes", "text": "Routes"}, {"category": "reports", "isSelected": false, "key": "downloadsurveys", "text": "Download Surveys"}]})
 })
 it('should set SET_LOGIN_REMEMBERME', ()=> {
      expect(sharedReducer(sharedState, { type: 'SET_LOGIN_REMEMBERME', payload: {value:true }})).toEqual({"filterRoutesStatuses": [{"key": "not_started", "label": "Not Started", "layerColor": "#ff0000", "opacity": 0.88, "value": 3}, {"key": "in_progress", 
    "label": "In Progress", "layerColor": "#f7b047", "value": 2}, {"key": "completed", "label": "Completed", "layerColor": "#01ABAB", "value": 4}], "isRightPanelExpanded": true, "leftMenuExpaned": true, "loginDetails": {"displayName": "", "errorMessage": "", "isloggedIn": false, 
"password": "", "rememberMe": true, "userId": null, "userName": "", "users": [{"displayName": "Command Center", "isSFOUser": false, "password": "Work@demotest1!", "roles": ["admin"], "userId": 1, "userName": "commandcenter"}, {"displayName": "SF-Command Center", "isSFOUser": true, 
"password": "sfcount!", "roles": ["sfUser"], "userId": 2, "userName": "commandcenter"}, {"displayName": "SF 2 -Command Center", "isSFOUser": true, "password": "sf2count!", "roles": ["sfUser"], "userId": 3, "userName": "commandcenter"}, {"displayName": "La Guardia - Command Center",
 "isSFOUser": false, "password": "dc@laguardia", "roles": ["admin"], "userId": 4, "userName": "dclaguardia"}, {"displayName": "Hostos - Command Center", "isSFOUser": false, "password": "dc@hostos", "roles": ["admin"], "userId": 5, "userName": "dchostos"}, 
 {"displayName": "College Hunter - Command Center", "isSFOUser": false, "password": "dc@collegehunter", "roles": ["admin"], "userId": 6, "userName": "dccollegehunter"}, {"displayName": "Brooklyn College - Command Center", "isSFOUser": false, "password": "dc@brooklyncollege", "roles": ["admin"], "userId": 7, "userName": "dcbrooklyncollege"}]}, "menuPanels": [{"iconClass": "fa fa-television", "isOpened": false, "text": "Dashboard", "value": "dashboard"}, {"iconClass": "fa fa-user", "isOpened": false, "text": "Admin", "value": "admin"}, {"iconClass": "fa fa-bar-chart", "isOpened": false, "text": "Reports", "value": "reports"}], "profileMenu": {"isOpened": false}, "routesOnMap": {"isOpened": false, "popupLoaderShown": false, "routeObject": null}, "smallScreenLeftMenuOpened": false, "smallScreenRightMenuOpened": false, "tabs": [{"category": "dashboard", "isSelected": true, 
 "key": "mapview", "text": "Map View"}, {"category": "dashboard", "isSelected": false, "key": "listview", "text": "List View"}, {"category": "dashboard", "isSelected": false, "key": "dataview", "text": "Data View"}, {"category": "admin", "isSelected": true, "key": "canvassers", "text": "Canvassers"}, {"category": "admin", "isSelected": false, "key":"routes", "text": "Routes"}, {"category": "reports", "isSelected": false, "key": "downloadsurveys", "text": "Download Surveys"}]})
 })
it('should set SET_LOGIN_ERROR_MESSAGE', ()=> {
      expect(sharedReducer(sharedState, { type: 'SET_LOGIN_ERROR_MESSAGE', payload: {value:'error' }})).toEqual({"filterRoutesStatuses": [{"key": "not_started", "label": "Not Started", "layerColor": "#ff0000", "opacity": 0.88, "value": 3}, {"key": "in_progress", 
    "label": "In Progress", "layerColor": "#f7b047", "value": 2}, {"key": "completed", "label": "Completed", "layerColor": "#01ABAB", "value": 4}], "isRightPanelExpanded": true, "leftMenuExpaned": true, "loginDetails": {"displayName": "", "errorMessage": "error", "isloggedIn": false, 
"password": "", "rememberMe": false, "userId": null, "userName": "", "users": [{"displayName": "Command Center", "isSFOUser": false, "password": "Work@demotest1!", "roles": ["admin"], "userId": 1, "userName": "commandcenter"}, {"displayName": "SF-Command Center", "isSFOUser": true, 
"password": "sfcount!", "roles": ["sfUser"], "userId": 2, "userName": "commandcenter"}, {"displayName": "SF 2 -Command Center", "isSFOUser": true, "password": "sf2count!", "roles": ["sfUser"], "userId": 3, "userName": "commandcenter"}, {"displayName": "La Guardia - Command Center",
 "isSFOUser": false, "password": "dc@laguardia", "roles": ["admin"], "userId": 4, "userName": "dclaguardia"}, {"displayName": "Hostos - Command Center", "isSFOUser": false, "password": "dc@hostos", "roles": ["admin"], "userId": 5, "userName": "dchostos"}, 
 {"displayName": "College Hunter - Command Center", "isSFOUser": false, "password": "dc@collegehunter", "roles": ["admin"], "userId": 6, "userName": "dccollegehunter"}, {"displayName": "Brooklyn College - Command Center", "isSFOUser": false, "password": "dc@brooklyncollege", "roles": ["admin"], "userId": 7, "userName": "dcbrooklyncollege"}]}, "menuPanels": [{"iconClass": "fa fa-television", "isOpened": false, "text": "Dashboard", "value": "dashboard"}, {"iconClass": "fa fa-user", "isOpened": false, "text": "Admin", "value": "admin"}, {"iconClass": "fa fa-bar-chart", "isOpened": false, "text": "Reports", "value": "reports"}], "profileMenu": {"isOpened": false}, "routesOnMap": {"isOpened": false, "popupLoaderShown": false, "routeObject": null}, "smallScreenLeftMenuOpened": false, "smallScreenRightMenuOpened": false, "tabs": [{"category": "dashboard", "isSelected": true, 
 "key": "mapview", "text": "Map View"}, {"category": "dashboard", "isSelected": false, "key": "listview", "text": "List View"}, {"category": "dashboard", "isSelected": false, "key": "dataview", "text": "Data View"}, {"category": "admin", "isSelected": true, "key": "canvassers", "text": "Canvassers"}, {"category": "admin", "isSelected": false, "key":"routes", "text": "Routes"}, {"category": "reports", "isSelected": false, "key": "downloadsurveys", "text": "Download Surveys"}]})
 })
it('should set SET_LOGGED_IN', ()=> {
      expect(sharedReducer(sharedState, { type: 'SET_LOGGED_IN', payload: {isLoggedIn : true, userName:'commandcenter', displayName : 'Command Center'} })).toEqual({"filterRoutesStatuses": [{"key": "not_started", "label": "Not Started", "layerColor": "#ff0000", "opacity": 0.88, "value": 3}, {"key": "in_progress", 
    "label": "In Progress", "layerColor": "#f7b047", "value": 2}, {"key": "completed", "label": "Completed", "layerColor": "#01ABAB", "value": 4}], "isRightPanelExpanded": true, "leftMenuExpaned": true, "loginDetails": {"displayName": "Command Center", "errorMessage": "", "isloggedIn": true, 
"password": "", "rememberMe": false, "userId": null, "userName": "commandcenter", "users": [{"displayName": "Command Center", "isSFOUser": false, "password": "Work@demotest1!", "roles": ["admin"], "userId": 1, "userName": "commandcenter"}, {"displayName": "SF-Command Center", "isSFOUser": true, 
"password": "sfcount!", "roles": ["sfUser"], "userId": 2, "userName": "commandcenter"}, {"displayName": "SF 2 -Command Center", "isSFOUser": true, "password": "sf2count!", "roles": ["sfUser"], "userId": 3, "userName": "commandcenter"}, {"displayName": "La Guardia - Command Center",
 "isSFOUser": false, "password": "dc@laguardia", "roles": ["admin"], "userId": 4, "userName": "dclaguardia"}, {"displayName": "Hostos - Command Center", "isSFOUser": false, "password": "dc@hostos", "roles": ["admin"], "userId": 5, "userName": "dchostos"}, 
 {"displayName": "College Hunter - Command Center", "isSFOUser": false, "password": "dc@collegehunter", "roles": ["admin"], "userId": 6, "userName": "dccollegehunter"}, {"displayName": "Brooklyn College - Command Center", "isSFOUser": false, "password": "dc@brooklyncollege", "roles": ["admin"], "userId": 7, "userName": "dcbrooklyncollege"}]}, "menuPanels": [{"iconClass": "fa fa-television", "isOpened": false, "text": "Dashboard", "value": "dashboard"}, {"iconClass": "fa fa-user", "isOpened": false, "text": "Admin", "value": "admin"}, {"iconClass": "fa fa-bar-chart", "isOpened": false, "text": "Reports", "value": "reports"}], "profileMenu": {"isOpened": false}, "routesOnMap": {"isOpened": false, "popupLoaderShown": false, "routeObject": null}, "smallScreenLeftMenuOpened": false, "smallScreenRightMenuOpened": false, "tabs": [{"category": "dashboard", "isSelected": true, 
 "key": "mapview", "text": "Map View"}, {"category": "dashboard", "isSelected": false, "key": "listview", "text": "List View"}, {"category": "dashboard", "isSelected": false, "key": "dataview", "text": "Data View"}, {"category": "admin", "isSelected": true, "key": "canvassers", "text": "Canvassers"}, {"category": "admin", "isSelected": false, "key":"routes", "text": "Routes"}, {"category": "reports", "isSelected": false, "key": "downloadsurveys", "text": "Download Surveys"}]})
 })

 it('should set SET_LOG_OUT', ()=> {
      expect(sharedReducer(sharedState, { type: 'SET_LOG_OUT', payload: {value:'commandcenter' }})).toEqual({"filterRoutesStatuses": [{"key": "not_started", "label": "Not Started", "layerColor": "#ff0000", "opacity": 0.88, "value": 3}, {"key": "in_progress", 
    "label": "In Progress", "layerColor": "#f7b047", "value": 2}, {"key": "completed", "label": "Completed", "layerColor": "#01ABAB", "value": 4}], "isRightPanelExpanded": true, "leftMenuExpaned": true, "loginDetails": {"displayName": "", "errorMessage": "", "isloggedIn": false, 
"password": "", "rememberMe": false, "userId": null, "userName": "", "users": [{"displayName": "Command Center", "isSFOUser": false, "password": "Work@demotest1!", "roles": ["admin"], "userId": 1, "userName": "commandcenter"}, {"displayName": "SF-Command Center", "isSFOUser": true, 
"password": "sfcount!", "roles": ["sfUser"], "userId": 2, "userName": "commandcenter"}, {"displayName": "SF 2 -Command Center", "isSFOUser": true, "password": "sf2count!", "roles": ["sfUser"], "userId": 3, "userName": "commandcenter"}, {"displayName": "La Guardia - Command Center",
 "isSFOUser": false, "password": "dc@laguardia", "roles": ["admin"], "userId": 4, "userName": "dclaguardia"}, {"displayName": "Hostos - Command Center", "isSFOUser": false, "password": "dc@hostos", "roles": ["admin"], "userId": 5, "userName": "dchostos"}, 
 {"displayName": "College Hunter - Command Center", "isSFOUser": false, "password": "dc@collegehunter", "roles": ["admin"], "userId": 6, "userName": "dccollegehunter"}, {"displayName": "Brooklyn College - Command Center", "isSFOUser": false, "password": "dc@brooklyncollege", "roles": ["admin"], "userId": 7, "userName": "dcbrooklyncollege"}]}, "menuPanels": [{"iconClass": "fa fa-television", "isOpened": false, "text": "Dashboard", "value": "dashboard"}, {"iconClass": "fa fa-user", "isOpened": false, "text": "Admin", "value": "admin"}, {"iconClass": "fa fa-bar-chart", "isOpened": false, "text": "Reports", "value": "reports"}], "profileMenu": {"isOpened": false}, "routesOnMap": {"isOpened": false, "popupLoaderShown": false, "routeObject": null}, "smallScreenLeftMenuOpened": false, "smallScreenRightMenuOpened": false, "tabs": [{"category": "dashboard", "isSelected": true, 
 "key": "mapview", "text": "Map View"}, {"category": "dashboard", "isSelected": false, "key": "listview", "text": "List View"}, {"category": "dashboard", "isSelected": false, "key": "dataview", "text": "Data View"}, {"category": "admin", "isSelected": true, "key": "canvassers", "text": "Canvassers"}, {"category": "admin", "isSelected": false, "key":"routes", "text": "Routes"}, {"category": "reports", "isSelected": false, "key": "downloadsurveys", "text": "Download Surveys"}]})
 })

 it('should set SET_LEFT_MENU_TOGGLE', ()=> {
      expect(sharedReducer(sharedState, { type: 'SET_LEFT_MENU_TOGGLE', payload: { panel:{value:'dashboard'}} })).toEqual({"filterRoutesStatuses": [{"key": "not_started", "label": "Not Started", "layerColor": "#ff0000", "opacity": 0.88, "value": 3}, {"key": "in_progress", 
    "label": "In Progress", "layerColor": "#f7b047", "value": 2}, {"key": "completed", "label": "Completed", "layerColor": "#01ABAB", "value": 4}], "isRightPanelExpanded": true, "leftMenuExpaned": true, "loginDetails": {"displayName": "", "errorMessage": "", "isloggedIn": false, 
"password": "", "rememberMe": false, "userId": null, "userName": "", "users": [{"displayName": "Command Center", "isSFOUser": false, "password": "Work@demotest1!", "roles": ["admin"], "userId": 1, "userName": "commandcenter"}, {"displayName": "SF-Command Center", "isSFOUser": true, 
"password": "sfcount!", "roles": ["sfUser"], "userId": 2, "userName": "commandcenter"}, {"displayName": "SF 2 -Command Center", "isSFOUser": true, "password": "sf2count!", "roles": ["sfUser"], "userId": 3, "userName": "commandcenter"}, {"displayName": "La Guardia - Command Center",
 "isSFOUser": false, "password": "dc@laguardia", "roles": ["admin"], "userId": 4, "userName": "dclaguardia"}, {"displayName": "Hostos - Command Center", "isSFOUser": false, "password": "dc@hostos", "roles": ["admin"], "userId": 5, "userName": "dchostos"}, 
 {"displayName": "College Hunter - Command Center", "isSFOUser": false, "password": "dc@collegehunter", "roles": ["admin"], "userId": 6, "userName": "dccollegehunter"}, {"displayName": "Brooklyn College - Command Center", "isSFOUser": false, "password": "dc@brooklyncollege", "roles": ["admin"], "userId": 7, "userName": "dcbrooklyncollege"}]}, "menuPanels": [{"iconClass": "fa fa-television", "isOpened": true, "text": "Dashboard", "value": "dashboard"}, {"iconClass": "fa fa-user", "isOpened": false, "text": "Admin", "value": "admin"}, {"iconClass": "fa fa-bar-chart", "isOpened": false, "text": "Reports", "value": "reports"}], "profileMenu": {"isOpened": false}, "routesOnMap": {"isOpened": false, "popupLoaderShown": false, "routeObject": null}, "smallScreenLeftMenuOpened": false, "smallScreenRightMenuOpened": false, "tabs": [{"category": "dashboard", "isSelected": true, 
 "key": "mapview", "text": "Map View"}, {"category": "dashboard", "isSelected": false, "key": "listview", "text": "List View"}, {"category": "dashboard", "isSelected": false, "key": "dataview", "text": "Data View"}, {"category": "admin", "isSelected": true, "key": "canvassers", "text": "Canvassers"}, {"category": "admin", "isSelected": false, "key":"routes", "text": "Routes"}, {"category": "reports", "isSelected": false, "key": "downloadsurveys", "text": "Download Surveys"}]})
 
 expect(sharedReducer(sharedState, { type: 'SET_LEFT_MENU_TOGGLE', payload: { panel:{value:'admin'}} })).toEqual({"filterRoutesStatuses": [{"key": "not_started", "label": "Not Started", "layerColor": "#ff0000", "opacity": 0.88, "value": 3}, {"key": "in_progress", 
    "label": "In Progress", "layerColor": "#f7b047", "value": 2}, {"key": "completed", "label": "Completed", "layerColor": "#01ABAB", "value": 4}], "isRightPanelExpanded": true, "leftMenuExpaned": true, "loginDetails": {"displayName": "", "errorMessage": "", "isloggedIn": false, 
"password": "", "rememberMe": false, "userId": null, "userName": "", "users": [{"displayName": "Command Center", "isSFOUser": false, "password": "Work@demotest1!", "roles": ["admin"], "userId": 1, "userName": "commandcenter"}, {"displayName": "SF-Command Center", "isSFOUser": true, 
"password": "sfcount!", "roles": ["sfUser"], "userId": 2, "userName": "commandcenter"}, {"displayName": "SF 2 -Command Center", "isSFOUser": true, "password": "sf2count!", "roles": ["sfUser"], "userId": 3, "userName": "commandcenter"}, {"displayName": "La Guardia - Command Center",
 "isSFOUser": false, "password": "dc@laguardia", "roles": ["admin"], "userId": 4, "userName": "dclaguardia"}, {"displayName": "Hostos - Command Center", "isSFOUser": false, "password": "dc@hostos", "roles": ["admin"], "userId": 5, "userName": "dchostos"}, 
 {"displayName": "College Hunter - Command Center", "isSFOUser": false, "password": "dc@collegehunter", "roles": ["admin"], "userId": 6, "userName": "dccollegehunter"}, {"displayName": "Brooklyn College - Command Center", "isSFOUser": false, "password": "dc@brooklyncollege", "roles": ["admin"], "userId": 7, "userName": "dcbrooklyncollege"}]}, "menuPanels": [{"iconClass": "fa fa-television", "isOpened": false, "text": "Dashboard", "value": "dashboard"}, {"iconClass": "fa fa-user", "isOpened": true, "text": "Admin", "value": "admin"}, {"iconClass": "fa fa-bar-chart", "isOpened": false, "text": "Reports", "value": "reports"}], "profileMenu": {"isOpened": false}, "routesOnMap": {"isOpened": false, "popupLoaderShown": false, "routeObject": null}, "smallScreenLeftMenuOpened": false, "smallScreenRightMenuOpened": false, "tabs": [{"category": "dashboard", "isSelected": true, 
 "key": "mapview", "text": "Map View"}, {"category": "dashboard", "isSelected": false, "key": "listview", "text": "List View"}, {"category": "dashboard", "isSelected": false, "key": "dataview", "text": "Data View"}, {"category": "admin", "isSelected": true, "key": "canvassers", "text": "Canvassers"}, {"category": "admin", "isSelected": false, "key":"routes", "text": "Routes"}, {"category": "reports", "isSelected": false, "key": "downloadsurveys", "text": "Download Surveys"}]})
})

  it('should set SET_TOGGLE_PROFILE_MENU', ()=> {
      expect(sharedReducer(sharedState, { type: 'SET_TOGGLE_PROFILE_MENU', payload: {value:'' }})).toEqual({"filterRoutesStatuses": [{"key": "not_started", "label": "Not Started", "layerColor": "#ff0000", "opacity": 0.88, "value": 3}, {"key": "in_progress", 
    "label": "In Progress", "layerColor": "#f7b047", "value": 2}, {"key": "completed", "label": "Completed", "layerColor": "#01ABAB", "value": 4}], "isRightPanelExpanded": true, "leftMenuExpaned": true, "loginDetails": {"displayName": "", "errorMessage": "", "isloggedIn": false, 
"password": "", "rememberMe": false, "userId": null, "userName": "", "users": [{"displayName": "Command Center", "isSFOUser": false, "password": "Work@demotest1!", "roles": ["admin"], "userId": 1, "userName": "commandcenter"}, {"displayName": "SF-Command Center", "isSFOUser": true, 
"password": "sfcount!", "roles": ["sfUser"], "userId": 2, "userName": "commandcenter"}, {"displayName": "SF 2 -Command Center", "isSFOUser": true, "password": "sf2count!", "roles": ["sfUser"], "userId": 3, "userName": "commandcenter"}, {"displayName": "La Guardia - Command Center",
 "isSFOUser": false, "password": "dc@laguardia", "roles": ["admin"], "userId": 4, "userName": "dclaguardia"}, {"displayName": "Hostos - Command Center", "isSFOUser": false, "password": "dc@hostos", "roles": ["admin"], "userId": 5, "userName": "dchostos"}, 
 {"displayName": "College Hunter - Command Center", "isSFOUser": false, "password": "dc@collegehunter", "roles": ["admin"], "userId": 6, "userName": "dccollegehunter"}, {"displayName": "Brooklyn College - Command Center", "isSFOUser": false, "password": "dc@brooklyncollege", "roles": ["admin"], "userId": 7, "userName": "dcbrooklyncollege"}]}, "menuPanels": [{"iconClass": "fa fa-television", "isOpened": false, "text": "Dashboard", "value": "dashboard"}, {"iconClass": "fa fa-user", "isOpened": false, "text": "Admin", "value": "admin"}, {"iconClass": "fa fa-bar-chart", "isOpened": false, "text": "Reports", "value": "reports"}], "profileMenu": {"isOpened": true}, "routesOnMap": {"isOpened": false, "popupLoaderShown": false, "routeObject": null}, "smallScreenLeftMenuOpened": false, "smallScreenRightMenuOpened": false, "tabs": [{"category": "dashboard", "isSelected": true, 
 "key": "mapview", "text": "Map View"}, {"category": "dashboard", "isSelected": false, "key": "listview", "text": "List View"}, {"category": "dashboard", "isSelected": false, "key": "dataview", "text": "Data View"}, {"category": "admin", "isSelected": true, "key": "canvassers", "text": "Canvassers"}, {"category": "admin", "isSelected": false, "key":"routes", "text": "Routes"}, {"category": "reports", "isSelected": false, "key": "downloadsurveys", "text": "Download Surveys"}]})
 })
  it('should set SET_DOCUMENT_CLICK', ()=> {
      expect(sharedReducer(sharedState, { type: 'SET_DOCUMENT_CLICK', payload: true})).toEqual({"filterRoutesStatuses": [{"key": "not_started", "label": "Not Started", "layerColor": "#ff0000", "opacity": 0.88, "value": 3}, {"key": "in_progress", 
    "label": "In Progress", "layerColor": "#f7b047", "value": 2}, {"key": "completed", "label": "Completed", "layerColor": "#01ABAB", "value": 4}], "isRightPanelExpanded": true, "leftMenuExpaned": true, "loginDetails": {"displayName": "", "errorMessage": "", "isloggedIn": false, 
"password": "", "rememberMe": false, "userId": null, "userName": "", "users": [{"displayName": "Command Center", "isSFOUser": false, "password": "Work@demotest1!", "roles": ["admin"], "userId": 1, "userName": "commandcenter"}, {"displayName": "SF-Command Center", "isSFOUser": true, 
"password": "sfcount!", "roles": ["sfUser"], "userId": 2, "userName": "commandcenter"}, {"displayName": "SF 2 -Command Center", "isSFOUser": true, "password": "sf2count!", "roles": ["sfUser"], "userId": 3, "userName": "commandcenter"}, {"displayName": "La Guardia - Command Center",
 "isSFOUser": false, "password": "dc@laguardia", "roles": ["admin"], "userId": 4, "userName": "dclaguardia"}, {"displayName": "Hostos - Command Center", "isSFOUser": false, "password": "dc@hostos", "roles": ["admin"], "userId": 5, "userName": "dchostos"}, 
 {"displayName": "College Hunter - Command Center", "isSFOUser": false, "password": "dc@collegehunter", "roles": ["admin"], "userId": 6, "userName": "dccollegehunter"}, {"displayName": "Brooklyn College - Command Center", "isSFOUser": false, "password": "dc@brooklyncollege", "roles": ["admin"], "userId": 7, "userName": "dcbrooklyncollege"}]}, "menuPanels": [{"iconClass": "fa fa-television", "isOpened": false, "text": "Dashboard", "value": "dashboard"}, {"iconClass": "fa fa-user", "isOpened": false, "text": "Admin", "value": "admin"}, {"iconClass": "fa fa-bar-chart", "isOpened": false, "text": "Reports", "value": "reports"}], "profileMenu": {"isOpened": true}, "routesOnMap": {"isOpened": false, "popupLoaderShown": false, "routeObject": null}, "smallScreenLeftMenuOpened": false, "smallScreenRightMenuOpened": false, "tabs": [{"category": "dashboard", "isSelected": true, 
 "key": "mapview", "text": "Map View"}, {"category": "dashboard", "isSelected": false, "key": "listview", "text": "List View"}, {"category": "dashboard", "isSelected": false, "key": "dataview", "text": "Data View"}, {"category": "admin", "isSelected": true, "key": "canvassers", "text": "Canvassers"}, {"category": "admin", "isSelected": false, "key":"routes", "text": "Routes"}, {"category": "reports", "isSelected": false, "key": "downloadsurveys", "text": "Download Surveys"}]})
 }) 
 it('should set SET_LEFT_MENU_SMALL_SCREEN_TOGGLED', ()=> {
      expect(sharedReducer(sharedState, { type: 'SET_LEFT_MENU_SMALL_SCREEN_TOGGLED', payload: {value:'' }})).toEqual({"filterRoutesStatuses": [{"key": "not_started", "label": "Not Started", "layerColor": "#ff0000", "opacity": 0.88, "value": 3}, {"key": "in_progress", 
    "label": "In Progress", "layerColor": "#f7b047", "value": 2}, {"key": "completed", "label": "Completed", "layerColor": "#01ABAB", "value": 4}], "isRightPanelExpanded": true, "leftMenuExpaned": true, "loginDetails": {"displayName": "", "errorMessage": "", "isloggedIn": false, 
"password": "", "rememberMe": false, "userId": null, "userName": "", "users": [{"displayName": "Command Center", "isSFOUser": false, "password": "Work@demotest1!", "roles": ["admin"], "userId": 1, "userName": "commandcenter"}, {"displayName": "SF-Command Center", "isSFOUser": true, 
"password": "sfcount!", "roles": ["sfUser"], "userId": 2, "userName": "commandcenter"}, {"displayName": "SF 2 -Command Center", "isSFOUser": true, "password": "sf2count!", "roles": ["sfUser"], "userId": 3, "userName": "commandcenter"}, {"displayName": "La Guardia - Command Center",
 "isSFOUser": false, "password": "dc@laguardia", "roles": ["admin"], "userId": 4, "userName": "dclaguardia"}, {"displayName": "Hostos - Command Center", "isSFOUser": false, "password": "dc@hostos", "roles": ["admin"], "userId": 5, "userName": "dchostos"}, 
 {"displayName": "College Hunter - Command Center", "isSFOUser": false, "password": "dc@collegehunter", "roles": ["admin"], "userId": 6, "userName": "dccollegehunter"}, {"displayName": "Brooklyn College - Command Center", "isSFOUser": false, "password": "dc@brooklyncollege", "roles": ["admin"], "userId": 7, "userName": "dcbrooklyncollege"}]}, "menuPanels": [{"iconClass": "fa fa-television", "isOpened": false, "text": "Dashboard", "value": "dashboard"}, {"iconClass": "fa fa-user", "isOpened": false, "text": "Admin", "value": "admin"}, {"iconClass": "fa fa-bar-chart", "isOpened": false, "text": "Reports", "value": "reports"}], "profileMenu": {"isOpened": false}, "routesOnMap": {"isOpened": false, "popupLoaderShown": false, "routeObject": null}, "smallScreenLeftMenuOpened": true, "smallScreenRightMenuOpened": false, "tabs": [{"category": "dashboard", "isSelected": true, 
 "key": "mapview", "text": "Map View"}, {"category": "dashboard", "isSelected": false, "key": "listview", "text": "List View"}, {"category": "dashboard", "isSelected": false, "key": "dataview", "text": "Data View"}, {"category": "admin", "isSelected": true, "key": "canvassers", "text": "Canvassers"}, {"category": "admin", "isSelected": false, "key":"routes", "text": "Routes"}, {"category": "reports", "isSelected": false, "key": "downloadsurveys", "text": "Download Surveys"}]})
 })
 it('should set SET_RIGHT_MENU_SMALL_SCREEN_TOGGLED', ()=> {
      expect(sharedReducer(sharedState, { type: 'SET_RIGHT_MENU_SMALL_SCREEN_TOGGLED', payload: {value:'' }})).toEqual({"filterRoutesStatuses": [{"key": "not_started", "label": "Not Started", "layerColor": "#ff0000", "opacity": 0.88, "value": 3}, {"key": "in_progress", 
    "label": "In Progress", "layerColor": "#f7b047", "value": 2}, {"key": "completed", "label": "Completed", "layerColor": "#01ABAB", "value": 4}], "isRightPanelExpanded": true, "leftMenuExpaned": true, "loginDetails": {"displayName": "", "errorMessage": "", "isloggedIn": false, 
"password": "", "rememberMe": false, "userId": null, "userName": "", "users": [{"displayName": "Command Center", "isSFOUser": false, "password": "Work@demotest1!", "roles": ["admin"], "userId": 1, "userName": "commandcenter"}, {"displayName": "SF-Command Center", "isSFOUser": true, 
"password": "sfcount!", "roles": ["sfUser"], "userId": 2, "userName": "commandcenter"}, {"displayName": "SF 2 -Command Center", "isSFOUser": true, "password": "sf2count!", "roles": ["sfUser"], "userId": 3, "userName": "commandcenter"}, {"displayName": "La Guardia - Command Center",
 "isSFOUser": false, "password": "dc@laguardia", "roles": ["admin"], "userId": 4, "userName": "dclaguardia"}, {"displayName": "Hostos - Command Center", "isSFOUser": false, "password": "dc@hostos", "roles": ["admin"], "userId": 5, "userName": "dchostos"}, 
 {"displayName": "College Hunter - Command Center", "isSFOUser": false, "password": "dc@collegehunter", "roles": ["admin"], "userId": 6, "userName": "dccollegehunter"}, {"displayName": "Brooklyn College - Command Center", "isSFOUser": false, "password": "dc@brooklyncollege", "roles": ["admin"], "userId": 7, "userName": "dcbrooklyncollege"}]}, "menuPanels": [{"iconClass": "fa fa-television", "isOpened": false, "text": "Dashboard", "value": "dashboard"}, {"iconClass": "fa fa-user", "isOpened": false, "text": "Admin", "value": "admin"}, {"iconClass": "fa fa-bar-chart", "isOpened": false, "text": "Reports", "value": "reports"}], "profileMenu": {"isOpened": false}, "routesOnMap": {"isOpened": false, "popupLoaderShown": false, "routeObject": null}, "smallScreenLeftMenuOpened": false, "smallScreenRightMenuOpened": true, "tabs": [{"category": "dashboard", "isSelected": true, 
 "key": "mapview", "text": "Map View"}, {"category": "dashboard", "isSelected": false, "key": "listview", "text": "List View"}, {"category": "dashboard", "isSelected": false, "key": "dataview", "text": "Data View"}, {"category": "admin", "isSelected": true, "key": "canvassers", "text": "Canvassers"}, {"category": "admin", "isSelected": false, "key":"routes", "text": "Routes"}, {"category": "reports", "isSelected": false, "key": "downloadsurveys", "text": "Download Surveys"}]})
 })
 it('should set SET_ROUTE_ON_MAP_OPENED', ()=> {
      expect(sharedReducer(sharedState, { type: 'SET_ROUTE_ON_MAP_OPENED', payload: { isOpened: false, popupLoaderShown: false, routeObject : null }})).toEqual({"filterRoutesStatuses": [{"key": "not_started", "label": "Not Started", "layerColor": "#ff0000", "opacity": 0.88, "value": 3}, {"key": "in_progress", 
    "label": "In Progress", "layerColor": "#f7b047", "value": 2}, {"key": "completed", "label": "Completed", "layerColor": "#01ABAB", "value": 4}], "isRightPanelExpanded": true, "leftMenuExpaned": true, "loginDetails": {"displayName": "", "errorMessage": "", "isloggedIn": false, 
"password": "", "rememberMe": false, "userId": null, "userName": "", "users": [{"displayName": "Command Center", "isSFOUser": false, "password": "Work@demotest1!", "roles": ["admin"], "userId": 1, "userName": "commandcenter"}, {"displayName": "SF-Command Center", "isSFOUser": true, 
"password": "sfcount!", "roles": ["sfUser"], "userId": 2, "userName": "commandcenter"}, {"displayName": "SF 2 -Command Center", "isSFOUser": true, "password": "sf2count!", "roles": ["sfUser"], "userId": 3, "userName": "commandcenter"}, {"displayName": "La Guardia - Command Center",
 "isSFOUser": false, "password": "dc@laguardia", "roles": ["admin"], "userId": 4, "userName": "dclaguardia"}, {"displayName": "Hostos - Command Center", "isSFOUser": false, "password": "dc@hostos", "roles": ["admin"], "userId": 5, "userName": "dchostos"}, 
 {"displayName": "College Hunter - Command Center", "isSFOUser": false, "password": "dc@collegehunter", "roles": ["admin"], "userId": 6, "userName": "dccollegehunter"}, {"displayName": "Brooklyn College - Command Center", "isSFOUser": false, "password": "dc@brooklyncollege", "roles": ["admin"], "userId": 7, "userName": "dcbrooklyncollege"}]}, "menuPanels": [{"iconClass": "fa fa-television", "isOpened": false, "text": "Dashboard", "value": "dashboard"}, {"iconClass": "fa fa-user", "isOpened": false, "text": "Admin", "value": "admin"}, {"iconClass": "fa fa-bar-chart", "isOpened": false, "text": "Reports", "value": "reports"}], "profileMenu": {"isOpened": false}, "routesOnMap": {"isOpened": false, "popupLoaderShown": false, "routeObject": null}, "smallScreenLeftMenuOpened": false, "smallScreenRightMenuOpened": false, "tabs": [{"category": "dashboard", "isSelected": true, 
 "key": "mapview", "text": "Map View"}, {"category": "dashboard", "isSelected": false, "key": "listview", "text": "List View"}, {"category": "dashboard", "isSelected": false, "key": "dataview", "text": "Data View"}, {"category": "admin", "isSelected": true, "key": "canvassers", "text": "Canvassers"}, {"category": "admin", "isSelected": false, "key":"routes", "text": "Routes"}, {"category": "reports", "isSelected": false, "key": "downloadsurveys", "text": "Download Surveys"}]})
 })

 
 it('should set default', ()=> {
 expect(sharedReducer(sharedState, { type: 'default', payload: {value:'commandcenter' }})).toEqual(sharedState)
 })
})