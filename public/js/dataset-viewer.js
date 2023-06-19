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
let numRanges = 3; // Luego lo cambiaras por el numero introducido en el DOM
let labelType = 'genero'; // Luego lo cambiaras por la opcion introducida en el DOM
//! OJO añadir condicion si numero segmentos escogidos mayor que el numero de registros en la base, debe tomarse el largo de la base como numero de segmentos

//-------------

//-------------

//* DECLARACIONES *//
// DEclaracion de init que ejecutara todo el codigo del script
const init = (data) => {
	//console.log(data);
	dataset = data;

	// Funcion del modelo de Tensorflow para clasificar dataset. Esta a su vez llamará drawRanges
	//! Ahora deberas poner un addEvent Listener en los Inputs que permitan las selecciones y en funcion de ellos llamar a las funciones modelRanges y modelRangesWithLabel
	//! Lo agregaremos fuera de esta funcion y estableceremos que se inicie cuando el contenido del DOM este cargado addEventListener 'DOMContentLoaded'
	//modelRanges();
	//modelRangesLabel();
	//console.log(optionModel.value);

	//* Evaluamos las opciones tomadas por el usuario
	// Escuchar el evento change en el input optionModel
	// Escuchar el evento change en los inputs radio
	const radioInputs = document.querySelectorAll('input[type="radio"][name="option-model"]');
	radioInputs.forEach((radio) => {
		radio.addEventListener('change', actualizarOptionModel);
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
			rangeInput.addEventListener('change', function () {
				// Obtener el valor seleccionado y realizar las acciones correspondientes
				console.log('Selected range value:', this.value);
				// Llamar a la función necesaria con el valor seleccionado
				// modelRangesWithValue(this.value);
				numRanges = rangeInput.value;
				console.log(numRanges);
				//TODO
				//* Funcion del modelo de Tensorflow para clasificar dataset. Esta a su vez llamará drawRanges
				//modelRanges();
				//TODO
			});
			// Insertar el elemento range en el DOM
			// Por ejemplo, dentro de un contenedor con id "range-container"
			const rangeContainer = document.querySelector('#range-container');
			rangeContainer.appendChild(rangeInput);
		}

		// Limpiamos los elementos creados apra la otra opción
		const labelContainer = document.querySelector('#label-container');
		labelContainer.innerHTML = ''; // Limpiar cualquier contenido anterior
		labelType = undefined; // Reiniciar el valor de labelType si no se selecciona un input
	} else if (labelModelRadio.checked) {
		//! revisar todo el else if, te propone una funcion updateLabelType para actualizar el valor de labelType
		console.log(labelModelRadio.value);

		// Eliminar el elemento range si existe
		const rangeInput = document.querySelector('#range-input');
		if (rangeInput) {
			rangeInput.parentNode.removeChild(rangeInput);
		}

		const sexoInput = document.createElement('input');
		sexoInput.type = 'input';
		sexoInput.id = 'sexo-input'; // Identificador único para el input de sexo
		sexoInput.value = 'sexo';
		sexoInput.addEventListener('change', function () {
			const selectedValue = this.value;
			console.log('Selected sexo value:', selectedValue);
			labelType = selectedValue; // Almacenar el valor en la variable global
			console.log(labelType);
			//TODO
			//* Funcion del modelo de Tensorflow para clasificar dataset. Esta a su vez llamará drawRanges
			//modelRangesLabel();
			//TODO
		});

		const generoInput = document.createElement('input');
		generoInput.type = 'input';
		generoInput.id = 'genero-input'; // Identificador único para el input de género
		generoInput.value = 'género';
		generoInput.addEventListener('change', function () {
			const selectedValue = this.value;
			console.log('Selected género value:', selectedValue);
			labelType = this.value; // Almacenar el valor del input en la variable global
			console.log(labelType);
			//TODO
			//* Funcion del modelo de Tensorflow para clasificar dataset. Esta a su vez llamará drawRanges
			//modelRangesLabel();
			//TODO
		});

		//* Colocamos los inputs en el DOM
		const labelContainer = document.querySelector('#label-container');
		labelContainer.innerHTML = ''; // Limpiar cualquier contenido anterior
		labelContainer.appendChild(sexoInput);
		labelContainer.appendChild(generoInput);

		labelType = undefined; // Reiniciar el valor de labelType si no se selecciona un input

		// Verificar el estado de los elementos de radio al cambiar
		labelModelRadio.addEventListener('change', function () {
			if (!this.checked) {
				labelContainer.innerHTML = ''; // Limpiar los campos de texto si el elemento de radio no está seleccionado
			}
		});
		//!
		//* Seleccionar los inputs de sexo y género por sus identificadores para que cambien con el evento change
		const sexoInputSelected = document.querySelector('#sexo-input');
		const generoInputSelected = document.querySelector('#genero-input');

		// Agregar eventos 'change' a los inputs seleccionados
		sexoInputSelected.addEventListener('change', function () {
			const selectedValue = this.value;
			console.log('Selected sexo value:', selectedValue);
			labelType = selectedValue; // Almacenar el valor en la variable global
			console.log(labelType);
			// TODO: Funcion del modelo de Tensorflow para clasificar dataset. Esta a su vez llamará drawRanges
			// modelRangesLabel();
			// TODO
		});

		generoInputSelected.addEventListener('change', function () {
			const selectedValue = this.value;
			console.log('Selected género value:', selectedValue);
			labelType = selectedValue; // Almacenar el valor del input en la variable global
			console.log(labelType);
			// TODO: Funcion del modelo de Tensorflow para clasificar dataset. Esta a su vez llamará drawRanges
			// modelRangesLabel();
			// TODO
		});
		//!
	}
};

//* Declaracion funcion que contendra modelo de Tensorflow para clasificar dataset CON DATOS SIN ETIQUETAR.
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
	drawRanges(clusteredData);
	// ...
}

//* Declaracion funcion que contendra modelo de Tensorflow para clasificar dataset CON DATOS CON ETIQUETA (SEXO O GENERO SEGUN DECIDA EL USUARIO).
function modelRangesLabel() {
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

	const features = extractFeatures(dataset);
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
	const numClasses = uniqueLabels.length; // Se define el numero de clases en base a las distintas etiquetas de la base de datos

	//* Paso 4: Crear un modelo secuencial
	const model = tf.sequential();
	model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [9] }));
	model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));
	//model.add(tf.layers.dense({ units: numClusters, activation: 'softmax' }));
	//model.add(tf.layers.dense({ units: uniqueLabels.length, activation: 'softmax' }));

	//* Paso 5: Compilar el modelo
	model.compile({ optimizer: 'adam', loss: 'sparseCategoricalCrossentropy' });

	//* Paso 6: Entrenar el modelo
	//model.fit(extractFeatures(dataset), encodedLabels, { epochs: 50 });
	model.fit(features, labelsTensor, { epochs: 50 }); // numero de iteraciones

	//* Paso 7: Realizar las predicciones en los datos de entrada
	const predictions = model.predict(extractFeatures(dataset));

	//* Paso 8: Decodificar las etiquetas predichas
	// const decodedLabels = encodedLabels.map((encodedLabel) => {
	// 	return Array.from(labelEncoder.keys()).find((label) => labelEncoder.get(label) === encodedLabel);
	// });
	const decodedLabels = Array.from(predictions.argMax(1).dataSync());

	//* Paso 9: Obtener los valores de la cadena 'pecho' para ordenar las clases
	const chestValues = dataset.map((obj) => obj.medidasCorporales.pecho);

	//* Paso 10: Agrupar las predicciones y las etiquetas por clase
	const groupedData = groupDataByClass(predictions, decodedLabels, chestValues);

	//* Paso 11: Ordenar las clases por el valor de 'pecho'
	const sortedData = sortDataByChest(groupedData);

	//* Paso 12: llamar a la función que va a dibujar mis datos o retornar los datos clasificados y ordenados
	//return sortedData;
	console.log(sortedData);
	//drawRanges(sortedData);
	// ...

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

//* Declaracion funcion que dibuja los resultados de la division/rangos realizados por TensorFlow. EMPLEA D3JS
function drawRanges(clusteredData) {
	// viewer = select('.container-viewer')
	// 	.append('svg')
	// 	.attr('width', window.innerWidth)
	// 	.attr('height', window.innerHeight); // Establecer luego si este ancho y alto te viene bien
	// //
	const width = 500; // Ancho del contenedor SVG
	const height = 500; // Alto del contenedor SVG

	// Crear el contenedor SVG en el DOM
	const svg = d3.select('.container-viewer').append('svg').attr('width', width).attr('height', height); //.select('body')

	// Definir colores para cada cluster
	const colors = ['red', 'green', 'blue', 'yellow'];

	// Calcular el tamaño de cada círculo en función del número de instancias en el cluster
	const maxInstances = d3.max(clusteredData, (d) => d.clusterLabel);
	const circleRadius = Math.min(width, height) / (maxInstances * 2);

	// Dibujar los círculos en el SVG, uno por cada instancia clasificada
	svg
		.selectAll('circle')
		.data(clusteredData)
		.enter()
		.append('circle')
		.attr('cx', (d) => (d.medidasCorporales.pecho / 100) * width) // Coordenada x basada en el valor de "pecho"
		.attr('cy', (d) => (d.medidasCorporales.estatura / 200) * height) // Coordenada y basada en el valor de "estatura"
		.attr('r', circleRadius)
		.attr('fill', (d) => colors[d.clusterLabel]);
}

// Paso 6: Cargar el archivo JSON declarando la función json en el caso de no haber dispuesto del metodo json de D3js
//  function json(url) {
//     return fetch(url).then(response => response.json());
//   }
// const dataset = await loadJSONData('../../models/dataset-simulated.json'); // otra menera de recuperar los datos del archivo JSON

//-------------

//-------------

//* RECUPERACION DE LA BASE DE DATOS E INICIALIZACION DE TODO EL CODIGO*//
/* Llamamos al servidor/ruta para traer los datos, json() nos devuelve una promesa,
	una vez se cumple la promesa - cargar los datos - ejecuta el argumento de la promesa
	que es la funcion init que hemos creado
*/
document.addEventListener('DOMContentLoaded', () => {
	json('../../models/dataset-simulated.json').then((data) => init(data)); // Anque primero procesaremos los dtos con el modelo de TensorFlow, nos vamlemos del método de la biblioteca D3js json para recuperar los datos de la base de datos
});
//*  *//
