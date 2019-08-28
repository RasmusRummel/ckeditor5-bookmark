import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import BookmarkCommand from './bookmarkcommand';
import BookmarkDeleteCommand from './bookmarkdeletecommand';

import theme from '../theme/bookmark.css';

export default class BookmarkEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add('bookmark', new BookmarkCommand(this.editor));
        this.editor.commands.add('deleteBookmark', new BookmarkDeleteCommand(this.editor));
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('bookmark', {
            allowWhere: '$text',
            isLimit: true,
            isInline: true,
            isObject: true,
            allowAttributes: ['name', 'class']
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
            model: (viewElement, modelWriter) => {
                const name = viewElement.getAttribute('name');
                var bookmark = modelWriter.createElement('bookmark', { name });
                return bookmark;
            }
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'bookmark',
            view: (modelItem, viewWriter) => {
                const name = modelItem.getAttribute('name');
                const aBookmark = viewWriter.createContainerElement('a', { name, class: 'bookmark' });
                viewWriter.setCustomProperty('bookmarkName', true, aBookmark);
                return toWidget(aBookmark, viewWriter);
            }
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'bookmark',
            view: (modelItem, viewWriter) => {
                const name = modelItem.getAttribute('name');
                const aBookmark = viewWriter.createAttributeElement('a', { name });
                return aBookmark;
            }
        });
    }
}
