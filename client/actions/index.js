export const CHANGE_EXAMPLE = 'CHANGE_EXAMPLE';
export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_LOGGED_OUT = 'SET_LOGGED_OUT';
export const CHANGE_CURRENTPROJECT = 'CHANGE_CURRENTPROJECT';
export const CHANGE_CURRENTSECTION = 'CHANGE_CURRENTSECTION';

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

export const changeCurrentProject = function(obj) {
	return {
		type: CHANGE_CURRENTPROJECT,
		obj
	}
}

export const changeCurrentSection = function(obj) {
	return {
		type: CHANGE_CURRENTSECTION,
		obj
	}
}