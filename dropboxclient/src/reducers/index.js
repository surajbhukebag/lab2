import { combineReducers } from 'redux'
import user from './user'
import files from './files'

export default combineReducers({
  user,
  files
})