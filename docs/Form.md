Form
====
Append a bootstrap form with inputs and input-group-addon
---------------------------------------------------------
### Method: dccForm(parameters)
### Parameters: {object}
Object's element required to generate the html snippet:
- formId: valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
- buttons: coming soon...
- fields: array of objects [field0, field1, ..., fieldN]
- field0.name: string representing the html input label
  also used as id after removing the spaces and concatenated with formId [formId-field0.name]
- field0.class: optional string representing one or more html class attribute
  (https://www.w3.org/TR/html5/dom.html#classes)
- field0.addon: optional array of elements {icon, onClick}
- field0.addon.icon: string representing the span class (require Font Awesome http://fontawesome.io/)
- field0.addon.onClick: function callback called on addon span clicked
- response: dataset response object in jsend format with optional schema (columns info)

### Return: {void}

Form code example with manual dataset:
```
var formParameters = {
    formId: 'form1',
    response: {
        data:
            {"field1": "value1", "field2": "value2"}
    },
    fields: [
        {name: "field1", class: 'col-4'},
        {name: "field2", class: 'col-4', addon: { icon: 'reply', onClick: form1Click }}
    ],
    buttons: []
}
$('#root').dccForm(formParameters)

// callback function
function form1Click(this) {
  var id = $(this).attr('id')
}
```
