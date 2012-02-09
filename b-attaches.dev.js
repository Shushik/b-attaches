/**
 * b-attaches script
 *
 * @version 2.0
 * @author  Shushik <silkleopard@yandex.ru>
 * @page    http://github.com/Shushik/b-attaches
 *
 * @requires jQuery 1.6+
 */
;(function($) {


    /**
     * @public
     * @this   {jQuery}
     * @return {jQUery}
     */
    $.fn.files = function() {
        var
            $this = this;

        // Replace each input type file with the custom input
        if ($this.length > 0) {
            $this.each(field_create);
        }

        return this;
    }


    /**
     * @private
     * @this    {HTMLNode}
     */
    function
        field_create() {
            var
                $this  = $(this).addClass('b-attaches__input'),
                $raw   = $this.clone(),
                params = this.onclick();

            // If params object doesn`t exist, create it
            if (!params) {
                params = {};
            }

            // Set default value for button text
            if (!params.attaches_add) {
                params.attaches_add = 'Add file';
            }

            var
                $attaches = $(
                              '<div class="b-attaches"></div>'
                            ),
                $example  = $(
                              '<div class="b-attaches__example">' +
                                  '<span class="b-attaches__text">' + params.attaches_add + '</span>' +
                                  '<span class="b-attaches__remove">×</span>' +
                              '</div>'
                            );

            // Save params
            $attaches.data('params', params);

            // Set onchange event handler
            $raw.bind(
                'change',
                field_change
            );

            // Set click event on remove cross
            $attaches.delegate(
                '.b-attaches__remove',
                'click',
                field_remove
            );

            // Append field raw object to example html
            $example.append($raw);

            // Replace field with the generated html
            $this.replaceWith($attaches.append($example));

            // Create the first button
            example_clone.call($attaches.get(0));
        }


        /**
         * @private
         * @this    {HTMLNode}
         *
         * @param {Event} event
         */
        function
            field_change(event) {
                var
                    $input    = $(this),
                    $attach   = $input.closest('.b-attaches__button'),
                    $attaches = $attach.closest('.b-attaches'),
                    $text     = $('.b-attaches__text', $attach),
                    params    = $attaches.data('params'),
                    title     = $input.val().split(/\/|\\/).pop(),
                    value     = title,
                    length    = value.length,
                    extention = value.split('.').pop();

                // Crop filname in the middle
                if (params.attaches_crop && value.length > params.attaches_crop) {
                    value = value.substring(0, 5) + 
                            ' … ' +
                            value.substring(length - 8);
                }

                // Get the file extention and set a bem modifyer
                if (extention) {
                    $attach.addClass('b-attaches__label_type_' + extention.toLowerCase());
                }

                // Magicly transform a button into a label
                $attach
                .removeClass('b-attaches__button')
                .addClass('b-attaches__label');

                // Set file value into a title and into a inner text
                $text
                .text(value)
                .attr('title', title);

                // Transform example into a button
                example_clone.call($attaches.get(0));
            }


        /**
         * @private
         * @this    {HTMLNode}
         *
         * @param {Event} event
         */
        function
            field_remove(event) {
                // Remove label from DOM
                $(this).closest('.b-attaches__label').detach();
            }


        /**
         * @private
         * @this    {HTMLNode}
         */
        function
            example_clone() {
                var
                    $example = $('.b-attaches__example', $(this)),
                    $fresh   = $example.clone(true)
                               .removeClass('b-attaches__example')
                               .addClass('b-attaches__button');

                // Append cloned element into DOM
                $example.after($fresh);
            }


})(jQuery);