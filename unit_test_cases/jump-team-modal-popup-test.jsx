import React from 'react';
import { shallow } from 'enzyme';
import JumpTeamModal from '../app/pages/admin/components/controls/jump-team-modal-popup/';

// test object initialization 
function setup() { 
const props = {
    JumpTeamModalProps: jest.fn()
  }
let model = {validation :{message:"jump model", type:"popup"}, isOpen:true}
const enzymeWrapper = shallow(<JumpTeamModal {...props} model = {model} isOpen = {true}/> )

  return {  
      props,
    enzymeWrapper
  }
}
// unit test cases
describe('components', () => {
  describe('JumpTeamModal', () => {
      it('should have all sub-components',()=>{
          const { enzymeWrapper } = setup()     
         expect(enzymeWrapper.find('div').length).toBe(31)     
         expect(enzymeWrapper.find('button').length).toBe(2)  
      })

       it('should have all props of Modal',()=>{
          const { enzymeWrapper } = setup()         
          const JumpTeamModalModalProps = enzymeWrapper.find('Modal').props()
         expect(JumpTeamModalModalProps.isOpen).toBe(true)
         expect(JumpTeamModalModalProps.isStatic).toBe(undefined)
      })

       it('should have all props of Select',()=>{
          const { enzymeWrapper } = setup() 
          expect(enzymeWrapper.find('Select').length).toBe(2)        
      })      
       it('should have all props of Validation',()=>{
          const { enzymeWrapper } = setup() 
         const JumpTeamModalValidationProps = enzymeWrapper.find('ValidationControl').props()
         expect(JumpTeamModalValidationProps.message).toBe("jump model")        
      })
  })
})