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
  var formResponse = {
    data: [
      {field1: 'value1', field2: 'value2'}
    ],
    schema: {
      fields: [
        {name: "field1", native_type: "varchar"},
        {name: "field2", native_type: "bool"}
      ]
    }
  }
  // if id is not integer ignore actions
  if (Number.isInteger(parseInt(id, 10))) {
    var menuItem = parseInt(id, 10)

    // empty dom except navbar1
    $('#root').dccClearAll(['navbar1'])

    switch (menuItem) {
      case 1: // Datatable
        $('#root').dccDatatable({
          datatableId: 'datatable1',
          ajax: {
            url: 'https://randomuser.me/api/?results=20',
            responseData: 'results'
          },
          response: null,
          buttons: [],
          priorityColumns: {email: 1, gender: 2, phone: 3, cell: 4, nat: 5, registered: 6, dob: 7},
          onClick: datatable1Click
        })
        break
      case 2: // Form
        $('#root').dccForm({
          formId: 'form1',
          response: formResponse,
          fields: [
            {name: "field1", type: "string", readonly: "true"}
          ],
          buttons: [
            { name: "Add", class: "btn btn-primary", id: 'addFormSend', onClick: addFormSend }
          ]
        })
        break
      case 3: // Modal
        $('#root').dccModal('modal1', 'Modal Title', 'This is a message.')
        $('#modal1').modal('show')
        break
      case 4: // ModalForm
        $('#root').dccForm({
          formId: 'form1',
          modal: 'Modal Form',
          response: formResponse,
          fields: [
            {name: "field1", class: 'col-4'},
            {name: "field2", class: 'col-4', addon: { icon: 'reply', onClick: form1Click }}
          ],
          buttons: [
            { name: "Cancel", class: "btn btn-default" },
            { name: "Add", class: "btn btn-primary", id: 'addFormSend', onClick: addFormSend }
          ]
        })
        break
      default: // else show modal with clicked id
        $('#root').dccModal('modal1', 'Dropdown items', 'click on item ' + menuItem)
        $('#modal1').modal('show')
        break
    }
  }
}

$(document).ready(function () {
  $('#root').dccNavbar({
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
  })
})
