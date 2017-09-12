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
  $.fn.dccClearAll = function (except) {
    $(".dataTables_wrapper").each(function(index, element) {
      var datatableId = $(this).attr('id').replace('_wrapper', '')
      $('#' + datatableId).dataTable().fnClearTable();
      $('#' + datatableId).dataTable().fnDestroy();
    })
    $('#' + $(this).attr('id')).children().each(function(index, element) {
      var elementId = $(this).attr('id').replace('root-', '')
      $.each(except, function(key, value) {
        if (elementId !== value) {
          $('#root-' + elementId).remove()
        }
      })
    })
  }

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
    var datatableId = myParameters.datatableId
    var dom = myParameters.dom || 'Bfrtip'
    var response = myParameters.response
    var priorityColumns = myParameters.priorityColumns
    var buttons = myParameters.buttons

    var arrayColumns = null
    var dataset = null

//    var parametersUnresponse = myParameters
//    delete parametersUnresponse.response
//
//    if (!response) {
//      response = []
//      response['schema'] = []
//    }

    // var schema = $.extend(true, response.schema, parametersUnresponse)

    if ($('#' + datatableId).length) {
      $('#' + datatableId).dataTable().fnClearTable()
    }
    
    // empty root element if is present to avoid side effects on refresh
    purgeNode($(this).attr('id'), datatableId, 'row dcc-datatable-row')
    
    if (!buttons || !priorityColumns || !response) {
      messageBox('dccDatatable error', datatableId + ': buttons, priorityColumns and response parameters are mandatory.')
      return false
    }

    var rootId = 'root-' + datatableId

    if (myParameters.panel) {
      rootId = appendPanel(rootId, datatableId, myParameters.panel)
    }

    var table = '<table id="' + datatableId + '" class="display responsive nowrap" cellspacing="0" width="100%">'

    $('#' + rootId).append('<tr>')
    $('#' + rootId + ' tr').wrap('<Thead>')
    $('#' + rootId + ' thead').wrap(table)
    $('#' + datatableId + ' thead tr').empty()

    if (response.hasOwnProperty("data")) {
      dataset = response.data
      arrayColumns = dataset[0]
    } else {
      dataset = []
      arrayColumns = priorityColumns
    }

    var columns = datatableColumnsHeader(datatableId, arrayColumns, priorityColumns)

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
      if (typeof myParameters.onClick === 'function') {
        myParameters.onClick($(this))
      } else {
        messageBox('dccDatatable error', datatableId + ': missing function for click event.')
        return false
      }
    })
  }
  
  $.fn.dccForm = function (parameters) {
    var rootId = $(this).attr('id')
    var myParameters = $.extend(true, {}, parameters)
    var formId = myParameters.formId
    var response = myParameters.response
    var fields = myParameters.fields
    var buttons = myParameters.buttons
     
    var parametersUnresponse = myParameters
    delete parametersUnresponse.response
    
    if (!response) {
      response = []
      response['schema'] = []
    }
    
    var schema = $.extend(true, response.schema, parametersUnresponse)

    if (!buttons || !fields) {
      messageBox('dccForm error', formId + ': buttons and fields parameters are mandatory.')
      return false
    }

    // empty root element if is present to avoid side effects on refresh
    purgeNode(rootId, formId, 'row')

    rootId = 'root-' + formId

    $('#' + rootId).append('<div id="' + formId + '" class="row ddc-form-row">')

    var classCol = 'col'
    var readonly = ''
    var inputGroupAddon = ''
    var inputGroupAddonParams = []
    
    if (response.hasOwnProperty("data")) {
      $.each(response.data, function(key, value) {
        classCol = 'col'
        inputGroupAddon = ''

        if (parameters.readonly) {
          readonly = ' readonly'
        } else {
          readonly = ''
        }

        $.each(fields, function(fieldKey, fieldValue) {
          if (fieldValue.name == key && fieldValue.class) {
            classCol = fieldValue.class

          }
          if (fieldValue.name == key && fieldValue.readonly && readonly != ' readonly') {
            readonly = ' readonly'
          }
          if (fieldValue.name == key && fieldValue.addon) {
            inputGroupAddon = '<span class="input-group-addon"><a href="#" id="' + formId + '-' + key + '-' + fieldValue.addon.icon + '"><i class="fa fa-' + fieldValue.addon.icon + '" aria-hidden="true"></i></a></span>\n'
            inputGroupAddonParams.push({ id: formId + '-' + key + '-' + fieldValue.addon.icon, onClick: fieldValue.addon.onClick, parameters: response.data })
          }
        })

        var inputGroup = '<span class="input-group-addon">' + key + '</span>\n'
        inputGroup += '<input id="' + formId + '-' + key + '" type="text" class="form-control" value="' + value + '" placeholder="abcdABCD1234"' + readonly + '>'
        inputGroup += inputGroupAddon

        $('#' + formId)
          .appendR('<div class="' + classCol + '">')
          .appendR('<div class="input-group">')
          .appendR(inputGroup)
      })
    } else {
      $.each(fields, function(key, value) {
        var inputGroup = '<span class="input-group-addon">' + value.name + '</span>\n'
        inputGroup += '<input id="' + formId + '-' + value.name + '" type="text" class="form-control" placeholder="abcdABCD1234">'
        $('#' + formId)
          .appendR('<div class="col">')
          .appendR('<div class="input-group">')
          .appendR(inputGroup)
      })
    }

    $.each(inputGroupAddonParams, function(key, value) {
      $('#' + value.id).click(function() {
        var parameters = getFormValues(formId)
        value.onClick(parameters)
      })
    })
  
//  $.each(buttons, function(key, value) {
//    var id = ''
//    if (value.id) {
//      id = ' id="' + value.id + '"'
//    }
//    $('#' + rootId + ' .modal-footer').append(
//      '<button type="button"' + id + ' class="' + value.class + '" data-dismiss="modal">' + value.name + '</button>'
//    )
//    $('#' + value.id).click(function() {
//      var parameters = getFormValues(formId)
//      value.onClick(parameters)
//    });
//  })
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
    purgeNode(selector, modalId, 'row')

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
    purgeNode(selector, navbarId, 'row')

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

  /**
   * Create a bootstrap panel to wrap into
   *
   * @param {string} rootId A valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * @param {string} childId A valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * @param {string} panel Define the title of a bootstrap panel to wrap into
   * @returns {String}
   */
  function appendPanel (rootId, childId, panel) {
    $('#' + rootId).appendR('<div class="panel panel-default">')
      .appendR('<div class="panel-heading">')
      .appendR('<h3 class="panel-title">' + panel + '</h3>')
    $('#' + rootId).children().appendR('<div class="col-sm-12">')
      .appendR('<div class="panel-body" id="root-panel-' + childId + '">')
    return 'root-panel-' + childId
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
   * Build datatable columns header and return an array to pass as parameter
   *
   * @param {string} datatableId A valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * @param {Array} arrayColumns An object array that defines the column names
   * @param {Array} priorityColumns array of elements to set visibility priority to the columns
   * @returns {Array} array to pass to datatable as parameter
   */
  function datatableColumnsHeader (datatableId, arrayColumns, priorityColumns) {
    var columns = []
    var dataPriority = null

    $.each(arrayColumns, function (key, value) {
      columns.push({data: key})
      dataPriority = ''
      $.each(priorityColumns, function (priorityKey, priorityValue) {
        if (key === priorityKey) {
          dataPriority = ' data-priority="' + priorityValue + '"'
        }
      })
      $('#' + datatableId + ' thead tr').append('<th' + dataPriority + '>' + key + '</th>')
    })

    return columns
  }
  
  function getFormValues (selector) {
    var parameters = {}
    $('#' + selector).find('input').each(function(index, element) {
      var id = $(this).attr('id')
      if (id) {
//        // bootstraptoggle patch
//        if ($(this).attr('class') == 'bootstraptoggle') {
//          var toggleOn = $(this).parent().attr('class').indexOf("off")
//          if (toggleOn > 0) {
//            value = false
//          } else {
//            value = true
//          }
//        } else {
//          var value = $(this).val()
//        }
        var value = $(this).val()
        var fieldKey = id.substring(selector.length + 1)
        if (fieldKey.indexOf("undefined") >= 0) {
          fieldKey = fieldKey.substring(1).toLowerCase().replace('undefined', '')
        }
        parameters[fieldKey] = value
      }
    })
    return parameters
  }

  /**
   * Show a simple bootstrap modal message box.
   * @param {string} title The modal title
   * @param {string} message The modal body
   * @returns {void}
   */
  function messageBox (title, message) {
    $('#root').dccModal('responseModal', title, message)
    $('#responseModal').modal('show')
  }

  /**
   * Empty root element if is present to avoid side effects on refresh making the idempotent function
   *
   * @param {string} selector A valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * @param {string} element A valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * @param {string} classes A valid html5 class attribute (https://www.w3.org/TR/html5/dom.html#classes)
   * @returns {void}
   */
  function purgeNode (selector, element, classes) {
    if ($('#root-' + element).length) {
      $('#root-' + element).empty()
    } else {
      $('#' + selector).append('<div class="' + classes + '" id="root-' + element + '">')
    }
  }
}(window.jQuery))
