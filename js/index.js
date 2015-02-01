$(document).ready(function(){
  //  allowDuplicates: true,
  //  data: null,
  //  delimiters: [9, 13, 44],
  //  minTags: -1,
  //  maxTags: -1,
  //  onlyTagList: false,
  //  tagCloseIcon: 'X',
  //  tagClass: 'label',
  //  tagsContainer: null,
  //  tagList: null,
  //  validator: null
  $('#tagger-container').tagger({
    allowDuplicates: false,
    data: ['Apple', 'Oranges', 'Peanuts']
    onlyTagList: true
  })
})