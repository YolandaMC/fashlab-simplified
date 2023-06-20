// ESTA FUNCION ES LLAMADA DESDE datos-formulario.js

'use strict';

/* ESTE SCRIPT ELIMINA LOS ELEMENTOS DEL DOM DEL ARCHIVO 
	manual-measurements.html Y COLOCA UNOS NUEVOS PARA
    DESPUES LLAMAR A LA FUNCION datos-click()
	QUE SE ENCUENTRA DECLARADA EN datos-clik.js*/

//----------------------------

//* Funcion para eliminar los elementos del DOM <form id="#datos-formulario"> y <div class=svg-container> *//
function pantallaWebcam() {
	console.log('Ya podemos pasar al siguiente apartado ahora que tenemos los datos del formulario');
	console.log(datosFormulario);
	//* ELIMINAMOS ELEMENTOS DOM INNECESARIOS ANTES DE PASAR A CREAR LOS DE LA PANTALLA TOMA DE CAPTURAS DESDE LA WEBCAM Y DATOS CLICKS */
	const sectionLeft = document.querySelector('.section-left');
	sectionLeft.removeChild(formulario); //No hace falta declarar una variable para alojar el elemento formulario pues ya lo he cogido en datos-formulario.js y esta en la variable formulario
	const containerSectionRight = document.querySelector('.right-container');
	const imgInfoMedidas = document.querySelector('.imagen-medidas');
	containerSectionRight.removeChild(imgInfoMedidas);
}
