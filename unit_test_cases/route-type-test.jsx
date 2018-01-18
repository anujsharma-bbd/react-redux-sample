import React from 'react';
import { shallow } from 'enzyme';
import RouteType from '../app/pages/admin/components/controls/route-type/';
import store from '../app/pages/shared/store';

// test object initialization 
function setup() { 
let props={
    panelProperties:jest.fn()
}
  const enzymeWrapper = shallow(<RouteType {...props} routeType = {"Subway"} store = {store}/> )

  return {
  
    enzymeWrapper,
    props
  }
}

//unit test casesRouteType
describe('components', () => {
  describe('RouteType', () => {
     xit('should have all sub-components',()=>{
          const { enzymeWrapper } = setup() 
          let routeType = "Subway";
         expect(enzymeWrapper.render().find('div').length).toBe(0) 
      })
       xit('should have all input',()=>{
        const { enzymeWrapper } = setup()     
         expect(enzymeWrapper.render().find('input').length).toBe(1)           
      })
      it('should have createTeamModalIsOpened false', () => {
      const { enzymeWrapper, props } = setup()  
     enzymeWrapper.props().model.createTeamModalIsOpened = true;
        expect(enzymeWrapper.props().model.createTeamModalIsOpened).toBe(true)   
           
    })   

  })
 })