var taggerJS;

taggerJS = {
  init: function(options) {
    var data, idPos, main, namePos, tag, _i, _j, _len, _len1, _ref, _ref1;
    options = $.extend({}, taggerJS.default_options, options);
    main = $(this);
    main.data('tagger', {
      options: options
    });
    data = main.data('tagger').options;
    if (!(data.hiddenInputId && data.buttonId && data.tagContainerId && data.tagListContainerId && data.tagListContainerHeight)) {
      alert('Some flags are missing');
    }
    if (data.tagList) {
      taggerJS.populateDropdown.apply(main);
      $(document).foundation('dropdown', 'reflow');
      taggerJS.tagListClickEvent.apply(main);
    }
    if (data.tagListStart) {
      if (data.tagListFormat) {
        idPos = $.inArray('id', data.tagListFormat);
        namePos = $.inArray('name', data.tagListFormat);
        _ref = data.tagListStart;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tag = _ref[_i];
          taggerJS.addTag.apply(main, tag);
          data.indexableTagList.push(tag[namePos]);
        }
      } else {
        _ref1 = data.tagListStart;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          tag = _ref1[_j];
          taggerJS.addTag.apply(main, tag);
          data.indexableTagList.push(tag);
        }
      }
    }
    return taggerJS.setTagListeners.apply(main);
  },
  addTag: function(item, value) {
    var data, flag, html, main;
    main = $(this);
    data = main.data('tagger').options;
    flag = true;
    html = "<span class='label " + data.labelClass + "'>" + value + " <a id='tagger-remove-label' data-value=" + (item || value) + " href='#'>" + data.tagCloseIcon + "</a></span>";
    if (!data.allowDuplicates && !data.onlyTagList) {
      flag = taggerJS.noDuplicate.apply(main, [value]);
    }
    if (!data.allowDuplicates && data.onlyTagList) {
      flag = taggerJS.noDuplicate.apply(main, [value]) && taggerJS.isInTagList.apply(main, [value]);
    }
    if (data.allowDuplicates && taggerJS.onlyTagList) {
      flag = taggerJS.isInTagList.apply(main, [value]);
    }
    if (flag) {
      $("#" + data.tagContainerId).append(html);
    }
    if ($("#" + data.hiddenInputId).val()) {
      return $("#" + data.hiddenInputId).val($("#" + data.hiddenInputId).val() + ("," + (item || value)));
    } else {
      return $("#" + data.hiddenInputId).val(item || value);
    }
  },
  filterInput: function(str) {
    var data, main, regexp;
    main = $(this);
    data = main.data('tagger').options;
    regexp = new RegExp(str, 'i');
    return $.each($("#" + data.tagListContainerId).find('ul').find('li'), function(i, v) {
      if (!regexp.test($(this).find('a').find('h6').text())) {
        $(this).hide();
      }
    });
  },
  isInTagList: function(value) {
    var data, main;
    main = $(this);
    data = main.data('tagger').options;
    return $.inArray(value, data.indexableTagList) >= 0;
  },
  noDuplicate: function(value) {
    var arr, data, main;
    main = $(this);
    data = main.data('tagger').options;
    arr = [];
    $.each($("#" + data.tagContainerId + " > span"), function(i, val) {
      arr.push($(this).text().slice(0, -2));
    });
    return $.inArray(value, arr) === -1;
  },
  populateDropdown: function() {
    var data, html, idPos, main, namePos;
    main = $(this);
    data = main.data('tagger').options;
    html = '';
    if (data.tagListFormat) {
      idPos = $.inArray('id', data.tagListFormat);
      namePos = $.inArray('name', data.tagListFormat);
      $.each(data.tagList, function(index, item) {
        html += "<li data-value=" + item[idPos] + "><a href='javascript:void(0)'><h6>" + item[namePos] + "</h6></a></li>";
        data.indexableTagList.push(item[namePos]);
      });
    } else {
      $.each(data.tagList, function(index, item) {
        html += "<li data-value=" + item + "><a href='javascript:void(0)'><h6>" + item + "</h6></a></li>";
        data.indexableTagList.push(item);
      });
    }
    html = "<div id=" + data.tagListContainerId + " class='f-dropdown medium content' data-dropdown-content aria-autoclose='false' aria-hidden='true' tabindex='-1'><input id=" + data.filterId + " type='text'><ul class='inline-list' style='height: " + data.tagListContainerHeight + "px; overflow:auto;'>" + html + "</ul></div>";
    $("#" + data.hiddenInputId).parent().append(html);
    return $("#" + data.buttonId).attr('data-dropdown', data.tagListContainerId).attr('aria-controls', data.tagListContainerId).attr('aria-expanded', 'false');
  },
  removeLabelFromHiddenInput: function(value) {
    var arr, data, i, main;
    main = $(this);
    data = main.data('tagger').options;
    arr = $("#" + data.hiddenInputId).val().split(",");
    i = arr.indexOf("" + value);
    arr.splice(i, 1);
    return $("#" + data.hiddenInputId).val(arr.join());
  },
  setTagListeners: function(self) {
    var data, main;
    main = $(this);
    data = main.data('tagger').options;
    $("#" + data.filterId).keyup(function(evt) {
      if (evt.keyCode === 188 && !data.onlyTagList) {
        taggerJS.addTag.apply(main, [$(this).val().split(",")[0], $(this).val().split(",")[0]]);
        $(this).val('');
      }
      taggerJS.filterInput.apply(main, [$(this).val()]);
      if ($(this).val().length === 0) {
        return $("#" + data.tagListContainerId + " > ul > li").show();
      }
    });
    return $(document).on('click', "[id='tagger-remove-label']", function() {
      taggerJS.toggleVisiblityTagList.apply(main, [$(this).data('value')]);
      taggerJS.removeLabelFromHiddenInput.apply(main, [$(this).data('value')]);
      return $(this).parent().remove();
    });
  },
  tagListClickEvent: function() {
    var data, main;
    main = $(this);
    data = main.data('tagger').options;
    return $("#" + data.tagListContainerId + " > ul > li").click(function(evt) {
      evt.preventDefault();
      taggerJS.toggleVisiblityTagList.apply(main, [$(this).data('value')]);
      return taggerJS.addTag.apply(main, [$(this).data('value'), $(this).find('a').find('h6').text()]);
    });
  },
  toggleVisiblityTagList: function(value) {
    var data, main;
    main = $(this);
    data = main.data('tagger').options;
    if (!data.allowDuplicates) {
      return $("#" + data.tagListContainerId + " > ul > li[data-value=" + value + "]").toggle();
    }
  },
  default_options: {
    allowDuplicates: true,
    buttonId: null,
    filterId: 'tagger-filter',
    hiddenInputId: null,
    indexableTagList: [],
    labelClass: '',
    onlyTagList: false,
    tagCloseIcon: 'X',
    tagContainerId: null,
    tagList: null,
    tagListContainerId: null,
    tagListContainerHeight: 300,
    tagListFormat: null,
    tagListStart: null
  }
};

$.fn.tagger = function(args) {
  if (taggerJS[args]) {
    return taggerJS[args].apply(this, Array.prototype.slice.call(arguments, 1));
  } else {
    if (typeof args === "object" || !args) {
      return taggerJS.init.apply(this, arguments);
    }
  }
};
