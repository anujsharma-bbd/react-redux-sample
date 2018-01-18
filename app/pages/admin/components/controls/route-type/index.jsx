import React from "react";
import { connect } from 'react-redux';
import Select from "react-select";
import { menuRenderer } from "../../../../shared/controls/menu-renderer/";
import { adminActionTypes } from "../../../actions/adminActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Constants } from "../../../../../common/app-settings/constants";
import { AdminCMSService } from "../../../services/admin-cms.service";

class RouteType extends React.Component {
    constructor(props) {
        super(props);
        this.onRouteTypeChange = this.onRouteTypeChange.bind(this);
        this.selectedValue = null;
    }
    componentDidMount() {
        this.selectedValue = Constants.routeTypeOptions.find((type) => (type.label === this.props.route.properties.type));;
    }
    onRouteTypeChange(value) {
        this.selectedValue = value;
        AdminCMSService.updateRouteType(this.props.route.id, value.label).then((response) => {
            if (response) {
                this.props.dispatch(Action.getAction(adminActionTypes.SET_ROUTE_TYPE, { routeId: this.props.route.id, routeType: value }));
                if (this.props.model.filterModel.selectedSite) {
                    AdminCMSService.getTeamsForSelectedSite(this.props.model.filterModel.selectedSite,this.props.sharedModel.selectedQCInstances)
                        .then(mappedData => {
                            this.props.dispatch(Action.getAction(adminActionTypes.SET_TEAMS_SEARCHED, mappedData.site[0].team));
                        }).catch((error) => {
                            /**
                             * Show validation error on any error response from service.
                             */
                            this.props.dispatch(Action.getAction(adminActionTypes.SET_PANEL_RELOAD_ADMIN_REFRESH, false));
                            this.showErrorMessage(error.message, Constants.validation.types.error);
                        });
                }
            }
        });
    }
    render() {
        this.selectedValue = Constants.routeTypeOptions.find((type) => (type.label === this.props.route.properties.type));
        return (
            <Select value={this.selectedValue} valueKey="value" labelKey="label" searchable={false} clearable={false}
                menuRenderer={menuRenderer} name="form-field-name" onChange={this.onRouteTypeChange}
                options={Constants.routeTypeOptions} disabled={true} />
        );
    }
}
/**
 * inject the current state
 */
const mapStateToProps = (state) => {
    return {
        model: state.adminModel,
        sharedModel: state.sharedModel
    }
}
export default connect(mapStateToProps)(RouteType);
