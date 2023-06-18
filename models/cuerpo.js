const { v4: uuidv4 } = require('uuid');

class Cuerpo {
	constructor(name = 'no-name') {
		//si alquien no manda nada se va a colocar el string 'no-name' es porque javascript no tiene tipado
		this.id = uuidv4(); //esto me genera un identificador unico cuando añada un cuerpo
        this.time = Date.now(); // tiempo transcurrido desde Epoch. para recuperarlo //const fecha = new Date(time); //fecha.toISOString(); // "2020-06-13T18:30:00.000Z"
		this.medidas = medidas;
		this.frente = frente;
		this.perfil = perfil;
		this.ptosFrente = ptosFrente;
		this.ptosPerfil = ptosPerfil;
	}
}

module.exports = Cuerpo;
