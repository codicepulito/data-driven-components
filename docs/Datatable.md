Datatable
======
Append a datatable - http://www.datatables.net/
-----------------------------------------------
Copyright (c) 2008-2015 SpryMedia Limited
-----------------------------------------
### Method: ddcDatatable(parameters)
### Parameters: {object}
Object's element required to generate the html snippet:
- datatableId: valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute}
- buttons: The buttons array defines the buttons that will appear in the document to the end user
  as documented at https://datatables.net/reference/option/buttons.buttons
- dom: String that define the table control elements to appear on the page and in what order
  as documented at https://datatables.net/reference/option/dom
- onClick: function callback called on row's item clicked
- priorityColumns: array of elements to set visibility priority to the columns, telling Responsive which columns
  it should remove before others as documented at https://datatables.net/extensions/responsive/priority
- response: dataset response object in jsend format with optional schema (columns info)
- panel: string that define the title of a bootstrap panel to wrap into

### Return: {void}

Datatable code example with manual dataset:
```
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
```
Datatable code example with remote ajax dataset:
```
$.ajax({
    url: 'https://randomuser.me/api/?results=20',
    dataType: 'json',
    success: function(data) {
        var datatableParameters = {
            datatableId: 'datatable1',
            response: {
                data: data.results
            },
            buttons: [],
            priorityColumns: {email: 1, gender: 2, phone: 3, cell: 4, registered: 5, nat: 6, dob: 7},
            onClick: datatable1Click
        }

        $('#root').ddcDatatable(datatableParameters)
    }
})

// callback function
function datatable1Click(this) {
  var id = $(this).attr('id')
}
```
