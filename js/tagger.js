(function($){
  "use strict";

  var defaults =  {
    allowDuplicates: true,
    data: null,
    delimiters: [9, 13, 44],
    minTags: -1,
    maxTags: -1,
    onlyTagList: false,
    tagCloseIcon: 'X',
    tagClass: 'label',
    tagsContainer: null,
    tagList: null,
    validator: null
  },
  publicMethods = {
    addTag: function(tag, tagData){
      var $self = $(this);
      var opts = $self.data('opts');
      var tlis = $self.data('tlis');
      var html;

      // Tag is empty then return empty
      if(!tag){ return;}

      // Is the tag restricted to a list?
      if(opts.onlyTagList){
        // List of available tags
        var $tagList = opts.tagList;
        // List of selected tags
        var $tlis = tlis;

        $.each(tlis, function(index, item){
            $tlis[index] = item.toLowerCase();
          });

        $.each($tagList, function(index, item){
          $tagList[index] = item.toLowerCase();
        });

        // If the tag is not on the list
        if($.inArray(tag.toLowerCase(), $tagList) == -1){
          return;
        }

        //If there is a validator function and the tag didn't make it
        if(opts.validator && !opts.validator(tag)){
          $self.trigger('tagInvalid',tag);
          return;
        }

        // Do not let any more tags if it's over the limit
        if(!opts.maxTags == -1 && opts.maxTags > tlis.length){
          return ;
        }

        // There cannot be duplicates
        if(!allowDuplicates && $.inArray(tag.toLowerCase(), $tlis) == -1){
          $self.trigger('tagDuplicate',tag)
          return;
        }

        html+= "<span class="+opts.tagClass+">"+tag+"<a href='#' id='tagger'>"+opts.tagCloseIcon+"</a></span>";

        $(el) = $(html);

        $(opts.tagsContainer).append($(el))

        /*        
          TO DO: Remove event binding
        */
      }
    }
  },
  privateMethods = {
    init: function(options){
      var opts = $.extend({}, defaults, options);

      // Set validator stance
      if (!$.isFunction(opts.validator)) { opts.validator = null; }

      this.each(function(){
        var $self = $(this);

        // Data elements
        if ($self.data('tagger')) { return false; }
        $self.data('tagger', true);

        $self.data('opts', opts);

        // Event handling
        $.on('keypress', function(e){
          console.log(e)
        })
      })
    }
  };

  $.fn.tagger = function(method) {
        var $self = $(this);

        if (!(0 in this)) { return this; }

        if ( publicMethods[method] ) {
            return publicMethods[method].apply( $self, Array.prototype.slice.call(arguments, 1) );
        } else if ( typeof method === 'object' || ! method ) {
            return privateMethods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist.' );
            return false;
        }
    };
})();