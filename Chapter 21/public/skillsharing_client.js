/*
 * Skill Sharing Project Client
 * Copyright © 2020 Marijn Haverbeke
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

function talkURL(title) {
  return "talks/" + encodeURIComponent(title);
}

function fetchOK(url, options) {
  return fetch(url, options).then(response => {
    if (response.status < 400) { return response; } else { throw new Error(response.statusText); }
  });
}

function reportError(error) {
  alert(String(error));
}

function handleAction(state, action) {
  if (action.type === "setUser") {
    localStorage.setItem("userName", action.user);
    return Object.assign({}, state, {user: action.user});
  } else if (action.type === "setTalks") {
    return Object.assign({}, state, {talks: action.talks});
  } else if (action.type === "newTalk") {
    fetchOK(talkURL(action.title), {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        presenter: state.user,
        summary: action.summary
      })
    }).catch(reportError);
  } else if (action.type === "deleteTalk") {
    fetchOK(talkURL(action.talk), {method: "DELETE"})
      .catch(reportError);
  } else if (action.type === "newComment") {
    fetchOK(talkURL(action.talk) + "/comments", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        author: state.user,
        message: action.message
      })
    }).catch(reportError);
  }
  return state;
}

function elt(type, props, ...children) {
  let dom = document.createElement(type);

  if (props) { Object.assign(dom, props); }
  for (let child of children) {
    if (typeof child !== "string") { dom.appendChild(child); } else { dom.appendChild(document.createTextNode(child)); }
  }
  return dom;
}

function renderUserField(name, dispatch) {
  return elt("label", {}, "Your name: ", elt("input", {
    type: "text",
    value: name,
    onchange(event) {
      dispatch({type: "setUser", user: event.target.value});
    }
  }));
}

function renderComment(comment) {
  return elt("p", {className: "comment"},
    elt("strong", null, comment.author),
    ": ", comment.message);
}

function renderTalk(talk, dispatch) {
  return elt(
    "section", {className: "talk"},
    elt("h2", null, talk.title, " ", elt("button", {
      type: "button",
      onclick() {
        dispatch({type: "deleteTalk", talk: talk.title});
      }
    }, "Delete")),
    elt("div", null, "by ",
      elt("strong", null, talk.presenter)),
    elt("p", null, talk.summary),
    ...talk.comments.map(renderComment),
    elt("form", {
      onsubmit(event) {
        event.preventDefault();
        let form = event.target;

        dispatch({type: "newComment",
          talk: talk.title,
          message: form.elements.comment.value});
        form.reset();
      }
    }, elt("input", {type: "text", name: "comment"}), " ",
    elt("button", {type: "submit"}, "Add comment")));
}

function renderTalkForm(dispatch) {
  let title = elt("input", {type: "text"});
  let summary = elt("input", {type: "text"});

  return elt("form", {
    onsubmit(event) {
      event.preventDefault();
      dispatch({type: "newTalk",
        title: title.value,
        summary: summary.value});
      event.target.reset();
    }
  }, elt("h3", null, "Submit a Talk"),
  elt("label", null, "Title: ", title),
  elt("label", null, "Summary: ", summary),
  elt("button", {type: "submit"}, "Submit"));
}

async function pollTalks(update) {
  let tag = undefined;

  for (;;) {
    let response;

    try {
      response = await fetchOK("/talks", {
        headers: tag && {"If-None-Match": tag,
          "Prefer": "wait=90"}
      });
    } catch (e) {
      console.log("Request failed: " + e);
      await new Promise(resolve => setTimeout(resolve, 500));
      continue;
    }
    if (response.status === 304) { continue; }
    tag = response.headers.get("ETag");
    update(await response.json());
  }
}

var SkillShareApp = class SkillShareApp {
  constructor(state, dispatch) {
    this.dispatch = dispatch;
    this.talkDOM = elt("div", {className: "talks"});
    this.dom = elt("div", null,
      renderUserField(state.user, dispatch),
      this.talkDOM,
      renderTalkForm(dispatch));
    this.syncState(state);
  }

  syncState(state) {
    if (state.talks !== this.talks) {
      this.talkDOM.textContent = "";
      for (let talk of state.talks) {
        this.talkDOM.appendChild(
          renderTalk(talk, this.dispatch));
      }
      this.talks = state.talks;
    }
  }
};

function runApp() {
  let user = localStorage.getItem("userName") || "Anon";
  let state, app;

  function dispatch(action) {
    state = handleAction(state, action);
    app.syncState(state);
  }

  pollTalks(talks => {
    if (!app) {
      state = {user, talks};
      app = new SkillShareApp(state, dispatch);
      document.body.appendChild(app.dom);
    } else {
      dispatch({type: "setTalks", talks});
    }
  }).catch(reportError);
}

runApp();
