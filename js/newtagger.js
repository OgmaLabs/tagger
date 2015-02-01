tagger = {
  allowDuplicates: true,
  delimiters: [9, 13, 44],
  minTags: -1,
  maxTags: -1,
  onlyTagList: false,
  inputId: null,
  tagCloseIcon: 'X',
  tagClass: 'label',
  tagsContainerId: 'tag-content',
  tagList: null,
  validator: null,
  addTag: function(tag, tagList){
    // $()
  },
  tagListener: function(){
    var self = $(this)[0];
    $('#'+self.inputId).on('focus keypress', function(){
      console.log("Dem tags");
    })
  },
  init: function(){
    var self = $(this)[0];
    var html;
    /*
      Checking for mandatory flags
    */
    console.log(self)

    if(!self.inputId){ console.log("No input ID provided")}
    if(self.onlyTagList && self.tagList.length == 0){
      console.log("No tag list provided")
    }else{
      html+= "<ul id='tag-drop' class='f-dropdown' data-dropdown-content aria-hidden='true' tabindex='-1'>";
      $.each(self.tagList, function(index, item){
        html+= "<li><a href='#'>"+item+"</a></li>"
      })
    }
    
    // $('#'+self.inputId).attr('data-dropdown', 'tag-drop')
    //   .addClass('f-dropdown')
    //   .attr('aria-hidden', 'true')
    //   .attr('tab-index', '-1')
    //   .append(html);
  }
}