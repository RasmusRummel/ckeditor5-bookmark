import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
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

        //this.editor.editing.mapper.on(
        //    'viewToModelPosition',
        //    viewToModelPositionOutsideModelElement(this.editor.model, viewElement => viewElement.hasClass('bookmark'))
        //);

        //this.editor.config.define('bookmarkConfig', {
        //    types: ['date', 'first name', 'surname']
        //});
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('bookmark', {
            // Allow wherever text is allowed:
            allowWhere: '$text',

            isLimit: true,

            // The bookmark will act as an inline node:
            isInline: true,

            // The inline widget is self-contained so it cannot be split by the caret and it can be selected:
            isObject: true,

            allowAttributes: ['name', 'class']
        });
    }

    /*
     * <a name="bookmarkName"></a> // Data
     * <a name="bookmarkName"></a> // View
     * <bookmark name="bookmarkName"></a> // Model
     * 
     * <svg xmlns="http://www.w3.org/2000/svg" style="width:16px;" viewBox="0 0 512 512"><path d="M472.5 0c-7 0-14.3 1.5-21.2 4.6-50.5 22.7-87.8 30.3-119.1 30.3C266.1 34.9 227.7.4 151.4.4c-28.4 0-62.2 4.9-104.5 18C44.3 7.9 35.3 0 24 0 10.7 0 0 10.7 0 24v476c0 6.6 5.4 12 12 12h24c6.6 0 12-5.4 12-12V398.1c37.3-11.8 69.6-16.5 98.5-16.5 81.2 0 137.8 34.4 219.1 34.4 35.3 0 75.1-6.5 123.7-25 14-5.4 22.8-17.9 22.8-31.2V33.4C512 13 493.4 0 472.5 0zM464 349.1c-35.3 12.7-67.6 18.9-98.5 18.9-75.5 0-128.5-34.4-219.1-34.4-31.9 0-64.5 4.7-98.5 14.2V68.5C87.7 55 121.7 48.4 151.4 48.4c66.3 0 105.2 34.5 180.8 34.5 40.3 0 82.3-10 131.8-31.5v297.7z"/></svg>
     */

    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.attributeToAttribute({ // refreshes the View in the CKEditorInspector (otherwise not really necessary since editor.getData() will get the correct value anyway)
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

                //const aBookmark = viewWriter.createEmptyElement('a', { name, class: 'bookmark' });
                //const aBookmark = viewWriter.createAttributeElement('a', { name, class: 'bookmark' });
                const aBookmark = viewWriter.createContainerElement('a', { name, class: 'bookmark' });

                //const dummy = viewWriter.createText("aa");
                //viewWriter.insert(viewWriter.createPositionAt(aBookmark, 0), dummy);

                viewWriter.setCustomProperty('bookmarkName', true, aBookmark);
                //return aBookmark;
                return toWidget(aBookmark, viewWriter);
            }
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'bookmark',
            view: (modelItem, viewWriter) => {
                const name = modelItem.getAttribute('name');
                //const aBookmark = viewWriter.createEmptyElement('a', { name });
                const aBookmark = viewWriter.createAttributeElement('a', { name });
                return aBookmark;
            }
        });

        // Helper method for both downcast converters.
        function createBookmarkView(modelItem, viewWriter) { // NOT IN USE
            const name = modelItem.getAttribute('name');

            const aBookmark = viewWriter.createContainerElement('a', { name: name });
            const svgBookmark = viewWriter.createContainerElement('svg', {
                xmlns: 'http://www.w3.org/2000/svg',
                style: 'width:16px;',
                viewBox: '0 0 512 512'
            });
            const svgPath = viewWriter.createEmptyElement('path', {
                d: 'M472.5 0c-7 0-14.3 1.5-21.2 4.6-50.5 22.7-87.8 30.3-119.1 30.3C266.1 34.9 227.7.4 151.4.4c-28.4 0-62.2 4.9-104.5 18C44.3 7.9 35.3 0 24 0 10.7 0 0 10.7 0 24v476c0 6.6 5.4 12 12 12h24c6.6 0 12-5.4 12-12V398.1c37.3-11.8 69.6-16.5 98.5-16.5 81.2 0 137.8 34.4 219.1 34.4 35.3 0 75.1-6.5 123.7-25 14-5.4 22.8-17.9 22.8-31.2V33.4C512 13 493.4 0 472.5 0zM464 349.1c-35.3 12.7-67.6 18.9-98.5 18.9-75.5 0-128.5-34.4-219.1-34.4-31.9 0-64.5 4.7-98.5 14.2V68.5C87.7 55 121.7 48.4 151.4 48.4c66.3 0 105.2 34.5 180.8 34.5 40.3 0 82.3-10 131.8-31.5v297.7z'
            });

            viewWriter.insert(viewWriter.createPositionAt(aBookmark, 0), svgBookmark);
            viewWriter.insert(viewWriter.createPositionAt(svgBookmark, 0), svgPath);

            // Insert the bookmark name (as a text).
            //const innerText = viewWriter.createText('{' + name + '}');
            //viewWriter.insert(viewWriter.createPositionAt(aBookmark, 0), innerText);
            /*
             * .insert : https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_writer-Writer.html#function-insert
             * .createPositionAt : 
             */

            return aBookmark;
        }
    }
}