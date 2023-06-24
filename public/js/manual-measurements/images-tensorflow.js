// ESTA FUNCION ES LLAMADA DESDE datos-formulario.js se ejecuta despues de pantallaWebcam() que se encuentra delcarada en pantalla-webcam.js

'use strict';

/* ESTE SCRIPT ELIMINA LOS ELEMENTOS DEL DOM DEL ARCHIVO 
	manual-measurements.html QUE HAN SIDO COLOCADOS MEDIANTE 
    CODIGO JS DESDE EL ARCHIVO pantalla.webcam.js Y COLOCA 
    UNOS NUEVOS PARA DESPUES PASAR A EJECUTAR EL CODIGO QUE
    ANALIZA MEDIANTE LOS MODELOS PRE-ENTRENADOS POSE-DETECTION (DEVUELVE 
    KEYPOINTS/SKELETON) Y BODY SEGMENTATION (DEVULVE ZONAS DEL CUERPO) 
    LAS IMAGENES CAPTURADAS DE FRENTE Y PERFIL DEL CUERPO CON EL SCRIPT 
    pantalla-webacam.js Y QUE SE ENCUENTRAN EN LA VARIABLE GLOBAL
    capturas declarada en datos-formulario.js */

//----------------------------

//----------------------------

async function imagesTensorFlow() {
	//* ESTABLECEMOS UNA PROMESA
	return new Promise(async (resolve, reject) => {
		//----------------------------

		// SCRIPTS tensorFlow.js y los modelos en el <head> de manual-measurements.html

		//----------------------------

		//! REORDENAR LAS ELIMINACIONES PARA QUE ESTEN EN LA FUNCION DONDE SE CREARON
		//* Eliminamos los elementos del DOM que no necesitamos y creamos los que nos van a servir para ver nuestras imágenes analizadas por los modelos
		const fondo = document.querySelector('.fondo');
		const contenedorVideo = document.querySelector('#contenedor-video');
		// Eliminamos el div contenedorVideo que en el ultimo momento de pantallaWebcam nos estaba mostrando las
		fondo.removeChild(contenedorVideo);

		//* Metemos una pantalla de espera mientras trabajan los modelos
		// Crear el elemento del loader
		const loader = document.createElement('div');
		// loader.classList.add('loader');
		loader.class = 'loader';
		fondo.appendChild(loader);

		//* COMENZAMOS CON EL ANALISIS DE LAS IMAGENES
		// Cargamos las imágenes capturadas en capturas
		const imgFrente = document.createElement('img'); // para ello creamos elemtnos img auqnue no lso colocamos en el DOM
		const imgPerfil = document.createElement('img');
		imgFrente.src = capturas[0]; // Imagen frente está en la primera posición de capturas
		imgPerfil.src = capturas[1]; // Imagen de perfil está en la segunda posición de capturas

		//* VAMOS A ESTABLECER VARIAS PROMESAS PARA QUE RESOLVE SOLO SE PRODUZCA CUANDO SE HAYAN CUMPLIDO TODAS
		const posePromise = pose();
		const bodyMaskPromise = bodyMask();
		const segmentationPartsPromise = segmentationParts();

		async function pose() {
			//const pose = async function ()
			//* ANALISIS MODELO POSE-DETECTION
			// Cargamos el modelo Pose-detection
			const model = poseDetection.SupportedModels.BlazePose;
			const detectorConfig = {
				runtime: 'tfjs',
				enableSmoothing: false, // false para imagenes estaticas
				modelType: 'heavy', // Escogemos la configuracion mas precisa ( 'lite', 'full', 'heavy')
			};
			const detector = await poseDetection.createDetector(model, detectorConfig); // detector? aparece sin declarar en en la documentacion https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_tfjs

			// Utilizar la API de Pose Detection. Variables declaradas globalmente en datos-formulario.js
			const estimationConfig = { flipHorizontal: true };
			const timestamp = performance.now();
			posesFrente = await detector.estimatePoses(imgFrente, estimationConfig, timestamp); // posesFrente = {score, keypoints, keypoints3D}
			posesPerfil = await detector.estimatePoses(imgPerfil, estimationConfig, timestamp);

			// Acceder a los puntos clave (landmarks). Variables declaradas globalmente en datos-formulario.js
			keypointsFrente = posesFrente[0].keypoints; // keypointsFrente = {x, y, z, score, name}
			keypointsPerfil = posesPerfil[0].keypoints;
			keypoints3DFrente = posesFrente[0].keypoints3D; // keypoints3DFrente  = {x, y, z, score, name}
			keypoints3DPerfil = posesPerfil[0].keypoints3D;

			//Imprimimos resultados por consola
			console.log('Los resultados para pose() con el modelo Pose-Detection son:');
			console.log('Pose-Detection poses', posesFrente, posesPerfil);
			console.log('Pose-Detection keypoints', keypointsFrente, keypointsPerfil);
			console.log('Pose-Detection keypoints3D', keypoints3DFrente, keypoints3DPerfil);
		}

		async function bodyMask() {
			//const bodyMask = async function () OTRA FORMA DE PONERLA
			//* ANALISIS MODELO BODYPIX
			//ResNet50
			const segmenterConfig = {
				architecture: 'ResNet50', // puede usarse 'MobileNetV1'
				outputStride: 16, //16, 32 para ResNet50.  8, 16 para MobileNetV1
				quantBytes: 4,
			};
			// MobileNetV1
			// const segmenterConfig = {
			// 	architecture: 'MobileNetV1', // puede usarse 'ResNet50'
			// 	outputStride: 8, // 16, 32 para ResNet50.  8, 16 para MobileNetV1 ESCOGEMOS EL VALOR MENOR PARA MAS PRECISION
			// 	multiplier: 1, // 1.0, 0.75, or 0.50 solo se emplea en MobileNetV1 ESCOGEMOS EL VALOR MAYOR PARA MAS PRECISION
			// 	quantBytes: 4, // 1, 2, 4 ESCOGEMOS EL VALOR MAYOR PARA MAS PRECISION
			// };
			//Cargamos el modelo
			const model = await bodyPix.load(segmenterConfig); //https://github.com/tensorflow/tfjs-models/blob/master/body-pix/README_Archive.md
			console.log('el modelo body pix se ha cargado');
			// arguments for estimating person segmentation.
			const segmentationConfig = {
				flipHorizontal: false,
				internalResolution: 'full',
				segmentationThreshold: 0.7,
			};

			// Utilizar la API de BodyPix antoguo. Variables declaradas globalmente en datos-formulario.js
			segmentacionFrente = await model.segmentPerson(imgFrente, segmentationConfig); //segmentPerson
			segmentacionPerfil = await model.segmentPerson(imgPerfil, segmentationConfig); //segmentPerson

			// Obtener la máscara de segmentación dentro del objeto
			maskFrente = segmentacionFrente.mask;
			maskPerfil = segmentacionPerfil.mask;
			//Imprimimos resultados por consola
			console.log('Los resultados para segmentationParts con el modelo BodyPix son:');
			console.log('BodyPix segmentationParts', segmentacionFrente, segmentacionPerfil);
			console.log('BodyPix maskSegmentation', maskFrente, maskPerfil);

			//CREO CANVAS PARA VERLO PRUEBA
			//TODO
			const canvasFrente = document.createElement('canvas');
			const canvasPerfil = document.createElement('canvas');
			fondo.removeChild(loader); // elimino loader
			fondo.style.height = '100%'; // para que se adapte a lso tamanos de los canvas
			fondo.appendChild(canvasFrente); // coloco el canvas en el DOM
			fondo.appendChild(canvasPerfil); // coloco el canvas en el DOM
			//TODO
			const coloredPartFrente = bodyPix.toMask(segmentacionFrente);
			const coloredPartPerfil = bodyPix.toMask(segmentacionPerfil);
			const opacity = 0.7;
			const flipHorizontal = false;
			const maskBlurAmount = 0;
			// Draw the colored part image on top of the original image onto a canvas.
			// The colored part image will be drawn semi-transparent, with an opacity of
			// 0.7, allowing for the original image to be visible under.
			bodyPix.drawMask(canvasFrente, imgFrente, coloredPartFrente, opacity, maskBlurAmount, flipHorizontal);
			bodyPix.drawMask(canvasPerfil, imgPerfil, coloredPartPerfil, opacity, maskBlurAmount, flipHorizontal);
		}

		async function segmentationParts() {
			//const segmentationParts = async function () OTRA FORMA DE PONERLA
			// //* ANALISIS MODELO BODYPIX
			const model = bodySegmentation.SupportedModels.BodyPix; //https://github.com/tensorflow/tfjs-models/tree/master/body-segmentation/src/body_pix
			//ResNet50
			// const segmenterConfig = {
			// 	architecture: 'ResNet50', // puede usarse 'MobileNetV1'
			// 	outputStride: 16, //16, 32 para ResNet50.  8, 16 para MobileNetV1
			// 	quantBytes: 4,
			// };
			// MobileNetV1
			const segmenterConfig = {
				architecture: 'MobileNetV1', // puede usarse 'ResNet50'
				outputStride: 8, // 16, 32 para ResNet50.  8, 16 para MobileNetV1 ESCOGEMOS EL VALOR MENOR PARA MAS PRECISION
				multiplier: 1, // 1.0, 0.75, or 0.50 solo se emplea en MobileNetV1 ESCOGEMOS EL VALOR MAYOR PARA MAS PRECISION
				quantBytes: 4, // 1, 2, 4 ESCOGEMOS EL VALOR MAYOR PARA MAS PRECISION
			};
			const segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
			const segmentationConfig = { multiSegmentation: false, segmentBodyParts: true }; // multiSegmentation: false, solo queremos que detecte una unica persona en la imagen. segmentBodyParts: true entonces la función maskValueToLabel devolverá una de las partes del cuerpo definidas por BodyPix, con false la única etiqueta devuelta por la función maskValueToLabel es 'persona'.
			// Utilizar la API de BodyPix. Variables declaradas globalmente en datos-formulario.js
			segmentacionPartesFrente = await segmenter.segmentPeople(imgFrente, segmentationConfig);
			segmentacionPartesPerfil = await segmenter.segmentPeople(imgPerfil, segmentationConfig);

			// Obtener la máscara de segmentación
			/* The colored part image is an rgb image with a corresponding color from the
				rainbow colors for each part at each pixel, and black pixels where there is
				no part. */
			maskPartesFrente = await bodySegmentation.toColoredMask(
				segmentacionPartesFrente,
				bodySegmentation.bodyPixMaskValueToRainbowColor,
				{ r: 255, g: 255, b: 255, a: 255 }
			); // Obtengo un ImageData
			maskPartesPerfil = await bodySegmentation.toColoredMask(
				segmentacionPartesPerfil,
				bodySegmentation.bodyPixMaskValueToRainbowColor,
				{ r: 255, g: 255, b: 255, a: 255 }
			); // Obtengo un ImageData

			//Imprimimos resultados por consola
			console.log('Los resultados para segmentationParts con el modelo BodyPix son:');
			console.log('BodyPix segmentationParts', segmentacionPartesFrente, segmentacionPartesPerfil);
			console.log('BodyPix maskSegmentation', maskPartesFrente, maskPartesPerfil);

			const opacity = 0.7;
			const flipHorizontal = false;
			const maskBlurAmount = 0;

			//CREO CANVAS PARA VERLO PRUEBA
			//TODO
			const canvasPartesFrente = document.createElement('canvas');
			const canvasPartesPerfil = document.createElement('canvas');
			//fondo.removeChild(loader); // elimino loader
			fondo.style.height = '100%'; // para que se adapte a lso tamanos de los canvas
			fondo.appendChild(canvasPartesFrente); // coloco el canvas en el DOM
			fondo.appendChild(canvasPartesPerfil); // coloco el canvas en el DOM
			//TODO
			// Draw the colored part image on top of the original image onto a canvas.
			// The colored part image will be drawn semi-transparent, with an opacity of
			// 0.7, allowing for the original image to be visible under.
			bodySegmentation.drawMask(
				canvasPartesFrente,
				imgFrente,
				maskPartesFrente,
				opacity,
				maskBlurAmount,
				flipHorizontal
			);
			bodySegmentation.drawMask(
				canvasPartesPerfil,
				imgPerfil,
				maskPartesPerfil,
				opacity,
				maskBlurAmount,
				flipHorizontal
			);
		}

		function procesarKeypoints() {
			/* LOS MODELOS SOLO NOS APORTAN CUATRO PTOS CLAVE QUE PUEDAN SERVIRNOS 
    Estos son: left_shoulder/right_shoulder/left_hip/right-hip*/

			//* PASO 1: OBTENER A PARTIR DE LOS PUNTOS CLAVE DISTANCIAS AL CONTORNO Y PUNTOS DE CONTORNO PARA INTENTAR SABER LA MEDIDA DE CADERA Y MEDIDA DE COSTADILLO
			// Variables para separar los datos de los puntos clave left_hip, right_hip para las dos imagenes, frente y perfil, y left_shoulder y right_shoulder solo de la iamgen de frente
			const leftHipFrente = keypointsFrente.left_hip;
			const rightHipFrente = keypointsFrente.right_hip;
			const leftHipPerfil = keypointsPerfil.left_hip;
			const rightHipPerfil = keypointsPerfil.right_hip;
			const leftShoulderFrente = keypointsFrente.left_shoulder; // Solo evaluamos el punto de hombro en el la imagen de frente
			const rightShoulderFrente = keypointsFrente.right_shoulder;
			const leftShoulderPerfil = keypointsPerfil.left_shoulder; // Para obtener la coordenada x coorespondiente al eje lateral de cuerpo
			const rightShoulderPerfil = keypointsPerfil.right_shoulder;

			//* Obtener la matriz de segmentacion de segmentacionFrente.data
			function obtenerMask(segmentacion) {
				const { width, height, data } = segmentacion;
				const mask = [];

				for (let y = 0; y < height; y++) {
					for (let x = 0; x < width; x++) {
						const pixelIndex = y * width + x;
						const isForeground = data[pixelIndex] !== 0;

						if (isForeground) {
							mask.push({ x, y });
						}
					}
				}

				return mask;
			}

			//* Funcion para encontrar el punto de borde de la mascara izquierda y derecha de los puntos clave left_hip, right_hip en als dos imagenes, frente y perfil
			function bordesMaskHz(puntoClave, mask) {
				// Filtrar los puntos de mask que tienen la misma coordenada y que puntoClave
				const puntosMismaY = mask.filter((punto) => punto.y === puntoClave.y);

				if (puntosMismaY.length > 0) {
					// Encontrar el punto con coordenada x mínima y el punto con coordenada x máxima
					const borderPointLeft = puntosMismaY.reduce((minPunto, punto) => (punto.x < minPunto.x ? punto : minPunto));
					const borderPointRight = puntosMismaY.reduce((maxPunto, punto) => (punto.x > maxPunto.x ? punto : maxPunto));

					return { borderPointLeft, borderPointRight };
				}

				// No hay puntos con la misma coordenada y que puntoClave, buscar el más cercano
				const puntoMasCercano = mask.reduce((puntoCercano, punto) => {
					const distanciaActual = Math.abs(punto.y - puntoClave.y);
					const distanciaMinima = Math.abs(puntoCercano.y - puntoClave.y);
					return distanciaActual < distanciaMinima ? punto : puntoCercano;
				});

				// Filtrar los puntos de mask que tienen la misma coordenada y que puntoMasCercano
				const puntosMismaY2 = mask.filter((punto) => punto.y === puntoMasCercano.y);

				// Encontrar el punto con coordenada x mínima y el punto con coordenada x máxima
				const borderPointLeft = puntosMismaY2.reduce((minPunto, punto) => (punto.x < minPunto.x ? punto : minPunto));
				const borderPointRight = puntosMismaY2.reduce((maxPunto, punto) => (punto.x > maxPunto.x ? punto : maxPunto));

				console.log(borderPointRight?.x, borderPointLeft?.x);
				const distanciaX = Math.abs(borderPointRight.x - borderPointLeft.x);

				return { borderPointLeft, borderPointRight, distanciaX };
			}

			//* Funcion para comparar los resultados obtenidos en bordesMaskHz(puntoClave, mask), para igualar resultados de tamanio de cadera entre puntos left_hip, right_hip para cada una de las imágenes e igualae la altura de la cadera obtenida en las dos en las dos
			function compararBordesHz(borde1, borde2, borde3, borde4) {
				const borde = {};

				// Comparar coordenadas x de borde1 y borde2 para borderPointLeftFrente
				if (borde1.borderPointLeft.x === borde2.borderPointLeft.x) {
					borde.borderPointLeftFrente = borde1.borderPointLeft;
				} else {
					const xMedio = (borde1.borderPointLeft.x + borde2.borderPointLeft.x) / 2;
					borde.borderPointLeftFrente = { x: xMedio, y: borde1.borderPointLeft.y };
				}

				// Comparar coordenadas x de borde1 y borde2 para borderPointRightFrente
				if (borde1.borderPointRight.x === borde2.borderPointRight.x) {
					borde.borderPointRightFrente = borde1.borderPointRight;
				} else {
					const xMedio = (borde1.borderPointRight.x + borde2.borderPointRight.x) / 2;
					borde.borderPointRightFrente = { x: xMedio, y: borde1.borderPointRight.y };
				}

				// Comparar coordenadas x de borde3 y borde4 para borderPointLeftPerfil
				if (borde3.borderPointLeft.x === borde4.borderPointLeft.x) {
					borde.borderPointLeftPerfil = borde3.borderPointLeft;
				} else {
					const xMedio = (borde3.borderPointLeft.x + borde4.borderPointLeft.x) / 2;
					borde.borderPointLeftPerfil = { x: xMedio, y: borde3.borderPointLeft.y };
				}

				// Comparar coordenadas x de borde3 y borde4 para borderPointRightPerfil
				if (borde3.borderPointRight.x === borde4.borderPointRight.x) {
					borde.borderPointRightPerfil = borde3.borderPointRight;
				} else {
					const xMedio = (borde3.borderPointRight.x + borde4.borderPointRight.x) / 2;
					borde.borderPointRightPerfil = { x: xMedio, y: borde3.borderPointRight.y };
				}

				// Comparar coordenadas y de todos los objetos para asignar las coordenadas y correspondientes
				const coordenadasY = [
					borde1.borderPointLeft.y,
					borde1.borderPointRight.y,
					borde2.borderPointLeft.y,
					borde2.borderPointRight.y,
					borde3.borderPointLeft.y,
					borde3.borderPointRight.y,
					borde4.borderPointLeft.y,
					borde4.borderPointRight.y,
				];
				const yMedio = coordenadasY.reduce((total, y) => total + y, 0) / coordenadasY.length;

				borde.borderPointLeftFrente.y = yMedio;
				borde.borderPointRightFrente.y = yMedio;
				borde.borderPointLeftPerfil.y = yMedio;
				borde.borderPointRightPerfil.y = yMedio;

				// Comparar distanciaXFrente y asignar el valor correspondiente
				const distanciaXFrente1 = Math.abs(borde1.borderPointLeft.x - borde1.borderPointRight.x);
				const distanciaXFrente2 = Math.abs(borde2.borderPointLeft.x - borde2.borderPointRight.x);
				borde.distanciaXFrente =
					distanciaXFrente1 === distanciaXFrente2 ? distanciaXFrente1 : (distanciaXFrente1 + distanciaXFrente2) / 2;

				// Comparar distanciaXPerfil y asignar el valor correspondiente
				const distanciaXPerfil1 = Math.abs(borde3.borderPointLeft.x - borde3.borderPointRight.x);
				const distanciaXPerfil2 = Math.abs(borde4.borderPointLeft.x - borde4.borderPointRight.x);
				borde.distanciaXPerfil =
					distanciaXPerfil1 === distanciaXPerfil2 ? distanciaXPerfil1 : (distanciaXPerfil1 + distanciaXPerfil2) / 2;

				return borde;
			}

			//* Funcion para encontrar el punto de borde de la mascara superior de los puntos clave left_shoulder y right_shoulder en la imagen de frente
			function bordesMaskVr(puntoClave, mask) {
				// Filtrar los puntos de mask que tienen la misma coordenada y que puntoClave
				const puntosMismaX = mask.filter((punto) => punto.x === puntoClave.x);

				if (puntosMismaX.length > 0) {
					// Encontrar el punto con coordenada y mínima
					const borderPointTop = puntosMismaX.reduce((minPunto, punto) => (punto.y < minPunto.y ? punto : minPunto));

					return { borderPointTop };
				}

				// No hay puntos con la misma coordenada x que puntoClave, buscar el más cercano
				const puntoMasCercano = mask.reduce((puntoCercano, punto) => {
					const distanciaActual = Math.abs(punto.x - puntoClave.x);
					const distanciaMinima = Math.abs(puntoCercano.x - puntoClave.x);
					return distanciaActual < distanciaMinima ? punto : puntoCercano;
				});

				// Filtrar los puntos de mask que tienen la misma coordenada x que puntoMasCercano
				const puntosMismaX2 = mask.filter((punto) => punto.x === puntoMasCercano.x);

				// Encontrar el punto con coordenada y mínima
				const borderPointTop = puntosMismaX2.reduce((minPunto, punto) => (punto.y < minPunto.y ? punto : minPunto));

				return { borderPointTop };
			}

			//* Funcion para encontrar la altura de hombro media entre los dos puntos de hombro encontrados en la imagen de frente
			function compararBordesVr(bordeLeft, bordeRight) {
				const punto1 = bordeLeft.borderPointTop;
				const punto2 = bordeRight.borderPointTop;

				if (punto1.y === punto2.y) {
					return {
						bordeLeftShoulder: { x: bordeLeft.borderPointTop.x, y: punto1.y },
						bordeRightShoulder: { x: bordeRight.borderPointTop.x, y: punto1.y },
					};
				} else {
					const yMedio = (punto1.y + punto2.y) / 2;

					return {
						bordeLeftShoulder: { x: bordeLeft.borderPointTop.x, y: yMedio },
						bordeRightShoulder: { x: bordeRight.borderPointTop.x, y: yMedio },
					};
				}
			}

			//* Funcion para buscar los puntos medios para left_shoulder y right_shoulder y para left_hip, right_hip y los comparamos para saber la coordenada x centro de cuerpo
			function ejeCentroDelantero(bordeHip, bordeShoulder) {
				//* Punto medio entre los dos puntos de cadera, izq y derecho
				const leftHipFrente = bordeHip.borderPointLeftFrente;
				const rightHipFrente = bordeHip.borderPointRightFrente;
				const ptomedioXHip = (leftHipFrente.x + rightHipFrente.x) / 2;
				const ptomedioYHip = (leftHipFrente.y + rightHipFrente.y) / 2;
				const cenDelCad = { x: ptomedioXHip, y: ptomedioYHip };
				//* Punto medio entre los dos puntos de hombro, izq y derecho
				const leftShoulderFrente = bordeShoulder.bordeLeftShoulder;
				const rightShoulderFrente = bordeShoulder.bordeRightShoulder;
				const ptomedioXShoulder = (leftShoulderFrente.x + rightShoulderFrente.x) / 2;
				const ptomedioYShoulder = (leftShoulderFrente.y + rightShoulderFrente.y) / 2;
				const cenDelHom = { x: ptomedioXShoulder, y: ptomedioYShoulder };
				//* Coordenada x del centro delantero de cuerpo
				const cenDelX = (cenDelCad.x + cenDelHom.x) / 2;

				return { cenDelCad, cenDelHom, cenDelX }; //cenDelX no es un objeto con dos coordenadas, sólo tiene un valor, la coordenda x del eje centro de cuerpo
			}

			//* Funcion para buscar los puntos medios para left_shoulder y right_shoulder en la imagen de perfil apra obtener el eje lateral del cuerpo
			function ejeLateral(leftShoulderPerfil, rightShoulderPerfil, bordeShoulder, bordeHip) {
				const ptomedioX = (leftShoulderPerfil.x + rightShoulderPerfil.x) / 2;
				const ptomedioHomY = (bordeShoulder.bordeLeftShoulder.y + bordeShoulder.bordeRightShoulder.y) / 2;
				const ptomedioCadY =
					(bordeHip.borderPointLeftFrente.y +
						bordeHip.borderPointRightFrente.y +
						bordeHip.borderPointLeftPerfil.y +
						bordeHip.borderPointRightPerfil.y) /
					4;
				const cenLatHom = { x: ptomedioX, y: ptomedioHomY };
				const cenLatCad = { x: ptomedioX, y: ptomedioCadY };
				const cenLatX = { x: ptomedioX };
				return { cenLatHom, cenLatCad, cenLatX };
			}

			//* LLamamos a la funcion para obtener las mascaras de las iamgenes de frente y perfil
			maskFrente = obtenerMask(segmentacionFrente);
			maskPerfil = obtenerMask(segmentacionPerfil);
			console.log('mascaras', maskFrente, maskPerfil);

			//----------------------------

			//* Buscamos los puntos de borde mas cercanos en direccion horizontal (ambos sentidos) a los puntos de cadera obtenidos tanto para la iamgen de perfil como para la de frente
			const bordeLeftHipFrente = bordesMaskHz(leftHipFrente, maskFrente);
			const bordeRightHipFrente = bordesMaskHz(rightHipFrente, maskFrente);
			const bordeLeftHipPerfil = bordesMaskHz(leftHipPerfil, maskPerfil);
			const bordeRightHipPerfil = bordesMaskHz(rightHipPerfil, maskPerfil);
			console.log(bordeLeftHipFrente, bordeRightHipFrente, bordeLeftHipPerfil, bordeRightHipPerfil);

			//* Nos quedamos con un unico valor para el tamanio de cadera de frente y otro para el de perfil y una unica altura de cadera (punto medio de coordenada y para las 4 puntos disponibles)
			bordeHip = compararBordesHz(bordeLeftHipFrente, bordeRightHipFrente, bordeLeftHipPerfil, bordeRightHipPerfil); // VARIABLE GLOBAL
			console.log('bordeHip', bordeHip); // Muestra  bordeHip = {borderPointLeftFrente: {x1, y}, borderPointRightFrente: {x2, y}, borderPointLeftPerfil: {x3, y}, borderPointRightPerfil: {x4, y}, distanciaXFrente: valorCaderaFrente, distanciaXPerfil: valorCaderaPerfil}

			//----------------------------

			//* Buscamos los puntos de borde mas cercanos en vertical (solo sentido ascendente) a los puntos de hombro solo en la imagen de frente
			const bordeLeftShoulder = bordesMaskVr(leftShoulderFrente, maskFrente);
			const bordeRightShoulder = bordesMaskVr(rightShoulderFrente, maskFrente);
			console.log(bordeLeftShoulder, bordeRightShoulder);

			//* Nos quedamos con un unico valor de coordenada y para la caida de hombro
			bordeShoulder = compararBordesVr(bordeLeftShoulder, bordeRightShoulder); // Resultado de la coordenada del pto caida de hombro // VARIABLE GLOBAL
			console.log('bordeShoulder', bordeShoulder); // Muestra bordeShoulder = {bordeLeftShoulder: {x1, y}, bordeRightShoulder: {x2, y}}

			//----------------------------

			//* Buscamos los puntos medios para left_shoulder y right_shoulder y para left_hip, right_hip y los comparamos para saber la coordenada x centro de cuerpo
			centroDel = ejeCentroDelantero(bordeHip, bordeShoulder); // VARIABLE GLOBAL
			console.log('centroDel', centroDel); // Muestra centroDel = {cenDelCad: {x, y1}, cenDelHom: {x, y2}, cenDelX: x}

			//----------------------------

			//* Buscamos los puntos medios para left_shoulder y right_shoulder de la imagen de perfil para saber la coordenada x del lateral del cuerpo (no usamos el punto medio de la cadera pues en el caso de perfil no nos dara esta cota) como coordenada y tomaremos la ya calculada como punto de borde en bordeShoulder
			centroLal = ejeLateral(leftShoulderPerfil, rightShoulderPerfil, bordeShoulder, bordeHip); // VARIABLE GLOBAL
			console.log('centroLat', centroLal); // Muestra centroLat = {cenLatHom: {x, y}, cenLatCad: {x, y}, cenLatX:x}

			//----------------------------

			//*

			//* PASO 2: REPRESENTAR LO OBTENIDO EN CANVAS
			const canvasFrente = document.createElement('canvas');
			fondo.appendChild(canvasFrente);
			const canvasPerfil = document.createElement('canvas');
			fondo.appendChild(canvasPerfil);
			const ctxFrente = canvasFrente.getContext('2d');
			const ctxPerfil = canvasPerfil.getContext('2d');
			// Establecer el tamaño del canvas según la imagen
			canvasFrente.width = frenteImg.width;
			canvasFrente.height = frenteImg.height;
			canvasPerfil.width = perfilImg.width;
			canvasPerfil.height = perfilImg.height;

			// Limpiar el canvas
			ctxFrente.clearRect(0, 0, canvasFrente.width, canvasFrente.height);

			//TODO Dibujar el contorno
			//*PINTAR LA SILUETA
			// Recorrer los pixeles de la segmentacionFrente ME PINTA LA MASCARA DE UN COLOR
			for (let y = 0; y < segmentacionFrente.height; y++) {
				for (let x = 0; x < segmentacionFrente.width; x++) {
					// Obtener el indice del píxel actual
					const pixelIndex = y * segmentacionFrente.width + x;

					// Verificar si el pixel corresponde a una parte del cuerpo (no fondo)
					if (segmentacionFrente.data[pixelIndex] !== 0) {
						// Dibujar un punto o marca en el canvas en la posicion (x, y)
						ctxFrente.fillStyle = 'yellow';
						ctxFrente.fillRect(x, y, 2, 2);
					}
				}
			}

			for (let y = 0; y < segmentacionPerfil.height; y++) {
				for (let x = 0; x < segmentacionPerfil.width; x++) {
					// Obtener el indice del píxel actual
					const pixelIndex = y * segmentacionPerfil.width + x;

					// Verificar si el pixel corresponde a una parte del cuerpo (no fondo)
					if (segmentacionPerfil.data[pixelIndex] !== 0) {
						// Dibujar un punto o marca en el canvas en la posicion (x, y)
						ctxPerfil.fillStyle = 'yellow';
						ctxPerfil.fillRect(x, y, 2, 2);
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
						// Dibujar el contorno en el canvas
						ctxFrente.fillStyle = 'blue';
						ctxFrente.fillRect(x, y, 1, 1);
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
						// Dibujar el contorno en el canvas
						ctxPerfil.fillStyle = 'blue';
						ctxPerfil.fillRect(x, y, 1, 1);
					}
				}
			}

			//* PINTAR PUNTOS CLAVE Y PUNTOS OBTENIDOS
			//* Dibujar los puntos clave y las líneas hacia los puntos de borde más cercanos
			// Dibujar puntos encontrados
			function pintarPtos(punto, ctx) {
				ctx.fillStyle = 'pink';
				const x = Math.round(punto.x);
				const y = Math.round(punto.y);
				ctx.beginPath();
				ctx.arc(x, y, 2, 0, 2 * Math.PI);
				ctx.fill();
			}
			// Dibujar puntos clave
			// CADERA
			pintarPtos(leftHipFrente, ctxFrente);
			pintarPtos(rightHipFrente, ctxFrente);
			pintarPtos(leftHipPerfil, ctxPerfil);
			pintarPtos(rightHipPerfil, ctxPerfil);
			// HOMBROS
			pintarPtos(leftShoulderFrente, ctxFrente);
			pintarPtos(rightShoulderFrente, ctxFrente);
			pintarPtos(leftShoulderPerfil, ctxPerfil);
			pintarPtos(rightShoulderPerfil, ctxPerfil);

			// Pintamos los puntos de borde en las imagenes de frente y perfil de las caderas
			// Muestra  bordeHip = {borderPointLeftFrente: {x1, y}, borderPointRightFrente: {x2, y}, borderPointLeftPerfil: {x3, y}, borderPointRightPerfil: {x4, y}, distanciaXFrente: valorCaderaFrente, distanciaXPerfil: valorCaderaPerfil}
			pintarPtos(bordeHip.borderPointLeftFrente, ctxFrente);
			pintarPtos(bordeHip.borderPointRightFrente, ctxFrente);
			pintarPtos(bordeHip.borderPointLeftPerfil, ctxPerfil);
			pintarPtos(bordeHip.borderPointRightPerfil, ctxPerfil);
			// bordeShoulder = {bordeLeftShoulder: {x1, y}, bordeRightShoulder: {x2, y}}
			pintarPtos(bordeShoulder.bordeLeftShoulder, ctxFrente);
			pintarPtos(bordeShoulder.bordeRightShoulder, ctxFrente);
			// centroDel = {cenDelCad: {x, y1}, cenDelHom: {x, y2}, cenDelX: x}
			pintarPtos(centroDel.cenDelHom, ctxFrente);
			pintarPtos(centroDel.cenDelCad, ctxFrente);
			// centroLat = {cenLatHom: {x, y}, cenLatCad: {x, y}, cenLatX:x}
			pintarPtos(centroLal.cenLatHom, ctxPerfil);
			pintarPtos(centroLal.cenLatCad, ctxPerfil);

			//* PASO 3: ESTIMAR LAS MEDIDAS
			/* Para el calculo de las medidas se tomaran valores de proporciones canonicas. 
		SE ESPERAN RESULTADOS POCO FIABLES Y SE CREE MÄS CONVENIENTE EMPLEAR LOS 
		DATOS QUE SE DISPONEN PARA ENTRENAR UN MODELO DE INFERENCIA DE MEDIDAS
		QUE COMPARE LOS DATOS OBTENIDOS CON BODYPIX Y POSENET CON LOS QUE HAYA DISPONIBLES
		EN LA BASE DATOS UNA VEZ ESTA SEA LO SUFICIENTEMENTE GRANDE CON LSO DATOS REGISTRADOS
		MANUALMENTE*/
		}

		try {
			//async
			// Nos aseguramos que TensorFlow.js está cargado antes de iniciar lso modelos
			await tf.ready();
			await tf.setBackend('webgl');
			//* ESTABLECEMOS UNA PROMESA
			await Promise.all([posePromise, bodyMaskPromise, segmentationPartsPromise]); //bodyMaskPromise el modelo antiguo de BodyPix devulve un error
			// await Promise.allSettled([posePromise, bodyMaskPromise, segmentationPartsPromise])
			//.then (values=>{console.log(values)});
			await procesarKeypoints(); // segun la tienes aqui se ejecuta antes que el resto
			// Al finalizar todos los procesos de imagesTensorFlow(), resolver la promesa
			resolve();
		} catch (error) {
			console.log('Se ha producido un error ', error);
			// En caso de error, llamar a reject()
			reject(new Error('No se han ejecutado algunos modelos ni impreso por consola'));
		}
	});
}
