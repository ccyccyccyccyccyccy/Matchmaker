import React from "react";
import { useParams } from "react-router-dom";
import axios from 'axios'
import type Project from "../../shared/types/Project";
import type UserNoPassword from "../../shared/types/User";

function ProjectPage(){

    const { projectId } = useParams();
    const [project, setProject] = React.useState<Project|null>(null);
    const [initiator,setInitiator] = React.useState<UserNoPassword|null>(null);

    React.useEffect(() => {
        // Fetch projects from the server
        axios.get("http://localhost:3001/projectDetail", 
            {params:{projectID: projectId}}
        )
            .then(response => {
                if (response.status==200){
                    setProject(response.data?.project)
                    setInitiator(response.data?.initiator)
                }
                else{
                    console.log(response.data)
                }
            })
            .catch(error => console.error("Error fetching projects:", error));
    }, []);

    return(
        <>
        <center>
            <h1>
                project page: {projectId}
            </h1>
        </center>
        <div className="container mt-5">
            <div className="card mb-3">
            <div className="card-body"
      style={{
        padding: "20px",
        backgroundColor: "#4CAF50",
        color: "white",
        borderRadius: "10px",
        cursor: "pointer",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease-in-out"
      }}
            >
                <h5 className="card-title">{project?.title}</h5>
                <p className="card-text">{project?.projectDescription}</p>
                 <p className="card-text">Role: {project?.roleDescription}</p>
                  <p className="card-text">Inititator: {initiator?.name}</p>
                {/* <p className="card-text"><small className="text-muted">Posted on {project?.postedDate? new Date(project.postedDate).toLocaleDateString(): null}</small></p> */}
            </div>
        </div>
        </div>
    </>
    )
}

export default ProjectPage;