//* ESTE ARCHIVO NO SE ESTA USANDO EN ESTA VERSION */

//* Base de datos fake para la visualización conjunta de los datos *//
const { v4: uuidv4 } = require('uuid');

let database = [
	//------- ASTM MEN
	{
		name: 1,
		id:uuidv4(),
		sexo: 'Masculino',
		genero: 'Hombre',
		edad: 25,
		tallaHabitual: 'XXS',
		medidasCorporales: {
			cuello: 38,
			espalda: 43,
			pecho: 86,
			cintura: 72,
			largdelantero: 43,
			largespalda: 45,
			cadera: 85,
			entrepierna: 79,
			estatura: 173
		}
	},
	{
		name: 2,
		id:uuidv4(),
		sexo: 'Masculino',
		genero: 'No-binario',
		edad: 18,
		tallaHabitual: 'S',
		medidasCorporales: {
			cuello: 40,
			espalda: 43,
			pecho: 91,
			cintura: 77,
			largdelantero: 45,
			largespalda: 45,
			cadera: 90,
			entrepierna: 78,
			estatura: 170
		}
	},
	{
		name: 3,
		id:uuidv4(),
		sexo: 'Masculino',
		genero: 'Hombre',
		edad: 53,
		tallaHabitual: 'S',
		medidasCorporales: {
			cuello: 40,
			espalda: 44,
			pecho: 94,
			cintura: 80,
			largdelantero: 44,
			largespalda: 45,
			cadera: 93,
			entrepierna: 81,
			estatura: 182
		}
	},
	{
		name: 4,
		id:uuidv4(),
		sexo: 'Masculino',
		genero: 'Hombre',
		edad: 33,
		tallaHabitual: 'M',
		medidasCorporales: {
			cuello: 42,
			espalda: 45,
			pecho: 102,
			cintura: 88,
			largdelantero: 47,
			largespalda: 46,
			cadera: 100,
			entrepierna: 82,
			estatura: 175
		}
	},
	{
		name: 5,
		id:uuidv4(),
		sexo: 'Masculino',
		genero: 'Mujer',
		edad: 22,
		tallaHabitual: 'M',
		medidasCorporales: {
			cuello: 44,
			espalda: 46,
			pecho: 106,
			cintura: 93,
			largdelantero: 46,
			largespalda: 46,
			cadera: 105,
			entrepierna: 82,
			estatura: 178
		}
	},
	{
		name: 6,
		id:uuidv4(),
		sexo: 'Masculino',
		genero: 'Hombre',
		edad: 48,
		tallaHabitual: 'L',
		medidasCorporales: {
			cuello: 45,
			espalda: 47,
			pecho: 112,
			cintura: 98,
			largdelantero: 45,
			largespalda: 46,
			cadera: 109,
			entrepierna: 79,
			estatura: 174
		}
	},
	{
		name: 7,
		id:uuidv4(),
		sexo: 'Masculino',
		genero: 'Hombre',
		edad: 32,
		tallaHabitual: 'XL',
		medidasCorporales: {
			cuello: 46,
			espalda: 49,
			pecho: 117,
			cintura: 104,
			largdelantero: 47,
			largespalda: 46,
			cadera: 113,
			entrepierna: 83,
			estatura: 181
		}
	},
	{
		name: 8,
		id:uuidv4(),
		sexo: 'Masculino',
		genero: 'Hombre',
		edad: 47,
		tallaHabitual: 'XL',
		medidasCorporales: {
			cuello: 47,
			espalda: 50,
			pecho: 122,
			cintura: 110,
			largdelantero: 46,
			largespalda: 46,
			cadera: 117,
			entrepierna: 81,
			estatura: 179
		}
	},
	{
		name: 9,
		id:uuidv4(),
		sexo: 'Masculino',
		genero: 'Hombre',
		edad: 39,
		tallaHabitual: 'XXL',
		medidasCorporales: {
			cuello: 50,
			espalda: 52,
			pecho: 132,
			cintura: 123,
			largdelantero: 49,
			largespalda: 47,
			cadera: 124,
			entrepierna: 79,
			estatura: 181
		}
	},
	//------- ASTM PETIT
	{
		name: 10,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 35,
		tallaHabitual: 'XS',
		medidasCorporales: {
			cuello: 35,
			espalda: 37,
			pecho: 87,
			cintura: 68,
			largdelantero: 40,
			largespalda: 39,
			cadera: 97,
			entrepierna: 71,
			estatura: 155
		}
	},
	{
		name: 11,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 27,
		tallaHabitual: 'L',
		medidasCorporales: {
			cuello: 38,
			espalda: 39,
			pecho: 94,
			cintura: 75,
			largdelantero: 41,
			largespalda: 39,
			cadera: 102,
			entrepierna: 72,
			estatura: 158
		}
	},
	{
		name: 12,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Hombre',
		edad: 27,
		tallaHabitual: 'XXL',
		medidasCorporales: {
			cuello: 40,
			espalda: 41,
			pecho: 112,
			cintura: 95,
			largdelantero: 43,
			largespalda: 39,
			cadera: 118,
			entrepierna: 69,
			estatura: 153
		}
	},
	{
		name: 13,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'No-binario',
		edad: 24,
		tallaHabitual: 'XXS',
		medidasCorporales: {
			cuello: 34,
			espalda: 36,
			pecho: 79,
			cintura: 66,
			largdelantero: 42,
			largespalda: 39,
			cadera: 85,
			entrepierna: 69,
			estatura: 156
		}
	},
	{
		name: 14,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 56,
		tallaHabitual: 'S',
		medidasCorporales: {
			cuello: 36,
			espalda: 37,
			pecho: 87,
			cintura: 72,
			largdelantero: 41,
			largespalda: 39,
			cadera: 92,
			entrepierna: 72,
			estatura: 173
		}
	},
	{
		name: 15,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 37,
		tallaHabitual: 'XL',
		medidasCorporales: {
			cuello: 39,
			espalda: 40,
			pecho: 102,
			cintura: 88,
			largdelantero: 43,
			largespalda: 40,
			cadera: 108,
			entrepierna: 70,
			estatura: 171
		}
	},
	//------- ASTM MISSY
	{
		name: 16,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 47,
		tallaHabitual: 'XS',
		medidasCorporales: {
			cuello: 35,
			espalda: 38,
			pecho: 83,
			cintura: 64,
			largdelantero: 42,
			largespalda: 40,
			cadera: 93,
			entrepierna: 67,
			estatura: 162
		}
	},
	{
		name: 17,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 29,
		tallaHabitual: 'M',
		medidasCorporales: {
			cuello: 37,
			espalda: 39,
			pecho: 92,
			cintura: 71,
			largdelantero: 44,
			largespalda: 41,
			cadera: 100,
			entrepierna: 74,
			estatura: 168
		}
	},
	{
		name: 18,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 23,
		tallaHabitual: 'M',
		medidasCorporales: {
			cuello: 38,
			espalda: 40,
			pecho: 94,
			cintura: 74,
			largdelantero: 43,
			largespalda: 41,
			cadera: 102,
			entrepierna: 72,
			estatura: 163
		}
	},
	{
		name: 19,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 23,
		tallaHabitual: 'L',
		medidasCorporales: {
			cuello: 38,
			espalda: 40,
			pecho: 98,
			cintura: 79,
			largdelantero: 43,
			largespalda: 41,
			cadera: 106,
			entrepierna: 75,
			estatura: 177
		}
	},
	{
		name: 20,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 30,
		tallaHabitual: 'XL',
		medidasCorporales: {
			cuello: 39,
			espalda: 42,
			pecho: 103,
			cintura: 83,
			largdelantero: 45,
			largespalda: 42,
			cadera: 110,
			entrepierna: 70,
			estatura: 169
		}
	},
	{
		name: 21,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 62,
		tallaHabitual: 'S',
		medidasCorporales: {
			cuello: 35,
			espalda: 38,
			pecho: 84,
			cintura: 68,
			largdelantero: 42,
			largespalda: 40,
			cadera: 90,
			entrepierna: 69,
			estatura: 154
		}
	},
	{
		name: 22,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 48,
		tallaHabitual: 'M',
		medidasCorporales: {
			cuello: 37,
			espalda: 39,
			pecho: 92,
			cintura: 78,
			largdelantero: 44,
			largespalda: 41,
			cadera: 96,
			entrepierna: 78,
			estatura: 167
		}
	},
	{
		iname: 23,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 68,
		tallaHabitual: 'L',
		medidasCorporales: {
			cuello: 38,
			espalda: 40,
			pecho: 99,
			cintura: 82,
			largdelantero: 43,
			largespalda: 41,
			cadera: 104,
			entrepierna: 68,
			estatura: 152
		}
	},
	{
		name: 24,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 35,
		tallaHabitual: 'XL',
		medidasCorporales: {
			cuello: 40,
			espalda: 42,
			pecho: 107,
			cintura: 91,
			largdelantero: 45,
			largespalda: 42,
			cadera: 112,
			entrepierna: 72,
			estatura: 167
		}
	},
	{
		name: 25,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 43,
		tallaHabitual: 'XXL',
		medidasCorporales: {
			cuello: 41,
			espalda: 44,
			pecho: 117,
			cintura: 103,
			largdelantero: 47,
			largespalda: 42,
			cadera: 122,
			entrepierna: 73,
			estatura: 165
		}
	},
	//------- ASTM PLUS
	{
		name: 26,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 25,
		tallaHabitual: 'L',
		medidasCorporales: {
			cuello: 39,
			espalda: 40,
			pecho: 105,
			cintura: 91,
			largdelantero: 45,
			largespalda: 42,
			cadera: 116,
			entrepierna: 72,
			estatura: 165
		}
	},
	{
		name: 27,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 72,
		tallaHabitual: 'XL',
		medidasCorporales: {
			cuello: 41,
			espalda: 41,
			pecho: 119,
			cintura: 106,
			largdelantero: 45,
			largespalda: 42,
			cadera: 129,
			entrepierna: 70,
			estatura: 160
		}
	},
	{
		name: 28,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 44,
		tallaHabitual: 'XXL',
		medidasCorporales: {
			cuello: 43,
			espalda: 42,
			pecho: 129,
			cintura: 117,
			largdelantero: 46,
			largespalda: 42,
			cadera: 140,
			entrepierna: 69,
			estatura: 160
		}
	},
	{
		name: 29,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 38,
		tallaHabitual: '3XL',
		medidasCorporales: {
			cuello: 44,
			espalda: 43,
			pecho: 135,
			cintura: 123,
			largdelantero: 47,
			largespalda: 42,
			cadera: 145,
			entrepierna: 68,
			estatura: 154
		}
	},
	{
		name: 30,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 52,
		tallaHabitual: '4XL',
		medidasCorporales: {
			cuello: 46,
			espalda: 45,
			pecho: 145,
			cintura: 135,
			largdelantero: 48,
			largespalda: 43,
			cadera: 155,
			entrepierna: 70,
			estatura: 157
		}
	},
	{
		name: 31,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 35,
		tallaHabitual: 'L',
		medidasCorporales: {
			cuello: 39,
			espalda: 40,
			pecho: 105,
			cintura: 95,
			largdelantero: 43,
			largespalda: 42,
			cadera: 110,
			entrepierna: 72,
			estatura: 148
		}
	},
	{
		name: 32,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 28,
		tallaHabitual: 'XL',
		medidasCorporales: {
			cuello: 41,
			espalda: 41,
			pecho: 115,
			cintura: 104,
			largdelantero: 45,
			largespalda: 42,
			cadera: 120,
			entrepierna: 75,
			estatura: 150
		}
	},
	{
		name: 33,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 66,
		tallaHabitual: 'XL',
		medidasCorporales: {
			cuello: 41,
			espalda: 41,
			pecho: 119,
			cintura: 110,
			largdelantero: 45,
			largespalda: 42,
			cadera: 124,
			entrepierna: 76,
			estatura: 167
		}
	},
	{
		name: 34,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'No-binario',
		edad: 46,
		tallaHabitual: '3XL',
		medidasCorporales: {
			cuello: 45,
			espalda: 44,
			pecho: 140,
			cintura: 132,
			largdelantero: 48,
			largespalda: 43,
			cadera: 145,
			entrepierna: 74,
			estatura: 164
		}
	},
	{
		name: 35,
		id:uuidv4(),
		sexo: 'Femenino',
		genero: 'Mujer',
		edad: 51,
		tallaHabitual: '5XL',
		medidasCorporales: {
			cuello: 49,
			espalda: 47,
			pecho: 160,
			cintura: 155,
			largdelantero: 50,
			largespalda: 43,
			cadera: 165,
			entrepierna: 72,
			estatura: 162
		}
	},
	//------- ASTM BIG MEN
	{
		name: 36,
		id:uuidv4(),
		sexo: 'Masculino',
		genero: 'Hombre',
		edad: 53,
		tallaHabitual: 'L',
		medidasCorporales: {
			cuello: 48,
			espalda: 48,
			pecho: 122,
			cintura: 114,
			largdelantero: 48,
			largespalda: 46,
			cadera: 120,
			entrepierna: 79,
			estatura: 177
		}
	},
	{
		name: 37,
		id:uuidv4(),
		sexo: 'Masculino',
		genero: 'Hombre',
		edad: 24,
		tallaHabitual: 'XL',
		medidasCorporales: {
			cuello: 49,
			espalda: 40,
			pecho: 127,
			cintura: 120,
			largdelantero: 47,
			largespalda: 46,
			cadera: 120,
			entrepierna: 78,
			estatura: 179
		}
	},
	{
		name: 38,
		id:uuidv4(),
		sexo: 'Masculino',
		genero: 'Hombre',
		edad: 71,
		tallaHabitual: '2XL',
		medidasCorporales: {
			cuello: 53,
			espalda: 53,
			pecho: 142,
			cintura: 137,
			largdelantero: 48,
			largespalda: 47,
			cadera: 134,
			entrepierna: 77,
			estatura: 169
		}
	},
	{
		name: 39,
		id:uuidv4(),
		sexo: 'Masculino',
		genero: 'Hombre',
		edad: 57,
		tallaHabitual: '3XL',
		medidasCorporales: {
			cuello: 55,
			espalda: 54,
			pecho: 147,
			cintura: 142,
			largdelantero: 48,
			largespalda: 48,
			cadera: 138,
			entrepierna: 76,
			estatura: 173
		}
	},
	{
		name: 40,
		id:uuidv4(),
		sexo: 'Masculino',
		genero: 'Hombre',
		edad: 42,
		tallaHabitual: '4XL',
		medidasCorporales: {
			cuello: 58,
			espalda: 57,
			pecho: 163,
			cintura: 157,
			largdelantero: 49,
			largespalda: 49,
			cadera: 154,
			entrepierna: 74,
			estatura: 182
		}
	}
];

// Exportar la base de datos para poder acceder a ella desde otros archivos
module.exports = database;

// // Contenido del archivo "main.js"

// var database = require("./database.js");

// // Acceder a los datos de la base de datos
// console.log(database[0]); // Imprimir el primer objeto de la base de datos
// console.log(database[1].genero); // Imprimir el valor de la propiedad 'genero' del segundo objeto
// console.log(database[2].medidasCorporales.altura); // Imprimir la altura del tercer objeto
