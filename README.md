Live Demo: http://ec2-54-201-203-201.us-west-2.compute.amazonaws.com:5000

Songbox
=========

Songbox is a work-in-progress multi-music-streaming-service-aggregator. We take streams from Youtube, Soundcloud, Grooveshark and Spotify, combining them into a seamless listening experience.

Evan Ward, Jeremy Tennison, Marc Demory and Stephen Sullivan have had an absolute blast learning the technologies and genuinely trying to create something people might use and love. We want to create something people want to use, not another piece of internet noise.

Version 0.0.5 (2014)
----



Tech
-----------

Songbox is an attempt to use only modern, effective software:

* Node.js
* Express web framework
* Angular.js
* MongoDB
* Spotify, Youtube Data, Grooveshark and Soundcloud APIs
* Sublime Text

Installation
--------------

Quick Installation:

Your basic node setup:

```sh
git clone "https://github.com/firstwardo/rock"
cd rock
npm install
```

To Run:

```sh
node app
```
*note: youtube  search only works for manually whitelisted IP addresses. Sorry :(

More Detailed Setup:

1. Have full xcode install.
2. Install brew.
3. git clone rock (here)
4. git clone stone (sister repo)
5. brew install mongodb
6. brew install nodejs
7. npm install
8. sudo mkdir -p /data/db

To Run:

1. sudo mongod
2. node app
3. Build and run client from xcode.

License
----

MIT


**Free Software, Hell Yeah!**
