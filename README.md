# ckeditor5-bookmark

ckeditor5-bookmark is a 3. party free bookmark plugin for CKEditor 5. It solves the problem of creating bookmarks, &lt;a name="bookmark-name"&gt;&lt;/a&gt;, in bigger documents. You can then use the offical CKEditor 5 Link plugin to create links to your bookmarks : &lt;a href="#bookmark-name"&gt;Bookmark Name&lt;/a&gt;

![image](https://user-images.githubusercontent.com/15994829/64579144-fc767200-d3ab-11e9-9f7f-faf52196746d.png)

There is an in-dept tutorial, how to build a CKEditor 5 bookmark plugin, based on the ckeditor5-bookmark plugin here : [CKBookmark - a CKEditor 5 plugin tutorial](https://topiqs.online/Home/Index/1169).

Below is a short usage documentation. 

//#1 : In your CKEditor5 build file ADD a reference to ckeditor5-bookmark:

```javaqscript
// app.js

import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Bookmark from 'ckeditor5-bookmark'; // ADD THIS
// ...

ClassicEditor.builtinPlugins = [
    Essentials,
    Autoformat,
    Bold,
    Italic,
    Bookmark // ADD THIS
    // ...
]
```

<br />//#2 : Then creating the CKEditor5 add the bookmark button :

```javaqscript
ClassicEditor.create(document.querySelector('#editor'), {
    toolbar: [
        'heading',
        'bold',
        'italic',
        'bookmark' // ADD THIS
        
        // ...
    ]

    // ...
});
```
