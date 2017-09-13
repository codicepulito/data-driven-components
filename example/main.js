// form callback function
function addFormSend (id) {
  // console.log(id)
}

// datatable callback function
function datatable1Click (row) {
  var id = $(row).attr('id')
  $('#root').dccModal('modalResponse', 'Datatable click', 'You have clicked on row with id ' + id)
  $('#modalResponse').modal('show')
}

// form callback function
function form1Click (parameters) {
  console.log(parameters)
}

// navbar callback function
function navbarClick (id) {
  var formParameters = null
  // if id is not integer ignore actions
  if (Number.isInteger(parseInt(id, 10))) {
    var menuItem = parseInt(id, 10)

    // empty dom except navbar1
    $('#root').dccClearAll(['navbar1'])

    switch (menuItem) {
      case 1: // Datatable
        $.ajax({
          url: 'https://randomuser.me/api/?results=20',
          dataType: 'json',
          success: function (data) {
            var datatableParameters = {
              datatableId: 'datatable1',
              response: {
                data: data.results
              },
              buttons: [],
              priorityColumns: {email: 1, gender: 2, phone: 3, cell: 4, registered: 5, nat: 6, dob: 7},
              onClick: datatable1Click
            }
//            //Datatable parameters with manual data
//            var datatableParameters = {
//              datatableId: 'datatable1',
//              response: {
//                data: [
//                  {
//                    "id': 1,
//                    "name": "Leanne Graham",
//                    "username": "Bret",
//                    "email": "Sincere@april.biz",
//                    "phone": "1-770-736-8031 x56442",
//                    "website": "hildegard.org",
//                    "edit": "<center><button id=\"1\"></button></center>"
//                  },
//                  {
//                    "id": 2,
//                    "name": "Ervin Howell",
//                    "username": "Antonette",
//                    "email": "Shanna@melissa.tv",
//                    "phone": "010-692-6593 x09125",
//                    "website": "anastasia.net",
//                    "edit": "<center><button id=\"2\"></button></center>"
//                  }
//                ]
//              },
//              buttons: [],
//              priorityColumns: {name: 1, username: 2, email: 3},
//              onClick: datatable1Click
//            }
            $('#root').dccDatatable(datatableParameters)
          }
        })
        break
      case 2: // Form
        formParameters = {
          formId: 'form1',
          title: 'Form',
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
            {name: "field1", type: "string", readonly: "true"}
          ],
          buttons: [
            { name: "Cancel", class: "btn btn-default" },
            { name: "Add", class: "btn btn-primary", id: 'addFormSend', onClick: addFormSend }
          ]
        }
        $('#root').dccForm(formParameters)
        break
      case 3: // Modal
        $('#root').dccModal('modal1', 'Modal Title', 'This is a message.')
        $('#modal1').modal('show')
        break
      case 4: // ModalForm
        formParameters = {
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
        break
      default: // else show modal with clicked id
        $('#root').dccModal('modal1', 'Dropdown items', 'click on item ' + menuItem)
        $('#modal1').modal('show')
        break
    }
  }
}

$(document).ready(function () {
  var navbarParameters = {
    navbarId: 'navbar1',                // id attribute
    onClick: navbarClick,               // callback
    items: [
      { id: 1, name: 'Datatable' },
      { id: 2, name: 'Form' },
      { id: 3, name: 'Modal' },
      { id: 4, name: 'Modal Form' },
      {
        id: null,                       // id attribute
        name: 'Dropdown items',         // html value visible to the user
        submenu: [
          { id: 5, name: 'Subitem 1' },
          { id: null, name: null },     // separator
          { id: 6, name: 'Subitem 2' }
        ]
      }
    ]
  }
  $('#root').dccNavbar(navbarParameters)
})
