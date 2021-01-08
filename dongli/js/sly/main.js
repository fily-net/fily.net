
$(window).load(function(){
        
        $('.slyWrap').each(function(i,e){
            var cont = $(this),
                frame = cont.find(".sly"),
                slidee = frame.find("ul"),
                scrollbar = cont.find(".scrollbar"),
                pagesbar = cont.find(".pages"),
                options = frame.data("options"),

                controls = cont.find(".controls"),
                prevButton = controls.find(".prev"),
                nextButton = controls.find(".next"),
                prevPageButton = controls.find(".prevPage"),
                nextPageButton = controls.find(".nextPage");

            options = $.extend( {}, options, {
                scrollBar: scrollbar,
                pagesBar: pagesbar,

                prev: prevButton,
                next: nextButton,
                prevPage: prevPageButton,
                nextPage: nextPageButton,
                disabledClass: 'btn-disabled'
            });
            frame.sly( options );

        })


});




