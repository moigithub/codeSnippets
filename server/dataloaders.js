const DataLoader = require('dataloader');

// 1
async function batchUsers (Users, keys) {
  return await Users.find({_id: {$in: keys}}); //.toArray(); //<<-- only exist on mongo native client, im using mongoose
}

// 2
const UserDataLoader = ({User}) =>({
  // 3
  Loader: new DataLoader(       //return an object with load function property
    keys => batchUsers(User, keys), //load method call this function
    {cacheKeyFn: key => key.toString()},
  ),
});


//--------

// 1
async function batchSnippets (Snippets, keys) {
  return await Snippets.find({_id: {$in: keys}}); //.toArray(); //<<-- only exist on mongo native client, im using mongoose
}

// 2
const SnippetDataLoader = ({Snippet}) =>({
  // 3
  Loader: new DataLoader(       //return an object with load function property
    keys => batchSnippets(Snippet, keys), //load method call this function
    {cacheKeyFn: key => key.toString()},
  ),
});




export default {
	UserDataLoader,
	SnippetDataLoader
}