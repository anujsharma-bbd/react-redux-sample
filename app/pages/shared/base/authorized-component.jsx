import React, { PropTypes } from 'react';
import _ from 'lodash';
import {Constants} from "../../../common/app-settings/constants"

class AuthorizedComponent extends React.Component {
    constructor(props) {
        super(props);

    }
    componentWillMount() {
        const { routes } = this.props; // array of routes
        const { router } = this.context;
        // check if user data available
        const user = JSON.parse(localStorage.getItem('loginDetails'));
        if (!user) {
            // redirect to login if not
            router.push(Constants.pathNames.login);
        }

        // get all roles available for this route
        const routeRoles = _.chain(routes)
            .filter(item => item.authorize) // access to custom attribute
            .map(item => item.authorize)
            .flattenDeep()
            .value();
        // compare routes with user data
        if(user && user.roles)
            {       if (_.intersection(routeRoles, user.roles).length === 0) {
                            router.push("/not-authorized");
                        }
            }
            else
                router.push("/login");
            
    }
}
AuthorizedComponent.propTypes = {
    routes: PropTypes.array.isRequired
};
AuthorizedComponent.contextTypes = {
    router: PropTypes.object.isRequired
};
export default AuthorizedComponent;