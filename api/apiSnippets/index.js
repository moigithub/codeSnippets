import {Router} from 'express';

var router = Router();

const data =[
	{
		Language: 'javascript',
		Tags:["react router 4", "react"],
		Description: "using rr4 example",
		Code: "hello world",
		Date: Date.now(),
		Links: ["http://google.com"],
		PostedBy: 1
	},
	{
		Language: 'javascript',
		Tags:["mongoose", "node"],
		Description: "mongoose connect & err handling",
		Code: "mongoose.connect('mongodb://localhost/db')",
		Date: Date.now(),
		Links: ["http://lala.com"],
		PostedBy: 1
	},
	{
		Language: 'javascript',
		Tags:["express server", "node"],
		Description: "express server",
		Code: "import express from 'express';\nvar app=express();\napp.listen(3000,()=>console.log('server rdy.'))",
		Date: Date.now(),
		Links: ["http://bebe.com"],
		PostedBy: 1
	},
];

router.get("/", function(req,res){
	res.json(data);
});

export default router;