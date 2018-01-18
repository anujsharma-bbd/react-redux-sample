import { Constants } from "../../../common/app-settings/constants";
export let CheckInState = {
    "filterModel": {
        "boroughs": [],
        "sites": [],
        "selectedBorough": null,
        "selectedSite": null
    },
    "searchElement":"",
    "volunteers":[],
    "paginationObject":{
        activePage: 1,
        itemsCountPerPage: 10,
        pageRangeDisplayed: 5,
        itemList: [],
        totalItemsCount: 1
    },
    "validation": {
        "message": "",
        "type": Constants.validation.types.success.key,
        "isPopup": false
    },
    "convesserType": [{ id: 1, label: 'MTA', isSelected: false }, { id: 2, label: 'NYPD', isSelected: false }, { id: 3, label: 'Parks', isSelected: false }, { id: 4, label: 'None', isSelected: true }],
    "popupLoaderShown":false,
    "createCanvasserModalIsOpened":null,
    "selectedTeamForConvesser":null,
    "range":[{id:1, range:10},{id:2, range:20},{id:3, range:50},{id:4, range:100},{id:5, range:500}],
    "selectedRange":{id:1, range:10},
    "filteredVolunteer":null,
    "listOrder":{by:"name",order:"a2z"},
    "adminSite":{isSuperAdmin:true,sites:[]},
    "status":[{id:1, name:Constants.canvasserCheckedIn.checkedIn},{id:2,name:Constants.canvasserCheckedIn.notCheckedIn},{id:3,name:Constants.canvasserCheckedIn.checkedOut}]
}