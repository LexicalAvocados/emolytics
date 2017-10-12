export const CHANGE_EXAMPLE = 'CHANGE_EXAMPLE'
export const CHANGE_CURRENTPROJECT = 'CHANGE_CURRENTPROJECT'
export const ADD_OPTION_TO_CURRENTPROJECT = 'ADD_OPTION_TO_CURRENTPROJECT'


export const changeExample = function(text) {
	return {
		type: CHANGE_EXAMPLE,
		text
	}
}

export const changeCurrentProject = function(obj) {
	return {
		type: CHANGE_CURRENTPROJECT,
		obj
	}
}

export const addOptionToCurrentProject = function(arr) {
	return {
		type: ADD_OPTION_TO_CURRENTPROJECT,
		arr
	}
}