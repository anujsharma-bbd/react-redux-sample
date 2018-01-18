import React from "react";
import { connect } from "react-redux";
import {Constants} from "../../../../common/app-settings/constants"
/**
 * Component to create validation control 
 */
class ValidationControl extends React.Component {

    constructor(props) {
        super(props);
    }
/**
 * get state of operation and return respective validation message
 */
    getCSSTemplate(type) {
        let messageType = null;
        switch (type) {
            case Constants.validation.types.success.key:
                messageType = Constants.validation.types.success;
                break;
            case Constants.validation.types.error.key:
                messageType = Constants.validation.types.error;
                break;
            case Constants.validation.types.warning.key:
                messageType = Constants.validation.types.warning;
                break;
            case Constants.validation.types.info.key:
                messageType = Constants.validation.types.info;
                break;
            default :
            {
                messageType = Constants.validation.types.info;
                break;
            }
        }
        return messageType;
    }
    /**
     * render html code
     */
    render() {
        let windowWidth = window.outerWidth;
        let popupWidth = windowWidth/3;
        let poupLeftPosition = Math.trunc((windowWidth - popupWidth)/2);
        let popupStyle = {width : popupWidth, left: poupLeftPosition}
        if (this.props.message !== null && this.props.message.length > 0) {
            let messageType = this.getCSSTemplate(this.props.type);
            return (
                <div className={this.props.isPopup ? Constants.validation.mainContainerCSS : " model-poup-validation-massages "} style={this.props.isPopup ? popupStyle : {}}>
                <div className={messageType.containerCSS} >
                    <i className={messageType.icon}></i>
                   <span dangerouslySetInnerHTML = {{__html: this.props.message}} ></span>
                </div>
                </div>
            )
        }
        else
            return (null)
    }
}
/**
 * initialize validation properties 
 */
ValidationControl.PropTypes = {
    message: React.PropTypes.string,
    type: React.PropTypes.oneOf([Constants.validation.types.success.key, Constants.validation.types.error.key, Constants.validation.types.warning.key, Constants.validation.types.info.key]),
    isPopup: React.PropTypes.bool
};

ValidationControl.defaultProps = {
    message: Constants.emptyString,
    type: Constants.validation.types.success.key,
};

export default ValidationControl;