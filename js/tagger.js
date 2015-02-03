tagger = {
  allowDuplicates: true,
  delimiters: [9, 13, 44],
  minTags: -1,
  maxTags: -1,
  onlyTagList: false,
  inputId: null,
  labelClass: null,
  tagCloseIcon: 'X',
  tagClass: 'label',
  tagsContainerId: 'tag-content',
  tagList: null,
  tagListContainerId: null,
  tagCounter: null,
  validator: false,
  addTag: function(tag){
    var self = $(this)[0];
    var html = "<span class='label "+self.labelClass+"'>"+tag+" <a href='#'>"+self.tagCloseIcon+"</a></span>";
    console.log(tag)

    if(self.allowDuplicates && self.onlyTagList && self.tagListChecker(tag)){
      $('#tag-content').append(html);
    }

    if(self.allowDuplicates && !self.onlyTagList){
      $('#tag-content').append(html);
    }

    if(!self.allowDuplicates && self.onlyTagList && self.noDuplicate(tag) && self.tagListChecker(tag)){
      $('#tag-content').append(html);
    }

    if(!self.allowDuplicates && !self.onlyTagList && self.noDuplicate(tag)){
      $('#tag-content').append(html);
    }

    // Adding it to hidden input
    if(!$('#tagger-result').val()){
      $('#tagger-result').val(tag);
    }else{
      $('#tagger-result').val($('#tagger-result').val()+","+tag);
    }

    $('#'+self.inputId).val('')

    return;
  },
  eventFunc: function(){
    var self = $(this)[0];
    // Recalling foundation to bind events
    $(document).foundation('reflow');

    if(self.tagList){
      $('#'+self.tagListContainerId +' > li > a').on('click', function(){
        $('#'+self.inputId).val($(this).text());
        self.addTag($('#'+self.inputId).val());
        $('#'+self.inputId).val('');
      })
    }

    $('#'+self.inputId).on('keyup',function(e){
      e.preventDefault();
      if(e.which == 188){
        self.addTag($(this).val().slice(0,-1))
      }
      if(e.which == 8 && $(this).val().length == 0){
        self.removeTag()
      }
    })

    // Remove event for labels
    $(document).on('click', '#tag-content > .label > a', function(){
      self.removeTag($(this).parent())
    })
  },
  justText: function(elem){
    return elem.clone().children().remove().end().text();
  },
  noDuplicate: function(tag){
    var tlis = [];
    $.each($('#tag-content > .label'),function(index,item){tlis.push(tagger.justText($(this)).slice(0,-1))});
    if(tlis.length == 0){
      return true;
    }else{
      return ($.inArray(tag, tlis) == -1);
    }
  },
  removeTag: function(elem){
    // Remove the last tag to be added
    if(!elem){
      elem = $('#tag-content > .label:eq(-1)');
    }
    // TO DO check if MINTAG
    var self = $(this)[0];
    var lname = self.justText(elem);
    elem.remove();
  },
  tagListChecker: function(tag){
    var self = $(this)[0];
    if($.inArray(tag, self.tagList) >= 0){
      return true;
    }else{
      alert("Error!");
      console.log("Not in list")
      return false;
    }
  },
  init: function(){
    var self = $(this)[0];
    var html = "";
    self.tagCounter = 0;
    
    /*
      Checking for mandatory flags
    */

    if(!self.inputId){ console.log("No input ID provided"); return;}
    if(self.onlyTagList && self.tagList.length == 0 && self.tagListContainerId){
      console.log("Tag list problem detected"); 
    }else if(self.tagList){
      // Populating tag list
      $.each(self.tagList, function(index, item){
        html+= "<li><a href='#'>"+item+"</a></li>"
      })

      // Setting necessary flags
      $('#'+self.tagListContainerId).append(html);
      $('#'+self.inputId).attr('data-dropdown', self.tagListContainerId)
        .attr('aria-controls', self.tagListContainerId)
        .attr('aria-expanded', 'false');
    }
    self.eventFunc();
  }
}