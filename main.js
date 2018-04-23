var canvas = document.getElementById("draw");
var context = canvas.getContext("2d");
canvas.width= 512;
canvas.height = 512;


var air = [];
var SIZE = 128;

function length(a){
	return Math.sqrt(a[0]*a[0]+a[1]*a[1]);
}

function draw(){
	var ratio = canvas.width/SIZE;
	for(var i=0; i<air.length; i++){
		for(var j=0; j<air[i].length; j++){
			context.fillStyle = hex(length(air[i][j])*255,0,0);
			context.fillRect(i*ratio,j*ratio,ratio,ratio);
		}
	}
}

function hex(r,g,b){
	if(r<0)	  r = 0;
	if(r>255) r = 255;
	if(g>255) g = 255;
	if(g<0)	  g = 0;
	if(b>255) b = 255;
	if(b<0)	  b = 0;
	return "#"+Math.floor(r).toString(16).padStart(2, "0")+Math.floor(g).toString(16).padStart(2, "0")+Math.floor(b).toString(16).padStart(2, "0");
}

function bound(x){
	if(x<0){
		return 0;
	}else if(x>=SIZE){
		return SIZE-1;
	}else{
		return x;
	}
}

function step(){
	for(var i=0; i<air.length; i++){
		for(var j=0; j<air[i].length; j++){
			var v = air[i][j];
			var dir = (Math.atan2(v[0], v[1]) + 3/2*Math.PI)%(2*Math.PI);
			var index = Math.floor(2*dir/(Math.PI/4))%8;
			air[bound(i - Math.floor((index-4)/3)%2)][bound(j - Math.floor(((index+6)%8-4)/3)%2)][0] += air[i][j][0]/2;
			air[bound(i - Math.floor((index-4)/3)%2)][bound(j - Math.floor(((index+6)%8-4)/3)%2)][1] += air[i][j][1]/2;
			air[i][j][0] /=2;
			air[i][j][1] /=2;
// 3 2 1
// 4   0
// 5 6 7
		}
	}
}

function start(){
	for(var i=0; i<SIZE; i++){
		air.push([]);
		for(var j=0; j<SIZE; j++){
			air[i].push([0,0]);
		}
	}

	loop();
}

function loop(){
	step();
	draw();
	requestAnimationFrame(loop);
}

start();