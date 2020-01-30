A Public Space on the Web Exercise
==================================

The Exercise:
-------------

Write a basic HTML page that includes a simple JavaScript file. Put the files in
a directory served by the file server and open them in your browser.

Next, as an advanced exercise or even a weekend project, combine all the
knowledge you gained from this book to build a more user-friendly interface for
modifying the website—from inside the website.

Use an HTML form to edit the content of the files that make up the website,
allowing the user to update them on the server by using HTTP requests,
as described in Chapter 18.

Start by making only a single file editable.
Then make it so that the user can select which file to edit.
Use the fact that our file server returns lists of files when reading a directory.

Don’t work directly in the code exposed by the file server since,
if you make a mistake, you are likely to damage the files there.
Instead, keep your work outside of the publicly accessible directory and copy it there when testing.


Implementation:
---------------
The implementation of this exercise can be found at index.html, which is pretty
straightforward in how it works. What follows is a list of deviations
and additions to the exercise:

+ WebUI:
    + The form is not technically a form element since that only allows the POST and
      GET methods. Instead it uses data from the input elements to make a custom
      fetch request.
+ fileServer:
    + Expanded the GET method handler to distinguish directories from files by
      including a trailing slash ("/") to its name
    + Expanded the GET method handler to include a recursive mode, in which it
      includes all content of child directories recursively.
      This mode is enabled by passing along the "?recursive" GET parameter
      to the request.
    + Added a MOVE method that moves directories and files to a different location.
      This requires JSON data to be sent with the request, containing a newPath
      variable that represents the new path.
    + Added a "POST" method handler that links to the PUT method handler.
    + Expanded the method handlers to check for permissions, when changing the
      contents of child files or directories. This allows for some files to be
      protected from writing, as exemplified by the index' files.
