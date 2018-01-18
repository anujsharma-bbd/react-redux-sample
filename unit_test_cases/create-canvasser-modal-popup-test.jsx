import React from 'react'
import { shallow } from 'enzyme'
import CreateCanvasserModal from '../app/pages/admin/components/controls/create-canvasser-modal-popup';
import store from '../app/pages/shared/store';
import {storageMock} from "./storageMock"

// test object initialization 
function setup() { 
  const enzymeWrapper = shallow(<CreateCanvasserModal isOpen= {true}  store = {store}/> )

  return {
  
    enzymeWrapper
  }
}

  // mock the localStorage
window.localStorage = storageMock();

//unit test case 
describe('components', () => {
  describe('CreateCanvasserModal', () => {
    it('should not have createTeamModalIsOpened true', () => {
      const { enzymeWrapper } = setup()     
        expect(enzymeWrapper.props().model.createTeamModalIsOpened).toBe(false)   
                
           
    })
    it('should not have editTeamModalIsOpened true', () => {
      const { enzymeWrapper,props } = setup()     
      expect(enzymeWrapper.props().model.editTeamModalIsOpened).toBe(false)   
           
    })

      it('should have text equal to', ()=>{
        const { enzymeWrapper,props } = setup()     
       expect(enzymeWrapper.props().model.validation.type).toBe("Success")   
    })

    it('should render subcomponents and classes', ()=>{
       const { enzymeWrapper } = setup()  
        expect(enzymeWrapper.render().find('div').length).toBe(10)
       expect(enzymeWrapper.render().find('table').hasClass('convasser-info-dialog')).toBe(true)
    })

  
      
  })
})
