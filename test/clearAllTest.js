var datatableParameters = {
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
}

var formParameters = {
  formId: 'form1',
  response: {
    data:
      {"field1": "value1", "field2": "value2"}
  },
  fields: [
    {name: "field1", class: "col-4"},
    {name: "field2", class: "col-4", addon: { icon: "reply", onClick: form1Click }}
  ],
  readonly: true,
  buttons: []
}

var navbarParameters = {
  navbarId: 'navbar1',
  onClick: navbarClick,
  items: [
    {
      id: null,
      name: 'Item 1',
      submenu: [
        { id: 1, name: 'Subitem 1' },
        { id: null, name: null },
        { id: 2, name: 'Subitem 2' }
      ]
    },
    { id: 3, name: 'Item 3' }
  ]
}

function datatable1Click () {}
function form1Click () {}
function navbarClick () {}

describe('clearing the dom', function () {
  beforeEach(function (done) {
    $('div').remove()
    $(document.body).append('<div id="root"></div>')
    $('#root').ddcDatatable(datatableParameters)
    $('#root').ddcModal('modal1', 'title', 'message')
    setTimeout(function () {
      done()
    }, 500)
  })

  it('clearing all divs in body', function () {
    expect($('div').length).toBe(13)
    $('#root').ddcClearAll()
    expect($('div').length).toBe(9)
  })
})

describe('clearing the dom except some elements', function () {
  beforeEach(function (done) {
    $('div').remove()
    $(document.body).append('<div id="root"></div>')
    $('#root').ddcNavbar(navbarParameters)
    $('#root').ddcDatatable(datatableParameters)
    $('#root').ddcForm(formParameters)
    setTimeout(function () {
      done()
    }, 500)
  })

  it('clearing all divs in body', function () {
    expect($('div').length).toBe(24)
    $('#root').ddcClearAll(['navbar1'])
    expect($('div').length).toBe(5)
  })
})
