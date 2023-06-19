//* IMPORTACIONES Y METODOS*//
/* Traemos el metodo para recuperar datos JSON, los métodos select y selectAll que nos 
	permiten trabajar con lso elementos del DOM de la biblioteca D3.js
*/
//Importamos la libreria TensorFlow.js
const { json, select, selectAll } = d3;
const tf = window.tf; //const tf = window.tf;

//* VARIABLES A NIVEL GLOBAL*//
// Creo dataset en la introduciré la base de datos
// Creo ranges para alojar los resutados que me devuelva el modelo TensorFlow
// Creo viewer que contendra un elemento que creare para el DOM donde se alojara mi svg
let dataset, ranges, viewer;
let numRanges = 3; // Luego lo cambiaras por el numero introducido en el DOM

//* DECLARACIONES *//
// DEclaracion de init que ejecutara todo el codigo del script
const init = (data) => {
	console.log(data);
	dataset = data;
	modelRanges();
	// Funcion del modelo de Tensorflow para clasificar dataset. DEVUELVE RANGES
	//ranges = modelRanges();
	//console.log(ranges);
	// Funcion que dibuja los resultados, ranges, para se visualizados desde el navegador
	//drawRanges();
};

// Declaracion funcion que dibuja los resultados de la division/rangos realizados por TensorFlow. EMPLEA D3JS
function drawRanges() {
	viewer = select('.container-viewer')
		.append('svg')
		.attr('width', window.innerWidth)
		.attr('height', window.innerHeight); // Establecer luego si este ancho y alto te viene bien
	//
}

// Declaracion funcion del modelo de Tensorflow para clasificar dataset. DEVUELVE RANGES
function modelRanges() {
	// Paso 1: Preparar los datos
	// En la funcion init, hemos introducido en la variable global dataset el json data recuperado con el metodo json de D3js
	// Extraer solo las medidas corporales de los datos sin etiquetar
	const processedData = dataset.map((obj) => Object.values(obj.medidasCorporales));
	// Convertir los datos a un tensor de TensorFlow.js
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

	// Imprimir los datos clasificados y ordenados
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
}

// Paso 6: Cargar el archivo JSON declarando la función json en el caso de no haber dispuesto del metodo json de D3js
//  function json(url) {
//     return fetch(url).then(response => response.json());
//   }

//* RECUPERACION DE LA BASE DE DATOS E INICIALIZACION DE TODO EL CODIGO*//
/* Llamamos al servidor/ruta para traer los datos, json() nos devuelve una promesa,
	una vez se cumple la promesa - cargar los datos - ejecuta el argumento de la promesa
	que es la funcion init que hemos creado
*/
/* Anque primero procesaremos los dtos con el modelo de TensorFlow, nos vamlemos 
	del método de la biblioteca D3js json para recuperar los datos de la base de datos
 */
json('../../models/dataset-simulated.json').then((data) => init(data));