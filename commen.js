let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let board = document.getElementsByClassName('board')[0]

canvas.height = board.clientHeight;
canvas.width = board.clientWidth;

document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
window.onresize = function(){
	// console.log("当前尺寸为：" + window.innerWidth);
	document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
	canvas.height = board.clientHeight;
	canvas.width = board.clientWidth;
}

var ctrl = false
var kq = false
var kw = false

window.onkeydown = function(e){
	switch(e.keyCode){
		case 17:ctrl = true;break;
		case 81:kq = true;break;
		case 87:kw = true;break;
	}
}

window.onkeyup = function(e){
	switch(e.keyCode){
		case 17:ctrl = false;break;
		case 81:kq = false;break;
		case 87:kw = false;break;
	}
}

function currTime(){
	let date = new Date()
	let year = date.getFullYear()
	let month = date.getMonth()
	let day = date.getDay()
	let hours = date.getHours()
	let minutes = date.getMinutes()
	let seconds = date.getSeconds()
	
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}