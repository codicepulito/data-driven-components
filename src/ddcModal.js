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
