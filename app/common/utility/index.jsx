import { Constants } from '../app-settings/constants';
import graphDenormalizerHof from 'graph-denormalizer';
import { sharedActionTypes } from "../../pages/shared/actions/sharedActionTypes";
import { GAService } from "../../pages/shared/services/ga-service";
import * as Action from "../../pages/shared/actions/action";
import Cookies from 'universal-cookie';
import moment from 'moment';

let Utility = {
    sectorsSize: 5,
    dashRefreshInterval: null,
    adminRefreshInterval: null,
    getSectorsDivisions: function (maxValue) {

        let divisions = [];

        if (!isNaN(maxValue)) {

            let pointer = 1;

            while (pointer <= maxValue) {

                divisions.push({
                    label: (this.getPrefixedZero(pointer) + "-" + this.getPrefixedZero(pointer + this.sectorsSize - 1)),
                    value: (this.getPrefixedZero(pointer) + "-" + this.getPrefixedZero(pointer + this.sectorsSize - 1))
                });

                pointer += this.sectorsSize;
            }
        }

        return divisions;

    },
    getPrefixedZero: function (number) {
        return (number.toString().length == 1)
            ? ("0" + number)
            : number.toString();
    },
    onWindowResize: function () {
        window.setTimeout(() => {
            var evt = document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
        }, 500);
    },
    setInterval: function (callbackFunction, timeSpan) {

        let milisecondsString = timeSpan
            .replace(/h/g, '*60*60*1000')
            .replace(/m/g, '*60*1000')
            .replace(/s/g, '*1000');
        let span = parseFloat(milisecondsString.split('*').reduce((item, multiply) => {
            return item * multiply;
        }));

        this.dashRefreshInterval = window.setInterval(() => {
            callbackFunction();
        }, span);
    },
    clearInterval: function () {
        if (this.dashRefreshInterval) {
            window.clearInterval(this.dashRefreshInterval);
        }
    },
    setAdminInterval: function (callbackFunction, timeSpan) {

        let milisecondsString = timeSpan
            .replace(/h/g, '*60*60*1000')
            .replace(/m/g, '*60*1000')
            .replace(/s/g, '*1000');
        let span = parseFloat(milisecondsString.split('*').reduce((item, multiply) => {
            return item * multiply;
        }));

        this.adminRefreshInterval = window.setInterval(() => {
            callbackFunction();
        }, span);
    },
    clearAdminInterval: function () {
        if (this.adminRefreshInterval) {
            window.clearInterval(this.adminRefreshInterval);
        }
    },
    abortAllPromises(callbackFunction) {
        if (window.mapPromises && window.mapPromises.length) {
            window
                .mapPromises
                .forEach((promise) => {
                    if (promise) {
                        if (promise.terminate) {
                            promise.terminate();
                            console.log("promise terminated..");
                        }
                        promise.length = 0; // make array empty
                    }
                })
        }
        // remove loader from screen
        if (callbackFunction)
            callbackFunction();
    }
    ,
    formatAMPM: function (date) {
        if (date) {
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12
                ? 'PM'
                : 'AM';
            hours = hours % 12;
            hours = hours
                ? hours
                : 12; // the hour '0' should be '12'
            minutes = minutes < 10
                ? '0' + minutes
                : minutes;
            let strTime = (hours < 10 ? ("0" + hours) : (hours)) + ':' + minutes + ' ' + ampm;
            return strTime;
        } else
            return "";
    }
    ,
    getFilteredRoutes: function (allRoutes, selectedBoroughValue, selectedSiteValue, selectedTeamValue, selectedFilterKey) {

        let routes = allRoutes.filter((route) => (selectedBoroughValue.boroughId == -1 || route.boroughId == selectedBoroughValue.boroughId)
            && (selectedSiteValue.siteId == -1 || route.siteId == selectedSiteValue.siteId)
            && (selectedTeamValue.teamId == -1 || route.teamId == selectedTeamValue.teamId)
            && (!selectedFilterKey || (route.routeStatus == selectedFilterKey)));
        return routes;

    },
    getRoutesWithStatusFilter: function (filteredRoutes, filteredRouteStatus) {
        if (filteredRoutes) {
            let routes = filteredRoutes.filter((route) => (filteredRouteStatus.value == 1 || (route.routeStatus).toLowerCase() == filteredRouteStatus.key.toLowerCase()));
            return routes;
        }
        else return [];

    },
    getFilteredTeams: function (allTeams, selectedBoroughValue, selectedSiteValue, selectedTeamValue) {

        let teams = allTeams.filter((team) => (selectedBoroughValue.boroughId == -1 || team.boroughId == selectedBoroughValue.boroughId) && (selectedSiteValue.siteId == -1 || team.siteId == selectedSiteValue.siteId) && (selectedTeamValue.teamId == -1 || team.teamId == selectedTeamValue.teamId));
        return teams;

    },
    stringFormat: function () {
        let s = arguments[0];
        for (let i = 0; i < arguments.length - 1; i++) {
            let reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, arguments[i + 1]);
        }
        return s;
    },
    validateEmail: function (email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    /**Generate path element for a given degree. */
    generatePath: function (degrees, radius, edgeSize) {
        const radians = (degrees * Math.PI / 180);
        var x = Math.sin(radians) * radius;
        var y = Math.cos(radians) * -radius;
        const halfEdgeSize = edgeSize / 2;
        x += halfEdgeSize;
        y += halfEdgeSize;
        const largeArcSweepFlag = degrees > 180
            ? 1
            : 0;
        const startX = halfEdgeSize;
        const startY = halfEdgeSize - radius;
        return `M${startX},${startY} A${radius},${radius} 0 ${largeArcSweepFlag} 1 ${x},${y} `;
    },

    /**
     * Gets the coordinates in cartesian form for a circle centered at (centerX, centerY) having radius and sector angle "angleInDegrees".
     */
    polarToCartesian: function (centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    },

    /**
     * Draw the arc from startAngle to endAngle.
     */
    drawArc: function (centerX, centerY, radius, startAngle, endAngle) {

        var start = Utility.polarToCartesian(centerX, centerY, radius, endAngle);
        var end = Utility.polarToCartesian(centerX, centerY, radius, startAngle);

        var largeArcFlag = endAngle - startAngle <= 180
            ? "0"
            : "1";

        var path = [
            "M",
            start.x,
            start.y,
            "A",
            radius,
            radius,
            0,
            largeArcFlag,
            0,
            end.x,
            end.y
        ].join(" ");

        return path;
    },

    /**
     * Converts the percentage completed to the color to be shown for circle.
     */
    percentToRGB: function (percent) {
        let redColor,
            greenColor,
            blueColor;
        redColor = Constants.circularProgressChart.startRedColor - Math.floor(percent * Constants.circularProgressChart.redColorDilutionValue); //208 to 9
        greenColor = Constants.circularProgressChart.startGreenColor + Math.floor(percent * Constants.circularProgressChart.greenColorDilutionValue); //11 to 170
        blueColor = Constants.circularProgressChart.startBlueColor + Math.floor(percent * Constants.circularProgressChart.blueColorDilutionValue); //20 to 165
        return "rgb(" + redColor + "," + greenColor + "," + blueColor + ")";
    },
    /**
 * Restricts the value n to be within a specified range.
 */
    clamp: function (n, min, max) {
        return Math.max(min, Math.min(max, n));
    },
    getSubwayRouteName: function (route) {
        let name = route.routeName || route.label || route.name;
        return (route.routeType == Constants.routeTypeOptions[2].value ? (name + (route.properties.station ? ": " + route.properties.station : '')) : name);
    },
    sortTeamByNameAsc: function (fieldName) {
        return (a, b) => {
            if (a[fieldName] && a[fieldName].indexOf("_") > -1 && b[fieldName] && b[fieldName].indexOf("_") > -1) {
                if (a[fieldName] && b[fieldName] && a[fieldName].split('_').length == 2 && b[fieldName].split('_').length == 2) {
                    let _a = parseInt(a[fieldName].trim().split("_")[1]), _b = parseInt(b[fieldName].trim().split("_")[1]);

                    // spacially handling string values , palcing string to last of the array
                    if (isNaN(_a) && !isNaN(_b)) {
                        return 1;
                    }
                    else if (!isNaN(_a) && isNaN(_b)) {
                        return -1;
                    }
                    else if (isNaN(_a) && isNaN(_b)) {
                        return (a[fieldName].trim().split("_")[1] < b[fieldName].trim().split("_")[1] ? -1 : (a[fieldName].trim().split("_")[1] > b[fieldName].trim().split("_")[1] ? 1 : 0));
                    }
                    return (_a < _b ? -1 : (_a > _b ? 1 : 0));
                } else if (a[fieldName] && b[fieldName]) {
                    return (a[fieldName].trim() < b[fieldName].trim() ? -1 : (a[fieldName].trim() > b[fieldName].trim() ? 1 : 0));
                }
                else return 1;
            }
            else
                return -1;
        }

    },
    isTouchDevice: function () {
        return (('ontouchstart' in window)
            || (navigator.MaxTouchPoints > 0)
            || (navigator.msMaxTouchPoints > 0));
    },
    getLoginDetails: () => JSON.parse(localStorage.getItem('loginDetails')),
    // returns an object of routes {completed,inprogress,notstarted}
    getRoutesStats: (allRoutes) => {

        let stats = { completed: 0, inprogress: 0, notstarted: 0 };

        allRoutes.forEach((route) => {
            if (route.routeStatus && route.routeStatus.toLowerCase() === Constants.routeStatusKey.completed.key.toLowerCase())
                stats.completed++;
            else if (route.routeStatus && route.routeStatus.toLowerCase() === Constants.routeStatusKey.inProgress.key.toLowerCase())
                stats.inprogress++;
            else if (route.routeStatus && route.routeStatus.toLowerCase() === Constants.routeStatusKey.notStarted.key.toLowerCase())
                stats.notstarted++;
        })

        return stats;
    },
    getRoutePercentage: (totalRoutesLength, inprogress, completed, notStarted) => {
        let percent = 0;
        if (totalRoutesLength) {
            if (inprogress) {
                let adjustedInprogress = (inprogress == 1) ? (inprogress * 1.0 / 2) : (inprogress - 1);
                percent = Math.round(((completed + adjustedInprogress) * 1.0) / totalRoutesLength * 100);
            }
            else
                percent = Math.round((completed * 1.0) / (totalRoutesLength) * 100);
        }
        return percent;
    },
    getTeamsNeedingEscort: (allTeams) => {
        let count = 0;
        if (allTeams) {
            allTeams.forEach(team => {
                let needNYPD = (team.route.filter(route => route.properties.needsNypd == "true").length > 0);
                if (needNYPD)
                    count++;
            })
        }
        return count;
    },
    // creating mapped data
    createMappedData: (data, specs) => {

        const typeFn = (typeInput, ele) => typeInput === ele.assignmentType.name;
        const config = {
            typeFn,
            nodeIdAttr: 'id',
            node1IdAttrOnEdge: 'assignment1Id',
            node2IdAttrOnEdge: 'assignment2Id',
            isDirectedGraph: false
        };

        const configuredGraphDenormalizerHof = graphDenormalizerHof(config)

        const nodes = data.assignmentGraph.assignments;

        const edges = data.assignmentGraph.assignmentRelations;
        const graphDenormalizer = configuredGraphDenormalizerHof({ nodes, edges });

        return graphDenormalizer(specs);
    },
    // remove duplicate items from array
    getUniqueArray: (list) => {
        var unique = list.filter(function (elem, index, self) {
            return index == self.indexOf(elem);
        });
        return unique;
    },
    scrollToTop: () => {
        window.scrollTo(0, 0);
    },
    getCanvasserDetails: (data) => {
        return {
            email: (data.properties && data.properties.email) || (Utility.validateEmail(data.name) ? data.name : ''),
            name: (data.properties && data.properties.firstName && data.properties.lastName ? (data.properties.firstName + " " + data.properties.lastName) : (data.label ? data.label : data.name)),
        };
    },
    splitWord: (word) => {
        return word.split(/(?=[A-Z])/).join(" ");
    },
    convertSurveySubmittedCSVDataToJSON: (csv) => {
        let allJSONData = [];

        if (csv && csv.length > 0) {
            let headers = csv[0];
            if (headers.length > 0) {
                let eachJSONData = {};
                headers.forEach((header) => {
                    eachJSONData[header] = "";
                });

                if (csv.length > 1) {
                    let csvData = csv.slice(1);
                    //let data = {};
                    csvData.forEach((row) => {
                        let blankObj = JSON.parse(JSON.stringify(eachJSONData));
                        Object.keys(blankObj).forEach((key, keyindex) => {
                            blankObj[key] = row[keyindex];
                        })
                        allJSONData.push(blankObj);
                    });
                    return allJSONData;
                }
            }
        }
        return allJSONData;
    },
    downloadCSV: (fileName, headers, JSObject) => {
        var csv = headers.join(",") + '\n';
        JSObject.forEach(function (row) {
            csv += row.join(',');
            csv += "\n";
        });
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = fileName + ".csv";
        hiddenElement.click();
    },
    /* get tean number for map service */
    getTeamNumber: function (teamName) {
        let no = "";
        if (teamName) {
            let items = teamName.split('_');
            if (items.length == 2) {
                if (parseInt(items[items.length - 1])) {
                    no = parseInt(items[items.length - 1]);
                } else
                    no = "NA";
            }
        }
        return no;
    },
    /**
     * get routes class to be added based on their status
     */
    getBackgroundColor: (route, filterRoutesStatuses) => {
        let bgColor = "";
        if (route && route.countInstanceStatus && route.countInstanceStatus.length) {
            bgColor = filterRoutesStatuses.find(f => f.key.toLowerCase() == route.countInstanceStatus[0].label.toLowerCase()).layerColor;
        }
        else {
            bgColor = filterRoutesStatuses.find(f => f.key.toLowerCase() == Constants.routesStatus.not_started.toLowerCase()).layerColor;
        }
        return bgColor;
    },
    //show confirm dialog
    showConfirm: (message, onConfirm, onCancel, dispatch, options) => {
        dispatch(Action.getAction(sharedActionTypes.SET_SHOW_CONFIRM_DIALOG, { isShowing: true, message: message, options: options }));
        Utility.onConfirm = () => {
            onConfirm();// execute ok code
            //hide confirm
            dispatch(Action.getAction(sharedActionTypes.SET_SHOW_CONFIRM_DIALOG, { isShowing: false, message: Constants.emptyString }));
        };
        Utility.onConfirmCancel = () => {
            onCancel();// execute ok code
            //hide confirm
            dispatch(Action.getAction(sharedActionTypes.SET_SHOW_CONFIRM_DIALOG, { isShowing: false, message: Constants.emptyString }));
        };
    },
    onConfirm: function (callback) {
        // on confirm ok click
        callback("ok click")
    },
    onConfirmCancel: function (callback) {
        // on confrim cancel click
        callback("cancel click")
    },
   // getLocalDate:
    convertToFormat: (stringDate, format) => {
        if (format == Constants.dateTimeFormates.mmddyyyy) {
            Number.prototype.padLeft = function (base, chr) {
                var len = (String(base || 10).length - String(this).length) + 1;
                return len > 0 ? new Array(len).join(chr || '0') + this : this;
            }
            var ua = navigator.userAgent.toLowerCase();
            var d = new Date(stringDate);
            if ((ua.indexOf('safari') != -1 || ua.indexOf('.net') != -1) && d == 'Invalid Date') {
                if (ua.indexOf('chrome') > -1) {
                    //chrome
                } else {
                    let newDate = stringDate.split(' ')  //safari
                    let constdate = newDate[0].replace('-', '').replace('-', '');
                    if (!isNaN(constdate)) {
                        let dateConstArr = newDate[0].split('-');
                        if (dateConstArr.length === 3) {
                            let newDateVal = dateConstArr[1] + '/' + dateConstArr[2] + '/' + dateConstArr[0];
                            if (newDate.length > 1) {
                                return newDateVal + ' ' + newDate[1];
                            } else {
                                return newDateVal;
                            }
                        }
                    }
                    return stringDate;
                }
            }
            var d = new Date(stringDate);

            let dformat = [(d.getMonth() + 1).padLeft(), d.getDate().padLeft(), d.getFullYear()].join('/') + ' ' + [d.getHours().padLeft(), d.getMinutes().padLeft(), d.getSeconds().padLeft()].join(':');
            Number.prototype.padLeft = null;
            return dformat;
        }
    },
    capitalizeFirstLetter: (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    replaceLastCharacter: (str, char) => {
        return str.replace(/\/([^\/]*)$/, char + '$1');
    },
    replaceAtTheRateSymbol: (str) => {
        return str.replace(/\@/, Constants.htmlNumberofSpecChar.threeDots);
    },
    generateGUID: () => {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now();; //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        })

        return uuid;
    },
    reportsDownloadedSuccessfully: () => {
        // log event on GA download clicked
        GAService.logEvent(
            Utility.stringFormat(Constants.google_analytics.eventLogging.actions.Reports.downloadReportSucceeded),
            Utility.stringFormat(Constants.messages.google_analytics.downloadedAt, Utility.convertToFormat(new Date(), Constants.dateTimeFormates.mmddyyyy)),
            Constants.google_analytics.eventLogging.eventLabels.download,
            false);
    },
    getUniqueIdentifier: () => {
        let uniqueId =
            'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8;
                return v.toString(16);
            });
        return uniqueId;
    },
    getDateForLeftMenu: (dateObj) => {
        let date = new Date(dateObj);
        let month = date.toLocaleString("en-US", { month: "long" });
        let day = date.getDay();
        let year = date.getFullYear();
        return month + " " + day + ", " + year;
    },


    /**
     * Returns count display name on dashboard.
     */
    getCountInstanceDisplayName: (countInstance) => {
        let displayName = (countInstance.name ? (countInstance.name) : "") + (countInstance.date ? (", " + Utility.getDateForLeftMenu(new Date(countInstance.date))) : "");
        return displayName;
    },


    /**
     * Returns the error message on validation of count activation.
     */
    getCountActivationErrorMessage: (siteDescriptor, routeDescriptor) => {
        let errorMessage = null;
        if (siteDescriptor) {
            if (routeDescriptor) {

            } else {
                //no route
                errorMessage = Constants.messages.countsModel.noRouteUpload;
            }
        } else {
            if (routeDescriptor) {
                //no site
                errorMessage = Constants.messages.countsModel.noSiteAndTeamUpload;
            } else {
                //no site
                //no route
                errorMessage = Constants.messages.countsModel.noSiteAndRouteAndTeamUpload;
            }
        }
        return errorMessage;
    },

    /**
   * Enables the "Create" or "Update" button in Dedmo Instance create/update modal.
   * Returns true if "Create"/"Update" buutons are disabled otherwise false.
   */
    isCountInstanceCreateUpdateDisabled: (countsModel) => {
        let countName, countType, startDate, startTime, sites;

        if (countsModel.showUpdateCountModal) {
            countName = countsModel.countInstanceToUpdate.name;
            countType = countsModel.countInstanceToUpdate.newType;
            startDate = countsModel.countInstanceToUpdate.startDate;
            startTime = countsModel.countInstanceToUpdate.startTime;
            sites = true;
        } else if (countsModel.showCreateNewCountModal) {
            countName = countsModel.newCount.name;
            countType = countsModel.newCount.type;
            startDate = countsModel.newCount.startDate;
            startTime = countsModel.newCount.startTime;
            sites = countsModel.newCount.siteDescriptor;
        }
        let isDisabled = true;
        let startDateMoment, isStartDateMomentValid = false;
        if (startDate) {
            if (typeof (startDate) == Constants.messages.countsModel.dateType) {
                if (startDate == Constants.messages.countsModel.invalidDate) {
                    isDisabled = true;
                } else {
                    if (Date.parse(startDate) == NaN) {
                        isDisabled = true;
                    } else {
                        startDateMoment = moment(startDate);
                        isStartDateMomentValid = true;
                    }
                }
            } else {
                startDateMoment = moment(startDate);
                isStartDateMomentValid = true;
            }
        }
        let startTimeMoment, isStartTimeMomentValid = false;
        if (startTime) {
            if (typeof (startTime) == Constants.messages.countsModel.dateType) {
                if (startTime == Constants.messages.countsModel.invalidDate) {
                    isDisabled = true;
                } else {
                    if (Date.parse(startTime) == NaN) {
                        isDisabled = true;
                    } else {
                        startTimeMoment = moment(startTime);
                        isStartTimeMomentValid = true;
                    }
                }
            } else {
                startTimeMoment = moment(startTime);
                isStartTimeMomentValid = true;
            }
        }
        if (isStartDateMomentValid && isStartTimeMomentValid) {
            if ((countName != null && countName.trim().length > 0)
                && (countType != null)
                && (sites)) {
                isDisabled = false;
            }
        }
        return isDisabled;
    },

    getMinutesOfDay: (momentObj)=>{
        return momentObj.minutes() + momentObj.hours() * 60;
    },
    isRegistrationWindowOverlap: (object,countArray)=>{
        let Result = null;
        countArray.forEach(function(item,index) {
             if(object.registrationStartDate<=item.registrationEndDate&&object.registrationStartDate>=item.registrationStartDate 
                || object.registrationEndDate<=item.registrationEndDate&&object.registrationEndDate>=item.registrationStartDate 
                || object.registrationStartDate<=item.registrationStartDate&&object.registrationEndDate>=item.registrationEndDate ){
                Result = item.name;
             }
             
        });
        return Result;
      }
};

exports.Utility = Utility;
