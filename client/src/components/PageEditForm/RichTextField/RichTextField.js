import React, { Component } from 'react'

import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
// import BalloonEditor from '@ckeditor/ckeditor5-build-classic';

const RichTextField = (props) => {
    return (
        <div>
            {props.title}
            <br/>
            <CKEditor
                editor={BalloonEditor}
                data={props.value}
            />
        </div>
    )
}


export default RichTextField