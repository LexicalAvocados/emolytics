export const CHANGE_EXAMPLE = 'CHANGE_EXAMPLE';
export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_LOGGED_OUT = 'SET_LOGGED_OUT';
export const SET_NAME = 'SET_NAME';
export const SET_AGE = 'SET_AGE';
export const SET_SEX = 'SET_SEX';
export const SET_RACE = 'SET_RACE';
export const ADD_FOCUS_GROUP = 'ADD_NEW_FOCUS_GROUP';
export const DELETE_FOCUS_GROUP = 'DELETE_FOCUS_GROUP';
export const ADD_TESTER_TO_FOCUS_GROUP = 'ADD_TESTER_TO_FOCUS_GROUP';
export const REMOVE_TESTER_FROM_FOCUS_GROUP = 'REMOVE_TESTER_FROM_FOCUS_GROUP';
export const CHANGE_CURRENT_PROJECT = 'CHANGE_CURRENT_PROJECT';
export const CHANGE_CURRENT_SECTION = 'CHANGE_CURRENT_SECTION';
export const CHANGE_CURRENT_OPTION = 'CHANGE_CURRENT_OPTION';
export const CHANGE_TESTER_OPTION = 'CHANGE_TESTER_OPTION';


export const changeExample = (text) => ({
	type: CHANGE_EXAMPLE,
	text
});

export const setLoggedIn = (username, name, age, sex, race, isCreator) => ({
  type: SET_LOGGED_IN,
  username,
  name,
  age,
  sex,
  race,
  isCreator
});

export const setLoggedOut = () => ({
  type: SET_LOGGED_OUT
});

export const setName = (name) => ({
  type: SET_NAME,
  name
});

export const setAge = (age) => ({
  type: SET_AGE,
  age
});

export const setSex = (sex) => ({
  type: SET_SEX,
  sex
});

export const setRace = (race) => ({
  type: SET_RACE,
  race
});

export const addFocusGroup = (focusGroupName) => ({
  type: ADD_FOCUS_GROUP,
  focusGroupName
});

export const deleteFocusGroup = (focusGroupName) => ({
  type: DELETE_FOCUS_GROUP,
  focusGroupName
});

export const addTesterToFocusGroup = (focusGroupName, testerName) => ({
  type: ADD_TESTER_TO_FOCUS_GROUP,
  focusGroupName,
  testerName
});

export const removeTesterFromFocusGroup = (focusGroupName, testerName) => ({
  type: REMOVE_TESTER_FROM_FOCUS_GROUP,
  focusGroupName,
  testerName
});

export const changeCurrentProject = (obj) => ({
	type: CHANGE_CURRENT_PROJECT,
	obj
});

export const changeCurrentSection = (obj) => ({
	type: CHANGE_CURRENT_SECTION,
	obj
});

export const changeCurrentOption = (optionObj) => ({
  type: CHANGE_CURRENT_OPTION,
  optionObj
});


export const changeTesterOption = (obj) => ({
  type: CHANGE_TESTER_OPTION,
  obj
});


