export const CHANGE_EXAMPLE = 'CHANGE_EXAMPLE';
export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_LOGGED_OUT = 'SET_LOGGED_OUT';
export const SET_NAME = 'SET_NAME';
export const SET_AGE = 'SET_AGE';
export const SET_SEX = 'SET_SEX';
export const SET_RACE = 'SET_RACE';
export const CHANGE_CURRENT_PROJECT = 'CHANGE_CURRENT_PROJECT';
export const CHANGE_CURRENT_SECTION = 'CHANGE_CURRENT_SECTION';
export const CHANGE_CURRENT_OPTION = 'CHANGE_CURRENT_OPTION';

export const changeExample = (text) => ({
	type: CHANGE_EXAMPLE,
	text
});

export const setLoggedIn = (username, isCreator) => ({
  type: SET_LOGGED_IN,
  username,
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

export const changeCurrentProject = (obj) => ({
	type: CHANGE_CURRENT_PROJECT,
	obj
});

export const changeCurrentSection = (obj) => ({
	type: CHANGE_CURRENT_SECTION,
	obj
})

export const changeCurrentOption = (optionObj) => ({
  type: CHANGE_CURRENT_OPTION,
  optionObj
});