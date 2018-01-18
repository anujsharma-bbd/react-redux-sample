import Pusher from 'pusher-js';
import { Constants } from "../../../common/app-settings/constants"
import { Utility } from "../../../common/utility/";
import * as Action from "../actions/action";
import { sharedActionTypes } from "../actions/sharedActionTypes";

let PusherService = {
    subscribe(channelName, eventName, callback) {
        this.pusher = new Pusher(Constants.pusher.key, {
            encrypted: true
        });
        this.channelName = channelName;
        this.eventName = eventName;
        this.channel = this.pusher.subscribe(this.channelName).bind(this.eventName, callback);
    },

    unsubscribe(channelName, eventName) {
        this.channelName = channelName;
        this.eventName = eventName;
        this.channel.unbind(this.eventName, function (data) {
        });
        this.pusher.unsubscribe(this.channelName);
    },


};

exports.PusherService = PusherService;
