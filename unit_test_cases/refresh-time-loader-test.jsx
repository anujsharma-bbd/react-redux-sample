import React from 'react';
import { shallow } from 'enzyme';
import RefresTimeLogger from '../app/pages/admin/components/controls/refresh-time-logger/';
import store from '../app/pages/shared/store';

// test object initialization 
function setup() { 
let props={
    panelProperties:jest.fn()
}
  const enzymeWrapper = shallow(<RefresTimeLogger  store = {store}/> )

  return {
  
    enzymeWrapper,
    props
  }
}

//unit test cases
describe('components', () => {
  describe('RefresTimeLogger', () => {
     it('should have all sub-components',()=>{
          const { enzymeWrapper } = setup()     
          enzymeWrapper.props().model.lastUpdatedOn = true;
         expect(enzymeWrapper.render().find('div').length).toBe(2)     
         expect(enzymeWrapper.render().find('label').length).toBe(2)  
      })
       it('should have all classes for div',()=>{
          const { enzymeWrapper } = setup()     
         expect(enzymeWrapper.render().find('div').hasClass('map-refresh-control')).toBe(true)           
      })
        it('should have all classes for label',()=>{
          const { enzymeWrapper } = setup()              
           expect(enzymeWrapper.render().find('label').hasClass('updated-on-label')).toBe(true)  
             expect(enzymeWrapper.render().find('label').hasClass('updated-on-value')).toBe(true)  
      })
      it('should have panelAutoReloadInterval 2m', () => {
      const { enzymeWrapper } = setup()     
        expect(enzymeWrapper.props().model.panelAutoReloadInterval).toBe('2m')   
           
    })
     it('should have all sub-components',()=>{
          const { enzymeWrapper } = setup()     
          enzymeWrapper.props().model.lastUpdatedOn = null;
         expect(enzymeWrapper.render().find('div').length).toBe(1)     
         expect(enzymeWrapper.render().find('label').length).toBe(0)  
      })     
      it('should have text',()=>{
        const { enzymeWrapper } = setup()    
         enzymeWrapper.props().model.lastUpdatedOn = true;
        expect(enzymeWrapper.render().find('label').text()).toBe('Last updated: ')  
      })

  })
 })