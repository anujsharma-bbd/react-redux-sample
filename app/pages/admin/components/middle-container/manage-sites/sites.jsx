import React from "react";
import { connect } from 'react-redux';
import { manageSitesActionTypes } from "../../../actions/manageSitesActionTypes";
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";
import * as Action from "../../../../shared/actions/action";
import { Utility } from "../../../../../common/utility/";
import { Constants } from "../../../../../common/app-settings/constants";

class ManageSitesComponent extends React.Component {

    constructor(props) {
        super(props);
        this.openManageDialogOpen = this.openManageDialogOpen.bind(this);
    }
    
    // opening nmanage site popup
    openManageDialogOpen(isCreating, data, borough) {
        if (borough[0].boroughId == -1) {
            this.props.showMessage("Please select appropriate borough.", Constants.validation.types.error.key, false);
        } else
            this.props.dispatch(Action.getAction(manageSitesActionTypes.SET_MANAGE_SITE_DIALOG_OPEN, { IsOpen: true, data: data, borough: borough[0] }));
    }
    render() {
        const { data, boroughs, model } = this.props;
        console.log("this.props===>>", model)
        return (
            <div>
                <div className="table-responsive sites-container" >
                    <div className="grid-labels">
                        {data && data.length ? <span className="pull-left sites-count-span" ><label className="sites-count">Total Sites :</label>{data && data.length ? data.length : '0'}</span> : ''}
                        <button type="button" className="add-site-btn button-site pull-right " onClick={() => this.openManageDialogOpen(true, null, [model.filterModel.selectedBorough])}><i className="fa fa-plus" aria-hidden="true"></i> Add New Site</button>
                        <div className="clear"></div>
                    </div>
                    <table className="table table-bordered table-hover">
                        <thead className="thead-inverse">
                            <tr>
                                <th className="td-header-string-example" style={{ width: '3%' }}>#</th>
                                <th className="td-header-string-example-left">Site Name</th>
                                <th className="td-header-string-example-left">Site Label</th>
                                <th className="td-header-string-example">Canvassers limit</th>
                                <th className="td-header-string-example" style={{ width: '13%' }}>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data.length ?
                                    data.map((site, index) => {
                                        let borough = boroughs.filter((borough) => site.boroughId == borough.boroughId)
                                        return (
                                            <tr key={"site-" + site.siteName + (index + 1)}>
                                                <td className="text-center">{index + 1}</td>
                                                <td className="text-left">{site.siteName}</td>
                                                <td className="text-left">{site.siteLabel}</td>
                                                <td className="text-center">{site.properties ? site.properties.maxCanvPerSite : ''}</td>
                                                <td className="text-center">
                                                    <button className="site-edit-button button-site" onClick={() => this.openManageDialogOpen(false, site, borough)}>
                                                        <i className="fa fa-edit" aria-hidden="true"></i> Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                    :
                                    <tr>
                                        <td colSpan="5">{data && data.length && !manageSitesModel.panelProperties.panelReload ? Constants.messages.noRecordFound : ""}</td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        model: state.manageSitesModel,
        sharedModel: state.sharedModel
    }
};
export default connect(mapStateToProps)(ManageSitesComponent);