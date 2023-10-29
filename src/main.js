// SPDX-License-Identifier: AGPL-3.0-or-later
/*
 * main.js - remux example
 *
 * Copyright 2023 huangziyi. All rights reserved.
 */
import './serve.js'

// @remux server
function serverFunction() {
  console.log('Ouch!')
}

// @remux browser
{
  // put browser code here
  const btn = document.createElement('button')
  btn.innerText = 'Hit me'
  btn.addEventListener('click', () => serverFunction())
  document.body.appendChild(btn)
}
