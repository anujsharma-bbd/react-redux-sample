import { CommonService } from "./common.service";
import { LoginService } from "../../login/services/login.service";
import { Users , UsersBoroughSiteMapping } from "../state/users";
import { Constants } from "../../../common/app-settings/constants";

export const AuthorizationRules = {
    getCurrentUserObject:()=>{
        return  LoginService.getLoginObject();        
    },
    getCurrentUserBoroughSiteNames:()=>{
        let boroughSiteNames = []; // format :- [{boroughName:"",siteNames:["a","b"]},{boroughName:"",siteNames:["a","b"]}]
        let session = AuthorizationRules.getCurrentUserObject();
        if(session)
        {
            let userId = session.userId;
            if(userId == 1){
                return false;
            }
            let mappings = UsersBoroughSiteMapping.filter((m)=> m.userId == userId);
            if(mappings){
                mappings.forEach((record)=>{
                    boroughSiteNames.push({ boroughName: record.boroughName.toLowerCase(), siteNames:record.siteNames.join('|').toLowerCase().replace(/ /g,'').split('|') });
                })
            }
        }

        return boroughSiteNames;
    },
    getCurrentUserSiteNames:()=>{
        let siteNames = []; // format :- ["a","b"]
        let session = AuthorizationRules.getCurrentUserObject();
        if(session)
        {
            let userId = session.userId;
            if(userId == 1){
                return false;
            }
            let mappings = UsersBoroughSiteMapping.filter((m)=> m.userId == userId);
            if(mappings){
                mappings.forEach((record)=>{
                    siteNames.push(...record.siteNames.join('|').toLowerCase().replace(/ /g,'').split('|'));
                })
            }
        }

        return siteNames;
    },
    getCurrentUserBoroughNames:()=>{
        let boroughNames = []; // format :- ["a","b"]
        let session = AuthorizationRules.getCurrentUserObject();
        if(session)
        {
            let userId = session.userId;
            if(userId == 1){
                return false;
            }
            let mappings = UsersBoroughSiteMapping.filter((m)=> m.userId == userId);
            if(mappings){
                mappings.forEach((record)=>{
                    boroughNames.push(record.boroughName.toLowerCase().replace(/ /g,''));
                })
            }
        }

        return boroughNames;
    }
};