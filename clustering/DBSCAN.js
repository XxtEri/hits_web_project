import {
    RADIUS_CHANGE,
    COUNT_NEIGHBOURS_POINTS,
    data_points,
    POINT_RADIUS
} from "./main.js";

import {
    checkingOnError,
    deepCopy
} from "./func_for_algo.js"

import {
    disableButtons,
    enableButtons
} from "./buttons_handler.js";

import {
    calculateDistance,
    showOldPoints
} from "./canvas_handler.js";

export { startDBSCAN }


function startDBSCAN() {
    showOldPoints();
    disableButtons();
    debugger;
    if (data_points.length > 0) {
        DBSCAN(deepCopy(data_points));

        enableButtons();
    } else {
        alert("Сначала нарисуйте хотя бы одну точку на плоскости")
    }
}

function DBSCAN(points) {
    let count_clusters = 0;

    for (let i = 0; i < points.length; i++) {
        if (points[i].cluster == 0 && points[i].core === false) {
            let neighbours = findNeighbours(points[i], count_clusters, points);

            if (neighbours.length !== 0) {
                points[i].core = true;
                count_clusters++;

                points[i].cluster = count_clusters;
                points[i].draw();

                let queue = deepCopy(neighbours);

                for (let j = 0; j < queue.length; j++) {
                    if (queue[j].core === false) {
                        queue[j].core = true;
                    }

                    queue[j].cluster = count_clusters;
                    queue[j].draw();

                    neighbours = findNeighbours(queue[j], count_clusters, points);
                    if (neighbours.length !== 0) {
                        for (let i = 0; i < neighbours.length; i++) {
                            queue.push(neighbours[i]);
                        }
                        drawNeighbours(neighbours, 'pink');
                    }
                }

            } else {
                points[i].cluster = -1;
            }
        }
    }
}

function findNeighbours(point, current_cluster, points) {
    let count_neighbours = 0;
    let neighbours = [];
    for (let i = 0; i < points.length; i++) {
        if (point.x !== points[i].x && point.y !== points[i].y && points[i].cluster < 1) {
            if (calculateDistance(point.x, point.y, points[i].x, points[i].y) - POINT_RADIUS <= RADIUS_CHANGE) {
                neighbours.push(points[i]);
                count_neighbours++;
            }

        } else if (points[i].cluster === current_cluster && current_cluster != 0) {
            count_neighbours++;
        }
    }

    if (count_neighbours >= COUNT_NEIGHBOURS_POINTS) {
        return neighbours;
    }

    return [];
}

function drawNeighbours(N, color) {
    for (let i = 0; i < N.length; i++) {
        N[i].redraw(color);
    }
}