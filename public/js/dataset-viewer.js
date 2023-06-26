//* IMPORTACIONES Y METODOS*//
//Importamos la libreria D3.js
//const d3 = d3;
const { json, select, selectAll } = d3; //Traemos el metodo para recuperar datos JSON, los métodos select y selectAll que nos permiten trabajar con lso elementos del DOM de la biblioteca D3.js
//Importamos la libreria TensorFlow.js
const tf = window.tf;

//-------------

//-------------

//* VARIABLES A NIVEL GLOBAL*//
// Creo dataset en la introduciré la base de datos
// Creo ranges para alojar los resutados que me devuelva el modelo TensorFlow
// Creo viewer que contendra un elemento que creare para el DOM donde se alojara mi svg
let dataset, ranges, viewer;
let numRanges, labelType; // Alojaran las opciones del usuario establecidas en el DOM respecto a cada modelo de clasifiacción (Número de clases o )
//let numRanges = 3; // Luego lo cambiaras por el numero introducido en el DOM. Numero de rango que deseamos dividir el dataset en el caso del modelo con datos sin etiquetar
//let labelType = 'genero'; // Luego lo cambiaras por la opcion introducida en el DOM
let labelsTypes = ['sexo', 'genero']; // Establecemos en una lista las etiquetas que queramos como opcion para nuestro analisis de dataset con TensorFlow.js
//! OJO añadir condicion si numero segmentos escogidos mayor que el numero de registros en la base, debe tomarse el largo de la base como numero de segmentos

//-------------
//* Definir colores para cada cluster y resto de elementos
//const colors = ['red', 'green', 'blue', 'yellow'];
const colors = [
	// 80 == 50% opacidad
	'#5eb9c2',
	'#58cbc0',
	'#6adbb3',
	'#90e99e',
	'#c1f385',
	'#f9f871',
	'#5eb9c2',
	'#4ba6c9',
	'#5b8fc6',
	'#7b75b4',
	'#935891',
	'#9b3e63',
];
//-------------


//* DECLARACIONES *//
// DEclaracion de init que ejecutara todo el codigo del script
const init = (data) => {
	//console.log(data);
	dataset = data; // Asignamos data que contiene la base de datos a dataset
	// Funcion del modelo de Tensorflow para clasificar dataset. Esta a su vez llamará drawRanges
	//! Ahora deberas poner un addEvent Listener en los Inputs que permitan las selecciones y en funcion de ellos llamar a las funciones modelRanges y modelRangesWithLabel
	//! Lo agregaremos fuera de esta funcion y estableceremos que se inicie cuando el contenido del DOM este cargado addEventListener 'DOMContentLoaded'
	//modelRanges();
	//modelRangesLabel();
	//console.log(optionModel.value);

	//* Evaluamos las opciones tomadas por el usuario
	// Escuchar el evento change en los inputs radio
	const radioInputs = document.querySelectorAll('input[type="radio"][name="option-model"]');
	radioInputs.forEach((radio) => {
		radio.addEventListener('change', actualizarOptionModel); // esta es la funcion asociada al evento que a cada cambio de los inputs cambia el modelo a emplear y muestra las opciones para estos
	});
};

//* Función creada para evaluar las opciones tomadas por el usuario
// Para ello debemos asegurarnos que antes de evaluar el valor de la opción, el usuario haya seleccionado una
const actualizarOptionModel = () => {
	const noLabelModelRadio = document.querySelector('input[value="no-label-model"]');
	const labelModelRadio = document.querySelector('input[value="label-model"]');
	// Verificar si se ha seleccionado alguna opción

	if (noLabelModelRadio.checked) {
		console.log(noLabelModelRadio.value);

		// Crear el elemento range si no existe que permitira seleccionar el número de segmentacioens que queremos en neustra muestra
		let rangeInput = document.querySelector('#range-input'); //Seleccioanmos input range con id #range-input (si existe)
		// Si no existe lo creamos
		if (!rangeInput) {
			rangeInput = document.createElement('input');
			rangeInput.id = 'range-input';
			rangeInput.type = 'range';
			rangeInput.min = 1; // Minima segmentacion permitida
			rangeInput.max = 12; // Maxima segmentacion permitida
			rangeInput.value = 6; // Valor inicial 6
			rangeInput.class = 'num-ranges';
			rangeInput.step = '1';
			rangeInput.list = 'steplist';
			rangeInput.style.width = '100%';
			let datalist = document.createElement('datalist');
			datalist.id = 'steplist';
			datalist.style.display = 'flex';
			for (let i = rangeInput.min; i <= rangeInput.max; i++) {
				let option = document.createElement('option');
				option.textContent = i;
				option.style.width = '100%'; // Establecer el ancho al 100%
				option.style.backgroundColor = colors[i - 1];
				option.style.color = 'white';
				option.style.fontWeight = '600';
				option.style.textAlign = 'center';
				datalist.appendChild(option);
			}
			rangeInput.addEventListener('change', function () {
				// Obtener el valor seleccionado y realizar las acciones correspondientes
				console.log('Selected range value:', this.value);
				// Llamar a la función necesaria con el valor seleccionado
				// modelRangesWithValue(this.value);
				// Verificar si el valor seleccionado es mayor que el número de datos en dataset
				if (parseInt(this.value) > dataset.length) {
					numRanges = dataset.length; // en los casos en que la base de datos aun no tenga el número suficiente de muestras
				} else {
					numRanges = parseInt(this.value);
				}
				console.log(numRanges);

				//TODO
				/* En el caso que el usuario hay escogido numRanges = 1
					quiere decir ue no desea dividr la muestra sino 
					visualizarla completa por lo que no se llamara 
					a la funcion modelRanges(); sino a la funcion
					drawDataset() que dibuja la base de datos sin analizar*/
				if (numRanges == 1) {
					//* Función que pinta toda la muestra
					drawDataset();
					//console.log('la muestra se dibujará sin analizar');
				} else {
					//* Funcion del modelo de Tensorflow para clasificar dataset sin datos etiquetados. Esta a su vez llamara drawRanges
					// Divide la dataset en tantos numRanges como el usuario haya indicado en el DOM
					modelRanges();
				}
				//TODO
			});
			// Insertar el elemento range en el DOM
			const rangeContainer = document.querySelector('#range-container');
			rangeContainer.appendChild(datalist);
			rangeContainer.appendChild(rangeInput);
		}

		//* Limpiamos los elementos creados apra la otra opcion
		const labelContainer = document.querySelector('#label-container');
		labelContainer.innerHTML = '';
		const formularioContainer = document.querySelector('#formulario-container');
		formularioContainer.innerHTML = '';
		const resultadosContainer = document.querySelector('#resultados-formulario-container');
		resultadosContainer.innerHTML = ''; // Limpiar cualquier contenido anterior
		//* Reiniciar el valor de labelType si no se selecciona un input
		labelType = undefined;
	} else if (labelModelRadio.checked) {
		console.log(labelModelRadio.value);

		// Eliminar el elemento range si existe y la visualización de lso rangos que aparece encima
		const rangeInput = document.querySelector('#range-input');
		const datalist = document.querySelector('#steplist');
		if (rangeInput) {
			rangeInput.parentNode.removeChild(rangeInput);
			datalist.parentNode.removeChild(datalist);
		}

		// Generamos los radio inputs para las etiquetas posibles para el modelo
		const labelContainer = document.querySelector('#label-container');
		labelContainer.innerHTML = labelsTypes
			.map(
				(labelsTypes) => `<div>
				 <input type="radio" name="labelType" value="${labelsTypes}" id="${labelsTypes}">
				  <label for="${labelsTypes}">${labelsTypes}</label>
			 </div>`
			)
			.join(' ');
		//*Estilo para ubciar las opciones en el DOM
		labelContainer.style.margin = '0 25% 0 25%';
		labelContainer.style.display = 'flex';
		labelContainer.style.alingItems = 'center';
		labelContainer.style.justifyContent = 'space-between';
		// Añadimos un evento listener atento a cuadno se producen cambios de seleccion
		const radioLabels = document.querySelectorAll('input[name="labelType"]');
		for (const radioLabel of radioLabels) {
			radioLabel.addEventListener('change', runSelected);
		}
		function runSelected(e) {
			console.log(e);
			if (this.checked) {
				// console.log(this.value);
				//Actualizamos el valor de labelType con al seleccion
				labelType = this.value;
				console.log(labelType);
				//* Limpiamos los elementos creados apra la otra opcion
				const formularioContainer = document.querySelector('#formulario-container');
				formularioContainer.innerHTML = '';
				const resultadosContainer = document.querySelector('#resultados-formulario-container');
				resultadosContainer.innerHTML = ''; // Limpiar cualquier contenido anterior
				//* CREAMOS UN FORMULARIO APRA INTRODUCIR LOS DATOS QUE QUEREMOS PREDECIR EN BASE A LOS DATOS EQIQUETADOS DE LOS QUE DISPONEMOS
				crearFormulario(labelType);
				//Funcion para tomar los datos del formulario
				const formularioPrediccion = document.getElementById('datos-formulario-prediccion');
				formularioPrediccion.addEventListener('submit', async (event) => {
					try {
						const datosFormulario = await recogerDatosFormulario(event);
						console.log(datosFormulario);
						//TODO
						//* Funcion del modelo de Tensorflow para clasificar los datos introducidos a través de dataset con datos etiquetados.
						// Etiqueta la dataset en según la seleccion del usuario haya hecho en el DOM
						//modelLabel();
						//TODO
					} catch (error) {
						console.error('Error en la ejecución del formulario', error);
					}
				});
			}
		}
	}
};

function crearFormulario(labelType) {
	const formularioContainer = document.querySelector('#formulario-container');
	const formularioPrediccion = document.createElement('form');
	formularioPrediccion.setAttribute('class', 'datos-formulario');
	formularioPrediccion.setAttribute('id', 'datos-formulario-prediccion');
	// Crear el elemento fieldset
	const fieldset = document.createElement('fieldset');
	if (labelType === 'genero') {
		// Crear el contenedor select para el campo "Sexo asignado"
		const selectContainer1 = document.createElement('div');
		selectContainer1.setAttribute('class', 'selectcontainer');

		const label1 = document.createElement('label');
		label1.setAttribute('class', 'custom-selector');
		label1.setAttribute('for', 'sexo');
		label1.textContent = 'Sexo asignado:\n';

		const select1 = document.createElement('select');
		select1.setAttribute('name', 'sexo');
		select1.setAttribute('required', 'true');

		const option1 = document.createElement('option');
		option1.setAttribute('selected', 'true');
		option1.setAttribute('value', '');
		option1.textContent = 'Elige...';

		const option2 = document.createElement('option');
		option2.setAttribute('value', 'Intersexo');
		option2.textContent = 'Intersexo';

		const option3 = document.createElement('option');
		option3.setAttribute('value', 'Femenino');
		option3.textContent = 'Femenino';

		const option4 = document.createElement('option');
		option4.setAttribute('value', 'Masculino');
		option4.textContent = 'Masculino';

		const option5 = document.createElement('option');
		option5.setAttribute('value', 'Sin-respuesta');
		option5.textContent = 'No procede';

		// Agregar las opciones al select
		select1.appendChild(option1);
		select1.appendChild(option2);
		select1.appendChild(option3);
		select1.appendChild(option4);
		select1.appendChild(option5);
		// Agregar el select al label
		label1.appendChild(select1);
		// Agregar el label al contenedor select
		selectContainer1.appendChild(label1);
		// Agregar el contenedor select al fieldset
		fieldset.appendChild(selectContainer1);
	} else if (labelType === 'sexo') {
		// Crear el contenedor select para el campo "Identidad de género"
		const selectContainer2 = document.createElement('div');
		selectContainer2.setAttribute('class', 'selectcontainer');

		const label2 = document.createElement('label');
		label2.setAttribute('class', 'custom-selector');
		label2.setAttribute('for', 'genero');
		label2.textContent = 'Identidad de género:\n';

		const select2 = document.createElement('select');
		select2.setAttribute('name', 'genero');
		select2.setAttribute('required', 'true');

		const option6 = document.createElement('option');
		option6.setAttribute('selected', 'true');
		option6.setAttribute('value', '');
		option6.textContent = 'Elige...';

		const option7 = document.createElement('option');
		option7.setAttribute('value', 'No-binario');
		option7.textContent = 'No-binario/otras opciones';

		const option8 = document.createElement('option');
		option8.setAttribute('value', 'Mujer');
		option8.textContent = 'Mujer';

		const option9 = document.createElement('option');
		option9.setAttribute('value', 'Hombre');
		option9.textContent = 'Hombre';

		const option10 = document.createElement('option');
		option10.setAttribute('value', 'Sin-respuesta');
		option10.textContent = 'No procede';

		// Agregar las opciones al select
		select2.appendChild(option6);
		select2.appendChild(option7);
		select2.appendChild(option8);
		select2.appendChild(option9);
		select2.appendChild(option10);
		// Agregar el select al label
		label2.appendChild(select2);
		// Agregar el label al contenedor select
		selectContainer2.appendChild(label2);
		// Agregar el contenedor select al fieldset
		fieldset.appendChild(selectContainer2);
	} else {
		console.log('error');
	}

	//-------Talla
	// Crear el contenedor radio para el campo "Talla habitual de consumo"
	const radioContainer = document.createElement('div');
	radioContainer.setAttribute('class', 'radiocontainer tallacontainer');
	const labelTalla = document.createElement('label');
	labelTalla.setAttribute('class', 'custom-radio');
	labelTalla.setAttribute('for', 'talla');
	labelTalla.textContent = 'Talla habitual de consumo:\n';
	const br = document.createElement('br');
	labelTalla.appendChild(br);
	const summary = document.createElement('summary');
	summary.setAttribute('class', 'radios');
	const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'otra'];
	sizes.forEach(function (size) {
		const input = document.createElement('input');
		input.setAttribute('type', 'radio');
		input.setAttribute('name', 'talla');
		input.setAttribute('value', size);
		const text = document.createTextNode(' ' + size + '\u00A0'); // \u00A0 representa el espacio en blanco
		summary.appendChild(input);
		summary.appendChild(text);
	});
	labelTalla.appendChild(summary);
	// Agregar el label al contenedor radio
	radioContainer.appendChild(labelTalla);
	// Agregar el contenedor radio al fieldset
	fieldset.appendChild(radioContainer);

	//Establecemos los datos que se insertan con sliders
	const datosEdad = [
		{ class: 'slidecontainer', for: 'edad', textContent: 'Edad: ', name: 'edad', min: '0', max: '120' },
	];
	datosEdad.forEach(function (datos) {
		const slideContainer = document.createElement('div');
		slideContainer.setAttribute('class', datos.class);

		const label = document.createElement('label');
		label.setAttribute('class', 'custom-range');
		label.setAttribute('for', datos.for);

		const texto = document.createElement('div');
		texto.textContent = datos.textContent;
		texto.style.display = 'inline-block';
		texto.style.marginRight = '7px';

		const output = document.createElement('output');
		output.setAttribute('class', 'limit');
		output.style.display = 'inline-block';

		const unidades = document.createElement('div');
		unidades.textContent = 'años';
		unidades.style.display = 'inline-block';
		unidades.style.marginLeft = '3px';

		const input = document.createElement('input');
		input.setAttribute('type', 'range');
		input.setAttribute('name', datos.name);
		input.setAttribute('min', datos.min);
		input.setAttribute('max', datos.max);
		input.setAttribute('value', '0');
		input.setAttribute('class', 'slider');
		input.style.display = 'block';
		input.style.margin = '5px 0';

		// Agregar el div, output y input al label
		label.appendChild(texto);
		label.appendChild(output);
		label.appendChild(unidades);
		label.appendChild(input);

		// Agregar el label al contenedor slide
		slideContainer.appendChild(label);

		// Agregar el contenedor slide al fieldset
		fieldset.appendChild(slideContainer);
	});
	const datosRangeHz = [
		{
			class: 'slidecontainer',
			for: 'pecho',
			textContent: 'Pecho: ',
			name: 'pecho',
			min: '0',
			max: '250',
		},
		{
			class: 'slidecontainer',
			for: 'cintura',
			textContent: 'Cintura: ',
			name: 'cintura',
			min: '0',
			max: '250',
		},
		{
			class: 'slidecontainer',
			for: 'cadera',
			textContent: 'Cadera: ',
			name: 'cadera',
			min: '0',
			max: '250',
		},
		{
			class: 'slidecontainer',
			for: 'espalda',
			textContent: 'Ancho espalda: ',
			name: 'espalda',
			min: '0',
			max: '120',
		},
		{
			class: 'slidecontainer',
			for: 'seppecho',
			textContent: 'Separación pecho: ',
			name: 'seppecho',
			min: '0',
			max: '50',
		},
		{
			class: 'slidecontainer',
			for: 'cuello',
			textContent: 'Contorno de cuello: ',
			name: 'cuello',
			min: '0',
			max: '50',
		},
		{
			class: 'slidecontainer',
			for: 'hombro',
			textContent: 'Largo de hombro: ',
			name: 'hombro',
			min: '0',
			max: '25',
		},
	];
	const datosRangeVr = [
		{
			class: 'slidecontainer',
			for: 'estatura',
			textContent: 'Estatura: ',
			name: 'estatura',
			min: '0',
			max: '240',
		},
		{
			class: 'slidecontainer',
			for: 'largespalda',
			textContent: 'Largo espalda: ',
			name: 'largespalda',
			min: '0',
			max: '150',
		},
		{
			class: 'slidecontainer',
			for: 'largdelantero',
			textContent: 'Largo delantero: ',
			name: 'largdelantero',
			min: '0',
			max: '150',
		},
		{
			class: 'slidecontainer',
			for: 'costadillo',
			textContent: 'Costadillo: ',
			name: 'costadillo',
			min: '0',
			max: '150',
		},
		{
			class: 'slidecontainer',
			for: 'pierna',
			textContent: 'Largo de pierna: ',
			name: 'pierna',
			min: '0',
			max: '150',
		},
		{
			class: 'slidecontainer',
			for: 'entrepierna',
			textContent: 'Largo entrepierna: ',
			name: 'entrepierna',
			min: '0',
			max: '130',
		}, //Largo de brazo
		{
			class: 'slidecontainer',
			for: 'brazo',
			textContent: 'Largo de brazo: ',
			name: 'brazo',
			min: '0',
			max: '100',
		},
	];
	//---------
	// Creamos unos divs para estableces las medidas en dos columnas
	const containerMedidas = document.createElement('div');
	containerMedidas.style.display = 'flex';
	containerMedidas.style.flexDirection = 'row';
	containerMedidas.style.alignItems = 'center';
	containerMedidas.style.justifyContent = 'center';
	const containerHz = document.createElement('div');
	containerHz.style.margin = '0 20px';
	const containerVr = document.createElement('div');
	containerVr.style.margin = '0 20px';

	datosRangeHz.forEach(function (datos) {
		const slideContainer = document.createElement('div');
		slideContainer.setAttribute('class', datos.class);

		const label = document.createElement('label');
		label.setAttribute('class', 'custom-range');
		label.setAttribute('for', datos.for);

		const texto = document.createElement('div');
		texto.textContent = datos.textContent;
		texto.style.display = 'inline-block';
		texto.style.marginRight = '7px';

		const output = document.createElement('output');
		output.setAttribute('class', 'limit');
		output.style.display = 'inline-block';

		const unidades = document.createElement('div');
		unidades.textContent = 'cm';
		unidades.style.display = 'inline-block';
		unidades.style.marginLeft = '3px';

		const input = document.createElement('input');
		input.setAttribute('type', 'range');
		input.setAttribute('name', datos.name);
		input.setAttribute('min', datos.min);
		input.setAttribute('max', datos.max);
		input.setAttribute('value', '0');
		input.setAttribute('class', 'slider');
		input.style.display = 'block';
		input.style.margin = '5px 0';

		// Agregar input al label
		label.appendChild(texto);
		label.appendChild(output);
		label.appendChild(unidades);
		label.appendChild(input);

		// Agregar el label al contenedor slide
		slideContainer.appendChild(label);

		// Agregar el contenedor slide al fieldset
		containerHz.appendChild(slideContainer);
	});
	datosRangeVr.forEach(function (datos) {
		const slideContainer = document.createElement('div');
		slideContainer.setAttribute('class', datos.class);

		const label = document.createElement('label');
		label.setAttribute('class', 'custom-range');
		label.setAttribute('for', datos.for);

		const texto = document.createElement('div');
		texto.textContent = datos.textContent;
		texto.style.display = 'inline-block';
		texto.style.marginRight = '7px';

		const output = document.createElement('output');
		output.setAttribute('class', 'limit');
		output.style.display = 'inline-block';

		const unidades = document.createElement('div');
		unidades.textContent = 'cm';
		unidades.style.display = 'inline-block';
		unidades.style.marginLeft = '3px';

		const input = document.createElement('input');
		input.setAttribute('type', 'range');
		input.setAttribute('name', datos.name);
		input.setAttribute('min', datos.min);
		input.setAttribute('max', datos.max);
		input.setAttribute('value', '0');
		input.setAttribute('class', 'slider');
		input.style.display = 'block';
		input.style.margin = '5px 0';

		// Agregar el div, output y input al label
		label.appendChild(texto);
		label.appendChild(output);
		label.appendChild(unidades);
		label.appendChild(input);

		// Agregar el label al contenedor slide
		slideContainer.appendChild(label);

		// Agregar el contenedor slide al fieldset
		containerVr.appendChild(slideContainer);
	});
	containerMedidas.appendChild(containerHz);
	containerMedidas.appendChild(containerVr);
	fieldset.appendChild(containerMedidas);

	//* Crear el botón de envío
	const containerBotonEnviar = document.createElement('div');
	containerBotonEnviar.setAttribute('class', 'btn-enviocontainer');
	const botonEnviar = document.createElement('button');
	botonEnviar.setAttribute('type', 'submit');
	botonEnviar.textContent = 'Enviar';
	// Agregar el botón de envío al fieldset
	containerBotonEnviar.appendChild(botonEnviar);
	fieldset.appendChild(containerBotonEnviar);

	//* Añadimos fieldset al formulario y este a labelContainer
	formularioPrediccion.appendChild(fieldset);
	formularioContainer.appendChild(formularioPrediccion);

	//*ACTUALIZAR EL VALOR DE LOS SLIDERS
	function updateRange() {
		const limit = this.parentElement.getElementsByClassName('limit')[0];
		//limit.innerHTML = this.value;
		limit.textContent = this.value;
	}
	const slideContainers = document.getElementsByClassName('slidecontainer');
	for (let i = 0; i < slideContainers.length; i++) {
		const slider = slideContainers[i].getElementsByClassName('slider')[0];
		updateRange.call(slider);
		slider.oninput = updateRange;
	}
}

const recogerDatosFormulario = (event) => {
	//*Para una accion predeterminada del evento
	event.preventDefault(); // eveitar que recargue la página
	const datosFormData = new FormData(event.target); // Pasamos los datos-formulario a un objeto tipo FormData. Target se refiere al form y si apareciese this se referiría al boton (hijos dentro del form que portan el evento)?
	datos = Object.fromEntries(datosFormData.entries()); // datos es un objeto de Javascript
	for (let key in datos) {
		// Verificar si el valor es un string y si es un número válido
		if (typeof datos[key] === 'string' && !isNaN(parseFloat(datos[key]))) {
			// Convertir el string a tipo float y actualizas el valor en el objeto
			datos[key] = parseFloat(datos[key]);
		}
	}
	// console.log(datos);
	return datos;
};

//* Declaracion funcion que contendra modelo de Tensorflow para clasificar dataset CON DATOS SIN ETIQUETAR. CLASIFICADOR KNN
function modelRanges() {
	// Paso 1: Preparar los datos
	// En la funcion init, hemos introducido en la variable global dataset el json data recuperado con el metodo json de D3js
	// Extraer solo las medidas corporales de los datos sin etiquetar
	const processedData = dataset.map((obj) => Object.values(obj.medidasCorporales));

	// Paso 2: Convertir los datos a un tensor de TensorFlow.js
	const tensorData = tf.tensor2d(processedData);
	// Escalado de características
	const mean = tensorData.mean(0);
	const std = tensorData.sub(mean).square().mean(0).sqrt();
	const scaledData = tensorData.sub(mean).div(std);

	// Paso 3: Crear y entrenar el modelo
	const numClusters = numRanges; // Definimos el números de clases rangos que deseamos. Al no disponer de datos etiquetados debemos indicar cuantas clases o rangos esperamos encontrar en los datos
	// Aplicar el algoritmo de agrupación K-means que nos permite
	function kmeans(dataset, k, numIterations) {
		let centroids = dataset.slice(0, k);
		let labels = [];

		for (let i = 0; i < numIterations; i++) {
			labels = assignLabels(dataset, centroids);
			centroids = computeCentroids(dataset, labels, k);
		}

		return { labels, centroids };
	}

	function assignLabels(dataset, centroids) {
		return dataset.map((point) => {
			const distances = centroids.map((centroid) => euclideanDistance(point, centroid));
			const minDistance = Math.min(...distances);
			return distances.indexOf(minDistance);
		});
	}

	function computeCentroids(dataset, labels, k) {
		const centroids = Array.from({ length: k }, () => []);

		labels.forEach((label, i) => {
			centroids[label].push(dataset[i]);
		});

		return centroids.map((cluster) => {
			const sum = cluster.reduce((acc, point) => point.map((x, i) => acc[i] + x), Array(cluster[0].length).fill(0));
			return sum.map((value) => value / cluster.length);
		});
	}

	function euclideanDistance(pointA, pointB) {
		return Math.sqrt(pointA.reduce((sum, value, i) => sum + Math.pow(value - pointB[i], 2), 0));
	}

	// Aplicar el algoritmo de agrupación k-means
	const { labels, centroids } = kmeans(scaledData.arraySync(), numClusters, 10);

	// Agrupar los datos originales con sus etiquetas de cluster
	const clusteredData = dataset.map((obj, i) => {
		const clusterLabel = labels[i];
		return { ...obj, clusterLabel };
	});

	// Paso 4: Imprimir los datos clasificados y ordenados
	clusteredData.forEach((obj) => {
		console.log(`Instancia: ${obj.name}, Cluster: ${obj.clusterLabel}`);
		console.log(`Medidas Corporales:`, obj.medidasCorporales);
		console.log(`Resto de datos:`, {
			name: obj.name,
			sexo: obj.sexo,
			genero: obj.genero,
			edad: obj.edad,
			tallaHabitual: obj.tallaHabitual,
		});
		console.log('------------------------');
	});

	// Paso 5: llamar a la función que va a dibujar mis datos o retornar los datos
	//return clusteredData;
	//console.log(clusteredData);

	//----

	//----

	drawRanges(clusteredData);

	//----

	//----
}

//* Declaracion funcion que contendra modelo de Tensorflow para clasificar dataset CON DATOS CON ETIQUETA (SEXO O GENERO SEGUN DECIDA EL USUARIO).
function modelLabel(nuevoCuerpo) {
	//TODO
	//No hace falta recuperrar el valor de labeltype porque es una varaible global.Recuperamos el valor de la etiqueta por la que queremos etiquetar los datos que se introduzcan si por sexo o por genero
	//* Paso 1: Preparar los datos
	// Preprocesar los datos
	// Extraer las características de los datos
	function extractFeatures(dataset) {
		const features = dataset.map((obj) => Object.values(obj.medidasCorporales));
		return tf.tensor2d(features);
	}

	//* Paso 2: etiquetas según el tipo seleccionado por el usuario desde el DOM y preparación de los datos
	let labels;
	if (labelType === 'sexo') {
		labels = dataset.map((obj) => obj.sexo);
	} else if (labelType === 'genero') {
		labels = dataset.map((obj) => obj.genero);
	}

	const features = extractFeatures(dataset); // convertir los datos en un tensor bidimensional
	/* se encarga de extraer las características de los datos. Toma el conjunto de datos dataset y devuelve un tensor bidimensional 
	(tensor2d) llamado features que contiene las características de cada objeto en el conjunto de datos. Cada fila del tensor 
	representa un objeto del conjunto de datos y cada columna representa una característica específica del objeto. */
	const labelsTensor = tf.tensor1d(labels, 'float32');
	/* Esta línea convierte las etiquetas en un tensor unidimensional (tensor1d) llamado labelsTensor. El tensor labelsTensor 
	contiene las etiquetas numéricas correspondientes a cada objeto en el conjunto de datos. Las etiquetas se convierten a 
	float32 para asegurarse de que coincidan con el tipo de datos esperado por el modelo. */

	//* Paso 3: Convertir las etiquetas a valores numéricos
	const uniqueLabels = Array.from(new Set(labels)); // Tomo los datos de la columna que he decidido que sea la etiqueta ("sexo" o "genero")
	//const labelEncoder = new Map(uniqueLabels.map((label, index) => [label, index]));
	//const encodedLabels = labels.map((label) => labelEncoder.get(label));
	/* Paso adicional: Determinar el número de unidades en la capa de salida pues no vamos a usar labelEncoder
		decides ajustar dinámicamente el número de unidades en la capa de salida en función de la cantidad de valores 
		únicos en tu dataset para "sexo" o "genero"*/
	const numClasses = uniqueLabels.length; // Se define el numero de clases en base a las distintas etiquetas de la base de datos la cantidad de valores que pueda tener "sexo" o "genero"

	//* Paso 4: Crear un modelo secuencial
	const model = tf.sequential(); //! https://js.tensorflow.org/api/4.7.0/#sequential
	model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [9] })); //!REVISAR ESTOS PARAMETROS PARA VER LOS MAS OPTIMOS
	model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' })); //!REVISAR ESTOS PARAMETROS PARA VER LOS MAS OPTIMOS

	//* Paso 5: Compilar el modelo
	model.compile({ optimizer: 'adam', loss: 'sparseCategoricalCrossentropy' }); //!REVISAR ESTOS PARAMETROS PARA VER LOS MAS OPTIMOS

	//* Paso 6: Entrenar el modelo
	//model.fit(extractFeatures(dataset), encodedLabels, { epochs: 50 });
	model.fit(features, labelsTensor, { epochs: 50 }); // numero de iteraciones

	//* Paso 7: Realizar las predicciones en los datos de entrada
	//const predictions = model.predict(extractFeatures(dataset));
	const predictedLabels = model.predict(extractFeatures(dataset));
	// console.log(predictions);

	//* Paso 8: Decodificar las etiquetas predichas
	// const decodedLabels = encodedLabels.map((encodedLabel) => {
	// 	return Array.from(labelEncoder.keys()).find((label) => labelEncoder.get(label) === encodedLabel);
	// });
	//const decodedLabels = Array.from(predictions.argMax(1).dataSync()); //!REVISAR ESTOS PARAMETROS PARA VER LOS MAS OPTIMOS
	// console.log(decodedLabels);
	const predictedLabelsData = Array.from(predictedLabels.dataSync());
	console.log(predictedLabelsData);

	//* Paso 9: Asigno los valores de predictions a dataset, creo nuevo dataset con estos valores datasetWithPredictions
	const datasetWithPredictions = dataset.map((obj, index) => {
		return {
			...obj,
			prediction: predictedLabelsData[index],
		};
	});

	//* Paso 9: Obtener los valores de la cadena 'pecho' para ordenar las clases
	const chestValues = dataset.map((obj) => obj.medidasCorporales.pecho);

	console.log(chestValues);

	//* Paso 10: Agrupar las predicciones y las etiquetas por clase
	const groupedData = groupDataByClass(predictions, decodedLabels, chestValues);

	console.log(groupedData);

	//* Paso 11: Ordenar las clases por el valor de 'pecho'
	const sortedData = sortDataByChest(groupedData);

	//* Paso 12: llamar a la función que va a dibujar mis datos o retornar los datos clasificados y ordenados
	//return sortedData;
	console.log(sortedData);

	//----

	//----

	//drawPredictionLabel();

	//----

	//----

	// Declaracion de Función para agrupar los datos por clase
	function groupDataByClass(predictions, labels, chestValues) {
		const groupedData = {};

		for (let i = 0; i < predictions.length; i++) {
			const prediction = predictions[i];
			const label = labels[i];
			const chestValue = chestValues[i];
			const data = dataset[i]; //incluye el resto de informacion que no participa en la clasificacion, es decir "edad" , "sexo" o "genero" (según la que no se haya tomado como etiqueta) y "tallaHabitual"

			if (!(label in groupedData)) {
				groupedData[label] = {
					predictions: [],
					chestValues: [],
					data: [],
				};
			}

			groupedData[label].predictions.push(prediction);
			groupedData[label].chestValues.push(chestValue);
			groupedData[label].data.push(data);
		}

		return groupedData;
	}

	// Función para ordenar los datos por el valor de la cadena "pecho"
	function sortDataByChest(groupedData) {
		for (const label in groupedData) {
			const data = groupedData[label];
			const predictions = data.predictions;
			const chestValues = data.chestValues;

			const sortedIndices = chestValues
				.map((_, i) => i)
				.sort((a, b) => {
					return chestValues[a] - chestValues[b];
				});

			groupedData[label].predictions = sortedIndices.map((index) => predictions[index]);
			groupedData[label].chestValues = sortedIndices.map((index) => chestValues[index]);
		}

		return groupedData;
	}
}

//----------

//* FUNCIONES QUE DIBUJAN LOS DATOS O MUESTRAN PREDICCIONES

//----------
//*ESTA FUNCION DIBUJA EL DATASET EN ORDEN DE APARICION DE LOS DATOS EN EL Y CUANDO SE ESCOGE numRanges = 1 ES DECIR, QUE SE DECIDDE NO SIVIDIR EL DATASET
function drawDataset() {
	//*Seleccionamos el contenedor donde van nuestras visualizaciones
	const svgContainer = document.querySelector('.container-dataset-viewer');
	svgContainer.innerHTML = ''; // Elimina todo el contenido dentro del contenedor SVG antes de agregar uno nuevo

	//https://programmerclick.com/article/4640880948/
	//https://www.youtube.com/watch?v=Ihi0AFoC3PY
	//https://d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
	//https://www.educative.io/answers/how-to-create-stacked-bar-chart-using-d3

	//* Establecemos tamaño del svg
	const width = 1200;
	const height = 600;
	// Margen
	const margin = { top: 20, right: 20, bottom: 20, left: 20 };
	// Espacio para la leyenda
	const legendWidth = 120;
	// Tamaño ajustado del SVG
	const svgWidth = width + margin.left + margin.right + legendWidth;
	const svgHeight = height + margin.top + margin.bottom;
	// Espacio entre barras
	const barSpacing = 5;

	// Obtén la lista de medidas corporales disponibles
	const medidasCorporales = Object.keys(dataset[0].medidasCorporales);
	// Obtén el número de medidas corporales y el número de colores disponibles
	const numMedidasCorporales = medidasCorporales.length;
	// Configuración de colores para cada medida corporal
	const numColores = colors.length;
	// const colorScale = d3.scaleOrdinal().domain(medidasCorporales).range(d3.schemeCategory10);
	const colorScale = d3
		.scaleOrdinal()
		.domain(medidasCorporales)
		.range(colors.slice(0, numMedidasCorporales))
		.unknown(colors[numColores - 1]);

	// // Calcula la suma de las medidas corporales para cada objeto
	// dataset.forEach((data) => {
	// 	const sum = Object.values(data.medidasCorporales).reduce((acc, curr) => acc + curr, 0);
	// 	data.sumaMedidas = sum;
	// });

	// Escalas
	const xScale = d3
		.scaleBand()
		.domain(dataset.map((d) => d.name))
		.range([0, width])
		.padding(0.1);

	// Calcula el máximo valor acumulado de medidas corporales para el dominio del eje Y
	const maxMeasure = d3.max(dataset, (d) => d3.sum(Object.values(d.medidasCorporales)));
	const yScale = d3.scaleLinear().domain([0, maxMeasure]).range([height, 0]);

	// Crea el SVG y establece su tamaño
	const svg = d3.select('.container-dataset-viewer').append('svg').attr('width', svgWidth).attr('height', svgHeight);
	// Obtén una referencia al contenedor del gráfico
	const chartContainer = d3.select('.container-dataset-viewer');
	// Crea el contenedor para el tooltip
	const tooltipContainer = chartContainer.append('div').attr('class', 'tooltip-container');
	// Crea el tooltip dentro del contenedor
	tooltipContainer.append('div').attr('class', 'tooltip hidden');
	// Selección del tooltip
	const tooltip = tooltipContainer.select('.tooltip');

	// Crea un grupo para el gráfico principal
	const mainGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

	// Apila los datos por columnas
	const stackedData = d3
		.stack()
		.keys(medidasCorporales)
		.value((d, key) => d.medidasCorporales[key])
		.offset(d3.stackOffsetNone)(dataset);

	// Dibuja las barras apiladas
	const stackGroup = mainGroup //svg
		.selectAll('g.stack')
		.data(stackedData)
		.join(
			(enter) => enter.append('g'),
			(update) => update,
			(exit) => exit.remove()
		)
		.classed('stack', true)
		.attr('fill', (d, i) => colorScale(d.key));

	stackGroup
		.selectAll('rect')
		.data((d) => d)
		// .join(
		// 	(enter) => enter.append('rect'),
		// 	(update) => update,
		// 	(exit) => exit.remove()
		// )
		.join('rect')
		.attr('x', (d) => xScale(d.data.name))
		.attr('y', (d) => yScale(d[1])) //.attr('y', (d, i) => yScale(d[1] + (i > 0 ? d[i - 1][1] : 0)))
		.attr('height', (d) => yScale(d[0]) - yScale(d[1])) //.attr('height', (d) => yScale(d[0]) - yScale(d[1]+ d[0]))
		.attr('width', xScale.bandwidth()); //.attr('width', xScale.bandwidth());

	// Agrega una leyenda para las medidas corporales
	const legendGroup = svg
		.append('g')
		.attr('transform', `translate(${width + margin.left + margin.right}, ${margin.top})`);

	legendGroup
		.selectAll('rect')
		.data(medidasCorporales)
		// .enter()
		// .append('rect')
		.join('rect')
		.attr('x', 0)
		.attr('y', (d, i) => i * 20)
		.attr('width', 10)
		.attr('height', 10)
		.attr('fill', (d, i) => colorScale(d));

	legendGroup
		.selectAll('text')
		.data(medidasCorporales)
		// .enter()
		// .append('text')
		.join('text')
		.attr('x', 20)
		.attr('y', (d, i) => i * 20 + 10)
		.text((d) => d)
		.attr('alignment-baseline', 'middle')
		.style('font-size', '12px'); // Ajusta el tamaño del texto aquí;

	// Agrega un círculo encima de cada barra apilada
	stackGroup
		.selectAll('circle')
		.data((d) => d)
		.join('circle')
		.attr('cx', (d) => xScale(d.data.name) + xScale.bandwidth() / 2)
		.attr('cy', (d) => yScale(d[1]) - 10) // Ubicación encima de la barra con un margen
		.attr('r', 5)
		.style('fill', 'pink') // Color del punto
		.on('mouseover', showTooltip) // Agrega eventos de ratón para mostrar y ocultar la ventana emergente
		.on('mouseout', hideTooltip);

	//-----------------

	// Crea un nuevo grupo para las lineas de conexión
	const lineGroup = mainGroup.append('g').attr('class', 'line-group');

	// Trama las líneas de conexión
	// lineGroup
	// 	.selectAll('line')
	// 	.data(stackedData)
	// 	.join('line')
	// 	.attr('x1', (d) => xScale(d[0].data.name) + xScale.bandwidth() / 2)
	// 	.attr('y1', (d) => yScale(d[0][1]))
	// 	.attr('x2', (d) => xScale(d[d.length - 1].data.name) + xScale.bandwidth() / 2)
	// 	.attr('y2', (d) => yScale(d[d.length - 1][1]))
	// 	.attr('stroke', 'pink')
	// 	.attr('stroke-width', 2);

	// Definir la escala de colores para las lineas de conexion
	const colorScaleLinesConexion = d3.interpolateRgb('mistyrose', 'hotpink');

	// Trama las líneas de conexión
	stackedData.forEach((stack, stackIndex) => {
		stack.forEach((d, i) => {
			if (i < stack.length - 1) {
				const currentBar = d;
				const nextBar = stack[i + 1];

				const line = lineGroup
					.append('line')
					.attr('x1', xScale(currentBar.data.name) + xScale.bandwidth() / 2)
					.attr('y1', yScale(currentBar[1]))
					.attr('x2', xScale(nextBar.data.name) + xScale.bandwidth() / 2)
					.attr('y2', yScale(nextBar[1]))
					.attr('stroke', colorScaleLinesConexion(stackIndex / (stackedData.length - 1))) //'pink'
					.attr('stroke-width', 2);

				// Agregar tooltips
				line //!NO ESTA FUNCIONANDO
					.on('mouseover', (event, d) => {
						// const medidaCorporal = currentBar.data.medidasCorporales;
						let medidaCorporal;
						if (currentBar.data && currentBar.data.medidasCorporales) {
							medidaCorporal = currentBar.data.medidasCorporales;
						} else if (currentBar[0] && currentBar[0].data && currentBar[0].data.medidasCorporales) {
							medidaCorporal = currentBar[0].data.medidasCorporales;
						} else {
							console.error('Estructura de datos no válida');
							return;
						}
						const keys = Object.keys(medidaCorporal);
						// const tooltipContent = keys.map((key) => `${key}: ${medidaCorporal[key]}`).join('<br>');
						const tooltipContent = Object.entries(medidaCorporal)
							.map(([key, value]) => `${key}: ${value}`)
							.join('<br>');
						console.log(tooltipContent);
						//-------------------------------
						const tooltipLine = d3.select('.tooltipLine');
						// Obtén las coordenadas del gráfico en relación con el elemento contenedor
						const containerRect = svgContainer.getBoundingClientRect();
						// Resta las coordenadas del gráfico del evento del ratón para obtener las coordenadas relativas dentro del gráfico
						const xRelative = event.pageX - containerRect.left;
						const yRelative = event.pageY - containerRect.top;
						tooltipLine
							.classed('hidden', false)
							// .style('visibility', 'visible')
							.style('left', event.pageX + 'px')
							.style('top', event.pageY + 'px')
							// .style('left', `${xRelative}px`)
							// .style('top', `${yRelative}px`)
							// .html(`Medida Corporal: ${medida}: ${medidaCorporal[medida]}`);
							.html(`Medidas Corporales:<br>${tooltipContent}`);
					})
					.on('mouseout', () => {
						const tooltipLine = d3.select('.tooltipLine');
						// tooltipLine.style('visibility', 'hidden');
						tooltipLine.classed('hidden', true);
					});
			}
		});
	});

	//----------------

	//* Función para mostrar la ventana emergente
	function showTooltip(event, d) {
		// const tooltip = d3.select('.tooltip');

		let data;
		if (d.data) {
			// Si "d" tiene una propiedad "data", usamos esa propiedad como datos
			data = d.data;
		} else if (d[0] && d[0].data) {
			// Si "d[0]" tiene una propiedad "data", usamos esa propiedad como datos
			data = d[0].data;
		} else {
			// Si no se encuentra una estructura de datos válida, mostramos un mensaje de error
			console.error('Estructura de datos no válida');
			return;
		}

		const name = data.name !== undefined ? data.name : 'N/A';
		const sexo = data.sexo !== undefined ? data.sexo : 'N/A';
		const genero = data.genero !== undefined ? data.genero : 'N/A';
		const edad = data.edad !== undefined ? data.edad : 'N/A';
		const tallaHabitual = data.tallaHabitual !== undefined ? data.tallaHabitual : 'N/A';

		const tooltipContent =
			'<div>Name: ' +
			name +
			'</div>' +
			'<div>Sexo: ' +
			sexo +
			'</div>' +
			'<div>Genero: ' +
			genero +
			'</div>' +
			'<div>Edad: ' +
			edad +
			'</div>' +
			'<div>Talla Habitual: ' +
			tallaHabitual +
			'</div>';

		const containerWidth = svgContainer.getBoundingClientRect().width;
		const tooltipWidth = tooltip.node().getBoundingClientRect().width;
		const tooltipLeft = (containerWidth - tooltipWidth) / 2;

		// tooltip
		// 	.style('left', `${event.pageX}px`) // Usamos "event.pageX" en lugar de "d3.event.pageX"
		// 	.style('top', `${event.pageY}px`) // Usamos "event.pageY" en lugar de "d3.event.pageY"
		// 	.html(tooltipContent)
		// 	.classed('hidden', false);
		tooltip.style('left', `${tooltipLeft}px`).style('top', '0').html(tooltipContent).classed('hidden', false);
	}

	//* Función para ocultar la ventana emergente
	function hideTooltip(event, d) {
		const tooltip = d3.select('.tooltip');
		tooltip.classed('hidden', true);
	}
}

//* Declaracion funcion que dibuja los resultados de la division/rangos realizados por TensorFlow. EMPLEA D3JS
function drawRanges(clusteredData) {
	//*Seleccionamos el contenedor donde van nuestras visualizaciones
	const svgContainer = document.querySelector('.container-dataset-viewer');
	svgContainer.innerHTML = ''; // Elimina todo el contenido dentro del contenedor SVG antes de agregar uno nuevo

	console.log(clusteredData);

	//* Establecemos tamaño del svg
	const width = 1200;
	const height = 600;
	// Margen
	const margin = { top: 20, right: 20, bottom: 20, left: 20 };
	// Espacio para la leyenda
	const legendWidth = 120;
	// Tamaño ajustado del SVG
	const svgWidth = width + margin.left + margin.right + legendWidth;
	const svgHeight = height + margin.top + margin.bottom;
	// Espacio entre barras
	const barSpacing = 5;

	// Obtén la lista de medidas corporales disponibles
	const medidasCorporales = Object.keys(clusteredData[0].medidasCorporales);
	// const clustersLabels = Object.keys(clusteredData[0].clusterLabel); //!
	const clusterLabels = [...new Set(clusteredData.map((d) => d.clusterLabel))]; //!

	// Ordena los datos por clusterLabel
	clusteredData.sort((a, b) => a.clusterLabel - b.clusterLabel);

	// Escalas
	const xScale = d3
		.scaleBand()
		.domain(clusteredData.map((d) => d.name))
		.range([0, width])
		.padding(0.1);

	// Calcula el máximo valor acumulado de medidas corporales para el dominio del eje Y
	const maxMeasure = d3.max(clusteredData, (d) => d3.sum(Object.values(d.medidasCorporales)));
	const yScale = d3.scaleLinear().domain([0, maxMeasure]).range([height, 0]);
	//TODO

	// Crea el SVG y establece su tamaño
	const svg = d3.select('.container-dataset-viewer').append('svg').attr('width', svgWidth).attr('height', svgHeight);
	// Obtén una referencia al contenedor del gráfico
	const chartContainer = d3.select('.container-dataset-viewer');
	// Crea el contenedor para el tooltip
	const tooltipContainer = chartContainer.append('div').attr('class', 'tooltip-container');
	// Crea el tooltip dentro del contenedor
	tooltipContainer.append('div').attr('class', 'tooltip hidden');
	// Selección del tooltip
	const tooltip = tooltipContainer.select('.tooltip');

	// Crea un grupo para el gráfico principal
	const mainGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

	// Apila los datos por columnas
	const stackedData = d3
		.stack()
		.keys(medidasCorporales)
		.value((d, key) => d.medidasCorporales[key])
		.order(d3.stackOrderNone)
		.offset(d3.stackOffsetNone)(
		clusteredData.map((d) => ({
			...d,
			medidasCorporales: d.medidasCorporales,
			clusterLabel: d.clusterLabel !== undefined ? d.clusterLabel : 'N/A',
		}))
	);

	// console.log(clusterLabels);

	//* Para los colores de los cluster y als stacks
	// Obtén el número de medidas corporales y el número de colores disponibles
	const numMedidasCorporales = medidasCorporales.length;
	const numclusterLabels = clusterLabels.length; //!
	const numColores = colors.length;

	//Colores para cada cluster
	const clusterColorScale = d3
		.scaleOrdinal()
		.domain(clusterLabels) //.domain(clusteredData.map((d) => d.clusterLabel))
		.range(colors.slice(0, numclusterLabels))
		.unknown(colors[numColores - 1]);

	//* Configuración de colores para cada medida corporal
	// Crea una escala de saturación para diferenciar las stacks
	const saturationScale = d3
		.scaleLinear()
		.domain([0, clusteredData.length - 1]) //! LAS STACKS DE CADA BARRA PARA LA MISMA MEDIDA CORPORAL SE REPRESENTAN TODAS JUNTAS PRIMERO
		.range([0, 1]);

	// Dibuja las barras apiladas
	const stackGroup = mainGroup //svg
		.selectAll('g.stack')
		.data(stackedData)
		.join('g')
		.classed('stack', true);

	//http://using-d3js.com/05_06_stacks.html
	//https://dataviz.unhcr.org/chart_gallery/comparison.html#bar-grouped

	stackGroup
		.selectAll('rect')
		.data((d) => d)
		.join('rect')
		.attr('x', (d) => xScale(d.data.name))
		.attr('y', (d) => yScale(d[1]))
		.attr('height', (d) => yScale(d[0]) - yScale(d[1])) //.attr('height', (d) => yScale(d[0]) - yScale(d[1]))
		.attr('width', xScale.bandwidth()) //.attr('width', xScale.bandwidth());
		// .attr('fill', (d, i) => clusterColorScale(d.data.clusterLabel));
		.attr('fill', function (d) {
			const stackNode = d3.select(this); // Nodo de la stack actual
			const stackIndex = stackGroup.selectAll('rect').nodes().indexOf(stackNode.node()); // Índice de la stack dentro de la barra
			const clusterLabel = d.data.clusterLabel; // Etiqueta del cluster
			const baseColor = clusterColorScale(clusterLabel); // Color base del clusterLabel
			const stackPosition = stackIndex / (numMedidasCorporales - 1); // Posición relativa de la stack dentro de la barra
			const stackColor = d3.interpolateRgb(
				baseColor,
				baseColorWithTransparency(baseColor, 0.2)
			)(saturationScale(stackPosition)); // Color con degradado de saturación
			return stackColor;
		});

	function baseColorWithTransparency(baseColor, desaturation) {
		const transparentColor = d3.color(baseColor);
		transparentColor.opacity = desaturation; //0.4 // Establecemos la transparencia al 20% (ajusta según tus necesidades)
		return transparentColor.toString();
	}

	// Agrega una leyenda para las medidas corporales
	const legendGroup = svg
		.append('g')
		.attr('transform', `translate(${width + margin.left + margin.right}, ${margin.top})`);

	legendGroup
		.selectAll('rect')
		.data(medidasCorporales)
		.join('rect')
		.attr('x', 0)
		.attr('y', (d, i) => i * 20)
		.attr('width', 10)
		.attr('height', 10)
		.attr('fill', (d, i) => baseColorWithTransparency('grey', (medidasCorporales.length - i + 1) * 0.1)); // Ajusta el factor multiplicador para obtener diferentes grados de transparencia

	legendGroup
		.selectAll('text')
		.data(medidasCorporales)
		.join('text')
		.attr('x', 20)
		.attr('y', (d, i) => i * 20 + 10)
		.text((d) => d)
		.attr('alignment-baseline', 'middle')
		.style('font-size', '12px'); // tamaño del texto;

	// Agrega un círculo encima de cada barra apilada
	stackGroup
		.selectAll('circle')
		.data((d) => d)
		.join('circle')
		.attr('cx', (d) => xScale(d.data.name) + xScale.bandwidth() / 2)
		.attr('cy', (d) => yScale(d[1]) - 10) // Ubicación encima de la barra con un margen
		.attr('r', 5)
		.style('fill', 'pink') // Color del punto
		.on('mouseover', showTooltip) // Agrega eventos de ratón para mostrar y ocultar la ventana emergente
		.on('mouseout', hideTooltip);

	//-----------------

	//* Crea un nuevo grupo para las lineas de conexión
	const lineGroup = mainGroup.append('g').attr('class', 'line-group');

	// Definir la escala de colores para las lineas de conexion
	const colorScaleLinesConexion = d3.interpolateRgb('hotpink', 'mistyrose');

	// Trama las líneas de conexión
	stackedData.forEach((stack, stackIndex) => {
		stack.forEach((d, i) => {
			if (i < stack.length - 1) {
				const currentBar = d;
				const nextBar = stack[i + 1];

				const line = lineGroup
					.append('line')
					.attr('x1', xScale(currentBar.data.name) + xScale.bandwidth() / 2)
					.attr('y1', yScale(currentBar[1]))
					.attr('x2', xScale(nextBar.data.name) + xScale.bandwidth() / 2)
					.attr('y2', yScale(nextBar[1]))
					.attr('stroke', colorScaleLinesConexion(stackIndex / (stackedData.length - 1))) //'pink'
					.attr('stroke-width', 2);
			}
		});
	});

	//----------------

	//* Función para mostrar la ventana emergente
	function showTooltip(event, d) {
		// const tooltip = d3.select('.tooltip');

		let data;
		if (d.data) {
			// Si "d" tiene una propiedad "data", usamos esa propiedad como datos
			data = d.data;
		} else if (d[0] && d[0].data) {
			// Si "d[0]" tiene una propiedad "data", usamos esa propiedad como datos
			data = d[0].data;
		} else {
			// Si no se encuentra una estructura de datos válida, mostramos un mensaje de error
			console.error('Estructura de datos no válida');
			return;
		}

		const name = data.name !== undefined ? data.name : 'N/A';
		const sexo = data.sexo !== undefined ? data.sexo : 'N/A';
		const genero = data.genero !== undefined ? data.genero : 'N/A';
		const edad = data.edad !== undefined ? data.edad : 'N/A';
		const tallaHabitual = data.tallaHabitual !== undefined ? data.tallaHabitual : 'N/A';
		const clusterLabel = data.clusterLabel !== undefined ? data.clusterLabel : 'N/A';

		const tooltipContent =
			'<div>Nombre: ' +
			name +
			'</div>' +
			'<div>Sexo: ' +
			sexo +
			'</div>' +
			'<div>Género: ' +
			genero +
			'</div>' +
			'<div>Edad: ' +
			edad +
			'</div>' +
			'<div>Talla habitual: ' +
			tallaHabitual +
			'</div>' +
			'<div>Segmento asignado: ' +
			clusterLabel +
			'</div>';

		const containerWidth = svgContainer.getBoundingClientRect().width;
		const tooltipWidth = tooltip.node().getBoundingClientRect().width;
		const tooltipLeft = (containerWidth - tooltipWidth) / 2;

		// tooltip
		// 	.style('left', `${event.pageX}px`)
		// 	.style('top', `${event.pageY}px`)
		// 	.html(tooltipContent)
		// 	.classed('hidden', false);
		tooltip
			.style('left', `${tooltipLeft}px`)
			.style('top', '0')
			.html(tooltipContent)
			.classed('hidden', false)
			.style('font-size', '13px'); // tamaño del texto;
	}

	//* Función para ocultar la ventana emergente
	function hideTooltip(event, d) {
		const tooltip = d3.select('.tooltip');
		tooltip.classed('hidden', true);
	}
}

function drawPredictionLabel(sortedData) {
	//*Seleccionamos el contenedor donde van nuestras visualizaciones
	const svgContainer = document.querySelector('.container-dataset-viewer');
	svgContainer.innerHTML = ''; // Elimina todo el contenido dentro del contenedor SVG antes de agregar uno nuevo

	console.log(clusteredData);

	//* Establecemos tamaño del svg
	const width = 1200;
	const height = 600;
	// Margen
	const margin = { top: 20, right: 20, bottom: 20, left: 20 };
	// Espacio para la leyenda
	const legendWidth = 120;
	// Tamaño ajustado del SVG
	const svgWidth = width + margin.left + margin.right + legendWidth;
	const svgHeight = height + margin.top + margin.bottom;
	// Espacio entre barras
	const barSpacing = 5;

	// Obtén la lista de medidas corporales disponibles
	const medidasCorporales = Object.keys(clusteredData[0].medidasCorporales);
	// const clustersLabels = Object.keys(clusteredData[0].clusterLabel); //!
	const clusterLabels = [...new Set(clusteredData.map((d) => d.clusterLabel))]; //!

	// Ordena los datos por clusterLabel
	clusteredData.sort((a, b) => a.clusterLabel - b.clusterLabel);

	// Escalas
	const xScale = d3
		.scaleBand()
		.domain(clusteredData.map((d) => d.name))
		.range([0, width])
		.padding(0.1);

	// Calcula el máximo valor acumulado de medidas corporales para el dominio del eje Y
	const maxMeasure = d3.max(clusteredData, (d) => d3.sum(Object.values(d.medidasCorporales)));
	const yScale = d3.scaleLinear().domain([0, maxMeasure]).range([height, 0]);

	// Crea el SVG y establece su tamaño
	const svg = d3.select('.container-dataset-viewer').append('svg').attr('width', svgWidth).attr('height', svgHeight);
	// Obtén una referencia al contenedor del gráfico
	const chartContainer = d3.select('.container-dataset-viewer');
	// Crea el contenedor para el tooltip
	const tooltipContainer = chartContainer.append('div').attr('class', 'tooltip-container');
	// Crea el tooltip dentro del contenedor
	tooltipContainer.append('div').attr('class', 'tooltip hidden');
	// Selección del tooltip
	const tooltip = tooltipContainer.select('.tooltip');

	// Crea un grupo para el gráfico principal
	const mainGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

	// Apila los datos por columnas
	const stackedData = d3
		.stack()
		.keys(medidasCorporales)
		.value((d, key) => d.medidasCorporales[key])
		.offset(d3.stackOffsetNone)(
		clusteredData.map((d) => ({
			...d,
			medidasCorporales: d.medidasCorporales,
			clusterLabel: d.clusterLabel !== undefined ? d.clusterLabel : 'N/A',
		}))
	);

	// console.log(clusterLabels);

	//* Para los colores de los cluster y als stacks
	// Obtén el número de medidas corporales y el número de colores disponibles
	const numMedidasCorporales = medidasCorporales.length;
	const numclusterLabels = clusterLabels.length; //!
	const numColores = colors.length;

	//Colores para cada cluster
	const clusterColorScale = d3
		.scaleOrdinal()
		.domain(clusterLabels) //.domain(clusteredData.map((d) => d.clusterLabel))
		.range(colors.slice(0, numclusterLabels))
		.unknown(colors[numColores - 1]);

	//* Configuración de colores para cada medida corporal
	// Crea una escala de saturación para diferenciar las stacks
	// const numStacks = d3.max(stackedData, (d) => d.length); //!
	//console.log(numMedidasCorporales);
	const saturationScale = d3
		.scaleLinear()
		.domain([0, clusteredData.length - 1]) //! LAS STACKS DE CADA BARRA PARA LA MISMA MEDIDA CORPORAL SE REPRESENTAN TODAS JUNTAS PRIMERO
		.range([0, 1]);

	// Dibuja las barras apiladas
	const stackGroup = mainGroup //svg
		.selectAll('g.stack')
		.data(stackedData)
		.join('g')
		.classed('stack', true);

	stackGroup
		.selectAll('rect')
		.data((d) => d)
		.join('rect')
		.attr('x', (d) => xScale(d.data.name))
		.attr('y', (d) => yScale(d[1])) //.attr('y', (d, i) => yScale(d[1] + (i > 0 ? d[i - 1][1] : 0)))
		.attr('height', (d) => yScale(d[0]) - yScale(d[1])) //.attr('height', (d) => yScale(d[0]) - yScale(d[1]+ d[0]))
		.attr('width', xScale.bandwidth()) //.attr('width', xScale.bandwidth());
		// .attr('fill', (d, i) => clusterColorScale(d.data.clusterLabel));
		.attr('fill', function (d) {
			const stackNode = d3.select(this); // Nodo de la stack actual
			const stackIndex = stackGroup.selectAll('rect').nodes().indexOf(stackNode.node()); // Índice de la stack dentro de la barra
			const clusterLabel = d.data.clusterLabel; // Etiqueta del cluster
			const baseColor = clusterColorScale(clusterLabel); // Color base del clusterLabel
			const stackPosition = stackIndex / (numMedidasCorporales - 1); // Posición relativa de la stack dentro de la barra
			const stackColor = d3.interpolateRgb(
				baseColor,
				baseColorWithTransparency(baseColor, 0.2)
			)(saturationScale(stackPosition)); // Color con degradado de saturación
			return stackColor;
		});

	function baseColorWithTransparency(baseColor, desaturation) {
		const transparentColor = d3.color(baseColor);
		transparentColor.opacity = desaturation; //0.4 // Establecemos la transparencia al 20% (ajusta según tus necesidades)
		return transparentColor.toString();
	}

	// Agrega una leyenda para las medidas corporales
	const legendGroup = svg
		.append('g')
		.attr('transform', `translate(${width + margin.left + margin.right}, ${margin.top})`);

	legendGroup
		.selectAll('rect')
		.data(medidasCorporales)
		.join('rect')
		.attr('x', 0)
		.attr('y', (d, i) => i * 20)
		.attr('width', 10)
		.attr('height', 10)
		.attr('fill', (d, i) => baseColorWithTransparency('grey', (medidasCorporales.length - i + 1) * 0.1)); // Ajusta el factor multiplicador para obtener diferentes grados de transparencia

	legendGroup
		.selectAll('text')
		.data(medidasCorporales)
		.join('text')
		.attr('x', 20)
		.attr('y', (d, i) => i * 20 + 10)
		.text((d) => d)
		.attr('alignment-baseline', 'middle')
		.style('font-size', '12px'); // tamaño del texto;

	// Agrega un círculo encima de cada barra apilada
	stackGroup
		.selectAll('circle')
		.data((d) => d)
		.join('circle')
		.attr('cx', (d) => xScale(d.data.name) + xScale.bandwidth() / 2)
		.attr('cy', (d) => yScale(d[1]) - 10) // Ubicación encima de la barra con un margen
		.attr('r', 5)
		.style('fill', 'pink') // Color del punto
		.on('mouseover', showTooltip) // Agrega eventos de ratón para mostrar y ocultar la ventana emergente
		.on('mouseout', hideTooltip);

	//-----------------

	//* Crea un nuevo grupo para las lineas de conexión
	const lineGroup = mainGroup.append('g').attr('class', 'line-group');

	// Definir la escala de colores para las lineas de conexion
	const colorScaleLinesConexion = d3.interpolateRgb('mistyrose', 'hotpink');

	// Trama las líneas de conexión
	stackedData.forEach((stack, stackIndex) => {
		stack.forEach((d, i) => {
			if (i < stack.length - 1) {
				const currentBar = d;
				const nextBar = stack[i + 1];

				const line = lineGroup
					.append('line')
					.attr('x1', xScale(currentBar.data.name) + xScale.bandwidth() / 2)
					.attr('y1', yScale(currentBar[1]))
					.attr('x2', xScale(nextBar.data.name) + xScale.bandwidth() / 2)
					.attr('y2', yScale(nextBar[1]))
					.attr('stroke', colorScaleLinesConexion(stackIndex / (stackedData.length - 1))) //'pink'
					.attr('stroke-width', 2);
			}
		});
	});

	//----------------

	//* Función para mostrar la ventana emergente
	function showTooltip(event, d) {
		// const tooltip = d3.select('.tooltip');

		let data;
		if (d.data) {
			// Si "d" tiene una propiedad "data", usamos esa propiedad como datos
			data = d.data;
		} else if (d[0] && d[0].data) {
			// Si "d[0]" tiene una propiedad "data", usamos esa propiedad como datos
			data = d[0].data;
		} else {
			// Si no se encuentra una estructura de datos válida, mostramos un mensaje de error
			console.error('Estructura de datos no válida');
			return;
		}

		const name = data.name !== undefined ? data.name : 'N/A';
		const sexo = data.sexo !== undefined ? data.sexo : 'N/A';
		const genero = data.genero !== undefined ? data.genero : 'N/A';
		const edad = data.edad !== undefined ? data.edad : 'N/A';
		const tallaHabitual = data.tallaHabitual !== undefined ? data.tallaHabitual : 'N/A';
		const clusterLabel = data.clusterLabel !== undefined ? data.clusterLabel : 'N/A';

		const tooltipContent =
			'<div>Nombre: ' +
			name +
			'</div>' +
			'<div>Sexo: ' +
			sexo +
			'</div>' +
			'<div>Género: ' +
			genero +
			'</div>' +
			'<div>Edad: ' +
			edad +
			'</div>' +
			'<div>Talla habitual: ' +
			tallaHabitual +
			'</div>' +
			'<div>Segmento asignado: ' +
			clusterLabel +
			'</div>';

		const containerWidth = svgContainer.getBoundingClientRect().width;
		const tooltipWidth = tooltip.node().getBoundingClientRect().width;
		const tooltipLeft = (containerWidth - tooltipWidth) / 2;

		// tooltip
		// 	.style('left', `${event.pageX}px`) // Usamos "event.pageX" en lugar de "d3.event.pageX"
		// 	.style('top', `${event.pageY}px`) // Usamos "event.pageY" en lugar de "d3.event.pageY"
		// 	.html(tooltipContent)
		// 	.classed('hidden', false);
		tooltip
			.style('left', `${tooltipLeft}px`)
			.style('top', '0')
			.html(tooltipContent)
			.classed('hidden', false)
			.style('font-size', '13px'); // tamaño del texto;
	}

	//* Función para ocultar la ventana emergente
	function hideTooltip(event, d) {
		const tooltip = d3.select('.tooltip');
		tooltip.classed('hidden', true);
	}
}

//-------------

//-------------

//* RECUPERACION DE LA BASE DE DATOS E INICIALIZACION DE TODO EL CODIGO*//

/* Llamamos al servidor/ruta para traer los datos, json() nos devuelve una promesa (pertenece a libreria D3.js),
	una vez se cumple la promesa - cargar los datos - ejecuta el argumento de la promesa
	que es la funcion init que hemos creado
*/
document.addEventListener('DOMContentLoaded', () => {
	json('../../models/dataset-simulated.json').then((data) => init(data)); // Anque primero procesaremos los dtos con el modelo de TensorFlow, nos vamlemos del método de la biblioteca D3js json para recuperar los datos de la base de datos
});

// Paso 6: Cargar el archivo JSON declarando la función json en el caso de no haber dispuesto del metodo json de D3js
//  function json(url) {
//     return fetch(url).then(response => response.json());
//   }
// const dataset = await loadJSONData('../../models/dataset-simulated.json'); // otra menera de recuperar los datos del archivo JSON

//*Código JS correspondiente a los slider de html que permite visualizar el número que se está introduciendo
// Función que actualiza el valor del slider a cada movimiento del usuario
