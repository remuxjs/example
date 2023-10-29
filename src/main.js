// SPDX-License-Identifier: AGPL-3.0-or-later
/*
 * main.js - remux example
 *
 * Copyright 2023 huangziyi. All rights reserved.
 */
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
