import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Constants} from "../../../../common/app-settings/constants";

class ConfirmModal extends Component {
  render() {
    let { message, onConfirm, onCancel, isShowing,options } = this.props

    return (
      <div className={"confirm-modal confirm-dialog-poup"+ (options && options.notification ?" notification-as-well":'')}>
        { isShowing &&
          <div>
            <div className="modal-backdrop-confirm"></div>
            <div className="confirm-modal-content">
            <span className="confirm-modal-message" dangerouslySetInnerHTML={{ __html: message }} ></span>
              {
                options && options.notification ?
                <div className="notification-strip">
                  <div className={Constants.validation.types.success.containerCSS} style={{color:"#000"}} >
                    <i className={Constants.validation.types.info.icon + " pull-left "}></i>
                    <span dangerouslySetInnerHTML = {{__html: options.notification}}  className="pull-left notify-canv-delete" ></span>
                    <div className="clear"></div>
                  </div>
                </div> : ''
              }
              <div className="footer-bar">
                <button className="button pull-right secondary-button" onClick={() => onCancel()}>Cancel</button>
                <button className="button pull-right " onClick={() => onConfirm("ok")}>OK</button>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }


}

export default ConfirmModal