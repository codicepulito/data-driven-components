describe('create modal component', function () {
  it('check main element is present', function () {
    $(document.body).append('<div id="root"></div>')
    $('#root').dccModal('modal1', 'title', 'message')
    expect($('[id=modal1]').length).toBe(1)
  })

  it('check main element is present on non empty dom', function () {
    $('#root').dccModal('modal1', 'title', 'message')
    expect($('[id=modal1]').length).toBe(1)
    expect($('#root').find('#root-modal1 .modal-title').html()).toBe('title')
    expect($('#root').find('#root-modal1 #modal1-body').html()).toBe('message')
  })
})
