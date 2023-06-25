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
					//modelRanges();
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
				//modelRangesLabel();
				//TODO
			}
		}
	}
};

function drawDataset() {
	//*Seleccionamos el contenedor donde van nuestras visualizaciones
	const svgContainer = document.querySelector('.container-dataset-viewer');
	svgContainer.innerHTML = ''; // Elimina todo el contenido dentro del contenedor SVG antes de agregar uno nuevo

	//https://programmerclick.com/article/4640880948/
	//https://www.youtube.com/watch?v=Ihi0AFoC3PY
	//https://d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
	//https://codesandbox.io/s/2znnw8q16n
	//https://gist.github.com/KatiRG/5f168b5c884b1f9c36a5
	//https://dataviz.unhcr.org/tools/d3/d3_stacked_column_chart.html
	//https://plotly.com/javascript/bar-charts/
	//https://stackoverflow.com/questions/36146571/how-to-create-vertically-grouped-bar-chart-in-d3-js-using-json-data
	//https://codepen.io/benlister/pen/bNeLQy

	//* Establecemos tamaño del svg
	//! const width = 1200;
	//! const height = 600;
	// Margen
	const margin = { top: 20, right: 20, bottom: 20, left: 20 };
	// Espacio para la leyenda
	const legendWidth = 120;
	// Tamaño ajustado del SVG
	//! const svgWidth = width + margin.left + margin.right + legendWidth;
	//! const svgHeight = height + margin.top + margin.bottom;
	// Espacio entre barras
	const barSpacing = 5;

	//* Crea el SVG y establece su tamaño
	const svg = d3
		.select('.container-dataset-viewer')
		.append('svg')
		.attr('width', '100%') //svgWidth
		.attr('height', '100%') //svgHeight
		.attr('viewBox', '0 0 450 350')
		.attr('preserveAspectRatio', 'xMinYMin')
		.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`);

	//TODO
	// Obtén la lista de medidas corporales disponibles
	const medidasCorporales = Object.keys(dataset[0].medidasCorporales);

	// sort data in descending order by total value
	medidasCorporales.sort((a, b) => b.total - a.total);

	// stack the data
	const stack = d3.stack().keys(medidasCorporales).order(d3.stackOrderNone).offset(d3.stackOffsetNone);
	const stackedData = stack(medidasCorporales);

	//TODO

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

	// Aplica la función de stack a los datos
	const stackedData = d3.stack().keys(medidasCorporales)(formattedData);

	// Escalas
	const xScale = d3
		.scaleBand()
		.domain(formattedData[0].map((d) => d.x))
		.rangeRound([0, width])
		.padding(0.5);

	// Calcula el máximo valor acumulado de medidas corporales para el dominio del eje Y
	// const maxMeasure = d3.max(dataset, (d) => d3.sum(Object.values(d.medidasCorporales)));
	const yScale = d3
		.scaleLinear()
		.domain([0, d3.max(stackedData, (d) => d3.max(d, (d) => d[1]))])
		.range([height, 0]);

	//---------------------------------

	// Obtén una referencia al contenedor del gráfico

	const yAxis = d3
		.axisLeft(yScale)
		.ticks(6)
		.tickSize(-width)
		.tickFormat((d) => '$' + d);

	const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

	svg.append('g').attr('class', 'y axis').call(yAxis);

	svg
		.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + height + ')')
		.call(xAxis);

	svg
		.append('text')
		.attr('x', width / 2)
		.attr('y', height + 30)
		.attr('text-anchor', 'middle')
		.style('font-family', 'Helvetica')
		.style('font-size', 12)
		.text('Year');

	svg
		.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(-30,' + height / 2 + ')rotate(-90)')
		.style('font-family', 'Helvetica')
		.style('font-size', 12)
		.text('Sale');

	const groups = svg
		.selectAll('g.bars')
		.data(stackedData)
		.enter()
		.append('g')
		.attr('class', 'bars')
		.style('fill', (d, i) => colors[i])
		.style('stroke', '#000');

	const rect = groups
		.selectAll('rect')
		.data((d) => d)
		.enter()
		.append('rect')
		.attr('x', (d) => xScale(d.data.x))
		.attr('y', (d) => yScale(d[1]))
		.attr('height', (d) => {
			console.log('Value 1:', d[0]);
			console.log('Value 2:', d[1]);
			return yScale(d[0]) - yScale(d[1]);
		})
		.attr('width', xScale.bandwidth());
}

document.addEventListener('DOMContentLoaded', () => {
	json('../../models/dataset-simulated.json').then((data) => init(data)); // Anque primero procesaremos los dtos con el modelo de TensorFlow, nos vamlemos del método de la biblioteca D3js json para recuperar los datos de la base de datos
});



//* Declaracion funcion que dibuja los resultados de la division/rangos realizados por TensorFlow. EMPLEA D3JS
function drawRanges(clusteredData) {
	//*Seleccionamos el contenedor donde van nuestras visualizaciones
	const svgContainer = document.querySelector('.container-dataset-viewer');
	svgContainer.innerHTML = ''; // Elimina todo el contenido dentro del contenedor SVG antes de agregar uno nuevo

	console.log(clusteredData);

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