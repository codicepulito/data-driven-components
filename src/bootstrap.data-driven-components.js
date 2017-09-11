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

(function ($) {
  /**
   * Append a datatable - http://www.datatables.net/
   * Copyright (c) 2008-2015 SpryMedia Limited
   *
   * @param {object} parameters Object with elements required to generate the html snippet:
   * - datatableId: valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * - buttons: The buttons array defines the buttons that will appear in the document to the end user
   *   as documented at https://datatables.net/reference/option/buttons.buttons
   * - dom: String that define the table control elements to appear on the page and in what order
   *   as documented at https://datatables.net/reference/option/dom
   * - onClick: function callback called on row's item clicked
   * - priorityColumns: array of elements to set visibility priority to the columns, telling Responsive which columns
   *   it should remove before others as documented at https://datatables.net/extensions/responsive/priority
   * - response: dataset response object in jsend format with optional schema (columns info)
   * - panel: string that define the title of a bootstrap panel to wrap into
   *
   * @returns {void}
   *
   * @todo Implement schema based columns configuration
   */
  $.fn.dccDatatable = function (parameters) {
    var myParameters = $.extend(true, {}, parameters)
    var selector = $(this).attr('id')
    var datatableId = myParameters.datatableId
    var panel = myParameters.panel
    var dom = myParameters.dom
    var response = myParameters.response
    var priorityColumns = myParameters.priorityColumns
    var buttons = myParameters.buttons
    var onClick = myParameters.onClick
    var error = ''

    var parametersUnresponse = myParameters
    delete parametersUnresponse.response

    if (!response) {
      response = []
      response['schema'] = []
    }

    // var schema = $.extend(true, response.schema, parametersUnresponse)

    if (!buttons) {
      error = datatableId + ': buttons parameter is mandatory.'
      $('#root').dccModal('responseModal', 'dccDatatable error', error)
      $('#responseModal').modal('show')
      return false
    }

    if (!priorityColumns) {
      error = datatableId + ': priorityColumns parameter is mandatory.'
      $('#root').dccModal('responseModal', 'dccDatatable error', error)
      $('#responseModal').modal('show')
      return false
    }

    if (!dom) {
      dom = 'Bfrtip'
    }

    if ($('#' + datatableId).length) {
      $('#' + datatableId).dataTable().fnClearTable()
    }

    if ($('#root-' + datatableId).length) {
      $('#root-' + datatableId).empty()
    } else {
      $('#' + selector).append('<div class="row dcc-datatable-row" id="root-' + datatableId + '">')
    }

    var rootId = 'root-' + datatableId

    if (panel) {
      $('#' + rootId).appendR('<div class="panel panel-default">')
        .appendR('<div class="panel-heading">')
        .appendR('<h3 class="panel-title">' + panel + '</h3>')
      $('#' + rootId).children().appendR('<div class="col-sm-12">')
        .appendR('<div class="panel-body" id="root-panel-' + datatableId + '">')
      rootId = 'root-panel-' + datatableId
    }

    var table = '<table id="' + datatableId + '" class="display responsive nowrap" cellspacing="0" width="100%">'

    $('#' + rootId).append('<tr>')
    $('#' + rootId + ' tr').wrap('<Thead>')
    $('#' + rootId + ' thead').wrap(table)

    var arrayColumns = null
    var columns = []
    var dataset = null
    $('#' + datatableId + ' thead tr').empty()

    if (response.data) {
      dataset = response.data
      arrayColumns = dataset[0]
    } else {
      dataset = []
      arrayColumns = priorityColumns
    }

    $.each(arrayColumns, function (key, value) {
      columns.push({data: key})
      var dataPriority = ''
      $.each(priorityColumns, function (priorityKey, priorityValue) {
        if (key === priorityKey) {
          dataPriority = ' data-priority="' + priorityValue + '"'
        }
      })
      $('#' + datatableId + ' thead tr').append('<th' + dataPriority + '>' + key + '</th>')
    })

    $('#' + datatableId).DataTable({
      dom: dom,
      buttons: buttons,
      responsive: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Italian.json'
      },
      data: dataset,
      columns: columns
    })

    $('#' + datatableId).on('click', 'button', function () {
      if (typeof onClick === 'function') {
        onClick($(this))
      } else {
        var error = datatableId + ': missing function for click event.'
        $('#root').dccModal('responseModal', 'dccDatatable error', error)
        $('#responseModal').modal('show')
        return false
      }
    })
  }

  /**
   * Append a bootstrap modal with title and message
   * @param {string} modalId A valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * @param {string} title The modal title
   * @param {string} message The modal body contains the message
   * @returns {void}
   */
  $.fn.dccModal = function (modalId, title, message) {
    var selector = $(this).attr('id')

    // empty root element if is present to avoid side effects on refresh
    purgeNode(selector, modalId)

    var rootId = 'root-' + modalId

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
   * - item0.id: null if it has submenu or valid html5 id attribute
   * - item0.name: null as separator or string representing the html value of item visible to the user
   * - item0.submenu: optional array of items object [subitem0, subitem1, ..., subitemN]
   * - onClick: function callback called on item/subitem click - callback(item0.id)
   *
   * @returns {void}
   */
  $.fn.dccNavbar = function (parameters) {
    var selector = $(this).attr('id')
    var navbarId = parameters.navbarId
    var items = parameters.items
    var onClick = parameters.onClick
    var menuItem = ''
    var subMenuItem = ''

    // empty root element if is present to avoid side effects on refresh
    purgeNode(selector, navbarId)

    var rootId = 'root-' + navbarId

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

    $.each(items, function (key, value) {
      if (!value.submenu) {
        // add normal item
        menuItem = '<li><a href="#" class="dropdown-item" id="' + navbarId + value.id + '">' +
          value.name + '</a></li>\n'
        $('#' + rootId + ' .navbar-nav').append(menuItem)
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
        })
      }

      // toggle collapsible navbar on click event
      $('.dropdown-item').on('click', function () {
        if ($('.navbar-collapse').css('display') !== 'none') {
          $('.navbar-toggle').trigger('click')
        }
      })
    })

    // callback execution on item/subitem click passing element id as parameter
    $('#' + navbarId + ' .nav li a').click(function () {
      var id = $(this).attr('id')
      onClick(id.substring(navbarId.length))
    })
  }

  // googling with "jquery append recursion"
  // found solution on Stack Overflow
  // jquery - How to add items recursively within one another
  // https://stackoverflow.com/questions/29105469/jquery-how-to-add-items-recursively-within-one-another
  $.fn.appendR = function (toAppend) {
    var $toAppend = $(toAppend)
    this.append($toAppend)
    return $toAppend
  }

  /**
   * Empty root element if is present to avoid side effects on refresh making the idempotent function
   *
   * @param {string} selector A valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * @param {string} element A valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * @returns {void}
   */
  function purgeNode (selector, element) {
    if ($('#root-' + element).length) {
      $('#root-' + element).empty()
    } else {
      $('#' + selector).append('<div class="row" id="root-' + element + '">')
    }
  }
}(window.jQuery))
