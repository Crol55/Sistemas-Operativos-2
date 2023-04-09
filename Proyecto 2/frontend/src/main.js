import './style.css';
import './app.css';
import Chart from 'chart.js/auto';

// <script src="./node_modules/chart.js/dist/chart.umd.js" type="module"></script>
import {GetDiskUsage,GetCPUUsage,GetRamUsage, Greet} from '../wailsjs/go/main/App';
import { LogInfo } from '../wailsjs/runtime/runtime';

/*<div id="app"></div>
    background-color: rgba(27, 38, 54, 1);
document.querySelector('#app').innerHTML = `
    <img id="logo" class="logo">
    <div class="result" id="result">Please enter your name below 👇</div>
      <div class="input-box" id="input">
        <input class="input" id="name" type="text" autocomplete="off" />
        <button class="btn" onclick="greet()">Greet</button>
      </div>
    </div>
`;
document.getElementById('logo').src = logo;

let nameElement = document.getElementById("name");
nameElement.focus();
let resultElement = document.getElementById("result");
*/

var INTERVALO_CPU;
var INTERVALO_DISCO;
var ID_INTERVALO_RAM;

window.getCPU = ()=>{
 
  if (document.getElementById("CPU") != null){
    LogInfo("Ya existe una instancia de CPU, no puede ejecutarse mas de 1 vez");
    return;
  }

  clearInterval(INTERVALO_DISCO);

  document.querySelector("#graficas").innerHTML = `
    <div style="width: 800px; padding-left: 0; padding-right: 0; margin-left: auto; margin-right: auto; display: block;">
      <canvas id="CPU"></canvas>
    </div>
  `;
  
  const segundos = Array.from(Array(60).keys());
  var grafico = new Chart(
  document.getElementById('CPU'),
    {
    type: 'line',
    data: {
      labels: segundos,
      datasets: [
        {
          label: '% utilizacion del CPU',
          data: []
        }
      ]
    }, 
    options:{
      scales:{
        y:{
          suggestedMin: 0, 
          suggestedMax: 100
        }
      }
    }
    }
  );

  INTERVALO_CPU = setInterval(manejador, 1000, grafico);
}


function manejador(grafico){
  
  GetCPUUsage().then(dato =>{
    let valorCPU = Math.round(dato);
    console.log(valorCPU);
    if(valorCPU > 0){
      
      grafico.data.datasets[0].data.unshift(Math.round(valorCPU));
      grafico.update("none");
    }
  })

}


window.getDisk = function (){

  if (document.getElementById("DISCO") != null){
    LogInfo("ya hay una instancia del grafico");
    return;
  }
  clearInterval(INTERVALO_CPU);

    document.querySelector("#graficas").innerHTML = `
    <div style="width: 400px; padding-left: 0; padding-right: 0; margin-left: auto; margin-right: auto; display: block;">
      <canvas id="DISCO"></canvas>
    </div>
  `;

  var graficoDisco = new Chart(document.getElementById("DISCO"), {
      type: "pie", 
      data:{
        labels:['Libre', 'Usado'],
        datasets:[
          {
            label:"% de uso del disco duro",
            data:[0,0],
            backgroundColor:[
              'rgb(153,255,153)',
              'rgb(255,99,132)'
            ],
            hoverOffset: 4
          }
        ]
      }
    }
  );

  INTERVALO_DISCO = setInterval(manejadorConsultaDisco, 1000, graficoDisco);
}


function manejadorConsultaDisco(grafico){
  
  GetDiskUsage().then(dato =>{
    console.log(dato);
    grafico.data.datasets[0].data = [(100-dato), dato];
    grafico.update("none"); 
  })

}


window.getRAM = function (){

  let elementRamId = "RAM";

  if (document.getElementById(elementRamId) != null){
    LogInfo("Ya existe una instancia de Memoria RAM, no puede ejecutarse mas de 1 vez");
    return;
  }

  document.querySelector("#graficas").innerHTML = `
    <div style="width: 400px; padding-left: 0; padding-right: 0; margin-left: auto; margin-right: auto; display: block;">
      <canvas id="${elementRamId}"></canvas>
    </div>
  `;

  var graficoRam = new Chart(document.getElementById(elementRamId), {
      type: "pie", 
      data:{
        labels:['RAM Libre', 'RAM Usado'],
        datasets:[
          {
            label:"Uso de la memoria RAM en MegaBytes (mb)",
            data:[0,0],
            backgroundColor:[
              'rgb(153,255,153)',
              'rgb(255,99,132)'
            ],
            hoverOffset: 4
          }
        ]
      }
    }
  );

  ID_INTERVALO_RAM = setInterval(IntervalHandlerForRAM, 1000, graficoRam);
  
}


function IntervalHandlerForRAM(HTMLCanvasElement){

  GetRamUsage().then(
    (resultados) =>{
      LogInfo("Libre:" + resultados.MemLibre);
      LogInfo("Usado:" +resultados.MemUsada);

      HTMLCanvasElement.data.datasets[0].data = [resultados.MemLibre, resultados.MemUsada];
      HTMLCanvasElement.update("none");
    }
  ).catch( error =>{
    console.error("Error al consultar la memoria RAM");
  });

}


// Setup the greet function
window.greet = function () {
    // Get name
    let name = nameElement.value;

    // Check if the input is empty
    if (name === "") return;

    // Call App.Greet(name)
    try {
        Greet(name)
            .then((result) => {
                // Update result with data back from App.Greet()
                resultElement.innerText = result;
            })
            .catch((err) => {
                console.error(err);
            });
    } catch (err) {
        console.error(err);
    }
};
    
