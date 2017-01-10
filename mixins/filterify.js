// Use in conjunction with Sparse Array from Emberella.

import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const DEBOUNCE_MS = 500;

export default Ember.Mixin.create({
  options: Ember.computed(function() {
    var opt = {};
    const term = this.get('searchTerm');
    if (term) {
      opt.filter.search = term;
    }

    const sort = this.get('sort');
    if (sort) {
      opt.sort = sort;
    }
    return opt;
  }),

  searchTask: task(function * () {
    yield timeout(DEBOUNCE_MS);
    const options = this.get('options');

    if (!options.filter) {
      options.filter = {};
    }
    options.filter.search = this.get('searchTerm');
    this.get('content').reset();
  }).restartable(),

  actions: {
    search(term) {
      this.set('searchTerm', term);
      this.get('searchTask').perform();
    },

    sortBy(value, label, reverse = false) {
      const currentSort = this.get('sort');
      if (reverse && value === currentSort && currentSort[0] !== '-') {
        value = '-' + value;
      }
      this.setProperties({
        sort: value,
        sortLabel: label
      });
      this.refresh();
    }
  }
});
