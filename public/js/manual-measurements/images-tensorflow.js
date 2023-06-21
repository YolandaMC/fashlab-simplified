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
		// Creamos dos section como las que había originalmente en el documento
		const sectionLeft = document.createElement('section');
		const sectionRight = document.createElement('section');
		sectionLeft.class = '.section-left';
		sectionRight.class = '.section-right';
		fondo.appendChild(sectionLeft);
		fondo.appendChild(sectionRight);

		//* COMENZAMOS CON EL ANALISIS DE LAS IMAGENES
		// Cargamos las imágenes capturadas en capturas
		const imgFrente = document.createElement('img'); // para ello creamos elemtnos img auqnue no lso colocamos en el DOM
		const imgPerfil = document.createElement('img');
		imgFrente.src = capturas[0]; // Imagen frente está en la primera posición de capturas
		imgPerfil.src = capturas[1]; // Imagen de perfil está en la segunda posición de capturas
        

		const analizarPose = async function () {
			//* ANALISIS MODELO POSE-DETECTION

			// Cargamos el modelo Pose-detection
			const modelPose = poseDetection.SupportedModels.BlazePose;
			const detectorConfig = {
				runtime: 'tfjs',
				enableSmoothing: false, // false para imagenes estaticas
				modelType: 'heavy', // Escogemos la configuracion mas precisa ( 'lite', 'full', 'heavy')
			};
			const detector = await poseDetection.createDetector(modelPose, detectorConfig); // detector? aparece así en la documentacion https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_tfjs

			// Utilizar la API de Pose Detection. Variables declaradas globalmente en datos-formulario.js
			const estimationConfig = { flipHorizontal: true };
			const timestamp = performance.now();
			posesFrente = await detector.estimatePoses(imgFrente, estimationConfig, timestamp); // posesFrente = {score, keypoints, keypoints3D}
			posesPerfil = await detector.estimatePoses(imgPerfil, estimationConfig, timestamp);

			// Acceder a los puntos clave (landmarks). Variables declaradas globalmente en datos-formulario.js
			keypointsFrente = posesFrente[0].keypoints;  // keypointsFrente = {x, y, z, score, name}
			keypointsPerfil = posesPerfil[0].keypoints;
            keypoints3DFrente = posesFrente[0].keypoints3D; // keypoints3DFrente  = {x, y, z, score, name}
			keypoints3DPerfil = posesPerfil[0].keypoints3D; 

			// Utilizar el resultado puntos clave y puntos clave 3D
			// Aquí puedes procesar la segmentación según tus necesidades
            imprimirResultadosConsola();
            resolve(); //! PASARLO EN LA ULTIMA FUNCION QUE SE EJECUTE
		};

		const analizarSegmentacion = async function () {
			//* ANALISIS MODELO BODY-SEGMENTATION
			// Utilizar la API de Body-segmentation. Variables declaradas globalmente en datos-formulario.js
			bodySegmentationFrente = await bodySegmentation.segmentPersonParts(imgFrente);
			bodySegmentationPerfil = await bodySegmentation.segmentPersonParts(imgPerfil);

			// Utilizar el resultado de la segmentación
			// Aquí puedes procesar la segmentación según tus necesidades

			// Obtener la segmentación de las partes del cuerpo
			bodySegmentacionPartesFrente = bodySegmentationFrente.segmentation;
			bodySegmentacionPartesPerfil = bodySegmentationPerfil.segmentation;

			// Obtener la máscara de segmentación
			bodyMaskFrente = bodySegmentation.toMask(bodySegmentacionPartesFrente);
			bodyMaskPerfil = bodySegmentation.toMask(bodySegmentacionPartesPerfil);
            imprimirResultadosConsola();
		};

		function imprimirResultadosConsola() {
			console.log('Pose-Detection poses', posesFrente, posesPerfil);
			console.log('Pose-Detection keypoints', keypointsFrente, keypointsPerfil);
			console.log('Body-segmentation bodySegmentation', bodySegmentationFrente, bodySegmentationPerfil);
			console.log(
				'Body-segmentation bodySegmentacionPartes',
				bodySegmentacionPartesFrente,
				bodySegmentacionPartesPerfil
			);
			console.log('Body-segmentation bodyMask', bodyMaskFrente, bodyMaskPerfil);
		}

		try {
			//async
            // Nos aseguramos que TensorFlow.js está cargado antes de iniciar lso modelos
            await tf.ready();
            await tf.setBackend('webgl');
			analizarPose();
			//analizarSegmentacion();
			//imprimirResultadosConsola(); // segun la tiene se ejecuta antes que el resto
			//await analizarPose();
			// Al finalizar todos los procesos de imagesTensorFlow(), resolver la promesa
			
		} catch (error) {
			// En caso de error, llamar a reject()
			reject(error);
		}
		//resolve();
	});
}
