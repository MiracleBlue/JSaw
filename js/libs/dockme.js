function DockMe(container) {
    var dockLeft = container.find(".dockme-left, .dockme-top");
    dockLeft.each(function(){
        var elem = $(this);
        var position = (elem.hasClass('dockme-left') ? 'left' : 'top');
        elem.css({
            'position': 'absolute',
            'z-index': (position === 'left' ? 8 : 9)
        }).css(position, 0);
        container.css({
            'position': 'relative',
        });
        container.find(".dockme-center").css('padding-'+position, (position === 'left' ? elem.outerWidth() : elem.outerHeight())+'px');
        if (position === 'left' && container.find(".dockme-top")) {
                elem.css('padding-top', container.find(".dockme-top").outerHeight());
            
        }
        else if (position === 'top' && container.find(".dockme-left")) {
            elem.css('padding-left', container.find(".dockme-left").outerWidth());
        }
        container.on('scroll', function(e) {
            elem.stop().animate({
                'left': (position === 'left' ? container.scrollLeft() : 0),
                'top': (position === 'top' ? container.scrollTop() : 0)
            }, 100, 'swing');
        })
    });
}