'use strict';

//TODO TODO ESTO DEBE IR DENTRO DE UNA FUNCION A LA QUE LLAMES DESDE datos-formulario.js
function bodyViewer() {
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
	svg.setAttribute(
		'viewBox',
		svgViewBox.minX + ' ' + svgViewBox.minY + ' ' + svgViewBox.width + ' ' + svgViewBox.height
	); // svg.setAttribute('viewBox', `${svgViewBox.minX} ${svgViewBox.minY} ${svgViewBox.width} ${svgViewBox.height}`);

	// -----------------------

	// -----------------------

	//* FORMACION DEL MOLDE *//

	// Variables para alojar los grupos que formaran el svg del molde
	let gMarcoDelimi, gConstruc, gdelantero, gespalda, gEntalles;
	// Creamos las líneas de construcción del patrón
	//let marcoDelimitador= crearMarcoDelimi();
	let auxliaresConstruccion = auxConstruc();
	// Creamos el patrón/molde base
	let moldeDelantero = delantero();
	let moldeEspalda = espalda();
	let moldeEntalles = entalles();

	// -----------------------

	//* INCLUIMOS TODOS LOS MÓDULOS DE CONSTRUCCION EN EL SVG BODY-VIEWER *//
	//svg.appendChild(gMarcoDelimi);
	svg.appendChild(gConstruc);
	svg.appendChild(gdelantero);
	svg.appendChild(gespalda);
	svg.appendChild(gEntalles);
}

bodyViewer();
