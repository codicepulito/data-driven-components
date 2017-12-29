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
    locale = locales[locale] ? locale : 'en'
    var code = locale
    var language = locales[locale]
    this.data('locale', locale)

    return {code: code, language: language}
  }
