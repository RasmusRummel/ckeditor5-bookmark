import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import BookmarkEditing from './bookmarkediting';
import BookmarkUI from './bookmarkui';

export default class Bookmark extends Plugin {
    static get requires() {
        return [BookmarkEditing, BookmarkUI];
    }

    static get pluginName() {
        return 'Bookmark';
    }
}
