'use strict';

import { crearMarcoDelimi, auxConstruc, delantero, espalda, entalles } from './construccion-body-viewer/molde.js';

// Tomo el elemento svg del html
let svg = document.querySelector('.body-viewer');
const SVG_NS = 'http://www.w3.org/2000/svg';

// Variable que me permite establecer el tamaño del svg
const svgSize = {
	//medidas en cm
	width: 100,
	height: 100,
};

// -----------------------

//* Establezco una escala de transformación para todos los elementos svg para poder trabajar con las unidades en cm y se visualicen en puntos (pt) en la pantalla*//
const scale = 28.34645669; //28.34645669 pt = 1cm con pt como unidad por defecto para svg  1cm = 35.43307 pixels
//TODO Diferencia entre pixel CSS y pixel fisico (tamaño pantalla x ejem) el DPR (Device Pixel Ratio) DPR = pixel fisico/pixel css

// -----------------------

// Voy a establecer el viewBox del svg desde aquí 28.34645669 pt = 1cm con pt como unidad por defecto para svg . Por otro lado 1cm = 35.43307 pixels, 1pt = 1.25px
const svgViewBox = {
	minX: (-1 / 2) * svgSize.width * scale, //-1417.323 pts
	minY: (-1 / 2) * svgSize.height * scale,
	width: svgSize.width * scale,
	height: svgSize.height * scale,
};

//* Establezco el viweBox del svg *//
svg.setAttribute('viewBox', svgViewBox.minX + ' ' + svgViewBox.minY + ' ' + svgViewBox.width + ' ' + svgViewBox.height); // svg.setAttribute('viewBox', `${svgViewBox.minX} ${svgViewBox.minY} ${svgViewBox.width} ${svgViewBox.height}`);

//* Formación del molde *//
// Creamos un marco delimitador para el patrón del tamaño del viewBox del SVG

//! AQUI TIENE QUE IR AL PROMESA
let marcoDelimitador = crearMarcoDelimi();
// Creamos las líneas de construcción del patrón
let auxliaresConstruccion = auxConstruc();
// Creamos el patrón/molde base
let moldeDelantero = delantero();
let moldeEspalda = espalda();
let moldeEntalles = entalles();
// -----------------------

// -----------------------

//* INCLUIMOS TODOS LOS MÓDULOS DE CONSTRUCCION EN EL SVG BODY-VIEWER *//
//svg.appendChild(marcoDelimitador);

svg.appendChild(auxliaresConstruccion);
svg.appendChild(moldeDelantero);
svg.appendChild(moldeEspalda);
svg.appendChild(moldeEntalles);
