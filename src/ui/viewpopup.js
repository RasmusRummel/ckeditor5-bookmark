import View from '@ckeditor/ckeditor5-ui/src/view';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import LabelView from '@ckeditor/ckeditor5-ui/src/label/labelview';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';

import pencilIcon from '@ckeditor/ckeditor5-core/theme/icons/pencil.svg';
import deleteIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg';

export default class ViewPopup extends View {
    constructor(locale) {
        super(locale);

        this.keystrokes = new KeystrokeHandler();

        this.lblName = new LabelView(locale);
        this.editButtonView = this._createButton(locale.t('Edit'), pencilIcon, 'ck-bookmark-view-btnEdit', 'edit');
        this.deleteButtonView = this._createButton(locale.t('Delete'), deleteIcon, 'ck-bookmark-view-btnDelete', 'delete');

        this.lblName.extendTemplate({
            attributes: {
                class: ['ck-bookmark-view-lblName']
            }
        });

        this.setTemplate({
            tag: 'div',

            attributes: {
                class: ['ck-bookmark-view']
            },

            children: [
                this.lblName,
                this.editButtonView,
                this.deleteButtonView
            ]
        });
    }

    render() {
        super.render();

        this.keystrokes.listenTo(this.element);
    }

    _createButton(label, icon, className, eventName) {
        const button = new ButtonView(this.locale);

        button.set({
            label,
            icon,
            tooltip: true
        });

        button.extendTemplate({
            attributes: {
                class: [className]
            }
        });

        button.delegate('execute').to(this, eventName);

        return button;
    }
}
