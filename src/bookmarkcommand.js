import Command from '@ckeditor/ckeditor5-core/src/command';

export default class BookmarkCommand extends Command {
    constructor(editor) {
        super(editor);

        this.set("isBookmark", false);
    }

    execute(bookmarkName) {
        const editor = this.editor;
        const modelSelection = this.editor.model.document.selection;

        editor.model.change(modelWriter => {
            if (modelSelection.isCollapsed) {
                bookmarkName = bookmarkName || '';

                const bookmark = modelWriter.createElement('bookmark', { name: bookmarkName });
                editor.model.insertContent(bookmark);

                modelWriter.setSelection(bookmark, 'on');
            }
            else {
                var elm = modelSelection.getSelectedElement();
                if (elm && elm.is('element')) {
                    if (elm.hasAttribute('name')) {
                        modelWriter.setAttribute('name', bookmarkName, elm);
                    }
                }
            }
        });
    }

    refresh() {
        const model = this.editor.model;
        const modelDocument = model.document;
        const elmSelected = modelDocument.selection.getSelectedElement();

        this.isBookmark = false;

        if (elmSelected) {
            this.value = elmSelected.getAttribute('name');
            this.isBookmark = elmSelected.hasAttribute('name');
        }
        else {
            this.value = null;
            this.isBookmark = false;
        }

        const isAllowed = model.schema.checkChild(modelDocument.selection.focus.parent, 'bookmark');
        this.isEnabled = isAllowed;
    }
}