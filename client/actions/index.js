export const CHANGE_EXAMPLE = 'CHANGE_EXAMPLE'
export const CHANGE_CURRENTPROJECT = 'CHANGE_CURRENTPROJECT'
export const CHANGE_CURRENTSECTION = 'CHANGE_CURRENTSECTION'


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

export const changeCurrentSection = function(obj) {
	return {
		type: CHANGE_CURRENTSECTION,
		obj
	}
}