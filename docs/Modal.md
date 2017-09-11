Modal
======
Append a bootstrap modal with title and message
----------------------------------------------------------------
### Method: dccModal(modalId, title, message)
### Parameters:
- modalId: valid html5 [id attribute](https://www.w3.org/TR/html5/dom.html#the-id-attribute)
- title: string
- message: string

Modal code example:
```
  $('#root').dccModal('modal1', 'Modal Title', 'This is a message.');
  $('#modal1').modal('show');
```