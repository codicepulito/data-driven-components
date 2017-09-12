var modalFormParameters = {
  modalId: 'modalform1',
  title: 'Modal Form',
  response: {
    data: [
      {
        field1: 'value1',
        field2: 'value2'
      }
    ],
    schema: {
      fields: [
        {name: "field1", native_type: "string"},
        {name: "field2", native_type: "string"}
      ]
    }
  },
  fields: [
    {name: "field1", type: "string", readonly: "true"}
  ],
  buttons: [
    { name: "Cancel", class: "btn btn-default" },
    { name: "Add", class: "btn btn-primary", id: 'addModalFormSend', onClick: addModalFormSend }
  ]
}

var modalFormParametersWithoutButtons = {
  modalId: 'modalform1',
  title: 'Modal Form',
  response: {
    data: [
        {
          field1: 'value1',
          field2: 'value2'
        }
      ]
  },
  fields: [
    {name: "field1", type: "string"},
    {name: "field2", type: "string"}
  ]
}

var addModalFormSendValues = null

function addModalFormSend (parameters) {
  addModalFormSendValues = parameters
}

describe('modalform component asynchronous button click', function () {
  beforeEach(function (done) {
    $('div').remove()
    $(document.body).append('<div id="root"></div>')
    $('#root').dccModalForm(modalFormParameters)
    var button = $('#modalform1').find('#addModalFormSend')
    button.trigger('click')
    setTimeout(function () {
      done()
    }, 500)
  })

  it('create modalform component and click on add button', function () {
    expect(addModalFormSendValues.field1).toBe('value1')
    expect(addModalFormSendValues.field2).toBe('value2')
  })
})

describe('create modalform component', function () {
  it('create modalform component first time', function () {
    $('#root').dccModalForm(modalFormParameters)
    expect($('#modalform1').find('#modalform1-field1').length).toBe(1)
    expect($('#modalform1').find('#modalform1-field2').length).toBe(1)
  })

  it('create modalform component second time', function () {
    $('#root').dccModalForm(modalFormParameters)
    expect($('[id=modalform1]').length).toBe(1)
    expect($('#modalform1').find('#modalform1-field1').length).toBe(1)
    expect($('#modalform1').find('#modalform1-field2').length).toBe(1)
  })
  
  it('create modalform component without buttons', function () {
    $('#root').dccModalForm(modalFormParametersWithoutButtons)
    expect($('[id=responseModal]').length).toBe(1)
  })
})
