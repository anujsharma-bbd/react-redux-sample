import {createStore} from 'redux';
import reducer from './reducers/combinedReducer';
export default createStore(reducer)