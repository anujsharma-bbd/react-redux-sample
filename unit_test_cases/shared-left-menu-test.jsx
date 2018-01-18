import React from 'react'
import { shallow } from 'enzyme'
import LeftMenu from '../app/pages/shared/left-menu/'
import store from '../app/pages/shared/store';
import {storageMock} from "./storageMock"
function setup() { 

  const enzymeWrapper = shallow(<LeftMenu  store = {store}/> )

  return {
  
    enzymeWrapper
  }
}

  // mock the localStorage
window.localStorage = storageMock();
// unit test cases 
describe('components', () => {
  describe('LeftMenu', () => {
    it('should render 6 tabs', () => {
      const { enzymeWrapper } = setup()     
        expect(enzymeWrapper.props().sharedModel.tabs.length).toBe(6)   
           
    })
    it('should render 2 panels', () => {
      const { enzymeWrapper,props } = setup()     
        expect(enzymeWrapper.props().sharedModel.menuPanels.length).toBe(3)   
           
    })

    it('should render subcomponents', ()=>{
       const { enzymeWrapper } = setup()  
      expect(enzymeWrapper.render().find('div').hasClass('info')).toBe(true)
    })

    it('should have text equal to', ()=>{
       const { enzymeWrapper } = setup()  
       expect(enzymeWrapper.render().find('.info').text()).toBe('On line Survey')
    })
      
  })
})
