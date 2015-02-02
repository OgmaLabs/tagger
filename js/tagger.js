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

    if(!self.allowDuplicates && self.onlyTagList && self.noDuplicate(tag) && self.tagListChecker(tag)){
      $('#tag-content').append(html)
    }else if(!self.allowDuplicates && self.onlyTagList && self.noDuplicate(tag)){
      $('#tag-content').append(html)
    }else if(self.allowDuplicates && !self.onlyTagList && self.tagListChecker(tag)){
      $('#tag-content').append(html)
    }else{
      $('#tag-content').append(html)
    }

    return;
  },
  eventFunc: function(){
    // Recalling foundation to bind events
    $(document).foundation('reflow');

    // Click event for dropdown
    $('#'+self.tagListContainerId +' > li > a').on('click', function(){
      $('#'+self.inputId).val($(this).text());
      self.addTag($('#'+self.inputId).val())
    })

    // Remove event for labels
    $(document).on('click', '#tag-content > .label > a', function(){
      $(this).parent().remove();
    })
  },
  noDuplicate: function(tag){
    var tlis = $('#tag-content > .label');
    if(tlis.length == 0){
      return true;
    }else{
      $.each(tlis, function(index, item){
        if(item == tag){
          alert("Error!");
          console.log("Duplication")
          return false;
        }
      })
      return true;
    }
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
  tagListener: function(){
    var self = $(this)[0];
    $('#'+self.inputId).on('focus keypress', function(){
      console.log("Dem tags");
    })
  },
  init: function(){
    var self = $(this)[0];
    var html = "";
    
    /*
      Checking for mandatory flags
    */

    if(!self.inputId){ console.log("No input ID provided"); return;}
    if(self.onlyTagList && self.tagList.length == 0 && self.tagListContainerId){
      console.log("Tag list problem detected"); 
      return;
    }else{
      // Populating tag list
      $.each(self.tagList, function(index, item){
        html+= "<li><a href='#'>"+item+"</a></li>"
      })

      // Setting necessary flags
      $('#'+self.tagListContainerId).append(html);
      $('#'+self.inputId).attr('data-dropdown', self.tagListContainerId)
        .attr('aria-controls', self.tagListContainerId)
        .attr('aria-expanded', 'false');

      self.eventFunc();
    }

    self.eventFunc();
    /*
      
    */
  }
}