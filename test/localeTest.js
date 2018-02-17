describe('language locale setter and getter', function () {
  it('check default language is en', function () {
    var locale = $('#root').ddcLocale()
    expect(locale.code).toBe('en')
    expect(locale.language).toBe('English')
  })

  it('change language to it', function () {
    var locale = $('#root').ddcLocale('it')
    expect(locale.code).toBe('it')
    expect(locale.language).toBe('Italian')
  })
  
  it('change language to non existent', function () {
    var locale = $('#root').ddcLocale('zz')
    expect(locale.code).toBe('en')
    expect(locale.language).toBe('English')
  })
})

describe('version', function () {
  it('check', function () {
    var version = $('#root').ddcVersion()
    expect(version).toBe('0.10.3')
  })
})
