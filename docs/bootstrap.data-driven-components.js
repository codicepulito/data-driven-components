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
  function _addButtons (rootId, formId, buttons, modal) {
    $.each(buttons, function (key, value) {
      var id = ''
      var ddcData = value.data || ''
      if (value.id) {
        id = ' id="' + value.id + '"'
      }
      var modalFooter = modal ? ' .modal-footer' : ''
      var dataDismiss = modal ? ' data-dismiss="modal"' : ''
      $('#' + rootId + modalFooter).append(
        '<button type="button"' + id + ' ddc-data="' + ddcData + '" class="' + value.class + '"' + dataDismiss + '>' + value.name + '</button>'
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

  function _addFormHeader (rootId, formId, modal) {
    if (modal) {
      var modalDiv = '<div id="' + formId + '" class="modal fade" tabindex="-1" role="dialog">'
      $('#' + rootId).append('<div class="modal-header">')
      $('#' + rootId + ' div').wrap('<div class="modal-content">')
      $('#' + rootId + ' .modal-content').wrap('<div class="modal-dialog" role="document">')
      $('#' + rootId + ' .modal-dialog').wrap(modalDiv)
      $('#' + rootId + ' .modal-content').appendR('<div class="modal-body">').appendR('<div class="row ddc-row-main">')
      $('#' + rootId + ' .modal-content').append('<div class="modal-footer">')
      $('#' + rootId + ' .modal-header').append('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
      $('#' + rootId + ' .modal-header').append('<h4 class="modal-title">' + modal + '</h4>')
    } else {
      $('#' + rootId).append('<div id="' + formId + '" class="row ddc-form-row">')
    }
  }

  function _addInputFields (formId, response, schema) {
    var inputGroupAddonParams = []
    var inputGroup = ''

    $.each(schema.fields, function (key, value) {
      var type = ''

      value['ro'] = _isReadonly(schema, value)
      type = value.type || value.native_type || ''
      value['tag'] = (response && response.hasOwnProperty('data')) ? response.data[0][value.name] : (value.value || '')

      if (type === 'datatable') {
        $('#' + formId).ddcDatatable(value.datatable)
      } else {
        inputGroup = _addInputFieldType(type, formId, value)
      }

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
    var modalBody = schema.modal ? ' .modal-body .ddc-row-main' : ''
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
        var checked = (value.tag === true || value.tag === 't') ? ' checked' : ''
        inputGroup += '<input id="' + formId + '-' + value.name + '" type="checkbox"' + value.ro + checked + '>\n'
        break
      case 'date':
        inputGroup += '<input id="' + formId + '-' + value.name + '" type="date" class="form-control" value="' + value.tag + '"' + value.ro + '>'
        break
      case 'datepicker':
        inputGroup += '<input id="' + formId + '-' + value.name + '" type="text" class="form-control ddc-input-datepicker" value="' + value.tag + '"' + value.ro + '>'
        break
      case 'lookup':
        // bootstrap-combobox
        inputGroup += '<select id="' + formId + '-' + value.name + '" name="normal" class="combobox input-large form-control">\n'
        var data = ''
        if (value.url) {
          $.ajax({
            url: value.url,
            async: false,
            dataType: 'json',
            success: function (response) {
              data = response.data
            }
          })
        } else {
          data = value.data
        }
        $.each(data, function (lookupKey, lookupValue) {
          var selected = value.tag === lookupValue.value ? ' selected' : ''
          inputGroup += '<option value="' + lookupValue.value + '"' + selected + '>' + lookupValue.text + '</option>'
        })
        inputGroup += '</select>'
        break
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

  function _addNavbarClickCallback (selector, callback) {
    $('#' + selector).click(function () {
      callback()
    })
  }

  function _ajax (callback, parameters) {
    if (parameters.ajax) {
      var myParameters = $.extend(true, {}, parameters)
      myParameters['response'] = myParameters.response || {}
      var options = myParameters.ajax
      delete myParameters.ajax

      $.ajax({
        url: options.url,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
          if (options.jsend && response.status !== 'success') {
            _messageBox('Ajax response', response.message)
          } else if (options.jsend && response.status === 'success') {
            myParameters.response = response
          } else {
            myParameters.response['data'] = response[options.responseDataKey]
          }
          callback(myParameters)
        },
        error: function (request, status, error) {
          _messageBox('Ajax error', error)
        }
      })

      return true
    } else {
      return false
    }
  }

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

  function _getDatatableLanguage (selector) {
    var locale = $('#' + selector).ddcLocale($('#' + selector).data('locale'))

    return '//cdn.datatables.net/plug-ins/1.10.16/i18n/' + locale.language + '.json'
  }

  function _getFormValues (selector) {
    var parameters = {}
    $('#' + selector).find('input').each(function (index, element) {
      var id = $(this).attr('id')

      if (id) {
        var value = $(this).val()
//        // bootstraptoggle patch
//        if ($(this).attr('class') == 'bootstraptoggle') {
//          var toggleOn = $(this).parent().attr('class').indexOf("off")
//          if (toggleOn > 0) {
//            value = false
//          } else {
//            value = true
//          }
//        }

        if ($(this).attr('type') === 'checkbox') {
          value = $('#' + id + ':checkbox:checked').length > 0
        }

        // combobox patch
        var fieldKey = id.substring(selector.length + 1)
        if (fieldKey.indexOf('undefined') >= 0) {
          fieldKey = fieldKey.substring(0).toLowerCase().replace('undefined', '')
          value = $(this).parent().parent().children().val()
        }

        parameters[fieldKey] = value
      }
    })
    $('#' + selector).find('button').each(function (index, element) {
      if ($(this).attr('ddc-data')) {
        var id = $(this).attr('id')
        var value = $(this).attr('ddc-data')
        parameters[id] = value
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

  function _messageBox (title, message) {
    $('#root').ddcModal('responseModal', title, message)
    $('#responseModal').modal('show')
  }

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
   * Empty all root nodes except those passed in parameter arrays
   *
   * ## Example
   *
   *     $('#root').ddcClearAll(['navbar1'])
   *
   * @param {Array} except Array of elements to not empty
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

    // patch for pace.js side effect on modal dismiss
    $(document.body).removeClass('modal-open')
    $('.modal-backdrop').remove()
  }

  /**
   * Append a datatable - http://www.datatables.net/
   * -----------------------------------------------
   * Copyright (c) 2008-2015 SpryMedia Limited
   * -----------------------------------------
   * @param {object} parameters Object with elements required to generate the html snippet:
   * - datatableId: valid html5 id attribute; see {@link https://www.w3.org/TR/html5/dom.html#the-id-attribute}
   * - ajax: asyncronous function call options
   * - ajax.jsend: set the [jsend]{@link https://labs.omniti.com/labs/jsend} compatibility
   * - ajax.responseDataKey: if ajax.jsend is false, set the object key contains data
   * - ajax.url: a valid url address
   * - buttons: array that defines the buttons that will appear in the document to the end user
   *   as documented at {@link https://datatables.net/reference/option/buttons.buttons}
   * - dom: String that define the table control elements to appear on the page and in what order
   *   as documented at {@link https://datatables.net/reference/option/dom}
   * - onClick: function callback called on row's item clicked
   * - panel: string that define the title of a bootstrap panel to wrap into
   * - pageLength: integer Number of rows to display on a single page when using pagination
   *   as documented at {@link https://datatables.net/reference/option/pageLength}
   * - priorityColumns: array of elements to set visibility priority to the columns, telling Responsive which columns
   *   it should remove before others; see {@link https://datatables.net/extensions/responsive/priority}
   * - response: dataset response object in [jsend]{@link https://labs.omniti.com/labs/jsend} format with optional schema (columns info)
   * @returns {void}<br>
   *
   * ## Example 1: Datatable with manual data
   *
   *     $('#root').ddcDatatable({
   *        datatableId: 'datatable1',
   *        response: {
   *          data: [
   *            {
   *                "id": 1,
   *                "name": "Leanne Graham",
   *                "username": "Bret",
   *                "email": "Sincere@april.biz",
   *                "phone": "1-770-736-8031 x56442",
   *                "website": "hildegard.org",
   *                "edit": "<center><button id=\"1\"></button></center>"
   *            },
   *            {
   *                "id": 2,
   *                "name": "Ervin Howell",
   *                "username": "Antonette",
   *                "email": "Shanna@melissa.tv",
   *                "phone": "010-692-6593 x09125",
   *                "website": "anastasia.net",
   *                "edit": "<center><button id=\"2\"></button></center>"
   *            }
   *          ]
   *        },
   *        buttons: [],
   *        priorityColumns: {name: 1, username: 2, email: 3},
   *        onClick: datatable1Click
   *     })
   *
   *     // callback function
   *     function datatable1Click(this) {
   *      var id = $(this).attr('id')
   *     }
   *
   * ## Example 2: Datatable with ajax remote data
   *
   *     $('#root').ddcDatatable({
   *        datatableId: 'datatable1',
   *        ajax: {
   *          url: 'https://randomuser.me/api/?results=20',
   *          responseDataKey: 'results',
   *          jsend: false
   *        },
   *        response: null,
   *        buttons: [],
   *        priorityColumns: {name: 1, username: 2, email: 3},
   *        onClick: datatable1Click
   *     })
   *
   *     // callback function
   *     function datatable1Click(this) {
   *      var id = $(this).attr('id')
   *     }
   *
   */
  $.fn.ddcDatatable = function (parameters) {
    var myParameters = $.extend(true, {}, parameters)
    var buttons = myParameters.buttons
    var datatableId = myParameters.datatableId
    var dom = myParameters.dom || 'Bfrtip'
    var priorityColumns = myParameters.priorityColumns
    var response = myParameters.response
    var pageLength = myParameters.pageLength || 10
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

    dataset = response.data
    arrayColumns = dataset ? dataset[0] : priorityColumns

    var columns = _getDatatableColumns(datatableId, arrayColumns, priorityColumns)
    var languageUrl = _getDatatableLanguage(myParameters.rootId)

    $('#' + datatableId).DataTable({
      dom: dom,
      buttons: buttons,
      responsive: true,
      pageLength: pageLength,
      language: {
        url: languageUrl
      },
      data: dataset,
      columns: columns
    })

    _addDatatableClickCallbacks(myParameters)
  }

  /**
   * Append a bootstrap form with inputs and input-group-addon
   *
   * @param {object} parameters Object with elements required to generate the html snippet:
   * - formId: valid html5 id attribute; see {@link https://www.w3.org/TR/html5/dom.html#the-id-attribute}
   * - ajax: asyncronous function call options
   * - ajax.jsend: set the [jsend]{@link https://labs.omniti.com/labs/jsend} compatibility
   * - ajax.responseDataKey: if ajax.jsend is false, set the object key contains data
   * - ajax.url: a valid url address
   * - buttons: array of objects [button0, button1, ..., buttonN]
   * - button0.name: string representing the html button label
   * - button0.class: valid html class attribute; see {@link https://www.w3.org/TR/html5/dom.html#classes}
   * - button0.id: valid html5 id attribute; see {@link https://www.w3.org/TR/html5/dom.html#the-id-attribute}
   * - button0.onClick: function callback called on button clicked
   * - datepicker: Datepicker options; see {@link https://bootstrap-datepicker.readthedocs.io/en/stable/options.html})
   * - fields: array of objects [field0, field1, ..., fieldN]
   * - field0.addon: optional array of elements
   * - field0.addon.icon: string without "fa" representing the span class (require [Font Awesome]{@link http://fontawesome.io/})
   * - field0.addon.onClick: function callback called on addon span clicked
   * - field0.class: optional string representing one or more html class attribute
   *   see {@link https://www.w3.org/TR/html5/dom.html#classes}
   * - field0.name: string representing the html input label
   *   also used as id after removing the spaces and concatenated with formId [formId-field0.name]
   * - field0.readonly: boolean - if true make field readonly
   * - field0.type: data type [string|bool|lookup|datepicker] - override schema.fields.native_type
   *   (lookup require [bootstrap-combobox]{@link https://github.com/danielfarrell/bootstrap-combobox})
   *   (datepicker require [bootstrap-datepicker]{@link https://github.com/uxsolutions/bootstrap-datepicker})
   * - modal: optional string render the form in modal with the specified title
   * - panel: string that define the title of a bootstrap panel to wrap into
   * - response: dataset response object in jsend format with optional schema (ex. PHP PDO getColumnMeta)
   * @returns {void}<br>
   *
   * ## Example 1: Form with manual data
   *
   *     $('#root').ddcForm({
   *       formId: 'form2',
   *       title: 'Form',
   *       panel: 'Form with manual data',
   *       datepicker: {
   *         autoclose: 'true',
   *         language: 'it',
   *         format: 'yyyy-mm-dd'
   *       },
   *       response: {
   *           data: [
   *               {
   *                 field1: 'value1',
   *                 field2: 'value2',
   *                 field3: true,
   *                 field4: '2017-01-01'
   *               }
   *           ],
   *           schema: {
   *               fields: [
   *                 {name: "field1", native_type: "varchar"},
   *                 {name: "field2", native_type: "varchar"},
   *                 {name: "field3", native_type: "bool"},
   *                 {name: "field4", native_type: "date"}
   *               ]
   *           }
   *       },
   *       fields: [
   *           {
   *             name: "field1",
   *             class: 'col-4',
   *             type: "lookup",
   *             data: [
   *               { value: '001', text: 'lookupform1' },
   *               { value: '002', text: 'lookupform2' }
   *             ]
   *           },
   *           {name: "field2", class: 'col-4', addon: { icon: 'reply', onClick: form1Click }},
   *           {name: "field3", class: 'col-4'},
   *           {name: "field4", class: 'col-4', type: 'datepicker'}
   *       ],
   *       buttons: [
   *           { name: "Cancel", class: "btn btn-default" },
   *           { name: "Add", class: "btn btn-primary", id: 'addForm2Send', onClick: addFormSend }
   *       ]
   *     })
   *
   *     // callback function for button
   *     function addFormSend(parameters) {
   *         console.log(parameters)
   *     }
   *
   *     // callback function for addon
   *     function form1Click(this) {
   *         var id = $(this).attr('id')
   *         console.log(id)
   *     }
   *
   * ## Example 2: Form with lookup ajax remote data
   *
   *     $('#root').ddcForm({
   *       formId: 'form1',
   *       panel: 'Form with ajax remote data',
   *       response: null,
   *       fields: [
   *         {
   *           name: "field1",
   *           type: "lookup",
   *           url: 'https://raw.githubusercontent.com/codicepulito/data-driven-components/master/test/json/jsendLookup.json'
   *         },
   *         {name: "field2", type: "string"},
   *         {name: "field3", type: "bool"}
   *       ],
   *       buttons: [
   *         { name: "Cancel", class: "btn btn-default" },
   *         { name: "Add", class: "btn btn-primary", id: 'addForm1Send', onClick: addFormSend }
   *       ]
   *     })
   *
   *     // callback function for button
   *     function addFormSend(parameters) {
   *         console.log(parameters)
   *     }
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

    var schema = _getSchema(parameters)

    if (!schema.buttons || !schema.fields) {
      _messageBox('ddcForm error', formId + ': buttons and fields parameters are mandatory.')
      return false
    }

    // empty root element if is present to avoid side effects on refresh
    _purgeNode(rootId, formId, 'row')

    rootId = 'root-' + formId
    rootId = _appendPanel(rootId, formId, myParameters.panel)

    _addFormHeader(rootId, formId, modal)
    _addInputFields(formId, response, schema)
    _addButtons(rootId, formId, schema.buttons, modal)

    if (modal) {
      $('#' + formId).modal('show')
    }

    // refresh combobox input in order to correctly display
    $('#' + formId).find('select.combobox').combobox('refresh')

    var locale = $(this).ddcLocale()
    var datepickerOptions = schema.datepicker || {autoclose: 'true', language: locale.code}
    $('#' + formId).find('input.ddc-input-datepicker').datepicker(datepickerOptions)

    //  $('.bootstraptoggle').bootstrapToggle()
  }

  /**
   * Get or set a language locale
   * @param {string} locale Optional language locale setter
   * @returns {Array} Actual country code and language locale<br>
   *
   * ## Example
   *     $('#root').ddcLocale('it')
   *
   */
  $.fn.ddcLocale = function (locale) {
    const codes = {
      'sq': 'Albanian',
      'ar': 'Arabic',
      'hy': 'Armenian',
      'az': 'Azerbaijan',
      'eu': 'Basque',
      'bg': 'Bulgarian',
      'ca': 'Catalan',
      'zh-TW': 'Chinese-traditional',
      'zh-CN': 'Chinese',
      'hr': 'Croatian',
      'cs': 'Czech',
      'da': 'Danish',
      'nl': 'Dutch',
      'en': 'English',
      'et': 'Estonian',
      'fi': 'Finnish',
      'fr': 'French',
      'gl': 'Galician',
      'de': 'German',
      'el': 'Greek',
      'he': 'Hebrew',
      'hi': 'Hindi',
      'hu': 'Hungarian',
      'is': 'Icelandic',
      'id': 'Indonesian',
      'it': 'Italian',
      'ja': 'Japanese',
      'kk': 'Kazakh',
      'ko': 'Korean',
      'lt': 'Lithuanian',
      'mk': 'Macedonian',
      'ms': 'Malay',
      'mn': 'Mongolian',
      'nb': 'Norwegian-Bokmal',
      'fa': 'Persian',
      'pl': 'Polish',
      'pt': 'Portuguese',
      'ro': 'Romanian',
      'ru': 'Russian',
      'si': 'Sinhala',
      'sk': 'Slovak',
      'sl': 'Slovenian',
      'es': 'Spanish',
      'sw': 'Swahili',
      'sv': 'Swedish',
      'ta': 'Tamil',
      'th': 'Thai',
      'tr': 'Turkish',
      'uk': 'Ukrainian',
      'uz-cyril': 'Uzbek',
      'vi': 'Vietnamese',
      'cy': 'Welsh'
    }

    locale = codes[locale] ? locale : 'en'
    var code = locale
    var language = codes[locale]
    this.data('locale', locale)

    return {code: code, language: language}
  }

  /**
   * Append a bootstrap modal with title and message
   *
   * @param {string} modalId A valid html5 id attribute; see {@link https://www.w3.org/TR/html5/dom.html#the-id-attribute}
   * @param {string} title The modal title
   * @param {string} message The modal body contains the message
   * @param {Array} buttons array of objects [button0, button1, ..., buttonN]
   * - button0.class: valid html class attribute; see {@link https://www.w3.org/TR/html5/dom.html#classes}
   * - button0.data: string value usable in callback
   * - button0.id: valid html5 id attribute; see {@link https://www.w3.org/TR/html5/dom.html#the-id-attribute}
   * - button0.name: string representing the html button label
   * - button0.onClick: function callback called on button clicked
   * @returns {void}<br>
   *
   * ## Example
   *
   *     $('#root').ddcModal('modal1', 'Modal Title', 'This is a message.');
   *     $('#modal1').modal('show');
   *
   * ## Example with buttons
   *
   *     // callback functions
   *     function addModalSend(value) {
   *       console.log(value)
   *     }
   *
   *     $('#root').ddcModal('modal1', 'Modal Title', 'This is a message.', [
   *      { name: "Cancel", class: "btn btn-default" },
   *      { name: "Add", class: "btn btn-primary", data: 'myValue', id: 'addModalSend', onClick: addModalSend }
   *     ]);
   *     $('#modal1').modal('show');
   *
   */
  $.fn.ddcModal = function (modalId, title, message, buttons) {
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

    if (buttons) {
      _addButtons(rootId, modalId, buttons, true)
    } else {
      $('#' + rootId + ' .modal-footer').append('<button type="button" class="btn btn-default" data-dismiss="modal">OK</button>')
    }
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

    // add navbar headers
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

  /**
   * Return [semver]{@link http://semver.org/} compatible version number
   * @returns {String} Actual version
   */
  $.fn.ddcVersion = function () {
    return '0.10.0'
  }
}(window.jQuery))
