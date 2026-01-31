from flask import Flask, request
from analysis import analyze_youtube_audio
from global_error_handler import handle_exception
from werkzeug.exceptions import BadRequest
from middlewares import protected_route

app = Flask(__name__)

@app.get("/api/test")
@protected_route
def hello_world():
    return "Hello world!"

@app.post("/api/analyze")
@protected_route
def analyze():

	youtube_id = request.json.get("youtube_id", None)
	if(not youtube_id): raise BadRequest("youtube_id is expected in request body")
	result = analyze_youtube_audio(youtube_id)
	return result, 200

app.register_error_handler(Exception, handle_exception)
	
