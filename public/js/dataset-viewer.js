// Traemos el metodo para recuperar datos JSON de la biblioteca D3.js
const { json } = d3;

// Lamamos al servidor/ruta para traer los datos
json('../../models/dataset-simulated.json').then((data) => init(data));

const init = (data) => {
	console.log(data);
};
