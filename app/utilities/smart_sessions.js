module.exports = function(app) {
    console.log("Injected smart-sessions... let the fun begin.")
    app.locals.memStore = {};


    /*
    Server starts up. We check to see if we are storing one of our
    cookies on them. If so, we grab the setup the server session.
    If not, we create a cookie with a unique(ish) session id. Then
    we setup a session.
    */

    app.use(function(req,res,next) {
        if (req.cookies['rock_session'] === undefined) {
            // console.log("No cookie. Creating...");
            require('crypto').randomBytes(24, function(ex, buf) {
                res.cookie('rock_session',buf.toString('hex'));
                req.cookies['rock_session'] = buf.toString('hex');
                // console.log("Created cookie on client.");
                setupSession(app,req,next);
            });
        } else {
            console.log("Found cookie...");
            setupSession(app,req,next);
        }
    });

    /*
    Also, once the request finishes, check to see if anyone modified
    the session. If so, save this data back to the server's memory.
    */

    app.use(function (req,res,next) {
        res.on('finish',function () {
            if (req.session !== undefined) {
                req.session.save();
            }
        });
        next();
    });
}


    /*
    So since we def have a cookie, check to see if the server has a
    copy of their session. Check our memory for the key on their cookie.
    If we find it, load up this request object's session with whatever
    we have in memory for this session.
    */

function setupSession (app, req, next) {
    if (app.locals.memStore[req.cookies['rock_session']] == undefined) {
        // console.log("No active session. Creating...");
        app.locals.memStore[req.cookies['rock_session']] = {};
        req.session = {};
    } else {
        console.log("Found active session...");
        req.session = app.locals.memStore[req.cookies['rock_session']];
    }
    req.session.save = function () {
        console.log("Saved session.");
        app.locals.memStore[req.cookies['rock_session']] = this;
        
    }
    next();
}