var ListsView = Backbone.View.extend({
  el: $('#lists').get(0),
  template: App.templates.lists,
  events: {
    'click .list > .overlay, .list > .modal .close, .list > header .more': 'toggleMoreOptionsModal',
    'focusout .title': 'updateListName',
    'click .actions .archive': 'destroyList',
  },
  toggleMoreOptionsModal: function (e) {
    var $list = $(e.target).closest('.list');
    $list.find('> .modal, > .overlay').toggle();
  },
  updateListName: function (e) {
    var $titleTextarea = $(e.target);
    var newName = $titleTextarea.val().trim();
    var listId = $titleTextarea.closest('.list').attr('data-id');
    var list = this.collection.get(listId);

    if (newName !== list.get('name')) {
      list.set('name', newName);
    }
  },
  destroyList: function (e) {
    var listId = $(e.target).closest('.list').attr('data-id');
    var list = this.collection.get(listId);

    this.collection.trigger('destroy_list', list);
  },
  render: function () {
    var lists = this.collection.toJSON();

    this.$el.html(this.template({ lists: lists }));

    App.trigger('render_board');

    this.collection.each(function (list) {
      new CardsView({
        collection: list.get('cards'),
        el: this.$el.find('.list[data-id=' + list.id + '] .cards').get(0),
      });
    }.bind(this));
  },
  bindSortingEvents: function () {
    this.sortableAndMoveableLists();
    this.tiltListWhileSorting();
    this.updateListsInfoOnDrop();
  },
  sortableAndMoveableLists: function ($lists) {
    this.$el.sortable({
      forcePlaceholderSize: true,
      placeholder: "sortable-list-placeholder",
      items: '> li',
      tolerance: 'pointer',
      handle: '> header',
    });

    this.$el.disableSelection();
  },
  tiltListWhileSorting: function () {
    this.$el.on('sortstart sortstop', function (event, ui) {
      ui.item.toggleClass('tilted', event.type === 'sortstart');
    });
  },
  updateListsInfoOnDrop: function () {
    this.$el.on('sortstop', this.updateListsOnSort.bind(this))
  },
  updateListsOnSort: function (event, ui) {
    if (event.target !== event.currentTarget) { return; }

    var $list = ui.item;
    var listId = $list.attr('data-id');
    var listNewPosition = this.$el.find('.list').index($list);
    var list = this.collection.remove(listId, { silent: true });

    this.collection.trigger('move_list_remove', list);
    list.set('position', listNewPosition);
    this.collection.add(list, { silent: true });
    this.collection.trigger('move_list_add', list);
  },
  initialize: function () {
    this.render();
    this.listenTo(this.collection, 'create_list destroy_list', this.render);
    this.bindSortingEvents();
  },
});