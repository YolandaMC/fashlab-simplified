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
const colors = [// 80 == 50% opacidad
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

		// Limpiamos los elementos creados apra la otra opción
		const labelContainer = document.querySelector('#label-container');
		labelContainer.innerHTML = ''; // Limpiar cualquier contenido anterior
		labelType = undefined; // Reiniciar el valor de labelType si no se selecciona un input
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
				console.log(this.value);
				//Actualizamos el valor de labelType con al seleccion
				labelType = this.value;
				console.log(labelType);
				//TODO
				//* Funcion del modelo de Tensorflow para clasificar dataset con datos etiquetados. Esta a su vez llamará drawRanges
				// Etiqueta la dataset en según la seleccion del usuario haya hecho en el DOM
				modelRangesLabel();
				//TODO
			}
		}
	}
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
	const predictions = model.predict(extractFeatures(dataset));

	//* Paso 8: Decodificar las etiquetas predichas
	// const decodedLabels = encodedLabels.map((encodedLabel) => {
	// 	return Array.from(labelEncoder.keys()).find((label) => labelEncoder.get(label) === encodedLabel);
	// });
	const decodedLabels = Array.from(predictions.argMax(1).dataSync()); //!REVISAR ESTOS PARAMETROS PARA VER LOS MAS OPTIMOS

	//* Paso 9: Obtener los valores de la cadena 'pecho' para ordenar las clases
	const chestValues = dataset.map((obj) => obj.medidasCorporales.pecho);

	//* Paso 10: Agrupar las predicciones y las etiquetas por clase
	const groupedData = groupDataByClass(predictions, decodedLabels, chestValues);

	//* Paso 11: Ordenar las clases por el valor de 'pecho'
	const sortedData = sortDataByChest(groupedData);

	//* Paso 12: llamar a la función que va a dibujar mis datos o retornar los datos clasificados y ordenados
	//return sortedData;
	console.log(sortedData);

	//----

	//----

	drawRangesLabel();
	// drawRangesLabel(sortedData);

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

//* Declaracion funcion que dibuja los resultados de la division/rangos realizados por TensorFlow. EMPLEA D3JS
function drawRanges(clusteredData) {
	//*Seleccionamos el contenedor donde van nuestras visualizaciones
	const svgContainer = document.querySelector('.container-dataset-viewer');
	svgContainer.innerHTML = ''; // Elimina todo el contenido dentro del contenedor SVG antes de agregar uno nuevo

	//* Establecemos tamaño del svg
	// const width = datasetViewer.width; // Ancho del contenedor SVG
	const width = 1400; // Ancho del contenedor SVG
	const height = 600; // Alto del contenedor SVG

	// Crear el contenedor SVG en el DOM
	//const svg = d3.select('.container-viewer').append('svg').attr('width', width).attr('height', height); //.select('body')
	const svg = d3
		.select('.container-dataset-viewer') //Seleccionamos el contenedor donde colocar el svg
		.append('svg') // declaramos el tipo de elemento a añadir
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'svg-container');

	// Calcular el tamaño de cada círculo en función del número de instancias en el cluster
	const maxInstances = d3.max(clusteredData, (d) => d.clusterLabel);
	const circleRadius = Math.min(width, height) / (maxInstances * 2);

	//TODO

	//TODO

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

function drawRangesLabel() {
	//*Seleccionamos el contenedor donde van nuestras visualizaciones
	const svgContainer = document.querySelector('.container-dataset-viewer');
	svgContainer.innerHTML = ''; // Elimina todo el contenido dentro del contenedor SVG antes de agregar uno nuevo
}

function drawDataset() {
	//*Seleccionamos el contenedor donde van nuestras visualizaciones
	const svgContainer = document.querySelector('.container-dataset-viewer');
	svgContainer.innerHTML = ''; // Elimina todo el contenido dentro del contenedor SVG antes de agregar uno nuevo

	//https://programmerclick.com/article/4640880948/

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

	// Configuración de colores para cada medida corporal
	// Obtén el número de medidas corporales y el número de colores disponibles
	const numMedidasCorporales = medidasCorporales.length;
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

	const yScale = d3
		.scaleLinear()
		.domain([0, d3.max(dataset, (d) => d3.sum(Object.values(d.medidasCorporales)))])
		.range([height, 0]);

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
		.join(
			(enter) => enter.append('rect'),
			(update) => update,
			(exit) => exit.remove()
		)
		.attr('x', (d) => xScale(d.data.name))
		.attr('y', (d) => yScale(d[1]))
		.attr('height', (d) => yScale(d[0]) - yScale(d[1]))
		.attr('width', xScale.bandwidth()); //14

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

	//Agrega valor name debajo de cada barra
	// stackGroup
	// 	.selectAll('text')
	// 	.data((d) => d)
	// 	.join('text')
	// 	.text((d) => d.data.name) // Establece el contenido del texto como el valor de la clave "name"
	// 	.attr('x', (d) => xScale(d.data.name) + xScale.bandwidth() / 2)
	// 	.attr('y', (d) => yScale(d[0]) + 15) // Posición debajo de la barra con un margen
	// 	.attr('text-anchor', 'middle') // Alineación horizontal al centro
	// 	.style('font-size', '12px') // Ajusta el tamaño de la fuente aquí
	// 	.style('fill', 'black') ;// Color del texto
	// 	//.attr('transform', 'translate(0, 5)'); // Ajuste vertical del texto para evitar superposición


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

//-------------

//-------------

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
