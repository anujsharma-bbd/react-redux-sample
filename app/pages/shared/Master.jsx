import React from 'react';
import { connect } from 'react-redux';

import LeftMenu from "./left-menu/";
import AppHeader from "./header-component/";
import { LoginService } from "../login/services/login.service.jsx";
import { sharedActionTypes } from "./actions/sharedActionTypes";
import RoutesOnMapPopup from "./controls/routes-on-map-control/";
import ConfirmModal from "./controls/confirm-modal/";
import * as Action from "./actions/action";
import { Utility } from "../../common/utility/";
import { GAService } from "./services/ga-service";

/**
 * Master component containing the header and left menu component..
 */
class Master extends React.Component {
    /**
     * Constructor to initialize fields.
     */
    constructor(props, children) {
        super(props);
        this.checkLogin = this.checkLogin.bind(this);
    }
    /**
     * Check login before mount lifecycle is called.
     */
    componentWillMount() {
        this.checkLogin();
    }
    /**
     * Check login.
     */
    checkLogin() {
        let sessionDetails = LoginService.checkLogin();
        if (sessionDetails) {
            // initialise GA code
            GAService.initiliaze(sessionDetails.userName); // handle cases when refresh, already login, and redirected after login
            this.props.dispatch(Action.getAction(sharedActionTypes.SET_LOGGED_IN, { isLoggedIn: sessionDetails.isLoggedIn, userName: sessionDetails.userName, displayName: sessionDetails.displayName, userId: sessionDetails.userId }));
        }
    }

    /**
     * Render view.
     */
    render() {
        return (
            <div>
                <div id="page-container" className={"page-header-fixed page-sidebar-fixed page-with-two-sidebar " + (!this.props.sharedModel.leftMenuExpaned ? "page-sidebar-minified " : "") + (!this.props.sharedModel.isRightPanelExpanded ? " right-sidebar-minified " : "")}>
                    <AppHeader />
                    <LeftMenu />
                    {this.props.children}
                </div>
                {
                    this.props.sharedModel.routesOnMap.isOpened ?
                        <RoutesOnMapPopup isOpen={this.props.sharedModel.routesOnMap.isOpened} loader={this.props.sharedModel.routesOnMap.popupLoaderShown} />
                        : ''
                }
                <ConfirmModal isShowing={this.props.sharedModel.confirmModal.isShowing} message={this.props.sharedModel.confirmModal.message} options={this.props.sharedModel.confirmModal.options} onConfirm={Utility.onConfirm} onCancel={Utility.onConfirmCancel} />
            </div>
        );
    }


}

function mapStatToProps(state) {
    return {
        sharedModel: state.sharedModel
    };
}
export default connect(mapStatToProps)(Master);
