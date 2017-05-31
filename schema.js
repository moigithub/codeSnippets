const expressGraphQL = require('express-graphql');
import {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLID} from 'graphql';

import mongoose from 'mongoose';
import User from './models/User.js';
import Snippet from './models/Snippet.js';


const CodeSnippetType= new GraphQLObjectType({
	name: 'CodeSnippet',
	description: 'Code Snippet',
	fields:()=>( {
		_id: {
			type: GraphQLID
		},
		language: {
			type: GraphQLString,	
			description: 'Language'
		},
		title: {
			type: GraphQLString
		},
		description: {
			type: GraphQLString
		},
		code: {
			type: GraphQLString
		},
		postedBy: {
			type: UserType,
			resolve: function(parentValue, args){
				console.log(parentValue, args);
				return "nuu";
				/*
				return new Promise((resolve, reject)=>{
					User.findById(parentValue.PostedBy, function(err, user){
						if(err) {
							return reject(err);
						}
						return resolve(user);
					});
				});
				*/
			}
		},
		tags: {
			type: new GraphQLList(GraphQLString) 
		},
		refLinks: {
			type: new GraphQLList(GraphQLString) 
		},
	})
});

const UserType = new GraphQLObjectType({
	name: 'User',
	description: 'User info',
	fields: {
		_id: {
			type: GraphQLID
		},
		email:{
			type: GraphQLString
		},
		displayName:{
			type: GraphQLString
		},
		snippets:{
			type: CodeSnippetType,
			resolve: function(parentValue, args){
				return new Promise((resolve, reject)=>{
					Snippet.find({PostedBy: parentValue._Id}, function(err, user){
						if(err) {
							return reject(err);
						}
						return resolve(user);
					});
				});
			}
		}
	}
});

/////
const QueryType = new GraphQLObjectType({
	name : 'query',
	fields: {
		User: {
			type: UserType,
			args: {
				userId: {type: GraphQLString}
			},
			resolve: function(parentValue, args){
				return {displayName:1,_id:2,email:"hello"}
				return new Promise((resolve, reject)=>{
					User.findById(args.userId, function(err, user){
						if(err) {
							return reject(err);
						}
						return resolve(user);
					});
				});
			}
		},
		CodeSnippet:{
			type: CodeSnippetType,
			args:{
				snippetId: {type: GraphQLString}
			},
			resolve: function(parentValue, args){
				return new Promise((resolve, reject)=>{
					Snippet.findById(args.snippetId, function(err, user){
						if(err) {
							return reject(err);
						}
						return resolve(user);
					});
				});
			}
		}

	}
});



var schema = new GraphQLSchema({
	query : QueryType
});



export default expressGraphQL({
	schema,
	graphiql: true
})