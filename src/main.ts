import './style.css'
import { setupCounter } from './counter.ts'
import { fetchPoke } from './fetch.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
      <img src="https://www.pixelart.name/wp-content/uploads/2022/05/pixel-art-pokeball.png" class="logo vanilla" alt="TypeScript logo" />
 
    <h1>PokèCLick!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p>Nous vivons dans un monde pokèmon!</p>
    <p>Attention les oreilles!</p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
fetchPoke();
