import {API_URLs, Constants} from "../app/common/app-settings/constants";
import { Utility } from "../app/common/utility";
import { CommonService } from "../app/pages/shared/services/common.service";
import {RoutesOnMapPopupService} from "../app/pages/shared/services/route-on-map.service"


describe(('RoutesOnMapPopupService'), () => {

    it('should handle RoutesOnMapPopupService services', ()=> {
        RoutesOnMapPopupService.initRouteMap(function(){})
         expected(RoutesOnMapPopupService.bounds).toBe(null);
    })
})
    
