import React from "react";
import { connect } from "react-redux";
import { PusherService } from "../../services/pusher-service";
import { Utility } from "../../../../common/utility/";
import { Constants } from "../../../../common/app-settings/constants";

class DownloaderAnchorControl extends React.Component {

    constructor(props) {
        super(props);
        this.downloadCSVFromUrl = this.downloadCSVFromUrl.bind(this);
    }
    componentDidMount() {
        if (this.props.channelName && this.props.eventName) {
            // initialize pusher service subscribe
            let channelName = this.props.channelName;
            let eventName = this.props.eventName;
            PusherService.subscribe(channelName, eventName, this.downloadCSVFromUrl);
        }
    }
    componentWillUnmount() {
        // unsubscribe pusher end point
        let channelName = this.props.channelName;
        let eventName = this.props.eventName;
        PusherService.unsubscribe(channelName, eventName);
    }
    // public function to download file
    downloadCSVFromUrl(url) {
        if (this.downloadCSVAnchor) {
            this.downloadCSVAnchor.href = url;
            this.downloadCSVAnchor.click();
            this.downloadCSVAnchor.href = null;
            if (this.props.callback) {
                this.props.callback(url);
            }
        }
    }
    render() {

        return (
            <a ref={(href) => { this.downloadCSVAnchor = href }} download hidden={true}></a>
        );
    }

}

const mapStatetoProps = (state) => {
    return {
        sharedModel: state.sharedModel
    };
}

export default connect(mapStatetoProps)(DownloaderAnchorControl);