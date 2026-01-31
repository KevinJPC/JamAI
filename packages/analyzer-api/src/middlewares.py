import functools
import constants
from flask import request
from werkzeug.exceptions import Unauthorized

def protected_route(fn):
	@functools.wraps(fn)
	def decorated_fn(*args, **kwargs):
		token = request.headers.get("Authorization", type=str)
		if(token != f"{constants.AUTH_SCHEME} {constants.INTERNAL_API_KEY}"): raise Unauthorized()
		return fn(*args, **kwargs)
	return decorated_fn