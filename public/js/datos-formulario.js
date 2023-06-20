'use strict';

/* ESTE SCRIPT RECOGE LOS DATOS DEL FORMULARIO DEL ARCHIVO 
	manual-measurements.html Y LOS RECOGE EN LA VARIABLE
	datosFormulario DESPUES LLAMA A LA FUNCION pantallaWebcam()
	QUE SE ENCUENTRA DECLARADA EN pantalla-webcam.js*/

//----------------------------

//* SCRIPT PARA LA RECOGER LA INTRODUCCION MANUAL DE MEDIDAS DEL USUARIO DESDE EL FORMULARIO
let datosFormulario; // Variable que contendrá los datos del formualrio
//let datason; // Varieable que sirve tras implementación del back-end para enviar los datos del formulario en formato JSON

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
			//const datason = JSON.stringify(datos); // Trasformo los datos a formato JSON en la variable datason para ser enviados al back-end
			// console.log(datos);
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
formulario.addEventListener('submit', (event) => {
	//El evento submit inicia toda la ejecucion del código con la recogida de los datos del formulario
	tomaDatos(event)
		.then(() => {
			pantallaWebcam(); // ESTA FUNCION ESTA DECLARADA EN pantalla-webcam.js
		})
		.catch((error) => {
			console.error('Error al obtener los datos del formulario', error);
		});
});

//----------------------------
