// -----------------------------------------------------------------------
// Eros Fratini - eros@recoding.it
// jqprint 0.3
//
// - 19/06/2009 - some new implementations, added Opera support
// - 11/05/2009 - first sketch
//
// Printing plug-in for jQuery, evolution of jPrintArea: http://plugins.jquery.com/project/jPrintArea
// requires jQuery 1.3.x
//
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
//------------------------------------------------------------------------

(function($) {
    var opt;
    var hkey_root,hkey_path,hkey_key
		hkey_root="HKEY_CURRENT_USER"
		hkey_path="\\Software\\Microsoft\\Internet Explorer\\PageSetup\\"
        console.log(hkey_root,hkey_path,hkey_key);
		//设置网页打印的页眉页脚为空
		function pagesetup_null(){
			try{
				var RegWsh = new ActiveXObject("WScript.Shell")
				hkey_key="header"
				RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"")
				hkey_key="footer"
                RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"")
			}catch(e){
                console.log('pagesetup_null err',e);
            }
		}
    $.fn.jqprint = function (options) {
        opt = $.extend({}, $.fn.jqprint.defaults, options);

        var $element = (this instanceof jQuery) ? this : $(this);

        if (opt.operaSupport )
        {
            var tab = window.open("","jqPrint-preview");
            tab.document.open();

            var doc = tab.document;
        }
        else
        {
            var $iframe = $("<iframe  />");

            if (!opt.debug) { $iframe.css({ position: "absolute", width: "0px", height: "0px", left: "-600px", top: "-600px" }); }

            $iframe.appendTo("body");
            var doc = $iframe[0].contentWindow.document;
        }

        if (opt.importCSS)
        {
            if ($("link[media=print]").length > 0)
            {
                $("link[media=print]").each( function() {
                    doc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' media='print' />");
                });
            }
            else
            {
                $("link").each( function() {
                    doc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' />");
                });
            }
        }

        if (opt.printContainer) { doc.write($element.outer()); }
        else { $element.each( function() { doc.write($(this).html()); }); }

        doc.close();

        (opt.operaSupport ? tab : $iframe[0].contentWindow).focus();
        setTimeout( function() {
			if(navigator.appName=='Microsoft Internet Explorer'){pagesetup_null();}
		(opt.operaSupport ? tab : $iframe[0].contentWindow).print(); if (tab) { tab.close(); } }, 1000);
    }

    $.fn.jqprint.defaults = {
		debug: false,
		importCSS: true,
		printContainer: true,
		operaSupport: false
	};

    jQuery.fn.outer = function() {
      return $($('<div></div>').html(this.clone())).html();
    }
})(jQuery);
