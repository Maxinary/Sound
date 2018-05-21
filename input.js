var mode = 0;

var modeInput = document.getElementById("modeInput");

var displace = document.getElementById("displace");

var editArea = document.getElementById("editArea");

var newArea = document.getElementById("newArea");

var removeArea = document.getElementById("removeArea");

var xOut = document.getElementById("x");

var yOut = document.getElementById("y");

var canvas = document.getElementById("draw");

var velocityX = document.getElementById("velX");
var velocityY = document.getElementById("velY");
var velocity = document.getElementById("velocity");
var setVelocity = document.getElementById("setVelocity");

var editAreaIndex = document.getElementById("editAreaIndex");
var areaDamping = document.getElementById("areaDamping");
var areaWavePropogationSpeed = document.getElementById("areaWavePropogationSpeed");
var areaColor = document.getElementById("areaColor");
var saveEdit = document.getElementById("saveEdit");

var leftArea = document.getElementById("leftArea");
var topArea = document.getElementById("topArea");
var rightArea = document.getElementById("rightArea");
var bottomArea = document.getElementById("bottomArea");
var newareaDamping = document.getElementById("newareaDamping");
var newareaWavePropogationSpeed = document.getElementById("newareaWavePropogationSpeed");
var newareaColor = document.getElementById("newareaColor");
var newAreaAction = document.getElementById("newAreaAction");

var removeAreaIndex = document.getElementById("removeAreaIndex");
var removeAreaAction = document.getElementById("removeAreaAction");

var Xs = document.getElementsByClassName("x");
var Ys = document.getElementsByClassName("y");

var areaIndecies = document.getElementsByClassName("areaIndex");

var modes = [displace, editArea, newArea, removeArea];

function modeChange(m){
  for(var i=0; i<modes.length; i++){
    modes[i].style.display = "none";
  }
  if(m != -1){
    modes[m].style.display = "";
  }
}

function setMode(m){
  return function(){
    mode = m;
    modeChange(m);
  };
}

(function(){  
  let modeIns = modeInput.children;
  for(var i=0; i<modeIns.length; i++){
    modeIns[i].children[0].onclick = setMode(i);
  }
})();

modeChange(-1);

function setSize(size){
  for(var i=0; i<Xs.length; i++){
    Xs[i].max = size;
  }
  for(var i=0; i<Ys.length; i++){
    Ys[i].max = size;
  }
}

var hoverPause = false;

canvas.onmousemove = function(e){
  if(!hoverPause){
    xOut.innerHTML = Math.floor((e.pageX - this.offsetLeft)*Xs[0].max/canvas.width);
    yOut.innerHTML = Math.floor((e.pageY - this.offsetTop)*Xs[0].max/canvas.width);
  }
}

canvas.onclick = function(){
  hoverPause ^= true;
}

setVelocity.onclick = function(){
  air[velX.value][velY.value].velocity = Number.parseFloat(velocity.value);
}

editAreaIndex.onchange = function(){
  var curArea = areas[editAreaIndex.value];
  areaDamping.value = 1-curArea.dampingMultiplier;
  areaWavePropogationSpeed.value = curArea.wavePropogationSpeed;
  areaColor.value = curArea.color;
}

saveEdit.onclick = function(){
  var curArea = areas[editAreaIndex.value];//aren't pointers just the best sometimes?
  curArea.dampingMultiplier = 1-areaDamping.value;
  curArea.wavePropogationSpeed = Number.parseFloat(areaWavePropogationSpeed.value);
  curArea.color = areaColor.value;
}

function updateAreaIndecies(){
  for(var i=0; i<areaIndecies.length; i++){
    areaIndecies[i].max = areas.length-1;
  }
}

newAreaAction.onclick = function(){
  if(bound(leftArea.value) == leftArea.value &&
     bound(topArea.value) == topArea.value &&
     bound(rightArea.value) == rightArea.value &&
     bound(bottomArea.value) == bottomArea.value)
  {
    addArea(new Area(
      new Rect(
        Number.parseInt(leftArea.value), 
        Number.parseInt(topArea.value), 
        rightArea.value-leftArea.value, 
        bottomArea.value-topArea.value), 
      newareaDamping.value, 
      newareaWavePropogationSpeed.value, 
      newareaColor.value));

    updateAreaIndecies();
  }
}

removeAreaAction.onclick = function(){
  removeArea(removeAreaIndex.value);

  updateAreaIndecies();
}