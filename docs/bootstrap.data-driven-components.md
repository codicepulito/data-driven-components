# Global





* * *

### ddcClearAll(except) 

Empty all root nodes except those passed in parameter arrays

## Example

    $('#root').ddcClearAll(['navbar1'])

**Parameters**

**except**: `Array`, Array of elements to not empty

**Returns**: `void`


### ddcDatatable(parameters) 

Append a datatable - http://www.datatables.net/
-----------------------------------------------
Copyright (c) 2008-2015 SpryMedia Limited
-----------------------------------------

**Parameters**

**parameters**: `object`, Object with elements required to generate the html snippet:
- datatableId: valid html5 id attribute; see [https://www.w3.org/TR/html5/dom.html#the-id-attribute](https://www.w3.org/TR/html5/dom.html#the-id-attribute)
- ajax: asyncronous function call options
- ajax.jsend: set the [https://labs.omniti.com/labs/jsend|jsend](https://labs.omniti.com/labs/jsend|jsend) compatibility
- ajax.responseDataKey: if ajax.jsend is false, set the object key contains data
- ajax.url: a valid url address
- buttons: array that defines the buttons that will appear in the document to the end user
  as documented at [https://datatables.net/reference/option/buttons.buttons](https://datatables.net/reference/option/buttons.buttons)
- dom: String that define the table control elements to appear on the page and in what order
  as documented at [https://datatables.net/reference/option/dom](https://datatables.net/reference/option/dom)
- onClick: function callback called on row's item clicked
- panel: string that define the title of a bootstrap panel to wrap into
- priorityColumns: array of elements to set visibility priority to the columns, telling Responsive which columns
  it should remove before others; see [https://datatables.net/extensions/responsive/priority](https://datatables.net/extensions/responsive/priority)
- response: dataset response object in [https://labs.omniti.com/labs/jsend|jsend](https://labs.omniti.com/labs/jsend|jsend) format with optional schema (columns info)

**Returns**: `void`, <br>

## Example 1: Datatable with manual data

    $('#root').ddcDatatable({
       datatableId: 'datatable1',
       response: {
         data: [
           {
               "id": 1,
               "name": "Leanne Graham",
               "username": "Bret",
               "email": "Sincere@april.biz",
               "phone": "1-770-736-8031 x56442",
               "website": "hildegard.org",
               "edit": "<center><button id=\"1\"></button></center>"
           },
           {
               "id": 2,
               "name": "Ervin Howell",
               "username": "Antonette",
               "email": "Shanna@melissa.tv",
               "phone": "010-692-6593 x09125",
               "website": "anastasia.net",
               "edit": "<center><button id=\"2\"></button></center>"
           }
         ]
       },
       buttons: [],
       priorityColumns: {name: 1, username: 2, email: 3},
       onClick: datatable1Click
    })

    // callback function
    function datatable1Click(this) {
     var id = $(this).attr('id')
    }

## Example 2: Datatable with ajax remote data

    $('#root').ddcDatatable({
       datatableId: 'datatable1',
       ajax: {
         url: 'https://randomuser.me/api/?results=20',
         responseDataKey: 'results',
         jsend: false
       },
       response: null,
       buttons: [],
       priorityColumns: {name: 1, username: 2, email: 3},
       onClick: datatable1Click
    })

    // callback function
    function datatable1Click(this) {
     var id = $(this).attr('id')
    }


### ddcForm(parameters) 

Append a bootstrap form with inputs and input-group-addon

**Parameters**

**parameters**: `object`, Object with elements required to generate the html snippet:
- formId: valid html5 id attribute; see [https://www.w3.org/TR/html5/dom.html#the-id-attribute](https://www.w3.org/TR/html5/dom.html#the-id-attribute)
- ajax: asyncronous function call options
- ajax.jsend: set the [https://labs.omniti.com/labs/jsend|jsend](https://labs.omniti.com/labs/jsend|jsend) compatibility
- ajax.responseDataKey: if ajax.jsend is false, set the object key contains data
- ajax.url: a valid url address
- buttons: array of objects [button0, button1, ..., buttonN]
- button0.name: string representing the html button label
- button0.class: valid html class attribute; see [https://www.w3.org/TR/html5/dom.html#classes](https://www.w3.org/TR/html5/dom.html#classes)
- button0.id: valid html5 id attribute; see [https://www.w3.org/TR/html5/dom.html#the-id-attribute](https://www.w3.org/TR/html5/dom.html#the-id-attribute)
- button0.onClick: function callback called on button clicked
- fields: array of objects [field0, field1, ..., fieldN]
- field0.addon: optional array of elements
- field0.addon.icon: string without "fa" representing the span class (require [http://fontawesome.io/|Font Awesome](http://fontawesome.io/|Font Awesome))
- field0.addon.onClick: function callback called on addon span clicked
- field0.class: optional string representing one or more html class attribute
  see [https://www.w3.org/TR/html5/dom.html#classes](https://www.w3.org/TR/html5/dom.html#classes)
- field0.name: string representing the html input label
  also used as id after removing the spaces and concatenated with formId [formId-field0.name]
- field0.readonly: boolean - if true make field readonly
- field0.type: data type [string|bool|lookup] - override schema.fields.native_type
  (lookup require [https://github.com/danielfarrell/bootstrap-combobox|bootstrap-combobox](https://github.com/danielfarrell/bootstrap-combobox|bootstrap-combobox))
- modal: optional string render the form in modal with the specified title
- panel: string that define the title of a bootstrap panel to wrap into
- response: dataset response object in jsend format with optional schema (ex. PHP PDO getColumnMeta)

**Returns**: `void`, <br>

## Example 1: Form with manual data

    $('#root').ddcForm({
      formId: 'form2',
      title: 'Form',
      panel: 'Form with manual data',
      response: {
          data: [
              {
                field1: 'value1',
                field2: 'value2',
                field3: true
              }
          ],
          schema: {
              fields: [
                {name: "field1", native_type: "varchar"},
                {name: "field2", native_type: "varchar"},
                {name: "field3", native_type: "bool"}
              ]
          }
      },
      fields: [
          {
            name: "field1",
            class: 'col-4',
            type: "lookup",
            data: [
              { value: '001', text: 'lookupform1' },
              { value: '002', text: 'lookupform2' }
            ]
          },
          {name: "field2", class: 'col-4', addon: { icon: 'reply', onClick: form1Click }},
          {name: "field3", class: 'col-4'}
      ],
      buttons: [
          { name: "Cancel", class: "btn btn-default" },
          { name: "Add", class: "btn btn-primary", id: 'addForm2Send', onClick: addFormSend }
      ]
    })

    // callback function for button
    function addFormSend(parameters) {
        console.log(parameters)
    }

    // callback function for addon
    function form1Click(this) {
        var id = $(this).attr('id')
        console.log(id)
    }

## Example 2: Form with lookup ajax remote data

    $('#root').ddcForm({
      formId: 'form1',
      panel: 'Form with ajax remote data',
      response: null,
      fields: [
        {
          name: "field1",
          type: "lookup",
          url: 'https://raw.githubusercontent.com/codicepulito/data-driven-components/master/test/json/jsendLookup.json'
        },
        {name: "field2", type: "string"},
        {name: "field3", type: "bool"}
      ],
      buttons: [
        { name: "Cancel", class: "btn btn-default" },
        { name: "Add", class: "btn btn-primary", id: 'addForm1Send', onClick: addFormSend }
      ]
    })

    // callback function for button
    function addFormSend(parameters) {
        console.log(parameters)
    }


### ddcLocale(locale) 

Get or set a language locale

**Parameters**

**locale**: `string`, Optional language locale setter

**Returns**: `Array`, Actual country code and language locale<br>

## Example
    $('#root').ddcLocale('it')


### ddcModal(modalId, title, message) 

Append a bootstrap modal with title and message

**Parameters**

**modalId**: `string`, A valid html5 id attribute; see [https://www.w3.org/TR/html5/dom.html#the-id-attribute](https://www.w3.org/TR/html5/dom.html#the-id-attribute)

**title**: `string`, The modal title

**message**: `string`, The modal body contains the message

**Returns**: `void`, <br>

## Example

    $('#root').ddcModal('modal1', 'Modal Title', 'This is a message.');
    $('#modal1').modal('show');


### ddcNavbar(parameters) 

Append a bootstrap navbar menu with items and dropdown sub-items

**Parameters**

**parameters**: `object`, Object with elements required to generate the html snippet:
- navbarId: valid html5 id attribute; see [https://www.w3.org/TR/html5/dom.html#the-id-attribute](https://www.w3.org/TR/html5/dom.html#the-id-attribute)
- items: array of objects [item0, item1, ..., itemN]
- item0.id: null if it has submenu or valid html5 id attribute
- item0.name: null as separator or string representing the html value of item visible to the user
- item0.submenu: optional array of items object [subitem0, subitem1, ..., subitemN]
- onClick: function callback called on item/subitem click - callback(item0.id)

**Returns**: `void`, <br>

## Example

    // callback function
    function navbarClick(id) {
      if (Number.isInteger(parseInt(id))) {
        alert('click on item ' + id);
      }
    }

    $(document).ready(function() {
      $('#root').ddcNavbar({
        navbarId: 'navbar1',                // id attribute
        onClick: navbarClick,               // callback
        items: [
          {
            id: null,                       // id attribute
            name: "Item 1",                 // html value visible to the user
            submenu: [
              { id: 1, name: "Subitem 1" },
              { id: null, name: null },     // separator
              { id: 2, name: "Subitem 2" }
            ]
          },
          { id: 3, name: "Item 3" },
        ]
      })
    })



* * *










