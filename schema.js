const expressGraphQL = require('express-graphql');
import {
	GraphQLSchema, 
	GraphQLObjectType, 
	GraphQLInputObjectType, 
	GraphQLString,
	GraphQLBoolean, 
	GraphQLInt, 
	GraphQLList, 
	GraphQLID, 
	GraphQLNonNull
} from 'graphql';

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
			type: GraphQLID
		},
		email:{
			type: GraphQLString
		},
		name:{
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
		authInfo: {type: GraphQLString},
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
				},
				author:{
					type: GraphQLID
				}
			},
			resolve: function(parentValue, args, context){
				return new Promise((resolve, reject)=>{
//					console.log("codesnippetSSS", parentValue, args);

					var dbQuery={};


					if(args.tags && args.tags.length>0){
						if(args.all){
							dbQuery.tags={$all: args.tags};
						} else {
							dbQuery.tags={$in: args.tags};
						}
					}

					if(args.language && args.language.trim()!==""){
						dbQuery.language=new RegExp(args.language,"gi");
					}
//console.log("schema snippet dbQuery",dbQuery)
					console.log("dbQuery findSnippet resolve context: ",context);
					console.log("args", args, typeof args);
					var userId = "";
					
					if (context.session.passport && context.session.passport.user){ 
						userId=context.session.passport.user;
					}

					console.log("\n\nhere 0",dbQuery);
					if(args.author){ 
						dbQuery.postedBy = args.author;
						console.log("\n\nhere 1",dbQuery, userId);
						if(args.author.toLowerCase()==="me" ){
							if(userId) {
								dbQuery.postedBy = userId;
							} else {
								delete dbQuery.postedBy;
							}
							console.log("\n\nhere 2",dbQuery);
						}
					}

					console.log("\n************\ndbQuery");
					console.log(dbQuery);

					Snippet.find(dbQuery, function(err, snippets){
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



/*#####################*/
///  MUTATIONs
/*#####################*/

const CodeSnippetInputType = new GraphQLInputObjectType({
	name: 'SnippetInput',
	fields:{
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
			type: new GraphQLNonNull(GraphQLID)
		},
		tags: {
			type: new GraphQLList(GraphQLString) 
		},
		links: {
			type: new GraphQLList(GraphQLString) 
		},
	}
});

const mutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields:{
		createSnippet : {
			type: CodeSnippetType,
			args:{
				snippet:{
					type: new GraphQLNonNull(CodeSnippetInputType)
				}

			},
			resolve: (__, args, context)=>{
				return new Promise((resolve, reject)=>{
					// insert into db
console.log("mutation createSnippet resolve context: ",context.session);
					const userId = context.session.passport.user;
					const newSnippet = {
						language: args.snippet.language,
						title: args.snippet.title,
						description: args.snippet.description,
						code: args.snippet.code,
						postedBy: userId,
						tags: args.snippet.tags,
						links: args.snippet.links
					};
					console.log("mutation createSnippet ------> \n", newSnippet);
					Snippet.create(newSnippet, (err, snippet)=>{
						if(err) {
							return reject(err);
						}
						return resolve(snippet);
					});
				});
			}
		}
	}


})



/*#####################*/

var schema = new GraphQLSchema({
	query : QueryType,
	mutation: mutationType
});

export default schema;
/*
const root = {
	authInfo: function(args, request){
		console.log("authInfo",request);
		return request.user;
	}
}

export default expressGraphQL({
	schema,
//	context:{session : request.session},
	graphiql: true,
	rootValue : root
})

*/