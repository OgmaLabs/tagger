var tagger;

tagger = {
  allowDuplicates: true,
  hiddenInputId: null,
  inputId: null,
  indexableTagList: [],
  labelClass: null,
  onlyTagList: false,
  tagCloseIcon: 'X',
  tagContainerId: null,
  tagList: null,
  tagListContainerId: null,
  tagListContainerHeight: 300,
  tagListFormat: null,
  tagListStart: null,
  addTag: function(tag, value) {
    var flag, html, self;
    self = $(this)[0];
    flag = true;
    html = "<span class='label " + self.labelClass + "'>" + tag + " <a id='tagger-remove-label' data-value=" + (value || tag) + " href='#'>" + self.tagCloseIcon + "</a></span>";
    if (!self.allowDuplicates && !self.onlyTagList) {
      flag = self.noDuplicate(tag);
    }
    if (!self.allowDuplicates && self.onlyTagList) {
      flag = self.noDuplicate(tag) && self.isInTagList(tag, value);
    }
    if (self.allowDuplicates && self.onlyTagList) {
      flag = self.isInTagList(tag, value);
    }
    if (flag) {
      $("#" + self.tagContainerId).append(html);
    }
    if ($("#" + self.hiddenInputId).val()) {
      $("#" + self.hiddenInputId).val($("#" + self.hiddenInputId).val() + ("," + value));
    } else {
      $("#" + self.hiddenInputId).val(value || tag);
    }
  },
  noDuplicate: function(tag) {
    var self;
    self = $(this)[0];
    return $.inArray(tag, self.labelToArray($("#" + self.tagContainerId + " > span"))) === -1;
  },
  isInTagList: function(tag, value) {
    var self;
    self = $(this)[0];
    return $.inArray(tag, self.indexableTagList) >= 0;
  },
  labelToArray: function(selector) {
    var arr;
    arr = [];
    $.each(selector, function(i, val) {
      arr.push($(this).text().slice(0, -2));
    });
    return arr;
  },
  tagListClickEvent: function() {
    var self;
    self = $(this)[0];
    $("#" + self.tagListContainerId + " > ul > li").click(function(evt) {
      evt.preventDefault();
      self.toggleVisiblityTagList($(this).data('value'));
      return self.addTag($(this).find('a').find('h6').text(), $(this).data('value'));
    });
  },
  populateDropdown: function() {
    var html, idPos, namePos, self;
    self = $(this)[0];
    html = '';
    if (self.tagListFormat) {
      idPos = $.inArray('id', self.tagListFormat);
      namePos = $.inArray('name', self.tagListFormat);
      $.each(self.tagList, function(index, item) {
        html += "<li data-value=" + item[idPos] + "><a href='javascript:void(0)'><h6>" + item[namePos] + "</h6></a></li>";
        self.indexableTagList.push(item[namePos]);
      });
    } else {
      $.each(self.tagList, function(index, item) {
        html += "<li data-value=" + item + "><a href='javascript:void(0)'><h6>" + item + "</h6></a></li>";
        self.indexableTagList.push(item);
      });
    }
    html = "<div id=" + self.tagListContainerId + " class='f-dropdown medium content' data-dropdown-content aria-hidden='true' tabindex='-1'><ul class='inline-list' style='height: " + self.tagListContainerHeight + "px; overflow:auto;'>" + html + "</ul></div>";
    $("#" + self.hiddenInputId).parent().append(html);
    $("#" + self.inputId).attr('data-dropdown', self.tagListContainerId).attr('aria-controls', self.tagListContainerId).attr('aria-expanded', 'false');
  },
  removeLabelFromHiddenInput: function(value) {
    var arr, i, self;
    self = $(this)[0];
    arr = $("#" + self.hiddenInputId).val().split(",");
    i = arr.indexOf("" + value);
    arr.splice(i, 1);
    $("#" + self.hiddenInputId).val(arr.join());
  },
  setTagListeners: function() {
    var self;
    self = $(this)[0];
    $(document).on('click', "[id='tagger-remove-label']", function() {
      self.toggleVisiblityTagList($(this).data('value'));
      self.removeLabelFromHiddenInput($(this).data('value'));
      return $(this).parent().remove();
    });
  },
  toggleVisiblityTagList: function(value) {
    var self;
    self = $(this)[0];
    if (!self.allowDuplicates) {
      $("#" + self.tagListContainerId + " > ul > li[data-value=" + value + "]").toggle();
    }
  },
  init: function(options) {
    var idPos, namePos, self;
    options = $.extend({}, drilldownJS.default_options, options);
    main.data('tagger', {
      options: options
    });
    self = $(this)[0];
    if (!(self.hiddenInputId && self.inputId && self.tagContainerId && self.tagListContainerId && self.tagListContainerHeight)) {
      alert('Some flags are missing');
    }
    if (self.tagList) {
      self.populateDropdown();
      $(document).foundation('reflow');
      self.tagListClickEvent();
    }
    if (self.tagListStart) {
      if (self.tagListFormat) {
        idPos = $.inArray('id', self.tagListFormat);
        namePos = $.inArray('name', self.tagListFormat);
        $.each(self.tagListStart, function(index, item) {
          self.addTag(item[namePos], item[idPos]);
          self.indexableTagList.push(item[namePos]);
        });
      } else {
        $.each(self.tagListStart, function(index, item) {
          self.addTag(item);
          self.indexableTagList.push(item);
        });
      }
    }
    self.setTagListeners();
  }
};
