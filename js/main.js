const cardTemplate = document.getElementById('card-template').content;
const fragment = document.createDocumentFragment();
const $cards_casos_dolor = document.querySelector('.cards-casos-dolor');

//botones mapa y umbrales
const $btn_mapa = document.querySelector('#btn-mapa');
const $btn_umbrales = document.querySelector('#btn-umbrales');
const $linea_mapa = document.getElementById('linea-mapa');
const $linea_umbrales = document.getElementById('linea-umbrales');

// secciones mapa y umbrales
const $seccion_mapa = document.querySelector('.cards-casos-dolor');
const $seccion_umbrales = document.querySelector('.umbrales-info');


// template umbrales
const $template_umbrales = document.getElementById('template-umbrales').content;
const $fragment_umbrales = document.createDocumentFragment();
const $umbrales = document.querySelector('.umbrales-info');

let $ranges = document.querySelectorAll('.escala-dolor');


// resultados
const $resultados = document.querySelector('.resultados');

// btn calcular-limpiar
const $btn_calcular_limpiar = document.getElementById('btn-calcular-limpiar');


// main
const $main = document.querySelector('main');


const array_umbrales = [
    {
        numero: 1,
        range: '1-3',
        titulo: 'UMBRAL DEL DOLOR ALTO',
        descripcion: 'Tienes una capacidad mayor para tolerar la sensación de dolor',
    },
    {
        numero: 4,
        range: '4-5',
        titulo: 'UMBRAL DE DOLOR MEDIO-ALTO',
        descripcion: 'Tienes una buena capacidad para tolerar la sensación de dolor',
    },
    {
        numero: 6,
        range: '6-7',
        titulo: 'UMBRAL DE DOLOR MEDIO',
        descripcion: 'Tienes una capacidad media para tolerar la sensación de dolor',
    },
    {
        numero: 8,
        range: '8-9',
        titulo: 'UMBRAL DE DOLOR BAJO',
        descripcion: 'Tienes una capacidad poco tolerable ante la sensación de dolor',
    },
    {
        numero: 10,
        range: '10',
        titulo: 'INTOLERANCIA TOTAL AL DOLOR',
        descripcion: 'Experimentas una sensación de dolor extremo',
    }
];



const fetchData = async () => {
    try {
        const res = await fetch('js/data.json');
        const data = await res.json();
        console.log(data);
        pintarCards(data);
    } catch (error) {
        console.log(error);
    }
}

const pintarCards = data => {
    data.forEach(producto => {
        // console.log(producto);
        cardTemplate.querySelector('img').setAttribute('src', producto.link_img);
        cardTemplate.querySelector('p.descripcion').textContent = producto.descripcion;

        const clone = cardTemplate.cloneNode(true);
        fragment.appendChild(clone);
    });
    $cards_casos_dolor.appendChild(fragment);
}

const pintarUmbrales = () => {
    let arrayReverse = [...array_umbrales].reverse();

    arrayReverse.forEach(umbrales => {
        $template_umbrales.querySelector('article div:first-child').textContent = umbrales.range;
        $template_umbrales.querySelector('h2').textContent = umbrales.titulo;
        $template_umbrales.querySelector('p').textContent = umbrales.descripcion;

        const clone = $template_umbrales.cloneNode(true);
        $fragment_umbrales.prepend(clone);
    });
    $umbrales.prepend($fragment_umbrales);
}


const seccionActive = (sectoActive) => {
    if(sectoActive === 'mapa'){
        $seccion_mapa.classList.remove('none')
        $seccion_umbrales.classList.add('none')
        $linea_mapa.classList.add('active')
        $linea_umbrales.classList.remove('active')

    }else if(sectoActive === 'umbrales'){
        $seccion_umbrales.classList.remove('none')
        $seccion_mapa.classList.add('none')
        $linea_umbrales.classList.add('active')
        $linea_mapa.classList.remove('active')
    }
}

const revisarURL = () => {
    const url = window.location.href;
    const url_mapa = url.includes('#mapa');
    const url_umbrales = url.includes('#umbrales');

    if(url_mapa){
        seccionActive('mapa')
    }
    
    if(url_umbrales){
        seccionActive('umbrales')
    }
}


const calcular = () => {

    if ($ranges.length === 0){
        $ranges = document.querySelectorAll('.escala-dolor');
    }
    let promedio = 0;

    $ranges.forEach(range => {
        const value = range.value;
        promedio += parseInt(value);
    });

    promedio = Math.round(promedio / $ranges.length);

    return promedio;
}



document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    pintarUmbrales();
    revisarURL();

})

document.addEventListener('input', e => {

    const sliderEl = e.target

    const value = sliderEl.value - 1;
    const maxValue = sliderEl.max - 1;
    const progress = (value / maxValue) * 100;

    sliderEl.style.background = `linear-gradient(to right, var(--color-terciario) ${progress}%, var(--color-claro) ${progress}%)`;
});


document.addEventListener('click', e => {
    const el = e.target;
    
    if(el === $btn_mapa || el.parentElement === $btn_mapa){
        seccionActive('mapa');
        return;
    }

    if(el === $btn_umbrales || el.parentElement === $btn_umbrales){
        seccionActive('umbrales');
        return;
    }

    if(el === $btn_calcular_limpiar){

        if(el.textContent === 'Limpiar'){
            $ranges.forEach(range => {
                range.value = 1;
                range.style.background = `linear-gradient(to right, var(--color-terciario) 0%, var(--color-claro) 0%)`;
            });

            // padding boton en el main
            $main.style.paddingBottom = '100px';

            // translate footer
            document.querySelector('footer').classList.remove('active');


            $btn_calcular_limpiar.textContent = 'Calcular';
            return;
        }


        let promedio = calcular();

        for (let i = 0; i < array_umbrales.length; i++) {

            let numberOne, numberTwo;
            if(i !== array_umbrales.length - 1){
                numberOne = array_umbrales[i].numero;
                numberTwo = array_umbrales[i + 1].numero - 1;
            }else{
                numberOne = 10;
                numberTwo = 10;
            }
            
            if(promedio >= numberOne && promedio <= numberTwo){
                $resultados.querySelector('article div:first-child').textContent = array_umbrales[i].range;
                $resultados.querySelector('h2').textContent = array_umbrales[i].titulo;
                $resultados.querySelector('p').textContent = array_umbrales[i].descripcion;
            }
        }


        $btn_mapa.click();


        // camb iar el texto del boton calcular a limpiar
        $btn_calcular_limpiar.textContent = 'Limpiar';

        // padding boton en el main
        $main.style.paddingBottom = '380px';

        // translate footer
        document.querySelector('footer').classList.add('active');


        return;
    }

    
});
