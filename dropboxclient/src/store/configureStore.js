import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers/index';
import thunk from 'redux-thunk';
import {autoRehydrate} from 'redux-persist'
import { asyncSessionStorage } from 'redux-persist/storages'

export default function configureStore(initialState){
	 let store = createStore(
		 rootReducer,
		 initialState,
		 compose(
		   applyMiddleware(thunk),
		   autoRehydrate(),
		   window.devToolsExtension ? window.devToolsExtension() : f => f
		 )
		);

	return store;
}