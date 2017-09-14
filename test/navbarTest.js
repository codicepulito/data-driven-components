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

var navbarItemClicked = null

function navbarClick (id) {
  navbarItemClicked = parseInt(id)
}

describe('create navbar component', function () {
  it('check main element is present', function () {
    $('div').remove()
    $(document.body).append('<div id="root"></div>')
    $('#root').ddcNavbar(navbarParameters)
    expect($('[id=navbar1]').length).toBe(1)
  })

  it('check main element is present on non empty dom', function () {
    expect($('[id=navbar1]').length).toBe(1)
  })

  it('check returned id on dropdown-item click', function () {
    $('#navbar11').trigger('click')
    expect(navbarItemClicked).toBe(1)
    $('#navbar13').trigger('click')
    expect(navbarItemClicked).toBe(3)
  })
})
