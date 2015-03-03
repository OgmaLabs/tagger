  tagger =
    allowDuplicates: true
    hiddenInputId: null
    inputId: null
    indexableTagList: []
    labelClass: 'warning'
    onlyTagList: false
    tagCloseIcon: 'X'
    tagContainerId: null
    tagList: null
    tagListContainerId: null
    tagListFormat: null
    tagListStart: null
    # ALL THE FUNCS
    addTag: (tag, value) ->
      self = $(this)[0]
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
      return
    noDuplicate: (tag) ->
      self = $(this)[0]
      return $.inArray(tag, self.labelToArray($("##{self.tagContainerId} > span"))) == -1
    isInTagList: (tag, value) ->
      self = $(this)[0]
      return $.inArray(tag, self.indexableTagList) >= 0
    labelToArray: (selector) ->
      arr = []
      $.each selector, (i, val) ->
        arr.push $(this).text().split(' ')[0]
        return
      return arr
    tagListClickEvent: ->
      # This function is called if there is a tag list
      self = $(this)[0]

      $("##{self.tagListContainerId} > li").click (evt) ->
        evt.preventDefault()
        self.addTag($(this).find('a').text(), $(this).data('value'))
        return
    populateDropdown: ->
      # This function is called if there is a tag list
      self = $(this)[0]
      html = ''
      if self.tagListFormat
        idPos = $.inArray 'id', self.tagListFormat
        namePos = $.inArray 'name', self.tagListFormat
        $.each self.tagList, (index, item) ->
          html += "<li data-value=#{item[idPos]}><a href='javascript:void(0)'>#{item[namePos]}</a></li>"
          self.indexableTagList.push(item[namePos])
          return
      else
        $.each self.tagList, (index, item) ->
          html += "<li data-value=#{item}><a href='javascript:void(0)'>#{item}</a></li>"
          self.indexableTagList.push(item)
          return

      html = "<ul id=#{self.tagListContainerId} class='f-dropdown' data-dropdown-content aria-hidden='true' tabindex='-1'>#{html}</ul>"

      # Adding HTML to page
      $("##{self.hiddenInputId}").parent().append(html)
      # Linking input to dropdown
      $("##{self.inputId}").attr('data-dropdown', self.tagListContainerId)
        .attr('aria-controls', self.tagListContainerId)
        .attr('aria-expanded', 'false')

      return
    removeLabelFromHiddenInput: (value)->
      self = $(this)[0]
      arr = $("##{self.hiddenInputId}").val().split(",")
      i = arr.indexOf("#{value}")
      arr.splice(i,1)
      $("##{self.hiddenInputId}").val(arr.join())
      return
    setTagListeners: ->
      self = $(this)[0]
      # Click on the remove icon
      $(document).on 'click', "[id='tagger-remove-label']", ->
        # 1 Remove from hidden input
        self.removeLabelFromHiddenInput($(this).data('value'))
        # 2 Remove label
        $(this).parent().remove()
        return
      return
    init: ->
      # This function checks mandatory flags and calls the necessary functions
      self = $(this)[0]
      # Check for mandatory IDs

      alert 'Some flags are missing' unless self.hiddenInputId and self.inputId and self.tagContainerId and self.tagListContainerId

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

      return
