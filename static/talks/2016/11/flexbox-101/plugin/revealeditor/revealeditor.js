(function ($) {
    'use strict';
    $.fn.RevealEditor = function (options) {
        
        // Default setting;
        var settings = $.extend({
            aceTheme: "ace/theme/twilight",
            defaultEditor: 'javascript',
            javascript: true,
            html: true,
            css: true,
            fontSize: 18,
            shortcutKeyCode: null,
            autoLoadFromCurrentSlide: false
        }, options);

        // The root node of the editor
        var $editor;
        
        // The Ace editor instance for editing CSS 
        var cssEditor;

        // The Ace editor instance for editing HTML 
        var htmlEditor;

        // The Ace editor instance for editing JavaScript 
        var jsEditor;

        // Default Reveal.js configuration overrides
        var revealConfig = {
            keyboard: {}
        };
        
        //Parses Javascript Code
        function parseJavascript() {
            return (jsEditor) ? jsEditor.getValue() : "";
        }
        
        //Parses HTML Code
        function parseHtml() {
            return (htmlEditor) ? htmlEditor.getValue() : "";
        }
        
        //Parses CSS Code
        function parseCSS() {
            return (cssEditor) ? cssEditor.getValue() : "";
        }
        
        // Sets Up Editor
        function setUpEditor(este) {
            $editor = $("<div class='editor'><div class='panel input'><div class='controls'><a class='close'>X</a></div><div class='wrapper'></div></div><div class='panel output'><div class='controls''><a class='run'> Run </a><a class='clear'> Clear </a><a class='copy'>Copy</a><a class='lg'> + </a><a class='sm'> -</a></div><div class='console wrapper js active'></div><iframe sandbox='allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation' class='iframe wrapper html css' srcdoc=''></iframe></div></div></div>");
            este.after($editor);

            if (settings.javascript) {
                $(".input .controls", $editor).append("<a class='js active'> Javascript </a>");
                $(".input .wrapper", $editor).append("<pre id='jsEditor' class='ace active'></pre>");
                $(".console.wrapper.js", $editor).addClass("active");
            } else {
                $(".console.wrapper.js", $editor).hide();
            }

            if (settings.html) {
                $(".input .controls", $editor).append("<a class='html'> HTML </a>");
                $(".input .wrapper", $editor).append("<pre id='htmlEditor' class='ace'></pre>");
                if ($(".input .active", $editor).length === 0) {
                    $("#htmlEditor").addClass("active");
                    $(".wrapper.js", $editor).removeClass("active");
                    $(".html", $editor).addClass("active");
                    $(".output .wrapper.html.css", $editor).addClass("active");
                }
            }

            if (settings.css) {
                $(".input .controls", $editor).append("<a class='css'> CSS </a>");
                $(".input .wrapper", $editor).append("<pre id='cssEditor' class='ace'></pre>");
                if (!$(".output .wrapper.html", $editor).length) {
                    $(".output .wrapper", $editor).append("<div class='html css'></div>");
                }
                if ($(".input .active", $editor).length === 0) {
                    $("#cssEditor").addClass("active");
                    $(".css", $editor).addClass("active");
                    $(".output .wrapper.html.css", $editor).addClass("active");
                }
            }
            
            setEditorFontSize(settings.fontSize);
        }
        
        // Sets Up Ace Javascript Editor
        function setUpAceJSEditor() {
            if (settings.javascript) {
                jsEditor = ace.edit("jsEditor");
                jsEditor.setTheme(settings.aceTheme);
                jsEditor.session.setMode("ace/mode/javascript");
            }
        }
        
        // Sets Up Ace HTML Editor
        function setUpAceHtmlEditor() {
            if (settings.html) {
                htmlEditor = ace.edit("htmlEditor");
                htmlEditor.setTheme(settings.aceTheme);
                htmlEditor.session.setMode("ace/mode/html");
            }
        }
        
        // Sets Up Ace CSS Editor
        function setUpAceCssEditor() {
            if (settings.css) {
                cssEditor = ace.edit("cssEditor");
                cssEditor.setTheme(settings.aceTheme);
                cssEditor.session.setMode("ace/mode/css");
            }
        }
        
        // Sets Up Editor controls
        function setUpControls(este) {
            if (settings.shortcutKeyCode) {
                revealConfig.keyboard[settings.shortcutKeyCode] = showEditor;
                Reveal.configure(revealConfig);
            } else {
                este.on("click", showEditor);
            }
            
            $(".run", $editor).click(function () {
                var js = parseJavascript(),
                    css = parseCSS(),
                    html = parseHtml(),
                    t = "<script> var div = parent.document.body.getElementsByClassName('console'); var console = {panel: div,log: function(m){this.panel[0].innerHTML = this.panel[0].innerHTML + '<p>' + m + '</p>';} }; </script>",
                    s = t + "<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css'><link rel='stylesheet' href='css/demo.css'></head><style class='style'>" + css + "</style>" + html + "<script class='script'>" + js + "</script>";
                $(".iframe").attr("srcdoc", s);
            });

            // Sets up eventHandlers for btn clicks
            $(".clear", $editor).click(function () {
                if ($("#jsEditor").hasClass("active")) {
                    $(".output .wrapper.js", $editor).empty();
                } else if ($("#cssEditor").hasClass("active") || $("#htmlEditor").hasClass("active")) {
                    clearHtmlCssOutput();
                }
            });
            
            $(".close", $editor).on("click", hideEditor);
            
            $(".html", $editor).on("click", function () {
                selectHtmlEditor();
            });
            
            $(".js", $editor).on("click", function () {
                selectJavaScriptEditor();
            });
            
            $(".css", $editor).on("click", function () {
                selectCssEditor();
            });
            
            $(".lg", $editor).on("click", function () {
                settings.fontSize += 1;
                setEditorFontSize(settings.fontSize);
            });
            
            $(".sm", $editor).on("click", function () {
                settings.fontSize -= 1;
                setEditorFontSize(settings.fontSize);
            });
            
            $(".copy", $editor).on("click", function () {
                var $section = $("section.present:not(.stack)", $editor),
                    s = $section.find("code").text(),
                    id = $(".ace.active", $editor).attr("id");
                if ($section.has('.hljs.html').length !== 0) {
                    id = $(".ace#htmlEditor").attr('id');
                    $(".active", $editor).toggleClass("active");
                    $("#htmlEditor").toggleClass("active");
                    $(".output .wrapper.js", $editor).hide();
                    $(".output .wrapper.html.css", $editor).show();
                    $(".html", $editor).toggleClass("active");
                } else if ($section.has('.hljs.css').length !== 0) {
                    id = $(".ace#cssEditor").attr('id');
                    $(".active", $editor).toggleClass("active");
                    $("#cssEditor").toggleClass("active");
                    $(".output .wrapper.js", $editor).hide();
                    $(".output .wrapper.html.css", $editor).show();
                    $(".css", $editor).toggleClass("active");
                } else if ($section.has('.hljs.js').length !== 0) {
                    id = $(".ace#jsEditor").attr('id');
                    $(".active", $editor).toggleClass("active");
                    $("#jsEditor").toggleClass("active");
                    $(".output .wrapper.html.css", $editor).hide();
                    $(".output .wrapper.js", $editor).show();
                    $(".js", $editor).toggleClass("active");
                }
                ace.edit(id).getSession().setValue(s, 1);
            });
        }

        function selectHtmlEditor() {
            $(".active", $editor).toggleClass("active");
            $("#htmlEditor").toggleClass("active");
            $(".output .wrapper.js", $editor).hide();
            $(".output .wrapper.html.css", $editor).show();
            $(".html", $editor).toggleClass("active");
        }

        function selectJavaScriptEditor() {
            $(".active", $editor).toggleClass("active");
            $("#jsEditor").toggleClass("active");
            $(".output .wrapper.html.css", $editor).hide();
            $(".output .wrapper.js", $editor).show();
            $(".js", $editor).toggleClass("active");
        }

        function selectCssEditor() {
            $(".active", $editor).toggleClass("active");
            $("#cssEditor").toggleClass("active");
            $(".output .wrapper.js", $editor).hide();
            $(".output .wrapper.html.css", $editor).show();
            $(".css", $editor).toggleClass("active");
        }

        function selectDefaultEditor() {
            if (settings.javascript && settings.defaultEditor === 'javascript') {
                selectJavaScriptEditor();
            } else if (settings.css && settings.defaultEditor === 'css') {
                selectCssEditor();
            } else {
                selectHtmlEditor();
            }
        }

        // Sets Up Copy Btn logic
        function enableCopyBtnLogic() {
            var $slide = $("section.present:not(.stack)", $editor);
            if ($slide.has(".hljs").length !== 0) {
                $(".copy", $editor).show();
            } else {
                $(".copy", $editor).hide();
            }
        }

        // Makes the editor visible
        function showEditor() {
            if (settings.autoLoadFromCurrentSlide) {
                copyCodeFromCurrentSlide();
            }
            Reveal.configure({keyboard: false});
            $editor.show();
            selectDefaultEditor();
        }

        // Hides the editor 
        function hideEditor() {
            $editor.hide();
            Reveal.configure({keyboard: true});
            Reveal.configure(revealConfig);
        }

        // Clears the content of the iframe containing the HTML and CSS output
        function clearHtmlCssOutput() {
            $(".iframe", $editor).attr("srcdoc", "");
        }
        
        // Copies code from the current slide
        function copyCodeFromCurrentSlide() {
            var slide = $('section.present').not('.stack');

            clearHtmlCssOutput();

            var html = $('code.html', slide);
            if (settings.html && html) {
                htmlEditor.setValue(html.html().trim());
            }

            var css = $('code.css', slide);
            if (settings.css && css) {
                cssEditor.setValue(css.text().trim());
            }

            var js = $('code.javascript', slide);
            if (settings.javascript && js) {
                jsEditor.setValue(js.text().trim());
            }
        }

        // Sets the font size of the editor and output pane
        function setEditorFontSize(fontSize) {
            $(".ace", $editor).css("font-size", fontSize);
            $(".output .wrapper.js p", $editor).css("font-size", fontSize);
        }

        // Initializes Editor
        function init(este) {
            setUpEditor(este);
            setUpAceJSEditor();
            setUpAceHtmlEditor();
            setUpAceCssEditor();
            setUpControls(este);
            enableCopyBtnLogic();
            
            // Sets up Reveal Slide eventhandlers
            Reveal.addEventListener("slidechanged", function (event) {
                enableCopyBtnLogic();
            });
        }
        
        init(this);
    };
}(jQuery));