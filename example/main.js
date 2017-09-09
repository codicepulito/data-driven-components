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
    { id: 3, name: "Item 3" },
  ]
};

// callback function
function navbarClick(id) {
  if (Number.isInteger(parseInt(id))) {
    alert('click on item ' + id);
  }
}

$(document).ready(function() {
  $('#root').dccNavbar(navbarParameters);
});
