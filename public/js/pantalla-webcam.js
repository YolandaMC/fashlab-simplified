// ESTA FUNCION ES LLAMADA DESDE datos-formulario.js

'use strict';

/* ESTE SCRIPT ELIMINA LOS ELEMENTOS DEL DOM DEL ARCHIVO 
	manual-measurements.html Y COLOCA UNOS NUEVOS PARA
    DESPUES PASA A EJECUTAR EL CODIGO PARA CAPTURAR 
	LAS IMAGENES DE FRENTE Y PERFIL DEL CUERPO DESDE
	LA WEBCAM Y TOAMR LOS PUNTOS QUE EL USUARIO SELECCIONE
	DE LOS PUNTOS CLAVE DEL CUERPO */

//----------------------------

//TODO DENTRO DE ESTE CODIGO DEBERAS METER TAMBIEN CUANDO CAPTURES LAS IMAGENES SU PROCESAMIENTO CON EL MODELO PRE-ENTRENADO ESCOGIDO

//* Funcion para eliminar los elementos del DOM <form id="#datos-formulario"> y <div class=svg-container> *//
function pantallaWebcam() {
	console.log('Ya podemos pasar al siguiente apartado ahora que tenemos los datos del formulario');
	console.log(datosFormulario);

	//* ELIMINAMOS ELEMENTOS DOM INNECESARIOS ANTES DE PASAR A CREAR LOS DE LA PANTALLA TOMA DE CAPTURAS DESDE LA WEBCAM Y DATOS CLICKS *//
	const fondo = document.querySelector('.fondo');
	fondo.style.flexDirection = 'column';
	const sectionLeft = document.querySelector('.section-left');
	const sectionRight = document.querySelector('.section-right');
	fondo.removeChild(sectionLeft);
	fondo.removeChild(sectionRight);
	//* CREAMOS LOS ELEMENTOS DEL DOM QUE NOS VAN A PERMITIR TOMAR LAS CAPTURAS DE PANTALLA DE LA WEBCAM Y DATOS CLICKS *//
	// Creamos el contenedor de video que contendrá el video capurado desde la webcam
	const contenedorVideo = document.createElement('div');
	contenedorVideo.id = 'contenedor-video';
	fondo.appendChild(contenedorVideo);
	// Creamos un mensaje de información
	const infoCapturas = document.createElement('h4');
	infoCapturas.innerHTML =
		'Pulse el botón capturar para iniciar la webcam,<br>se tomarán dos imágenes, una de frente y otra de perfil,<br>tiene 10segundos entre captura y captura para colocarse';
	infoCapturas.style.margin = '20px 30px';
	infoCapturas.style.textAlign = 'center'; // justificacion texto
	infoCapturas.style.lineHeight = '1.5'; // interlineado texto
	contenedorVideo.appendChild(infoCapturas);
	// Creamos el boton que inicia el proceso de toma de captura desde la webcam
	const botonCapturar = document.createElement('button');
	botonCapturar.id = 'boton-capturar';
	botonCapturar.textContent = 'Capturar imagen';
	fondo.appendChild(botonCapturar);

	//------------------------------------

	//------------------------------------

	//TODO METER AQUI TODO EL CODIGO DE datos-click.js

	//* SCRIPT PARA LA TOMA DE IMAGENES DE FRENTE Y PERFIL DEL USUARIO DESDE LA WEBCAM ASI COMO LOS PUNTOS CLAVE QUE ESTE INDIQUE
	// Obtener elementos del DOM
	//const botonCapturar = document.getElementById('boton-capturar'); // Lo he creado mediante JS arriba
	//const contenedorVideo = document.getElementById('contenedor-video'); // Lo he creado mediante JS arriba
	//const canvasCapturas = document.getElementById('canvas-capturas'); // Lo voy a crear más tarde mediante JS
	//const ctxCapturas = canvasCapturas.getContext('2d'); // Lo voy a crear más tarde mediante JS
	let canvasCapturas, ctxCapturas; // Van a contener un canvas y su getContext('2d') Lo voy a crear más tarde mediante JS

	// Arreglo para almacenar las capturas de pantalla y los puntos seleccionados de las capturas
	const capturas = [];
	const ptosClave = ['pecho', 'cadera', 'cintura']; // Este arreglo contiene los puntos que el usuario debe seleccioanr tanto en la iamgen de frente como de perfil
	const ptosFrente = {};
	const ptosPerfil = {};
	// Tiempo entre capturas de pantalla
	const tiempoCapturas = 2000; // AUMENTAR A 10s POR LO MENOS PARA DAR TIEMPO AL USUARIO A COLOCARSE
	// Variable para almacenar el índice de la captura actual para poder mostrarlas en el DOM una tras otra
	let capturaActual = 0;

	// Variable para almacenar el elemento de video y elemento spande inicio
	let video;
	let mensajeEspera;

	// Se definen unos tamaños iniciales para el elemento canvas donde se mosrtarán las capturas de pantalla, pero luego se tomara el tamaño de resolucion de la propia webcam
	//canvasCapturas.width = 640;
	//canvasCapturas.height = 480;
	let widthCanvasCapturas = 640;
	let heightCanvasCapturas = 480;

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
				width: { exact: 640 }, //Mirar si podrían usarse un aspectRatio mayor
				height: { exact: 480 }, // Si lo cambias debes cambiar tambien widthCanvasCapturas y heightCanvasCapturas
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
					// crea canvas y mostrar la priemra imagen
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
		const canvas = document.createElement('canvas'); // Lo creo pero no lo pongo en el DOM porque no quiero que se vean mis imagenes hasta que no las decida yo mostrar mas tarde cuando cierre la camara y elimine el video
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const context = canvas.getContext('2d');
		context.drawImage(video, 0, 0, canvas.width, canvas.height);
		capturas.push(canvas.toDataURL('image/png')); // guardo las capturas en la variable capturas, luego la recuperare para ananizarla con el modelo pre-entrenado y TensorFlow
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
		// document.body.appendChild(span);
		contenedorVideo.appendChild(span); //!
		console.log(capturas);
		// Retardo para mostrar un mensaje sobre la capturas webcam realizadas con éxito
		setTimeout(function () {
			//document.body.removeChild(span);
			contenedorVideo.removeChild(span);
			//!
			//* Creo los elementos en el DOM que me permiten mostrar las capturas realizadas
			canvasCapturas = document.createElement('canvas'); // Lo voy a crear más tarde mediante JS
			canvasCapturas.id = 'canvas-capturas';
			contenedorVideo.appendChild(canvasCapturas); // Coloco el canvas en el msimo contenedor del video
			ctxCapturas = canvasCapturas.getContext('2d'); // Lo voy a crear más tarde mediante JS
			// inicio el canvas con unas medidas
			canvasCapturas.width = widthCanvasCapturas;
			canvasCapturas.height = heightCanvasCapturas;
			// Agregar el evento de click al canvas
			canvasCapturas.addEventListener('click', manejarClickFrente); // Este evento llama primero a la función que debe actuar sobre la primera imagen guardada dentro de ella se llamara a mostrarCapturaEnCanvas() para que muestre la segunda foto y habrá un evento que llame a la funcion manejarClickPerfil para capturas los cliks sobre ella
			// Llamar a la función que pone una a una las capturas en el canvas
			mostrarCapturaEnCanvas();
		}, 1000);
	}
	//!!!!!!!!!!!!!!!!!!!!!!!!!
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

		// Asi los puntos se gusrdan como punto 1, punto 2, vamos a guardarlos con las medidas que corresponde gracias a un arreglo de arriba y la función forEach que permite recorrerlo
		// const punto = `pto${Object.keys(ptosFrente).length + 1}`;
		// ptosFrente[punto] = [x, y];
		// Asignar valores a las propiedades específicas del objeto usando el arreglo de medidas
		// Verificar si ya se han seleccionado todos los puntos clave
		if (Object.keys(ptosFrente).length < ptosClave.length) {
			const punto = ptosClave[Object.keys(ptosFrente).length];
			ptosFrente[punto] = [x, y];
			dibujarPunto(x, y);
		}

		if (Object.keys(ptosFrente).length === ptosClave.length) {
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

		// Asi los puntos se gusrdan como punto 1, punto 2, vamos a guardarlos con las medidas que corresponde gracias a un arreglo de arriba y la función forEach que permite recorrerlo
		// const punto = `pto${Object.keys(ptosPerfil).length + 1}`;
		// ptosPerfil[punto] = [x, y];
		// Asignar valores a las propiedades específicas del objeto usando el arreglo de medidas
		// Verificar si ya se han seleccionado todos los puntos clave
		if (Object.keys(ptosPerfil).length < ptosClave.length) {
			const punto = ptosClave[Object.keys(ptosPerfil).length];
			ptosPerfil[punto] = [x, y];
			dibujarPunto(x, y);
		}

		// Verificar si se han seleccionado todos los puntos clave
		if (Object.keys(ptosPerfil).length === ptosClave.length) {
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

		//TODO SEGUIR AQUI CON EL RESTO DE CODIGO
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
		contenedorVideo.removeChild(infoCapturas);
		mensajeEspera.style.display = 'inline';
		setTimeout(async () => {
			mensajeEspera.style.display = 'none';
			await mostrarVideoWebcam();
		}, 1500);
	});

	//* ESTOS DATOS SE ENVIARAN EN UN OBJETO AL SCRIPT ./construccion-body-viewer/silueta.js PARA QUE GENERE UN SVG CON LA SILUETA Y LOS PUNTOS CLAVE*//
}
