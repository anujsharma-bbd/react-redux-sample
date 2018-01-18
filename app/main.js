import './assets/styles/main.css';
import "babel-polyfill";

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Link, browserHistory, IndexRoute, hashHistory, IndexRedirect, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import store from './pages/shared/store';
import NoMatch from "./pages/shared/nomatch.jsx";
import Master from './pages/shared/Master.jsx';
import AdminCMS from "./pages/admin/components/";
import WebDashboard from "./pages/dashboard/components/";
import Reports from "./pages/reports/components/";
import LoginComponent from "./pages/login/components/";
import RoutesSearchComponent from "./pages/admin/components/right-container/routes/";
import CanvasserSearchComponent from "./pages/admin/components/right-container/canvassers/";
import ListViewComponent from "./pages/dashboard/components/middle-container/list-view/";
import MapViewComponent from "./pages/dashboard/components/middle-container/map-view/";
import DataViewComponent from "./pages/dashboard/components/middle-container/data-view/";
import ReportsContainer from "./pages/reports/components/";
import SurveysSubmittedComponent from "./pages/reports/components/middle-container/surveys-submitted/";
import ManageCountsComponent from "./pages/admin/components/middle-container/manage-counts/";
import ManageTeamsContainer from "./pages/admin/components/middle-container/manage-teams/";
import ManageSitesContainer from "./pages/admin/components/middle-container/manage-sites/";
import ManageEmail from "./pages/admin/components/middle-container/reminder-emails/";
import CheckIn from "./pages/admin/components/middle-container/check-in/";
import { Constants } from "./common/app-settings/constants";
import { GAService } from "./pages/shared/services/ga-service";
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

export default class App extends React.Component {
  constructor(props, _railsContext) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={appHistory} onUpdate={GAService.logPageView}>
          <Route path={Constants.pathNames.home} component={Master}>
            <IndexRedirect authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} to={Constants.pathNames.dashboard[3]} />
            <Route path={Constants.pathNames.reports} component={Reports}>
              <IndexRedirect authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} to={Constants.pathNames.reportsPages[0]} />
              <Route authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} path={Constants.selectedReportsTab.surveysSubmitted} component={SurveysSubmittedComponent} />
            </Route>
            <Route path={Constants.pathNames.admin} component={AdminCMS}>
              <IndexRedirect authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} to={Constants.pathNames.adminPages[0]} />
              <Route authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} path={Constants.selectedAdminTab.canvasser} components={{ main: ManageTeamsContainer, children: CanvasserSearchComponent }} />
              <Route authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} path={Constants.selectedAdminTab.route} components={{ main: ManageTeamsContainer, children: RoutesSearchComponent }} />
              <Route authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} path={Constants.selectedAdminTab.sites} components={{ main: ManageSitesContainer, children: null }} />
              <Route authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} path={Constants.selectedAdminTab.count} components={{ main: ManageCountsComponent, children: null }} />
              <Route authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} path={Constants.selectedAdminTab.manageEmail} components={{ main: ManageEmail, children: null }} />
              <Route authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} path={Constants.selectedAdminTab.checkIn} components={{ main: CheckIn, children: null }} />
              </Route>
            <Route path={Constants.pathNames.dashboard[2]} component={WebDashboard}>
              <IndexRedirect authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} to={Constants.pathNames.dashPages[0]} />
              <Route authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} path={Constants.dashBoardViewKey.mapView} component={MapViewComponent} />
              <Route authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} path={Constants.dashBoardViewKey.listView} component={ListViewComponent} />
              <Route authorize={[Constants.loginUserTypes.admin]} path={Constants.dashBoardViewKey.dataView} component={DataViewComponent} />
            </Route>
          </Route>
          <Route authorize={[Constants.loginUserTypes.sfUser, Constants.loginUserTypes.admin]} path={Constants.pathNames.login} component={LoginComponent} />
          <Route path={Constants.pathNames.noMatch} component={NoMatch} />
        </Router>
      </Provider>
    );
  }
}
