import React, { Component } from 'react'

import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import Label from '../Label/Label'

import './RichTextField.css'

const RichTextField = (props) => {
    return (
        <div className="RichTextField">
            <Label value={props.title} level={props.level}/>
            {/* <br/> */}
            <div className="RichTextField__field">
                <CKEditor
                    editor={BalloonEditor}
                    data={props.value}
                    onChange={(event, editor) => props.onChange(editor.getData())}
                />
            </div>
        </div>
    )
}


export default RichTextField