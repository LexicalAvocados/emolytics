export const CHANGE_EXAMPLE = 'CHANGE_EXAMPLE';
export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_LOGGED_OUT = 'SET_LOGGED_OUT';


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