import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import updateLoginState from './LoginState';

const config = {
    key: "root",
    storage,
    whitelist: ["updateLoginState"]
};

const rootReducer = combineReducers({
    updateLoginState,
});

export default persistReducer(config, rootReducer);