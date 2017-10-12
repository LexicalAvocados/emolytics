export const CHANGE_EXAMPLE = 'CHANGE_EXAMPLE'
export const CHANGE_CURRENTPROJECT = 'CHANGE_CURRENTPROJECT'


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
