(function() {
  /*
  This has significant inspiration from jquery.imgExplosion at https://github.com/atomantic/jquery.imgExplosion
  */
  var ImageExplosion;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  ImageExplosion = (function() {
    function ImageExplosion(opts) {
      var defaults;
      this.opts = opts;
      defaults = {
        img: "/img/star.png",
        throwInterval: 800,
        num: 24,
        minWidth: 20,
        minThrow: 600,
        maxThrow: 2000,
        z: 1001,
        centerOn: false,
        extraWidth: 0,
        rotateSpeed: 5
      };
      this.options = $.extend({}, defaults, this.opts);
      this.center = $(this.options.centerOn);
      this.img = $('<img src="' + this.options.img + '" style="display:none;position:absolute;z-index:' + this.options.z + '" />');
      $('body').append(this.img);
    }
    ImageExplosion.prototype.explode = function() {
      this.throwClone();
      this.options.num -= 1;
      if (this.options.num > 0) {
        return setTimeout(__bind(function() {
          return this.explode();
        }, this), this.options.interval);
      }
    };
    ImageExplosion.prototype.throwClone = function() {
      var clone, interval, target, throwTime;
      clone = this.img.clone();
      clone.addClass('clone');
      clone.startX = this.randBetween(this.center.offset().left, this.center.offset().left + this.center.width());
      clone.targetX = Math.floor($(window).scrollLeft() + ($(window).width() - this.img.width() - this.options.extraWidth) * (clone.startX - this.center.offset().left) / this.center.width());
      clone.startY = this.randBetween(this.center.offset().top, this.center.offset().top + this.center.height());
      clone.targetY = Math.floor($(window).scrollTop() + ($(window).height() - this.img.height() - this.options.extraWidth) * (clone.startY - this.center.offset().top) / this.center.height());
      clone.r = this.randBetween(0, 360);
      clone.css('left', clone.startX).css('top', clone.startY);
      clone.width(0);
      clone.show();
      $('body').append(clone);
      target = {
        'width': this.randBetween(this.img.width(), this.img.width() + this.options.extraWidth),
        'left': clone.targetX,
        'top': clone.targetY
      };
      throwTime = this.randBetween(this.options.minThrow, this.options.maxThrow);
      interval = setInterval(this.rotate, 15, clone, this.options);
      return clone.animate(target, throwTime, function() {
        clone.fadeOut(400, function() {
          return clone.remove();
        });
        return clearInterval(interval);
      });
    };
    ImageExplosion.prototype.rotate = function(what, options) {
      var r;
      r = what.r = what.r + options.rotateSpeed;
      what.css('rotation', r + 'deg');
      what.css('-webkit-transform', 'rotate(' + r + 'deg)');
      return what.css('-moz-transform', 'rotate(' + r + 'deg)');
    };
    ImageExplosion.prototype.randBetween = function(a, b) {
      return Math.floor(Math.random() * (b - a)) + a;
    };
    return ImageExplosion;
  })();
  $.fn.explode = function(opts) {
    var splosion;
    splosion = new ImageExplosion(opts);
    return splosion.explode();
  };
}).call(this);
