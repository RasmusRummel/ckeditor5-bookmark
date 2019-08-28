import Command from '@ckeditor/ckeditor5-core/src/command';

export default class BookmarkDeleteCommand extends Command {
    execute() {
        const editor = this.editor;
        const modelSelection = this.editor.model.document.selection;

        editor.model.change(modelWriter => {
            if (modelSelection.isCollapsed) {
                return;
            }
            else { // called from bookmarkui._createViewPopup then the viewPopup fires 'delete'
                var elm = modelSelection.getSelectedElement();
                if (elm && elm.is('element')) { // on the Model, bookmark is an Element (while on the View, bookmark is an attributeElement)
                    if (elm.hasAttribute('name')) {
                        modelWriter.remove(elm);
                    }
                }
            }
        });
    }

    refresh() {
      //  const model = this.editor.model;
      //  const modelDocument = model.document;

      //  if (modelDocument.selection.getSelectedElement()) {
      //      var nameAttributeValue = modelDocument.selection.getSelectedElement().getAttribute('name');
      //      this.value = nameAttributeValue;
      //  }
      //  else {
      //      this.value = null;
      //  }

      //  const isAllowed = model.schema.checkChild(modelDocument.selection.focus.parent, 'bookmark');
      //  const isAllowed = modelDocument.selection.isCollapsed; // allow bookmarks everythere but don't allow them to expand over text or elements (not possible because then selected, isCollapsed is false -> which will result in the Command class to cancel execution)
        this.isEnabled = true;// MUST always be true, otherwise the command cannot execute;

      //  /*
      //   * The Command class (which this class extends) have the following code in the constructor :
     	//	this.on( 'execute', evt => {
			   // if ( !this.isEnabled ) { // HERE : if the Command is not enabled, the command will not fire
				  //  evt.stop();
			   // }
		    //}, { priority: 'high' } );
      //  */
    }
}