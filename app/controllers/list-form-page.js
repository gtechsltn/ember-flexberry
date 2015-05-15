import Ember from 'ember';
import PaginatedControllerMixin from 'prototype-ember-cli-application/mixins/paginated-controller';
import SortableControllerMixin from 'prototype-ember-cli-application/mixins/sortable-controller';
import SortableColumnMixin from 'prototype-ember-cli-application/mixins/sortable-column';
import EmberTableColumnDefinition from '../column-definition';
import ListTableCellView from 'prototype-ember-cli-application/views/ember-table/list-table-cell';

export default Ember.ArrayController.extend(PaginatedControllerMixin, SortableControllerMixin, {
    actions: {
        /**
         * Обработчик клика по строке таблицы.
         *
         * @param {Ember.Object} rowContent Объект данных, соответствующий строке.
         */
        rowClick: function (rowContent) {
          // TODO: rowContent.constructor(.typeKey) instead of rowContent.get(_view.type)?
            this.transitionToRoute(rowContent.get('_view.type'), rowContent.get('primaryKey'));
        }
    },

    /**
     * Описание колонок для компонента ember-table. Формируется на основе представления.
     * ToDo: сейчас представление берется из первого объекта в модели. Его там может и не быть.
     */
    tableColumns: Ember.computed('view', 'computedSorting', function() {
        var model = this.get('model'),
            sorting = this.get('computedSorting');
        if (model.length === 0) {
            return {};
        } else {
            return model.objectAt(0).get('_view').properties.map(function (propName) {
                var columnDefinition = EmberTableColumnDefinition.createWithMixins(SortableColumnMixin, {
                    columnWidth: 150,
                    textAlign: 'text-align-center',
                    headerCellName: propName,
                    tableCellViewClass: ListTableCellView,
                    getCellContent: function (row) {
                        return row.content.get(propName);
                    }
                });

                var sortDef = sorting[propName];
                if (sortDef) {
                    columnDefinition.set('sorted', true);
                    columnDefinition.set('sortAscending', sortDef.sortAscending);
                    columnDefinition.set('sortNumber', sortDef.sortNumber);
                }

                return columnDefinition;
            });
        }
    }),

    /**
     * Контент для отображения в таблице ember-table. Соответствует модели.
     */
    tableContent: Ember.computed('model', function() {
        return this.get('model');
    })
});
