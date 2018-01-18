import { API_URLs, Constants } from "../../../common/app-settings/constants";
import { Utility } from "../../../common/utility";
import { CustomMarker } from "../../dashboard/components/controls/google-map-custom-marker/";
import { CommonService } from "../../shared/services/common.service";

let RoutesOnMapPopupService = {
    centerPoints: {
        lat: 40.651410,
        lng: -73.935500
    },
    bounds: null,
    initRouteMap: function (callbackFunction) {
        google.maps.visualRefresh = true;
        window.polygonSet = [];
        let position = new google.maps.LatLng(RoutesOnMapPopupService.centerPoints.lat, RoutesOnMapPopupService.centerPoints.lng);
        var mapDiv = document.getElementById('routeOnMapBody');
        window.routeOnMap = new google.maps.Map(mapDiv, {
            center: position,
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: Constants.mapThemes.Theme_2,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
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
        RoutesOnMapPopupService.registerInfoWindow();
        window.onresize = RoutesOnMapPopupService.resizeMap;
        window.mapLabels = [];
    },
    resizeMap: function () {
        google.maps.event.trigger(window.routeOnMap, "resize");
    },
    addListenersOnPolygon: function (polygon) {
        google.maps.event.addListener(polygon, 'click', function (event) {

            if (window.infowindow) { window.infowindow.close(); }
            window.infowindow = new google.maps.InfoWindow();
            var featureId = 0;
            if (window.routeOnMap) {

                let name = polygon.route.name;
                let zone = polygon.route.zone;
                let routeType = polygon.route.routeType.toLowerCase(); // Point == Subway Icon
                if (routeType == "Subway".toLowerCase()) {
                    name += (polygon.route.station ? ": " + polygon.route.station : "");
                }
                let toolTip = "<table class='route-tooltip-map'><tr><td><b>Route:</b></td><td>" + name + "</td></tr>" + (!CommonService.isSFOUser() ? "<tr><td><b>Borough:&nbsp;</b></td><td>" + zone + "</td></tr>" : '') + "</table>";

                window.infowindow.setContent(toolTip);
                window.infowindow.setPosition(event.latlng);
                window.infowindow.setOptions({
                    pixelOffset: new google.maps.Size(0, -30)
                });
                var anchor = new google.maps.MVCObject();
                anchor.setValues({
                    position: event.latLng,
                    anchorPoint: (routeType == "Subway".toLowerCase() ? new google.maps.Point(0, 0) : new google.maps.Point(0, 40))
                });
                window.infowindow.open(window.routeOnMap, anchor);
                google.maps.event.addListener(window.routeOnMap, 'click', function () {
                    window.infowindow.close();
                });
            }
        });
    },
    registerInfoWindow: function () {
        // When the user clicks, open an infowindow
        var infowindow = new google.maps.InfoWindow();
        var featureId = 0;
        if (window.routeOnMap) {
            window.routeOnMap.data.addListener('click', function (event) {

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

                infowindow.open(window.routeOnMap, anchor);

            });

            google.maps.event.addListener(window.routeOnMap, 'click', function () {
                infowindow.close();
            });
        }
    },
    getValidSiteBoroughNames: function (runObject) {
        let name = "";
        if (runObject && runObject.boroughName) {
            name = runObject.boroughName.trim().replace('All', '');
        }
        return name;
    },
    setMapCenter: function (feature) {
        RoutesOnMapPopupService.processPoints(feature.getGeometry(), RoutesOnMapPopupService.bounds.extend, RoutesOnMapPopupService.bounds);
        window.routeOnMap.setCenter(RoutesOnMapPopupService.bounds.getCenter());
        window.routeOnMap.fitBounds(RoutesOnMapPopupService.bounds);
    },
    processPoints: function (geometry, callback, thisArg) {
        if (geometry instanceof google.maps.LatLng) {
            callback.call(thisArg, geometry);
        } else if (geometry instanceof google.maps.Data.Point) {
            callback.call(thisArg, geometry.get());
        } else {
            geometry.getArray().forEach(function (g) {
                RoutesOnMapPopupService.processPoints(g, callback, thisArg);
            });
        }
    },
    showLayers: function (routeObjects, allStatuses) {
        window.teamsLatLong = null;
        if (routeObjects.team && routeObjects.team.properties.location)
            this.showTeamMarkers(routeObjects.team);
        if (window.polygonSet && window.polygonSet.length) {
            window.polygonSet.forEach(polygon => {
                polygon.setMap(null);
            })
        }
        RoutesOnMapPopupService.bounds = new google.maps.LatLngBounds();
        routeObjects.forEach(routeObject => {
            //clear old polygons from map

            let routeName = routeObject.routeName ? routeObject.routeName.toLowerCase().replace(/ /g, "") : ((routeObject.label || routeObject.name).toLowerCase().replace(/ /g, ""));
            let routeStatusObject = allStatuses.filter(m => m.key.toLowerCase().replace(/ /g, "") == (routeObject.countInstanceStatus.length > 0 ? routeObject.countInstanceStatus[0].label : Constants.routesStatus.not_started).toLowerCase().replace(/ /g, ""))[0];

            // set currently focued area           

            if (routeName && routeStatusObject) {
                this.showonmap(routeObject, routeStatusObject)
            }
        });
        if (window.teamsLatLong)
            RoutesOnMapPopupService.bounds.extend(window.teamsLatLong);
        window.routeOnMap.fitBounds(RoutesOnMapPopupService.bounds);

    },
    showonmap: function (route, status) {
        let cordinatesArray = [];
        let cordinatesJSON = JSON.parse(route.properties.multipolygonCoordinates);
        if (cordinatesJSON) {
            cordinatesJSON.forEach(latlongArrays => {
                latlongArrays.forEach(splitResult => {
                    splitResult.forEach(arrItem => {
                        let cordinateJson = { "lat": +arrItem[1], "lng": + arrItem[0] };
                        cordinatesArray.push(cordinateJson);
                        RoutesOnMapPopupService.bounds.extend(cordinateJson);
                    })
                })
            });
        }

        // Construct the polygon.      
        let shape = null;
        let routeObj = { name: route.name, zone: route.boroughName, routeType: route.properties.type, station: route.properties.station, routeStatus: route.routeStatus }
        if (route.properties.type.toLowerCase() == "Street".toLowerCase()) {
            shape = new google.maps.Polygon({
                paths: cordinatesArray,
                strokeColor: '#444',
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: status.layerColor,
                fillOpacity: 0.6,
                route: routeObj
            });
        }
        else if (route.properties.type.toLowerCase() == "Subway".toLowerCase()) {

            let subwayIcon = require("../../../assets/img/train_marker_" + routeObj.routeStatus.toLowerCase() + ".svg");
            let coordinates = JSON.parse(route.properties.pointCoordinates);
            let image = {
                url: subwayIcon,
                scaledSize: new google.maps.Size(50, 50),
            }
            if (coordinates) {
                let position = new google.maps.LatLng(coordinates[1], coordinates[0]);
                RoutesOnMapPopupService.bounds.extend(position);
                shape = new google.maps.Marker({
                    position: position,
                    optimized: false,
                    icon: image,
                    route: routeObj
                });
            }
        }
        if (shape) {
            shape.setMap(window.routeOnMap);
            window.polygonSet.push(shape);
            RoutesOnMapPopupService.addListenersOnPolygon(shape);
        }
    },
    updateRouteStatus: function (routeObject, newStatus, countInstanceStatuses) {
        let oldStatusId = routeObject.countInstanceStatus[0].id;
        let newStatusId = countInstanceStatuses.find(m => m.label.toLowerCase() == newStatus.key.toLowerCase()).id;
        if (!oldStatusId)
            oldStatusId = countInstanceStatuses.find(m => (m.label.toLowerCase() == Constants.routesStatus.not_started.toLowerCase())).id;
        let requestPayload = `
                    mutation ChangeRouteStatus {
                        destroyAssignmentRelation( childAssignmentId: ${routeObject.routeId || routeObject.id},parentAssignmentId: ${oldStatusId})
                        createAssignmentRelation( childAssignmentId: ${routeObject.routeId || routeObject.id},parentAssignmentId: ${newStatusId}) {
                            id
                            assignment1Id
                            assignment2Id
                        }
                }
                    `;
        return CommonService.sendRequest(null, Constants.queryTypes.mutation, requestPayload);
    },
    showTeamMarkers(team) {
        if (team) {
            // remove all old markers
            if (window.dashboardTeamMarkers && window.dashboardTeamMarkers.length) {
                window.dashboardTeamMarkers.forEach((marker, index) => {
                    marker.setMap(null);
                })
                window.dashboardTeamMarkers.length = 0;
            }
            if (window.infowindow) { window.infowindow.close(); }
            let markers = [];
            let contentString = '<div class="infowindow-team"><b>Team: </b> <span>' + team.label + "</span></div>";
            window.infowindow = new google.maps.InfoWindow({ content: contentString });
            let teamlatlong = new google.maps.LatLng(team.properties.location.latitude, team.properties.location.longitude);
            window.teamsLatLong = teamlatlong;
            let marker = new CustomMarker(teamlatlong, window.routeOnMap, {
                marker_id: "team-marker-" + team.id,
                className: "team-markers-list",
                content: '<div class="team-icon-map-outer-1"><div class="team-icon-map-inner-1">&nbsp;</div><div class="team-icon-map-inner-2">' + Utility.getTeamNumber(team.label) + '</div></div>'
            });

            marker.addListener('click', (e) => {
                window.infowindow.open(window.routeOnMap, marker);
            });
            markers.push(marker);

            window.dashboardTeamMarkers = markers;

        }

    }

};

exports.RoutesOnMapPopupService = RoutesOnMapPopupService;
