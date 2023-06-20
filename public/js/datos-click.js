'use strict';

//* SCRIPT PARA LA TOMA DE IMAGENES DE FRENTE Y PERFIL DEL USUARIO DESDE LA WEBCAM ASI COMO LOS PUNTOS CLAVE QUE ESTE INDIQUE

// Obtener elementos del DOM
const botonCapturar = document.getElementById('boton-capturar');
const contenedorVideo = document.getElementById('contenedor-video');
const canvasCapturas = document.getElementById('canvas-capturas');
const ctxCapturas = canvasCapturas.getContext('2d');

// Arreglo para almacenar las capturas de pantalla y los puntos seleccionados de las capturas
const capturas = [];
const ptosFrente = {};
const ptosPerfil = {};
// Tiempo entre capturas de pantalla
const tiempoCapturas = 2000;
// Variable para almacenar el índice de la captura actual para poder mostrarlas en el DOM una tras otra
let capturaActual = 0;

// Variable para almacenar el elemento de video y elemento spande inicio
let video;
let mensajeEspera;

// Se definen unos tamaños iniciales para el elemento canvas donde se mosrtarán las capturas de pantalla, pero luego se tomara el tamaño de resolucion de la propia webcam
canvasCapturas.width = 640;
canvasCapturas.height = 480;

// Función para obtener la lista de dispositivos de entrada de vídeo
async function obtenerDispositivosVideo() {
	const dispositivos = await navigator.mediaDevices.enumerateDevices();
	return dispositivos.filter((device) => device.kind === 'videoinput');
}

// Función para obtener el stream de la webcam
async function obtenerStreamWebcam() {
	const dispositivosVideo = await obtenerDispositivosVideo();
	if (dispositivosVideo.length === 0) {
		throw new Error('No se encontraron dispositivos de video disponibles.');
	}

	const stream = await navigator.mediaDevices.getUserMedia({
		// Constraints (objeto) que especifica los tipos de recursos a solicitar
		audio: false,
		video: {
			deviceId: dispositivosVideo[0].deviceId,
			// Tamaños aceptados para navegadores modernos
			width: { exact: 640 },
			height: { exact: 480 },
		},
	});

	return stream;
}

// Función para mostrar el video de la webcam en pantalla
async function mostrarVideoWebcam() {
	try {
		const stream = await obtenerStreamWebcam(); // La función obtenerStreamWebcam() devuelve stream
		const video = document.createElement('video');
		video.srcObject = stream;
		// video.width = 640; // No necesario pues hemos establecido como requisito estos tamaños en los recursos a solicitar
		// video.height = 480;
		contenedorVideo.appendChild(video);
		video.play();
		setTimeout(function () {
			capturarFrame(video);
			setTimeout(function () {
				capturarFrame(video);
				cerrarWebcam(video, stream);
				// crear el primer canvas y mostrar la priemra imagen
				mostrarCapturas();
				//TODO seguir con el codigo de despues aqui
			}, tiempoCapturas);
		}, tiempoCapturas);
	} catch (error) {
		console.error('Error al acceder a la cámara web:', error);
	}
}

// Función que realiza el proceso de captura de los frame del video
function capturarFrame(video) {
	const canvas = document.createElement('canvas');
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	const context = canvas.getContext('2d');
	context.drawImage(video, 0, 0, canvas.width, canvas.height);
	capturas.push(canvas.toDataURL('image/png'));
}

// Función que se encarga de cerrar la transmisión una vez finalizada las capturas
function cerrarWebcam(video, stream) {
	video.pause();
	video.srcObject = null;
	stream.getTracks().forEach(function (track) {
		track.stop();
	});
	contenedorVideo.removeChild(video);
}

// Función que indica que se han tomado las capturas y que se va a proceder a colocarlas en el DOM
function mostrarCapturas() {
	const span = document.createElement('span');
	span.textContent = 'Capturas realizadas';
	document.body.appendChild(span);
	console.log(capturas);
	// Retardo para mostrar un mensaje sobre la capturas webcam realizadas con éxito
	setTimeout(function () {
		document.body.removeChild(span);
		// Agregar el evento de click al canvas
		canvasCapturas.addEventListener('click', manejarClickFrente);
		// Llamar a la función que pone una a una las capturas en el canvas
		mostrarCapturaEnCanvas();
	}, 1500);
}

// Función para mostrar la captura en formato data:image/png  en el elemento canvas
function mostrarCapturaEnCanvas() {
	const img = new Image();
	img.onload = () => {
		ctxCapturas.clearRect(0, 0, canvasCapturas.width, canvasCapturas.height);
		ctxCapturas.drawImage(img, 0, 0, canvasCapturas.width, canvasCapturas.height);
	};
	img.src = capturas[capturaActual];
}

// Función que me permite tomar las coordenadas de los puntos clave de la captura de Frente
function manejarClickFrente(event) {
	const rect = canvasCapturas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	const punto = `pto${Object.keys(ptosFrente).length + 1}`;
	ptosFrente[punto] = [x, y];
	dibujarPunto(x, y);
	if (Object.keys(ptosFrente).length === 10) {
		setTimeout(function () {
			capturaActual++;
			// Limpiar el canvas
			ctxCapturas.clearRect(0, 0, canvasCapturas.width, canvasCapturas.height);
			// Mostrar la siguiente imagen
			mostrarCapturaEnCanvas();
			// Cambiar el evento de click para manejar la imagen de perfil
			canvasCapturas.removeEventListener('click', manejarClickFrente);
			canvasCapturas.addEventListener('click', manejarClickPerfil);
		}, 500);
	}
}

// Función que me permite tomar las coordenadas de los puntos clave de la captura de Perfil
function manejarClickPerfil(event) {
	const rect = canvasCapturas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	const punto = `pto${Object.keys(ptosPerfil).length + 1}`;
	ptosPerfil[punto] = [x, y];
	dibujarPunto(x, y);
	if (Object.keys(ptosPerfil).length === 10) {
		canvasCapturas.removeEventListener('click', manejarClickPerfil);
		mostrarResultados();
	}
}

// Función para dibujar un punto en el canvas para marcar visualmente los puntos marcados al usuario
function dibujarPunto(x, y) {
	ctxCapturas.fillStyle = 'red';
	ctxCapturas.beginPath();
	ctxCapturas.arc(x, y, 3, 0, 2 * Math.PI);
	ctxCapturas.fill();
}

// Función para mostrar los resultados finales
function mostrarResultados() {
	console.log('Puntos del frente:', ptosFrente);
	console.log('Puntos del perfil:', ptosPerfil);
}

//Función para crear el elemento <span> que me da un aviso de espera para que se inice la conexión de la webcam
function crearMensajeEspera() {
	mensajeEspera = document.createElement('span');
	mensajeEspera.innerText = 'Espere un momento...';
	mensajeEspera.style.display = 'none';
	contenedorVideo.appendChild(mensajeEspera);
}

//* Inicio del código o procesos con el evento click asociado al botón de capturar*//

// Llamada a la función para crear el elemento <span> crearMensajeEspera() se llama antes de agregar el evento de clic al botón "Capturar imagen", lo que garantiza que el elemento <span> esté presente en el DOM cuando se necesite.
crearMensajeEspera();

//TODO Evento de clic del botón para iniciar todo el proceso
botonCapturar.addEventListener('click', async () => {
	botonCapturar.disabled = true;
	botonCapturar.style.display = 'none';
	mensajeEspera.style.display = 'inline';
	setTimeout(async () => {
		mensajeEspera.style.display = 'none';
		await mostrarVideoWebcam();
	}, 1500);
});

//* ESTOS DATOS SE ENVIARAN EN UN OBJETO AL SCRIPT ./construccion-body-viewer/silueta.js PARA QUE GENERE UN SVG CON LA SILUETA Y LOS PUNTOS CLAVE*//
