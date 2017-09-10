var navbarParameters = {
  navbarId: 'navbar1',                // id attribute
  onClick: navbarClick,               // callback
  items: [
    {
      id: null,                       // id attribute
      name: "Item 1",                 // html value visible to the user
      submenu: [
        { id: 1, name: "Subitem 1" },
        { id: null, name: null },     // separator
        { id: 2, name: "Subitem 2" }
      ]
    },
    { id: 3, name: "Modal" }
  ]
}

// callback function
function navbarClick(id) {
  // if id is not integer ignore actions
  if (Number.isInteger(parseInt(id, 10))) {
    var menuItem = parseInt(id, 10)
    switch (menuItem) {
      case 3: // Modal
        $('#root').dccModal('modal1', 'Modal Title', 'This is a message.')
        $('#modal1').modal('show')
        break
      default: // else print on console
        console.log('click on item ' + menuItem)
        break
    }
  }
}

$(document).ready(function() {
  $('#root').dccNavbar(navbarParameters);
})
