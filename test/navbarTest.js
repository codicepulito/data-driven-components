var navbarParameters = {
  navbarId: 'navbar1',
  items: [
    {
      id: null,
      name: 'Item 1',
      submenu: [
        { id: 1, name: 'Subitem 1', onClick: navbarSubmenu1Click},
        { id: null, name: null },
        { id: 2, name: 'Subitem 2', onClick: navbarSubmenu2Click}
      ]
    },
    { id: 3, name: 'Item 3', onClick: navbarMenu3Click}
  ]
}

var navbar1Clicked = false
var navbar2Clicked = false
var navbar3Clicked = false

function navbarSubmenu1Click () {
  navbar1Clicked = true
}

function navbarSubmenu2Click () {
  navbar2Clicked = true
}

function navbarMenu3Click () {
  navbar3Clicked = true
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

  it('check click event on item 1', function () {
    expect(navbar1Clicked).toBe(false)
    $('#navbar11').trigger('click')
    expect(navbar1Clicked).toBe(true)
  })
  
  it('check click event on item 2', function () {
    expect(navbar2Clicked).toBe(false)
    $('#navbar12').trigger('click')
    expect(navbar2Clicked).toBe(true)
  })
  
  it('check click event on item 3', function () {
    expect(navbar3Clicked).toBe(false)
    $('#navbar13').trigger('click')
    expect(navbar3Clicked).toBe(true)
  })
})
