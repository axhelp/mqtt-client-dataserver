import React from 'react'

const ProjectName = (props) => {
    const {projectName} = props;

    return (
        <div id='c_glb_project_name' className='ellipsis'>
            <span className='c_glb_project_name'>Project Name</span>
            <span title=''>: {projectName}</span>
        </div>
    )
};

export default ProjectName
