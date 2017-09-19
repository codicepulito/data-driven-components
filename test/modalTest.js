var buttons = [
  { name: "Cancel", class: "btn btn-default" },
  { name: "Add", class: "btn btn-primary", data: 'test', id: 'addModalSend', onClick: addModalSend }
]

var addModalSendValues = null

function addModalSend (parameters) {
  addModalSendValues = parameters
}

describe('modal component asynchronous button click', function () {
  beforeEach(function (done) {
    $('div').remove()
    $(document.body).append('<div id="root"></div>')
    $('#root').ddcModal('modal1', 'title', 'message', buttons)
    var button = $('#modal1').find('#addModalSend')
    button.trigger('click')
    setTimeout(function () {
      done()
    }, 500)
  })

  it('create modal form component and click on add button', function () {
    expect(addModalSendValues.addModalSend).toBe('test')
  })
})

describe('create modal component', function () {
  it('check main element is present', function () {
    $('div').remove()
    $(document.body).append('<div id="root"></div>')
    $('#root').ddcModal('modal1', 'title', 'message')
    expect($('[id=modal1]').length).toBe(1)
  })

  it('check main element is present on non empty dom', function () {
    $('#root').ddcModal('modal1', 'title', 'message')
    expect($('[id=modal1]').length).toBe(1)
    expect($('#root').find('#root-modal1 .modal-title').html()).toBe('title')
    expect($('#root').find('#root-modal1 #modal1-body').html()).toBe('message')
  })
})
