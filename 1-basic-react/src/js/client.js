import React from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import { applyMiddleware, createStore } from 'redux';

//used to display previous state, current action, and next state
import { logger } from 'redux-logger'; 

//middleware package for async ops
import thunk from 'redux-thunk';

import promise from 'redux-promise-middleware';

import Layout from "./components/Layout";

var initialState = {
    fetching: false, //show loading screen
    fetched: false, //dont show users array if no data was fetched,
    users: [],
    error: null
}

const reducer = function(state=initialState, action){
        switch(action.type){
            case "FETCH_USERS_START": {
                return state = {...state, fetching: true};
                break;
            }
            case "FETCH_USERS_ERROR": {
                return state = {...state, fetching: false, error: action.payload};
                break;
            }
            case "RECEIVED_USERS": {
                return state = {...state, 
                    fetching: false, 
                    fetched: true, 
                    users: action.payload
                }
            }
        }
}


//reducers must return something!
//one ACTION can trigger multiple reducers that do different things!!
const userReducer = function(state={}, action){
    switch(action.type){

        case "CHANGE_NAME": {
            return state = {...state, name: action.payload} //create new state
            break;
        }

        case "CHANGE_AGE": {
            return state = {...state, age: action.payload}
            break;
        }
    }
}

const tweetReducer = function(state=[], action){

}

const reducers = combineReducers({

    //here, map which properties will be handled by which reducers!
    //for example, userReducers will receieve the user as state
    user: userReducer,

})
//need to pass state and action or else dispatch returns undefined when getting state...
const reducer = function(state, action){
    //changes of state happen here
    //changes are based on the action...
    if(action.type == "INC"){
        return state + 1;
    }

    if(action.type == "DEC"){
        return state - 1;
    }

    if(action.type == "E"){
        throw new Error("AHHHHHHHHHHHH")
    }

    return state;
}

//keep simple and leave 0 for now..not an actual state object for the skae of example.
const store = createStore(reducers, {
    user: {
        name: "Patrick",
        age: 24
    },
    tweets: []
});


//listen to the store
store.subscribe(() => {
    //when anything changes in the store, display the store state
    console.log("store has changed", store.getState());
})

//type must always be type!! reducer will not recognize other replacement names for "type"
store.dispatch({type: "CHANGE_NAME", payload: "Will" })
store.dispatch({type: "CHANGE_AGE", payload: 35 })
store.dispatch({type: "INC", payload: 1 })
store.dispatch({type: "INC", payload: 1 })
store.dispatch({type: "INC", payload: 1 })

//REDUX MIDDLEWARE

// could intercept every single acction that comes through
// could also cancel that action or modify it
// pass into third argument of store


const logger = (store) => (next) => (action) => {

    //do something with the action (cancel or modify)
    console.log(action);

    //modify
    action.type = "DEC";

    //continue on to reducer and pass the action
    next(action)
}

const error = (store) => (next) => (action) => {

    try {
        next(action)
    } catch (error){
        console.log(error);
    }
}

//apply different middleware
const middleware = applyMiddleware(promise(), logger(), thunk, logger, error);


//async actions!!!
store.dispatch((dispatch) => {
    dispatch({type: "FETCH_USERS_START"});
    //do something async
    axios.get("anything valid url here.../users")
            .then((response) => {
                //save user to state or... SESSION! :D
                dispatch({type: "RECEIVED_USERS", payload: response.data});
            })
            .catch((error) => {
                //if something went wrong
                dispatch({type: "FETCH_USERS_ERROR", payload: error})
            })

    //do something async
})

//another way to do it with redux-promise-middleware
//essentially, the redux-promise middleware will send out 
// FETCH_USERS_FULFILLED if the response returned OK
// FETCH_USERS_REJECTED if something went wrong
// FETCH_USERS.PENDING if we are waiting for the response
// need to handle these in a reducer/reducers ourselves!
store.dispatch({
    type: "FETCH_USERS",
    payload: "the request goes here!"
})




const app = document.getElementById('app');
ReactDOM.render(<Layout/>, app);
