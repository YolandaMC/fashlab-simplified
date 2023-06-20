'use strict';

//* SCRIPT PARA LA RECOGER LA INTRODUCCION MANUAL DE MEDIDAS DEL USUARIO DESDE EL FORMULARIO
let datosFormulario;
let datason;

// *FUNCIONES PARA LA RECOGIDA DE LOS DATOS DEL FORMULARIO *//
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
	//* Evaluamos la decisión con un condicional
	if (!decisionBoo) {
		alert('Tus datos no serán enviados');
		// Introduciremos los datos en un objeto (datos) para poder generar nuestro molde
		const datosFormData = new FormData(event.target); // Pasamos los datos-formulario a un objeto tipo FormData. Target se refiere al form y si apareciese this se referiría al boton (hijos dentro del form que portan el evento)?
		datos = Object.fromEntries(datosFormData.entries()); // datos es un objeto de Javascript que me sirve para generar mi molde. Prefiero tener fuera de la función los datos para pasarlo al script molde.js
		console.log(datos);
		//* Asigno lso datos a mi variable global datosFormulario
		datosFormulario = datos;
		//--
		draw();

		//--
	} else {
		alert('Tus datos serán enviados');
		//* FormDataAPI es una Api que nos provee formas de obtener datos de los formularios
		// Constructor que crea un objeto de tipo FormData
		const datosFormData = new FormData(event.target);
		// El método Object.fromEntries() transforma una lista de pares con [clave-valor] en un objeto.
		datos = Object.fromEntries(datosFormData.entries()); // Datos es un objeto de Javascript que me sirve para generar mi molde
		//const datason = JSON.stringify(datos); // Trasformo los datos a formato JSON en la variable datason para ser enviados al back-end
		console.log(datos);
		//* Asigno lso datos a mi variable global datosFormulario
		datosFormulario = datos;
		//--
		draw();
		//--
	}
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

// 	//* RECOGIDA DE LOS DATOS DEL FORMULARIO *//
// Promesa para obtener los datos del formulario
// Escucha el evento 'submit' del botón del formulario y llama a la función 'tomaDatos'
const formulario = document.querySelector('#datos-formulario');
formulario.addEventListener('submit', tomaDatos);

function draw() {
	console.log('Ya podemos pasar al siguiente apartado');
	console.log(datosFormulario);
}
