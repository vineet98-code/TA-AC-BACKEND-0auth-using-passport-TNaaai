var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

var User = require('../models/User');

passport.use(new GitHubStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: '/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    var pofileData = {
        name: profile.displayName,
        username: profile.username,
        email: profile.emails,
        photo: profile.photos
    };  
    // to check all information already saves in our database or not
    User.findOne({ email: profile.emails }, (err, user) => {
        if(err) return done(err);
        // If user doesnot exist so this condition
        if(!user){
            User.create(pofileData, (err, addedUser) => {
                if(err) return done(err);
                return done(null, addedUser )
            });
        }
        done(null, user) // call the done callback with either a succes or a failure in order to move out of the github stratgey to the succes or failure redirect
    
    }) // done as callback error as null and second argument as success and false as failure redirect
}))

passport.serializeUser(function(user, done) {
    done(null, user.id);
    });
    
passport.deserializeUser(function(id, done) {
    User.findById(id, "name emails username", function(err, user) {
        done(err, user);
    });
});