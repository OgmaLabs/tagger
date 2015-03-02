var tagger;

tagger = {
  allowDuplicates: true,
  hiddenInputId: null,
  inputId: null,
  indexableTagList: [],
  labelClass: '',
  onlyTagList: false,
  tagCloseIcon: 'X',
  tagContainerId: null,
  tagList: null,
  tagListContainerId: null,
  tagListFormat: null,
  tagListStart: null,
  validator: false,
  addTag: function(tag, value) {
    var flag, html, self;
    self = $(this)[0];
    flag = true;
    html = "<span class='label " + self.labelClass + "'>" + tag + " <a href='javascript:void(0)'>" + self.tagCloseIcon + "</a></span>";
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
      $('#' + self.tagContainerId).append(html);
    }
    if ($('#' + self.hiddenInputId).val()) {
      $('#' + self.hiddenInputId).val($('#' + self.hiddenInputId).val() + "," + value);
    } else {
      $('#' + self.hiddenInputId).val(value || tag);
    }
  },
  noDuplicate: function(tag) {
    var self;
    self = $(this)[0];
    return $.inArray(tag, self.labelToArray($('#' + self.tagContainerId + ' > span'))) === -1;
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
      arr.push($(this).text().split(' ')[0]);
    });
    return arr;
  },
  tagListClickEvent: function() {
    var self;
    self = $(this)[0];
    return $('#' + self.tagListContainerId + '> li').click(function(evt) {
      evt.preventDefault();
      self.addTag($(this).find('a').text(), $(this).data('value'));
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
        html += "<li data-value='" + item[idPos] + "'><a href='javascript:void(0)'>" + item[namePos] + "</a></li>";
        self.indexableTagList.push(item[namePos]);
      });
    } else {
      $.each(self.tagList, function(index, item) {
        html += "<li data-value='" + item + "'><a href='javascript:void(0)'>" + item + "</a></li>";
        self.indexableTagList.push(item);
      });
    }
    html = "<ul id='" + self.tagListContainerId + "' class='f-dropdown' data-dropdown-content aria-hidden='true' tabindex='-1'>" + html + "</ul>";
    $('#' + self.hiddenInputId).parent().append(html);
    $('#' + self.inputId).attr('data-dropdown', self.tagListContainerId).attr('aria-controls', self.tagListContainerId).attr('aria-expanded', 'false');
  },
  init: function() {
    var idPos, namePos, self;
    self = $(this)[0];
    if (!(self.hiddenInputId && self.inputId && self.tagContainerId && self.tagListContainerId)) {
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
  }
};
