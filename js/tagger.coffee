  taggerJS =
    addTag: (tag, value) ->
      self = $(this)
      flag = true
      html = "<span class='label #{self.labelClass}'>#{tag} <a id='tagger-remove-label' data-value=#{value || tag} href='#'>#{self.tagCloseIcon}</a></span>"

      if !self.allowDuplicates and !self.onlyTagList
        flag = self.noDuplicate(tag)
      if !self.allowDuplicates and self.onlyTagList
        flag = self.noDuplicate(tag) and self.isInTagList(tag, value)
      if self.allowDuplicates and self.onlyTagList
        flag = self.isInTagList(tag, value)

      $("##{self.tagContainerId}").append(html) if flag
      if  $("##{self.hiddenInputId}").val()
        $("##{self.hiddenInputId}").val($("##{self.hiddenInputId}").val()+",#{value}")
      else
        $("##{self.hiddenInputId}").val(value || tag)
      
    noDuplicate: (tag) ->
      self = $(this)
      $.inArray(tag, self.labelToArray($("##{self.tagContainerId} > span"))) == -1
    isInTagList: (tag, value) ->
      self = $(this)
      $.inArray(tag, self.indexableTagList) >= 0

    labelToArray: (selector) ->
      arr = []
      $.each selector, (i, val) ->
        arr.push $(this).text().slice(0,-2)
        return
      arr

    tagListClickEvent: ->
      # This function is called if there is a tag list
      self = $(this)

      $("##{self.tagListContainerId} > ul > li").click (evt) ->
        evt.preventDefault()
        self.toggleVisiblityTagList($(this).data('value'))
        self.addTag($(this).find('a').find('h6').text(), $(this).data('value'))

    populateDropdown: ->
      # This function is called if there is a tag list
      self = $(this)
      html = ''
      if self.tagListFormat
        idPos = $.inArray 'id', self.tagListFormat
        namePos = $.inArray 'name', self.tagListFormat
        $.each self.tagList, (index, item) ->
          html += "<li data-value=#{item[idPos]}><a href='javascript:void(0)'><h6>#{item[namePos]}</h6></a></li>"
          self.indexableTagList.push(item[namePos])
          return
      else
        $.each self.tagList, (index, item) ->
          html += "<li data-value=#{item}><a href='javascript:void(0)'><h6>#{item}</h6></a></li>"
          self.indexableTagList.push(item)
          return

      html = "<div id=#{self.tagListContainerId} class='f-dropdown medium content' data-dropdown-content aria-hidden='true' tabindex='-1'><ul class='inline-list' style='height: #{self.tagListContainerHeight}px; overflow:auto;'>#{html}</ul></div>"

      # Adding HTML to page
      $("##{self.hiddenInputId}").parent().append(html)
      # Linking input to dropdown
      $("##{self.inputId}").attr('data-dropdown', self.tagListContainerId)
        .attr('aria-controls', self.tagListContainerId)
        .attr('aria-expanded', 'false')

    removeLabelFromHiddenInput: (value)->
      self = $(this)
      arr = $("##{self.hiddenInputId}").val().split(",")
      i = arr.indexOf("#{value}")
      arr.splice(i,1)
      $("##{self.hiddenInputId}").val(arr.join())
    
    setTagListeners: ->
      self = $(this)
      # Click on the remove icon
      $(document).on 'click', "[id='tagger-remove-label']", ->
        self.toggleVisiblityTagList($(this).data('value'))
        # 1 Remove from hidden input
        self.removeLabelFromHiddenInput($(this).data('value'))
        # 2 Remove label
        $(this).parent().remove()

    toggleVisiblityTagList: (value)->
      self = $(this)
      $("##{self.tagListContainerId} > ul > li[data-value=#{value}]").toggle() unless self.allowDuplicates

    init: (options)->
      options = $.extend {}, drilldownJS.default_options, options
      # Save data to main
      main.data 'tagger',
      	options: options,
      # This function checks mandatory flags and calls the necessary functions
      self = $(this)
      # Check for mandatory IDs
      alert 'Some flags are missing' unless self.hiddenInputId and self.inputId and self.tagContainerId and self.tagListContainerId and self.tagListContainerHeight
      # Check if there is a tag list
      if self.tagList
        self.populateDropdown()
        # Foundation reflow here
        $(document).foundation('reflow');
        self.tagListClickEvent()

      # Check if there is some tags already selected
      if self.tagListStart
        # If you have a more complex tag it must pass here
        if self.tagListFormat
          idPos = $.inArray 'id', self.tagListFormat
          namePos = $.inArray 'name', self.tagListFormat
          $.each self.tagListStart, (index, item) ->
            self.addTag(item[namePos], item[idPos])
            self.indexableTagList.push(item[namePos])
            return
        else
          $.each self.tagListStart, (index, item) ->
            self.addTag(item)
            self.indexableTagList.push(item)
            return

      # Add listeners
      self.setTagListeners();

    default_options:
      allowDuplicates: true
      hiddenInputId: null
      inputId: null
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
  if tagger[args] #Calling a function
  	tagger[args].apply this, Array::slice.call(arguments, 1)
  else
  	tagger.init.apply this, arguments if typeof args is "object" or not args
