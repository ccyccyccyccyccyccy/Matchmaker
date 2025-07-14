import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios'
import { useUser } from "./main"; // Adjust the import path as necessary
import type Project from "../../shared/types/Project";
import type UserNoPassword from "../../shared/types/User";


function ProjectCard({ project }: { project: Project }) {
    const navigate = useNavigate()
    const handleClick=()=>{
        console.log("client", project.vacancies)
        navigate("/profile/${user._id}/editProject", { state: { project: project } });
        return
    }

    return (
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
            {/* should show all details */}
                <h5 className="card-title">{project.title}</h5>
                <p className="card-text">{project.projectDescription}</p>
                 <p className="card-text">Role: {project.roleDescription}</p>
                 <p className="card-text">Vacancies: {project.vacancies}</p>
                <p className="card-text"><small className="text-muted">Posted on {new Date(project.postedDate).toLocaleDateString()}</small></p>
                <button onClick={handleClick}>
                Edit project
                </button>
            </div>
        </div>
    )
}


function Profile(){

    const { userId } = useParams();
    const [projects, setProjects] = React.useState<Project[]>([]);
    const navigate = useNavigate()
     const userContext = useUser();
            if (!userContext) {
                throw new Error("useUser must be used within a UserProvider");
            }
    const { setUser } = userContext;
    const { user } = userContext;
    const token = localStorage.getItem("token")

    const handleAddClick = () => {
    navigate("/profile/${user._id}/addProject");
  };

    if (!token){
       navigate("/login")
        alert("You must be logged in.")
    }

    React.useEffect(() => {
        // Fetch projects from the server
        axios.get("http://localhost:3001/myProjects", 
            {headers: {
    Authorization: `Bearer ${token}`
  }, 
    params:{userID: userId}}
        )
            .then(response => {
                if (response.status==200){
                    setProjects(response.data)
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
                user profile: {user?._id}
            </h1>
            <button onClick={handleAddClick}>
            Add project
            </button>
        </center>
        <div className="container mt-5">
            <h2>My Projects</h2>
            <div className="row">
                {projects&& projects.map((project: Project) => (
                    <div className="col-md-4" key={project._id}>
                        <ProjectCard project={project} />
                    </div>
                ))}
            </div>
        </div>
    </>
    )
}

export default Profile;