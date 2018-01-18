/**
 * Constants for
 * 1. GraphQL service endpoint
 * 2. GeoJSON URL
 */
export const API_URLs = {
    admin: {
        SERVER_BASE_URL: "/web_api/graphql",
        //SERVER_BASE_URL: "http://demostage.demotestportal.demo/web_api/graphql", //-- for development
        SURVEY_EXCEL_DOWNLOAD_URL: '/web_api/download',
        SURVEY_SUBMITTED_EXCEL_URL: '/web_api/getSurveySubmittedList',
        downloadUsersURL: "/api/v1/download_users",
        checkUser: "/api/v1/check_user",
        getUsers:"/api/v1/all_users",
        sendInvitation:"/api/v1/invite_users",
        sendReminderEmail:"/api/v1/create_email_notification",
        fetchTemplates:"/api/v1/fetch_templates",
        listEmailNotifications:"/api/v1/email_notification_list",
        updateEmailNotification:"/api/v1/update_email_notification",
        getEmailNotification:"/api/v1/edit_email_notification?id=",
        deleteEmailNotification:"/api/v1/destroy_email_notification?id=",
        updateStatusEmailNotifications:"/api/v1/update_status",
        fetchNotificationFilteredUsers:"/api/v1/fetch_users?id=",
        fetchUserSource:"/api/v1/fetch_source?count_instance_id=",
        fetchUserByQCI:"/api/v1/fetch_count_instance_users?count_instance_id=",
        updateVolunteer:"/api/v1/update_site_and_status",
    },
    nonAdmin: {
        SERVER_BASE_URL: "http://demosf.demotestportal.demo/graphql", //-- for development
        SURVEY_EXCEL_DOWNLOAD_URL: 'https://demosf.demotestportal.demo:444/download/survey'
    },
    getLogin:"/api/v1/admin_login" 
}

/**
 * Common constants used throughout the application
 */
export const Constants = {
    /**
     * Constants for messages.
     */
    messages: {
        deleteNotification:"Do you want delete notification \"{0}\".",
        selectSite:"Please select a site to add user.",
        changeSite:"Do you want to assign site \"{0}\" to user \"{1}\".",
        changeStatus:"Do you want to mark status as \"{0}\" to user \"{1}\".",
        removeAttachment:"Do you want to remove attachment?",
        loadingError: "Error occured in loading...",
        loadingMessage: "Loading Please wait...",
        loginMessages: {
            emptyUserNamePassword: "Please provide Username and Password.",
            emptyPassword: "Please provide Password.",
            emptyUserName: "Please provide Username.",
            invalidCredentials: "Invalid Username or Password."
        },
        createTeamModal: {
            invalidTeamName: "Team name is required.",
            invalidTeamBorough: "Team Borough is required.",
            invalidTeamSite: "Team site is required.",
            invalidBoroughAndSite: "Team borough and site are required.",
            invalidSite: "Please select site.",
            teamAdded: "Team \"{0}\" added successfully."
        },
        editTeamModal: {
            memberRemoved: "Member \"{0}\" has been removed from the team.",
            teamRemoved: "Team \"{0}\" has been removed successsfully.",
            routeRemoved: "Route \"{0}\" has been removed from the team.",
            allRoutesRemoved: "All routes have been removed from the team.",
            routeRemoveConfirm: "Are you sure, you want to remove route \"{0}\" from team \"{1}\" ?",
            memberRemoveConfirm: "Are you sure, you want to remove user \"{0}\" from team \"{1}\" ?",
            allRoutesRemoveConfirm: "Are you sure, you want to remove all routes from team \"{0}\" ?",
            teamRemoveConfirm: `Are you sure, you want to delete team "{0}"?`
        },
        routeOnMap: {
            statusChanged: "Route status changed successfully."
        },
        createEditCanvasser: {
            invalidFirstName: "First Name is required.",
            invalidLastName: "Last Name is required.",
            emailRequired: "Email is required.",
            invalidEmail: "Email is invalid.",
            canvasserAdded: "Canvasser \"{0}\" added successfully.",
            canvasserUpdated: "Canvasser \"{0}\" updated successfully.",
            canvasserDeleted: "Canvasser \"{0}\" deleted successfully.",
            canvasserDeleteConfimMsg: "Are you sure, you want to delete canvasser \"{0}\"?",
            canvasserTeamRelationMsg: "Canvasser \"{0}\" is assigned to team \"{1}\".",
            emailIdAlreadyExists: "Email id already exists."
        },
        createEditSite: {
            invalidsiteName: "Site Name is required.",
            invalidsiteLabel: "Site Label is required.",
            canvassersLimitRequired: "Canvassers Limit is required.",
            siteAdded: "Site \"{0}\" added successfully.",
            siteUpdated: "Site \"{0}\" updated successfully.",
            siteDeleted: "Site \"{0}\" deleted successfully.",
            siteDeleteConfimMsg: "Are you sure, you want to delete site <br/> \"{0}\" ?"
        },
        commonMessages: {
            someErrorOccured: "Some error occured!. Please try again.",
            invitationEmail: "Invitation to \"{0}\" users has been sent successfully",
            reminderSet: "Email notification has been scheduled.",
            reminderUpdate:"Email notification has been updated.",
            reminderDelete:"\"{0}\" notification has been deleted.",
            needEmails: "Please enter emails to send invitation.",
            setDateTime:"please set schedule date.",
            enterName:"notification name cann't be empty",
            exceptionOnPageLoad: "Error occured while loading data!. <i class='error-message-details'>{0}</i>.",
            validationFailed:"Please select all mandatory(*) fields.",
            nameError:"Notification name is required.",
            noUserFound:"No user found",
            noDataFound:"No data found",
            segmentError:"Please select option for \"{0}\".",
            subjectError:"Notification subject is required.",
            registrationWindowOverlap:"Registration window is overlapping with \'{0}\'  Dedmo Instance."
        },
        assignCanvasserToTeam: "Do you want to assign canvasser \"{0}\" to team \"{1}\" ?",
        assignCanvasserToTeamFailure: "Relation b/w canvasser \"{0}\" and team \"{1}\" does not exist.\n Please refresh.",
        routeProgress: {
            routesCompletedInformation: "\"{0}\" of \"{1}\""
        },
        reportsModel: {
            selectBoroughSite: "Please select borough or site to view submitted surveys.",
            paginationShowsSummary: "{0} - {1} of {2} items",
            downloadSurvey: "Please select borough or site to download submitted surveys.",
        },
        countsModel: {
            countInstanceDeactivationSuccess: "Dedmo Instance \"{0}\" deactivated successfully.",
            countInstanceDeactivationFailure: "Dedmo Instance \"{0}\" deactivation failed.",
            countInstanceActivationSuccess: "Dedmo Instance \"{0}\" activated successfully.",
            countInstanceActivationFailure: "Dedmo Instance \"{0}\" activation failed.",
            countInstanceCreationSuccess: "Dedmo Instance \"{0}\" created successfully.",
            countInstanceCreationFailure: "Dedmo Instance \"{0}\" creation failed.",
            countInstanceUpdationSuccess: "Dedmo Instance \"{0}\" updated successfully.",
            countInstanceUpdationFailure: "Dedmo Instance \"{0}\" updation failed.",
            countInstanceDeletionSuccess: "Dedmo Instance \"{0}\" deleted successfully.",
            countInstanceDeletionFailure: "Dedmo Instance \"{0}\" deletion failed.",
            noActiveCountInstanceFound: "There aren't any active counts.",
            invalidDate: "Invalid date",
            dateType: "string",
            noTeamUpload: "Please upload team assignments to activate this Dedmo Instance.",
            noRouteUpload: "Please upload routes to activate this Dedmo Instance.",
            noRouteAndTeamUpload: "Please upload routes and team assignments to activate this Dedmo Instance.",
            noSiteUpload: "Please upload sites to activate this Dedmo Instance.",
            noSiteAndTeamUpload: "Please upload sites and team assignments to activate this Dedmo Instance.",
            noSiteAndRouteUpload: "Please upload sites and routes to activate this Dedmo Instance.",
            noSiteAndRouteAndTeamUpload: "Please upload sites, routes and team assignments to activate this Dedmo Instance.",
            confirmMessage: "Are you sure?",
            activateCountModalTitle: "Activate Count",
            activateCountModalBody: "You are about to activate count \"{0}\". This will result in the deactivation of the currently active count \"{1}\".",
            activateCountModalOnlyBody: "You are about to activate count \"{0}\".",
            activateCountModalActivateButton: "Yes, Activate",
            activateCountModalCancelButton: "No, Cancel",
            deactivateCountModalTitle: "Deactivate Count",
            deactivateCountModalBody: "You are about to deactivate count \"{0}\".",
            deactivateCountModalActivateButton: "Yes, Dectivate",
            deactivateCountModalCancelButton: "No, Cancel",
            cannotActivateCountModalTitle: "Cannot activate count \"{0}\"",
            cannotActivateCountModalOkButton: "Ok",
            deleteCountModalTitle: "Delete Count",
            deleteCountModalBody: "You are about to delete count \"{0}\".",
            deleteCountModalActivateButton: "Yes, Delete",
            deleteCountModalCancelButton: "No, Cancel",
            reminderEmailTime: "Selected date should be greater than current date .",

        },
        google_analytics: {
            eventBy: "{0} by \"{1}\"",
            eventAt: "{0} at {1}",
            assignedAt: "Assigned at {0}",
            unAssignedAt: "Removed at {0}",
            createdAt: "Created at {0}",
            updatedAt: "Updated at {0}",
            deletedAt: "Deleted at {0}",
            clickedAt: "Clicked at {0}",
            downloadedAt: "Downloaded at {0}"
        },
        defaultMessageTimeout: 10000,// in milliseconds
        messageTimeout_5000:5000,
        noRecordFound: "No Record Found.",
        noTeamMember: "No team members assigned.",
        noTeamRoute: "No Routes Assigned.",
        selectBoroughSite: "Please select Borough and Site to view team assignments.",
        selectBoroughSiteSF: "Please select Site to view team assignments.",
        noRoutesOnMap: "No Routes to show"
    },
    symbol:{
        dash:" |"
    },    
    countsView: {
        routeDescriptorCreate: "routeDescriptorCreate",
        siteTeamDescriptorCreate: "siteTeamDescriptorCreate",
        routeDescriptorUpdate: "routeDescriptorUpdate",
        siteTeamDescriptorUpdate: "siteTeamDescriptorUpdate",
        isUploaded: "Uploaded",
        notUploaded: "None Uploaded"
    },
    unitsOfdate: {
        year: "year",
        month: "month",
        day: "day"
    },
    pusher: {
        key: "fcdd0eec0289da9550da",
        channels: {
            name: 'downloadSubmittedSurveyCSV',
            surveyDownload: 'downloadSubmittedSurveyCSV',
            canvassersDownload: "canvassersDownloadCSV"
        },
        events: {
            onDownloadSubmittedSurveyCSV: 'onDownloadSubmittedSurveyCSV',
            onCanvDownloadCSV: 'onCanvDownloadCSV'
        }
    },
    emailNotificationModel:{
        id:"id",
        count_instance_id: "count_instance_id",
        notification_name: "notification_name",
        segment: "segment",
        segment_value: "segment_value",
        template: "template",
        include_canc_reg: "include_canc_reg",
        send_on_registration: "send_on_registration",
        is_active: "is_active",
        send_now: "send_now",
        scheduled_time:"scheduled_time",
        isNotificationUpdate:"isNotificationUpdate",
        csv_upload:"csv_upload",
        fileName:"fileName",
        isFileRemoved:"isFileRemoved",
        notification_subject:"notification_subject",
        send_upon_cancellation:"send_upon_cancellation",
        source:"source",
        isFileUploaded:"isFileUploaded",
        send_only_to_csv :"send_only_to_csv",
        isUpdateDisabled:"isUpdateDisabled"
        
    },
    segment:{
        site:"Site",
        siteType:"Site Type",
        registrationStatus:"Registration Status",
        userSource:"User Source"
    },
    google_analytics: {
        trackingID: { production: "UA--2", staging: "UA--2", development: "UA--2", test: "UA--2" },
        eventLogging: {
            eventLabels: { time: "Time", "updateAssignment": "Update Assignment", "addAssignment": "Add Assignment", removeAssignment: "Remove Assignment", download: "Download", "login": "Login", loginOpen: "LoginOpen", pageOpened: "Page Open" },
            actions: {
                Login: {
                    login_Loaded: "Login(Loaded)",
                    login_Success: "Login(Success)",
                    login_Failed: "Login(Failed)"
                },
                Dashboard: {
                    dashboard_Loaded: "Dashboard(Loaded)",
                    dashboard_Refresh: "Dashboard(Refresh)",
                    updateRoute: "Update Route",
                    opened: "Opened"
                },
                Admin: {
                    admin_Loaded: "Admin(Loaded)",
                    admin_Refresh: "Admin(Refresh)",
                    updateRoute: "Updated Route",
                    createCanvasser: "Created canvasser \"{0}\"",
                    updateCanvasser: "Updated canvasser \"{0}\"",
                    assignCanvasser: "Assigned canvasser \"{0}\" to  team \"{1}\"",
                    removeCanvasser: "Removed canvasser \"{0}\" from team \"{1}\"",
                    assignRoute: "Assigned route \"{0}\" to  team \"{1}\"",
                    removeRoute: "Removed route \"{0}\" from team \"{1}\"",
                    deleteCanvasser: "Deleted canvasser \"{0}\"",
                    deleteTeam: "Deleted team \"{0}\"",
                    createTeam: "Created team \"{0}\"",
                    removeAllRoutes: "Removed all routes from team \"{0}\"",
                    createSite: "Created site \"{0}\"",
                    updateSite: "Updated site \"{0}\"",
                    deleteSite: "Deleted site \"{0}\""
                },
                Reports: {
                    recordsFetched: "Get Records",
                    downloadReportClicked: "Download reports button clicked",
                    downloadReportSucceeded: "Download reports succceeded"
                }
            }
        }
    },
    downloadCookie: {
        name: "isDownloadingDone",
        value: false,
        cookieRefreshTime: 1000
    },
    htmlNumberofSpecChar: {
        atTheRateSymbol: "&#64;",
        threeDots: "..."
    },
    selectedAdminTab: {
        route: "routes",
        canvasser: "canvassers",
        sites: "sites",
        count: "counts",
        admin: "admin",
        manageEmail: "manageEmail",
        checkIn:"checkIn"
    },
    selectedReportsTab: {
        surveysSubmitted: 'surveysSubmitted'
    },
    defaultSelectedOption: "All",
    countStatus: {
        active: { value: "active", label: "Active" },
        inactive: { value: "inactive", label: "Inactive" },
        undefinite: { value: "undefined", label: "Undefined" }
    },
    countType: {
        hopeCount: "hopeCount",
        quarterlyCount: "quarterlyCount"
    },
    sessionLoginDetails: "loginDetails",
    /**
     * Constants for drag types
     */
    dragType: {
        canvasser: "Canvasser",
        route: "Route"
    },
    queryTypes: {
        select: "SELECT",
        mutation: "MUTATION"
    },
    /**
     * Constants for filters types
     */
    filterStatusType: {
        canvasser: "canvasser",
        route: "route"
    },
    /**
     * Constants for graphQL actions
     */
    action: {
        none: "none",
        add: "add",
        update: "update",
        delete: "delete",
        send:"Send",
        scheduleReminder: "Schedule Reminder",
        scheduleEmail:"Schedule Email",
        reset:"Reset",
        cancel : "Cancel",
        uploadCSV:"upload CSV",
        viewUsers:"View users"
    },
    /**
     * Constants for validation messages
     */
    validation: {
        types: {
            success: {
                key: "Success",
                containerCSS: "validation_success",
                icon: "fa fa-check"
            },
            error: {
                key: "Error",
                containerCSS: "validation_error",
                icon: "fa fa-times-circle"
            },
            warning: {
                key: "Warning",
                containerCSS: "validation_warning",
                icon: "fa fa-warning"
            },
            info: {
                key: "Info",
                containerCSS: "validation_info",
                icon: "fa fa-info-circle"
            }
        },
        mainContainerCSS: "validation_container"
    },
    emptyString: "",
    /**
     * Constants for circular progress chart
     */
    circularProgressChart: {
        percent: 'percent',
        maxCircleAngle: 360,
        maxCircleAngleToClamp: 359.9,
        minCircleSectorAngle: 3.6,
        linearGradientKey: 'linearGradient',
        backGroundKey: 'backGround',
        foreGroundKey: 'foreGround',
        percentLabelPositionX: 100,
        percentLabelPositionY: 100,
        percentLabelPositionYProgessLabelHidden: 125,
        progressLabelPositionX: 100,
        progressLabelPositionY: 130,
        startRedColor: 218,
        startBlueColor: 45,
        startGreenColor: 20,
        redColorDilutionValue: 1.99,
        greenColorDilutionValue: 1.59,
        blueColorDilutionValue: 1.45
    },
    colorCodes: {
        inProgressRoutes: "#F09c1c",
        notStartedRoutes: "#ED5959",
        completedRoutes: "#4EABAC"
    },
    dateTimeFormates: {
        mmddyyyy: "MM/dd/yyyy",
        countStartDate: "MM/DD/YY",
        countStartTime: "hh:mm a",
    },
    dateTimeType:{
        time:"Time",
        date:"Date"
    },
    teamsNeedingEscorts: 'Teams needing NYPD escort:',
    routeStatusKey: {
        inProgress: {
            key: "in_progress",
            value: "In Progress"
        },
        notStarted: {
            key: "not_started",
            value: "Not Started"
        },
        completed: {
            key: "completed",
            value: "Completed"
        },
        unAssigned: {
            key: "unAssigned",
            value: "UnAssigned"
        },
        assigned: {
            key: "assigned",
            value: "assigned"
        }
    },
    canvasserStatus: {
        assigned: {
            key: 'assigned', value: 'Assigned'
        },
        unAssigned: {
            key: 'unAssigned', value: 'UnAssigned'
        }
    },
    pathNames: {
        admin: "admin",
        home: "/",
        login: "login",
        dashboard: [
            "/dashboard", "/dashboard/", "dashboard", "dashboard/mapview"
        ],
        reportsPages: ['surveysSubmitted'],
        adminPages: ['canvassers'],
        dashPages: ["mapview"],
        reports: 'reports',
        canvasser: "canvasser",
        noMatch: "*"
    },
    surveysSubmittedType: {
        all: "all",
        borough: "zone",
        site: "site",
        team: "team"
    },
    inviteEmail: {
        invalidEmail: "Please enter email in correct format."
    },
    dashBoardViewKey: {
        mapView: "mapview",
        listView: "listview",
        dataView: "dataview",
        filterSector: 'filterSector',
        filterRoute: 'filterRoute',
        progressToggle: 'progressToggle',
        keywordsearch: 'keywordsearch'
    },
    reportsViewKeys: { surveysSubmitted: 'surveysSubmitted' },
    menuCategory: { "admin": "admin", "dashboard": "dashboard", "reports": "reports" },
    loginUserTypes: {
        admin: "admin",
        sfUser: "sfUser"
    },
    routeTypeOptions: [
        {
            value: 1, label: "Park"
        },
        {
            value: 2, label: "Subway"
        },
        {
            value: 3, label: "Street"
        }
    ],
    routesStatus: {
        in_progress: "in_progress",
        not_started: "not_started",
        completed: "completed"
    },
    intialValue:{ id: -1, name: '--select--' },
    intialValueOfSite:{boroughId:-1, siteId: -1, siteName: 'All' },
    intialValueOfBorough:{boroughId:-1, boroughName: 'All' },
    routeNeedNYPD: {
        yes: "YES",
        no: "NO",
        true: "true",
        false: "false"
    },
    isPark: {
        true: "true",
        false: "false"
    },
    booleanString: {
        true: "true",
        false: "false"
    },
    canvasserCheckedIn: {
        checkedIn: "Checked In",
        notCheckedIn: "Not Checked In",
        checkedOut: "Checked Out"
    },
    mapThemes: {
        Theme_1: [
            {
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#242f3e'
                    }
                ]
            }, {
                elementType: 'labels.text.stroke',
                stylers: [
                    {
                        color: '#242f3e'
                    }
                ]
            }, {
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#746855'
                    }
                ]
            }, {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#d59563'
                    }
                ]
            }, {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#d59563'
                    }
                ]
            }, {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#263c3f'
                    }
                ]
            }, {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#6b9a76'
                    }
                ]
            }, {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#38414e'
                    }
                ]
            }, {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [
                    {
                        color: '#212a37'
                    }
                ]
            }, {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#9ca5b3'
                    }
                ]
            }, {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#746855'
                    }
                ]
            }, {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [
                    {
                        color: '#1f2835'
                    }
                ]
            }, {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#f3d19c'
                    }
                ]
            }, {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#2f3948'
                    }
                ]
            }, {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#d59563'
                    }
                ]
            }, {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#17263c'
                    }
                ]
            }, {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#515c6d'
                    }
                ]
            }, {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [
                    {
                        color: '#17263c'
                    }
                ]
            }
        ],
        Theme_2: [
            {
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#ebe3cd'
                    }
                ]
            }, {
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#523735'
                    }
                ]
            }, {
                elementType: 'labels.text.stroke',
                stylers: [
                    {
                        color: '#f5f1e6'
                    }
                ]
            }, {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [
                    {
                        color: '#c9b2a6'
                    }
                ]
            }, {
                featureType: 'administrative.land_parcel',
                elementType: 'geometry.stroke',
                stylers: [
                    {
                        color: '#dcd2be'
                    }
                ]
            }, {
                featureType: 'administrative.land_parcel',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#ae9e90'
                    }
                ]
            }, {
                featureType: 'landscape.natural',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#dfd2ae'
                    }
                ]
            }, {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#dfd2ae'
                    }
                ]
            }, {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#93817c'
                    }
                ]
            }, {
                featureType: 'poi.park',
                elementType: 'geometry.fill',
                stylers: [
                    {
                        color: '#a5b076'
                    }
                ]
            }, {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#447530'
                    }
                ]
            }, {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#f5f1e6'
                    }
                ]
            }, {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#fdfcf8'
                    }
                ]
            }, {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#f8c967'
                    }
                ]
            }, {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [
                    {
                        color: '#e9bc62'
                    }
                ]
            }, {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#e98d58'
                    }
                ]
            }, {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry.stroke',
                stylers: [
                    {
                        color: '#db8555'
                    }
                ]
            }, {
                featureType: 'road.local',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#806b63'
                    }
                ]
            }, {
                featureType: 'transit.line',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#dfd2ae'
                    }
                ]
            }, {
                featureType: 'transit.line',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#8f7d77'
                    }
                ]
            }, {
                featureType: 'transit.line',
                elementType: 'labels.text.stroke',
                stylers: [
                    {
                        color: '#ebe3cd'
                    }
                ]
            }, {
                featureType: 'transit.station',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#dfd2ae'
                    }
                ]
            }, {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [
                    {
                        color: '#b9d3c2'
                    }
                ]
            }, {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#92998d'
                    }
                ]
            }
        ]
    }
};
