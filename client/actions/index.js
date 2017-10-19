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
export const CHANGE_TESTER_OPTION = 'CHANGE_TESTER_OPTION';
export const CHANGE_OPTION_ANNOTATIONS = 'CHANGE_OPTION_ANNOTATIONS';
export const CHANGE_OPTION = 'CHANGE_OPTION';
export const CHANGE_ANNOTATIONS = 'CHANGE_ANNOTATIONS';
export const CHANGE_LINE_GRAPH_DATA = 'CHANGE_LINE_GRAPH_DATA';


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

export const changeOptionAnnotations = (obj) => ({
  type: CHANGE_OPTION_ANNOTATIONS,
  obj
})

export const changeOption = (obj) => ({
  type: CHANGE_OPTION,
  obj
})


export const changeAnnotations = (obj) => ({
  type: CHANGE_ANNOTATIONS,
  obj
})

export const changeLineGraphData = (obj) => ({
  type: CHANGE_LINE_GRAPH_DATA,
  obj
})


