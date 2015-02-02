$(document).ready(function(){
  // allowDuplicates: true,
  // delimiters: [9, 13, 44],
  // minTags: -1,
  // maxTags: -1,
  // onlyTagList: false,
  // inputId: null,
  // labelClass: null,
  // tagCloseIcon: 'X',
  // tagClass: 'label',
  // tagsContainerId: 'tag-content',
  // tagList: null,
  // tagListContainerId: null,
  // tagCounter: null,
  // validator: false,

  $(document).foundation();
  // Starting tag lib
  tagger.inputId = 'tagger-container';
  tagger.tagList = ['Apple', 'Oranges', 'Peanuts'];
  tagger.tagListContainerId = 'tag-drop';
  tagger.labelClass = 'secondary';
  tagger.allowDuplicates = false;
  tagger.onlyTagList = true;
  tagger.init();
})