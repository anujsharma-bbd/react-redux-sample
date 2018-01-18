import React from 'react'
import { shallow } from 'enzyme'
import TeamMember from '../app/pages/admin/components/controls/edit-team-modal-popup/team-member';
import store from '../app/pages/shared/store';
import {storageMock} from "./storageMock"
// test object initialization 
function setup() { 
  const enzymeWrapper = shallow(<TeamMember  isOpen={true} store = {store}/> )

  return {
  
    enzymeWrapper
  }
}
// define href object 
Object.defineProperty(window.location, 'href', {
  writable: true,
  value: 'some url'
});
  // mock the localStorage
window.localStorage = storageMock();

// unit test cases 
describe('components', () => {
  describe('TeamMember', () => {
    it('should not have createTeamModalIsOpened false', () => {
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

    it('should render subcomponents', ()=>{
       const { enzymeWrapper } = setup()  
       expect(enzymeWrapper.render().find('div').hasClass('team-members custom-scroll')).toBe(true)
    })
  
      
  })
})
