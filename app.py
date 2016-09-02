#Built with Flask 0.10, Python32 2.7.6 and gmusicapi 3.1.0
from flask import Flask
from flask import redirect
import json
from flask import request
from gmusicapi import Mobileclient
import requests
import hmac
from hashlib import sha256
#import threading
app = Flask(__name__)
selfhash = hmac.new('5d4ae80d1c8d3e29b303ebc284c19bacf6c4c3f95e6f96ff980928965ff2bc0d', 'ilovepootis').hexdigest()
@app.route("/")
def hello():
	return 'i work!'

def login(username,password):
	api = Mobileclient()
	try:
		loggedin = api.login(username, password)
		return api
	except:
		return False

@app.route('/googlemusic/logintest', methods=['GET'])
def logintest():
	if verifyServer(request.args.get('h','')):
		api = Mobileclient()
		try:
			api.login(request.args.get('u', ''),request.args.get('p', ''))
		except:
			return "False"
		api.logout()
		return "True"
	else:
		return 'You are not the server!'

@app.route('/googlemusic/search/allaccess', methods=['GET'])
def allaccess():
	if verifyServer(request.args.get('h','')):
		api = login(request.args.get('u', ''),request.args.get('p', ''))
		query = request.args.get('q', '')
		if api == False:
			return 'False'
		else:
			try:
				return json.dumps(api.search_all_access(query,100), ensure_ascii=False)
			except:
				return 'False'
	else:
		return 'You are not the server!'

@app.route('/googlemusic/search/library', methods=['GET'])
def library():
	if verifyServer(request.args.get('h','')):
		api = login(request.args.get('u', ''),request.args.get('p', ''))
		if api == False:
			return 'False'
		else:
			return json.dumps(api.get_all_songs(), ensure_ascii=False)
	else:
		return 'You are not the server!'

@app.route("/googlemusic/logout")
def logout():
	if verifyServer(request.args.get('h','')):
		api.logout()
	else:
		return 'You are not the server!'

@app.route('/googlemusic/getplaylists', methods=['GET'])
def getplaylists():
	if verifyServer(request.args.get('h','')):
		api = login(request.args.get('u', ''),request.args.get('p', ''))
		if api == False:
			return 'False'
		else:
			return json.dumps(api.get_all_user_playlist_contents(), ensure_ascii=False)
	else:
		return 'You are not the server!'


def verifyServer(hash):
	if selfhash == hash:
		return True
	else:
		return False

if __name__ == '__main__':
	#app.run('127.0.0.1', debug=True, port=5001,threaded=True, ssl_context=('.\\ssl\\python\\pythoncert.pem', '.\\ssl\\python\\pythonkey.pem'))
	#nigga we gon insekur
	app.run('127.0.0.1', debug=True, port=5001,threaded=True)