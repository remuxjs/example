import { clientSetup, serverSetup } from './serve.js'

// @remux server
function serverFunction() {
  console.log('Ouch!')
}

// @remux server
{
  // put server code here
  console.debug('start server')
  serverSetup()
}

// @remux browser
{
  clientSetup()
  // put browser code here
  const btn = document.createElement('button')
  btn.innerText = 'Hit me'
  btn.addEventListener('click', () => serverFunction())
  document.body.appendChild(btn)
}
