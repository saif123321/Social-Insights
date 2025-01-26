import { combineReducers } from "redux";
import authReducer from "./authReducer";
export const combineReducer = combineReducers ({
    authReducer : authReducer 

});