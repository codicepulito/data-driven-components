var navbarParameters = {
  navbarId: 'navbar1',
  onClick: navbarClick,
  items: [
    {
      id: null,
      name: "Item 1",
      submenu: [
        { id: 1, name: "Subitem 1" },
        { id: null, name: null },
        { id: 2, name: "Subitem 2" }
      ]
    },
    { id: 3, name: "Item 3" },
  ]
}

var navbarItemClicked = null;

function navbarClick (id) {
  navbarItemClicked = parseInt(id)
}

describe('create navbar component on non empty element', function() {
  
  beforeEach(function(){
    $(document.body).empty()
    $(document.body).append('<div id="root"><div id="root-navbar1"></div></div>');
  });

  it("check main element is present", function(){
    $('#root').dccNavbar(navbarParameters);
    expect($('#root').find('#root-navbar1').length).toBe(1)
  });
    
});

describe('create navbar component', function() {
  
  beforeEach(function(){
    $(document.body).empty()
    $(document.body).append('<div id="root"></div>')
    $('#root').dccNavbar(navbarParameters)
  });

  it("check main element is present", function(){
    expect($('#root').find('#root-navbar1').length).toBe(1)
  });
  
  it ("check returned id on dropdown-item click", function() {
    $('#navbar11').trigger( "click" )
    expect(navbarItemClicked).toBe(1)
    $('#navbar13').trigger( "click" )
    expect(navbarItemClicked).toBe(3)
  });
    
});