class Rect{
	constructor(x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	contains(x, y){
		return x>=this.x && x<=this.x+this.w && y>=this.y && y<=this.y+this.h;
	}
}

class Area{
	constructor(rect, damping, wavePropogationSpeed, color){
		if(damping === undefined)	damping = 0;
		if(wavePropogationSpeed === undefined)	wavePropogationSpeed = 1;
		if(color === undefined)	color = [128, 128, 128];

		this.rect = rect;
		this.wavePropogationSpeed = wavePropogationSpeed;
		this.dampingMultiplier = 1-damping;
		this.color = color;
	}
}

class Atom{
	constructor(height, velocity, area){
		if(area === undefined){
			area = 0;
		}
		this.height = height;
		this.velocity = velocity;
		this.area = 0;//index of areas array
	}

	copy(){
		return new Atom(this.height, this.velocity, this.area);
	}
}