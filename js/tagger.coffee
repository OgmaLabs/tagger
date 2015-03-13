tagger =
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
  filterInput: (str)->
    self = $(this)[0]
    regexp = new RegExp(str, 'i')
    $.each $("##{self.tagListContainerId}").find('ul').find('li'), (i, v) ->
      ($(this).hide() unless regexp.test($(this).find('a').find('h6').text()))
      return
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
      arr.push $(this).text().slice(0,-2)
      return
    return arr
  populateDropdown: ->
    # This function is called if there is a tag list
    self = $(this)[0]
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

    html = "<div id=#{self.tagListContainerId} class='f-dropdown medium content' data-dropdown-content aria-autoclose='false' aria-hidden='true' tabindex='-1'><input id=#{self.filterId} type='text'><ul class='inline-list' style='height: #{self.tagListContainerHeight}px; overflow:auto;'>#{html}</ul></div>"

    # Adding HTML to page
    $("##{self.hiddenInputId}").parent().append(html)
    # Linking input to dropdown
    $("##{self.buttonId}").attr('data-dropdown', self.tagListContainerId)
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
    #Listener for the input filter, and creator of tags
    $("##{self.filterId}").keyup (evt) ->
      # Adding new tags
      if evt.keyCode == 188 and !self.onlyTagList
        self.addTag($(this).val().split(",")[0], $(this).val().split(",")[0])
        $(this).val('')
      self.filterInput($(this).val())
      if $(this).val().length == 0
        $("##{self.tagListContainerId} > ul > li").show()
    # Click on the remove icon
    $(document).on 'click', "[id='tagger-remove-label']", ->
      self.toggleVisiblityTagList($(this).data('value'))
      # 1 Remove from hidden input
      self.removeLabelFromHiddenInput($(this).data('value'))
      # 2 Remove label
      $(this).parent().remove()

    return
  tagListClickEvent: ->
    # This function is called if there is a tag list
    self = $(this)[0]

    $("##{self.tagListContainerId} > ul > li").click (evt) ->
      evt.preventDefault()
      self.toggleVisiblityTagList($(this).data('value'))
      self.addTag($(this).find('a').find('h6').text(), $(this).data('value'))
    return
  toggleVisiblityTagList: (value)->
    self = $(this)[0]
    $("##{self.tagListContainerId} > ul > li[data-value=#{value}]").toggle() unless self.allowDuplicates
    return
  init: ->
    # This function checks mandatory flags and calls the necessary functions
    self = $(this)[0]
    # Check for mandatory IDs
    alert 'Some flags are missing' unless self.hiddenInputId and self.buttonId and self.tagContainerId and self.tagListContainerId and self.tagListContainerHeight
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
