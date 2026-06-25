import React from 'react'

interface CreateComposeProps {
    title: string;
    description: string;
}

const CreateCompose = ({ title, description } : CreateComposeProps) => {
  return (
    <div>CreateCompose
        <div>
            <h1>{title}</h1>
            <h2>{description}</h2>
        </div>
    </div>
  )
}

export default CreateCompose