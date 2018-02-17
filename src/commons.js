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
  const locales = {
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
          _doAjaxCallback(response, options, callback, myParameters)
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

  function _doAjaxCallback (response, options, callback, parameters) {
    if (options.jsend && response.status !== 'success') {
      _messageBox('Ajax response', response.message)
    } else if (options.jsend && response.status === 'success') {
      parameters.response = response
    } else {
      parameters.response['data'] = response[options.responseDataKey]
    }
    if (typeof callback === 'function') {
      callback(parameters)
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
   * Return [semver]{@link http://semver.org/} compatible version number
   * @returns {String} Actual version
   */
  $.fn.ddcVersion = function () {
    return '0.10.3'
  }
