taggerJS = {

  init: (options) ->
    # This function checks mandatory flags and calls the necessary functions
    self = $(this)
    options = $.extend {}, taggerJS.default_options, options
    
    self.data 'tagger',
		options: options
    # Check for mandatory IDs
    alert 'Some flags are missing' unless taggerJS.hiddenInputId and taggerJS.buttonId and taggerJS.tagContainerId and taggerJS.tagListContainerId and taggerJS.tagListContainerHeight
    # Check if there is a tag list
    if taggerJS.tagList
      taggerJS.populateDropdown()
      # Foundation reflow here
      $(document).foundation('reflow');
      taggerJS.tagListClickEvent()

    # Check if there is some tags already selected
    if taggerJS.tagListStart
      # If you have a more complex tag it must pass here
      if taggerJS.tagListFormat
        idPos = $.inArray 'id', taggerJS.tagListFormat
        namePos = $.inArray 'name', taggerJS.tagListFormat
        $.each taggerJS.tagListStart, (index, item) ->
          taggerJS.addTag(item[namePos], item[idPos])
          taggerJS.indexableTagList.push(item[namePos])
          return
      else
        $.each taggerJS.tagListStart, (index, item) ->
          taggerJS.addTag(item)
          taggerJS.indexableTagList.push(item)
          return
    # Add listeners
    taggerJS.setTagListeners();
  addTag: (tag, value) ->
    self = $(this)
    flag = true
    html = "<span class='label #{taggerJS.labelClass}'>#{tag} <a id='tagger-remove-label' data-value=#{value || tag} href='#'>#{taggerJS.tagCloseIcon}</a></span>"

    if !taggerJS.allowDuplicates and !taggerJS.onlyTagList
      flag = taggerJS.noDuplicate(tag)
    if !taggerJS.allowDuplicates and taggerJS.onlyTagList
      flag = taggerJS.noDuplicate(tag) and taggerJS.isInTagList(tag, value)
    if taggerJS.allowDuplicates and taggerJS.onlyTagList
      flag = taggerJS.isInTagList(tag, value)

    $("##{taggerJS.tagContainerId}").append(html) if flag
    if  $("##{taggerJS.hiddenInputId}").val()
      $("##{taggerJS.hiddenInputId}").val($("##{taggerJS.hiddenInputId}").val()+",#{value}")
    else
      $("##{taggerJS.hiddenInputId}").val(value || tag)
    return
  filterInput: (str)->
    self = $(this)
    regexp = new RegExp(str, 'i')
    $.each $("##{taggerJS.tagListContainerId}").find('ul').find('li'), (i, v) ->
      ($(this).hide() unless regexp.test($(this).find('a').find('h6').text()))
      return
    return
  noDuplicate: (tag) ->
    self = $(this)
    return $.inArray(tag, taggerJS.labelToArray($("##{taggerJS.tagContainerId} > span"))) == -1
  isInTagList: (tag, value) ->
    self = $(this)
    return $.inArray(tag, taggerJS.indexableTagList) >= 0
  labelToArray: (selector) ->
    arr = []
    $.each selector, (i, val) ->
      arr.push $(this).text().slice(0,-2)
      return
    return arr
  populateDropdown: ->
    # This function is called if there is a tag list
    self = $(this)
    html = ''
    if taggerJS.tagListFormat
      idPos = $.inArray 'id', taggerJS.tagListFormat
      namePos = $.inArray 'name', taggerJS.tagListFormat
      $.each taggerJS.tagList, (index, item) ->
        html += "<li data-value=#{item[idPos]}><a href='javascript:void(0)'><h6>#{item[namePos]}</h6></a></li>"
        taggerJS.indexableTagList.push(item[namePos])
        return
    else
      $.each taggerJS.tagList, (index, item) ->
        html += "<li data-value=#{item}><a href='javascript:void(0)'><h6>#{item}</h6></a></li>"
        taggerJS.indexableTagList.push(item)
        return

    html = "<div id=#{taggerJS.tagListContainerId} class='f-dropdown medium content' data-dropdown-content aria-autoclose='false' aria-hidden='true' tabindex='-1'><input id=#{taggerJS.filterId} type='text'><ul class='inline-list' style='height: #{taggerJS.tagListContainerHeight}px; overflow:auto;'>#{html}</ul></div>"

    # Adding HTML to page
    $("##{taggerJS.hiddenInputId}").parent().append(html)
    # Linking input to dropdown
    $("##{taggerJS.buttonId}").attr('data-dropdown', taggerJS.tagListContainerId)
      .attr('aria-controls', taggerJS.tagListContainerId)
      .attr('aria-expanded', 'false')

    return
  removeLabelFromHiddenInput: (value)->
    self = $(this)
    arr = $("##{taggerJS.hiddenInputId}").val().split(",")
    i = arr.indexOf("#{value}")
    arr.splice(i,1)
    $("##{taggerJS.hiddenInputId}").val(arr.join())
    return
  setTagListeners: ->
    self = $(this)
    #Listener for the input filter, and creator of tags
    $("##{taggerJS.filterId}").keyup (evt) ->
      # Adding new tags
      if evt.keyCode == 188 and !taggerJS.onlyTagList
        taggerJS.addTag($(this).val().split(",")[0], $(this).val().split(",")[0])
        $(this).val('')
      taggerJS.filterInput($(this).val())
      if $(this).val().length == 0
        $("##{taggerJS.tagListContainerId} > ul > li").show()
    # Click on the remove icon
    $(document).on 'click', "[id='tagger-remove-label']", ->
      taggerJS.toggleVisiblityTagList($(this).data('value'))
      # 1 Remove from hidden input
      taggerJS.removeLabelFromHiddenInput($(this).data('value'))
      # 2 Remove label
      $(this).parent().remove()

    return
  tagListClickEvent: ->
    # This function is called if there is a tag list
    self = $(this)

    $("##{taggerJS.tagListContainerId} > ul > li").click (evt) ->
      evt.preventDefault()
      taggerJS.toggleVisiblityTagList($(this).data('value'))
      taggerJS.addTag($(this).find('a').find('h6').text(), $(this).data('value'))
    return
  toggleVisiblityTagList: (value)->
    self = $(this)
    $("##{taggerJS.tagListContainerId} > ul > li[data-value=#{value}]").toggle() unless taggerJS.allowDuplicates
    return

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
}
$.fn.tagger = (args) ->
	if taggerJS[args] #Calling a function
		taggerJS[args].apply this, Array::slice.call(arguments, 1)
	else
		taggerJS.init.apply this, arguments if typeof args is "object" or not args
