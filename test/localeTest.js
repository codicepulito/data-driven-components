describe('language locale setter and getter', function () {
  it('check default language is en', function () {
    expect($('#root').ddcLocale()).toBe('en')
  })

  it('change language to it', function () {
    $('#root').ddcLocale('it')
    expect($('#root').ddcLocale()).toBe('it')
  })
})
