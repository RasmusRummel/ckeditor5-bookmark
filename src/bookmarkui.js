import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';

import ViewPopup from './ui/viewpopup';
import EditPopup from './ui/editpopup';
import bookmarkIcon from '../theme/icons/bookmark.svg';

export default class LinkUI extends Plugin {
    static get requires() {
        return [ContextualBalloon];
    }

    static get pluginName() {
        return 'BookmarkUI';
    }

    init() {
        const editor = this.editor;

        this._balloon = editor.plugins.get(ContextualBalloon); // https://ckeditor.com/docs/ckeditor5/latest/api/module_ui_panel_balloon_contextualballoon-ContextualBalloon.html

        editor.editing.view.addObserver(ClickObserver);

        this._viewPopup = this._createViewPopup();
        this._editPopup = this._createEditPopup();

        editor.ui.componentFactory.add('bookmark', locale => {
            const btn = new ButtonView(locale);
            btn.set({
                label: editor.t('Bookmark'),
                withText: false,
                tooltip: true,
                icon: bookmarkIcon
            });

            const bookmarkCommand = editor.commands.get('bookmark');
            btn.bind('isEnabled').to(bookmarkCommand, 'isEnabled');
            btn.bind('isOn').to(bookmarkCommand, 'isBookmark');

            this.listenTo(btn, 'execute', () => {
                this.editor.execute('bookmark');
                this._showUI();
            });

            return btn;
        });

        this._enableUserBalloonInteractions();
    }

    _createViewPopup() {
        const editor = this.editor;
        const viewPopup = new ViewPopup(editor.locale)

        const command = editor.commands.get('bookmark');
        viewPopup.lblName.bind('text').to(command, 'value');

        this.listenTo(viewPopup, 'edit', () => {
            this._balloon.remove(this._viewPopup);
            this._balloon.add({
                view: this._editPopup,
                position: this._getBalloonPositionData()
            });

            this._editPopup.tbName.select();
        });

        this.listenTo(viewPopup, 'delete', () => {
            this.editor.execute('deleteBookmark');
            this._hideUI();
        });

        viewPopup.keystrokes.set('Esc', (data, cancel) => {
            this._hideUI();
            cancel();
        });

        return viewPopup;
    }

    _createEditPopup() {
        const editor = this.editor;
        const editPopup = new EditPopup(editor.locale);

        const command = editor.commands.get('bookmark');
        editPopup.tbName.bind('value').to(command, 'value');

        editPopup.keystrokes.set('Esc', (data, cancel) => {
            this._hideUI();
            cancel();
        });

        this.listenTo(editPopup, 'submit', () => {
            const bookmarkName = editPopup.tbName.element.value;
            editor.execute('bookmark', bookmarkName);
            this._hideUI();
        });

        this.listenTo(editPopup, 'cancel', () => {
            this._hideUI();
        });

        return editPopup;
    }

    _enableUserBalloonInteractions() {
        const viewDocument = this.editor.editing.view.document;

        this.listenTo(viewDocument, 'click', () => {
            const elmBookmark = this._getSelectedBookmarkElement();
            if (elmBookmark) {
                this._showUI();
            }
        });

        this.editor.keystrokes.set('Esc', (data, cancel) => {
            if (this._balloon.hasView(this._viewPopup) || this._balloon.hasView(this._editPopup)) {
                this._hideUI();
                cancel();
            }
        });

        clickOutsideHandler({
            emitter: this._editPopup,
            activator: () => this._balloon.visibleView === this._editPopup || this._balloon.visibleView == this._viewPopup,
            contextElements: [this._balloon.view.element],
            callback: () => this._hideUI()
        });
    }

    _getSelectedBookmarkElement() {
        const view = this.editor.editing.view;
        const selection = view.document.selection;

        var elm = selection.getSelectedElement();
        if (elm && elm.is('containerElement')) {
            const customBookmarkProperty = !!elm.getCustomProperty('bookmarkName');
            if (customBookmarkProperty) {
                return elm;
            }
        }
    }

    _showUI() {
        const editor = this.editor;

        const elmBookmark = this._getSelectedBookmarkElement();
        if (!elmBookmark) {
            return;
        }

        const bookmarkName = elmBookmark.getAttribute('name');
        if (bookmarkName) {
            showViewPopup(this);
        }
        else {
            showEditPopup(this);
        }

        function showViewPopup(linkUI) {
            if (linkUI._balloon.hasView(linkUI._viewPopup)) { return; }

            linkUI._balloon.add({
                view: linkUI._viewPopup,
                position: linkUI._getBalloonPositionData()
            });
        }

        function showEditPopup(linkUI) {
            if (linkUI._balloon.hasView(linkUI._editPopup)) {
                return;
            }

            linkUI._balloon.add({ // https://ckeditor.com/docs/ckeditor5/latest/api/module_ui_panel_balloon_contextualballoon-ContextualBalloon.html#function-add
                view: linkUI._editPopup,
                position: linkUI._getBalloonPositionData() // returns a DOM range
            });

            linkUI._editPopup.tbName.select();
        }
    }

    _hideUI() {
        if (this._balloon.hasView(this._viewPopup)) {
            this._balloon.remove(this._viewPopup);
        }

        if (this._balloon.hasView(this._editPopup)) {
            this._editPopup.saveButtonView.focus();
            this._balloon.remove(this._editPopup);
        }

        this.editor.editing.view.focus();
    }

    _addPopupViewDELETE() {
        if (this._balloon.hasView(this._editPopup)) {
            return;
        }

        this._balloon.add({
            view: this._editPopup,
            position: this._getBalloonPositionData()
        });
    }

    _getBalloonPositionData() {
        const view = this.editor.editing.view;
        const viewDocument = view.document;
        const targetLink = this._getSelectedBookmarkElement();

        const target = targetLink ?
            view.domConverter.mapViewToDom(targetLink) :
            view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());

        return { target };
    }
}
