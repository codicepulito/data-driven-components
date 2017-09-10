describe('create modal component on non empty element', function() {
  
  beforeEach(function(){
    $(document.body).empty()
    $(document.body).append('<div id="root"><div id="root-modal1"></div></div>');
  });

  it("check main element is present", function(){
    $('#root').dccModal('modal1', 'title', 'message');
    expect($('#root').find('#root-modal1').length).toBe(1)
  });
    
});

describe('create modal component', function() {
  
  beforeEach(function(){
    $(document.body).empty()
    $(document.body).append('<div id="root"></div>');
  });

  it("check main element is present", function(){
    $('#root').dccModal('modal1', 'title', 'message');
    expect($('#root').find('#root-modal1 .modal-title').html()).toBe('title')
    expect($('#root').find('#root-modal1 #modal1-body').html()).toBe('message')
  });
    
});