// ESTA FUNCION ES LLAMADA DESDE body-viewer.js

'use strict';

function dibujarSilueta() {
	//* PASO 2: REPRESENTAR LO OBTENIDO EN SVG
	// Recuperamos svg creado en body.viewer.js
	const svg = document.querySelector('.body-viewer');
	const SVG_NS = 'http://www.w3.org/2000/svg';

	//Calculemos la escala de representacion en función del svg
	//Ratio para mantener la proporción 640x480 pero poder emplear medidas en cm
	const ratio = 640 / 480;
	// Variable que me permite establecer el tamaño del svg
	const svgSize = {
		//medidas en cm
		width: 200 * ratio,
		height: 200,
	};

	//* Establezco una escala de transformación para todos los elementos svg para poder trabajar con las unidades en cm y se visualicen en puntos (pt) en la pantalla*//
	let dpr = window.devicePixelRatio; // Quiza lo debas incluir a la escala //TODO Diferencia entre pixel CSS y pixel fisico (tamaño pantalla x ejem) el DPR (Device Pixel Ratio) DPR = pixel fisico/pixel css
	console.log('dpr', dpr); //https://www.quirksmode.org/blog/archives/2012/06/devicepixelrati.html
	const scale = 28.34645669; //28.34645669 pt = 1cm con pt como unidad por defecto para svg // para las imagenes tomadas desde la webcam 1cm = 35.43307 pixels

	//* Escala silueta
	const escalaSilueta = (svgSize.height * scale) / imgFrente.height;
	console.log('escalaSilueta', escalaSilueta);

	//* Puntos de referencia para situar el dibujo en el centro
	/* Para ello debes recuperar el pto de centro delantero con cadera 
	de la silueta para con el poder situar este patron*/
	const cenDelCad = centroDel.cenDelCad;
	const cenDelCadX = cenDelCad.x;
	const cenDelCadY = cenDelCad.y;
	const cenLatCad = centroLat.cenLatCad;
	const cenLatCadX = cenLatCad.x;
	const bordeLeftCad = bordeHip.borderPointLeftFrente;
	const bordeLeftCadX = bordeLeftCad.x;
	// Referencias
	const refxFrente = -bordeLeftCadX;
	const refxPerfil = -cenLatCadX;
	const refy = -cenDelCadY;

	//*PINTAR SILUETA
	// Recorrer los pixeles de la segmentacionFrente para pintar la máscara en el SVG
	for (let y = 0; y < segmentacionFrente.height; y++) {
		for (let x = 0; x < segmentacionFrente.width; x++) {
			// Obtener el índice del píxel actual
			const pixelIndex = y * segmentacionFrente.width + x;

			// Verificar si el píxel corresponde a una parte del cuerpo (no fondo)
			if (segmentacionFrente.data[pixelIndex] !== 0) {
				// Crear un elemento rect para representar el píxel en el SVG
				const siluetaFrente = document.createElementNS(SVG_NS, 'rect');
				siluetaFrente.setAttributeNS(null, 'transform', 'scale(' + escalaSilueta + ')');
				siluetaFrente.setAttribute('x', x + refxFrente);
				siluetaFrente.setAttribute('y', y + refy);
				siluetaFrente.setAttribute('width', 2);
				siluetaFrente.setAttribute('height', 2);
				siluetaFrente.setAttribute('fill', 'yellow');
				// Agregar el rectángulo al SVG
				svg.appendChild(siluetaFrente);
			}
		}
	}

	for (let y = 0; y < segmentacionPerfil.height; y++) {
		for (let x = 0; x < segmentacionPerfil.width; x++) {
			// Obtener el indice del píxel actual
			const pixelIndex = y * segmentacionPerfil.width + x;

			// Verificar si el pixel corresponde a una parte del cuerpo (no fondo)
			if (segmentacionPerfil.data[pixelIndex] !== 0) {
				// Crear un elemento rect para representar el píxel en el SVG
				const siluetaPerfil = document.createElementNS(SVG_NS, 'rect');
				siluetaPerfil.setAttributeNS(null, 'transform', 'scale(' + escalaSilueta + ')');
				siluetaPerfil.setAttribute('x', x + refxPerfil);
				siluetaPerfil.setAttribute('y', y + refy);
				siluetaPerfil.setAttribute('width', 2);
				siluetaPerfil.setAttribute('height', 2);
				siluetaPerfil.setAttribute('fill', 'yellow');
				// Agregar el rectángulo al SVG
				svg.appendChild(siluetaPerfil);
			}
		}
	}

	//*PINTAR SOLO EL CONTORNO
	// Recorrer los píxeles de la segmentaciónFrente
	for (let y = 1; y < segmentacionFrente.height - 1; y++) {
		for (let x = 1; x < segmentacionFrente.width - 1; x++) {
			// Obtener los valores de los píxeles vecinos
			const pixelIndex = y * segmentacionFrente.width + x;
			const topLeft = segmentacionFrente.data[pixelIndex - segmentacionFrente.width - 1];
			const topRight = segmentacionFrente.data[pixelIndex - segmentacionFrente.width + 1];
			const bottomLeft = segmentacionFrente.data[pixelIndex + segmentacionFrente.width - 1];
			const bottomRight = segmentacionFrente.data[pixelIndex + segmentacionFrente.width + 1];

			// Verificar si alguno de los píxeles vecinos es distinto del píxel actual
			if (
				segmentacionFrente.data[pixelIndex] !== topLeft ||
				segmentacionFrente.data[pixelIndex] !== topRight ||
				segmentacionFrente.data[pixelIndex] !== bottomLeft ||
				segmentacionFrente.data[pixelIndex] !== bottomRight
			) {
				// Crear un elemento rect para representar el píxel en el SVG
				const contornoFrente = document.createElementNS(SVG_NS, 'rect');
				contornoFrente.setAttributeNS(null, 'transform', 'scale(' + escalaSilueta + ')');
				contornoFrente.setAttribute('x', x + refxFrente);
				contornoFrente.setAttribute('y', y + refy);
				contornoFrente.setAttribute('width', 1);
				contornoFrente.setAttribute('height', 1);
				contornoFrente.setAttribute('fill', 'blue');
				// Agregar el rectángulo al SVG
				svg.appendChild(contornoFrente);
			}
		}
	}

	for (let y = 1; y < segmentacionPerfil.height - 1; y++) {
		for (let x = 1; x < segmentacionPerfil.width - 1; x++) {
			// Obtener los valores de los píxeles vecinos
			const pixelIndex = y * segmentacionPerfil.width + x;
			const topLeft = segmentacionPerfil.data[pixelIndex - segmentacionPerfil.width - 1];
			const topRight = segmentacionPerfil.data[pixelIndex - segmentacionPerfil.width + 1];
			const bottomLeft = segmentacionPerfil.data[pixelIndex + segmentacionPerfil.width - 1];
			const bottomRight = segmentacionPerfil.data[pixelIndex + segmentacionPerfil.width + 1];

			// Verificar si alguno de los píxeles vecinos es distinto del píxel actual
			if (
				segmentacionPerfil.data[pixelIndex] !== topLeft ||
				segmentacionPerfil.data[pixelIndex] !== topRight ||
				segmentacionPerfil.data[pixelIndex] !== bottomLeft ||
				segmentacionPerfil.data[pixelIndex] !== bottomRight
			) {
				// Crear un elemento rect para representar el píxel en el SVG
				const contornoPerfil = document.createElementNS(SVG_NS, 'rect');
				contornoPerfil.setAttributeNS(null, 'transform', 'scale(' + escalaSilueta + ')');
				contornoPerfil.setAttribute('x', x + refxPerfil);
				contornoPerfil.setAttribute('y', y + refy);
				contornoPerfil.setAttribute('width', 1);
				contornoPerfil.setAttribute('height', 1);
				contornoPerfil.setAttribute('fill', 'blue');
				// Agregar el rectángulo al SVG
				svg.appendChild(contornoPerfil);
			}
		}
	}

	//* PINTAR PUNTOS CLAVE Y PUNTOS OBTENIDOS
	// Variables para separar los datos de los puntos clave left_hip, right_hip para las dos imagenes, frente y perfil, y left_shoulder y right_shoulder solo de la iamgen de frente
	const leftHipFrente = ptosClaveFrente.left_hip;
	const rightHipFrente = ptosClaveFrente.right_hip;
	const leftHipPerfil = ptosClavePerfil.left_hip;
	const rightHipPerfil = ptosClavePerfil.right_hip;
	const leftShoulderFrente = ptosClaveFrente.left_shoulder; // Solo evaluamos el punto de hombro en el la imagen de frente
	const rightShoulderFrente = ptosClaveFrente.right_shoulder;
	const leftShoulderPerfil = ptosClavePerfil.left_shoulder; // Para obtener la coordenada x coorespondiente al eje lateral de cuerpo
	const rightShoulderPerfil = ptosClavePerfil.right_shoulder;

	//* Dibujar los puntos clave y las líneas hacia los puntos de borde más cercanos
	// Dibujar puntos encontrados
	function pintarPtos(punto, svg, refx) {
		const x = Math.round(punto.x);
		const y = Math.round(punto.y);

		const circle = document.createElementNS(SVG_NS, 'circle');
		circle.setAttributeNS(null, 'transform', 'scale(' + escalaSilueta + ')');
		circle.setAttribute('cx', x + refx);
		circle.setAttribute('cy', y + refy);
		circle.setAttribute('r', 2);
		circle.setAttribute('fill', 'pink');
		svg.appendChild(circle);
	}
	// Dibujar puntos clave
	// CADERA
	pintarPtos(leftHipFrente, svg, refxFrente);
	pintarPtos(rightHipFrente, svg, refxFrente);
	pintarPtos(leftHipPerfil, svg, refxPerfil);
	pintarPtos(rightHipPerfil, svg, refxPerfil);
	// HOMBROS
	pintarPtos(leftShoulderFrente, svg, refxFrente);
	pintarPtos(rightShoulderFrente, svg, refxFrente);
	pintarPtos(leftShoulderPerfil, svg, refxPerfil);
	pintarPtos(rightShoulderPerfil, svg, refxPerfil);

	// Pintamos los puntos de borde en las imagenes de frente y perfil de las caderas
	// Muestra  bordeHip = {borderPointLeftFrente: {x1, y}, borderPointRightFrente: {x2, y}, borderPointLeftPerfil: {x3, y}, borderPointRightPerfil: {x4, y}, distanciaXFrente: valorCaderaFrente, distanciaXPerfil: valorCaderaPerfil}
	pintarPtos(bordeHip.borderPointLeftFrente, svg, refxFrente);
	pintarPtos(bordeHip.borderPointRightFrente, svg, refxFrente);
	pintarPtos(bordeHip.borderPointLeftPerfil, svg, refxPerfil);
	pintarPtos(bordeHip.borderPointRightPerfil, svg, refxPerfil);
	// bordeShoulder = {bordeLeftShoulder: {x1, y}, bordeRightShoulder: {x2, y}}
	pintarPtos(bordeShoulder.bordeLeftShoulder, svg, refxFrente);
	pintarPtos(bordeShoulder.bordeRightShoulder, svg, refxFrente);
	// centroDel = {cenDelCad: {x, y1}, cenDelHom: {x, y2}, cenDelX: x}
	pintarPtos(centroDel.cenDelHom, svg, refxFrente);
	pintarPtos(centroDel.cenDelCad, svg, refxFrente);
	// centroLat = {cenLatHom: {x, y}, cenLatCad: {x, y}, cenLatX:x}
	pintarPtos(centroLat.cenLatHom, svg, refxPerfil);
	pintarPtos(centroLat.cenLatCad, svg, refxPerfil);

	//-------------------------
}
