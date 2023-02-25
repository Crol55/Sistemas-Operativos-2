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
window.getRam = ()=>{
    GetCPUUsage().then(res =>{
        window.alert(Math.round(res));
    })
}

window.getDisk = function (){
    GetDiskUsage().then(res =>{
        window.alert(res);
    })
}

window.test = function(){
    window.alert("si deberia funcionar");
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

const segundos = Array.from(Array(60).keys());

    const data = [
      { year: 2010, count: 40 },
      { year: 2011, count: 20 },
      { year: 2012, count: 15 },
      { year: 2013, count: 25 },
      { year: 2014, count: 22 },
      { year: 2015, count: 30 },
      { year: 2016, count: 28 },
    ];
    
    var grafico = new Chart(
      document.getElementById('acquisitions'),
      {
        type: 'line',
        data: {
          labels: segundos,
          datasets: [
            {
              label: 'Acquisitions by year',
              data: data.map(row => row.count)
            }
          ]
        }
      }
    );

    setTimeout(manejador, 3000);

    function manejador(){
        
        grafico.data.labels.push(2017);
        grafico.data.datasets[0].data.push(70);
        grafico.update();
    }

console.log( segundos);

    

