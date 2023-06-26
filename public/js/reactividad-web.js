'use strict';

//Código JS correcpondiente al botón de html con id #btn-ampliar que permite ampliar y reducir el canvas #lienzo
// const container = document.querySelector('.container');
// const ampliarLienzo = document.querySelector('#lienzo');
// const btnAmpliar = document.querySelector('#btn-ampliar');

// // Función que me permite ampliar el canvas #lienzo y su .container y que el botón me permita reducir despues cambiando la función del atributo onclik
// function ampliar() {
// 	container.style.width = '100%';
// 	container.style.height = '100vh';
// 	container.style.margin = '0';

// 	ampliarLienzo.style.width = '100%';
// 	ampliarLienzo.style.height = '100vh';
// 	ampliarLienzo.style.backgroundSize = 'cover';
// 	ampliarLienzo.style.backgroundRepeat = 'no-repeat';

// 	// Cambio el texto que aparece en el botón
// 	btnAmpliar.innerHTML = 'Reducir pantalla';
// 	// Cambio su posición
// 	btnAmpliar.style.position = 'fixed';
// 	btnAmpliar.style.top = '10px';
// 	btnAmpliar.style.left = '10px';
// 	btnAmpliar.style.zIndex = '1';
// 	// Cambio la función del atributo onclick de ampliar a reducir
// 	btnAmpliar.setAttribute('onclick', 'reducir()');
// }

// // Función que me permite reducir el canvas #lienzo y su .container y que el botón me permita ampliar despues cambiando la función del atributo onclik
// function reducir() {
// 	//Dimensiones originales canvas #lienzo y .container
// 	container.style.width = '840px';
// 	container.style.height = '700px';
// 	// container.style.margin = '20px auto'; margen añadido al padre section

// 	ampliarLienzo.style.width = '840px';
// 	ampliarLienzo.style.height = '700px';

// 	// Cambio el texto que aparece en el botón
// 	btnAmpliar.innerHTML = 'Ampliar pantalla';
// 	// Cambio su posición
// 	btnAmpliar.style.position = 'relative';
// 	btnAmpliar.style.top = '0';
// 	btnAmpliar.style.left = '0';
// 	btnAmpliar.style.zIndex = '0';
// 	// Cambio la función del atributo onclick de ampliar a reducir
// 	btnAmpliar.setAttribute('onclick', 'ampliar()');
// }

//-----------

//-----------

//*Código JS correspondiente a los slider de html que permite visualizar el número que se está introduciendo
// Función que actualiza el valor del slider a cada movimiento del usuario
function updateRange() {
	const limit = this.parentElement.getElementsByClassName('limit')[0];
	// limit.innerHTML = this.value;
	limit.textContent = this.value;
}

const slideContainers = document.getElementsByClassName('slidecontainer');

for (let i = 0; i < slideContainers.length; i++) {
	const slider = slideContainers[i].getElementsByClassName('slider')[0];
	updateRange.call(slider);
	slider.oninput = updateRange;
}
