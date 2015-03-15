var taggerJS;

taggerJS = {
  init: function(options) {
    var idPos, main, namePos, self, tag, _i, _j, _len, _len1, _ref, _ref1;
    options = $.extend({}, taggerJS.default_options, options);
    main = $(this);
    main.data('tagger', {
      options: options
    });
    self = main.data('tagger').options;
    if (!(self.hiddenInputId && self.buttonId && self.tagContainerId && self.tagListContainerId && self.tagListContainerHeight)) {
      alert('Some flags are missing');
    }
    if (self.tagList) {
      taggerJS.populateDropdown.apply(main);
      $(document).foundation('dropdown', 'reflow');
      taggerJS.tagListClickEvent.apply(main);
    }
    if (self.tagListStart) {
      if (self.tagListFormat) {
        idPos = $.inArray('id', self.tagListFormat);
        namePos = $.inArray('name', self.tagListFormat);
        _ref = self.tagListStart;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tag = _ref[_i];
          taggerJS.addTag.apply(main, tag);
          self.indexableTagList.push(tag[namePos]);
        }
      } else {
        _ref1 = self.tagListStart;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          tag = _ref1[_j];
          taggerJS.addTag.apply(main, tag);
          self.indexableTagList.push(tag);
        }
      }
    }
    return taggerJS.setTagListeners;
  },
  addTag: function(item, value) {
    return console.log("" + item + " " + value);
  },
  populateDropdown: function() {
    var main, self;
    main = $(this);
    return self = main.data('tagger').options;
  },
  setTagListeners: function() {
    return console.log("TagListeners");
  },
  tagListClickEvent: function() {
    return console.log("TagList");
  },
  default_options: {
    allowDuplicates: true,
    buttonId: null,
    filterId: 'tagger-filter',
    hiddenInputId: null,
    indexableTagList: [],
    labelClass: null,
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
