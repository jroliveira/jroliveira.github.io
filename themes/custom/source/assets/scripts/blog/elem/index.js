blog.elem = function () {
  'use strict';

  class Elem {
    constructor($elem) {
      this.$elem = $elem;
    }

    html(content) {
      this.$elem.innerHTML = content;
    }

    onChange(callback) {
      this.$elem.addEventListener('input', function (e) {
        if (this.value.trim().length <= 0) {
          return;
        }

        callback(this.value);
      });
    }
  }

  return {
    getById: elemId => new Elem(document
      .getElementById(elemId)),
  };

}();
