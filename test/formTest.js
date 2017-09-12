var formParameters = {
  formId: 'form1',
  response: {
    data:
      {"field1": "value1", "field2": "value2", "undefined": "undefined"}
  },
  fields: [
    {name: "field1", class: 'col-4'},
    {name: "field2", class: 'col-4', addon: { icon: 'reply', onClick: form1Click }},
    {name: "field3", class: 'col-4'}
  ],
  readonly: true,
  buttons: []
}

var formParametersWithoutReadonly = {
  formId: 'form1',
  response: {
    data:
      {"field1": "value1", "field2": "value2"}
  },
  fields: [
    {name: "field1", class: 'col-4', readonly: true},
    {name: "field2", class: 'col-4'}
  ],
  buttons: []
}

var formParametersWithoutResponse = {
  formId: 'form1',
  response: null,
  fields: [
    {name: "field1", class: 'col-4'},
    {name: "field2", class: 'col-4'}
  ],
  buttons: []
}

var formParametersWithoutButtons = {
  formId: 'form1',
  response: null,
  fields: [
    {name: "field1", class: 'col-4'},
    {name: "field2", class: 'col-4'}
  ]
}

var form1ClickValues = null

function form1Click (parameters) {
  form1ClickValues = parameters
}

describe('form component asynchronous button click', function () {
  beforeEach(function (done) {
    $('div').remove()
    $(document.body).append('<div id="root"></div>')
    $('#root').dccForm(formParameters)
    var button = $('#form1').find('#form1-field2-reply')
    button.trigger('click')
    setTimeout(function () {
      done()
    }, 500)
  })

  it('create form component and click on addon', function () {
    expect(form1ClickValues.field1).toBe('value1')
    expect(form1ClickValues.field2).toBe('value2')
  })
})

describe('create form component', function () {
  it('create form component first time', function () {
    $('#root').dccForm(formParameters)
    expect($('#form1').find('#form1-field1').length).toBe(1)
    expect($('#form1').find('#form1-field2').length).toBe(1)
    expect($('#form1').find('#form1-field1').is('[readonly]')).toBe(true)
    expect($('#form1').find('#form1-field2').is('[readonly]')).toBe(true)
  })

  it('create form component second time', function () {
    $('#root').dccForm(formParameters)
    expect($('[id=form1]').length).toBe(1)
    expect($('#form1').find('#form1-field1').length).toBe(1)
    expect($('#form1').find('#form1-field2').length).toBe(1)
  })

  it('create form component without readonly property', function () {
    $('#root').dccForm(formParametersWithoutReadonly)
    expect($('#form1').find('#form1-field1').is('[readonly]')).toBe(true)
    expect($('#form1').find('#form1-field2').is('[readonly]')).toBe(false)
  })

  it('create form component without buttons', function () {
    $('#root').dccForm(formParametersWithoutButtons)
    expect($('[id=responseModal]').length).toBe(1)
  })

  it('create form component without response', function () {
    $('#root').dccForm(formParametersWithoutResponse)
    expect($('#form1').find('#form1-field1').length).toBe(1)
    expect($('#form1').find('#form1-field2').length).toBe(1)
    expect($('#form1').find('#form1-field1').is('[readonly]')).toBe(false)
    expect($('#form1').find('#form1-field2').is('[readonly]')).toBe(false)
  })
})
