import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import Position from '@ckeditor/ckeditor5-engine/src/model/position';

import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import InsertBookmark from './bookmarkcommand';
import DeleteBookmark from './bookmarkdeletecommand';
import theme from '../theme/bookmark.css';

export default class BookmarkEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {

        console.log("BookmarkEditing#init");

        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add('insertBookmark', new InsertBookmark(this.editor));
        this.editor.commands.add('deleteBookmark', new DeleteBookmark(this.editor));
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('bookmark', {

            allowWhere: '$text',

            isInline: true,
            isLimit: true,

            isObject: true,

            allowAttributes: ['name', 'class']

        });

    }

    _defineConvertersTest1() {
        const conversion = this.editor.conversion;

        conversion.for('editingDowncast').elementToElement({

            model: 'bookmark',

            view: (modelItem, { writer: viewWriter }) => {

                const aBookmark = viewWriter.createContainerElement('span');

                var txtBookmark = viewWriter.createText('BOOKMARK');

                viewWriter.insert(viewWriter.createPositionAt(aBookmark, 0), txtBookmark);

                viewWriter.setCustomProperty('bookmarkName', true, aBookmark);

                return aBookmark;

            }

        });
    }

    _defineConvertersTest2() {
        const conversion = this.editor.conversion;

        conversion.for('editingDowncast').elementToElement({
            model: 'bookmark',
            view: (modelItem, { writer: viewWriter }) => {
                const aBookmark = viewWriter.createContainerElement('span');

                var txtBookmark = viewWriter.createText('BOOKMARK');

                viewWriter.insert(viewWriter.createPositionAt(aBookmark, 0), txtBookmark);

                viewWriter.setCustomProperty('bookmarkName', true, aBookmark);

                return toWidget(aBookmark, viewWriter);

            }
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.attributeToAttribute({
            model: {
                name: 'bookmark',
                key: 'name'
            },
            view: {
                key: 'name'
            }
        });

        conversion.for('upcast').elementToElement({
            view: {
                name: 'a',
                attributes: {
                    name: true
                }
            },
            model: (viewElement, { writer: modelWriter }) => {
                const name = viewElement.getAttribute('name');
                var bookmark = modelWriter.createElement('bookmark', { name });
                return bookmark;
            }
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'bookmark',
            view: (modelItem, { writer: viewWriter }) => {
                const name = modelItem.getAttribute('name');
                const aBookmark = viewWriter.createContainerElement('span', { name, class: 'ck-bookmark' });
                viewWriter.setCustomProperty('bookmarkName', true, aBookmark);
                return toWidget(aBookmark, viewWriter);
            }
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'bookmark',
            view: (modelItem, { writer: viewWriter }) => {
                const name = modelItem.getAttribute('name');
                const aBookmark = viewWriter.createAttributeElement('a', { name });
                return aBookmark;
            }
        });
    }
}
