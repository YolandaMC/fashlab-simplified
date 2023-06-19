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
let label = 'genero';
//! OJO añadir condicion si numero segmentos escogidos mayor que el numero de registros en la base, debe tomarse el largo de la base como numero de segmentos

//-------------

//-------------

//* DECLARACIONES *//
// DEclaracion de init que ejecutara todo el codigo del script
const init = (data) => {
	console.log(data);
	dataset = data;
	// Funcion del modelo de Tensorflow para clasificar dataset. Esta a su vez llamará drawRanges
	//! Ahora deberas poner un addEvent Listener en los Inputs que permitan las selecciones y en funcion de ellos llamar a las funciones modelRanges y modelRangesWithLabel
	modelRanges();
	//modelRangesWithLabel();
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

	// Paso 5: llamar a la función que va a dibujar mis datos
	drawRanges(clusteredData);
	// ...
}

//* Declaracion funcion que contendra modelo de Tensorflow para clasificar dataset CON DATOS CON ETIQUETA (SEXO O GENERO SEGUN DECIDA EL USUARIO).
function modelRangesWithLabel() {
	// Paso 1: Preparar los datos
	//TODO
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

//-------------

//-------------

//* RECUPERACION DE LA BASE DE DATOS E INICIALIZACION DE TODO EL CODIGO*//
/* Llamamos al servidor/ruta para traer los datos, json() nos devuelve una promesa,
	una vez se cumple la promesa - cargar los datos - ejecuta el argumento de la promesa
	que es la funcion init que hemos creado
*/
json('../../models/dataset-simulated.json').then((data) => init(data)); // Anque primero procesaremos los dtos con el modelo de TensorFlow, nos vamlemos del método de la biblioteca D3js json para recuperar los datos de la base de datos



//*  *//