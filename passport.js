//import {Strategy as LocalStrategy} from 'passport-local';
var LocalStrategy   = require('passport-local').Strategy;

import User from './models/User';

export default function(passport){
console.log("configuring paspport");
	// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
    },
    	function(req, email, password, done){
console.log('local-signup', email, password);
    		process.nextTick(function(){


    			User.findOne({'local.email': email}, function(err, user){
    				if(err) return done(err);

    				if(user){
    					return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
    				} else {
    					var newUser = new User();
    					newUser.local.email = email;
    					newUser.local.password = newUser.generateHash(password);

    					newUser.save(function(err){
    						if(err) throw err;
console.log("newuser saved", newUser);
    						return done(null, newUser);
    					});
    				}


    			})
    		});
    	}
    ));


	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
		function(req, email, password, done){
			console.log('local-login', email, password);
			User.findOne({'local.email': email}, function(err, user){
				if (err) return done(err);

				if(!user){
					return done(null, false, req.flash('loginMessage', 'No user found.'))
				}
console.log('login ', user)
				return done(null, user);;

			});
		}
	));


}