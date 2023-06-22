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

		// Creamos dos section como las que había originalmente en el documento
		// Eliminar loader de fondo
		// const sectionLeft = document.createElement('section');
		// const sectionRight = document.createElement('section');
		// sectionLeft.class = 'section-left';
		// sectionRight.class = 'section-right';
		// fondo.appendChild(sectionLeft);
		// fondo.appendChild(sectionRight);

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

		function imprimirResultadosConsola() {
			console.log('Han terminado los procesos de analisis de los modelos');
		}

		try {
			//async
			// Nos aseguramos que TensorFlow.js está cargado antes de iniciar lso modelos
			await tf.ready();
			await tf.setBackend('webgl');
			//* ESTABLECEMOS UNA PROMESA
			await Promise.all([posePromise, bodyMaskPromise, segmentationPartsPromise]); //bodyMaskPromise el modelo antiguo de BodyPix devulve un error
			//await Promise.all([posePromise, segmentationPartsPromise]);
			//await Promise.all([bodyMaskPromise]);
			await imprimirResultadosConsola(); // segun la tienes aqui se ejecuta antes que el resto
			// Al finalizar todos los procesos de imagesTensorFlow(), resolver la promesa
			resolve();
		} catch (error) {
			console.log('Se ha producido un error ', error);
			// En caso de error, llamar a reject()
			reject(new Error('No se han ejecutado algunos modelos ni impreso por consola'));
		}
	});
}
