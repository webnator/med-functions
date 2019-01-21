// Run when the document is all set.
$(document).ready(function () {
  var url = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js";
  $.getScript(url, function () {
    console.log('bs-script loaded');
  });

  //// Legal modal functions
  // Sets the legal box checkbox to false by default
  $('#legal_box').prop('checked', false);

  //Catches the checkbox click in order to show the legal form and stop the 'tick' event
  $('#legal_box').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();

    //Opens the legal box modal
    $('#legal_modal').modal('show');
  });

  //Function for legal agreement
  $('#disagree_legal').on('click', function () {
    $('#legal_box').prop('checked', false);
    $('#legal_modal').modal('hide');
  });
  $('#agree_legal').on('click', function () {
    $('#legal_box').prop('checked', true);
    $('#legal_modal').modal('hide');
  });
  //// END Legal modal functions

  //// Panel functions
  $('.initials-section').each(function () {
    var section_id = $(this).data('id');
    var section_title = $(this).data('title') || '';
    var section_required = $(this).data('required') ? ' validate[required]' : '';
    var section_body = $(this).html();

    // Remove the body
    $(this).html('');

    $(this).addClass('panel panel-info');

    var div_heading = $('<div/>', {
      class: 'panel-heading',
      id: section_id,
      role: 'tab'
    })
      .append($('<div/>', {class: 'row'})
        .append($('<div/>',
          {
            'aria-controls': section_id + '_collapse',
            'aria-expanded': 'true',
            'class': 'col-xs-8 collapsed collapse-button',
            //'data-parent': section_parent,
            //'data-toggle': 'collapse',
            //href: '#' + section_id + '_collapse',
            role: 'button',
            html: section_title
          })
        )
        .append($('<div/>',
          {
            'class': 'col-xs-4',
            style: 'text-align:right;'
          })
          .append($('<span/>',
            {
              'aria-hidden': 'true',
              'class': 'glyphicon glyphicon-chevron-down acc-down hidden-xs collapse-button',
              //'data-parent': section_parent,
              //'data-toggle': 'collapse',
              //href: '#' + section_id + '_collapse',
              html: '&nbsp;'
            }
          ))
          .append($('<div/>', {'class': 'form-group has-feedback initials'})
            .append($('<label/>',
              {
                'class': 'control-label sr-only',
                'for': section_id + '_initials',
                html: 'Hidden label'
              })
            )
            .append($('<input/>',
              {
                'aria-describedby': section_id + '_initials_status',
                'class': 'form-control' + section_required,
                id: section_id + '_initials',
                name: section_id + '_initials',
                type: 'text',
              })
            )
            .append($('<span/>',
              {
                'class': 'sr-only',
                id: section_id + '_initials_status',
                html: '(success)'
              })
            )
          )
        )
      );

    var div_collapsepanel = $('<div/>', {
      'aria-labelledby': section_id,
      'class': 'panel-collapse collapse',
      id: section_id + '_collapse',
      role: 'tabpanel'
    })
      .append($('<div/>', {
        'class': 'panel-body',
        html: section_body
      }));

    $(this).append(div_heading);
    $(this).append(div_collapsepanel);

  });

  $('.collapse-button').on('click', function () {
    var panel = $(this).closest('.panel-info').find('.panel-collapse');
    toggleCollapsePanel(panel);
  });

  //Initials
  $('.initials').on('change', function () {
    var value = $(this).find('input').val();
    if (value !== '') {
      $(this).find('.glyphicon').removeClass('hidden');
      $(this).addClass('has-success');
    } else {
      $(this).find('.glyphicon').addClass('hidden');
      $(this).removeClass('has-success');
    }
  });

  $('.initials').find('input[type=text]').on('focus', function () {
    var panel = $(this).closest('.initials').closest('.panel-info').find('.panel-collapse');
    $(panel).collapse('show');
    if (!panelIsValid(panel)) {
      $(this).blur();
      alert('You need to read and complete all the required fields on this section in order to be able to sign. Please complete them now');
    } else {
      setTimeout(function () {
        $(panel).collapse('hide');
      }, 300);
    }
  });

  $('.initials').find('input').val('');

  //Set the return button
  var return_link = $('<a></a>', {
    'class': 'return',
    'html': 'Close section and sign with initials'
  });

  $('.panel-collapse .panel-body').append(return_link);

  $('.return').on('click', function () {
    var panel = $(this).closest('.panel-collapse');
    var initials = $(panel).closest('.panel-info').find('input').first();
    $(window).scrollTo($(initials), {'margin': true, 'offset': -100});
    $(initials).focus();
  });

  function toggleCollapsePanel(panel) {
    if (panelCollapseState(panel) === 'closed') {
      $(panel).collapse('show');
    } else if (!panelIsValid(panel)) {
      alert('You need to read and complete all the required fields on this section in order to be able to sign. Please complete them now');
      $(panel).collapse('show');
    } else {
      $(panel).collapse('hide');
    }
  }

  function panelCollapseState(panel) {
    var classes = $(panel).attr('class').split(/\s+/);
    for (var i = 0; i < classes.length; i++) {
      if (classes[i].toLowerCase() === 'in') {
        return 'open';
      }
    }
    return 'closed';
  }

  function panelIsValid(panel) {
    var div_body = $(panel).find('.panel-body').first();
    var valid = true;
    $(div_body).find('.validate\\[required\\]').each(function () {
      if ($(this).is(':visible') && !validateField($(this))) {
        valid = false;
      }
    });
    return valid;
  }

  function validateField(fieldToValidate) {
    return !!$(fieldToValidate).val();
  }

  //// END Panel functions

  //// Set document dates and date-picker
  $('.document-date').each(function () {
    var ele_id = $(this).prop('id');
    $(this).attr('name', ele_id);
    $(this).prop('readonly', true);
    make_id(ele_id);
  });

  $('.datepicker').each(function () {
    $(this).datepicker();
  });
  //// END Set document dates and date-picker

  //// Signature functions
  $('.make-signature').each(function () {
    $(this).append($(this).data('text'));
    var txtClass = "make-signature-text";
    if ($(this).data('required') && $(this).data('required') === true) {
      txtClass += " validate[required]";
    }
    if ($(this).data('class')) {
      txtClass += " " + $(this).data('class');
    }
    var txtField = '<input type="text" id="' + $(this).attr('id') + '_image' + '" name="' + $(this).attr('id') + '" class="' + txtClass + '" /><br/>';
    $(this).append(txtField);
    var CVS = document.createElement('canvas');
    CVS.width = 500;
    CVS.height = 100;
    $(this).append(CVS);

    if (!$('#signature-font').length) {
      var link = document.createElement('link');
      link.id = 'signature-font';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'https://fonts.googleapis.com/css?family=Homemade+Apple';
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    $(this).append('<input type="hidden" ' +
      'id="' + $(this).attr('id') + '_raw' + '" ' +
      'name="' + $(this).attr('id') + '_image"' +
      'value="" />');
  });

  $('.make-signature-text').on('change keyup', function () {
    var parent = $(this).parent();
    var canvas = $(parent).find('canvas');
    setSignatureFromText($(this).val(), canvas[0], parent);
  });
  function setSignatureFromText(text, canvas, parent) {
    var ctx = canvas.getContext('2d');
    var image = new Image();
    image.src = 'null';
    image.onerror = function () {
      ctx.font = '2em "Homemade Apple"';
      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.moveTo(0, 0);
      ctx.textAlign = 'start';
      ctx.fillStyle = "#000";
      ctx.fillText(text, 8, canvas.height / 1.5);
      $('#' + $(parent).attr('id') + '_raw').val(canvas.toDataURL("image/jpeg"));
    };
  }

  //// END Signature functions

  //// Loader function
  $('.load-screen').each(function () {
    $(this).append('<div class="uil-ring-css"><div>&nbsp;</div></div>');
  });
  //// END Loader function

  //// Auto-populate function
  if (populateFields) {
    for (var x = 0; x < Object.keys(populateFields).length; x++) {
      var key = Object.keys(populateFields)[x];
      $("[id='" + key + "']").on('change', function () {
        var fields = populateFields[$(this).attr('id')];
        for (var i = 0; i < fields.length; i++) {
          var field = "[id='" + fields[i] + "']";
          $(field).val($(this).val());
        }
      });
    }
  }
  //// END Auto-populate function

  //// Validation functions
  function areTextsEmpty(texts) {
    for (var i = 0; i < texts.length; i++) {
      if (texts[i] == '') {
        return true;
      }
    }
  }

  function areSignaturesMissing(signatures) {
    for (var i = 0; i < signatures.length; i++) {
      if (!signatures[i].isSigned() || signatures[i].isSigned() < 50) {
        return true;
      }
    }
  }

  //// END Validation functions

  /// Custom form functions

  // Auto hide functions
  $('.conditional-hide').on('change', function () {
    var target = $(this).data('target');
    var checked = $(this).is(':checked');
    checked = $(this).data('reverse') ? !checked : checked;

    if (checked) {
      $('#' + target).hide();
    } else {
      $('#' + target).show();
    }
  });

});

function make_id(field_id) {
  var ma = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var _date = new Date();
  var _ds1 = ma[_date.getMonth()] + ' ' + _date.getDate() + ", " + _date.getFullYear();

  // Assign with jQuery to field.
  // jQuery included in FormBuilder forms
  $('#' + field_id).val(_ds1);
}

//// Submit functions
var saveForLater = false;
function returnLater() {
  console.log('Return later');
  saveForLater = true;
  sf_save.save();
}

function doSubmitForm() {
  var load_screen = $('.load-screen');
  load_screen.show();
  var f = $('#secureform');
  var ok = f.validationEngine('validate');
  if (!ok) {
    load_screen.hide();
    return false;
  }

  ok = secureform_submit();
  if (!ok) {
    load_screen.hide();
    return false;
  }

  // Resumed form link?
  var resumed = '';
  if (window.sf_save) {
    var code = sf_save.getUrlParameter('resume');	// Resume URL
    if (code && String(code).match(/^.:/)) {        // OK
      resumed = code;
    }
  }

  // Submit via AJAX if there are no file input fields
  if (ok && $('#secureform input[type="file"]').length === 0) {
    if (resumed) {
      resumed = '&__resumed_form__=' + encodeURIComponent(resumed);
    }
    else {
      resumed = '';
    }

    $.ajax({
      type: 'POST',
      url: f.attr('action'),
      data: f.serialize() + '&__ajax__submit__=1' + resumed,
      crossDomain: true,
      dataType: 'text'
    })
      .fail(function (data) {
        load_screen.hide();
        alert('Failed to submit form.  Please check your Internet connection and try again in a few minutes.');
      })

      .success(function (data) {
        load_screen.hide();
        window.top.location.href = data;
      });
    return false;
  }

  if (ok && resumed) {
    f.append('<input type=hidden name=__resumed_form__ value="' + resumed + '">');
  }

  // Regular submit with files
  return !!ok;
}
//// END Submit functions



/**
 * Copyright (c) 2007-2015 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 2.1.2
 */
;(function(f){"use strict";"function"===typeof define&&define.amd?define(["jquery"],f):"undefined"!==typeof module&&module.exports?module.exports=f(require("jquery")):f(jQuery)})(function($){"use strict";function n(a){return!a.nodeName||-1!==$.inArray(a.nodeName.toLowerCase(),["iframe","#document","html","body"])}function h(a){return $.isFunction(a)||$.isPlainObject(a)?a:{top:a,left:a}}var p=$.scrollTo=function(a,d,b){return $(window).scrollTo(a,d,b)};p.defaults={axis:"xy",duration:0,limit:!0};$.fn.scrollTo=function(a,d,b){"object"=== typeof d&&(b=d,d=0);"function"===typeof b&&(b={onAfter:b});"max"===a&&(a=9E9);b=$.extend({},p.defaults,b);d=d||b.duration;var u=b.queue&&1<b.axis.length;u&&(d/=2);b.offset=h(b.offset);b.over=h(b.over);return this.each(function(){function k(a){var k=$.extend({},b,{queue:!0,duration:d,complete:a&&function(){a.call(q,e,b)}});r.animate(f,k)}if(null!==a){var l=n(this),q=l?this.contentWindow||window:this,r=$(q),e=a,f={},t;switch(typeof e){case "number":case "string":if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(e)){e= h(e);break}e=l?$(e):$(e,q);case "object":if(e.length===0)return;if(e.is||e.style)t=(e=$(e)).offset()}var v=$.isFunction(b.offset)&&b.offset(q,e)||b.offset;$.each(b.axis.split(""),function(a,c){var d="x"===c?"Left":"Top",m=d.toLowerCase(),g="scroll"+d,h=r[g](),n=p.max(q,c);t?(f[g]=t[m]+(l?0:h-r.offset()[m]),b.margin&&(f[g]-=parseInt(e.css("margin"+d),10)||0,f[g]-=parseInt(e.css("border"+d+"Width"),10)||0),f[g]+=v[m]||0,b.over[m]&&(f[g]+=e["x"===c?"width":"height"]()*b.over[m])):(d=e[m],f[g]=d.slice&& "%"===d.slice(-1)?parseFloat(d)/100*n:d);b.limit&&/^\d+$/.test(f[g])&&(f[g]=0>=f[g]?0:Math.min(f[g],n));!a&&1<b.axis.length&&(h===f[g]?f={}:u&&(k(b.onAfterFirst),f={}))});k(b.onAfter)}})};p.max=function(a,d){var b="x"===d?"Width":"Height",h="scroll"+b;if(!n(a))return a[h]-$(a)[b.toLowerCase()]();var b="client"+b,k=a.ownerDocument||a.document,l=k.documentElement,k=k.body;return Math.max(l[h],k[h])-Math.min(l[b],k[b])};$.Tween.propHooks.scrollLeft=$.Tween.propHooks.scrollTop={get:function(a){return $(a.elem)[a.prop]()}, set:function(a){var d=this.get(a);if(a.options.interrupt&&a._last&&a._last!==d)return $(a.elem).stop();var b=Math.round(a.now);d!==b&&($(a.elem)[a.prop](b),a._last=this.get(a))}};return p});