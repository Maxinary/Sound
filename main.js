var canvas = document.getElementById("draw");
var context = canvas.getContext("2d");
canvas.width= 512;
canvas.height = 512;

var air = [];
var airbuffer = [];
var SIZE = 128;

function length(a){
	return Math.sqrt(a[0]*a[0]+a[1]*a[1]);
}

function sigmoid(x){
	return 1/(1+Math.pow(2, -x))
}


function draw(){
	var ratio = canvas.width/SIZE;
	for(var i=0; i<air.length; i++){
		for(var j=0; j<air[i].length; j++){
			var intensity = sigmoid(air[i][j][0])*256;
			context.fillStyle = hex(intensity, intensity, intensity);
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
	airbuffer = air.map(function(e){return e.map(function(f){return f.slice();})});
//	air = air.map(function(e){return e.map(function(f){return f.map(function(g){return 0;});});});
	for(var i=0; i<air.length; i++){
		for(var j=0; j<air[i].length; j++){
			var surrounding = [];
			var total = 0;
			for(var v=bound(i-1); v<=bound(i+1); v++){
				for(var h=bound(j-1); h<=bound(j+1); h++){
					var dif = airbuffer[i][j][0]-airbuffer[v][h][0];
					surrounding[(v-i+1)*3+(h-j+1)] = dif;
					total += Math.abs(dif);
				}
			}
			if(total != 0){
				for(var v=bound(i-1); v<=bound(i+1); v++){
					for(var h=bound(j-1); h<=bound(j+1); h++){
						air[v][h][1] += airbuffer[i][j][0]*surrounding[(v-i+1)*3+(h-j+1)]/total;
					}
				}
				air[i][j][1] -= airbuffer[i][j][0];
			}
		}
	}
	for(var i=0; i<air.length; i++){
		for(var j=0; j<air[i].length; j++){
			air[i][j][0] += air[i][j][1];	
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