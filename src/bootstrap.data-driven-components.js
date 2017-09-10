/* ============================================================================
 * Bootstrap data driven components
 * ============================================================================
 * Copyright (C) 2017 Gianluca Ciarcelluti <gianluca@ciarcelluti.it>
 * ============================================================================
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function( $ ) {
  
  /**
   * Append a bootstrap modal with title and message
   * @param {string} modalId A valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * @param {string} title The modal title
   * @param {string} message The modal body contains the message
   * @returns {void}
   */
  $.fn.dccModal = function(modalId, title, message) {
    var selector = $(this).attr('id')
    
    if ($('#root-' + modalId).length) {
      $('#root-' + modalId).empty()
    } else {
      $('#' + selector).append('<div class="row" id="root-' + modalId + '">')
    }

    rootId = 'root-' + modalId

    var modalDiv = '<div id="' + modalId + '" class="modal fade" tabindex="-1" role="dialog">'
    $('#' + rootId).append('<div class="modal-header">')
    $('#' + rootId + ' div').wrap('<div class="modal-content">')
    $('#' + rootId + ' .modal-content').wrap('<div class="modal-dialog" role="document">')
    $('#' + rootId + ' .modal-dialog').wrap(modalDiv)
    $('#' + rootId + ' .modal-content').append('<div class="modal-body">')
    $('#' + rootId + ' .modal-content').append('<div class="modal-footer">')
    $('#' + rootId + ' .modal-header').append('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
    $('#' + rootId + ' .modal-header').append('<h4 class="modal-title">' + title + '</h4>')
    $('#' + rootId + ' .modal-body').append('<p id="' + modalId + '-body">' + message + '</p>')
    $('#' + rootId + ' .modal-footer').append('<button type="button" class="btn btn-default" data-dismiss="modal">OK</button>')
  }

  /**
   * Append a bootstrap navbar menu with items and dropdown sub-items
   * @param {object} parameters Object with elements required to generate the html snippet:
   * - navbarId: valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * - items: array of objects [item0, item1, ..., itemN]
   * - onClick: function callback called on item/subitem click - callback(item0.id)
   * - item0.id: null if it has submenu or valid html5 id attribute
   * - item0.name: null as separator or string representing the html value of item visible to the user
   * - item0.submenu: optional array of items object [subitem0, subitem1, ..., subitemN]
   *
   * @returns {void}
   */
  $.fn.dccNavbar = function(parameters) {

    var elem = $(this)
    var selector = $(this).attr('id')
    var navbarId = parameters.navbarId
    var items = parameters.items
    var onClick = parameters.onClick
    var menuItem = ''
    var subMenuItem = ''

    // empty root element if is present to avoid side effects on refresh
    if ($('#root-' + navbarId).length) {
      $('#' + navbarId).empty()
    } else {
      $('#' + selector).append('<div class="row" id="root-' + navbarId + '">')
    }
    
    rootId = 'root-' + navbarId
  
    // add navbar headers
    var navbarDiv = '<nav class="navbar navbar-inverse navbar-default">'
    $('#' + rootId).append('<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#' + navbarId + '">')
    $('#' + rootId + ' .navbar-toggle').wrap('<div class="navbar-header">')
    $('#' + rootId + ' .navbar-header').wrap('<div id="' + navbarId + '-container" class="container-fluid">')
    $('#' + rootId + ' #' + navbarId + '-container').wrap(navbarDiv)
    $('#' + rootId + ' .navbar-toggle').append('<span class="sr-only">Toggle navigation</span>')
    $('#' + rootId + ' .navbar-toggle').append('<span class="icon-bar"></span>')
    $('#' + rootId + ' .navbar-toggle').append('<span class="icon-bar"></span>')
    $('#' + rootId + ' .navbar-toggle').append('<span class="icon-bar"></span>')
    $('#' + rootId + ' #' + navbarId + '-container')
      .appendR('<div class="collapse navbar-collapse" id="' + navbarId + '">')
      .appendR('<ul class="nav navbar-nav">')

    $.each(items, function(key, value) {
      if (!value.submenu) {
        // add normal item
        menuItem = '<li><a href="#" class="dropdown-item" id="' + navbarId + value.id + '">'
          + value.name + '</a></li>\n'
        $('#' + rootId + ' .navbar-nav').append(menuItem)
      } else {
        // add submenu item
        menuItem = '<a href="#" class="dropdown-toggle" data-toggle="dropdown" id="' + navbarId + value.name.replace(' ', '') + '">'
          + value.name + ' <span class="caret"></span></a>\n'
        $('#' + rootId + ' .navbar-nav').appendR('<li class="dropdown">').appendR(menuItem)
        $('#' + rootId + ' #' + navbarId + value.name.replace(' ', '')).after('<ul class="dropdown-menu">')

        $.each(value.submenu, function(submenuKey, submenuValue) {
          if (!submenuValue.id) {
            subMenuItem = '<li class="divider"></li>'
          } else {
            subMenuItem = '<li><a href="#" class="dropdown-item" id="' + navbarId + submenuValue.id + '">'
              + submenuValue.name + '</a></li>\n'
          }
          $('#' + rootId + ' #' + navbarId + value.name.replace(' ', '')).next().append(subMenuItem)
        })
      }

      // toggle collapsible navbar on click event
      $('.dropdown-item').on('click', function(){
        if($('.navbar-collapse').css('display') !== 'none'){
          $(".navbar-toggle").trigger( "click" )
        }
      });
    })

    // callback execution on item/subitem click passing element id as parameter
    $('#' + navbarId + ' .nav li a').click(function(){
      var id = $(this).attr('id')
      onClick(id.substring(navbarId.length))
    });
    
  }
  
  // googling with "jquery append recursion"
  // found solution on Stack Overflow
  // jquery - How to add items recursively within one another
  // https://stackoverflow.com/questions/29105469/jquery-how-to-add-items-recursively-within-one-another
  $.fn.appendR = function(toAppend) {
    var $toAppend = $(toAppend);
    this.append($toAppend);
    return $toAppend;
  };
    
}( jQuery ));