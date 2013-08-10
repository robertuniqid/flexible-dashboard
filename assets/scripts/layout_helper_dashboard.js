/**
 * @note The Element Group Method has been stopped for now, it will be continued after the basic is done.
 * @author Andrei-Robert Rusu
 */
var LayoutHelperDashboard = {

  namespace          : null,
  layoutBodyObject   : null,
  _options           : {
    container             : null,
    elementEffectIn       : ['fadeInUp', 'fadeInRight', 'fadeInDown', 'fadeInLeft'],//['bounceInUp', 'bounceInRight', 'bounceInDown', 'bounceInLeft']
    defaultEntypo         : '&#128196;',
    defaultColor          : ['#1abc9c', '#16a085', '#f1c40f', '#f39c12', '#2ecc71', '#27ae60', '#e67e22', '#d35400', '#3498db', '#2980b9', '#e74c3c', '#c0392b', '#9b59b6', '#8e44ad', '#34495e', '#2c3e50'],
    hoverTextColor        : '#ffffff',
    backgroundColor       : '#393939',
    hoverEffect                    : 'pulse',
    hoverEffectDuration            : 1000,
    hoverEffectWithContent         : 'flipInY',
    hoverEffectWithContentDuration : 1500,
    minMarginX : 10,
    maxMarginX : 50,
    minMarginY : 10,
    maxMarginY : 30,
    minPaddingX : 10,
    maxPaddingX : 25,
    minPaddingY : 5,
    maxPaddingY : 15
  },
  _dashboardContainerObject : null,
  _dashboardObject   : null,
  _dashboardObjectElementsContainer : null,
  _dashboardElementGroups : {},

  Init : function(options) {
    this.layoutBodyObject = $('html > body');

    this._options = $.extend({}, this._options, options);
    this._options.elementEffectIn = typeof this._options.elementEffectIn == "object" ? $.makeArray(this._options.elementEffectIn) : this._options.elementEffectIn;

    if(typeof this._options.elements_groups != "undefined")
      this._dashboardElementGroups = typeof this._options.elements_groups == "object" ? $.makeArray(this._options.elements_groups) : this._options.elements_groups;

    if(typeof this._options.namespace != "undefined")
      this.namespace = this._options.namespace;

    this._dashboardContainerObject =  typeof this._options.container == "object" ? this._options.container : $(this._options.container);
    this._dashboardContainerObject.html('');

    this._configureDashboard();
  },

  _fetchDefaultColor : function() {
    return (this._options.defaultColor instanceof Array ?
            this._options.defaultColor
                [
                  Math.floor(
                      Math.random() * this._options.defaultColor.length
                  )
                ]
            : this._options.defaultColor);
  },

  _fetchDefaultBackgroundColor : function() {
    return (this._options.backgroundColor instanceof Array ?
            this._options.backgroundColor
                [
                Math.floor(
                    Math.random() * this._options.backgroundColor.length
                )
                ]
            : this._options.backgroundColor);
  },

  _fetchDefaultHoverTextColor : function() {
    return (this._options.hoverTextColor instanceof Array ?
            this._options.hoverTextColor
                [
                  Math.floor(
                      Math.random() * this._options.hoverTextColor.length
                  )
                ]
            : this._options.hoverTextColor);
  },

  _configureDashboard : function() {
    this._assignContainerToLayout();
    this._assignDashboardContent();
    this._HandleTheDisplay();
  },

  _assignContainerToLayout : function() {
    var html = '';

    html += '<section id="' + this.namespace + '-container" class="' + this.namespace + '">' +
              '<section class="element_groups_container"></section>' +
            '</section>';

    this._dashboardContainerObject.append(html);

    this._dashboardObject = $("#" + this.namespace + '-container');
  },

  _assignDashboardContent : function() {
    var objectInstance = this;
    this._dashboardObjectElementsContainer = this._dashboardObject.find('.element_groups_container');
    this._dashboardObjectElementsContainer.html('');

    $.each(this._dashboardElementGroups, function(index){
      objectInstance
          ._dashboardObjectElementsContainer
          .append(
              objectInstance._fetchDashboardElementHTMLAtIndex(index)
          );
      objectInstance._setDefaultStateDashboardElementHTMLAtIndex(index);
    });

    objectInstance
        ._dashboardObjectElementsContainer
        .append('<div style="clear:both;visibility: none;"></div>');

    this._assignDashboardElementsTriggers();
  },

  /**
   * This will use the addCSS function, in order to avoid jquery hover
   * @param group_index
   * @returns {string}
   * @private
   */
  _fetchDashboardElementHTMLAtIndex : function(group_index) {
    if(typeof this._dashboardElementGroups[group_index] == "undefined")
      return '';

    var elementInformation = this._dashboardElementGroups[group_index];
    var color = typeof elementInformation.color == "undefined" ? this._fetchDefaultColor() : elementInformation.color,
        backgroundColor= typeof elementInformation.backgroundColor == "undefined" ? this._fetchDefaultBackgroundColor() : elementInformation.backgroundColor,
        hoverTextColor = typeof elementInformation.hoverTextColor == "undefined" ? this._fetchDefaultHoverTextColor() : elementInformation.hoverTextColor;

    var html = '',
        elementContent = '<a href="' + elementInformation.link + '">' +
                          '<span class="entypo">' +
                          (
                              typeof elementInformation.entypo == "undefined"
                                  ? this._options.defaultEntypo : elementInformation.entypo
                              ) +
                          '</span>' +
                          '<span>' + elementInformation.name + '</span>' +
                         '</a>';

    html = '<section class="element-' + group_index + ' element ' +
              (typeof elementInformation.class == "undefined" ? '' : elementInformation.class) + '"' +
              'data-color="' + color + '"' +
              'data-base-content="' + encodeURI(elementContent) + '"' +
              'data-background-color="' + backgroundColor + '"' +
              'data-hover-effect="' + (typeof elementInformation.hover_content == "undefined" ? this._options.hoverEffect : this._options.hoverEffectWithContent) + '"' +
              'data-hover-effect-duration="' + (typeof elementInformation.hover_content == "undefined" ? this._options.hoverEffectDuration : this._options.hoverEffectWithContentDuration) + '"' +
              'data-hover-text-color="' + hoverTextColor + '"' +
              (typeof elementInformation.hover_content != "undefined" ? 'data-hover-content="' + encodeURI(elementInformation.hover_content) + '"' : '')+
             '>' + elementContent + '</section>';

    return html;
  },

  _setDefaultStateDashboardElementHTMLAtIndex : function(index, triggerEffect) {
    var elementObject = typeof index == "object" ? index : this._dashboardObjectElementsContainer.find('> .element-' + index);

    triggerEffect = typeof triggerEffect == "undefined" ? false : triggerEffect;

    if(typeof elementObject.attr('data-base-content') != "undefined")
      elementObject.html(decodeURI(elementObject.attr('data-base-content')));

    elementObject.find('> a > span').css('color', elementObject.attr('data-color'));
    elementObject.css('background-color', elementObject.attr('data-background-color'));

    if(triggerEffect) {
      elementObject.removeClass('animated ' + elementObject.attr('data-assigned-effect'));
      elementObject.removeAttr('data-assigned-effect');

      elementObject.attr('data-assigned-effect', elementObject.attr('data-hover-effect'));
      elementObject.addClass('animated ' + elementObject.attr('data-hover-effect'));
    }
  },

  _setHoverStateDashboardElementHTMLAtIndex : function(index) {
    var elementObject = typeof index == "object" ? index : this._dashboardObjectElementsContainer.find('> .element-' + index);

    elementObject.find('> a > span').css('color', elementObject.attr('data-hover-text-color'));
    elementObject.css('background-color', elementObject.attr('data-color'));

    if(typeof elementObject.attr('data-assigned-effect') != "undefined") {
      elementObject.removeClass('animated ' + elementObject.attr('data-assigned-effect'));
      elementObject.removeAttr('data-assigned-effect');
    }

    elementObject.attr('data-assigned-effect', elementObject.attr('data-hover-effect'));
    elementObject.addClass('animated ' + elementObject.attr('data-hover-effect'));

    if(typeof elementObject.attr('data-hover-content') != 'undefined') {
      elementObject.html(decodeURI(elementObject.attr('data-hover-content')));
    }

    setTimeout(function(){
      elementObject.removeClass('animated ' + elementObject.attr('data-assigned-effect'));
      elementObject.removeAttr('data-assigned-effect');
    }, elementObject.attr('data-hover-effect-duration'));
  },

  _assignDashboardElementsTriggers : function() {
    var objectInstance = this;

    this._dashboardObjectElementsContainer.find('> .element').hover(function(){
      objectInstance._setHoverStateDashboardElementHTMLAtIndex($(this));
    }, function(){
      objectInstance._setDefaultStateDashboardElementHTMLAtIndex($(this), true);
    });
  },

  _HandleTheDisplay : function() {
    var objectInstance = this;

    objectInstance._dashboardObjectElementsContainer.find(' > .element').hide();

    objectInstance._dashboardObject.fadeIn('slow').promise().done(function(){
      objectInstance.RecursiveAssignElementEffect();
    });
  },

  RecursiveAssignElementEffect : function() {
    var objectInstance = this;

    if(this._haveAllDashboardElementsTriggered() ) {
      return;
    }

    var currentElement = this._dashboardObjectElementsContainer.find('> .element').not(':visible').filter(':first');

    if(typeof currentElement.attr('data-assigned-effect') != "undefined") {
      currentElement.removeClass(currentElement.attr('data-assigned-effect'));
      currentElement.removeAttr('data-assigned-effect');
    }

    var effect = (objectInstance._options.elementEffectIn instanceof Array ?
        objectInstance._options.elementEffectIn
        [
            Math.floor(
                Math.random() * objectInstance._options.elementEffectIn.length
            )
        ]
        : objectInstance._options.elementEffectIn);

    currentElement.show()
                  .attr('data-assigned-effect', effect)
                  .addClass('animated ' + effect);

    setTimeout(function(){
      objectInstance.RecursiveAssignElementEffect();
    }, 50)
  },

  _haveAllDashboardElementsTriggered : function() {
    return !(this._dashboardObjectElementsContainer.find('> .element:hidden').length > 0);
  }

};
