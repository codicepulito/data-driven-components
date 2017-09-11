Navbar
======
Append a bootstrap navbar menu with items and dropdown sub-items
----------------------------------------------------------------
### Method: dccNavbar(parameters)
### Parameters: {object}
Object's element required to generate the html snippet:
- navbarId: valid html5 [id attribute](https://www.w3.org/TR/html5/dom.html#the-id-attribute)
- items: array of objects `[item0, item1, ..., itemN]`
- item0.id: null if it has submenu or valid html5 id attribute
- item0.name: null as separator or string representing the html value of item visible to the user
- item0.submenu: optional array of items object `[subitem0, subitem1, ..., subitemN]`
- onClick: function callback called on item/subitem click - callback(item0.id)

### Return: {void}

Navbar code example:
```
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
```
