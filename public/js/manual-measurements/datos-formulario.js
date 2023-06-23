'use strict';

/* ESTE SCRIPT RECOGE LOS DATOS DEL FORMULARIO DEL ARCHIVO 
	manual-measurements.html Y LOS RECOGE EN LA VARIABLE
	datosFormulario DESPUES LLAMA A LA FUNCION pantallaWebcam()
	QUE SE ENCUENTRA DECLARADA EN pantalla-webcam.js*/

//----------------------------

//* SCRIPT PARA LA RECOGER LA INTRODUCCION MANUAL DE MEDIDAS DEL USUARIO DESDE EL FORMULARIO

//----------------------------

//Importamos las librerías TensorFlow.js y mdoelos
const tf = window.tf; // necesario?
const poseDetection = window.poseDetection; // necesario?
const bodySegmentation = window.bodySegmentation;
const bodyPix = window.bodyPix; // BodyPix antiguo NO FUNCIONA

//* DECLARACION DE VARIABLES *//

//* Para datos-formulario.js
let datosFormulario; // Variable que contendrá los datos del formualrio. Servira para dibujar el patrón desde body-viewer.js y los scripts de la carpeta construccion-body-viewer
//let datason; // Varieable que sirve tras implementación del back-end para enviar los datos del formulario en formato JSON

//*Se usan en pantalla-webcam.js
// ARREGLOS PARA ALMACENAR LAS CAPTURAS DE PANTALLA Y LOS PUNTOS SELECCIONADOS EN LAS CAPTURAS
const capturas = [];
const ptosClave = ['centroDelanteroConCintura', 'pezon', 'lateralConCadera', 'puntaHombro', 'caidaHombro']; // Este arreglo contiene los puntos que el usuario debe seleccioanr tanto en la iamgen de frente como de perfil
/* Los puntos clave del cuerpo junto con las medidas que aporte permiten establecer todo el patrón pues son a partir de estos puntos donde se toman manualmente las medidas en el cuerpo*/
const ptosFrente = {};
const ptosPerfil = {};

//*Se usan en images-tensorflow.js
// Alamcenar a los puntos clave (landmarks) y conexiones del esqueleto despues de usar Pose-detection
let posesFrente, posesPerfil; // {score, keypoints, keypoints3D}
let keypointsFrente, keypointsPerfil; // {x, y, z, score, name}
let keypoints3DFrente, keypoints3DPerfil; // {x, y, z, score, name}
// Almacenar segmentacion despues de usar Body-segmentation
let segmentacionFrente, segmentacionPerfil;
let maskFrente, maskPerfil;
let segmentacionPartesFrente, segmentacionPartesPerfil;
let maskPartesFrente, maskPartesPerfil;

//----------------------------

//* DECLARACION DE FUNCIONES

// FUNCIONES PARA LA RECOGIDA DE LOS DATOS DEL FORMULARIO //
const tomaDatos = (event) => {
	//*Para una accion predeterminada del evento
	event.preventDefault(); // No realiza el proceso que el evento (en este caso le pasamos sumit a esta función sumit) tenga por defecto que es actualizar el formulario
	// Tomamos el valor de la decision del usuario de enviar sus datos o no al back-end
	const decisionDatos = document.querySelector('input[type=radio][name=decision-datos]:checked').value;
	// Convierto el string obtenido a valor booleano (sino "false" lo identifica como booleano true porque es una cadena y no esta vacia)
	let datos; // creo una variable para introducir los datoe que lleguen del formulario
	let decisionBoo; // Declaro una variable para recoger la decisión del usuario de mandar sus datos a la base o no
	if (decisionDatos.toLowerCase() === 'true') {
		decisionBoo = true;
	}
	if (decisionDatos.toLowerCase() === 'false') {
		decisionBoo = false;
	}
	console.log(decisionDatos);
	console.log(decisionBoo);
	//* Envolvemos el código en una promesa para asegurarnos que se han tomado lso datos
	return new Promise((resolve, reject) => {
		//* Evaluamos la decisión con un condicional
		if (!decisionBoo) {
			alert('Tus datos no serán enviados');
			// Introduciremos los datos en un objeto (datos) para poder generar nuestro molde
			const datosFormData = new FormData(event.target); // Pasamos los datos-formulario a un objeto tipo FormData. Target se refiere al form y si apareciese this se referiría al boton (hijos dentro del form que portan el evento)?
			datos = Object.fromEntries(datosFormData.entries()); // datos es un objeto de Javascript que me sirve para generar mi molde. Prefiero tener fuera de la función los datos para pasarlo al script molde.js
			// console.log(datos);
			//* Comvierto los datos recogidos que sean numeros a float (medidas y edad) y en resto lo dejo en string
			// Recorrer las propiedades del objeto "datos"
			for (let key in datos) {
				// Verificar si el valor es un string y si es un número válido
				if (typeof datos[key] === 'string' && !isNaN(parseFloat(datos[key]))) {
					// Convertir el string a tipo float y actualizas el valor en el objeto
					datos[key] = parseFloat(datos[key]);
				}
			}
			//* Asigno lso datos a mi variable global datosFormulario
			datosFormulario = datos;
			//--
			resolve(); // pantallaWebcam();
			//--
		} else {
			alert('Tus datos serán enviados');
			//* FormDataAPI es una Api que nos provee formas de obtener datos de los formularios
			// Constructor que crea un objeto de tipo FormData
			const datosFormData = new FormData(event.target);
			// El método Object.fromEntries() transforma una lista de pares con [clave-valor] en un objeto.
			datos = Object.fromEntries(datosFormData.entries()); // Datos es un objeto de Javascript que me sirve para generar mi molde
			// console.log(datos);
			//* Comvierto los datos recogidos que sean numeros a float (medidas y edad) y en resto lo dejo en string
			// Recorrer las propiedades del objeto "datos"
			for (let key in datos) {
				// Verificar si el valor es un string y si es un número válido
				if (typeof datos[key] === 'string' && !isNaN(parseFloat(datos[key]))) {
					// Convertir el string a tipo float y actualizas el valor en el objeto
					datos[key] = parseFloat(datos[key]);
				}
			}
			//const datason = JSON.stringify(datos); // Trasformo los datos a formato JSON en la variable datason para ser enviados al back-end
			//* Asigno lso datos a mi variable global datosFormulario
			datosFormulario = datos;
			//--
			resolve(); // pantallaWebcam();
			//--
		}
	});
};

/*Funcion para extraer un solo dato del formulario (NO SE VA A EMPLEAR)*/
// const tomaDato = (event) => {
// 	/*Para una accion predeterminada del evento*/
// 	event.preventDefault();
// 	/*constructor que crea un objeto de tipo FormData */
// 	const datoFormData = new FormData(event.target);
// 	/*El metodo get retorna el valor associado con la clave del objeto FormData */
// 	const edad = datoFormData.get('edad');
// 	console.log({ edad });
// };

/* Función para eliminar los elementos del DOM <form id="#datos-formulario"> 
	y <div class=svg-container> y pasar al código de capturas de la webcam
	COLOCAMOS ESTA FUNCION EN ARCHIVO pantalla-webcam.js PARA DIVIDIR UN POCO EL CODIGO*/
// function pantallaWebcam() {
// 	console.log('Ya podemos pasar al siguiente apartado ahora que tenemos los datos del formulario');
// 	console.log(datosFormulario);
// }

//----------------------------

//* RECOGIDA DE LOS DATOS DEL FORMULARIO *//
// Escucha el evento 'submit' del botón del formulario y llama a la función 'tomaDatos'
const formulario = document.querySelector('#datos-formulario');
// formulario.addEventListener('submit', tomaDatos);
formulario.addEventListener('submit', async (event) => {
	try {
		await tomaDatos(event);
		await pantallaWebcam();
		console.log('Se han capturado datos en los arreglos capturas, ptosFrente y ptosPerfil');
		await imagesTensorFlow(); // https://www.youtube.com/watch?v=41VfSbuYBP0
		/* Aqui realmente te interesaria que imagesTensorFlow() se ejecutase nada mas que  
		pantallaWebcam() capturase en captures las imagenes para hacer la ejecucion del 
		codigo mas corta, no esperar a que termine pantallaWebcam() para ejecutar el analisis 
		con modelos declarados en imagesTensorFlow() y que es bastante lento*/
		await saberPorDondeVamos();
	} catch (error) {
		console.error('Error en la ejecución del formulario', error);
	}
});

//----------------------------

function saberPorDondeVamos() {
	console.log('Hemos llegado hasta aquí!');
}
