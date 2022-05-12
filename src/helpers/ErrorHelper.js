class ErrorHelper {
	static getErrorWithMessage(err){
			return new Error((err.response && err.response.data && err.response.data.message) || err.message)
	}
}

export default ErrorHelper;
