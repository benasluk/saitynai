import * as React from 'react'
import { useState, useEffect } from 'react';

const PipelineList = () => {
    const [pipelines, setPipelines] = useState([]);

    return (
        <div>
            <h1>Pipelines</h1>
            <ul>
                {pipelines.map(pipeline => (
                    <li key={pipeline.id}>{pipeline.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default PipelineList;