var width,height;
var cell_size;
var iteration_x,iteration_y;

var cells;

var neighbors=[
    new Neighbor(0,-1),
    new Neighbor(-1,-1),
    new Neighbor(-1,0),
    new Neighbor(-1,1),
    new Neighbor(0,1),
    new Neighbor(1,1),
    new Neighbor(1,0),
    new Neighbor(1,-1)
];

var generation;

var isPlaying;
var wait_ms;

var canvas;
var context;

window.onload=function(){
    init();

    canvas.addEventListener("click",putCell,false);
}

function init(){
    canvas=document.getElementById("canvas");
    
    if(!canvas.getContext) return;

    context=canvas.getContext("2d");

    context.strokeStyle="rgb(50,50,50)";

    width=canvas.width;
    height=canvas.height;
    cell_size=10;

    iteration_x=Math.floor(width/cell_size)+2;
    iteration_y=Math.floor(height/cell_size)+2;

    isPlaying=false;

    initCells();

    randomize();

    redrawGenCount();
    changeSpeed();
}

function initCells(){
    cells=(new Array(iteration_y));
    for(var x=0;x<iteration_y;x++){
        cells[x]=(new Array(iteration_x)).fill(false);
    }
}

function randomize(){
    for(var x=1;x<iteration_x-1;x++){
        for(var y=1;y<iteration_y-1;y++){
            if(Math.floor(Math.random()*10)<=1){
                cells[y][x]=true;
            }
            else{
                cells[y][x]=false;
            }
        }
    }

    generation=1;

    drawBackground();
    drawCells();
    redrawGenCount();
}

function putCell(e){
    var x=Math.floor((e.clientX-canvas.offsetLeft)/cell_size)+1;
    var y=Math.floor((e.clientY-canvas.offsetTop)/cell_size)+1;

    if(cells[y][x]){
        cells[y][x]=false;
    }
    else{
        cells[y][x]=true;
    }

    drawBackground();
    drawCells();
    redrawGenCount();
}

function play(){
    isPlaying=!isPlaying;

    if(isPlaying){
        document.getElementById("playButton").innerHTML="Pause";
        redraw();
    }
    else{
        document.getElementById("playButton").innerHTML="Play";
    }
}

function playStep(){
    if(isPlaying) return;
    redraw();
}

function clearCells(){
    for(var x=1;x<iteration_x-1;x++){
        for(var y=1;y<iteration_y-1;y++){
            cells[y][x]=false;
        }
    }

    generation=1;

    drawBackground();
    drawCells();
    redrawGenCount();
}

function renewCells(){
    var cells_prev=new Array(iteration_y);

    for(var i=0;i<iteration_y;i++){
        cells_prev[i]=cells[i].slice();
    }

    for(var x=1;x<iteration_x-1;x++){
        for(var y=1;y<iteration_y-1;y++){
            var alives=getAliveCells(cells_prev,x,y);

            if(alives==2){
                cells[y][x]=cells_prev[y][x];
            }
            else if(alives==3){
                cells[y][x]=true;
            }
            else{
                cells[y][x]=false;
            }
        }
    }

    generation++;
}

function getAliveCells(cells_prev,x,y){
    var aliveCells=0;

    for(var i=0;i<8;i++){
        if(cells_prev[y+neighbors[i].dy][x+neighbors[i].dx]){
            aliveCells++;
        }
    }

    return aliveCells;
}

function Neighbor(dx,dy){
    this.dx=dx;
    this.dy=dy;
}

function redraw(){
    renewCells();

    drawBackground();

    drawCells();

    redrawGenCount();

    if(isPlaying){
        setTimeout(redraw,wait_ms);
    }
}

function drawBackground(){
    context.clearRect(0,0,width,height);

    context.fillStyle="black";
    context.fillRect(0,0,width,height);
}

function drawCells(){
    context.fillStyle="lime";

    for(var x=1;x<iteration_x-1;x++){
        for(var y=1;y<iteration_y-1;y++){
            if(cells[y][x]){
                context.fillRect((x-1)*cell_size,(y-1)*cell_size,cell_size,cell_size);
            }
            context.strokeRect((x-1)*cell_size,(y-1)*cell_size,cell_size,cell_size);
        }
    }
}

function redrawGenCount(){
    document.getElementById("gen_count").innerHTML=String(generation);
}

function changeSpeed(){
    wait_ms=Number(document.getElementById("speedSlider").value)*10;
    document.getElementById("fps").innerHTML=String((1000/wait_ms).toFixed(1));
}