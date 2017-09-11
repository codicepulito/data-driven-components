// databale callback function
function datatable1Click (row) {
  var id = $(row).attr('id')
  $('#root').dccModal('modalResponse', 'Datatable click', 'You have clicked on row with id ' + id)
  $('#modalResponse').modal('show')
}

// navbar callback function
function navbarClick (id) {
  // if id is not integer ignore actions
  if (Number.isInteger(parseInt(id, 10))) {
    var menuItem = parseInt(id, 10)
    switch (menuItem) {
      case 1: // Datatable
        $.ajax({
          url: 'https://randomuser.me/api/?results=20',
          dataType: 'json',
          success: function(data) {
//            var datatableParameters = {
//              datatableId: 'datatable1',
//              response: {
//                data: data.results
//              },
//              buttons: [],
//              priorityColumns: {email: 1, gender: 2, phone: 3, cell: 4, registered: 5, nat: 6, dob: 7},
//              onClick: datatable1Click
//            }
            var datatableParameters = {
              datatableId: 'datatable1',
              response: {
                data: [
                  {
                    "id": 1,
                    "name": "Leanne Graham",
                    "username": "Bret",
                    "email": "Sincere@april.biz",
                    "phone": "1-770-736-8031 x56442",
                    "website": "hildegard.org",
                    "edit": "<center><button id=\"1\"></button></center>"
                  },
                  {
                    "id": 2,
                    "name": "Ervin Howell",
                    "username": "Antonette",
                    "email": "Shanna@melissa.tv",
                    "phone": "010-692-6593 x09125",
                    "website": "anastasia.net",
                    "edit": "<center><button id=\"2\"></button></center>"
                  }
                ]
              },
              buttons: [],
              priorityColumns: {name: 1, username: 2, email: 3},
              onClick: datatable1Click
            }
            $('#root').dccDatatable(datatableParameters)
          }
        });
        break
      case 2: // Modal
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
  var navbarParameters = {
    navbarId: 'navbar1',                // id attribute
    onClick: navbarClick,               // callback
    items: [
      { id: 1, name: "Datatable" },
      {
        id: null,                       // id attribute
        name: "Dropdown items",                 // html value visible to the user
        submenu: [
          { id: 3, name: "Subitem 1" },
          { id: null, name: null },     // separator
          { id: 4, name: "Subitem 2" }
        ]
      },
      { id: 2, name: "Modal" },

    ]
  }
  $('#root').dccNavbar(navbarParameters);
})
