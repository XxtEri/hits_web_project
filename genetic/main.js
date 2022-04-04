import { addVertex } from "./func_for_canvas.js";
import { removeVertex } from "./func_for_canvas.js";
import { getIndexHitVertex } from "./func_for_canvas.js";
import { isCanAddVertex } from "./func_for_canvas.js";
import { drawEdgesWithWeight } from "./func_for_canvas.js";
import { deleteEdge } from "./func_for_canvas.js";
import { drawEdgeAnswer } from "./func_for_canvas.js";

import { InitialPopulationGeneration } from "./algorithm.js";
import { algorithmsStart } from "./algorithm.js";


export const SIZE_WIDTH = 1300,
    SIZE_HEIGHT = 700;

export const VERTEX_RADIUS = 20,
    STROKE_WIDTH = 2,
    STROKE_COLOR = 'black',
    DEFAULT_FILL_COLOR = 'rgb(131, 118, 46)',
    EDGE_COLOR = 'blue',
    EDGE_WIDTH = 3;

export const MUTATION_PERCENTAGE = 80,
    COUNT_GENERATIONS = 100000;

export let vertexList = []; //массив вершин
export let adjMatrix = []; //матрица смежности
let activeMode = 0; //режим для взаимодействия с canvas

export let population = [], //массив хромосом
    POPULATION_SIZE;


const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');

canvas.width = SIZE_WIDTH;
canvas.height = SIZE_HEIGHT;


document.getElementById('canvas').addEventListener('click', handler);
document.getElementById('add_vertex').addEventListener('click', () => { activeMode = 1 });
document.getElementById('draw_edjes').addEventListener('click', drawEdgesWithWeight);
document.getElementById('remove_vertex').addEventListener('click', () => { activeMode = 2 });
document.getElementById('clear').addEventListener('click', () => { window.location.reload() }); // режим очистки поля
document.getElementById('start_algo').addEventListener('click', startAlgorithm);



function handler(event) {
    let x = event.offsetX;
    let y = event.offsetY;

    let index = getIndexHitVertex(x, y);

    if (activeMode == 1 && isCanAddVertex(x, y)) { //режим добавления вершин
        addVertex(x, y);

    } else if (activeMode == 2 && index != -1) { //режим удаления вершины
        removeVertex(index);
    }
}

function startAlgorithm(event) {
    POPULATION_SIZE = Math.pow(vertexList.length, 2);
    population = []; //при добавлении новых вершин обнуляем популяцию

    InitialPopulationGeneration();

    let count = 0, //счетчик поколений
        counter_stop = 0; //счетчик для остановки программы

    let id = setInterval(function() {
        if (count > COUNT_GENERATIONS || counter_stop == 500) {
            deleteEdge();
            drawEdgeAnswer('green');
            console.log("END");

            clearInterval(id);
        }

        let fit1 = population[0].fitness,
            chrom1 = population[0].chromosome; //запоминаем лучшую хромосому

        algorithmsStart();

        let fit2 = population[0].fitness,
            chrom2 = population[0].chromosome; // запоминаем в измененной популяции лучшую хромосому

        if (fit2 !== fit1 || chrom2 !== chrom1) { // проверка на новую хромосому
            counter_stop = 0;
            deleteEdge();
            drawEdgeAnswer('black');
        }

        count++;
        counter_stop++;

    }, 0);
}