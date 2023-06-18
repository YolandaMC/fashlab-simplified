'use strict';

//* DEFINO Y SELECCIONO EL ELEMENTO DEL DOM PARA GENERAR EL SVG *//
// Tomo el elemento svg del html
let svg = document.querySelector('.svg-manupulation');
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

// -----------------------
// -----------------------

//* SELECCIONAMOS LOS ELEMENTOS DEL FORMULARIO PARA CAPTURAR LAS MEDIDAS QUE SE ESTEN INTRODUCIENDO*//
// MEDIDAS HORIZONTALES
const medidaPecho = document.querySelector('input[type=range][name=pecho]'); //getElementById
const medidaCintura = document.querySelector('input[type=range][name=cintura]');
const medidaCadera = document.querySelector('input[type=range][name=cadera]');
const medidaEspalda = document.querySelector('input[type=range][name=espalda]');
const medidaSeppecho = document.querySelector('input[type=range][name=seppecho]');
const medidaCuello = document.querySelector('input[type=range][name=cuello]');
const medidaHombro = document.querySelector('input[type=range][name=hombro]');

// MEDIDAS HORIZONTALES
const medidaEstatura = document.querySelector('input[type=range][name=estatura]');
const medidaLargEsp = document.querySelector('input[type=range][name=largespalda]');
const medidaLargDel = document.querySelector('input[type=range][name=largdelantero]');
const medidaCostadillo = document.querySelector('input[type=range][name=costadillo]');
const medidaPierna = document.querySelector('input[type=range][name=pierna]');
const medidaEntrepierna = document.querySelector('input[type=range][name=entrepierna]');
const medidaBrazo = document.querySelector('input[type=range][name=brazo]');

// -----------------------
// -----------------------

//TODO ESTOS DOS OBJETOS CON LAS MEDIDAS ES LO UNICO QUE DEBES APORTAR PAR QUE SE GENERE EL PATRON
// Definimos las constantes que vamos a utilizar

//* MEDIDAS VERTICALES*//
// const medidasVr = {
// 	cuello: medidaCuello.value,
// 	hombro: medidaHombro.value,
// 	estatura: medidaEstatura.value,
// 	largespalda: medidaLargEsp.value,
// 	largdelantero: medidaLargDel.value,
// 	costadillo: medidaCostadillo.value,
// 	pierna: medidaPierna.value,
// 	entrepierna: medidaEntrepierna.value,
// 	brazo: medidaBrazo.value,
// };

// console.log('medidasVr' + medidasVr);

//* MEDIDAS HORIZONTALES*//
// const medidasHz = {
// 	pecho: medidaPecho.value,
// 	cintura: medidaCintura.value,
// 	cadera: medidaCadera.value,
// 	espalda: medidaEspalda.value,
// 	seppecho: medidaSeppecho.value,
// };

// -----------------------
// -----------------------

//* INICIALIZAMOS EL PATRON CON UNAS MEDIDAS
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
dibujarSVG();
// -----------------------

//TODO Incluyo todo dentro de mi función dibujarSVG para que a cada cambio de slider recalcule y redibuje todo

function dibujarSVG() {
	//!
	// Eliminar todos los elementos hijos del SVG en cada llamada a la función, es decir en cada cambio de slider
	while (svg.firstChild) {
		svg.firstChild.remove();
	}
	//!

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
	} else if (
		medidasHz.cintura + hCin > medidasHz.pecho + hPecho &&
		medidasHz.cintura + hCin >= medidasHz.cadera + hCad
	) {
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

	// -----------------------
	// -----------------------

	//* --- Función que crea un marco delimitador para el patrón del tamaño del viewBox del SVG  --- *//
	function crearMarcoDelimi() {
		// Genero un grupo donde se inscribira marco delimitador de patrón
		let gMarcoDelimi = document.createElementNS(SVG_NS, 'g');
		// Incluimos la transformación de escala para pasar de centimetros a pt
		gMarcoDelimi.setAttributeNS(null, 'transform', 'scale(' + scale + ')'); // grupMarcoDelimi.setAttributeNS(null, 'transform', 'scale('+`${scale}`+')');
		gMarcoDelimi.setAttributeNS(null, 'stroke', '#d0d0d0');
		gMarcoDelimi.setAttributeNS(null, 'stroke-width', '0.3');
		gMarcoDelimi.setAttributeNS(null, 'fill', 'white');
		//!
		//svg.appendChild(gMarcoDelimi); // lo voy a sacar fuera de la función y pongo un return gMarcoDelimi
		//!

		// Genero un marco delimitador donde se inscribira mi patrón
		let marcoDelimi = document.createElementNS(SVG_NS, 'rect');
		marcoDelimi.setAttributeNS(null, 'x', -50);
		marcoDelimi.setAttributeNS(null, 'y', -50);
		marcoDelimi.setAttributeNS(null, 'rx', '1.5');
		marcoDelimi.setAttributeNS(null, 'ry', '1.5');
		marcoDelimi.setAttributeNS(null, 'width', 100);
		marcoDelimi.setAttributeNS(null, 'height', 100);
		gMarcoDelimi.appendChild(marcoDelimi);

		//!
		return gMarcoDelimi;
	}

	// -----------------------
	// -----------------------

	//* ----- Función que crea las líneas de construcción del patrón ----- *//

	// -----------------------

	function auxConstruc() {
		// Genero un grupo donde se inscribira las líneas de construcción
		let gConstruc = document.createElementNS(SVG_NS, 'g');
		// Incluimos la transformación de escala para pasar de centimetros a pt
		gConstruc.setAttributeNS(null, 'transform', 'scale(' + scale + ')');
		// Coloco los atributos de estilo para todos los elementos del grupo
		gConstruc.setAttributeNS(null, 'stroke', '#878787'); //#65c1c2 //#878787 //#d0d0d0
		gConstruc.setAttributeNS(null, 'stroke-width', '0.1');
		gConstruc.setAttributeNS(null, 'fill', 'none');
		//!
		//svg.appendChild(gConstruc); // lo voy a sacar fuera de la función y pongo un return gConstruc
		//!

		// -----------------------

		//* Creo un rectangulo que inscribe la espalda superior
		let rectEspSup = document.createElementNS(SVG_NS, 'rect');
		rectEspSup.setAttributeNS(null, 'x', refx - anchoMax / 2); // rectEspSup.setAttributeNS(null, 'x', refx + '-' + anchoMax / 2);
		rectEspSup.setAttributeNS(null, 'y', refy - medidasVr.largespalda); // rectEspSup.setAttributeNS(null, 'y', '-' + medidasVr.largespalda);
		rectEspSup.setAttributeNS(null, 'width', anchoEspCos); //3/8Tespalda+holguraespalda+1/8T+1/2holguracostado correspondiente sólo a medio costado. anchoEspCos = (4 / 8) * medidasHz.torax + (3 / 2) * holgura
		rectEspSup.setAttributeNS(null, 'height', medidasVr.largespalda);
		gConstruc.appendChild(rectEspSup);

		//* Creo un rectangulo que inscribe el delantero superior
		let rectDelSup = document.createElementNS(SVG_NS, 'rect');
		rectDelSup.setAttributeNS(null, 'x', refx + anchoMax / 2 - anchoDelCos); // anchoDelCos = anchoEspCos + medidasHz.dhp = (4 / 8) * medidasHz.torax + (3 / 2) * holgura + medidasHz.dhp
		rectDelSup.setAttributeNS(null, 'y', refy - medidasVr.largdelantero);
		rectDelSup.setAttributeNS(null, 'width', anchoDelCos); //3/8Tespalda+holguraespalda+1/8T+1/2holguracostado correspondiente sólo a medio costado
		rectDelSup.setAttributeNS(null, 'height', medidasVr.largdelantero);
		gConstruc.appendChild(rectDelSup);

		//* Creo un rectangulo que inscribe la espalda inferior
		let rectEspInf = document.createElementNS(SVG_NS, 'rect');
		rectEspInf.setAttributeNS(null, 'x', refx - anchoMax / 2);
		rectEspInf.setAttributeNS(null, 'y', refy);
		rectEspInf.setAttributeNS(null, 'width', medidasHz.cadera / 2); //medidas.cadera + hCad
		rectEspInf.setAttributeNS(null, 'height', medidasVr.largcadera);
		gConstruc.appendChild(rectEspInf);

		//* Creo un rectangulo que inscribe el delantero inferior
		let rectDelInf = document.createElementNS(SVG_NS, 'rect');
		rectDelInf.setAttributeNS(null, 'x', refx + anchoMax / 2 - (medidasHz.cadera / 2 + hCad));
		rectDelInf.setAttributeNS(null, 'y', refy);
		rectDelInf.setAttributeNS(null, 'width', medidasHz.cadera / 2 + hCad);
		rectDelInf.setAttributeNS(null, 'height', medidasVr.largcadera);
		gConstruc.appendChild(rectDelInf);
		// -----------------------

		// -----------------------
		//* Creo línea de sisa
		let linSisa = document.createElementNS(SVG_NS, 'line');
		linSisa.setAttributeNS(null, 'x1', refx - anchoMax / 2);
		linSisa.setAttributeNS(null, 'y1', refy - altSisa); // altSisa = medidasVr.largespalda / 2
		linSisa.setAttributeNS(null, 'x2', refx + anchoMax / 2);
		linSisa.setAttributeNS(null, 'y2', refy - altSisa);
		gConstruc.appendChild(linSisa);

		//* Creo línea de espalda
		let linEspHz = document.createElementNS(SVG_NS, 'line');
		linEspHz.setAttributeNS(null, 'x1', refx - anchoMax / 2);
		linEspHz.setAttributeNS(null, 'y1', refy - altEspalda); // altEspalda = (3 / 4) * medidasVr.largespalda
		linEspHz.setAttributeNS(null, 'x2', refx - anchoMax / 2 + medidasHz.espalda);
		linEspHz.setAttributeNS(null, 'y2', refy - altEspalda);
		gConstruc.appendChild(linEspHz);

		//* Creo línea de costadillo espalda
		let linCostaEsp = document.createElementNS(SVG_NS, 'line');
		linCostaEsp.setAttributeNS(null, 'x1', refx - anchoMax / 2 + anchoEsp); // anchoEsp = (3 / 8) * medidasHz.torax + holgura
		linCostaEsp.setAttributeNS(null, 'y1', refy);
		linCostaEsp.setAttributeNS(null, 'x2', refx - anchoMax / 2 + anchoEsp);
		linCostaEsp.setAttributeNS(null, 'y2', refy - medidasVr.largespalda);
		gConstruc.appendChild(linCostaEsp);

		//* Creo línea de lateral espalda
		let linLateralEsp = document.createElementNS(SVG_NS, 'line');
		linLateralEsp.setAttributeNS(null, 'x1', refx - anchoMax / 2 + anchoEsp + anchoCos / 2); // anchoCos = (2 / 8) * medidasHz.torax + holgura
		linLateralEsp.setAttributeNS(null, 'y1', refy);
		linLateralEsp.setAttributeNS(null, 'x2', refx - anchoMax / 2 + anchoEsp + anchoCos / 2);
		linLateralEsp.setAttributeNS(null, 'y2', refy - medidasVr.largespalda);
		gConstruc.appendChild(linLateralEsp);

		//* Creo línea de lateral delantero
		let linLateralDel = document.createElementNS(SVG_NS, 'line');
		linLateralDel.setAttributeNS(null, 'x1', refx + anchoMax / 2 - (anchoDel + anchoCos / 2));
		linLateralDel.setAttributeNS(null, 'y1', refy);
		linLateralDel.setAttributeNS(null, 'x2', refx + anchoMax / 2 - (anchoDel + anchoCos / 2)); //TODO
		linLateralDel.setAttributeNS(null, 'y2', refy - medidasVr.largdelantero);
		gConstruc.appendChild(linLateralDel);

		//* Creo línea de costadillo delantero
		let linCostaDel = document.createElementNS(SVG_NS, 'line');
		linCostaDel.setAttributeNS(null, 'x1', refx + anchoMax / 2 - anchoDel); // anchoDel = (3 / 8) * medidasHz.torax + holgura + medidasHz.dhp;
		linCostaDel.setAttributeNS(null, 'y1', refy);
		linCostaDel.setAttributeNS(null, 'x2', refx + anchoMax / 2 - anchoDel);
		linCostaDel.setAttributeNS(null, 'y2', refy - medidasVr.largdelantero);
		gConstruc.appendChild(linCostaDel);

		//* Creo línea torax delantero
		let linToxDelAux = document.createElementNS(SVG_NS, 'line');
		linToxDelAux.setAttributeNS(null, 'x1', refx + anchoMax / 2 - medidasHz.dhp);
		linToxDelAux.setAttributeNS(null, 'y1', refy);
		linToxDelAux.setAttributeNS(null, 'x2', refx + anchoMax / 2 - medidasHz.dhp);
		linToxDelAux.setAttributeNS(null, 'y2', refy - medidasVr.largdelantero);
		gConstruc.appendChild(linToxDelAux);

		//* Creo línea esternón
		let linEsternon = document.createElementNS(SVG_NS, 'line');
		linEsternon.setAttributeNS(null, 'x1', refx + anchoMax / 2);
		linEsternon.setAttributeNS(null, 'y1', refy - medidasVr.largespalda / 2);
		linEsternon.setAttributeNS(null, 'x2', refx + anchoMax / 2 - desplinEsternon);
		linEsternon.setAttributeNS(null, 'y2', refy - medidasVr.largdelantero);
		gConstruc.appendChild(linEsternon);

		// -----------------------

		//* Creo línea separación pecho
		let linSepPecho = document.createElementNS(SVG_NS, 'line');
		linSepPecho.setAttributeNS(null, 'x1', refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho));
		linSepPecho.setAttributeNS(null, 'y1', refy);
		linSepPecho.setAttributeNS(null, 'x2', refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho));
		linSepPecho.setAttributeNS(null, 'y2', refy - medidasVr.largdelantero);
		linSepPecho.setAttributeNS(null, 'stroke-dasharray', '.1 .3');
		linSepPecho.setAttributeNS(null, 'stroke-width', '.1');
		linSepPecho.setAttributeNS(null, 'stroke-linecap', 'round');
		gConstruc.appendChild(linSepPecho);

		let linSepPIzq = document.createElementNS(SVG_NS, 'line');
		linSepPIzq.setAttributeNS(
			null,
			'x1',
			refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho) - medidasHz.dhp / 2
		);
		linSepPIzq.setAttributeNS(null, 'y1', refy);
		linSepPIzq.setAttributeNS(
			null,
			'x2',
			refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho) - medidasHz.dhp / 2
		);
		linSepPIzq.setAttributeNS(null, 'y2', refy - medidasVr.largdelantero);
		gConstruc.appendChild(linSepPIzq);

		let linSepPDer = document.createElementNS(SVG_NS, 'line');
		linSepPDer.setAttributeNS(
			null,
			'x1',
			refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho) + medidasHz.dhp / 2
		);
		linSepPDer.setAttributeNS(null, 'y1', refy);
		linSepPDer.setAttributeNS(
			null,
			'x2',
			refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho) + medidasHz.dhp / 2
		);
		linSepPDer.setAttributeNS(null, 'y2', refy - medidasVr.largdelantero);
		gConstruc.appendChild(linSepPDer);

		// -----------------------

		//* Creo línea caja cuello detrás
		let linCueEsp = document.createElementNS(SVG_NS, 'line');
		linCueEsp.setAttributeNS(null, 'x1', refx - anchoMax / 2 + cajaCue); //let cajaCue = medidasHz.pecho / 8;
		linCueEsp.setAttributeNS(null, 'y1', refy - medidasVr.largespalda);
		linCueEsp.setAttributeNS(null, 'x2', refx - anchoMax / 2 + cajaCue);
		linCueEsp.setAttributeNS(null, 'y2', refy - ptaHomEsp); // 1/4 de caja cuello = ptaHomEsp = cajaCue/4= (P/8)/4. Medida/proporción arbitraria
		linCueEsp.setAttributeNS(null, 'stroke-dasharray', '.1 .3');
		linCueEsp.setAttributeNS(null, 'stroke-width', '.1');
		linCueEsp.setAttributeNS(null, 'stroke-linecap', 'round');
		gConstruc.appendChild(linCueEsp);

		//* Creo línea aux caja cuello detrás con costadillo espalda
		let linAuxCueEsp = document.createElementNS(SVG_NS, 'line');
		linAuxCueEsp.setAttributeNS(null, 'x1', refx - anchoMax / 2 + cajaCue);
		linAuxCueEsp.setAttributeNS(null, 'y1', refy - ptaHomEsp);
		linAuxCueEsp.setAttributeNS(null, 'x2', refx - anchoMax / 2 + anchoEsp);
		linAuxCueEsp.setAttributeNS(null, 'y2', refy - ptaHomEsp);
		linAuxCueEsp.setAttributeNS(null, 'stroke-dasharray', '.1 .3');
		linAuxCueEsp.setAttributeNS(null, 'stroke-width', '.1');
		linAuxCueEsp.setAttributeNS(null, 'stroke-linecap', 'round');
		gConstruc.appendChild(linAuxCueEsp);

		//* Creo línea aux2 caja cuello detrás con costadillo espalda
		let linAuxCosEsp = document.createElementNS(SVG_NS, 'line');
		linAuxCosEsp.setAttributeNS(null, 'x1', refx - anchoMax / 2 + anchoEsp);
		linAuxCosEsp.setAttributeNS(null, 'y1', refy - ptaHomEsp);
		linAuxCosEsp.setAttributeNS(null, 'x2', refx - anchoMax / 2 + anchoEsp);
		linAuxCosEsp.setAttributeNS(null, 'y2', refy - medidasVr.largespalda);
		linAuxCosEsp.setAttributeNS(null, 'stroke-dasharray', '.1 .3');
		linAuxCosEsp.setAttributeNS(null, 'stroke-width', '.1');
		linAuxCosEsp.setAttributeNS(null, 'stroke-linecap', 'round');
		gConstruc.appendChild(linAuxCosEsp);

		// -----------------------

		//* Creo línea aux caja cuello delante con hombro delantero
		let linAuxCajDelV = document.createElementNS(SVG_NS, 'line');
		linAuxCajDelV.setAttributeNS(null, 'x1', refx + anchoMax / 2 - (cajaCue + desplinEsternon));
		linAuxCajDelV.setAttributeNS(null, 'y1', refy - medidasVr.largdelantero);
		linAuxCajDelV.setAttributeNS(null, 'x2', refx + anchoMax / 2 - (cajaCue + desplinEsternon));
		linAuxCajDelV.setAttributeNS(null, 'y2', refy - medidasVr.largdelantero + cajaCue);
		linAuxCajDelV.setAttributeNS(null, 'stroke-dasharray', '.1 .3');
		linAuxCajDelV.setAttributeNS(null, 'stroke-width', '.1');
		linAuxCajDelV.setAttributeNS(null, 'stroke-linecap', 'round');
		gConstruc.appendChild(linAuxCajDelV);

		//* Creo línea aux2 caja cuello delante con centro delantero
		let linAuxCajDelH = document.createElementNS(SVG_NS, 'line');
		linAuxCajDelH.setAttributeNS(null, 'x1', refx + anchoMax / 2 - (cajaCue + desplinEsternon));
		linAuxCajDelH.setAttributeNS(null, 'y1', refy - medidasVr.largdelantero + cajaCue);
		linAuxCajDelH.setAttributeNS(null, 'x2', refx + anchoMax / 2 - desplinEsternonCaj); //la caja de cuello sólo debe llegar hasta la linea de esternon
		linAuxCajDelH.setAttributeNS(null, 'y2', refy - medidasVr.largdelantero + cajaCue);
		linAuxCajDelH.setAttributeNS(null, 'stroke-dasharray', '.1 .3');
		linAuxCajDelH.setAttributeNS(null, 'stroke-width', '.1');
		linAuxCajDelH.setAttributeNS(null, 'stroke-linecap', 'round');
		gConstruc.appendChild(linAuxCajDelH);

		// -----------------------

		// //* Creo línea caída/punta de hombro espalda en función de las proporciones de torax (va a usarse la medida de costadillo)
		// let linCaiHomEsp = document.createElementNS(SVG_NS, 'line');
		// linCaiHomEsp.setAttributeNS(null, 'x1', refx - anchoMax / 2 + medidasHz.pecho / 8);
		// linCaiHomEsp.setAttributeNS(null, 'y1', refy - (medidasVr.largespalda + medidasHz.pecho / 32));
		// linCaiHomEsp.setAttributeNS(null, 'x2', refx - anchoMax / 2 + (3 / 8) * medidasHz.torax + holgura);
		// linCaiHomEsp.setAttributeNS(null, 'y2', refy - (medidasVr.largespalda + medidasHz.pecho / 32) + medidasHz.torax / 8);
		// linAuxCosEsp.setAttributeNS(null, 'stroke-dasharray', '.1 .3');
		// linAuxCosEsp.setAttributeNS(null, 'stroke-width', '.1');
		// linAuxCosEsp.setAttributeNS(null, 'stroke-linecap', 'round');
		// gConstruc.appendChild(linCaiHomEsp);

		//* Creo de hombro espalda en función de las proporciones de torax (va a usarse la medida de costadillo)
		// Calculo el ángulo de caida de hombro para poder colocar la medida de hombro indicada por el usuario
		// let angHombro = Math.atan(medidasHz.torax / 8 / ((3 / 8) * medidasHz.torax + holgura - medidasHz.pecho / 8));
		// let linHomEsp = document.createElementNS(SVG_NS, 'line');
		// linHomEsp.setAttributeNS(null, 'x1', refx - anchoMax / 2 + medidasHz.pecho / 8);
		// linHomEsp.setAttributeNS(null, 'y1', refy - (medidasVr.largespalda + medidasHz.pecho / 32));
		// linHomEsp.setAttributeNS(
		// 	null,
		// 	'x2',
		// 	refx - anchoMax / 2 + medidasHz.pecho / 8 + Math.cos(angHombro) * medidasVr.hombro
		// );
		// linHomEsp.setAttributeNS(
		// 	null,
		// 	'y2',
		// 	refy - (medidasVr.largespalda + medidasHz.pecho / 32) + Math.sin(angHombro) * medidasVr.hombro
		// );
		// gConstruc.appendChild(linHomEsp);

		//* Creo línea caída/punta de hombro espalda con la medida de costadillo
		let linCaiHomEsp = document.createElementNS(SVG_NS, 'line');
		linCaiHomEsp.setAttributeNS(null, 'x1', refx - anchoMax / 2 + cajaCue);
		linCaiHomEsp.setAttributeNS(null, 'y1', refy - ptaHomEsp);
		linCaiHomEsp.setAttributeNS(null, 'x2', refx - anchoMax / 2 + anchoEsp);
		linCaiHomEsp.setAttributeNS(null, 'y2', refy - medidasVr.costadillo);
		linCaiHomEsp.setAttributeNS(null, 'stroke-dasharray', '.1 .3');
		linCaiHomEsp.setAttributeNS(null, 'stroke-width', '.1');
		linCaiHomEsp.setAttributeNS(null, 'stroke-linecap', 'round');
		gConstruc.appendChild(linCaiHomEsp);

		//* Creo línea hombro espalda con la medida de costadillo
		let linHomEsp = document.createElementNS(SVG_NS, 'line');
		linHomEsp.setAttributeNS(null, 'x1', refx - anchoMax / 2 + cajaCue);
		linHomEsp.setAttributeNS(null, 'y1', refy - ptaHomEsp);
		linHomEsp.setAttributeNS(null, 'x2', refx - anchoMax / 2 + cajaCue + Math.cos(angHombro) * medidasVr.hombro);
		linHomEsp.setAttributeNS(null, 'y2', refy - ptaHomEsp + Math.sin(angHombro) * medidasVr.hombro);
		gConstruc.appendChild(linHomEsp);

		// -----------------------

		//* Creo línea auxiliar caída/punta de hombro delantero
		let linCaiHomDel = document.createElementNS(SVG_NS, 'line');
		linCaiHomDel.setAttributeNS(null, 'x1', refx + anchoMax / 2 - (cajaCue + desplinEsternon));
		linCaiHomDel.setAttributeNS(null, 'y1', refy - medidasVr.largdelantero);
		linCaiHomDel.setAttributeNS(
			null,
			'x2',
			refx + anchoMax / 2 - (cajaCue + desplinEsternon) - Math.cos(angHombro) * medidasVr.hombro
		);
		linCaiHomDel.setAttributeNS(
			null,
			'y2',
			refy - (medidasVr.costadillo + medidasVr.dvp + subPtaHomEsp) + Math.sin(angHombro) * medidasVr.hombro
		); //+ medidasVr.dvp + (subPtaHomEsp = medidasHz.pecho / 32) = diferencia de largo del patrón delantero y la espalda desde la punta de hombro de ambos
		linCaiHomDel.setAttributeNS(null, 'stroke-dasharray', '.1 .3');
		linCaiHomDel.setAttributeNS(null, 'stroke-width', '.1');
		linCaiHomDel.setAttributeNS(null, 'stroke-linecap', 'round');
		gConstruc.appendChild(linCaiHomDel);

		//* Creo línea hombro delantero hasta pinza con la medida de costadillo
		// tomo el angulo de inclinación de la espalda
		let linHomDelSup = document.createElementNS(SVG_NS, 'line');
		linHomDelSup.setAttributeNS(null, 'x1', refx + anchoMax / 2 - (cajaCue + desplinEsternon));
		linHomDelSup.setAttributeNS(null, 'y1', refy - medidasVr.largdelantero);
		linHomDelSup.setAttributeNS(
			null,
			'x2',
			refx + anchoMax / 2 - (cajaCue + desplinEsternon) - (Math.cos(angHombro) * medidasVr.hombro) / 2
		);
		linHomDelSup.setAttributeNS(
			null,
			'y2',
			refy - (medidasVr.costadillo + medidasVr.dvp + subPtaHomEsp) + (Math.sin(angHombro) * medidasVr.hombro) / 2
		); //refy - (medidasVr.costadillo + medidasVr.dvp - medidasHz.pecho / 32) + Math.sin(angHombro) * medidasVr.hombro
		gConstruc.appendChild(linHomDelSup);

		//* Creo línea superior pinza hombro con pezon
		let linPnzHomSup = document.createElementNS(SVG_NS, 'line');
		linPnzHomSup.setAttributeNS(
			null,
			'x1',
			refx + anchoMax / 2 - (cajaCue + desplinEsternon) - (Math.cos(angHombro) * medidasVr.hombro) / 2
		);
		linPnzHomSup.setAttributeNS(
			null,
			'y1',
			refy - (medidasVr.costadillo + medidasVr.dvp + subPtaHomEsp) + (Math.sin(angHombro) * medidasVr.hombro) / 2
		);
		linPnzHomSup.setAttributeNS(null, 'x2', refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho));
		linPnzHomSup.setAttributeNS(null, 'y2', refy - altPnz); // altura del pezon. Es una medida arbitraria que lo situa a 2.5 por debajo de la linea de sisa
		gConstruc.appendChild(linPnzHomSup);

		//* Creo línea apertura pinza pecho REVISAR
		// let linApertPnz = document.createElementNS(SVG_NS, 'line');
		// linApertPnz.setAttributeNS(
		// 	null,
		// 	'x1',
		// 	refx + anchoMax / 2 - (cajaCue + desplinEsternon) - (Math.cos(angHombro) * medidasVr.hombro) / 2
		// ); //!
		// linApertPnz.setAttributeNS(
		// 	null,
		// 	'y1',
		// 	refy - (medidasVr.costadillo + medidasVr.dvp + subPtaHomEsp) + (Math.sin(angHombro) * medidasVr.hombro) / 2
		// ); //!
		// linApertPnz.setAttributeNS(
		// 	null,
		// 	'x2',
		// 	refx + anchoMax / 2 - (cajaCue + desplinEsternon) - (Math.cos(angHombro) * medidasVr.hombro) / 2 - 2 * medidasHz.dhp
		// );
		// linApertPnz.setAttributeNS(
		// 	null,
		// 	'y2',
		// 	refy - (medidasVr.costadillo + medidasVr.dvp + subPtaHomEsp) + (Math.sin(angHombro) * medidasVr.hombro) / 2
		// );
		// linApertPnz.setAttributeNS(null, 'stroke-dasharray', '.1 .3');
		// linApertPnz.setAttributeNS(null, 'stroke-width', '.1');
		// linApertPnz.setAttributeNS(null, 'stroke-linecap', 'round');
		// gConstruc.appendChild(linApertPnz);

		//* Creo línea mitad de pinza pecho REVISAR
		// let linPnzHomMid = document.createElementNS(SVG_NS, 'line');
		// linPnzHomMid.setAttributeNS(
		// 	null,
		// 	'x1',
		// 	refx + anchoMax / 2 - (cajaCue + desplinEsternon) - (Math.cos(angHombro) * medidasVr.hombro) / 2 - medidasHz.dhp
		// );
		// linPnzHomMid.setAttributeNS(
		// 	null,
		// 	'y1',
		// 	refy - (medidasVr.costadillo + medidasVr.dvp + subPtaHomEsp) + (Math.sin(angHombro) * medidasVr.hombro) / 2
		// ); //!
		// linPnzHomMid.setAttributeNS(null, 'x2', refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho));
		// linPnzHomMid.setAttributeNS(null, 'y2', refy - altPnz); // altura del pezon. Es una medida arbitraria que lo situa a 2.5 por debajo de la linea de sisa
		// linPnzHomMid.setAttributeNS(null, 'stroke-dasharray', '.1 .3');
		// linPnzHomMid.setAttributeNS(null, 'stroke-width', '.1');
		// linPnzHomMid.setAttributeNS(null, 'stroke-linecap', 'round');
		// gConstruc.appendChild(linPnzHomMid);

		//* Creo línea auxiliar inferior pinza hombro con pezon REVISAR
		// let linAuxPnzHomInf = document.createElementNS(SVG_NS, 'line');
		// linAuxPnzHomInf.setAttributeNS(
		// 	null,
		// 	'x1',
		// 	refx + anchoMax / 2 - (cajaCue + desplinEsternon) - (Math.cos(angHombro) * medidasVr.hombro) / 2 - 2 * medidasHz.dhp
		// );
		// linAuxPnzHomInf.setAttributeNS(
		// 	null,
		// 	'y1',
		// 	refy - (medidasVr.costadillo + medidasVr.dvp + subPtaHomEsp) + (Math.sin(angHombro) * medidasVr.hombro) / 2
		// );
		// linAuxPnzHomInf.setAttributeNS(null, 'x2', refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho));
		// linAuxPnzHomInf.setAttributeNS(null, 'y2', refy - altPnz); // altura del pezon. Es una medida arbitraria que lo situa a 2.5 por debajo de la linea de sisa
		// linAuxPnzHomInf.setAttributeNS(null, 'stroke-dasharray', '.1 .3');
		// linAuxPnzHomInf.setAttributeNS(null, 'stroke-width', '.1');
		// linAuxPnzHomInf.setAttributeNS(null, 'stroke-linecap', 'round');
		// gConstruc.appendChild(linAuxPnzHomInf);

		//* Creo línea inferior pinza hombro con pezon
		let linPnzHomInf = document.createElementNS(SVG_NS, 'line');
		linPnzHomInf.setAttributeNS(
			null,
			'x1',
			refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho + Math.sin(angPnzInfV) * linPnz)
		);
		linPnzHomInf.setAttributeNS(null, 'y1', refy - (altPnz + Math.cos(angPnzInfV) * linPnz));
		linPnzHomInf.setAttributeNS(null, 'x2', refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho));
		linPnzHomInf.setAttributeNS(null, 'y2', refy - altPnz); // altura del pezon. Es una medida arbitraria que lo situa a 2.5 por debajo de la linea de sisa
		gConstruc.appendChild(linPnzHomInf);

		//* Creo línea hombro desde pinza hasta sisa
		let linHomDelInf = document.createElementNS(SVG_NS, 'line');
		linHomDelInf.setAttributeNS(
			null,
			'x1',
			refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho + Math.sin(angPnzInfV) * linPnz)
		);
		linHomDelInf.setAttributeNS(null, 'y1', refy - (altPnz + Math.cos(angPnzInfV) * linPnz));
		linHomDelInf.setAttributeNS(
			null,
			'x2',
			refx +
				anchoMax / 2 -
				(medidasHz.dhp + medidasHz.seppecho + Math.sin(angPnzInfV) * linPnz) -
				(Math.cos(angHombro + angPnz) * medidasVr.hombro) / 2
		);
		linHomDelInf.setAttributeNS(
			null,
			'y2',
			refy - (altPnz + Math.cos(angPnzInfV) * linPnz - (Math.sin(angHombro + angPnz) * medidasVr.hombro) / 2)
		); // altura del pezon. Es una medida arbitraria que lo situa a 2.5 por debajo de la linea de sisa
		gConstruc.appendChild(linHomDelInf);

		// -----------------------
		//!
		return gConstruc;
	}

	// -----------------------

	// -----------------------

	//* ----- Funciones que crean el patron/molde base en el SVG  ----- *//

	// -----------------------

	//* FUNCION QUE ME CREA EL MOLDE O PATRON ESPALDA*//
	function delantero() {
		// Genero un grupo donde se inscribira marco delimitador de patrón
		let gdelantero = document.createElementNS(SVG_NS, 'g');
		// Incluimos la transformación de escala para pasar de centimetros a pt
		gdelantero.setAttributeNS(null, 'transform', 'scale(' + scale + ')'); // grupMarcoDelimi.setAttributeNS(null, 'transform', 'scale('+`${scale}`+')');
		gdelantero.setAttributeNS(null, 'stroke', '#ff0000');
		gdelantero.setAttributeNS(null, 'stroke-width', '0.1');
		gdelantero.setAttributeNS(null, 'fill', '#ff0000');
		gdelantero.setAttributeNS(null, 'fill-opacity', '.4');
		//!
		//svg.appendChild(gdelantero); // lo voy a sacar fuera de la función y pongo un return gdelantero
		//!

		// Genero un marco delimitador donde se inscribira mi patrón
		let delantero = document.createElementNS(SVG_NS, 'path');

		//TODO GUIA PARA CONSTRUIR EL ELEMENTO 'd' DEL PATH DELANTERO
		// ('M',refx + anchoMax / 2, refy) = centro delante con talle
		// ('V', refy - altSisa) = centro delante con línea sisa
		// ('L', refx + anchoMax / 2 - desplinEsternonCaj,  refy - medidasVr.largdelantero + cajaCue) = linea esternon con caja centro delante
		// ('S', refx + anchoMax / 2 - (cajaCue + desplinEsternon), refy - medidasVr.largdelantero + cajaCue, refx + anchoMax / 2 - (cajaCue + desplinEsternon), refy - medidasVr.largdelantero) = Probar Q // caja cuello hasta punta de hombro delante
		// ('L', refx + anchoMax / 2 - (cajaCue + desplinEsternon) - (Math.cos(angHombro) * medidasVr.hombro) / 2,  refy - (medidasVr.costadillo + medidasVr.dvp + subPtaHomEsp) + (Math.sin(angHombro) * medidasVr.hombro) / 2) = linea hombro superior desde punta de hombro hasta pinza
		// ('L', refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho),  refy - altPnz) = linea superior pinza hasta punto pezon
		// ('L', refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho + Math.sin(angPnzInfV) * linPnz), refy - (altPnz + Math.cos(angPnzInfV) * linPnz)) = linea inferior pinza desde punto pezon hasta linea hombro inferior
		// ('L', refx +anchoMax / 2-(medidasHz.dhp + medidasHz.seppecho + Math.sin(angPnzInfV) * linPnz) -(Math.cos(angHombro + angPnz) * medidasVr.hombro) / 2,  refy - (altPnz + Math.cos(angPnzInfV) * linPnz - (Math.sin(angHombro + angPnz) * medidasVr.hombro) / 2)) = linea hombro inferior hasta caida de hombro/sisa
		// ('Q', refx + anchoMax / 2 - anchoDel, refy - altSisa, refx + anchoMax / 2 - (anchoDel + anchoCos / 2), refy - altSisa) = sisa delante desde caida de hombro delantero hasta lateral
		//!REVISAR LINEA DE TALLE
		//! ('L', refx + anchoMax / 2 - (medidasHz.cintura/2 + hCin + entDel + medidasHz.dhp - entLateral), refy) = lateral delantero hasta talle
		// ('T', refx + anchoMax / 2 - (medidasHz.cadera / 2 + hCad), refy + medidasVr.largcadera) = talle lateral delantero hasta lateral cadera delantero
		// ('L', refx + anchoMax / 2, refy + medidasVr.largcadera) = lateral cadera delantero hasta centro delante
		// (null, 'Z') = centro detrás hasta talle / cierra el trazo

		let dPathDelantero =
			'M' +
			(refx + anchoMax / 2) +
			',' +
			refy +
			'V' +
			(refy - altSisa) +
			'L' +
			(refx + anchoMax / 2 - desplinEsternonCaj) +
			',' +
			(refy - medidasVr.largdelantero + cajaCue) +
			'S' +
			(refx + anchoMax / 2 - (cajaCue + desplinEsternon)) +
			',' +
			(refy - medidasVr.largdelantero + cajaCue) +
			',' +
			(refx + anchoMax / 2 - (cajaCue + desplinEsternon)) +
			',' +
			(refy - medidasVr.largdelantero) +
			'L' +
			(refx + anchoMax / 2 - (cajaCue + desplinEsternon) - (Math.cos(angHombro) * medidasVr.hombro) / 2) +
			',' +
			(refy - (medidasVr.costadillo + medidasVr.dvp + subPtaHomEsp) + (Math.sin(angHombro) * medidasVr.hombro) / 2) +
			'L' +
			(refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho)) +
			',' +
			(refy - altPnz) +
			'L' +
			(refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho + Math.sin(angPnzInfV) * linPnz)) +
			',' +
			(refy - (altPnz + Math.cos(angPnzInfV) * linPnz)) +
			'L' +
			(refx +
				anchoMax / 2 -
				(medidasHz.dhp + medidasHz.seppecho + Math.sin(angPnzInfV) * linPnz) -
				(Math.cos(angHombro + angPnz) * medidasVr.hombro) / 2) +
			',' +
			(refy - (altPnz + Math.cos(angPnzInfV) * linPnz - (Math.sin(angHombro + angPnz) * medidasVr.hombro) / 2)) +
			'Q' +
			(refx + anchoMax / 2 - anchoDel) +
			',' +
			(refy - altSisa) +
			',' +
			(refx + anchoMax / 2 - (anchoDel + anchoCos / 2)) +
			',' +
			(refy - altSisa) +
			'L' +
			(refx + anchoMax / 2 - (medidasHz.cintura / 2 + hCin + entDel + medidasHz.dhp - entLateral)) + //!(anchoDel + anchoCos / 2)
			',' +
			refy +
			'T' +
			(refx + anchoMax / 2 - (medidasHz.cadera / 2 + hCad)) +
			',' +
			(refy + medidasVr.largcadera) +
			'L' +
			(refx + anchoMax / 2) +
			',' +
			(refy + medidasVr.largcadera) +
			'Z';

		/* SE CREA EL ELEMENTO 'd' QUE CONFIGURA EL PATH */
		delantero.setAttributeNS(null, 'd', dPathDelantero);
		gdelantero.appendChild(delantero);

		//!
		return gdelantero;
	}

	// -----------------------
	// -----------------------

	//* FUNCION QUE ME CREA EL MOLDE O PATRON DELANTERO*//
	function espalda() {
		// Genero un grupo donde se inscribira marco delimitador de patrón
		let gespalda = document.createElementNS(SVG_NS, 'g');
		// Incluimos la transformación de escala para pasar de centimetros a pt
		gespalda.setAttributeNS(null, 'transform', 'scale(' + scale + ')'); // grupMarcoDelimi.setAttributeNS(null, 'transform', 'scale('+`${scale}`+')');
		gespalda.setAttributeNS(null, 'stroke', '#ff0000');
		gespalda.setAttributeNS(null, 'stroke-width', '0.1');
		gespalda.setAttributeNS(null, 'fill', '#ff0000');
		gespalda.setAttributeNS(null, 'fill-opacity', '.4');

		// Genero el path que formará mi molde espalda
		let espalda = document.createElementNS(SVG_NS, 'path');

		//TODO GUIA PARA CONSTRUIR EL ELEMENTO 'd' DEL PATH ESPALDA
		// ('M', refx - anchoMax / 2, refy) = centro espalda con talle
		// ('V', refy - medidasVr.largespalda) = centro caja cuello detras
		// ('S', refx - (anchoMax / 2 - cajaCue), refy - medidasVr.largespalda,refx - (anchoMax / 2 - cajaCue),refy - ptaHomEsp) = Probar Q // caja cuello hasta punta de hombro detras
		// ('L', refx - anchoMax / 2 + cajaCue + Math.cos(angHombro) * medidasVr.hombro,  refy - ptaHomEsp + Math.sin(angHombro) * medidasVr.hombro) = caida hombro detras
		// ('T', refx - anchoMax / 2 + medidasHz.espalda, refy - altEspalda) = sisa detras hasta ancho espalda
		// ('Q', refx - anchoMax / 2 + anchoEsp, refy - altSisa,refx - anchoMax / 2 + anchoEsp + anchoCos / 2,refy - altSisa) = sisa detras desde pto ancho espalda hasta lateral
		//!REVISAR LINEA DE TALLE
		// ('L', refx - anchoMax / 2 + (medidasHz.cintura/2 + hCin + entCentEsp + entCostEsp - entLateral), refy) = lateral hasta talle
		// ('T', refx - anchoMax / 2 + medidasHz.cadera / 2, refy + medidasVr.largcadera) = talle lateral espalda hasta lateral cadera espalda
		// ('L', refx - anchoMax / 2, refy + medidasVr.largcadera) = lateral cadera espalda  hasta centro detrás
		// (null, 'Z') = centro detrás hasta talle / cierra el trazo

		let dPathEspalda =
			'M' +
			(refx - anchoMax / 2) +
			',' +
			refy +
			'V' +
			(refy - medidasVr.largespalda) +
			'Q' +
			(refx - (anchoMax / 2 - cajaCue)) +
			',' +
			(refy - medidasVr.largespalda) +
			',' +
			(refx - (anchoMax / 2 - cajaCue)) +
			',' +
			(refy - ptaHomEsp) +
			'L' +
			(refx - anchoMax / 2 + cajaCue + Math.cos(angHombro) * medidasVr.hombro) +
			',' +
			(refy - ptaHomEsp + Math.sin(angHombro) * medidasVr.hombro) +
			'T' +
			(refx - anchoMax / 2 + medidasHz.espalda) +
			',' +
			(refy - altEspalda) +
			'Q' +
			(refx - anchoMax / 2 + anchoEsp) +
			',' +
			(refy - altSisa) +
			',' +
			(refx - anchoMax / 2 + anchoEsp + anchoCos / 2) +
			',' +
			(refy - altSisa) +
			'L' +
			(refx - anchoMax / 2 + (medidasHz.cintura / 2 + hCin + entCentEsp + entCostEsp - entLateral)) + //! (anchoEsp + anchoCos / 2)
			',' +
			refy +
			'T' +
			(refx - anchoMax / 2 + medidasHz.cadera / 2) +
			',' +
			(refy + medidasVr.largcadera) +
			'L' +
			(refx - anchoMax / 2) +
			',' +
			(refy + medidasVr.largcadera) +
			'Z';

		/* SE CREA EL ELEMENTO 'd' QUE CONFIGURA EL PATH */
		espalda.setAttributeNS(null, 'd', dPathEspalda);
		gespalda.appendChild(espalda);
		//!
		//svg.appendChild(gespalda); // lo voy a sacar fuera de la función y pongo un return gespalda
		//!
		return gespalda;
	}

	// -----------------------
	// -----------------------

	//* FUNCION QUE ME CREA LOS ENTALLES DE CINTURA DEL MOLDE O PATRON *//
	function entalles() {
		// Genero un grupo donde se inscribira marco delimitador de patrón
		let gEntalles = document.createElementNS(SVG_NS, 'g');
		// Incluimos la transformación de escala para pasar de centimetros a pt
		gEntalles.setAttributeNS(null, 'transform', 'scale(' + scale + ')'); // grupMarcoDelimi.setAttributeNS(null, 'transform', 'scale('+`${scale}`+')');
		gEntalles.setAttributeNS(null, 'stroke', '#00ff00');
		gEntalles.setAttributeNS(null, 'stroke-width', '0.1');
		gEntalles.setAttributeNS(null, 'fill', '#00ff00');
		gEntalles.setAttributeNS(null, 'fill-opacity', '.4');

		//* Genero el path que formara centro mitad de la espalda
		let entCentEspalda = document.createElementNS(SVG_NS, 'path');

		//TODO GUIA PARA CONSTRUIR EL ELEMENTO 'd' DEL PATH ENTALLE CENTRO MITAD ESPALDA + entCentEsp
		// ('M', refx - anchoMax / 2 + anchoEsp/2 - entCentEsp/2, refy) = punto talle hacia centro espalda
		// ('L', refx - anchoMax / 2 + anchoEsp/2, refy - altSisa) = punto centro entalle en linea sisa
		// ('L', refx - anchoMax / 2 + anchoEsp/2 + entCentEsp/2, refy) = punto talle hacia lateral espalda
		// ('L', refx - anchoMax / 2 + anchoEsp/2, refy + medidasVr.largcadera/2) = punto centro entalle en linea petites hanches = medidasVr.largcadera/2

		let dEntCentEspalda =
			'M' +
			(refx - anchoMax / 2 + anchoEsp / 2 - entCentEsp / 2) +
			',' +
			refy +
			'L' +
			(refx - anchoMax / 2 + anchoEsp / 2) +
			',' +
			(refy - altSisa) +
			'L' +
			(refx - anchoMax / 2 + anchoEsp / 2 + entCentEsp / 2) +
			',' +
			refy +
			'L' +
			(refx - anchoMax / 2 + anchoEsp / 2) +
			',' +
			(refy + medidasVr.largcadera / 2) +
			'Z';

		/* SE CREA EL ELEMENTO 'd' QUE CONFIGURA EL PATH */
		entCentEspalda.setAttributeNS(null, 'd', dEntCentEspalda);
		gEntalles.appendChild(entCentEspalda);

		// -----------------------

		//* Genero el path que formara centro mitad de la espalda
		let entCostEspalda = document.createElementNS(SVG_NS, 'path');

		//TODO GUIA PARA CONSTRUIR EL ELEMENTO 'd' DEL PATH ENTALLE COSTADILLO ESPALDA + entCostEsp
		// ('M', refx - anchoMax / 2 + anchoEsp - entCostEsp/2, refy) = punto talle hacia centro espalda
		// ('L', refx - anchoMax / 2 + anchoEsp, refy - altSisa) = punto centro entalle en costadillo y linea sisa
		// ('L', refx - anchoMax / 2 + anchoEsp + entCostEsp/2, refy) = punto talle hacia lateral espalda
		// ('L', refx - anchoMax / 2 + anchoEsp, refy + medidasVr.largcadera) = punto centro entalle en costadillo y linea petites hanches = medidasVr.largcadera/2

		let dEntCostEspalda =
			'M' +
			(refx - anchoMax / 2 + anchoEsp - entCostEsp / 2) +
			',' +
			refy +
			'L' +
			(refx - anchoMax / 2 + anchoEsp) +
			',' +
			(refy - altSisa) +
			'L' +
			(refx - anchoMax / 2 + anchoEsp + entCostEsp / 2) +
			',' +
			refy +
			'L' +
			(refx - anchoMax / 2 + anchoEsp) +
			',' +
			(refy + medidasVr.largcadera / 2) +
			'Z';

		/* SE CREA EL ELEMENTO 'd' QUE CONFIGURA EL PATH */
		entCostEspalda.setAttributeNS(null, 'd', dEntCostEspalda);
		gEntalles.appendChild(entCostEspalda);

		// -----------------------

		//* Genero el path que formara centro mitad de la espalda
		let entDelantero = document.createElementNS(SVG_NS, 'path');

		//TODO GUIA PARA CONSTRUIR EL ELEMENTO 'd' DEL PATH ENTALLE DELANTERO + entDel
		// ('M', refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho) + entDel/2, refy) = punto talle hacia centro delantero
		// ('L', refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho), refy - altPnz) = punto centro entalle en separación pecho y linea sisa
		// ('L', refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho) - entDel/2, refy) = punto talle hacia lateral delantero
		// ('L', refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho), refy + medidasVr.largcadera/2) = punto centro entalle en separación pecho y linea petites hanches = medidasVr.largcadera/2

		let dEntDelantero =
			'M' +
			(refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho) + entDel / 2) +
			',' +
			refy +
			'L' +
			(refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho)) +
			',' +
			(refy - altPnz) +
			'L' +
			(refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho) - entDel / 2) +
			',' +
			refy +
			'L' +
			(refx + anchoMax / 2 - (medidasHz.dhp + medidasHz.seppecho)) +
			',' +
			(refy + medidasVr.largcadera / 2) +
			'Z';

		/* SE CREA EL ELEMENTO 'd' QUE CONFIGURA EL PATH */
		entDelantero.setAttributeNS(null, 'd', dEntDelantero);
		gEntalles.appendChild(entDelantero);

		// -----------------------

		//!
		//svg.appendChild(gEntalles); // lo voy a sacar fuera de la función y pongo un return gespalda
		//!
		return gEntalles;
	}

	// -----------------------
	// -----------------------

	//* FORMACIÓN DEL SVG *//
	// Creamos un marco delimitador para el patrón del tamaño del viewBox del SVG
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
	svg.appendChild(marcoDelimitador);
	svg.appendChild(auxliaresConstruccion);
	svg.appendChild(moldeDelantero);
	svg.appendChild(moldeEspalda);
	svg.appendChild(moldeEntalles);
}

//TODO EVENTO QUE A CADA CAMBIO DE LOS SLIDER LLAMA A LA FUNCIÓN DE DIBUJAR SVG*//

//* MEDIDAS VERTICALES*//
medidaCuello.addEventListener('input', function () {
	//* MEDIDAS VERTICALES*//
	medidasVr.cuello = medidaCuello.value;
	// medidasVr.hombro = medidaHombro.value;
	// medidasVr.estatura = medidaEstatura.value;
	// medidasVr.largespalda = medidaLargEsp.value;
	// medidasVr.largdelantero = medidaLargDel.value;
	// medidasVr.costadillo = medidaCostadillo.value;
	// medidasVr.pierna = medidaPierna.value;
	// medidasVr.entrepierna = medidaEntrepierna.value;
	// medidasVr.brazo = medidaBrazo.value;
	//* MEDIDAS HORIZONTALES*//
	// medidasHz.pecho = medidaPecho.value;
	// medidasHz.cintura = medidaCintura.value;
	// medidasHz.cadera = medidaCadera.value;
	// medidasHz.espalda = medidaEspalda.value;
	// medidasHz.seppecho = medidaSeppecho.value;
	dibujarSVG();
});

medidaHombro.addEventListener('input', function () {
	medidasVr.hombro = medidaHombro.value;
	dibujarSVG();
});

medidaEstatura.addEventListener('input', function () {
	medidasVr.estatura = medidaEstatura.value;
	dibujarSVG();
});

medidaLargEsp.addEventListener('input', function () {
	medidasVr.largespalda = medidaLargEsp.value;
	dibujarSVG();
});

medidaLargDel.addEventListener('input', function () {
	medidasVr.largdelantero = medidaLargDel.value;
	dibujarSVG();
});

medidaCostadillo.addEventListener('input', function () {
	medidasVr.costadillo = medidaCostadillo.value;
	dibujarSVG();
});

medidaPierna.addEventListener('input', function () {
	medidasVr.pierna = medidaPierna.value;
	dibujarSVG();
});

medidaEntrepierna.addEventListener('input', function () {
	medidasVr.entrepierna = medidaEntrepierna.value;
	dibujarSVG();
});

medidaBrazo.addEventListener('input', function () {
	medidasVr.brazo = medidaBrazo.value;
	dibujarSVG();
});

//* MEDIDAS HORIZONTALES*//
medidaPecho.addEventListener('input', function () {
	medidasHz.pecho = medidaPecho.value;
	dibujarSVG();
});

medidaCintura.addEventListener('input', function () {
	medidasHz.cintura = medidaCintura.value;
	dibujarSVG();
});

medidaCadera.addEventListener('input', function () {
	medidasHz.cadera = medidaCadera.value;
	dibujarSVG();
});

medidaEspalda.addEventListener('input', function () {
	medidasHz.espalda = medidaEspalda.value;
	dibujarSVG();
});

medidaSeppecho.addEventListener('input', function () {
	medidasHz.seppecho = medidaSeppecho.value;
	dibujarSVG();
});
