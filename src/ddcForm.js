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

  function _setDatepickerOptions (selector, datepicker) {
    var locale = $(this).ddcLocale()
    var datepickerOptions = datepicker || {autoclose: 'true', language: locale.code}
    $('#' + selector).find('input.ddc-input-datepicker').datepicker(datepickerOptions)
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
      _messageBox('ddcForm error', myParameters.formId + ': buttons and fields parameters are mandatory.')
      return false
    }

    // empty root element if is present to avoid side effects on refresh
    _purgeNode(rootId, myParameters.formId, 'row')

    rootId = 'root-' + myParameters.formId
    rootId = _appendPanel(rootId, myParameters.formId, myParameters.panel)

    _addFormHeader(rootId, myParameters.formId, myParameters.modal)
    _addInputFields(myParameters.formId, response, schema)
    _addButtons(rootId, myParameters.formId, schema.buttons, myParameters.modal)

    if (myParameters.modal) {
      $('#' + myParameters.formId).modal('show')
    }

    // refresh combobox input in order to correctly display
    $('#' + myParameters.formId).find('select.combobox').combobox('refresh')

    _setDatepickerOptions(myParameters.formId, schema.datepicker)

    //  $('.bootstraptoggle').bootstrapToggle()
  }
