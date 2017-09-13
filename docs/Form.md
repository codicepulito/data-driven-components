Form
====
Append a bootstrap form with inputs and input-group-addon
---------------------------------------------------------
### Method: dccForm(parameters)
### Parameters: {object}
Object's element required to generate the html snippet:
- formId: valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
- buttons: array of objects [button0, button1, ..., buttonN]
- button0.name: string representing the html button label
- button0.class: valid html class attribute (https://www.w3.org/TR/html5/dom.html#classes)
- button0.id: valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
- button0.onClick: function callback called on button clicked
- fields: array of objects [field0, field1, ..., fieldN]
- field0.addon: optional array of elements {icon, onClick}
- field0.addon.icon: string without "fa" representing the span class (require Font Awesome http://fontawesome.io/)
- field0.addon.onClick: function callback called on addon span clicked
- field0.class: optional string representing one or more html class attribute
  (https://www.w3.org/TR/html5/dom.html#classes)
- field0.name: string representing the html input label
  also used as id after removing the spaces and concatenated with formId [formId-field0.name]
- field0.readonly: boolean - if true make field readonly
- field0.type: string - override schema.fields.native_type
- modal: optional string render the form in modal with the specified title
- response: dataset response object in jsend format with optional schema (ex. PHP PDO getColumnMeta)

### Return: {void}

Form code example with manual dataset:
```
var formParameters = {
    formId: 'form1',
    title: 'Form',
    modal: 'Modal Form',
    response: {
        data: [
            {
              field1: 'value1',
              field2: 'value2'
            }
        ],
        schema: {
            fields: [
              {name: "field1", native_type: "varchar"},
              {name: "field2", native_type: "bool"}
            ]
        }
    },
    fields: [
        {name: "field1", class: 'col-4'},
        {name: "field2", class: 'col-4', addon: { icon: 'reply', onClick: form1Click }}
    ],
    buttons: [
        { name: "Cancel", class: "btn btn-default" },
        { name: "Add", class: "btn btn-primary", id: 'addFormSend', onClick: addFormSend }
    ]
}
$('#root').dccForm(formParameters)

// callback function for button
function addFormSend(parameters) {
    console.log(parameters)
}

// callback function for addon
function form1Click(this) {
    var id = $(this).attr('id')
    console.log(id)
}
```
