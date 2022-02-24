odoo.define("rating_content.PageRating", function (require) {
    "use strict";

    var publicWidget = require("web.public.widget");
    var currentPageRating;

    publicWidget.registry.PageRating = publicWidget.Widget.extend({

        selector: '.page_rating',

        events: _.extend({}, publicWidget.Widget.prototype.events, {
            'mouseover a.task-rating': 'populateHoverRatesMouseOver',
            'mouseout a.task-rating': 'populateHoverRatesMouseOut',
            'click a.task-rating': 'submitRatingForPage',
        }),

        start: function () {
            // Rate logic
            var ratedPages;
            ratedPages = localStorage.getItem('ratedPages');
            if (ratedPages == null) {
                ratedPages = JSON.stringify({});
                localStorage.setItem('ratedPages', ratedPages);
            }
            this.getCurrentPageRating();
            // Rate logic
            return this._super.apply(this, arguments);
        },

        deselectRateAtt: function (rate) {
            $(rate).attr('aria-checked', "false");
        },

        selectRateAtt: function (rate) {
            $(rate).attr('aria-checked', "true");
        },

        rateClass: function (rate) {
            $(rate).toggleClass("fa-star-o fa-star");
        },

        rateAddClass: function (rate) {
            if ($(rate).hasClass("fa-star-o")) {
                this.rateClass(rate);
            }
        },

        rateRemoveClass: function (rate) {
            if ($(rate).hasClass("fa-star")) {
                this.rateClass(rate);
            }
        },

        populateHoverRatesMouseOver: function (event) {
            var self = this;
            var currentTarget = event.currentTarget;
            var rating_option = $(currentTarget).attr('data-index');
            $($(currentTarget).parent()).children('a').each(function (element) {
                if ($(this).attr('data-index') <= rating_option) {
                    self.rateAddClass(this);
                } else if ($(this).attr('data-index') > rating_option) {
                    self.rateRemoveClass(this);
                }
            });
        },

        populateHoverRatesMouseOut: function () {
            if (currentPageRating != null) {
                this.populateRating(currentPageRating);
            }
            else {
                var $pageRating = $('.page_rating').find('.fa-star');
                $pageRating.toggleClass('fa-star fa-star-o');
            }
        },


        submitRatingForPage: function (event) {
            var self = this;
            var ratingOption = parseInt($(event.currentTarget).attr('data-index'));
            self._rpc({
                route: '/rating_page/',
                params: {
                    'rating': ratingOption,
                    'rated_pages': JSON.parse(localStorage.getItem('ratedPages'))
                },
            }).then(function (data) {
                localStorage.setItem('ratedPages', JSON.stringify(data[0]));
                self.populateHoverRatesMouseOver(ratingOption);
                if (data[1] != null) {
                    currentPageRating = data[1];
                    self.populateRating(data[1]);
                }
            });
        },

        populateRating: function (rating) {
            var self = this;
            var rating_option = rating;
            $('.priority_custom_widget').children('a').each(function (element) {
                if ($(this).attr('data-index') <= rating_option) {
                    self.rateAddClass(this);
                } else if ($(this).attr('data-index') > rating_option) {
                    self.rateRemoveClass(this);
                }
            });
        },

        getCurrentPageRating: function (event) {
            var self = this;
            self._rpc({
                route: '/get_current_page_rating/',
                params: {
                    'rated_pages': JSON.parse(localStorage.getItem('ratedPages'))
                },
            }).then(function (rating) {
                if (rating != null) {
                    self.populateRating(rating);
                    currentPageRating = rating;
                }
            });
        }

    });

    return publicWidget.registry.PageRating;

});
