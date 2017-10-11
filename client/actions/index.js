export const CHANGE_EXAMPLE = 'CHANGE_EXAMPLE'



export const changeExample = function(text) {
	return {
		type: CHANGE_EXAMPLE,
		text
	}
}