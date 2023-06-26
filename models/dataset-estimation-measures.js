//* ESTE ARCHIVO NO SE ESTA USANDO EN ESTA VERSION */

//* REGISTRO DE MEDIDAS DESDE EL APARTADO DE ESTIMACION DE MEDIDAS*//

const Cuerpoestimado = require('./cuerpoestimado.js'); //'./poke'

class Cuerposestimados {
	constructor() {
		this.cuerposestimados = []; //esta va a ser la lista medidas de cuerpos que en princio va a estar vacia
	}

	addCuerpoestimado(cuerpoestimado = new Cuerpoestimado()) {
		//con este método añadimos cuerpos a la lista
		this.cuerposestimados.push(cuerpoestimado);
	}

	getCuerposestimados() {
		//metodo que mostrara la lista de cuerpos
		return this.cuerposestimados;
	}

	// deleteCuerpoestimado(id = '') { // no vamos a poder eliminar del dataset
	// 	//metodo de eliminar cuerpo a trvés de filter
	// 	this.cuerposestimados = this.cuerposestimados.filter((cuerpoestimado) => cuerpoestimado.id !== id); //id 'no eres igual' a id recorre la lista, devuelve true o false, en función de comprar el id que le pasamos con los id de la lista
	// 	return this.cuerposestimados;
	// }
}

module.exports = Cuerposestimados;
