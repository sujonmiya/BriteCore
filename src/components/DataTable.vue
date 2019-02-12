<template>
    <div class="layout--data-table">
        <div class="layout--data-table__title layout--row row--flex row--flex__centerh row--flex__space--between">
            <div class="layout--row row--flex row--flex__centerh">
                <h3 style="margin-right: 16px">{{title}}</h3>

                <button class="layout--button button--transparent"
                            style="margin-right: 16px"
                            @click="onAdd">
                    <div class="layout--row row--flex row--flex__centerh">
                        <i class="material-icons" style="margin-right: 8px">
                            add
                        </i>
                        Add
                    </div>
                </button>
                <button class="layout--button button--transparent"
                        :disabled="!hasSelected"
                    @click="onDeletes">
                    <div class="layout--row row--flex row--flex__centerh">
                        <i class="material-icons" style="margin-right: 8px">
                            delete_outline
                        </i>
                        Delete
                    </div>
                </button>
            </div>

            <DataTableSearch :filters="fields"
                             @search="onSearch"
                            @change="onFilterChange"
                            @filter="onFilter"/>
        </div>

        <DataTableHeader :fields="fields"
                         @select="onSelectAll"
                         @sort="onSort" />

        <div class="layout--data-table__body" style="min-height: 50px">
            <DataTableRow  v-for="(row, idx) in rows"
                           :key="idx"
                           :id="row.id"
                           ref="rows"
                            :model="row"
                           :fields="fields"
                          :editables="editables"
                          :excludes="excludes"
                          @select="onSelect"
                          @deselect="onDeselect"
                          @update="onUpdate"
                          @delete="onDelete" />

            <p v-if="rows.length === 0">No {{schema|lowercase|pluralize}} found</p>

            <div v-if="loading"
                 :class="['layout--data-table__body--loading', {'is--loading': loading}]">
                <h4>loading...</h4>
            </div>
        </div>

        <DataTableFooter :total="total"
                         :limit="perPage"
                         :schema="schema"
                         @change="onRowsPerPageChange"
                        @prev="onPrevious"
                        @next="onNext" />

        <DataTableModal title="Delete?"
                        @ok="onOk"
                        @cancel="onCancel"
                        :open="isDeleting"
                        :message="`Are you sure want to delete the ${schema}${selected.length>1?'s':''}!`"/>
    </div>
</template>

<script>
    import values from 'lodash/values';
    import findIndex from 'lodash/findIndex';
    import filter from 'lodash/filter';
    import is_date from 'date-fns/is_date';
    import parse from 'date-fns/parse';
    import is_after from 'date-fns/is_after';
    import pluralize from 'pluralize';
    import lowerCase from 'lodash/lowerCase';

    import DataTableSearch from "./DataTableSearch.vue";
    import DataTableHeader from "./DataTableHeader.vue";
    import DataTableRow from "./DataTableRow.vue";
    import DataTableFooter from "./DataTableFooter.vue";
    import DataTableModal from "./DataTableModal";

    export default {
        name: "DataTable",

        components: {
            DataTableModal,
            DataTableSearch,
            DataTableHeader,
            DataTableRow,
            DataTableFooter},

        props: {
            schema: {
                type: String,
                default: 'Record'
            },
            title: String,
            list: Array,
            editables: Array,
            excludes: Array,
            columns: Array,
            entriesPerPage: {
                type: Number,
                default: 10
            },
            total: {
                type: Number,
                required: true
            },
            loading: Boolean
        },

        filters: {
            pluralize(value) {
                if (!value) return '';
                return pluralize(value);
            },

            lowercase(value) {
                if (!value) return '';
                return lowerCase(value);
            }
        },

        data() {
            return {
                _data: [],
                sortBy: '',
                direction: '',
                isSorted: true,
                selectAll: '',
                select: '',
                perPage: 0,
                search: '',
                currentPage: 1,
                startAt: 0,
                filter: '',
                selected: [],
                isDeleting: false,
                _delete: null
            }
        },

        computed: {
            fields() {
                let cols = [];

                if (this.columns.length > 0)
                    cols = this.columns;
                else if (this.list.length > 0)
                    cols = this.list[0];

                return cols.filter(field => {
                        return !this.isExclude(field);
                    });
            },

            totalPage() {
                const total = this.total/this.perPage;
                return total < 1 ? 1 : total;
            },

            hasPrevious() {
                return this.startAt+1 >= this.perPage;
            },

            hasSelected() {
                return this.selected.length > 0;
            },

            endAt() {
                if (this.startAt === 0)
                    return this.perPage -1;

                const end = this.startAt + this.perPage;
                return end;
            },

            total_() {
                return this.list.length;
            },

            isCached() {
                return (this.list.length - this.endAt) >= this.perPage;
            },

            rows() {
                let result = this.list.slice(this.startAt, this.endAt);

                if (this.sortBy !== '' &&
                    this.direction !== '')
                    return result.sort((a, b) => {
                        let mod = 1;

                        if (this.direction === 'desc')
                            mod = -1;

                        if (a[this.sortBy] < b[this.sortBy])
                            return -1 * mod;

                        if (a[this.sortBy] > b[this.sortBy])
                            return mod;

                        return 0;
                    });
                else if (this.search !== '') {
                    return result.filter(row => {
                        if (this.filter !== '') {
                            // console.log('filter', this.filter);
                            const val = row[this.filter];
                            // console.log('val', typeof val);
                            // console.log('date', is_date(val));

                            if (typeof val === 'string')
                                return val.toLowerCase().includes(this.search.toLowerCase());
                            else if (typeof val === 'number')
                                return val >= this.search;
                            else if (is_date(val)) {
                                const date = parse(this.search);
                                // console.log('date', date);
                                return is_after(val, date);
                            }

                            return false;
                        }
                        else {
                            const values1 = values(row);
                            const found = values1.filter(value => {
                                if (typeof value === 'string')
                                    return value.toLowerCase().includes(this.search.toLowerCase());
                                else if (typeof value === 'number')
                                    return value >= this.search;

                                return false;
                            });

                            return found.length > 0;
                        }
                    });
                }

                return result;
            }
        },

        methods: {
            onAdd() {
                this.$emit('add');
            },

            onDeletes() {
                this.isDeleting = true;
            },

            isExclude(key) {
                const found = findIndex(this.excludes, k => {
                    return k === key;
                });

                return found !== -1;
            },

            onFilterChange(filter) {
                this.filter = filter;
                this.$emit('filter', filter);
                // this.search = '';
            },


            onFilter(query) {
                // this.$emit('filter', filter);
                this.search = query;
            },

            onSearch({filter, query}) {
                this.$emit('search', {field: filter, query, total: this.perPage});
                this.search = '';
            },

            onSort({field, direction}) {
                if (this.sortBy === field &&
                    ((direction && this.direction === 'asc') ||
                    (!direction && this.direction === 'desc'))) {
                    // this.isSorted = true;
                    return;
                }

                this.sortBy = field;

                if (direction)
                    this.direction = 'asc';
                else
                    this.direction = 'desc';

                // console.log(`sorted by ${field}`, this.direction);

                // this.isSorted = false;
            },

            onEdit(row, field, $ev) {
                /*console.log('row', row);
                console.log('field', field);
                console.log('$ev', $ev);*/
                row[field] = $ev;//row[field]
                this.$emit('update', row, field);
            },

            onDelete(row) {
                this.isDeleting = true;
                this._delete = row;
                this.selected.push(row);
            },

            onOk() {
                // this.delete

                //handle onOk
                if (this.selected.length > 0)
                    this.$emit('delete', this.selected);

                this.$refs.rows.forEach(row => {
                    // console.log('row', row);
                    const found = findIndex(this.selected, item => {
                        return item.id === row.id;
                    });

                    if (found !== -1) {
                        row.isSelected = false;
                        row.onSelect();
                    }
                });

                this.selected = [];
                this.isDeleting = false;
            },

            onCancel() {
                this.isDeleting = false;

                if (this._delete !== null) {
                    const found = findIndex(this.selected, item => {
                        return item.id === this._delete.id;
                    });

                    if (found !== -1)
                        this.selected.splice(found, 1);
                }
            },

            onSelect(model) {
                this.selected.push(model);
                this.$emit('select', model);
            },

            onDeselect(row) {
                const found = findIndex(this.selected, model => {
                    return model.id === row.id;
                });

                if (found !== -1)
                    this.selected.splice(found, 1);

                this.$emit('deselect', row);
            },

            onUpdate({model, field, value}) {
                model[field] = value;
                this.$emit('update', {model, field, value});
            },

            onSelectAll(isSelected) {
                console.log('isSelected', isSelected);
                this.selectAll = isSelected;
                this.$refs.rows.forEach(row => {
                    // console.log('row', row);
                    row.isSelected = isSelected;
                    row.onSelect();
                });
            },

            onRowsPerPageChange(perPage) {
                this.currentPage = 1;
                this.perPage = perPage;
                this.$emit('limit', perPage);
            },

            onPrevious(perPage) {
                this.currentPage--;

                // this.$emit('previous', perPage);

                if (this.startAt < this.perPage)
                    this.startAt = 0;
                else
                    this.startAt -= this.perPage;
            },

            onNext(perPage) {
                // const perPage = Number(this.perPage);
                this.currentPage++;

                if (!this.isCached)
                    this.$emit('next', perPage);

                // this.startAt = this.currentPage === 1 ? 0 : (this.perPage * (this.currentPage -1)) - 1;
                this.startAt = this.currentPage === 1 ? 0 : (this.perPage * (this.currentPage -1)) - 1;
            }
        },

        created() {
            this.perPage = this.entriesPerPage;
        }
    }
</script>

<style lang="scss" scoped>
    .layout--row {
        &.row--flex {
            display: flex;

            &__center {
                align-items: center;
                justify-content: center;
            }

            &__centerh {
                align-items: center;
            }

            &__centerv {
                justify-content: center;
            }

            &__space--between {
                justify-content: space-between;
            }

            &__start {
                justify-content: flex-start;
            }

            &__end {
                justify-content: flex-end;
            }
        }
    }

    button {
        &.layout--button {
            transition: color .25s ease-in;
            padding: 0;
            margin: 0;
            border: 0;

            &.button--transparent {
                background-color: transparent;
            }

            &:focus {
                outline: none;
            }

            &:hover {
                cursor: pointer;
                color: blue;
            }

            &.button--active {
                color: blue;
            }

            &:disabled {
                cursor: not-allowed;
            }
        }
    }


    .layout--data-table {
        &__title {

        }


        &--column {
            flex: 1;
            padding: 4px;
            font-size: 14px;

            &__tools {
                /*display: flex;*/
                //align-items: center;
            }

            &__tool {
                flex: none;
            }
        }

        &__header {
            display: flex;
            border-bottom: 2px solid bisque;
            //margin-bottom: 16px;

            &--sort--by {
                display: flex;
                margin-left: 8px;

                button {
                    .material-icons {
                        transform: scale(1.25, 1.25);
                    }
                }
            }
        }

        &__body {
            position: relative;


            &--loading {
                transition: opacity .25s ease-in;
                position: absolute;
                height: 100%;
                width: 100%;
                background-color: rgba(255, 255, 255, .75);
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                opacity: 0;
                display: flex;
                justify-content: center;
                align-items: center;

                &.is--loading {
                    opacity: 1;
                }
            }
        }

        &__footer {
            display: flex;
            align-items: center;

            &--total {
                select {
                    border: 1px solid gainsboro;
                    padding: 0;
                    margin: 0;
                    line-height: 34px;
                    height: 34px;

                    &:focus {
                        outline: none;
                    }
                }
            }

            &--pagination {

            }
        }
    }
</style>