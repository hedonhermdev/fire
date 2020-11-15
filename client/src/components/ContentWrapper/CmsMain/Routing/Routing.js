import React from 'react';

import SudoAccordionCollection from '../SudoAccordionCollection/SudoAccordionCollection';
import AccordionCollection from '../AccordionCollection/AccordionCollection';

const Routing = () => 
    (window.location.pathname.split('/').length - window.location.pathname.split('/').indexOf('page') > 2)
    ? <AccordionCollection />
    : <SudoAccordionCollection />

export default Routing;