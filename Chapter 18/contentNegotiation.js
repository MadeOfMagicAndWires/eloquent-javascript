/**
 * Content Negotiation Exercise
 * Copyright © 2020 Joost Bremmer
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


// The URL https://eloquentjavascript.net/author is configured to respond with
// either plaintext, HTML, or JSON, depending on what the client asks for.

// Send requests to fetch all three formats of this resource.
// Use the headers property in the options object passed to fetch to
// set the header named Accept to the desired media type.

const defaultReq = new Request("https://eloquentjavascript.net/author");

async function makeRequest(req=defaultReq, headers=new Headers()) {
  console.log(`Making request for: ${headers.get("Content-Type")}`);

  const container = document.createElement("div");
  const header = document.createElement("h2");
  let content;

  const response = await fetch(req, {
    "method": "GET",
    "mode" : "cors",
    "headers": headers
  });

  if(response.ok) {

    header.innerText = `${response.headers.get("Content-Type")}:`;

    switch(response.headers.get("Content-Type")) {
    case "text/plain":
      content = document.createElement("p");
      content.innerText = await response.text();
      break;
    case "application/json":
      content = document.createElement("p");
      content.innerText = await JSON.stringify(await response.json());
      break;
    case "text/html; charset=utf-8":
      content = document.createElement("div");
      content.innerHTML = await response.text();
      break;
    default:
      content = document.createElement("p");
      content.innerText = await response.text();

      break;
    }


  } else {
    header.innerText = `${headers.get("Accept")}`;
    content = document.createElement("p");
    content.innerText = `Request to ${req.url} failed with error code: ${response.status}`;
    content.style.color = "#f00";
  }

  // append response
  container.appendChild(header);
  container.appendChild(content);
  document.body.appendChild(container);
  return response.status;
}


const rainbow = new Headers(), plaintext = new Headers(), json = new Headers(), html = new Headers();

// rainbow+unicorn request
rainbow.append("Accept", "rainbow+unicorns");
makeRequest(defaultReq, rainbow);

// plaintext request
plaintext.append("Accept", "text/plain");
makeRequest(defaultReq, plaintext);

// json request
json.append("Accept", "application/json");
makeRequest(defaultReq, json);

// regular html request
html.append("Accept", "text/html");
makeRequest(defaultReq, html);
