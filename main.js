var context = canvas.getContext("2d");
canvas.width= 512;
canvas.height = 512;

var air = [];
var airbuffer = [];
var SIZE = 128;

var areas = [new Area(new Rect(0,0,SIZE,SIZE), 0, 0.2, "#FFFFFF")];//default background is always there

//drawing {
function sigmoid(x){
	return 1/(1+Math.pow(2, -x))
}

function fromHex(hex){
	return [Number.parseInt(hex.slice(1,3),16),
			Number.parseInt(hex.slice(3,5),16),
			Number.parseInt(hex.slice(5,7),16)];
}

function hex(r,g,b){
	if(r<0)	  r = 0;
	if(r>255) r = 255;
	if(g>255) g = 255;
	if(g<0)	  g = 0;
	if(b>255) b = 255;
	if(b<0)	  b = 0;
	return "#"+twoDigitHex(r)+twoDigitHex(g)+twoDigitHex(b);
}

function twoDigitHex(x){
	return Math.floor(x).toString(16).padStart(2, "0");
}

function draw(){
	var ratio = canvas.width/SIZE;
	for(var i=0; i<air.length; i++){
		for(var j=0; j<air[i].length; j++){
			var intensity = sigmoid(air[i][j].height);
			var color = fromHex(areas[air[i][j].area].color);
			context.fillStyle = hex(intensity*color[0], intensity*color[1], intensity*color[2]);
			context.fillRect(i*ratio,j*ratio,ratio,ratio);
		}
	}
}
// } drawing

function bound(x){
	if(x<0){
		return 0;
	}else if(x>=SIZE){
		return SIZE-1;
	}else{
		return x;
	}
}

function addArea(area){
	areas.push(area);
	for(var i=bound(area.rect.x); i<bound(area.rect.x+area.rect.w); i++){
		for(var j=bound(area.rect.y); j<bound(area.rect.y+area.rect.h); j++){
			air[i][j].area = areas.length-1;
		}
	}
}

function removeArea(index){
	area = areas[index];
	
	areas.splice(index, 1);
	for(var i=area.rect.x; i<area.rect.x+area.rect.w; i++){
		for(var j=area.rect.y; j<area.rect.y+area.rect.h; j++){
			for(var k = areas.length-1; k >= 0; k--){
				if(areas[k].rect.contains(i, j)){
					air[i][j].area = k;
					break;
				}
			}
		}
	}
}

//runtime{
function step(){
	airbuffer = air.map(function(e){return e.map(function(f){return f.copy();})});
	for(var i=0; i<air.length; i++){
		for(var j=0; j<air[i].length; j++){
			var surrounding = [];
			var total = 0;
			for(var v=bound(i-1); v<=bound(i+1); v++){
				for(var h=bound(j-1); h<=bound(j+1); h++){
					var dif = (airbuffer[i][j].height-airbuffer[v][h].height)/9;
					if(Math.abs(i-v)+Math.abs(j-h) == 2){
						dif /= Math.sqrt(2);
					}
					air[v][h].velocity += areas[air[i][j].area].wavePropogationSpeed*dif;
					total += dif;
				}
			}
			air[i][j].velocity -= areas[air[i][j].area].wavePropogationSpeed*total;
		}
	}
	for(var i=0; i<air.length; i++){
		for(var j=0; j<air[i].length; j++){
			air[i][j].height += air[i][j].velocity;
			air[i][j].velocity *= areas[air[i][j].area].dampingMultiplier;
		}
	}
}

function start(){
	setSize(SIZE);

	for(var i=0; i<SIZE; i++){
		air.push([]);
		for(var j=0; j<SIZE; j++){
			air[i].push(new Atom(0,0));
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
//}runtime