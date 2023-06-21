// ESTA FUNCION ES LLAMADA DESDE datos-formulario.js se ejecuta despues de pantallaWebcam() que se encuentra delcarada en pantalla-webcam.js

'use strict';

/* ESTE SCRIPT ELIMINA LOS ELEMENTOS DEL DOM DEL ARCHIVO 
	manual-measurements.html QUE HAN SIDO COLOCADOS MEDIANTE 
    CODIGO JS DESDE EL ARCHIVO pantalla.webcam.js Y COLOCA 
    UNOS NUEVOS PARA DESPUES PASAR A EJECUTAR EL CODIGO QUE
    ANALIZA MEDIANTE LOS MODELOS PRE-ENTRENADOS POS-DETECTION (DEVUELVE 
    KEYPOINTS/SKELETON) Y BODY SEGMENTATION (DEVULVE ZONAS DEL CUERPO) 
    LAS IMAGENES CAPTURADAS DE FRENTE Y PERFIL DEL CUERPO CON EL SCRIPT 
    pantalla-webacam.js Y QUE SE ENCUENTRAN EN LA VARIABLE GLOBAL
    capturas declarada en datos-formulario.js */

//----------------------------

//----------------------------

function imagesTensorFlow() {

    //----------------------------

    // SCRIPTS tensorFlow.js y los modelos en el <head> de manual-measurements.html
    // const tf = window.tf;
    // const poseDetection = window.poseDetection;

    //----------------------------

	//! REORDENAR LAS ELIMINACIONES PARA QUE ESTEN EN LA FUNCION DONDE SE CREARON
	//* Eliminamos los elementos del DOM que no necesitamos y creamos los que nos van a servir para ver nuestras imágenes analizadas por los modelos
	const fondo = document.querySelector('.fondo');
	const contenedorVideo = document.querySelector('.contenedor-video');
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

    // Utilizar la API de Pose Detection
    const posesFrente = await tf.poseDetection.estimatePoses(imgFrente);
    const posesPerfil = await tf.poseDetection.estimatePoses(imgPerfil);

    // Acceder a los puntos clave (landmarks) y conexiones del esqueleto. Variables declaradas globalmente en datos-formulario.js
    keypointsFrente = posesFrente[0].keypoints;
    keypointsPerfil = posesPerfil[0].keypoints;
    skeletonFrente = posesFrente[0].skeleton; // No lo vas a usar
    skeletonPerfil = posesPerfil[0].skeleton; // No lo vas a usar

    // Utilizar los datos obtenidos
    // Aquí puedes procesar los puntos clave y las conexiones del esqueleto según tus necesidades

    // Utilizar el módulo tf.bodySegmentation
    const segmentationFrente = await tf.bodySegmentation.segmentPerson(imgFrente);
    const segmentationPerfil = await tf.bodySegmentation.segmentPerson(imgPerfil);

    // Utilizar el resultado de la segmentación
    // Aquí puedes procesar la segmentación según tus necesidades
}
