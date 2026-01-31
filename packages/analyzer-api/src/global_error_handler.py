from werkzeug.exceptions import HTTPException
import json
import sys
import traceback

def handle_exception(e):
	if isinstance(e, HTTPException):
		response = e.get_response()
		response.data = json.dumps({
			"status": e.code,
			"title": e.name,
			"message": e.description,
		})
		response.content_type = "application/json"
		return response
	
	print(f"Caught unhandle exception:", e, file=sys.stderr)
	print(traceback.format_exc(), file=sys.stderr)
	

	default_unkown_error_response = {
		"status": 500,
		"title": "Internal Server Error",
		"message": "Internal server error",
	}
	return default_unkown_error_response, default_unkown_error_response["status"]