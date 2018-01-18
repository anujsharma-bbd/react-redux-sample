var ReactGA = require('react-ga');
import { Constants } from "../../../common/app-settings/constants";
import { Utility } from "../../../common/utility/";

let GAService = {
    initiliaze: (userID) => {
        try {
            let trackingID = Constants.google_analytics.trackingID[window.__ENV__];
            ReactGA.initialize(trackingID, {
                debug: false,
                titleCase: false,
                gaOptions: {
                    userId: userID,
                    alwaysSendReferrer: false,
                    cookieName: 'gaCookie',
                    hitCallback: () => {
                        console.log("GA Hit call back called...")
                    }
                }
            });
        }
        catch (e) {
            console.log("Error : GAService.initiliaze >>", e);
        }
    },
    logPageView: () => {
        try {
            ReactGA.set({ page: window.location.hash });
            ReactGA.pageview(window.location.hash);
            GAService.logScreenOpenAsEvent();
        }
        catch (e) {
            console.log("Error : GAService.logPageView>>", e);
        }
    },
    logEvent: (eCategory, eActionName, eLabel, nonInteraction) => {
        try {
            ReactGA.event({
                category: eCategory,
                action: eActionName,
                label: eLabel,
                nonInteraction: nonInteraction || false
            });
        }
        catch (e) {
            console.log("Error : GAService.logEvent>>", e);
        }
    },
    logScreenOpenAsEvent: () => {
        try {
            let screenPath = window.location.hash.slice(2);
            if (screenPath[screenPath.length - 1] == "/")
                screenPath = Utility.replaceLastCharacter(screenPath, "")
            //screenPath = screenPath.replace(/\//, ' ');
            // log Event
            GAService.logEvent(
                Utility.capitalizeFirstLetter(screenPath),
                Utility.stringFormat(Constants.messages.google_analytics.eventAt, Constants.google_analytics.eventLogging.actions.Dashboard.opened, Utility.convertToFormat(new Date(), Constants.dateTimeFormates.mmddyyyy)),
                Constants.google_analytics.eventLogging.eventLabels.pageOpened,
                false
            );
        }
        catch (e) {
            console.log("Error : GAService.logScreenOpenAsEvent>>", e);
        }
    }
};

exports.GAService = GAService;
