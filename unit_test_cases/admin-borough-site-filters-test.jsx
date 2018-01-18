// test the filter used in admin section
import React from 'react'
import { shallow } from 'enzyme'
import AdminBoroughSiteFilters from '../app/pages/admin/components/middle-container'
import store from '../app/pages/shared/store';


// test object initialization 
function setup() {
  const props = {
    filterState: jest.fn()
  }

  const enzymeWrapper = shallow(<AdminBoroughSiteFilters {...props}  store = {store} />)

  return {
    props,
    enzymeWrapper
  }
}

// unit test case 
describe('components', () => {
  describe('AdminBoroughSiteFilters', () => {
      it('render self and subcomponents',()=>{
          const { enzymeWrapper, props } = setup() 
         expect(enzymeWrapper.render().find('td').hasClass('filter-boroughs')).toBe(true)  
         expect(enzymeWrapper.render().find('td').hasClass('filter-sites')).toBe(true) 
         expect(enzymeWrapper.render().find('label').text()).toBe('Borough*Site*')
      })     
       it('should have all props of AdminBoroughSiteFilters',()=>{
          const { enzymeWrapper,props } = setup() 
       const length = (enzymeWrapper.find('Select')).length
          // const input = enzymeWrapper.props()
          expect(length).toBe(0)
          //expect(props.mock.calls.length).toBe(5);
      }) 

      it('should have a children',()=>{
          const { enzymeWrapper } = setup()    
         let children = enzymeWrapper.render().children.length; 
         expect(children).toBe(1);
      }) 

     
  })
})