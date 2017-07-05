const expressGraphQL = require('express-graphql');

import sanitizer from 'sanitizer';

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

import ValidationError from './ValidationError';
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
		isOwner: {
			type: GraphQLBoolean,
			resolve: function(parentValue, args, context){
				//console.log("CodeSnippetType args", args,"\n\ncontext",context,"\n\nparentValue",parentValue);
				var isOwner = false;
				if(context.user && context.user._id) {
					isOwner = String(parentValue.postedBy) === String(context.user._id);
				}
				return isOwner
			}
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
					User.findById(sanitizer.sanitize(args.userId) , function(err, user){
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
			resolve: function(parentValue, args, context){
				const sID = sanitizer.sanitize(args.snippetId);
				return new Promise((resolve, reject)=>{
					if(!mongoose.Types.ObjectId.isValid(sID)){
				//		console.log("\n\nvalidation snippetid");
						//return reject(new ValidationError(["Invalid Snippet ID"]));
						return reject(new Error("Invalid Snippet ID"));
					}
					Snippet.findById(sID).lean().exec(function(err, snippet){
						if(err) {
				//			console.log("error codenippet by id",err)
							return reject(err);
						}
						
						if(!snippet){
				//			console.log("error codenippet by id !snippet",err)
							return reject(new Error("No snippet found."));
						}
						
				//		console.log("\n\nsnppet", snippet);
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
				const tags = args.tags.map(tag=>sanitizer.sanitize(tag)),
				      all = sanitizer.sanitize(args.all),  //// es un booolean tal vez no necesita sanitize??
				      language = sanitizer.sanitize(args.language),
				      author = sanitizer.sanitize(args.author);

				return new Promise((resolve, reject)=>{
//					console.log("codesnippetSSS", parentValue, args);

					var dbQuery={};


					if(tags && tags.length>0){
						if(all){
							dbQuery.tags={$all: tags};
						} else {
							dbQuery.tags={$in: tags};
						}
					}

					if(language && language.trim()!==""){
						dbQuery.language=new RegExp(language,"gi");
					}
//console.log("schema snippet dbQuery",dbQuery)
					//console.log("dbQuery findSnippet resolve context: ",context);
					//console.log("args", args, typeof args);
					var userId = "";
					
					if (context.user && context.user._id){ 
						userId=context.user._id;
					}

					//console.log("\n\nhere 0",dbQuery);
					if(author){ 
						dbQuery.postedBy = author;
						//console.log("\n\nhere 1",dbQuery, userId);
						if(author.toLowerCase()==="me" ){
							if(userId) {
								dbQuery.postedBy = userId;
							} else {
								delete dbQuery.postedBy;
							}
							//console.log("\n\nhere 2",dbQuery);
						}
					}

					//console.log("\n************\ndbQuery");
					//console.log(dbQuery);

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
					// console.log("mutation createSnippet resolve context: ",context.session);
					// ONLY AUTHENTICATED USER CAN USE THE MUTATION
					if(!context.user || !context.user._id){
						return reject(new Error("Only logged users allowed."));
					}

					const userId = context.user._id;
					const newSnippet = {
						language: sanitizer.sanitize(args.snippet.language),
						title: sanitizer.sanitize(args.snippet.title),
						description: sanitizer.sanitize(args.snippet.description),
						code: sanitizer.sanitize(args.snippet.code),
						postedBy: userId,  /// context userID ..sanitize??
						tags: args.snippet.tags.map(tag=>sanitizer.sanitize(tag)),
						links: args.snippet.links.map(link=>sanitizer.sanitize(link))
					};
					//console.log("mutation createSnippet ------> \n", newSnippet);
					Snippet.create(newSnippet, (err, snippet)=>{
						if(err) {
							return reject(err);
						}
						return resolve(snippet);
					});
				});
			}
		},
		deleteSnippet : {
			type: CodeSnippetType,
			args:{
				snippetId:{
					type: new GraphQLNonNull(GraphQLID)
				}
			},
			resolve: (__, args, context)=>{
				const snippetId = sanitizer.sanitize(args.snippetId);

				return new Promise((resolve, reject)=>{
					// insert into db
					//console.log("mutation deleteSnippet resolve context: ",context, "\nargs",args);
					// ONLY AUTHENTICATED USER CAN USE THE MUTATION
					if(!context.user || !context.user._id){
						return reject(new Error("Only logged users allowed."));
					}

					Snippet.findById(snippetId, (err, snippet)=>{
						if(err) {
							return reject(err);
						}
						if(!snippet){
							return reject(null);
						}
						snippet.remove();
						return resolve(snippet);
					});
				});
			}
		}, //deleteSnippet
		updateSnippet : {
			type: CodeSnippetType,
			args:{
				snippetId:{
					type: new GraphQLNonNull(GraphQLID)
				},
				snippet:{
					type: new GraphQLNonNull(CodeSnippetInputType)
				}

			},
			resolve: (__, args, context)=>{
				const snippetId = sanitizer.sanitize(args.snippetId),
					  language = sanitizer.sanitize(args.snippet.language),
					  title = sanitizer.sanitize(args.snippet.title),
					  description = sanitizer.sanitize(args.snippet.description),
					  code = sanitizer.sanitize(args.snippet.code),
					  postedBy = sanitizer.sanitize(args.snippet.postedBy),
					  tags = args.snippet.tags.filter(l=>l.trim()!=="")
											.map(tag=>sanitizer.sanitize(tag)),
					  links = args.snippet.links.filter(l=>l.trim()!=="")
											.map(link=>sanitizer.sanitize(link));


				return new Promise((resolve, reject)=>{
					// insert into db
				//	console.log("mutation updateSnippet resolve context: ",context, "\nargs",args);
					// ONLY AUTHENTICATED USER CAN USE THE MUTATION
					if(!context.user && !context.user._id){
						return reject(new Error("Only logged users allowed."));
					}

					Snippet.findById(snippetId, (err, snippet)=>{
						if(err) {
							return reject(err);
						}
						if(!snippet){
							return reject(null);
						}

						if( args.snippet.language ) { snippet.language = language; }
						if( args.snippet.title ) { snippet.title = title; }
						if( args.snippet.description ) { snippet.description = description; }
						if( args.snippet.code ) { snippet.code = code; }
						if( args.snippet.postedBy ) { snippet.postedBy = postedBy; }
						if( args.snippet.tags.length ) { snippet.tags = tags; }
						if( args.snippet.links.length ) { snippet.links = links; }
					
				//		console.log("mutation updateSnippet ------> \n",snippet);
						snippet.save( (err)=>{
							if(err) {
								return reject(err);
							}
							return resolve(snippet);
						});
					});
				});
			}
		} //deleteSnippet
	}//fields
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