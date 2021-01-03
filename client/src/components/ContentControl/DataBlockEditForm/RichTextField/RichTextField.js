import React, { Component } from 'react'

// import CKEditor from '@ckeditor/ckeditor5-react';
// import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import Label from '../Label/Label'

import { Editor } from 'react-draft-wysiwyg'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './RichTextField.css'

// const RichTextField = (props) => {
//     return (
//         <div className="RichTextField">
//             <Label value={props.title} level={props.level}/>
//             {/* <br/> */}
//             <div className="RichTextField__field">
//                 <CKEditor
//                     editor={BalloonEditor}
//                     data={props.value}
//                     onChange={(event, editor) => props.onChange(editor.getData())}
//                 />
//             </div>
//         </div>
//     )
// }

const RichTextField = (props) => {
    return (
        <div className="RichTextField">
            <Label value={props.title} level={props.level}/>
            <Editor
                editorState={props.value}
                onEditorStateChange={props.onChange}
            />
        </div>
    )
}

export default RichTextField