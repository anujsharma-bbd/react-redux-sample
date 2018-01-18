import React from "react";
import { connect } from "react-redux";

import RouteComponent from "./route";
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";
import * as Action from "../../../../shared/actions/action";
import AuthorizedComponent from "../../../../shared/base/authorized-component";
import { Constants } from "../../../../../common/app-settings/constants";

class RoutesSearchComponent extends AuthorizedComponent {


    constructor(props) {
        super(props);
        this.getSearchedRoutes = this.getSearchedRoutes.bind(this);
    }

    componentDidMount() {
        let canvassersSelected = (this.props.location.pathname.indexOf(Constants.pathNames.canvasser) > 0); // current loaded then
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_TAB_CHANGE, { key: canvassersSelected ? Constants.selectedAdminTab.canvasser : Constants.selectedAdminTab.route }));
    }

    getSearchedRoutes() {
        let searchedRoutes = this.props.model.rightSideModel.searchedRoutes;
        searchedRoutes.forEach((route) => {
            let sector = '';
            let subSector = ''
            let i = 0;
            let routeName = route.name.trim();
            for (i = 0; i < routeName.length; i = i + 1) {
                if (parseInt(routeName[i]) || routeName[i] == 0) {
                    sector = sector.toString() + routeName[i].toString();
                }
                else {
                    subSector = subSector + routeName[i];
                }
            }
            route.sector = sector;
            route.subSector = subSector;
            route.boroughName = this.props.model.filterModel.selectedBorough.boroughName;
            route.siteName = this.props.model.filterModel.selectedSite.siteName;
        });
        searchedRoutes.sort((a, b) => {
            if (a.sector === b.sector) {
                return a.subSector > b.subSector ? 1 : a.subSector < b.subSector ? -1 : 0;
            }
            return parseInt(a.sector) > parseInt(b.sector) ? 1 : -1;
        });
        return searchedRoutes;
    }

    render() {
        let searchedRoutes = this.getSearchedRoutes();
        // Internet Explorer 6-11
        let isIE = /*@cc_on!@*/false || !!document.documentMode;
        return (
            <li className="nav-widget routes-search">
          <div className={isIE?"right-side-filtered-routes-ie ":"right-side-filtered-routes "}>
                    <label>Routes ({searchedRoutes ? searchedRoutes.length : ''})</label>
                    <div className="right-side-route-items custom-scroll" >
                        {
                            searchedRoutes && searchedRoutes.length ?
                                searchedRoutes.map((routeObject, index) => {
                                    return (
                                        <RouteComponent ItemNo = {index} routeName={routeObject.name} routeType={routeObject.properties.type} routeTeam={routeObject.team.length > 0 ? routeObject.team[0].label : 'Unassigned Team'} key={routeObject.id}
                                            routeId={routeObject.id} routeObject={routeObject} routeStatus={routeObject.properties.status} />
                                    );
                                })
                                :
                                <div className="no-records-found"></div>
                        }
                    </div>
                </div>
            </li>
        );
    }

}

let mapStateToProps = (state) => {
    return {
        model: state.adminModel
    }
};
export default connect(mapStateToProps)(RoutesSearchComponent);