import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router';

export default function BasicBreadcrumbs(props) {
    return (
        <div role="presentation" className='breadcrumbs-wrapper'>
            <Breadcrumbs aria-label="breadcrumb" >
                <div className='home'><Link to="/">Home</Link></div>
                {props.crumbs.map((item, i) => {
                    const isLast = i === props.crumbs.length - 1;
                    return (
                        <div>
                            {isLast ?
                                <div className='last'>{item.label}</div>
                                :
                                <div className='middle'><Link key={i} to={item.path}>{item.label}</Link></div>
                            }
                        </div>
                    );
                })}
            </Breadcrumbs>
        </div>
    );
}
