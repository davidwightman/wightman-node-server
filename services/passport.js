
// const passport = require('passport')
// const GoogleStrategy = require('passport-google-oauth20').Strategy
// const mongoose = require('mongoose');

// const keys = require('../config/keys');

// const User = mongoose.model('users');

// passport.use(new GoogleStrategy({
//     clientID: keys.googleClientID,
//     clientSecret: keys.googleClientSecret,
//     callbackURL: '/auth/google/callback'
// }, (accessToken, refreshToken, profile, done) => {
//     new User({ googleId: profile.id}).save()
// }));



const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then((user) => {
        done(null, user);
    }).catch(e => console.log('Error', e))
});

passport.use(new googleStrategy(
    {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL:'/auth/google/callback',
        proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
          existingUser =  await User.findOne({ googleId: profile.id })
                if (existingUser) {
                     return done(null, existingUser)
                }
                   const user = await new User({ googleId :profile.id }).save()
                   done(null, user) 
        }
));