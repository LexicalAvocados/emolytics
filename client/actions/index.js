export const CHANGE_EXAMPLE = 'CHANGE_EXAMPLE';
export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_LOGGED_OUT = 'SET_LOGGED_OUT';
export const CHANGE_CURRENTPROJECT = 'CHANGE_CURRENT_PROJECT';
export const CHANGE_CURRENTSECTION = 'CHANGE_CURRENT_SECTION';

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

export const changeCurrentProject = (obj) => ({
	type: CHANGE_CURRENT_PROJECT,
	obj
});

export const changeCurrentSection = (ob) => ({
	type: CHANGE_CURRENT_SECTION,
	obj
});