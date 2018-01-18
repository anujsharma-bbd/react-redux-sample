import React from "react";
import Select from "react-select";
import { menuRenderer } from "../../../../shared/controls/menu-renderer/";



/**
 * contaon filters to select borough and site
 */
class CheckInBoroughsSitesFilter extends React.Component {
    /**
    * Constructor to initialize fields.
    */
    constructor(props) {
        super(props);
        this.siteFilterOptions = this.siteFilterOptions.bind(this);
        this.boroughsFilterOptions = this.boroughsFilterOptions.bind(this);
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

    /**
     * Sort boroughs.
     */
    boroughsFilterOptions(boroughs) {
        this.boroughsOptions = boroughs.sort(function (a, b) {
            let value = 0;
            a.boroughName < b.boroughName ? (value = -1) : (a.boroughName > b.boroughName ? (value = 1) : (value = 0));
            return value;
        })

        // if there is only one borough set that selected
        let allboroughs = boroughs.filter(m => m.boroughId != -1);
        if (allboroughs && allboroughs.length == 1) {
            boroughs = allboroughs;
        }
    }
    render() {
        return <table cellSpacing="0" cellPadding="0" >
            <tbody>
                <tr>
                    {
                        !this.props.IsSFUser ? <td className="filter-boroughs">
                       
                            <Select value={this.props.SelectedBoroughValue} valueKey="boroughId" labelKey="boroughName" searchable={false} clearable={false}
                                menuRenderer={menuRenderer} filterOptions={this.boroughsFilterOptions(this.props.BoroughsOptions)} disabled={this.props.BoroughDisabled}
                                name="form-field-name" onChange={this.props.OnBoroughChange} options={this.props.BoroughsOptions} />
                        </td> : null
                    }
                    {
                        !this.props.hideSites ?
                            <td className="filter-sites">
                       
                                <Select value={this.props.SelectedSiteValue} valueKey="siteId" labelKey="siteName" searchable={false} clearable={false}
                                    menuRenderer={menuRenderer} filterOptions={this.siteFilterOptions(this.props.Sites, this.props.SelectedBoroughValue)} name="form-field-name" onChange={this.props.OnSiteChange}
                                    options={this.props.SitesOptions} disabled={this.props.SiteDisabled} />
                            </td>
                            : null
                    }
                </tr>
            </tbody>
        </table>
    }
}
export default CheckInBoroughsSitesFilter;
