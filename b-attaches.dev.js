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
            example_to_button.call($attaches.get(0));
        }


        /**
         * @private
         * @this    {HTMLNode}
         * @param   {Event}    event
         */
        function
            field_change(event) {
                var
                    file     = '',
                    attaches = $(this).closest('.b-attaches').get(0);

                if (this.files) {
                    //
                    for (file in this.files) {
                        if (this.files.hasOwnProperty(file) && typeof this.files[file] == 'object') {
                            button_to_label.call(
                                file == 0 ? this : attaches,
                                this.files[file]
                            );
                        }
                    }
                } else {
                    //
                    button_to_label.call(this);
                }

                // Transform example into a button
                example_to_button.call(attaches);
            }


        /**
         * @private
         * @this    {HTMLNode}
         * @param   {Event} event
         */
        function
            field_remove(event) {
                // Remove label from DOM
                $(this).closest('.b-attaches__label').detach();
            }


        /**
         * @private
         * @this    {HTMLNode}
         * @return  {jQuery}
         */
        function
            example_to_button() {
                var
                    $example = $('.b-attaches__example', $(this)),
                    $fresh   = $example.clone(true)
                               .removeClass('b-attaches__example')
                               .addClass('b-attaches__button');

                // Append cloned element into DOM
                $example.closest('.b-attaches').append($fresh);

                return $example;
            }


        /**
         * @private
         * @this    {HTMLNode}
         * @return  {jQuery}
         *
         * @param {Object} info
         */
        function
            example_to_label(info) {
                var
                    $attaches = $(this),
                    $example  = $('.b-attaches__example', $attaches),
                    $fresh    = $example.clone(true)
                                .removeClass('b-attaches__example')
                                .addClass('b-attaches__label')
                               .addClass('b-attaches__label_type_' + info.name.split('.').pop()),
                    params    = $attaches.data('params');

                $('.b-attaches__text', $fresh)
                .text(value_crop(info.name, params.attaches_crop))
                .attr('title', info.name);

                // Append cloned element into DOM
                $attaches.prepend($fresh);

                return $example;
            }


        /**
         * @private
         * @this    {HTMLNode}
         *
         * @param {Object} info
         */
        function
            button_to_label(info) {
                var
                    $this     = $(this),
                    $button   = null,
                    $attaches = null,
                    value     = '',
                    params    = null;

                if ($this.hasClass('b-attaches__input')) {
                    $button   = $this.closest('.b-attaches__button'),
                    $attaches = $button.closest('.b-attaches');
                    params    = $attaches.data('params'),
                    value     = $this.val();

                    //
                    $button
                    .removeClass('b-attaches__button')
                    .addClass('b-attaches__label')
                    .addClass('b-attaches__label_type_' + value.split('.').pop());

                    //
                    $('.b-attaches__text', $button)
                    .attr('title', value)
                    .text(value_crop(value, params.attaches_crop));
                } else {
                    //
                    example_to_label.call(this, info);
                }
            }


        /**
         * @private
         * @this    {HTMLNode}
         * @return  {String}
         *
         * @param {String} value
         * @param {Number} maxlength
         */
        function
            value_crop(value, maxlength) {
                maxlength = maxlength || false;
                value     = value.split(/\/|\\/).pop();

                var
                    length = value.length;

                if (maxlength && length > maxlength) {
                    value = value.substring(0, 5) + 
                            ' … ' +
                            value.substring(length - 8);
                }

                return value;
            }


})(jQuery);