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
  function _ajax (callback, parameters) {
    if (parameters.ajax) {
      var myParameters = $.extend(true, {}, parameters)
      myParameters['response'] = myParameters.response || {}
      var options = myParameters.ajax
      delete myParameters.ajax

      $.ajax({
        url: options.url,
        method: 'GET'
      })
      .error(function (request, status, error) {
        _messageBox('Ajax error', error)
      })
      .success(function (response) {
        if (options.jsend && response.status !== 'success') {
          _messageBox('Ajax response', response.message)
        } else if (options.jsend && response.status === 'success') {
          myParameters.response = response
        } else {
          myParameters.response['data'] = response[options.responseData]
        }
        callback(myParameters)
      })

      return true
    } else {
      return false
    }
  }

  /**
   * Empty all root nodes except those passed in parameter arrays
   *
   * @param {Array} except Array of elements to not empty
   *
   * @returns {void}
   */
  $.fn.ddcClearAll = function (except) {
    $('.dataTables_wrapper').each(function (index, element) {
      var datatableId = $(this).attr('id').replace('_wrapper', '')
      $('#' + datatableId).dataTable().fnClearTable()
      $('#' + datatableId).dataTable().fnDestroy()
    })
    $('#' + $(this).attr('id')).children().each(function (index, element) {
      var elementId = $(this).attr('id').replace('root-', '')
      $.each(except, function (key, value) {
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
   * - panel: string that define the title of a bootstrap panel to wrap into
   * - priorityColumns: array of elements to set visibility priority to the columns, telling Responsive which columns
   *   it should remove before others as documented at https://datatables.net/extensions/responsive/priority
   * - response: dataset response object in jsend format with optional schema (columns info)
   *
   * @returns {void}
   *
   * @todo Implement schema based columns configuration
   */
  $.fn.ddcDatatable = function (parameters) {
    var myParameters = $.extend(true, {}, parameters)
    var buttons = myParameters.buttons
    var datatableId = myParameters.datatableId
    var dom = myParameters.dom || 'Bfrtip'
    var priorityColumns = myParameters.priorityColumns
    var response = myParameters.response
    myParameters['rootId'] = myParameters.rootId || $(this).attr('id')

    var arrayColumns = null
    var dataset = null

    // if ajax exist in parameters callback this again on ajax success
    if (_ajax(function (p) { $(this).ddcDatatable(p) }, myParameters)) {
      return false
    }

    // empty root element if is present to avoid side effects on refresh
    _purgeNode(myParameters.rootId, datatableId, 'row ddc-datatable-row')

    if (!buttons || !priorityColumns || !response) {
      _messageBox('ddcDatatable error', datatableId + ': buttons, priorityColumns and response parameters are mandatory.')
      return false
    }

    var rootId = 'root-' + datatableId
    rootId = _appendPanel(rootId, datatableId, myParameters.panel)

    var table = '<table id="' + datatableId + '" class="display responsive nowrap" cellspacing="0" width="100%">'

    $('#' + rootId).append('<tr>')
    $('#' + rootId + ' tr').wrap('<Thead>')
    $('#' + rootId + ' thead').wrap(table)
    $('#' + datatableId + ' thead tr').empty()

    if (response.hasOwnProperty('data')) {
      dataset = response.data
      arrayColumns = dataset[0]
    } else {
      dataset = []
      arrayColumns = priorityColumns
    }

    var columns = _getDatatableColumns(datatableId, arrayColumns, priorityColumns)

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

    _addDatatableClickCallbacks(myParameters)
  }

  /**
   * Append a bootstrap modal with title and message
   *
   * @param {string} modalId A valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * @param {string} title The modal title
   * @param {string} message The modal body contains the message
   *
   * @returns {void}
   */
  $.fn.ddcModal = function (modalId, title, message) {
    var selector = $(this).attr('id')

    // empty root element if is present to avoid side effects on refresh
    _purgeNode(selector, modalId, 'row')

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
   * Append a bootstrap form with inputs and input-group-addon
   *
   * @param {object} parameters Object with elements required to generate the html snippet:
   * - formId: valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * - buttons: array of objects [button0, button1, ..., buttonN]  - buttons: array of objects [button0, button1, ..., buttonN]
   * - button0.name: string representing the html button label
   * - button0.class: valid html class attribute (https://www.w3.org/TR/html5/dom.html#classes)
   * - button0.id: valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * - button0.onClick: function callback called on button clicked
   * - fields: array of objects [field0, field1, ..., fieldN]
   * - field0.addon: optional array of elements {icon, onClick}
   * - field0.addon.icon: string without "fa" representing the span class (require Font Awesome http://fontawesome.io/)
   * - field0.addon.onClick: function callback called on addon span clicked
   * - field0.class: optional string representing one or more html class attribute
   *   (https://www.w3.org/TR/html5/dom.html#classes)
   * - field0.name: string representing the html input label
   *   also used as id after removing the spaces and concatenated with formId [formId-field0.name]
   * - field0.readonly: boolean - if true make field readonly
   * - field0.type: string - override schema.fields.native_type
   * - modal: optional string render the form in modal with the specified title
   * - response: dataset response object in jsend format with optional schema (ex. PHP PDO getColumnMeta)
   *
   * @returns {void}
   */
  $.fn.ddcForm = function (parameters) {
    var myParameters = $.extend(true, {}, parameters)
    var formId = myParameters.formId
    var modal = myParameters.modal
    var response = myParameters.response
    var parametersUnresponse = myParameters
    myParameters['rootId'] = myParameters.rootId || $(this).attr('id')
    var rootId = myParameters.rootId

    delete parametersUnresponse.response

    // if ajax exist in parameters callback this again on ajax success
    if (_ajax(function (p) { $(this).ddcForm(p) }, myParameters)) {
      return false
    }

//    if (response && response.hasOwnProperty('schema')) {
//      schema = $.extend(true, response.schema, parametersUnresponse)
//    } else {
//      schema = parametersUnresponse
//    }

    var schema = _getSchema(parameters)

    if (!schema.buttons || !schema.fields) {
      _messageBox('ddcForm error', formId + ': buttons and fields parameters are mandatory.')
      return false
    }

    // empty root element if is present to avoid side effects on refresh
    _purgeNode(rootId, formId, 'row')

    rootId = 'root-' + formId

    _addFormHeader(rootId, formId, modal)
    _addInputFields(formId, response, schema)
    _addButtons(rootId, formId, schema.buttons, modal)

    if (modal) {
      $('#' + formId).modal('show')
    }

  //  $('.combobox').combobox('refresh')
  //  $('.bootstraptoggle').bootstrapToggle()
  }

  function _addFormHeader (rootId, formId, modal) {
    if (modal) {
      var modalDiv = '<div id="' + formId + '" class="modal fade" tabindex="-1" role="dialog">'
      $('#' + rootId).append('<div class="modal-header">')
      $('#' + rootId + ' div').wrap('<div class="modal-content">')
      $('#' + rootId + ' .modal-content').wrap('<div class="modal-dialog" role="document">')
      $('#' + rootId + ' .modal-dialog').wrap(modalDiv)
      $('#' + rootId + ' .modal-content').append('<div class="modal-body">')
      $('#' + rootId + ' .modal-content').append('<div class="modal-footer">')
      $('#' + rootId + ' .modal-header').append('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
      $('#' + rootId + ' .modal-header').append('<h4 class="modal-title">' + modal + '</h4>')
    } else {
      $('#' + rootId).append('<div id="' + formId + '" class="row ddc-form-row">')
    }
  }

  /**
   * Append a bootstrap navbar menu with items and dropdown sub-items
   *
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
  $.fn.ddcNavbar = function (parameters) {
    var selector = $(this).attr('id')
    var navbarId = parameters.navbarId
    var items = parameters.items
    var onClick = parameters.onClick
    var menuItem = ''
    var subMenuItem = ''

    // empty root element if is present to avoid side effects on refresh
    _purgeNode(selector, navbarId, 'row')

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

  function _addButtons (rootId, formId, buttons, modal) {
    $.each(buttons, function (key, value) {
      var id = ''
      if (value.id) {
        id = ' id="' + value.id + '"'
      }
      var modalFooter = modal ? ' .modal-footer' : ''
      var dataDismiss = modal ? ' data-dismiss="modal"' : ''
      $('#' + rootId + modalFooter).append(
        '<button type="button"' + id + ' class="' + value.class + '"' + dataDismiss + '>' + value.name + '</button>'
      )

      _addClickCallbacks(formId, [value])
    })
  }

  function _addClickCallbacks (formId, inputGroupAddonParams) {
    $.each(inputGroupAddonParams, function (key, value) {
      $('#' + value.id).click(function () {
        var parameters = _getFormValues(formId)
        value.onClick(parameters)
      })
    })
  }
  
  function _addDatatableClickCallbacks (parameters) {
    var datatableId = parameters.datatableId
    $('#' + datatableId).on('click', 'button', function () {
      if (typeof parameters.onClick === 'function') {
        parameters.onClick($(this))
      } else {
        _messageBox('ddcDatatable error', datatableId + ': missing function for click event.')
        return false
      }
    })
  }

  function _addInputFields (formId, response, schema) {
    var inputGroupAddonParams = []
    var inputGroup = ''

    $.each(schema.fields, function (key, value) {
      var type = ''

      value['ro'] = _isReadonly(schema, value)
      type = value.type || value.native_type || ''
      value['tag'] = (response && response.hasOwnProperty('data')) ? response.data[0][value.name] : ''

      inputGroup = _addInputFieldType(type, formId, value)

      if (value.addon) {
        inputGroup += '<span class="input-group-addon"><a href="#" id="' + formId + '-' + value.name + '-' +
          value.addon.icon + '"><i class="fa fa-' + value.addon.icon + '" aria-hidden="true"></i></a></span>\n'
        inputGroupAddonParams.push({
          id: formId + '-' + value.name + '-' + value.addon.icon,
          onClick: value.addon.onClick,
          parameters: response.data
        })
      }

      var colClass = value.class || 'col-xs-12'

      _addInputFieldRow(formId, schema, colClass, inputGroup)
    })

    _addClickCallbacks(formId, inputGroupAddonParams)
  }

  function _addInputFieldRow (selector, schema, colClass, inputGroup) {
    var modalBody = schema.modal ? ' .modal-body' : ''
    if (schema.rows) {
      $('#' + selector + modalBody)
        .appendR('<div class="row ddc-input-row">')
        .appendR('<div class="' + colClass + '">')
        .appendR('<div class="input-group">')
        .appendR(inputGroup)
    } else {
      $('#' + selector + modalBody)
        .appendR('<div class="' + colClass + '">')
        .appendR('<div class="input-group">')
        .appendR(inputGroup)
    }
  }

  function _addInputFieldType (type, formId, value) {
    var inputGroup = '<span class="input-group-addon">' + value.name + '</span>\n'
    switch (type) {
      case 'bool':
        // checkbox
        inputGroup += '<input id="' + formId + '-' + value.name + '" type="checkbox"' + value.ro + '>\n'
        break
//        case 'lookup':
//          // combobox
//          inputGroup += '<select id="addAgenziaModalSelectCompagnia" name="normal" class="combobox input-large form-control">\n'
//          var data = ''
//          if (value.url) {
//            $.ajax({
//              url: value.url,
//              async: false,
//              dataType: 'json',
//              success: function (response) {
//                data = response.data
//              }
//            })
//          } else {
//            data = value.data
//          }
//          $.each(data, function(key, value) {
//            inputGroup += '<option value="' + value.value + '">' + value.text + '</option>'
//          })
//          inputGroup += '</select>'
//          break
//        case 'toggle':
//          // bootstraptoggle
//          var dataOff = 'False'
//          var dataOn = 'True'
//          var dataWidth = 80
//
//          if (value.toggle) {
//            dataOff = value.toggle.off
//            dataOn = value.toggle.on
//            dataWidth = value.toggle.width
//          }
//
//          inputGroup += '<span>&nbsp</span>\n<span>&nbsp</span>\n<input id="' + modalId + '-' + value.name
//          inputGroup += '" type="checkbox" class="bootstraptoggle" data-on="' + dataOn + '" data-onstyle="success" '
//          inputGroup += 'data-offstyle="danger" data-off="' + dataOff + '" data-width="' + dataWidth + '" data-toggle="toggle">\n'
//          break
      default:
        // standard input
        inputGroup += '<input id="' + formId + '-' + value.name + '" type="text" class="form-control" value="' + value.tag + '"' + value.ro + '>'
        break
    }
    return inputGroup
  }

  /**
   * Create a bootstrap panel to wrap into
   *
   * @param {string} rootId A valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * @param {string} childId A valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * @param {string} panel Define the title of a bootstrap panel to wrap into
   *
   * @returns {String}
   */
  function _appendPanel (rootId, childId, panel) {
    if (panel) {
      $('#' + rootId).appendR('<div class="panel panel-default">')
        .appendR('<div class="panel-heading">')
        .appendR('<h3 class="panel-title">' + panel + '</h3>')
      $('#' + rootId).children().appendR('<div class="col-sm-12">')
        .appendR('<div class="panel-body" id="root-panel-' + childId + '">')
      return 'root-panel-' + childId
    } else {
      return rootId
    }
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
   *
   * @returns {Array} array to pass to datatable as parameter
   */
  function _getDatatableColumns (datatableId, arrayColumns, priorityColumns) {
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

  /**
   * Loop through all instances of input and return a key-value array
   *
   * @param {string} selector
   *
   * @returns {Array} parameters Key-Value array of input in selector
   */
  function _getFormValues (selector) {
    var parameters = {}
    $('#' + selector).find('input').each(function (index, element) {
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
        if (fieldKey.indexOf('undefined') >= 0) {
          fieldKey = fieldKey.substring(1).toLowerCase().replace('undefined', '')
        }
        parameters[fieldKey] = value
      }
    })
    return parameters
  }

  function _getSchema (parameters) {
    var myParameters = $.extend(true, {}, parameters)
    var parametersUnresponse = myParameters
    var response = myParameters.response
    var schema = null

    delete parametersUnresponse.response

    if (response && response.hasOwnProperty('schema')) {
      schema = $.extend(true, response.schema, parametersUnresponse)
    } else {
      schema = parametersUnresponse
    }

    return schema
  }

  function _isReadonly (schema, value) {
    var readonly = ''
    if (schema.readonly) {
      readonly = ' readonly'
    } else {
      if (value.readonly) {
        readonly = ' readonly'
      }
    }
    return readonly
  }

  /**
   * Show a simple bootstrap modal message box.
   *
   * @param {string} title The modal title
   * @param {string} message The modal body
   *
   * @returns {void}
   */
  function _messageBox (title, message) {
    $('#root').ddcModal('responseModal', title, message)
    $('#responseModal').modal('show')
  }

  /**
   * Empty root element if is present to avoid side effects on refresh making the idempotent function
   *
   * @param {string} selector A valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * @param {string} element A valid html5 id attribute (https://www.w3.org/TR/html5/dom.html#the-id-attribute)
   * @param {string} classes A valid html5 class attribute (https://www.w3.org/TR/html5/dom.html#classes)
   *
   * @returns {void}
   */
  function _purgeNode (selector, element, classes) {
    if (classes.indexOf('datatable') > 0) {
      $('#' + element).dataTable().fnClearTable()
    }
    if ($('#root-' + element).length) {
      $('#root-' + element).empty()
    } else {
      $('#' + selector).append('<div class="' + classes + '" id="root-' + element + '">')
    }
  }
}(window.jQuery))
