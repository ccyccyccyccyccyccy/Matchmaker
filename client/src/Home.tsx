import React from "react";
import { useUser } from "./main"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import type Project from "../../shared/types/Project";


function ProjectCard({ project }: { project: any }) {
    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">{project.title}</h5>
                <p className="card-text">{project.projectDescription}</p>
                 <p className="card-text">Role: {project.roleDescription}</p>
                <p className="card-text"><small className="text-muted">Posted on {new Date(project.postedDate).toLocaleDateString()}</small></p>
            </div>
        </div>
    )
}

function Home(){

    const userContext = useUser();
        if (!userContext) {
            throw new Error("useUser must be used within a UserProvider");
        }
    const { setUser } = userContext;
    const { user } = userContext;
    const [projects, setProjects] = React.useState<Project[]>([]);
    const navigate = useNavigate()

    const handleLogout = () => {
        setUser(null); // Clear user context
        localStorage.removeItem("token"); // Remove token from local storage
        navigate("/login");
    }
    React.useEffect(() => {
        // Fetch projects from the server
        axios.get("http://localhost:3001/allProjects")
            .then(response => {
                setProjects(response.data);
            })
            .catch(error => console.error("Error fetching projects:", error));
    }, []);

    return(
        <>
        <center>
            <h1>
                User : {user ? user.name : "Guest"},  {user ? user.email : "Guest"}
            </h1>
            <button className="btn btn-danger" onClick={handleLogout}>
                Logout
            </button>
        </center>
        <div className="container mt-5">
            <h2>Available Projects</h2>
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

export default Home;