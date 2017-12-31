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
      value['ro'] = _isReadonly(schema, value)
      var type = value.type || value.native_type || ''
      value['tag'] = (response && response.hasOwnProperty('data')) ? response.data[0][value.name] : (value.value || '')

      if (type === 'datatable') {
        $('#' + formId).ddcDatatable(value.datatable)
      } else {
        inputGroup = _addInputFieldType(type, formId, value)
      }

      if (value.addon) {
        inputGroup += '<span class="input-group-addon"><a href="#" id="' + formId + '-' + value.name + '-' +
          value.addon.icon + '"><i class="fas fa-' + value.addon.icon + '"></i></a></span>\n'
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

  function _addInputFieldTypeBool (formId, value) {
    var checked = (value.tag === true || value.tag === 't') ? ' checked' : ''
    return '<input id="' + formId + '-' + value.name + '" type="checkbox"' + value.ro + checked + '>\n'
  }

  function _getInputFieldType (formId, value, type) {
    var tag = '<input id="' + formId + '-' + value.name + '" type="' + type + '" class="form-control" value="' + value.tag + '"' + value.ro + '>'
    return tag
  }

  function _addInputFieldTypeDatepicker (formId, value) {
    return '<input id="' + formId + '-' + value.name + '" type="text" class="form-control ddc-input-datepicker" value="' + value.tag + '"' + value.ro + '>'
  }

  function _addInputFieldTypeLookup (formId, value) {
    var inputGroup = '<select id="' + formId + '-' + value.name + '" name="normal" class="combobox input-large form-control">\n'
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
      var selected = (value.tag).toString() === (lookupValue.value).toString() ? ' selected' : ''
      inputGroup += '<option value="' + lookupValue.value + '"' + selected + '>' + lookupValue.text + '</option>'
    })
    inputGroup += '</select>'
    return inputGroup
  }

  function _addInputFieldType (type, formId, value) {
    value['tag'] = value.tag || ''
    var inputGroup = (type === 'hidden') ? '' : '<span class="input-group-addon">' + value.name + '</span>\n'
    switch (type) {
      case 'bool':
      case 'checkbox':
        inputGroup += _addInputFieldTypeBool(formId, value)
        break
      case 'date':
      case 'hidden':
        inputGroup += _getInputFieldType(formId, value, type)
        break
      case 'datepicker':
        inputGroup += _addInputFieldTypeDatepicker(formId, value)
        break
      case 'lookup':
        // bootstrap-combobox
        inputGroup += _addInputFieldTypeLookup(formId, value)
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
        inputGroup += _getInputFieldType(formId, value, 'text')
        break
    }
    return inputGroup
  }
