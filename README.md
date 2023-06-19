# fashlab-simplified
 Prototipo de interfaz para registro y análisis de datos relacionados con el cuerpo y sus dimensiones para su empleo en la industria de la moda



Vale, vamos a crear el código para ajustarlo a lo que ya tengo. Te doy indicaciones: Bien, voy a especificarte cómo quiero que sea la clasificación en base a los datos CON UNA ETIQUETA y saber si puedes ayudarme. Tengo una base de datos en JSON con la siguiente estructura de datos  {
		"name": 1,
		"sexo": "Masculino",
		"genero": "Hombre",
		"edad": 25,
		"tallaHabitual": "XXS",
		"medidasCorporales": {
			"cuello": 38,
			"espalda": 43,
			"pecho": 86,
			"cintura": 72,
			"largdelantero": 43,
			"largespalda": 45,
			"cadera": 85,
			"entrepierna": 79,
			"estatura": 173
		}
	}, y deseo que me clasifique estos datos en el número de clases que yo le indique solo teniendo en cuenta para esta clasificación los datos del objeto medidas corporales : {
			"cuello": 38,
			"espalda": 43,
			"pecho": 86,
			"cintura": 72,
			"largdelantero": 43,
			"largespalda": 45,
			"cadera": 85,
			"entrepierna": 79,
			"estatura": 173
		}. Cuando el modelo me haya clasificado los datos sin etiquetar en las clases que yo le haya indicado, quiero que cada clase se ordene con teniendo en cuenta el valor de la cadena pecho de menor a mayor. Quisiera que cuando se hayan clasificado los objetos del archivo JSON a través del  modelo de TensorFlow.js sigan asociados a el resto de cadenas -valor que tienen los objetos, quiero decir que cada conjunto de medidasCorporales {} siga asociado con el resto de cadenas-valor que le corresponde pero que no hemos tenido en cuenta para la clasificación, que son name, sexo, genero, edad, tallaHabitual . Solo deseo emplear TensorFlow.js y recuerda que los datos son sin etiquetar