const expressGraphQL = require('express-graphql');
import {GraphQLSchema, GraphQLObjectType, GraphQLString,GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLID, GraphQLNonNull} from 'graphql';

import mongoose from 'mongoose';
import User from './models/User.js';
import Snippet from './models/Snippet.js';


const CodeSnippetType= new GraphQLObjectType({
	name: 'CodeSnippet',
	description: 'Code Snippet',
	fields:()=>( {
		_id: {
			type: GraphQLString
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
		author: {
			type: UserType,
			resolve: function(parentValue, args){
		//		console.log("snippet params ",parentValue, args);
				return new Promise((resolve, reject)=>{
					User.findById(parentValue.postedBy, function(err, user){
		//				console.log("snippet author",err,user)
						if(err) {
							return reject(err);
						}
						return resolve(user);
					});
				});
			}
		},
		tags: {
			type: new GraphQLList(GraphQLString) 
		},
		links: {
			type: new GraphQLList(GraphQLString) 
		},
	})
});

const UserType = new GraphQLObjectType({
	name: 'User',
	description: 'User info',
	fields: ()=>({
		_id: {
			type: GraphQLString
		},
		email:{
			type: GraphQLString
		},
		displayName:{
			type: GraphQLString
		},
		snippets:{
			type:  new GraphQLList(CodeSnippetType),
			resolve: function(parentValue, args){
				//console.log("user params",parentValue, args);
				return new Promise((resolve, reject)=>{
					Snippet.find({postedBy: parentValue._id}, function(err, snippet){
						//console.log("snipets", err, snippet);
						if(err) {
							return reject(err);
						}
						return resolve(snippet);
					});
				});

			}
		}
	})
});

/////
const QueryType = new GraphQLObjectType({
	name : 'query',
	fields: {
		User: {
			type: UserType,
			args: {
				userId: {type:  new GraphQLNonNull(GraphQLString)}
			},
			resolve: function(parentValue, args){
			//	console.log(parentValue, args);
				return new Promise((resolve, reject)=>{
					User.findById(args.userId , function(err, user){
//					User.find({_id: args.userId} , function(err, user){
						//console.log(err, user);
						if(err) {
							return reject(err);
						}
						return resolve(user);
					});
				});
			}
		},
		Users: {
			type: new GraphQLList(UserType),
			resolve: function(parentValue, args){
				return new Promise((resolve, reject)=>{
					User.find( function(err, users){
				//		console.log(err, users);
						if(err) {
							return reject(err);
						}
						return resolve(users);
					});
				});
			}
		},
		CodeSnippet:{
			type: CodeSnippetType,
			args:{
				snippetId: {type: new GraphQLNonNull(GraphQLString)}
			},
			resolve: function(parentValue, args){
				return new Promise((resolve, reject)=>{
					Snippet.findById(args.snippetId, function(err, snippet){
						if(err) {
							return reject(err);
						}
						return resolve(snippet);
					});
				});
			}
		},
		CodeSnippets:{
			type: new GraphQLList(CodeSnippetType),
			args:{
				tags: {
					type: new GraphQLList(GraphQLString)
				},
				all:{
					type: GraphQLBoolean
				},
				language:{
					type: GraphQLString
				}
			},
			resolve: function(parentValue, args){
				return new Promise((resolve, reject)=>{
					console.log("codesnippetSSS", parentValue, args);

					let query={};


					if(args.tags && args.tags.length>0){
						if(args.all){
							query.tags={$all: args.tags};
						} else {
							query.tags={$in: args.tags};
						}
					}

					if(args.language && args.language.trim()!==""){
						query.language=new RegExp(args.language,"gi");
					}
console.log("schema snippet query",query)
					Snippet.find(query, function(err, snippets){
						if(err) {
							return reject(err);
						}
						return resolve(snippets);
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