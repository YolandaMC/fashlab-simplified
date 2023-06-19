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
	const data = dataset.map((obj) => Object.values(obj.medidasCorporales));
	// Convertir los datos a un tensor de TensorFlow.js
	const tensorData = tf.tensor2d(data);

	// Paso 3: Crear y entrenar el modelo
	const numClasses = numRanges; // Definimos el números de clases rangos que deseamos. Al no disponer de datos etiquetados debemos indicar cuantas clases o rangos esperamos encontrar en los datos
	const numFeatures = tensorData.shape[1];
	// Declaramos un modelo tipo sequencial para clasificar nuestros datos sin etiquetar
	const model = tf.sequential();
	model.add(tf.layers.dense({ units: 10, inputShape: [numFeatures], activation: 'relu' }));
	model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));

	// Paso 4: Compilar el modelo
	model.compile({ loss: 'categoricalCrossentropy', optimizer: 'adam', metrics: ['accuracy'] });

	// Paso 5: Entrenar el modelo
	const labels = tf.oneHot(tf.tensor1d([0, 1, 2], 'int32'), numClasses);
	const epochs = 50; // Numero de iteracioens de entrenamiento
	const batchSize = 16; // Cantidad de ejemplo de entrenamiento empelados en cada iteracion 8 / 16 / 32

	async function trainModel() {
		return await model.fit(tensorData, labels, { epochs, batchSize });
	}

	trainModel().then(() => {
		// Paso 4: Hacer predicciones y ordenar las clases
		const predictions = model.predict(tensorData);
		const predictionsArray = Array.from(predictions.dataSync());
		// Ordenamos los arrays de predicción en función de la variable pecho que es la más habitual. Puede darse la opcion de esto mas adelane al usuario
		const sortedClasses = predictionsArray
			.map((pred, index) => ({ class: index, prediction: pred }))
			.sort((a, b) => {
				const chestA = rawData[a.class].medidasCorporales.pecho;
				const chestB = rawData[b.class].medidasCorporales.pecho;
				return chestA - chestB;
			});

		sortedClasses.forEach((obj) => {
			const classIndex = obj.class;
			const prediction = obj.prediction;
			const classData = rawData[classIndex];

			console.log(`Clase ${classIndex}`);
			console.log('Predicción:', prediction);
			console.log('Nombre:', classData.name);
			console.log('Sexo:', classData.sexo);
			console.log('Género:', classData.genero);
			console.log('Edad:', classData.edad);
			console.log('Talla Habitual:', classData.tallaHabitual);
			console.log('Medidas Corporales:', classData.medidasCorporales);
			console.log('--------------------');
		});

		//const results = 'entrenamiento';
		//return results;
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
