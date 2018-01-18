import React from "react";
import { connect } from "react-redux";
import { DropTarget } from 'react-dnd';
import { compose } from 'redux';
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Constants } from "../../../../../common/app-settings/constants"
import { Utility } from "../../../../../common/utility";
import AuthorizedComponent from "../../../../shared/base/authorized-component";

/**
 * List view component.
 */
class ListViewComponent extends AuthorizedComponent {

    /**
     * Constructor to initialize fields.
     */
    constructor(props, context) {
        super(props, context);
        this.onOpenRouteOnMapDialog = this.onOpenRouteOnMapDialog.bind(this);
        this.getBGColor = this.getBGColor.bind(this);
    }
    /**
     * Set the current tab to list view.
     */
    componentDidMount() {
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_TAB_CHANGE, { key: Constants.dashBoardViewKey.listView }));
    }

    // open route in map
    onOpenRouteOnMapDialog(routeObject) {
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_ROUTE_ON_MAP_OPENED, { isOpened: true, popupLoaderShown: true, routeObject: [routeObject] }));
    }
    // get routes class to be added based on their status
    getBGColor(routeObject) {
        let bgColor = "";
        if (routeObject && routeObject.countInstanceStatus && routeObject.countInstanceStatus.length) {
            bgColor = this.props.sharedModel.filterRoutesStatuses.find(f => f.key.toLowerCase() == routeObject.countInstanceStatus[0].label.toLowerCase()).layerColor;
        }
        else
            bgColor = this.props.sharedModel.filterRoutesStatuses.find(f => f.key.toLowerCase() == Constants.routesStatus.not_started.toLowerCase()).layerColor;

        return bgColor;
    }
    /**
     * Render View.
     */
    render() {
        let selectedBoroughValue = this.props.model.rightSideModel.filtersModel.selectedBorough;
        let selectedSiteValue = this.props.model.rightSideModel.filtersModel.selectedSite;
        let selectedTeamValue = this.props.model.rightSideModel.filtersModel.selectedTeam;
        let selectedFilterKey = this.props.model.middleFilterModel.filterRoutesSelected.key;
        let searchedRoutes = Utility.getFilteredRoutes(this.props.model.rightSideModel.allRoutes, selectedBoroughValue, selectedSiteValue, selectedTeamValue, selectedFilterKey);
        return (
            searchedRoutes && searchedRoutes.length > 0 ?
                <div>
                    <table className="routeList-table routeList-table-rounded">
                        <thead>
                            <tr>
                                <th style={{textAlign:"center"}}>Route</th>
                                <th style={{textAlign:"center"}}>View&nbsp;On&nbsp;Map</th>
                                <th style={{textAlign:"center"}}>Team</th>
                                <th style={{textAlign:"center"}}>Status</th>
                                <th style={{textAlign:"center"}}>Borough</th>
                                <th style={{textAlign:"center"}}>Site</th>
                                <th style={{textAlign:"center"}}>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                searchedRoutes.map((route, index) => {
                                    return (
                                        <tr key={"route-list-view-" + index}>
                                            <td style={{width:"10px", textAlign:"center"}}>{Utility.getSubwayRouteName(route)} </td>
                                            <td style={{width:"10px",textAlign:"center"}}><i className="fa fa-map route-icon margin-left-5px" title="View/Edit Route Map" style={{ color: this.getBGColor(route), marginTop: '3px' }} onClick={() => { this.onOpenRouteOnMapDialog(route) }} ></i></td>
                                            <td style={{textAlign:"center"}}><label className={route.teamLabel ? '' : 'members-route no-members'}>{route.teamLabel ? (route.teamLabel) : 'Unassigned Team'}</label></td>
                                            <td style={{textAlign:"center"}} className={route.routeStatus == Constants.routeStatusKey.notStarted.key ? 'routeList-table routeList-table-rounded reactable-data teamStatusNotStarted' : (route.routeStatus == Constants.routeStatusKey.completed.key ? 'routeList-table routeList-table-rounded reactable-data teamStatusComplete' : (route.routeStatus == Constants.routeStatusKey.inProgress.key ? 'routeList-table routeList-table-rounded reactable-data teamStatusInProgress' : 'routeList-table routeList-table-rounded reactable-data'))} >{route.routeStatus == Constants.routeStatusKey.notStarted.key ? Constants.routeStatusKey.notStarted.value : (route.routeStatus == Constants.routeStatusKey.completed.key ? Constants.routeStatusKey.completed.value : (route.routeStatus == Constants.routeStatusKey.inProgress.key ? Constants.routeStatusKey.inProgress.value : ''))}</td>
                                            <td style={{textAlign:"center"}}>{route.boroughName} </td>
                                            <td style={{textAlign:"center"}}>{route.siteName} </td>
                                            <td style={{width:"10px", textAlign:"center"}}>{route.routeType}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

                : (!(this.props.model.middleFilterModel.panelProperties.panelReload) ? <div className="no-route-found-message">{Constants.messages.noRecordFound}</div> : <div></div>)

        );
    }

}

let mapStateToProps = (state) => {
    return {
        model: state.dashboardModel,
        sharedModel: state.sharedModel
    }
};

export default connect(mapStateToProps)(ListViewComponent);