taggerJS =
  init: (options) ->
    options = $.extend {}, taggerJS.default_options, options
    main = $(this)

    main.data 'tagger',
      options: options
    # TO DO: Check flags
    self = main.data('tagger').options
    alert 'Some flags are missing' unless self.hiddenInputId and self.buttonId and self.tagContainerId and self.tagListContainerId and self.tagListContainerHeight

    if self.tagList
      taggerJS.populateDropdown.apply main
      $(document).foundation('dropdown', 'reflow');
      taggerJS.tagListClickEvent.apply main
    # Check if there is some tags already selected
    if self.tagListStart
      if self.tagListFormat
        idPos = $.inArray 'id', self.tagListFormat
        namePos = $.inArray 'name', self.tagListFormat
        for tag in self.tagListStart
          taggerJS.addTag.apply main, tag
          self.indexableTagList.push tag[namePos]
      else
        for tag in self.tagListStart
          taggerJS.addTag.apply main, tag
          self.indexableTagList.push tag

    taggerJS.setTagListeners
  addTag: (item, value)->
    console.log "#{item} #{value}"

  populateDropdown: ->
    # This function is called if there is a tag list
    main = $(this)
    self = main.data('tagger').options

  setTagListeners:  ->
    console.log "TagListeners"
  tagListClickEvent: ->
    console.log "TagList"

  default_options:
    allowDuplicates: true
    buttonId: null
    filterId: 'tagger-filter'
    hiddenInputId: null
    indexableTagList: []
    labelClass: null
    onlyTagList: false
    tagCloseIcon: 'X'
    tagContainerId: null
    tagList: null
    tagListContainerId: null
    tagListContainerHeight: 300
    tagListFormat: null
    tagListStart: null

$.fn.tagger = (args) ->
  if taggerJS[args] #Calling a function
    taggerJS[args].apply this, Array::slice.call(arguments, 1)
  else
    taggerJS.init.apply this, arguments if typeof args is "object" or not args
