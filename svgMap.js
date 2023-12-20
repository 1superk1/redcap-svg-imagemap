/*
 *
 * MODIFIED
 *    $Date: Sun Nov 19 15:02:14 IST 2023$
 *
 */

$(document).ready(function() {
    $.each(UIOWA_SvgMap.embedFields, function(index, field) {
        let $embedField = $("[sq_id='" + field + "'] > td > div[data-kind='field-label']  > div");
	if ($embedField.length === 0)
	    $embedField = $("[var='" + field + "'] div[data-kind='field-label'] div[data-mlm-field='" + field + "']")

        // if embed target field exists on this form, embed SVG
        if ($embedField.length > 0) {
            $embedField
                .append("<object" +
                    " class='svg-map'" +
                    " svg-index=" + index +
                    " svg-choice-field='" + UIOWA_SvgMap.choiceFields[index] + "'" +
                    " data=" + UIOWA_SvgMap.svgUrl + '&svg_id=' + index +
                    " type='image/svg+xml'" +
                "></object>");
        }
    })

    $('.svg-map').each(function() {
        this.addEventListener('load', function() {
            let $svg = $(this);
            let $contents = $svg.contents();

            // locate the choice field. If it is suffixed with '-tr'
	        // it means that the svg image was not embedded inside
	        // another display field
            let $choiceField = $('#' + $svg.attr('svg-choice-field') + '-tr');

            // update field td to fit loaded SVG
            $svg.parent().height($contents.height());
	        $svg.parent().width($contents.width());

            //$choiceField.find('.data input')
	        let $data_cls = ".data";
	        let $hidden_cls = [];
     	    try {
                // split-filter of the class attribute to locate a
		        // possible 'hide' class. This is inside a try-catch
		        // to avoid errors when $hidden_cls is empty
        	    $hidden_cls = $choiceField.attr('class').split(/\s+/).filter( function(e) { return e === 'hide' } );
      	    }
     	    catch(e) {  /* console.log(e)  */  };

            if ($hidden_cls.length > 0) {       // field embedding took place. Update the choice variable in its original location
                   $choiceField = $('.rc-field-embed[var="' + $svg.attr('svg-choice-field') + '"]');   // update the choice variable
                   $data_cls = "";     // no data class in the current choice variable
            }
            $choiceField.find($data_cls + ' input')
                // update map if input clicked
                .on('click', function() {
                    updateMap($svg, this);
                })
                // sync map to previously saved selections
                .each(function() {
                    updateMap($svg, this);
                })

            // update input if map clicked
            $contents.find('a').on('click', function(e) {
                e.preventDefault();

                let code = $(this).data('rc-choice');
                $choiceField.find('[code="' + code + '"]').trigger('click');
            })
        }, true)
    })

    function updateMap($svg, input) {
        let code = $(input).attr('code');
        let $a = $svg.contents().find('a[data-rc-choice="' + code +'"]');

        // todo add support for radio/dropdown fields
        $(input).prop('checked') ? $a.addClass('selected') : $a.removeClass('selected');
    }
})