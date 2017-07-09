'use strict';

import {Strategy as LocalStrategy} from 'passport-local';
//var LocalStrategy   = require('passport-local').Strategy;

import sanitizer from 'sanitizer';

import User from '../models/User';

export default function(passport){
console.log("configuring paspport");
	// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
    //    console.log("passport deserialize",id)
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

    		process.nextTick(function(){
                email= sanitizer.sanitize(email);
                password = sanitizer.sanitize(password);
                
    			User.findOne({'email': email, 'provider': 'local'}, function(err, user){
    				if(err) return done(err);

    				if(user){
    					return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
    				} else {
//            console.log('local-signup', email, password);
            
    					var newUser = new User();
    					newUser.email = email;
                        newUser.provider = 'local';
    					newUser.password = newUser.generateHash(password);

    					newUser.save(function(err){
    						if(err) return done(err);
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
			//console.log('local-login', email, password);
            email= sanitizer.sanitize(email);
            password = sanitizer.sanitize(password);

			User.findOne({'email': email, 'provider':'local'}, function(err, user){
				if (err) return done(err);

				if(!user){
					return done(null, false, req.flash('loginMessage', 'No user found.'))
				}

    //            console.log('login ', user)

				return done(null, user);;

			});
		}
	));


}