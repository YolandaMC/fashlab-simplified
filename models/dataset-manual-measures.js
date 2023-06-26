//* ESTE ARCHIVO NO SE ESTA USANDO EN ESTA VERSION */


//* REGISTRO DE MEDIDAS DESDE EL APARTADO DE INTRODUCCION MANUAL DE MEDIDAS*//

const Cuerpo = require('./cuerpo.js'); //'./poke'

class Cuerpos {
	constructor() {
		this.cuerpos = []; //esta va a ser la lista medidas de cuerpos que en princio va a estar vacia
	}

	addCuerpo(cuerpo = new Cuerpo()) {
		//con este método añadimos cuerpos a la lista
		this.cuerpos.push(cuerpo);
	}

	getCuerpos() {
		//metodo que mostrara la lista de cuerpos
		return this.cuerpos;
	}

	// deleteCuerpo(id = '') { // no vamos a poder eliminar del dataset
	// 	//metodo de eliminar cuerpo a trvés de filter
	// 	this.cuerpos = this.cuerpos.filter((cuerpo) => cuerpo.id !== id); //id 'no eres igual' a id recorre la lista, devuelve true o false, en función de comprar el id que le pasamos con los id de la lista
	// 	return this.cuerpos;
	// }

}

module.exports = Cuerpos;
