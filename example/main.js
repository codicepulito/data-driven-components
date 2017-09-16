// form callback function
function addFormSend (values) {
  console.log(values)
}

// datatable callback function
function datatable1Click (row) {
  var id = $(row).attr('id')
  $('#root').ddcModal('modalResponse', 'Datatable click', 'You have clicked on row with id ' + id)
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
    $('#root').ddcClearAll(['navbar1'])

    switch (menuItem) {
      case 1: // Datatable
        $('#root').ddcDatatable({
          datatableId: 'datatable1',
          panel: 'Datatable with manual data',
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
        $('#root').ddcDatatable({
          datatableId: 'datatable2',
          panel: 'Datatable with ajax remote data',
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
        break
      case 2: // Form
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
        break
      case 3: // Modal
        $('#root').ddcModal('modal1', 'Modal Title', 'This is a message.')
        $('#modal1').modal('show')
        break
      case 4: // ModalForm
        $('#root').ddcForm({
          formId: 'form1',
          modal: 'Modal Form',
          response: formResponse,
          rows: true,
          fields: [
            {
              name: "field1",
              type: "lookup",
              data: [
                { value: '001', text: 'lookup1' },
                { value: '002', text: 'lookup2' }
              ]
            },
            {name: "field2", class: 'col-xs-12', type: 'string', addon: { icon: 'reply', onClick: form1Click }},
            {name: "field3", class: 'col-xs-6', type: 'bool'}
          ],
          buttons: [
            { name: "Cancel", class: "btn btn-default" },
            { name: "Add", class: "btn btn-primary", id: 'addFormSend', onClick: addFormSend }
          ]
        })
        break
      default: // else show modal with clicked id
        $('#root').ddcModal('modal1', 'Dropdown items', 'click on item ' + menuItem)
        $('#modal1').modal('show')
        break
    }
  }
}

$(document).ready(function () {
  $('#root').ddcNavbar({
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
