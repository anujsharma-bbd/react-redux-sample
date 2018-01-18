import { API_URLs, Constants } from "../../../common/app-settings/constants";
import { CustomMarker } from "../components/controls/google-map-custom-marker/";
import { MapLabel } from "../components/controls/custom-map-label-control/";
import { Utility } from "../../../common/utility";
import { CommonService } from "../../shared/services/common.service";
import * as Action from "../../shared/actions/action";
import { sharedActionTypes } from "../../shared/actions/sharedActionTypes";
import Scroll from 'react-scroll';

let DashboardMapService = {
    selectedBorough: null,
    selectedSite: null,
    selectedSector: null,
    centerPoints: {
        lat: 40.651410,
        lng: -73.935500
    },
    bounds: null,
    dashboardSurveyMarkers: [],
    initMap: function (callbackFunction) {
        google.maps.visualRefresh = true;

        let position = new google.maps.LatLng(DashboardMapService.centerPoints.lat, DashboardMapService.centerPoints.lng);
        var mapDiv = document.getElementById('mapviewBody');
        window.dashboardMap = new google.maps.Map(mapDiv, {
            center: position,
            zoom: 11,
            mapTypeControl: true,
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain'],
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            scaleControl: false,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            }
        });
        let loginDetails = CommonService.getRoleSettings();
        if (loginDetails) {
            callbackFunction();
        }
        //DashboardMapService.registerInfoWindow();
        window.onresize = DashboardMapService.resizeMap;
        window.mapLabels = [];
    },
    resizeMap: function () {
        google.maps.event.trigger(window.dashboardMap, "resize");
    },
    // clear all info windows
    clearOldInfoWindows: () => {
        if (window.infowindow) { window.infowindow.close(); }
        if (window.infowindows && window.infowindows.length) {
            window.infowindows.forEach(infowindow => {
                infowindow.close();
            })
        }
    },
    addListenersOnPolygon: function (polygon, props) {
        if (!polygon) return;
        google.maps.event.addListener(polygon, 'click', function (event) {
            DashboardMapService.clearOldInfoWindows();
            window.infowindow = new google.maps.InfoWindow();
            var featureId = 0;
            if (window.dashboardMap) {

                let name = polygon.route.name;
                let zone = polygon.route.boroughName;
                let status = polygon.route.routeStatus;
                let filterRoutesStatuses = [{
                    "value": 3,
                    "label": "Not Started",
                    "layerColor": "#ff0000",
                    "key": "not_started",
                    "opacity": 0.88
                },
                {
                    "value": 2,
                    "label": "In Progress",
                    "layerColor": "#f7b047",
                    "key": "in_progress"
                },
                {
                    "value": 4,
                    "label": "Completed",
                    "layerColor": "#01ABAB",
                    "key": "completed"
                }];
                let bgColor = "";
                if (status) {
                    bgColor = filterRoutesStatuses.find(f => f.key.toLowerCase() == status.toLowerCase()).layerColor;
                }
                let routeType = polygon.route.routeType.toLowerCase(); // Point == Subway Icon
                if (routeType == "Subway".toLowerCase()) {
                    name += (polygon.route.station ? ": " + polygon.route.station : "");
                }
                let xyz = () => {
                    console.log("click");
                    // props.dispatch(Action.getAction(sharedActionTypes.SET_ROUTE_ON_MAP_OPENED, { isOpened: true, popupLoaderShown: false, routeObject: [polygon.route] }))
                };
                let toolTip = '<table class="route-tooltip-map"><tr><td><b>Route:</b></td><td>' +
                    name +
                    '<i onclick="xyz()" class="fa fa-map route-icon" style="color:"' + bgColor +
                    '></i></td></tr>' + (!CommonService.isSFOUser() ? '<tr><td><b>Borough:&nbsp;</b></td><td>'
                        + zone + '</td></tr>' : '') + '</table>';
                // let toolTip = "<table class='route-tooltip-map'><tr><td><b>Route:</b></td><td>" + name + " <i class='fa fa-map route-icon' style='color:" + bgColor + "'></i></td></tr>" + (!CommonService.isSFOUser() ? "<tr><td><b>Borough:&nbsp;</b></td><td>" + zone + "</td></tr>" : '') + "</table>";
                let contentHtml = `                    
                        <table class='route-tooltip-map'>
                            <tr>
                                <td><b>Route:&nbsp;</b></td>
                                <td>${name} <i id='${name}' class='fa fa-map route-icon' style='color:${bgColor}' ></i></td>
                            </tr>
                            ${!CommonService.isSFOUser() ?
                        '<tr><td><b>Borough:&nbsp;</b></td><td>' + zone + '</td></tr>' : ''}
                        </table>
                    `;
                window.infowindow.setContent(contentHtml);
                window.infowindow.setPosition(event.latlng);
                window.infowindow.setOptions({
                    pixelOffset: new google.maps.Size(0, -30)
                });
                var anchor = new google.maps.MVCObject();
                anchor.setValues({
                    position: event.latLng,
                    anchorPoint: (routeType == "Subway".toLowerCase() ? new google.maps.Point(0, 0) : new google.maps.Point(0, 40))
                });
                window.infowindow.open(window.dashboardMap, anchor);
                google.maps.event.addListener(window.dashboardMap, 'click', function () {
                    window.infowindow.close();
                });
                google.maps.event.addListener(window.infowindow, 'domready', function () {
                    document.getElementById(name).addEventListener("click", function (e) {
                        props.dispatch(Action.getAction(sharedActionTypes.SET_ROUTE_ON_MAP_OPENED, { isOpened: true, popupLoaderShown: false, routeObject: [polygon.route] }));
                    });
                });
            }
        });
    },

    registerInfoWindow: function () {
        // When the user clicks, open an infowindow
        var infowindow = new google.maps.InfoWindow();
        var featureId = 0;
        if (window.dashboardMap) {
            window.dashboardMap.data.addListener('click', function (event) {
                let name = event.feature.getProperty("Name");
                let zone = event.feature.getProperty("zone");
                let routeType = event.feature.getGeometry().getType(); // Point == Subway Icon
                if (routeType == "Point") {
                    name += ": " + event.feature.getProperty("stationName");
                }
                let toolTip = "<table class='route-tooltip-map'><tr><td><b>Route:</b></td><td>" + name + "</td></tr>" + (!CommonService.isSFOUser() ? "<tr><td><b>Borough:&nbsp;</b></td><td>" + zone + "</td></tr>" : '') + "</table>";

                infowindow.setContent(toolTip);
                infowindow.setPosition(event.latlng);
                infowindow.setOptions({
                    pixelOffset: new google.maps.Size(0, -30)
                });
                var anchor = new google.maps.MVCObject();
                anchor.setValues({
                    position: event.latLng,
                    anchorPoint: (routeType == "Point" ? new google.maps.Point(0, 0) : new google.maps.Point(0, 40))
                });

                infowindow.open(window.dashboardMap, anchor);

            });

            google.maps.event.addListener(window.dashboardMap, 'click', function () {
                infowindow.close();
            });
        }
    },
    getRouteNames: function (routes, salectedCategory, filterBoroughName) {
        if (routes && routes.length) {
            // returns comma separated routes names
            let routesNames = [];

            routes.forEach((obj, index) => {
                if (obj.routeStatus == salectedCategory.key && (filterBoroughName == '' || obj.boroughName.replace(/ /g, "").toLowerCase() == filterBoroughName.replace(/ /g, "").toLowerCase())) {
                    routesNames.push(obj.routeName.toLowerCase());
                }
            });
            return routesNames;
        } else
            return [];
    }
    ,
    getValidSiteBoroughNames: function (runObject) {
        let name = "";
        if (runObject && runObject.boroughName) {
            name = runObject.boroughName.trim().replace('All', '');
        }
        return name;
    },
    showLayers: function (filterObject, showAll, allStatus, allTeams, showTeamProgress, stopResetViewport, props) {

        // scroll map to view port section
        //Scroll.scroller.scrollTo('scrollToMapElement', { duration: 1500, delay: 100, smooth: true, });

        DashboardMapService.resetMap();
        let boroughName = "";
        if (filterObject.selectedBorough) {
            boroughName = filterObject.selectedBorough.boroughName || "";
            if (boroughName == Constants.defaultSelectedOption) {
                boroughName = "";
            }
            boroughName = boroughName.replace(/ /g, '').toLowerCase();
        }
        // set currently focued area
        DashboardMapService.selectedBorough = filterObject.selectedBorough;
        let bounds = new google.maps.LatLngBounds();
        if (!showAll) { // all colours       
            if (filterObject.routes.length) {
                filterObject.routes.forEach((route) => {
                    let name = route['name'].toLowerCase(), color = "", featureBorough = route['boroughName'].toLowerCase().replace("_", '').replace(/ /g, "");
                    if (featureBorough == boroughName || boroughName === "") {
                        let routeNames = DashboardMapService.getRouteNames(filterObject.routes, filterObject.selectedStatus, featureBorough);
                        if (routeNames.indexOf(name) > -1) {
                            this.showonmap(route, allStatus, bounds, props)
                        }
                    }
                })
            }
        } else if (showAll) {
            filterObject.routes.forEach((route) => {
                if (route.boroughName.toLowerCase() == boroughName || boroughName === "")
                    this.showonmap(route, allStatus, bounds, props)
            })
        }

        let _distinctTeamIds = filterObject.routes.filter(route => filterObject.selectedStatus.key == Constants.emptyString || route.routeStatus == filterObject.selectedStatus.key).map(m => m.teamId);
        _distinctTeamIds = Utility.getUniqueArray(_distinctTeamIds);
        let _elligibleTeams = allTeams.filter(m => _distinctTeamIds.indexOf(m.teamId) >= 0);
        DashboardMapService.showTeamMarkers(_elligibleTeams, showTeamProgress);

        // bound routes to viewport
        window.polygonSet.forEach((polygon) => {
            polygon.setMap(window.dashboardMap);
        })
        window.teamsLatLongs.forEach(latlong => {
            bounds.extend(latlong);
        })
        if (!stopResetViewport) {
            if (window.dashboardMap)
                window.dashboardMap.fitBounds(bounds);
        }

    },
    polygonCenter: function (poly) {
        let lowx = 0;
        let highx = 0;
        let lowy = 0;
        let highy = 0;
        let lats = [];
        let lngs = [];
        let vertices = poly.getPath();

        for (var i = 0; i < vertices.length; i++) {
            lngs.push(vertices.getAt(i).lng());
            lats.push(vertices.getAt(i).lat());
        }

        lats.sort();
        lngs.sort();
        lowx = lats[0];
        highx = lats[vertices.length - 1];
        lowy = lngs[0];
        highy = lngs[vertices.length - 1];
        let center_x = lowx + ((highx - lowx) / 2);
        let center_y = lowy + ((highy - lowy) / 2);
        return (new google.maps.LatLng(center_x, center_y));
    },
    showonmap: function (route, allStatus, bounds, props) {
        let cordinatesArray = [];
        let cordinatesJSON = JSON.parse(route.multipolygonCoordinates);
        if (cordinatesJSON) {
            cordinatesJSON.forEach(latlongArrays => {
                latlongArrays.forEach(splitResult => {
                    splitResult.forEach(arrItem => {
                        let cordinateJson = { "lat": +arrItem[1], "lng": + arrItem[0] };
                        cordinatesArray.push(cordinateJson);
                        bounds.extend(cordinateJson);
                    })
                })
            });
        }
        //layer color
        let color = "#FF0000";
        color = allStatus.find((obj) => obj.key == route.routeStatus).layerColor;

        // Construct the polygon.
        let shape = null;
        let routeObj = { name: route.name, zone: route.boroughName, routeType: route.routeType, station: route.station, routeStatus: route.routeStatus }
        if (route.routeType.toLowerCase() == "Street".toLowerCase()) {
            shape = new google.maps.Polygon({
                paths: cordinatesArray,
                strokeColor: '#444',
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: color,
                fillOpacity: 0.6,
                route: route,
                map: window.dashboardMap
            });

            //construct the label
            //let opts = { text: route.name, position: this.polygonCenter(shape) };
            //let label = new MapLabel(opts);
            //label.setMap(window.dashboardMap);
            //window.mapLabels.push(label);

        } else if (route.properties.type.toLowerCase() == "Subway".toLowerCase()) {
            let subwayIcon = require("../../../assets/img/train_marker_" + routeObj.routeStatus.toLowerCase() + ".svg");
            let coordinates = JSON.parse(route.properties.pointCoordinates);
            var image = {
                url: subwayIcon,
                scaledSize: new google.maps.Size(50, 50),
            }
            if (coordinates) {
                let position = new google.maps.LatLng(coordinates[1], coordinates[0]);
                bounds.extend(position);
                shape = new google.maps.Marker({
                    position: position,
                    optimized: false,
                    icon: image,
                    route: route,
                    map: window.dashboardMap
                });
            }

        }
        if (shape) {
            window.polygonSet.push(shape);
            this.addListenersOnPolygon(shape, props);
        }

    },
    showTeamMarkers: function (teams, showTeamProgress) {
        window.teamsLatLongs = [];
        window.infowindows = [];
        if (teams) {
            let markers = [];
            teams.filter(m => m.teamId != -1 && m.lat && m.lon).forEach((team, index) => {

                let contentString = '<div class="infowindow-team"><b>Team: </b> <span>' + team.teamLabel + "</span></div>";
                let infowindow = new google.maps.InfoWindow({ content: contentString });
                let teamlatlong = new google.maps.LatLng(team.lat, team.lon);
                window.teamsLatLongs.push(teamlatlong);
                let marker = new CustomMarker(teamlatlong, window.dashboardMap, {
                    marker_id: "team-marker-" + team.teamId,
                    className: "team-markers-list",
                    content: '<div class="team-icon-map-outer-1"><div class="team-icon-map-inner-1">&nbsp;</div><div class="team-icon-map-inner-2">' + Utility.getTeamNumber(team.teamLabel) + '</div></div>'
                });

                marker.addListener('click', (e) => {
                    DashboardMapService.clearOldInfoWindows();
                    infowindow.open(window.dashboardMap, marker);
                });
                window.infowindows.push(infowindow);
                markers.push(marker);

            })

            window.dashboardTeamMarkers = markers;
            if (showTeamProgress) {
                DashboardMapService.showSurveyMarkers(teams);
            }
        }

    },
    resetMap() {
        if (window.polygonSet && window.polygonSet.length > 0) {
            window.polygonSet.forEach((polygon) => {
                polygon.setMap(null);
            })
        }
        if (window.mapLabels && window.mapLabels.length > 0) {
            window.mapLabels.forEach((label) => {
                label.setMap(null);
            })
        }

        // remove all old markers
        if (window.dashboardTeamMarkers && window.dashboardTeamMarkers.length) {
            window.dashboardTeamMarkers.forEach((marker, index) => {
                marker.setMap(null);
            })
        }
        if (window.infowindow) {
            window.infowindow.close();
        }
        // clear all polylines
        if (window.progressPolylines && window.progressPolylines.length) {
            for (var i = 0; i < window.progressPolylines.length; i++) {
                polylines[i].setMap(null);
            }
        }
        window.progressPolylines = [];

        // clear all surveys marker
        if (DashboardMapService.dashboardSurveyMarkers) {
            DashboardMapService.dashboardSurveyMarkers.forEach(m => {
                m.setMap(null);
            })
        }
        window.polygonSet = [];
        window.mapLabels = [];
        window.dashboardTeamMarkers = [];
    },
    showSurveyMarkers: (teams) => {

        DashboardMapService.dashboardSurveyMarkers = [];
        if (teams) {
            let markers = [];
            teams.filter(m => m.teamId != -1 && m.properties && m.properties.coordinates && m.properties.coordinates.length)
                .forEach((team, index) => {
                    team.properties.coordinates.forEach((survey, ind) => {

                        let contentString = '<div class="infowindow-team"><b>Submitted At:&nbsp;&nbsp;</b> <span> ' + Utility.convertToFormat(survey.submittedAt, Constants.dateTimeFormates.mmddyyyy) + ' </span></div>';
                        let infowindow = new google.maps.InfoWindow({ content: contentString });
                        var image = {
                            url: require("../../../assets/img/survey_marker_common.svg"),
                            scaledSize: new google.maps.Size(12, 12),
                        }
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(survey.latitude, survey.longitude),
                            optimized: false,
                            map: window.dashboardMap,
                            icon: image
                        });
                        marker.addListener('click', (e) => {
                            DashboardMapService.clearOldInfoWindows();
                            infowindow.open(window.dashboardMap, marker);
                        });

                        window.infowindows.push(infowindow);
                        markers.push(marker);

                    })
                })

            DashboardMapService.dashboardSurveyMarkers = markers;
        }
    }
};

exports.DashboardMapService = DashboardMapService;
