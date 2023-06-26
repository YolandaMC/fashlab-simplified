# fashlab-simplified
 Prototipo de interfaz para registro y análisis de datos relacionados con el cuerpo y sus dimensiones para su empleo en la industria de la moda


 Genial! Arreglado. Ahora quiero reciclar este código para otra forma de datos //*Seleccionamos el contenedor donde van nuestras visualizaciones
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
	} ya no se va a usar clusteredData sino sortedData que tiene una estructura de datos de la siguiente manera 
