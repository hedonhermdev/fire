import React from 'react';
import './ContentWrapper.css';
import CmsMain from './CmsMain/CmsMain';
import { Route } from 'react-router-dom';

const ContentWrapper = () => (
    <div className='ContentWrapper'>
        <Route path='/:sub' component={CmsMain} />
    </div>
)

export default ContentWrapper;