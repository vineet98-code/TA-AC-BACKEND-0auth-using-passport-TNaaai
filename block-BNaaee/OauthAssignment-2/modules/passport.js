var passport = require('passport')
var User = require('../models/User')


// GitHubStrategy 
var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile)
    var profileData = {
        name : profile.displayName,
        username : profile.username,
        email : profile._json.email,
        photo : profile._json.avatar_url,
    }

    User.findOne({email : profile._json.email}, (err,user) => {
        if(err) return cb(err)
        if(!user){
            User.create(profileData,(err,addeduser)=> {
                console.log('success')
                if(err) return cb(err);
                return cb(null, addeduser)
            })
        }else{
            cb(null , user)
        }
    })
  }
));

// google strategy 
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile)
    var profileData = {
        name : profile._json.name,
        email : profile._json.email,
        photo : profile._json.picture,
    }

    User.findOne({email: profile._json.email}, (err,user) => {
        if(err) return cb(err);
        if(!user){
            User.create(profileData, (err, addeduser)=> {
                if(err) return cb(err);
                return cb(err, addeduser)
            })
        }else{
            cb(err, user)
        }
    })
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

passport.deserializeUser(function(id, done) {
  User.findById(id,"name email username photo", function(err, user) {
    done(err, user);
  });
});