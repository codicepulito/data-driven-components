var formParameters = {
  formId: 'form1',
  response: {
    data: [
      {
        field1: 'value1',
        field2: 'value2',
        field3: '2017-01-01',
        field4: '2017-12-31',
        field5: 'secret'
      }
    ],
    schema: {
      fields: [
        {name: "field1", native_type: "varchar", addon: { icon: 'refresh', onClick: addonForm1Field1 }},
        {name: "field2", native_type: "bool"},
        {name: "field3", native_type: "date"},
        {name: "field4", native_type: "date"},
        {name: "field5", native_type: "hidden"},
      ]
    }
  },
  fields: [
    {name: "field1", class: "col-4", type: "string", readonly: true},
    {name: "field2"},
    {name: "field3"},
    {name: "field4", type: 'datepicker'},
    {name: "field5"}
  ],
  buttons: [
    { name: "Cancel", class: "btn btn-default" },
    { name: "Add", class: "btn btn-primary", id: 'addFormSend', onClick: addFormSend }
  ]
}

var formParametersModal = {
  formId: 'form1',
  modal: 'Modal 1',
  readonly: true,
  rows: true,
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
    {name: "field1", type: "string"}
  ],
  buttons: [
    { name: "Cancel", class: "btn btn-default" },
    { name: "Add", class: "btn btn-primary", id: 'addFormSend', onClick: addFormSend }
  ]
}

var formParametersWithoutButtons = {
  formId: 'form1',
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

var formParametersWithoutResponse = {
  formId: 'form1',
  modal: 'Modal 1',
  response: null,
  fields: [
    {name: "field1", type: "string"},
    {name: "field2", type: "string"}
  ],
  buttons: [
    { name: "Cancel", class: "btn btn-default" },
    { name: "Add", class: "btn btn-primary", id: 'addFormSend', onClick: addFormSend }
  ]
}

var formParametersWithLookupWithoutResponse = {
  formId: 'form1',
  modal: 'Modal 1',
  response: {
    data: [
      {
        field1: 'value1',
        field2: '001'
      }
    ]
  },
  fields: [
    {name: "field1", type: "string"},
    {
      name: "field2",
      type: "lookup",
      data: [
        { value: '001', text: 'lookup1' },
        { value: '002', text: 'lookup2' }
      ]
    }
  ],
  buttons: [
    { name: "Cancel", class: "btn btn-default" },
    { name: "Add", class: "btn btn-primary", id: 'addFormSend', onClick: addFormSend }
  ]
}

var formParametersWithLookupAjaxWithoutResponse = {
  formId: 'form1',
  modal: 'Modal 1',
  response: null,
  fields: [
    {name: "field1", type: "string"},
    {
      name: "field2",
      type: "lookup",
      url: 'https://raw.githubusercontent.com/codicepulito/data-driven-components/master/test/json/jsendLookup.json'
    }
  ],
  buttons: [
    { name: "Cancel", class: "btn btn-default" },
    { name: "Add", class: "btn btn-primary", id: 'addFormSend', onClick: addFormSend }
  ]
}

var formParametersAjaxError = {
  formId: 'form1',
  modal: 'Modal 1',
  ajax: {
    url: 'https://raw.githubusercontent.com/codicepulito/data-driven-components/master/test/json/jsendError.json',
    responseDataKey: 'results',
    jsend: true
  },
  response: null,
  fields: [
    {name: "field1", type: "string"},
    {name: "field2", type: "string"}
  ],
  buttons: [
    { name: "Cancel", class: "btn btn-default" },
    { name: "Add", class: "btn btn-primary", id: 'addFormSend', onClick: addFormSend }
  ]
}

var addFormSendValues = null
var addonForm1Field1Value = null

function addFormSend (parameters) {
  addFormSendValues = parameters
}

function addonForm1Field1 (id) {
  addonForm1Field1Value = id
}

describe('form component asynchronous button click', function () {
  beforeEach(function (done) {
    $('div').remove()
    $(document.body).append('<div id="root"></div>')
    $('#root').ddcForm(formParametersWithLookupWithoutResponse)
    var button = $('#form1').find('#addFormSend')
    button.trigger('click')
    setTimeout(function () {
      done()
    }, 500)
  })

  it('create modal form component and click on add button', function () {
    expect(addFormSendValues.field1).toBe('value1')
    expect(addFormSendValues.field2).toBe('001')
  })
})

describe('form component ajax error loading', function () {
    beforeEach(function (done) {
      $('div').remove()
      $(document.body).append('<div id="root"></div>')
      $('#root').ddcForm(formParametersAjaxError)
      setTimeout(function () {
        done()
      }, 2000)
    })

    it('check ajax error', function () {
      expect($('[id=responseModal]').length).toBe(1)
    })
  })

describe('form component asynchronous addon click', function () {
  beforeEach(function (done) {
    $('div').remove()
    $(document.body).append('<div id="root"></div>')
    $('#root').ddcForm(formParameters)
    var button = $('#form1').find('#form1-field1-refresh')
    button.trigger('click')
    setTimeout(function () {
      done()
    }, 500)
  })

  it('create modal form component and click on add button', function () {
    expect(addonForm1Field1Value.field1).toBe('value1')
    expect(addonForm1Field1Value.field2).toBe(false)
  })
})

describe('create form component', function () {
  it('create form component first time', function () {
    $(document.body).append('<div id="root"></div>')
    $('#root').ddcForm(formParametersModal)
    expect($('#form1').find('#form1-field1').length).toBe(1)
    expect($('#form1').find('#form1-field2').length).toBe(1)
  })

  it('create form component second time', function () {
    $('#root').ddcForm(formParameters)
    expect($('[id=form1]').length).toBe(1)
    expect($('#form1').find('#form1-field1').length).toBe(1)
    expect($('#form1').find('#form1-field2').length).toBe(1)
  })

  it('create form component and check readonly attribute', function () {
    $('#root').ddcForm(formParametersModal)
    expect($('#form1').find('#form1-field1').is('[readonly]')).toBe(true)
    expect($('#form1').find('#form1-field2').is('[readonly]')).toBe(true)
  })

  it('create form component and check rows exists', function () {
    $('#root').ddcForm(formParametersModal)
    expect($('.ddc-input-row').length).toBe(2)
  })

  it('create form component and check rows not exists', function () {
    $('#root').ddcForm(formParameters)
    expect($('.ddc-input-row').length).toBe(0)
  })

  it('create form component without buttons', function () {
    $('#root').ddcForm(formParametersWithoutButtons)
    expect($('[id=responseModal]').length).toBe(1)
  })

  it('create form component without response', function () {
    $('#root').ddcForm(formParametersWithoutResponse)
    expect($('[id=form1]').length).toBe(1)
    expect($('#form1').find('#form1-field1').length).toBe(1)
    expect($('#form1').find('#form1-field2').length).toBe(1)
  })

  it('create form and check field1 attributes', function () {
    $('#root').ddcForm(formParameters)
    expect($('[id=form1]').length).toBe(1)
    expect($('#form1').find('#form1-field1').parent().parent().attr('class')).toBe('col-4')
    expect($('#form1').find('#form1-field1').is('[readonly]')).toBe(true)
    expect($('#form1').find('#form1-field2').is('[readonly]')).toBe(false)
  })
  
  it('create form and check field3 date attributes', function () {
    $('#root').ddcForm(formParameters)
    expect($('[id=form1]').length).toBe(1)
    expect($('#form1').find('#form1-field3').attr('type')).toBe('date')
  })
  
  it('create form and check field5 hidden attributes', function () {
    $('#root').ddcForm(formParameters)
    expect($('[id=form1]').length).toBe(1)
    expect($('#form1').find('#form1-field5').attr('type')).toBe('hidden')
  })
  
  it('create form and check field4 datepicker attributes', function () {
    $('#root').ddcForm(formParameters)
    expect($('[id=form1]').length).toBe(1)
    expect($('#form1').find('#form1-field4').attr('class')).toBe('form-control ddc-input-datepicker')
  })

  it('create form and check lookup attributes', function () {
    $('#root').ddcForm(formParametersWithLookupWithoutResponse)
    expect($('[id=form1]').length).toBe(1)
    expect($('#form1').find('#form1-field1').length).toBe(1)
    expect($('#form1').find('#form1-field2undefined').length).toBe(1)
  })

  it('create form and check ajax lookup attributes', function () {
    $('#root').ddcForm(formParametersWithLookupAjaxWithoutResponse)
    expect($('[id=form1]').length).toBe(1)
    expect($('#form1').find('#form1-field1').length).toBe(1)
    expect($('#form1').find('#form1-field2undefined').length).toBe(1)
  })
})
