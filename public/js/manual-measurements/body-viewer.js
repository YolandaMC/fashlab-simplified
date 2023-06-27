// ESTA FUNCION ES LLAMADA DESDE datos-formulario.js y se ejecuta tras images-tensorflow.js

'use strict';

//TODO TODO ESTO DEBE IR DENTRO DE UNA FUNCION A LA QUE LLAMES DESDE datos-formulario.js
async function bodyViewer() {
	//* PASO 2: REPRESENTAR LO OBTENIDO EN SVG
	//Elimianmos el mensaje de espera
	const fondo = document.querySelector('.fondo');
	// Cambiamos tamanio fondo
	fondo.style.height = 'auto';
	fondo.style.padding = '30px';
	// Crea un elemento SVG en lugar de los elementos canvas
	const SVG_NS = 'http://www.w3.org/2000/svg';
	const svg = document.createElementNS(SVG_NS, 'svg');
	svg.setAttribute('class', 'body-viewer');
	fondo.appendChild(svg);

	// Establece el tamaño del SVG según las dimensiones de las imágenes
	svg.setAttribute('width', imgFrente.width);
	svg.setAttribute('height', imgFrente.height);

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
	// svg.setAttribute(
	// 	'viewBox',
	// 	svgViewBox.minX + ' ' + svgViewBox.minY + ' ' + svgViewBox.width + ' ' + svgViewBox.height
	// ); // svg.setAttribute('viewBox', `${svgViewBox.minX} ${svgViewBox.minY} ${svgViewBox.width} ${svgViewBox.height}`);

	try {
		// -----------------------

		//* FORMACION SILUETA *//
		// -----------------------
		dibujarSilueta();
		// -----------------------

		//* FORMACION DEL MOLDE *//
		// -----------------------
		dibujarMolde();
		// -----------------------
	} catch (error) {
		console.error('Error en la ejecución del dibujo', error);
	}
}
