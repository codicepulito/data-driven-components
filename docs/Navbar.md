Navbar
======
Append a bootstrap navbar menu with items and dropdown sub-items
----------------------------------------------------------------
### Parameters: {object}
Object with elements required to generate the html snippet:
- navbarId: valid html5 [https://www.w3.org/TR/html5/dom.html#the-id-attribute](id attribute)
- items: array of objects `[item0, item1, ..., itemN]`
- onClick: function callback called on item/subitem click - callback(item0.id)
- item0.id: null if it has submenu or valid html5 id attribute
- item0.name: null as separator or string representing the html value of item visible to the user
- item0.submenu: optional array of items object `[subitem0, subitem1, ..., subitemN]`

Navbar code example:
`var navbarParameters = {
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
};

$('#root').dccNavbar(navbarParameters);`