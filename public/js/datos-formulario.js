'use strict';

//* SCRIPT PARA LA RECOGER LA INTRODUCCION MANUAL DE MEDIDAS DEL USUARIO DESDE EL FORMULARIO
let datosFormulario;
let datason;

// *FUNCIONES PARA LA RECOGIDA DE LOS DATOS DEL FORMULARIO *//
const obtenerDatosFormulario = () => {
	return new Promise((resolve, reject) => {
		//* RECOGIDA DE LOS DATOS DEL FORMULARIO *//
		const formulario = document.querySelector('#datos-formulario');

		const tomaDatos = (event) => {
			//*Para una accion predeterminada del evento
			event.preventDefault(); // No realiza el proceso que el evento (en este caso le pasamos sumit a esta función sumit) tenga por defecto que es actualizar el formulario
			// Tomamos el valor de la decision del usuario de enviar sus datos o no al back-end
			const decisionDatos = document.querySelector('input[type=radio][name=decision-datos]:checked').value;
			// Convierto el string obtenido a valor booleano (sino "false" lo identifica como booleano true porque es una cadena y no esta vacia)
			let decisionBoo = true; // Doy un valor inicial true
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
				datosFormulario = Object.fromEntries(datosFormData.entries()); // datos es un objeto de Javascript que me sirve para generar mi molde. Prefiero tener fuera de la función los datos para pasarlo al script molde.js
				console.log(datosFormulario);
			} else {
				alert('Tus datos serán enviados');
				//* FormDataAPI es una Api que nos provee formas de obtener datos de los formularios
				// Constructor que crea un objeto de tipo FormData
				const datosFormData = new FormData(event.target);
				// El método Object.fromEntries() transforma una lista de pares con [clave-valor] en un objeto.
				datosFormulario = Object.fromEntries(datosFormData.entries()); // Datos es un objeto de Javascript que me sirve para generar mi molde
				// const datason = JSON.stringify(datos); // Meto los datos en formato JSON en la variable datason para ser enviados al back-end
				console.log(datosFormulario);
				//console.log(datason);
			}
			resolve(datosFormulario); //!pido que me devuelva los datos para enviarlos al script molde.js
		};
		formulario.addEventListener('submit', tomaDatos);
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

//* RECOGIDA DE LOS DATOS DEL FORMULARIO *//
//const formulario = document.querySelector('#datos-formulario'); //meto el formulario en una variable para acceder a el cuando lo desee
// Ahora mediante el metodo addEventListener  ejecuto la función toma Datos cuando el evento submit del formulario se produzca
//formulario.addEventListener('submit', tomaDatos); //funciones del archivo js/toma-medidas.js. Toma los datos y los pone en formato JSON para enviarlos al Back-end
//datosFormulario = formulario.addEventListener('submit', tomaDatos); // meto los datos devueltos a un objeto datosFormulario

//TODO pensar si mandarlos ya en formato JSON o mandarlos como objeto y pasarlos a JSON cuadno se estriban alli
datason = JSON.stringify(datosFormulario); // Meto los datos en formato JSON en la variable datason para ser enviados al back-end
console.log(datason);

//* ESTOS DATOS SE ENVIARAN EN UN OBJETO AL SCRIPT ./construccion-body-viewer/molde.js PARA QUE SE GENERE EL PATRON CON ELLOS*//
//export default { obtenerDatosFormulario }; //! EXPORTO ESTA FUNCION
//module.exports = { obtenerDatosFormulario };

export default obtenerDatosFormulario;
