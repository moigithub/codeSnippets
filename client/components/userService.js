import axios from 'axios';

export default function getUser(){
	return axios.get('/user').then(data=>{
//		console.log("navigation user",data.data);
		return data.data.user
	});
}