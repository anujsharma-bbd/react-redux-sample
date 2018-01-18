import React from 'react'
import { shallow } from 'enzyme'
import AdminCMS from '../app/pages/admin/components/'
import store from '../app/pages/shared/store';
import {storageMock} from "./storageMock/"
import {routerMock} from "./routerMock/"
import AuthorizedComponent from '../app/pages/shared/base/authorized-component.jsx'
//jest.dontMock('../app/pages/shared/base/authorized-component.jsx');
// test object initialization 
function setup() {
let routes = 
   [
    {"id":12193,"name":"10-003","routeType":"Street","station":null,"routeStatus":"not_started","routeName":"10-003","sector":"10003","subSector":"-"},
    {"id":12202,"name":"10-012","routeType":"Street","station":null,"routeStatus":"not_started","routeName":"10-012","sector":"10012","subSector":"-"}
   ]
  ;

  let props={
    router:jest.fn()
}
  //<AuthorizedComponent router = {[]} />
  const enzymeWrapper = shallow(<AdminCMS {...props} routes = {routes} store = {store}/> )

  return {  
    enzymeWrapper,
    props
  }
}
 // mock the localStorage
window.localStorage = storageMock();

 //routerMock();
// unit test case
describe('components', () => {
  describe('AdminCMS', () => {
      it('should have all props of createTeamModalIsOpened',()=>{
          const { enzymeWrapper, props } = setup() 
         expect(enzymeWrapper.props().model.createTeamModalIsOpened).toBe(false)      
      })

       it('should have all props of editTeamModalIsOpened',()=>{
          const { enzymeWrapper, props } = setup() 
         expect(enzymeWrapper.props().model.editTeamModalIsOpened).toBe(false)
      })

      it('should have all props of AdminRightContainerComponent',()=>{
          const { enzymeWrapper, props } = setup() 
         expect(enzymeWrapper.render().find('div').length).toBe(5)
      })
  })
})