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
      this.$elem.addEventListener('input', function () {
        callback(this.value);
      });
    }
  }

  return {
    getByClass: className => {
      const $elems = document.getElementsByClassName(className);

      if ($elems && $elems.length === 1) {
        return new Elem($elems[0]);
      }

      return undefined;
    },
  };

}();
