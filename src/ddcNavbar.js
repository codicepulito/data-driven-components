  function _addNavbarClickCallback (selector, callback) {
    $('#' + selector).click(function () {
      callback()
    })
  }
  
  function _addNavbarHeader (rootId, navbarId) {
    var navbarDiv = '<nav class="navbar navbar-inverse navbar-default">'
    $('#' + rootId).append('<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#' + navbarId + '">')
    $('#' + rootId + ' .navbar-toggle').wrap('<div class="navbar-header">')
    $('#' + rootId + ' .navbar-header').wrap('<div id="' + navbarId + '-container">')
    $('#' + rootId + ' #' + navbarId + '-container').wrap(navbarDiv)
    $('#' + rootId + ' .navbar-toggle').append('<span class="sr-only">Toggle navigation</span>')
    $('#' + rootId + ' .navbar-toggle').append('<span class="icon-bar"></span>')
    $('#' + rootId + ' .navbar-toggle').append('<span class="icon-bar"></span>')
    $('#' + rootId + ' .navbar-toggle').append('<span class="icon-bar"></span>')
    $('#' + rootId + ' #' + navbarId + '-container')
      .appendR('<div class="collapse navbar-collapse" id="' + navbarId + '">')
      .appendR('<ul class="nav navbar-nav">')
  }

  /**
   * Append a bootstrap navbar menu with items and dropdown sub-items
   *
   * @param {object} parameters Object with elements required to generate the html snippet:
   * - navbarId: valid html5 id attribute; see {@link https://www.w3.org/TR/html5/dom.html#the-id-attribute}
   * - items: array of objects [item0, item1, ..., itemN]
   * - item0.id: null if it has submenu or valid html5 id attribute
   * - item0.name: null as separator or string representing the html value of item visible to the user
   * - item0.submenu: optional array of items object [subitem0, subitem1, ..., subitemN]
   * - item0.onClick: function callback called on item/subitem click
   * @returns {void}<br>
   *
   * ## Example
   *
   *     // callback functions
   *     function navbar1Click(id) {
   *       $('#root').ddcModal('modal1', 'Navbar Click', 'Navbar subitem 1 clicked.');
   *       $('#modal1').modal('show');
   *     }
   *
   *     function navbar2Click(id) {
   *       $('#root').ddcModal('modal1', 'Navbar Click', 'Navbar subitem 2 clicked.');
   *       $('#modal1').modal('show');
   *     }
   *
   *     function navbar3Click(id) {
   *       $('#root').ddcModal('modal1', 'Navbar Click', 'Navbar item 3 clicked.');
   *       $('#modal1').modal('show');
   *     }
   *
   *     $(document).ready(function() {
   *       $('#root').ddcNavbar({
   *         navbarId: 'navbar1',                // id attribute
   *         items: [
   *           {
   *             id: null,                       // id attribute
   *             name: "Item 1",                 // html value visible to the user
   *             submenu: [
   *               { id: 1, name: "Subitem 1", onClick: navbar1Click},
   *               { id: null, name: null },     // separator
   *               { id: 2, name: "Subitem 2", onClick: navbar2Click}
   *             ]
   *           },
   *           { id: 3, name: "Item 3", onClick: navbar3Click},
   *         ]
   *       })
   *     })
   */
  $.fn.ddcNavbar = function (parameters) {
    var selector = $(this).attr('id')
    var navbarId = parameters.navbarId
    var items = parameters.items
    var menuItem = ''
    var subMenuItem = ''

    // empty root element if is present to avoid side effects on refresh
    _purgeNode(selector, navbarId, 'row')

    var rootId = 'root-' + navbarId

    var navbarDiv = _addNavbarHeader(rootId, navbarId)

    $.each(items, function (key, value) {
      if (!value.submenu) {
        // add normal item
        menuItem = '<li><a href="#" class="dropdown-item" id="' + navbarId + value.id + '">' +
          value.name + '</a></li>\n'
        $('#' + rootId + ' .navbar-nav').append(menuItem)

        value.id && _addNavbarClickCallback(navbarId + value.id, value.onClick)
      } else {
        // add submenu item
        menuItem = '<a href="#" class="dropdown-toggle" data-toggle="dropdown" id="' + navbarId +
          value.name.replace(' ', '') + '">' + value.name + ' <span class="caret"></span></a>\n'
        $('#' + rootId + ' .navbar-nav').appendR('<li class="dropdown">').appendR(menuItem)
        $('#' + rootId + ' #' + navbarId + value.name.replace(' ', '')).after('<ul class="dropdown-menu">')

        $.each(value.submenu, function (submenuKey, submenuValue) {
          if (!submenuValue.id) {
            subMenuItem = '<li class="divider"></li>'
          } else {
            subMenuItem = '<li><a href="#" class="dropdown-item" id="' + navbarId + submenuValue.id + '">' +
              submenuValue.name + '</a></li>\n'
          }
          $('#' + rootId + ' #' + navbarId + value.name.replace(' ', '')).next().append(subMenuItem)

          submenuValue.id && _addNavbarClickCallback(navbarId + submenuValue.id, submenuValue.onClick)
        })
      }

      // toggle collapsible navbar on click event
      $('.dropdown-item').on('click', function () {
        if ($('.navbar-collapse').css('display') !== 'none') {
          $('.navbar-toggle').trigger('click')
        }
      })
    })
  }
