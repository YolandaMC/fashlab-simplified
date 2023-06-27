// ESTA FUNCION ES LLAMADA DESDE body-viewer.js

'use strict';

function dibujarSilueta() {
	// //* PASO 2: REPRESENTAR LO OBTENIDO EN SVG
	// 		//Elimianmos el mensaje de espera
	//         const fondo = document.querySelector('.fondo');
	// 		// Cambiamos tamanio fondo
	// 		fondo.style.height = 'auto';
	// 		fondo.style.padding = '30px';
	// 		// Crea un elemento SVG en lugar de los elementos canvas
	// 		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	// 		fondo.appendChild(svg);

	// 		// Establece el tamaño del SVG según las dimensiones de las imágenes
	// 		svg.setAttribute('width', imgFrente.width);
	// 		svg.setAttribute('height', imgFrente.height);
    
	// Recuperamos svg creado en body.viewer.js
	const svg = document.querySelector('.body-viewer');
	const SVG_NS = 'http://www.w3.org/2000/svg';
   

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
				siluetaFrente.setAttribute('x', x);
				siluetaFrente.setAttribute('y', y);
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
				siluetaPerfil.setAttribute('x', x);
				siluetaPerfil.setAttribute('y', y);
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
				contornoFrente.setAttribute('x', x);
				contornoFrente.setAttribute('y', y);
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
				contornoPerfil.setAttribute('x', x);
				contornoPerfil.setAttribute('y', y);
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
	function pintarPtos(punto, svg) {
		const x = Math.round(punto.x);
		const y = Math.round(punto.y);

		const circle = document.createElementNS(SVG_NS, 'circle');
		circle.setAttribute('cx', x);
		circle.setAttribute('cy', y);
		circle.setAttribute('r', 2);
		circle.setAttribute('fill', 'pink');

		svg.appendChild(circle);
	}
	// Dibujar puntos clave
	// CADERA
	pintarPtos(leftHipFrente, svg);
	pintarPtos(rightHipFrente, svg);
	pintarPtos(leftHipPerfil, svg);
	pintarPtos(rightHipPerfil, svg);
	// HOMBROS
	pintarPtos(leftShoulderFrente, svg);
	pintarPtos(rightShoulderFrente, svg);
	pintarPtos(leftShoulderPerfil, svg);
	pintarPtos(rightShoulderPerfil, svg);

	// Pintamos los puntos de borde en las imagenes de frente y perfil de las caderas
	// Muestra  bordeHip = {borderPointLeftFrente: {x1, y}, borderPointRightFrente: {x2, y}, borderPointLeftPerfil: {x3, y}, borderPointRightPerfil: {x4, y}, distanciaXFrente: valorCaderaFrente, distanciaXPerfil: valorCaderaPerfil}
	pintarPtos(bordeHip.borderPointLeftFrente, svg);
	pintarPtos(bordeHip.borderPointRightFrente, svg);
	pintarPtos(bordeHip.borderPointLeftPerfil, svg);
	pintarPtos(bordeHip.borderPointRightPerfil, svg);
	// bordeShoulder = {bordeLeftShoulder: {x1, y}, bordeRightShoulder: {x2, y}}
	pintarPtos(bordeShoulder.bordeLeftShoulder, svg);
	pintarPtos(bordeShoulder.bordeRightShoulder, svg);
	// centroDel = {cenDelCad: {x, y1}, cenDelHom: {x, y2}, cenDelX: x}
	pintarPtos(centroDel.cenDelHom, svg);
	pintarPtos(centroDel.cenDelCad, svg);
	// centroLat = {cenLatHom: {x, y}, cenLatCad: {x, y}, cenLatX:x}
	pintarPtos(centroLal.cenLatHom, svg);
	pintarPtos(centroLal.cenLatCad, svg);

	//-------------------------
}
