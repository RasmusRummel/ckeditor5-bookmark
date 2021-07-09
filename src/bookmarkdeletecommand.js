import Command from '@ckeditor/ckeditor5-core/src/command';

export default class DeleteBookmark extends Command {
    execute() {
        const editor = this.editor;
        const modelSelection = this.editor.model.document.selection;

        editor.model.change(modelWriter => {
            if (modelSelection.isCollapsed) {
                return;
            }
            else {
                var elm = modelSelection.getSelectedElement();
                if (elm && elm.is('element')) {
                    if (elm.hasAttribute('name')) {
                        modelWriter.remove(elm);
                    }
                }
            }
        });
    }
}
