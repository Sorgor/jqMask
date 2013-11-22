$.fn.extend({

    jqMask: function (params) {
        
        var _this = this;

        var patterns = {'*': /[a-zA-Z0-9а-яА-ЯёЁ]/,'9': /[0-9]/, ' ': /./, '№': /./, '-': /./},
            skipped  = [' ', '№', '-'],
            settings = $.extend(params, {}),
            pat = settings.pattern.split('');
        
        String.prototype.insert = function (index, string) {
            if (index > 0) return this.substring(0, index) + string + this.substring(index + 1, this.length);
            else return string + this.substring(index + 1, this.length);
        };
        
        _this.onKeyPress = function(key){
            
            var atPosition = $(_this).val().length;
            
            // если позиция вставляемого символа больше 
            if (atPosition >= settings.pattern.length) {
                atPosition = $(_this).caret().begin;
                var range = $(_this).caret(),
                    value = $(_this).val().insert(range.begin, key);
                
                // if caret position is at the end of an input, just do return false
                if (range.begin >= settings.pattern.length) return false;

                // if not, then check if pressed key mathches any pattern
                if (key.match(patterns[pat[range.begin]])) {
                    // if pressed key is from skipped, write it and fire keypress event again
                    if($.inArray(pat[atPosition], skipped) > -1){
                        $(_this).val($(_this).val().insert(range.begin, pat[atPosition]));
                        $(_this).caret(range.begin + 1);
                        _this.onKeyPress(key);
                    }
                    else{
                        $(_this).val(value.substring(0, settings.pattern.length));
                        $(_this).caret(range.begin + 1);
                    }
                }
                
                return false;
                
            } else if (key.match(patterns[pat[atPosition]])) {
                if($.inArray(pat[atPosition], skipped) > -1){
                    $(_this).val($(this).val() + pat[atPosition]);
                    _this.onKeyPress(key);
                }                
            } else {
                return false;
            }
            
            return true;
        }
        
        $(this).val(settings.placeholder);

        // event bindings
        $(this)
        .keypress(function (e) {
            return _this.onKeyPress(String.fromCharCode(e.keyCode));
        })
        .focus(function (e) {
            if ($(_this).val() == settings.placeholder){
                $(_this).val('');   
            }
        })
        .blur(function (e) {
            if ($(_this).val().trim() == '') {
                $(_this).val(settings.placeholder);    
            }
        });
        

    },
    
    caret: function (begin, end) {
        var range;
        if (this.length === 0 || this.is(":hidden")) return;
        if (typeof begin == 'number') {
            end = (typeof end === 'number') ? end : begin;
            return this.each(function () {
                if (this.setSelectionRange) {
                    this.setSelectionRange(begin, end);
                } else if (this.createTextRange) {
                    range = this.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', begin);
                    range.select();
                }
            });
        } else {
            if (this[0].setSelectionRange) {
                begin = this[0].selectionStart;
                end = this[0].selectionEnd;
            } else if (document.selection && document.selection.createRange) {
                range = document.selection.createRange();
                begin = 0 - range.duplicate().moveStart('character', -100000);
                end = begin + range.text.length;
            }
            return {
                begin: begin,
                end: end
            };
        }
    }
});