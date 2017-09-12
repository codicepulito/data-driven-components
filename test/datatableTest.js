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

var datatableParametersWithoutCallback = {
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
  onClick: null
}

var datatableParametersWithPanel = {
  datatableId: 'datatable1',
  panel: 'panel test',
  response: {
    data: [
      {
        "id": 1,
        "name": "Leanne Graham",
        "username": "Bret",
        "email": "Sincere@april.biz",
        "phone": "1-770-736-8031 x56442",
        "website": "hildegard.org"
      },
      {
        "id": 2,
        "name": "Ervin Howell",
        "username": "Antonette",
        "email": "Shanna@melissa.tv",
        "phone": "010-692-6593 x09125",
        "website": "anastasia.net"
      }
    ]
  },
  buttons: [],
  priorityColumns: {name: 1, username: 2, email: 3},
  onClick: datatable1Click
}

var datatableParametersWithoutButtons = {
  datatableId: 'datatable1',
  response: {data: null},
  priorityColumns: {name: 1, username: 2, email: 3},
  onClick: datatable1Click
}

var datatableParametersWithoutData = {
  datatableId: 'datatable1',
  response: {},
  buttons: [],
  priorityColumns: {name: 1, username: 2, email: 3},
  onClick: datatable1Click
}

var datatableParametersWithoutPriorityColumns = {
  datatableId: 'datatable1',
  response: {data: null},
  buttons: [],
  onClick: datatable1Click
}

function datatable1Click (parameters) {
}

describe('datatable component asynchronous loading', function () {
  beforeEach(function (done) {
    $('div').remove()
    $(document.body).append('<div id="root"></div>')
    $('#root').dccDatatable(datatableParameters)
    setTimeout(function () {
      done()
    }, 500)
  })

  it('check callback fired on datatable button click', function () {
    expect($('#datatable1').find('#1').length).toBe(1)
  })
})

describe('datatable component asynchronous button click', function () {
  beforeEach(function (done) {
    var button = $('#datatable1').find('#1')
    button.trigger('click')
    setTimeout(function () {
      done()
    }, 500)
  })

  it('check callback fired on datatable button click', function () {
    expect($('[id=responseModal]').length).toBe(0)
  })
})

describe('datatable component asynchronous loading missing callback', function () {
  beforeEach(function (done) {
    $('#root').dccDatatable(datatableParametersWithoutCallback)
    setTimeout(function () {
      done()
    }, 500)
  })

  it('check callback fired on datatable button click missing callback', function () {
    expect($('#datatable1').find('#1').length).toBe(1)
  })
})

describe('datatable component asynchronous button click missing callback', function () {
  beforeEach(function (done) {
    var button = $('#datatable1').find('#1')
    button.trigger('click')
    setTimeout(function () {
      done()
    }, 500)
  })

  it('check callback fired on datatable button click and missing callback', function () {
    expect($('[id=responseModal]').length).toBe(1)
  })
})

describe('create datatable component', function () {
  it('check main element is present after non empty dom', function () {
    $('#root').dccDatatable(datatableParameters)
    expect($('[id=datatable1]').length).toBe(1)
    expect($('#root-datatable1').find('.panel-title').length).toBe(0)
  })

  it('check panel element is present after setting its property', function () {
    $('#root').dccDatatable(datatableParametersWithPanel)
    expect($('#root-datatable1').find('.panel-title').length).toBe(1)
  })

  it('check main element is present without response data', function () {
    $('#root').dccDatatable(datatableParametersWithoutData)
    expect($('[id=responseModal]').length).toBe(1)
  })

  it('check modal on parameters without buttons', function () {
    $('#root').dccDatatable(datatableParametersWithoutButtons)
    expect($('[id=responseModal]').length).toBe(1)
  })

  it('check modal on parameters without priority columns', function () {
    $('#root').dccDatatable(datatableParametersWithoutPriorityColumns)
    expect($('[id=responseModal]').length).toBe(1)
  })
})
