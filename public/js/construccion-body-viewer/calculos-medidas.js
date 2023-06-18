'use strict';

// -----------------------
// -----------------------

//!IMPORTAR AQUI EL OBJETO QUE VENGA DEL FORMULARIO CON LAS MEDIDAS Y LA WEBCAM

// -----------------------
// -----------------------

//TODO ESTOS DOS OBJETOS CON LAS MEDIDAS ES LO UNICO QUE DEBES APORTAR PAR QUE SE GENERE EL PATRON
// Definimos las constantes que vamos a utilizar
const medidasVr = {
	cuello: 36,
	hombro: 13,
	estatura: 165,
	largespalda: 40,
	largdelantero: 45, //45
	costadillo: 38.5,
	pierna: 96,
	entrepierna: 71,
	brazo: 59,
};

const medidasHz = {
	pecho: 88, // 88
	cintura: 72, // 72
	cadera: 94, // 94
	espalda: 35, // 35
	seppecho: 17, // 17
};

// -----------------------
// -----------------------

//* Incluyo medidas que se extraen de otras a falta de obtener ratios para sustituir la proporción arbitraria*//
medidasVr.montante = medidasVr.pierna - medidasVr.entrepierna;
medidasVr.largcadera = (2 / 3) * medidasVr.montante;

if (medidasVr.largdelantero > medidasVr.largespalda) {
	medidasVr.dvp = medidasVr.largdelantero - medidasVr.largespalda;
	medidasHz.dhp = medidasVr.dvp; // Después nos quedaremos con la mitad de esta medida porque es una medida horizontal
	medidasHz.torax = medidasHz.pecho - medidasHz.dhp;
} else {
	medidasVr.dvp = 0;
	medidasHz.dhp = medidasVr.dvp; // Después nos quedaremos con la mitad de esta medida porque es una medida horizontal
	medidasHz.torax = medidasHz.pecho;
}

//* Convierto las medidas en medios contornos (en los sistemas de patronaje se trabajan medios contornos)*//
for (let clave in medidasHz) {
	medidasHz[clave] = medidasHz[clave] / 2;
}

//* Calculo las holguras del molde. Holgura de la prenda para que no sea incómoda, se establecen arbitrariamente y aqui van las minimas recomendables para prendas habituales
let hTotal = 1; // holguraTotal. valor inicial arbitrario
const hPecho = 3; // valor arbitrario constante. Puede variarse si se desea más holgura en la prenda
//let holgura = 1; // se va a emplear para repartir la holgura de pecho entre las tres zonas que se veran mas adelante
let holgura = hPecho / 3; // se va a emplear para repartir la holgura de pecho entre las tres zonas que se veran mas adelante
const hCad = 1; // valor arbitrario constante. Puede variarse si se desea más holgura en la prenda
const hCin = 1; // valor arbitrario constante. Puede variarse si se desea más holgura en la prenda
let anchoMax = medidasHz.pecho + hPecho;
/* Establezco que el ancho maximo del patron sera la medida de pecho mas la 
holgura pero en el siguiente condicional comprobare si hay medidas mayores 
y como seran los entalles en funcion de ello */
// -----------------------
// -----------------------

//* Calculo de los entalles de cintura
//TODO
let totalEnt = 6; // Valor incial arbitrario
const entDel = medidasHz.dhp; // El entalle del delantero no es un entalle como tal, forma parte de la pinza de pecho y tiene simpre el valor de  medidasHz.dhp

// -----------------------
// -----------------------
//! Seguir revisando el ancho al generar el patrón porque cuando la cintura es grande se solapan los moldes
// -----------------------
// -----------------------

//* Calculos para hacer que mi dibujo en la pantalla no se superponga la construcción del molde o patron delantero y espalda *//
/* Establezco el ancho de mi dibujo del patrón en base al ancho maximo que 
    será que medida que mayor valor tenga entre pecho, cadera y cintura más 
    el valor arbitrario de holgura que le corresponda*/
if (medidasHz.pecho + hPecho >= medidasHz.cintura + hCin && medidasHz.pecho + hPecho >= medidasHz.cadera + hCad) {
	hTotal = hPecho; // 3 para cada medio de pecho/torax, 6cm totales (valor arbitrario)
	anchoMax = medidasHz.pecho + hTotal;
	totalEnt = anchoMax / 2 - (medidasHz.cintura / 2 + hCin);
	console.log('anchoMax ' + anchoMax);
	console.log('totalEnt ' + totalEnt);
} else if (medidasHz.cintura + hCin > medidasHz.pecho + hPecho && medidasHz.cintura + hCin >= medidasHz.cadera + hCad) {
	hTotal = hCin; //La holgura total sera la holgura arbitraria de cintura
	anchoMax = medidasHz.cintura + hTotal; // El ancho maximo que tenga el molde sera el correspondiente a la medida cintura + su holgura
	totalEnt = 0; // Sera 0 y los entalles por tanto tambien. No tendremos entalles
	console.log('anchoMax ' + anchoMax);
	console.log('totalEnt ' + totalEnt);
} else {
	hTotal = hCad;
	anchoMax = medidasHz.cadera + hTotal;
	totalEnt = anchoMax / 2 - (medidasHz.cintura / 2 + hCin); // Sera 0 y los entalles por tanto tambien. No tendremos entalles
	console.log('anchoMax ' + anchoMax);
	console.log('totalEnt ' + totalEnt);
}

//* Establezco el valor apra cada entalle*//
let entCentEsp = (3 * totalEnt) / 6;
let entCostEsp = (2 * totalEnt) / 6;
let entLateral = totalEnt / 6;

// Definimos atributo xmlns define el espacio de nombres del svg
const SVG_NS = 'http://www.w3.org/2000/svg';

// -----------------------
// -----------------------

//* Establezco el punto de referencia de construcción de mi patrón en base a sus medidas finales para que quede centrado en mi elemetno svg del html *//
//const refx = 0; // (anchoMax - (anchoMax)) / 2 En el caso del eje x la construcción del patrón ya lo ubica en el centro
//const refy = (medidasVr.largdelantero + medidasVr.largcadera) / 2 - medidasVr.largcadera;
const refx = 0; // (anchoMax - (anchoMax)) / 2 En el caso del eje x la construcción del patrón ya lo ubica en el centro
const refy = (medidasVr.largdelantero + medidasVr.largcadera) / 2 - medidasVr.largcadera;

// -----------------------
// -----------------------

//* --- Puntos clave en la construcción del patrón --- *//
let anchoEspCos = (4 / 8) * medidasHz.torax + (3 / 2) * holgura;
let anchoDelCos = anchoEspCos + medidasHz.dhp;

// Medidas verticales construcción patrón
let altSisa = medidasVr.largespalda / 2;
let altEspalda = (3 / 4) * medidasVr.largespalda;
let cajaCue = medidasHz.pecho / 8;
let altPnz = altSisa - 2.5; //Altura del pezón (2.5 es una medida arbitraria del pezon respecto de la líena de sisa)

// Medidas horizontales construcción patrón
/* El torax se divide en tres zonas: espalda, costado y delantero, por arbitrariedad/estudio de proporciones del cuerpo humano
	tomaremos que la espalda comprende 3/8 de la medida de medio contorno de pecho/torax (segun corresponda); el costado le
	corresponden 2/8, y a al delantero 3/8 más el desarrollo de pecho horizontal en caso de mujeres (dhp). A cada una de estas 
	zonas se le añade un margen de holgura (3 cm arbitrarios en total al medio contorno de pecho/torax), que corresponden a 1cm 
	de nuevo por arbitrariedad.
*/
let anchoEsp = (3 / 8) * medidasHz.torax + holgura;
let anchoCos = (2 / 8) * medidasHz.torax + holgura;
let anchoDel = (3 / 8) * medidasHz.torax + holgura + medidasHz.dhp;

let subPtaHomEsp = cajaCue / 4;
let ptaHomEsp = medidasVr.largespalda + subPtaHomEsp;

// -----------------------
// -----------------------

//* Calculo el arco cuyo tg es 1/(medidasVr.largespalda/2) para saber el angulo de la línea de esternón (1cm que desplazamos en alínea de talle hacia fuera oara buscar el angulo del esternon)
let angEsternon = Math.tan(1 / (medidasVr.largespalda / 2)); // Angulo de Louis, se puede sustituir por valores de referencia = Math.atan(1 / (medidasVr.largespalda / 2));
//console.log('angEsternon ' + angEsternon);
let desplinEsternon = Math.atan(angEsternon) * (medidasVr.largespalda / 2 + medidasVr.dvp); //NOTA: medidasVr.dvp = medidasVr.largdelantero - medidasVr.largespalda
//console.log('desplinEsternon ' + desplinEsternon);
let desplinEsternonCaj = Math.atan(angEsternon) * (medidasVr.largespalda / 2 + medidasVr.dvp - cajaCue);
//console.log('desplinEsternonCaj ' + desplinEsternonCaj);
// Calculo el ángulo de caida de hombro para poder colocar la medida de hombro indicada por el usuario
let angHombro = Math.tan((ptaHomEsp - medidasVr.costadillo) / (anchoEsp - cajaCue)); //= Math.atan((ptaHomEsp - medidasVr.costadillo) / (anchoEsp - cajaCue));
//console.log('angHombro ' + angHombro);

// -----------------------
// -----------------------

//* Calculo el ángulo de apertura de la pinza de pecho
//Primero calculo el ángulo que hace mi línea superior de pinza respecto de la vertical
let angPnzSupV = Math.tan(
	(refx +
		anchoMax / 2 -
		(medidasHz.dhp + medidasHz.seppecho) -
		(refx + anchoMax / 2 - (cajaCue + desplinEsternon) - (Math.cos(angHombro) * medidasVr.hombro) / 2)) /
		(refy -
			altPnz -
			(refy - (medidasVr.costadillo + medidasVr.dvp + subPtaHomEsp) + (Math.sin(angHombro) * medidasVr.hombro) / 2))
);
console.log('angPnzSupV ' + angPnzSupV);
console.log('angPnzSupV grados ' + angPnzSupV * (180 / Math.PI));

// Con este ángulo angPnzSupV podemos calcular el tamaño de la recta que une el punto de la mitad del hombro con el pezon
let linPnz =
	-(
		refy -
		(medidasVr.costadillo + medidasVr.dvp + subPtaHomEsp) +
		(Math.sin(angHombro) * medidasVr.hombro) / 2 -
		(refy - altPnz)
	) / Math.cos(angPnzSupV); //! Salia negativo al calcularlo y para corregir un signo menos delante REVISAR!!!
console.log('linPnz ' + linPnz);

// Calculo el angulo (angPnzSupV + angPnz)= angPnzInfV que es el angulo de la linea de pinza inferior con la vertical
let angPnzInfV = Math.tan(
	(refx +
		anchoMax / 2 -
		(medidasHz.dhp + medidasHz.seppecho) -
		(refx + anchoMax / 2 - (cajaCue + desplinEsternon) - (Math.cos(angHombro) * medidasVr.hombro) / 2) + //añadido 2 * medidasHz.dhp
		2 * medidasHz.dhp) /
		(refy -
			altPnz -
			(refy - (medidasVr.costadillo + medidasVr.dvp + subPtaHomEsp) + (Math.sin(angHombro) * medidasVr.hombro) / 2))
);
// console.log(
// 	'a+d ' +
// 		(refx +
// 			anchoMax / 2 -
// 			(medidasHz.dhp + medidasHz.seppecho) -
// 			(refx + anchoMax / 2 - (cajaCue + desplinEsternon) - (Math.cos(angHombro) * medidasVr.hombro) / 2) +
// 			2 * medidasHz.dhp)
// );
console.log('angPnzInfV ' + angPnzInfV);
console.log('angPnzInfV grados ' + angPnzInfV * (180 / Math.PI));

// El valor (angulo) de apertura de la pinza entonces sera
let angPnz = angPnzInfV - angPnzSupV;
console.log('angPnz ' + angPnz);
console.log('angPnz grados ' + angPnz * (180 / Math.PI));

// -----------------------
// -----------------------

//* Establezco una escala de transformación para todos los elementos svg para poder trabajar con las unidades en cm y se visualicen en puntos (pt) en la pantalla*//
const scale = 28.34645669; //28.34645669 pt = 1cm con pt como unidad por defecto para svg  1cm = 35.43307 pixels
//TODO Diferencia entre pixel CSS y pixel fisico (tamaño pantalla x ejem) el DPR (Device Pixel Ratio) DPR = pixel fisico/pixel css

// -----------------------
// -----------------------