import React from 'react'
import { shallow } from 'enzyme'
import MapLegendBar from '../app/pages/dashboard/components/middle-container/legend-bar/'
import store from '../app/pages/shared/store';


// test object initialization 
function setup() { 
  const enzymeWrapper = shallow(<MapLegendBar  store = {store}/> )
  return {  
    enzymeWrapper
  }
}
//unit test cases 
describe('components', () => {
  describe('MapLegendBar', () => {
      it('should render 6 tabs', () => {
      const { enzymeWrapper } = setup()     
        expect(enzymeWrapper.props().model.length).toBe(4)   
           
    })
  })  
})