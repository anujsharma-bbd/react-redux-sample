import React from "react";
import { connect } from 'react-redux';
import { reportsActionTypes } from "../../actions/reportsActionTypes";
import * as Action from "../../../shared/actions/action";
import ToolBoxControl from "../../../shared/controls/tool-box-control/";
import { Constants } from "../../../../common/app-settings/constants";
import ValidationControl from "../../../shared/controls/validation-control";
import { Utility } from "../../../../common/utility/";

/**
 * Middle container for REPORTS section
 */
class ReportsMiddelContainerComponent extends React.Component {

    /**
     * Constructor to initialize fields.
     */
    constructor(props) {
        super(props);  
        this.onWindowResize = this.onWindowResize.bind(this);     
    }

    onWindowResize() {
        Utility.onWindowResize();
    }
    /**
     * Render View method.
     */
    render() {
         let model = this.props.model;

        return (
            <div id="content" className="content">
                <div className="validation_success_main">
                    <ValidationControl message={model.validation.message} type={model.validation.type} isPopup={model.validation.isPopup} />
                </div>
                <h1 className="page-header">Reports</h1>
                <div className="clear"></div>
                <div className={'panel panel-inverse ' + (model.panelProperties.panelExpanded ? " panel-expand " : "")}  >
                    <div className="panel-heading">
                        <ToolBoxControl dataModel={model.panelProperties}
                            onExpand={() => {
                                this.props.dispatch(Action.getAction(reportsActionTypes.SET_PANEL_EXPAND_REPORTS, {}));
                                this.onWindowResize();
                            } }
                            onReload={() => {
                                this.props.dispatch(Action.getAction(reportsActionTypes.SET_PANEL_RELOAD_REPORTS, true));
                            } }
                            onCollapse={() => {
                                this.props.dispatch(Action.getAction(reportsActionTypes.SET_PANEL_COLLAPSE_REPORTS, {}));
                                this.onWindowResize();
                            } }
                            onRemove={() => {
                                this.props.dispatch(Action.getAction(reportsActionTypes.SET_PANEL_REMOVE_REPORTS, {}));
                            } }
                            />
                        <h4 className="panel-title"><panel>Surveys Submitted</panel></h4>
                    </div>
                    <div className={"panel-body " + (model.panelProperties.panelExpanded ? " custom-scroll " : '') + (model.panelProperties.panelCollapsed ? ' height-0 ' : '')}>
                        <div className="reports-filter-bar">
                            
                        </div>
                        <div className="reports-content">      
                            {this.props.children}                     
                        </div>
                        
                    </div>
                </div>
               
            </div>
        );
    }

}


const mapStateToProps = (state) => {
    return {
        model: state.reportsModel,
        sharedModel:state.sharedModel
    }
}

export default connect(mapStateToProps)(ReportsMiddelContainerComponent);