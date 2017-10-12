export const CHANGE_EXAMPLE = 'CHANGE_EXAMPLE'
export const CHANGE_CURRENT_PROJECT = 'CHANGE_CURRENT_PROJECT'
export const CHANGE_CURRENT_SECTION = 'CHANGE_CURRENT_SECTION'
export const CHANGE_CURRENT_OPTION = 'CHANGE_CURRENT_OPTION'


export const changeExample = function(text) {
	return {
		type: CHANGE_EXAMPLE,
		text
	}
}

export const changeCurrentProject = (obj) => ({
  type: CHANGE_CURRENT_PROJECT,
  obj
})

export const changeCurrentSection = (obj) => ({
  type: CHANGE_CURRENT_SECTION,
  obj
});

export const changeCurrentOption = (optionObj) => ({
  type: CHANGE_CURRENT_OPTION,
  optionObj
});