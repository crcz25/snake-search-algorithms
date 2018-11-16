console.log('snake js')

let selectedAlgorithm = document.getElementById('inputSearchAlgorithm');
let start = document.getElementById('start');
let stop = document.getElementById('stop');
let ctx;

selectedAlgorithm.addEventListener('change', function() {
    console.log(this.value);
});

start.addEventListener('click', function() {
    console.log('start');
});

stop.addEventListener('click', function() {
    console.log('stop');
});

function init(){
    console.log('init');
	ctx = document.getElementById('canvas').getContext("2d");
}

init();