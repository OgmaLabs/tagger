taggerJS =
  init: (options) ->
    options = $.extend {}, taggerJS.default_options, options
    main = $(this)

    main.data 'tagger',
      options: options
    # TO DO: Check flags
    data = main.data('tagger').options
    alert 'Some flags are missing' unless data.hiddenInputId and data.buttonId and data.tagContainerId and data.tagListContainerId and data.tagListContainerHeight
    if data.tagList
      taggerJS.populateDropdown.apply main
      $(document).foundation('dropdown', 'reflow');
      taggerJS.tagListClickEvent.apply main

    if data.tagListStart
      if data.tagListFormat
        idPos = $.inArray 'id', data.tagListFormat
        namePos = $.inArray 'name', data.tagListFormat
        for tag in data.tagListStart
          taggerJS.addTag.apply main, tag
          data.indexableTagList.push tag[namePos]
      else
        for tag in data.tagListStart
          taggerJS.addTag.apply main, tag
          data.indexableTagList.push tag

    taggerJS.setTagListeners.apply main
  addTag: (item, value)->
    main = $(this)
    data = main.data('tagger').options
    flag = true
    html = "<span class='label #{data.labelClass}'>#{value} <a id='tagger-remove-label' data-value=#{item || value} href='#'>#{data.tagCloseIcon}</a></span>"

    if !data.allowDuplicates and !data.onlyTagList
      flag = taggerJS.noDuplicate.apply main, [value]
    if !data.allowDuplicates and data.onlyTagList
      flag = taggerJS.noDuplicate.apply(main, [value]) and taggerJS.isInTagList.apply(main, [value])
    if data.allowDuplicates and taggerJS.onlyTagList
      flag = taggerJS.isInTagList.apply main, [value]

    $("##{data.tagContainerId}").append(html) if flag
    if  $("##{data.hiddenInputId}").val()
      $("##{data.hiddenInputId}").val($("##{data.hiddenInputId}").val()+",#{item || value}")
    else
      $("##{data.hiddenInputId}").val(item || value)

  filterInput: (str) ->
    main = $(this)
    data = main.data('tagger').options
    regexp = new RegExp(str, 'i')
    $.each $("##{data.tagListContainerId}").find('ul').find('li'), (i, v) ->
      ($(this).hide() unless regexp.test($(this).find('a').find('h6').text()))
      return

  isInTagList: (value) ->
    main = $(this)
    data = main.data('tagger').options
    $.inArray(value, data.indexableTagList) >= 0

  noDuplicate: (value)->
    main = $(this)
    data = main.data('tagger').options
    arr = []
    $.each $("##{data.tagContainerId} > span"), (i, val) ->
      arr.push($(this).text().slice(0,-2))
      return
    $.inArray(value, arr) == -1

  populateDropdown: ->
    main = $(this)
    data = main.data('tagger').options
    html = ''
    if data.tagListFormat
      idPos = $.inArray 'id', data.tagListFormat
      namePos = $.inArray 'name', data.tagListFormat
      $.each data.tagList, (index, item) ->
        html += "<li data-value=#{item[idPos]}><a href='javascript:void(0)'><h6>#{item[namePos]}</h6></a></li>"
        data.indexableTagList.push(item[namePos])
        return
    else
      $.each data.tagList, (index, item) ->
        html += "<li data-value=#{item}><a href='javascript:void(0)'><h6>#{item}</h6></a></li>"
        data.indexableTagList.push(item)
        return

    html = "<div id=#{data.tagListContainerId} class='f-dropdown medium content' data-dropdown-content aria-autoclose='false' aria-hidden='true' tabindex='-1'><input id=#{data.filterId} type='text'><ul class='inline-list' style='height: #{data.tagListContainerHeight}px; overflow:auto;'>#{html}</ul></div>"

    # Adding HTML to page and linking dropdown to button
    $("##{data.hiddenInputId}").parent().append(html)
    $("##{data.buttonId}").attr('data-dropdown', data.tagListContainerId)
      .attr('aria-controls', data.tagListContainerId)
      .attr('aria-expanded', 'false')

  removeLabelFromHiddenInput: (value)->
    main = $(this)
    data = main.data('tagger').options
    arr = $("##{data.hiddenInputId}").val().split(",")
    i = arr.indexOf("#{value}")
    arr.splice(i,1)
    $("##{data.hiddenInputId}").val(arr.join())

  setTagListeners: (self)->
    main = $(this)
    data = main.data('tagger').options
    #Listener for the input filter, and creator of tags
    $("##{data.filterId}").keyup (evt) ->
      if evt.keyCode == 188 and !data.onlyTagList
        taggerJS.addTag.apply main, [$(this).val().split(",")[0], $(this).val().split(",")[0]]
        $(this).val('')
      taggerJS.filterInput.apply main, [$(this).val()]
      if $(this).val().length == 0
        $("##{data.tagListContainerId} > ul > li").show()
    # Click on the remove icon
    $(document).on 'click', "[id='tagger-remove-label']", ->
      taggerJS.toggleVisiblityTagList.apply main, [$(this).data('value')]
      # 1 Remove from hidden input
      taggerJS.removeLabelFromHiddenInput.apply main, [$(this).data('value')]
      # 2 Remove label
      $(this).parent().remove()

  tagListClickEvent: ->
    # This function is called if there is a tag list
    main = $(this)
    data = main.data('tagger').options
    $("##{data.tagListContainerId} > ul > li").click (evt) ->
      evt.preventDefault()
      taggerJS.toggleVisiblityTagList.apply main, [$(this).data('value')]
      taggerJS.addTag.apply main, [$(this).data('value'), $(this).find('a').find('h6').text()]

  toggleVisiblityTagList: (value)->
    main = $(this)
    data = main.data('tagger').options
    $("##{data.tagListContainerId} > ul > li[data-value=#{value}]").toggle() unless data.allowDuplicates

  default_options:
    allowDuplicates: true
    buttonId: null
    filterId: 'tagger-filter'
    hiddenInputId: null
    indexableTagList: []
    labelClass: ''
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
