import React from "react";
import Select from "react-select";
import { Constants } from "../../../../../common/app-settings/constants";
import { Utility } from "../../../../../common/utility/";
import { menuRenderer } from "../../../../shared/controls/menu-renderer/";



/**
 * contaon filters to select borough and site
 */
class Volunteer extends React.Component {
    /**
    * Constructor to initialize fields.
    */
    constructor(props) {
        super(props);
        this.siteFilterOptions = this.siteFilterOptions.bind(this);
        this.onVolunteerStatusChange = this.onVolunteerStatusChange.bind(this);
        this.onVolunteerSiteChange = this.onVolunteerSiteChange.bind(this);
    }
    /**
        * Filter sites for selected borough.
        */
    siteFilterOptions(sites, selectedBorough) {
        if (selectedBorough) {
            this.sitesOptions = sites.filter((site) => (site.boroughId == selectedBorough.boroughId));
            // if there is only one site make that selected in drop down
            let allSites = this.sitesOptions.filter(m => m.siteId != -1);
            if (allSites && allSites.length == 1)
                this.sitesOptions = allSites;
        }
    }
    onVolunteerSiteChange(value) {
        let volunteer = this.props.volunteer;
        let message = Utility.stringFormat(Constants.messages.changeSite, value.siteName, volunteer.name);
        let canvObject = {
            id: this.props.volunteer.id,
            status: null,
            site_id: value.siteId,
            value:value,
            message: message
        }
        this.props.onVolunteerChange(canvObject)
    }

    onVolunteerStatusChange(value) {
        let volunteer = this.props.volunteer;
        let message = Utility.stringFormat(Constants.messages.changeStatus, value.name, volunteer.name);
        let canvObject = {
            id: this.props.volunteer.id,
            status: value.name,
            site_id: null,
            value:value,
            message: message
        }
        this.props.onVolunteerChange(canvObject)
    }

    render() {
        let { volunteer } = this.props;
        let volunteerStatus = volunteer.status;
        return <div className={this.props.index%2==0? "ceckin-grid-row  row checkin-row-bg nohidden": "ceckin-grid-row  row nohidden" } key={"row_" + this.props.index}>
            <div className="pad-bot-7 break-word pad-top-6 ccol-lg-3 col-md-3 col-sm-3 col-xs-3  notificatin_list_row">
                {volunteer.name}
            </div>
            <div className="pad-bot-7 break-word pad-top-6 ccol-lg-3 col-md-3 col-sm-3 col-xs-3  notificatin_list_row">
                {volunteer.email}
            </div>
            <div className="pad-bot-7 break-word pad-top-6 ccol-lg-3 col-md-3 col-sm-3 col-xs-3  notificatin_list_row">
                <Select value={volunteerStatus} valueKey="id" labelKey="name" searchable={false} clearable={false}
                    menuRenderer={menuRenderer} name="form-field-name" onChange={this.onVolunteerStatusChange}
                    options={this.props.status} />
            </div>
            <div className="pad-bot-7 break-word pad-top-6 ccol-lg-3 col-md-3 col-sm-3 col-xs-3  notificatin_list_row">
                <Select value={volunteer.site} valueKey="siteId" labelKey="siteName" searchable={false} clearable={false}
                    menuRenderer={menuRenderer} disabled={!this.props.adminSite.isSuperAdmin} filterOptions={this.siteFilterOptions(this.props.sites)} name="form-field-name" onChange={this.onVolunteerSiteChange}
                    options={this.props.sites} />
            </div>

        </div>
    }
}
export default Volunteer;
