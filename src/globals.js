

const globals = {
	API_DEV: 'http://localhost:8080/',
	API_PROD: 'https://api.joinoasys.org/',
	OASYS_API_BASE: 'https://api.joinoasys.org/',
	OASYS_APP_BASE: 'https://app.joinoasys.org/',
	// types of editors
	EDIT_QUILL: 0,
	EDIT_QUIZ: 1,
	EDIT_GAME: 2,
	EDIT_HYPERVIDEO: 3,
	EDIT_SYSTEM: 4,
	// for module editor
	IF_START : 0, // for module component logic: immediately after if command
	IF_COND  : 1, // for module component logic: inside if condition (but not immediately after if command)
	IF_BODY  : 2, // for module component logic: inside if body (also, prior to next if command)
	BOOL_DISABLED : 0, // for module component logic
	BOOL_ENABLED : 1, // for module component logic
};

export default globals;