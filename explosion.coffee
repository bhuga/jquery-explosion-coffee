###
This has significant inspiration from jquery.imgExplosion at https://github.com/atomantic/jquery.imgExplosion
###

class ImageExplosion
  constructor: (@opts) ->
    defaults =
      img: "/img/star.png",
      throwInterval: 800,
      #how many images should throw
      num: 24,
      #minimum random width of the image in pixels
      minWidth: 20,
      #min throw duration (ms)
      minThrow: 600,
      #max throw duration (ms)
      maxThrow: 2000,
      #what z-index to throw on(default setting throws it over a jquery.ui dialog overlay--but behind modal dialog)
      z: 1001,
      #what to center an explosion outward from. This should be an element.
      centerOn: false,
      #grow the image randomly beyond its normal size by this many pixels
      extraWidth: 0,
      #how fast to rotate the image, in some unit that I don't know.
      rotateSpeed: 5
    @options = $.extend({}, defaults, @opts)
    @center = $(@options.centerOn)
    @img = $('<img src="'+@options.img+'" style="display:none;position:absolute;z-index:'+@options.z+'" />')
    $('body').append(@img)

  explode: () ->
    @throwClone()
    @options.num -= 1
    if @options.num > 0
      setTimeout () =>
        @explode()
      , @options.interval

  throwClone: () ->
    clone = @img.clone()
    clone.addClass('clone')
    clone.startX = @randBetween(@center.offset().left, @center.offset().left + @center.width())
    clone.targetX = Math.floor($(window).scrollLeft() +
                                ($(window).width() - @img.width() - @options.extraWidth) *
                                (clone.startX - @center.offset().left) / @center.width())
    clone.startY =  @randBetween(@center.offset().top, @center.offset().top + @center.height())
    clone.targetY = Math.floor($(window).scrollTop() +
                                ($(window).height() - @img.height() - @options.extraWidth) *
                                (clone.startY - @center.offset().top) / @center.height())
    clone.r = @randBetween(0,360)
    clone.css('left', clone.startX).css('top', clone.startY)
    clone.width(0)
    clone.show()
    $('body').append(clone)
    target =
      'width': @randBetween(@img.width(), @img.width() + @options.extraWidth),
      'left': clone.targetX,
      'top': clone.targetY
    throwTime = @randBetween(@options.minThrow, @options.maxThrow)
    interval = setInterval(@rotate, 15, clone, @options)
    clone.animate target, throwTime, ->
      clone.fadeOut 400, ->
        clone.remove()
      clearInterval interval

  rotate: (what, options) ->
    r = what.r = what.r + options.rotateSpeed
    what.css('rotation', r + 'deg')
    what.css('-webkit-transform', 'rotate(' + r + 'deg)')
    what.css('-moz-transform', 'rotate(' + r + 'deg)')

  randBetween: (a, b) ->
    Math.floor( Math.random() * (b-a) ) + a

$.fn.explode = (opts) ->
  splosion = new ImageExplosion opts
  splosion.explode()
