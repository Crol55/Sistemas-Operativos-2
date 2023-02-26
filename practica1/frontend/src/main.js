import './style.css';
import './app.css';

import logo from './assets/images/logo-universal.png';
import {GetDiskUsage,GetCPUUsage, Greet} from '../wailsjs/go/main/App';

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

window.getCPU = ()=>{
 
  if (document.getElementById("CPU") != null){
    console.log("ya hay una instancia del grafico", document.getElementById("CPU"));
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

window.getDisk = function (){

  if (document.getElementById("DISCO") != null){
    console.log("ya hay una instancia del grafico");
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

function manejadorConsultaDisco(grafico){
  
  GetDiskUsage().then(dato =>{
    console.log(dato);
    grafico.data.datasets[0].data = [(100-dato), dato];
    grafico.update("none"); 
  })

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
    
