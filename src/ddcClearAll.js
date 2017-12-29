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
