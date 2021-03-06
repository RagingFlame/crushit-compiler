
define(['../libs/md5', './console'], function (md5, Console) {
    "use strict";
    
    var LeftPanel = Backbone.View.extend({
    
        el: $('#left-panel'),
        
        
        
        active: false,
        
        
        
        cache: {},
        
        
        
        events: {
            'submit #crushit': 'crushIt',
            'focus #url':  'resetCrushIt'           
        },
        
        
        
        initialize: function () {
            this.console = new Console();
            
            this.listenTo(this, 'loading', this.loading);
            this.listenTo(this, 'loaded', this.loaded);  
        },
        
        
        
        resetCrushIt: function () {
            this.$('#url').val('');
            this.console.update('');
        },
        
        
        
        crushIt: function () {
            // Is CrushIt at work?
            if (this.active) {
                return;
            }
            
            var url = this.$("#url").val();
            
            this.trigger('loading');
            this.sendRequest('/crush', this.$('#crushit').serialize(), 'text', url);
            
            return false;
        },
        
        
        
        sendRequest: function (url, data, format, cacheUrl) {
            var cacheKey = 'ct' + md5(cacheUrl), self = this;
            
            if (self.cache.hasOwnProperty(cacheKey)) {
                self.trigger('loaded');
                self.console.update(self.cache[cacheKey].code);
                
                return false;
            }
            
            $.post(url, data, function (code) {
                self.trigger('loaded');
                self.console.update(code);
                self.cache[cacheKey] = {
                    url: cacheUrl,
                    code: code
                };
            }, format);        
        },
        
        
        
        
        loading: function () {
            this.console.update('Crushing scripts....');
            this.$('#submit').addClass('disabled').attr('disabled', 'disabled');
            $('#loading').removeClass('loading-inactive').addClass('loading-active');
            this.active = true;
        },
        
        
        
        
        loaded: function () {
            this.$('#submit').removeClass('disabled').attr('disabled', false);        
            $('#loading').removeClass('loading-active').addClass('loading-inactive');
            this.active = false;
        }
    });
    
    return LeftPanel;
})