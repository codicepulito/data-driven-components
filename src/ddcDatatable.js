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

    if (!myParameters.buttons || !priorityColumns || !response) {
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
      buttons: myParameters.buttons,
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
