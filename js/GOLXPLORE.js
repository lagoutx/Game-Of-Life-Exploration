var elements = new Array(); // Array of grid objects

// size variables
var height = 55;
var width = 60;

var interval = null;
var running = false; // keep track of when the apps running
var intervaltime = 80; // speed of running time
var generation = 0;
var isMouseDown = false;

$(document).ready(function () {

    // Calulate the size of the starting grid based on the current screen size
    if (window.innerWidth < 944) {
        width = 36;
        height = 36;

        if (window.innerWidth < 768) {
            width = 20;
            height = 20;
        }
    } else {
        width = 70;
        height = 50;
    }

    if (window.innerWidth == 1024 && window.innerHeight == 672) {
        width = 20;
        height = 20;
    }

    // Create the grid on start
    createGrid();


    $(document).on("click", ".custom-button.type2", function () {
        $(this).toggleClass("enabled");
    });

    $(document).on('click', '.life-element', function () {
        $(this).toggleClass('alive');
        elements[$(this).attr('id')].alive = !elements[$(this).attr('id')].alive;
    });


    $(document).mousedown(function () {
            isMouseDown = true;
        })
    .mouseup(function () {
        isMouseDown = false;
    });


    $(document).on('mouseover', '.life-element', function () {

        if (!running) {

            if (isMouseDown) {
                $(this).toggleClass('alive');
                elements[$(this).attr('id')].alive = !elements[$(this).attr('id')].alive;
            }
        }
        
    });


    // Run a single interation of the game of life algorithm
    $(document).on('click', '#step-button', function () {
        if (!$(this).hasClass('disabled')) {
            if (!running) {
                step();
            }
        }
    });

    // run continuously
    $(document).on('click', '#start-button', function () {
        if (!$(this).hasClass('disabled')) {
            start();
        }
    });

    // self explanatory
    $(document).on('click', '#stop-button', function () {
        if (!$(this).hasClass('disabled')) {
            stop();
        }
    });


    $(document).on('click', '#reset-button', function () {
        stop();
        createGrid(false);
    });

    // increase simulation speed
    $(document).on('click', '#speed-plus-button', function () {
        if (running) {
            stop();
            if (intervaltime != 10) { intervaltime -= 10; }
            start();
        } else {
            if (intervaltime != 10) { intervaltime -= 10; }
        }
    });

    // decrease simulation speed
    $(document).on('click', '#speed-minus-button', function () {
        if (running) {
            stop();
            if (intervaltime != 180) { intervaltime += 10; }
            start();
        } else {
            if (intervaltime != 180) { intervaltime += 10; }
        }
    });

    // randonly fill the grid with alive elements
    $(document).on('click', '#random-button', function () {
        if (!$(this).hasClass('disabled')) {
            if (!running) {
                createGrid(true);
            }
        }
    });

    $(document).on('click', '#resize-button', function () {
        resize();
    });
});


function createGrid(rand){
    generation = 0; // reset the generation counter
    $('.generation-count').text(generation);

    elements = new Array(); //reset the stored elements

    $('#GOLTable').remove();

    $('#GOLGrid').append('<table id=\"GOLTable\"></table>');


    var tr = document.createElement('tr');
    var td = document.createElement('td');
    var populate = false;
    for (var i = 0; i < height * width; i++) {

        populate = false;

        if (i%width == 0){

            if (i > 0) {
                $('#GOLTable').append(tr);
            }

            tr = document.createElement('tr');
        }

        td = document.createElement('td');
        $(td).addClass('life-element');
        $(td).attr('id', i);
        

        if (rand == true) {
            if ((Math.floor((Math.random() * 100) + 1) < 25)) { populate = true } else { populate = false }
        }

        if (populate == true) {
            elements.push({ id: i, neighbours: 0, alive: true });
            $(td).addClass('alive');
        } else {
            elements.push({ id: i, neighbours: 0, alive: false });
        }

        tr.appendChild(td);
        
    }

    $('#GOLTable').append(tr);
    $('#GOL td').height($('#GOL td').width() +2);

}

function start() {
    if (!running) {
        disableNonRunningElements();
        interval = setInterval(step, intervaltime);
        running = !running;
    }
}

function stop() {
    if (running) {
        enableNonRunningElements();
        clearInterval(interval);
        running = !running;
    }
}

function step() {

    generation++;
    neighbourCount();
    lifeCheck();

    $('.generation-count').text(generation);
}

function resize() {

    if (!running) {
        if (window.innerWidth < 944) {
            width = 36;
            height = 36;
            if (window.innerWidth < 768) {
                width = 20;
                height = 20;
            }
        } else {
            width = 70;
            height = 50;
        }

        if (window.innerWidth == 1024 && window.innerHeight == 672) {
            width = 20;
            height = 20;
        }

        stop();
        createGrid(false);
    }
}


// core function count each of the elements around an elements and add up how many elements are alive
// core function count each of the elements around an elements and add up how many elements are alive
function neighbourCount() {

    for (var i = 0; i < elements.length ; i++) {
        var neighbours = 0;
        var ypos = Math.floor(i / width) + 1;
        var xpos = (i - ((ypos - 1) * width)) + 1;

        for (var j = -1; j < 2; j++) {
            var searchy = ypos + j;
            for (var k = -1; k < 2; k++) {
                var searchx = xpos + k;

                if (searchx == xpos && searchy == ypos) continue;
                if (searchx > 0 && searchx < (width + 1) && searchy > 0 && searchy < (height + 1)) {
                    if (elements[(searchx + (((searchy - 1) * width)) - 1)].alive) {
                        neighbours++;
                    }
                } else {

                    if (searchx < 1) {
                        if (searchy < 1) {
                            if (elements[(height * width) - 1].alive) {
                                neighbours++;
                            }
                        } else {

                            if (searchy > height) {
                                if (elements[width - 1].alive) {
                                    neighbours++;
                                }
                            }
                            else {
                                if (elements[(searchy * width) - 1].alive) {
                                    neighbours++;
                                }
                            }
                        }
                    } else {
                        if (searchx > width) {
                            if (searchy < 1) {
                                if (elements[((height * width)) - width].alive) {
                                    neighbours++;
                                }
                            } else {
                                if (searchy > height) {
                                    if (elements[0].alive) {
                                        neighbours++;
                                    }
                                }
                                else {
                                    if (elements[(searchy - 1) * width].alive) {
                                        neighbours++;
                                    }
                                }
                            }
                        } else {
                            if (searchy < 1) {
                                if (elements[(((width * height) - 1) - width) + searchx].alive) {
                                    neighbours++;
                                }
                            } else {
                                if (searchy > height) {
                                    if (elements[searchx - 1].alive) {
                                        neighbours++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        $('#' + elements[i].id).attr('display', 'background-color:grey');
        elements[i].neighbours = neighbours;

    }
}

// check if an element is alive, and decided if it stays alive, becomes alive or dies
function lifeCheck() {

    for (var i = 0; i < height * width; i++) {
        var alive = false;

        if (elements[i].alive == true) {
            if (elements[i].neighbours == 1 && $('#a1').hasClass("enabled")) { alive = true; }
            if (elements[i].neighbours == 2 && $('#a2').hasClass("enabled")) { alive = true; }
            if (elements[i].neighbours == 3 && $('#a3').hasClass("enabled")) { alive = true; }
            if (elements[i].neighbours == 4 && $('#a4').hasClass("enabled")) { alive = true; }
            if (elements[i].neighbours == 5 && $('#a5').hasClass("enabled")) { alive = true; }
            if (elements[i].neighbours == 6 && $('#a6').hasClass("enabled")) { alive = true; }
            if (elements[i].neighbours == 7 && $('#a7').hasClass("enabled")) { alive = true; }
            if (elements[i].neighbours == 8 && $('#a8').hasClass("enabled")) { alive = true; }
            if (elements[i].neighbours == 9 && $('#a9').hasClass("enabled")) { alive = true; }
        }

        if (alive == true) {
            elements[i].alive = true;
            $('#' + elements[i].id).addClass('alive');
        } else {
            if (elements[i].alive == false) {
                var birth = false;

                if (elements[i].neighbours == 1 && $('#b1').hasClass("enabled")) { birth = true; }
                if (elements[i].neighbours == 2 && $('#b2').hasClass("enabled")) { birth = true; }
                if (elements[i].neighbours == 3 && $('#b3').hasClass("enabled")) { birth = true; }
                if (elements[i].neighbours == 4 && $('#b4').hasClass("enabled")) { birth = true; }
                if (elements[i].neighbours == 5 && $('#b5').hasClass("enabled")) { birth = true; }
                if (elements[i].neighbours == 6 && $('#b6').hasClass("enabled")) { birth = true; }
                if (elements[i].neighbours == 7 && $('#b7').hasClass("enabled")) { birth = true; }
                if (elements[i].neighbours == 8 && $('#b8').hasClass("enabled")) { birth = true; }
                if (elements[i].neighbours == 9 && $('#b9').hasClass("enabled")) { birth = true; }

                if (birth == true) {
                    elements[i].alive = true;
                    $('#' + elements[i].id).addClass('alive');
                }
            }
            else {
                elements[i].alive = false;
                $('#' + elements[i].id).removeClass('alive');
            }

        }
    }
}

// disable buttons when running
function disableNonRunningElements() {
    $('#step-button').addClass('disabled');
    $('#start-button').addClass('disabled');
    $('#stop-button').removeClass('disabled');
    $('#random-button').addClass('disabled');
    $('#resize-button').addClass('disabled');

}

// enable buttons when running
function enableNonRunningElements() {
    $('#step-button').removeClass('disabled');
    $('#start-button').removeClass('disabled');
    $('#stop-button').addClass('disabled');
    $('#random-button').removeClass('disabled');
    $('#resize-button').removeClass('disabled');
}
