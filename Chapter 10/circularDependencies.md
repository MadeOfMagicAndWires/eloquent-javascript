Circular Dependencies
=====================

As soon as any module decides to overwrite the exports object it will
break all pointers any other modules are using.
