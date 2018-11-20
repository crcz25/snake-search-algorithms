// Initial parameters
let begin, end;

var ctx;
var message = new Object();
var worker = new Worker("serviceworker.js");
var config = {
    grid_size : 40,
    number_obstacles : 100,
    square_size : 10,
    snake_length : 4,
    search :'BFS',
    runTimeout : 0
};
var stats = {
    moves: 0,
    food: 0,
    nodes: 0,
    avg_moves: 0,
    avg_nodes: 0
};

var food = 20;


function init() {
    ctx = document.getElementById('canvas').getContext("2d");
    document.getElementById('canvas').width  = config.grid_size * 10; // in pixels
    document.getElementById('canvas').height = config.grid_size * 10;

    message.do = 'init';
    message.config = config;
    worker.postMessage(message);
    change_search();
}

var total_nodes = 0;
function refresh_view(data) {
    if (data.stats.food >= food) {
        stop();
    }
    total_nodes += stats.nodes

    //output some stats about our performance
    stats.moves = data.stats.moves;
    stats.food = data.stats.food;
    stats.nodes = data.stats.count;
    stats.avg_moves = data.stats.moves && data.stats.food ? data.stats.moves / (data.stats.food) : 0;
    stats.avg_nodes = data.stats.count && data.stats.food ? data.stats.count / (data.stats.food) : 0;


    stats.avg_moves.toFixed(4);
    stats.avg_nodes.toFixed(4)

    document.getElementById('moves_val').innerHTML = stats.moves;
    document.getElementById('food_val').innerHTML = stats.food;
    document.getElementById('nodes_val').innerHTML = stats.nodes;
    document.getElementById('total_val').innerHTML = total_nodes;
    document.getElementById('avg_moves_val').innerHTML = stats.avg_moves;
    document.getElementById('avg_nodes_val').innerHTML = stats.avg_nodes;

    //draw the squares, color based on what type of square
    for (var i = 0; i < config.grid_size; i++) {
        for (var j = 0; j < config.grid_size; j++) {
            switch (data.squares[i][j]) {
                case 0:
                    //empty
                    ctx.fillStyle = "#fff";
                    ctx.beginPath();
                    ctx.rect(i * config.square_size, j * config.square_size, config.square_size - 1, config.square_size - 1);
                    ctx.closePath();
                    ctx.fill();
                    ctx.beginPath();
                    ctx.rect(i * config.square_size, j * config.square_size, config.square_size, config.square_size);
                    ctx.closePath();
                    ctx.fillStyle = "#000";
                    ctx.stroke();
                    break;
                case 1:
                    //path
                    ctx.fillStyle = "#C3D9FF";
                    ctx.beginPath();
                    ctx.rect(i * config.square_size, j * config.square_size, config.square_size, config.square_size);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 3:
                    //wall
                    ctx.fillStyle = "#999";
                    ctx.beginPath();
                    ctx.rect(i * config.square_size, j * config.square_size, config.square_size, config.square_size);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 2:
                    //food
                    ctx.fillStyle = "#c33";
                    ctx.beginPath();
                    ctx.rect(i * config.square_size, j * config.square_size, config.square_size, config.square_size);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 4:
                    //obstacle
                    ctx.fillStyle = "#804000";
                    ctx.beginPath();
                    ctx.rect(i * config.square_size, j * config.square_size, config.square_size, config.square_size);
                    ctx.closePath();
                    ctx.fill();
                    break;
                default:
                    if (data.squares[i][j] == 5) {
                        //head
                        ctx.fillStyle = "#00FF00";
                        ctx.beginPath();
                        ctx.rect(i * config.square_size, j * config.square_size, config.square_size, config.square_size);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    }
                    if (data.squares[i][j] == 4 + config.snake_length) {
                        //tail
                        ctx.fillStyle = "#0D3723";
                        ctx.beginPath();
                        ctx.rect(i * config.square_size, j * config.square_size, config.square_size, config.square_size);
                        ctx.closePath();
                        ctx.fill();
                        ctx.fillStyle = "#000";
                        ctx.stroke();
                        break;
                    }
                    //body
                    ctx.fillStyle = "#0D3723";
                    ctx.beginPath();
                    ctx.rect(i * config.square_size, j * config.square_size, config.square_size, config.square_size);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = "#000";
                    ctx.stroke();
                    break;
            }
        }
    }
}

//create a web worker that will do the processing

//when the worker sends a message, act on it.
worker.onmessage = function (event) {
    //if it's a move, then redraw the screen based on the state passed
    if (event.data.type == 'move')
        refresh_view(event.data);
    else
        console.log(event.data);
    //otherwise, it's an error, send it to the console so we can see it in firebug
};

//if the worker reports an error, log it in firebug
worker.onerror = function (error) {
    console.log(error.message);
};

//sends a start message to the worker. The worker will begin processing until it's told to stop.
function start() {
    message.do = 'start';
    worker.postMessage(message);
    begin = new Date();
    console.log('Start', begin)
}

//stop the worker. It will be 'paused' and wait until it's told to start again. State will be maintained
function stop() {
    var message = new Object();
    message.do = 'stop';
    worker.postMessage(message);
    end = new Date();
    let elapsed = end - begin;
    elapsed /= 1000;
    let sec = Math.round(elapsed);
    console.log('End', end);
    console.log('Time taken (sec)', sec);
}

//update the type of search we want the worker to use.
function change_search() {
    let search = document.getElementById("search").value;
    console.log(message)

    message.do = 'init';
    message.config = config;
    worker.postMessage(message);

    message.do = 'set_search';
    message.search = document.getElementById('search').value;
    console.log(message)
    worker.postMessage(message);
}