import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component-19";
import axios from 'axios'
import { useParams, useLocation } from 'react-router-dom';
import { useUser } from "./main"; 
import type Project from "../../shared/types/Project";

function InputForm() {
  const location = useLocation(); // State passed via navigate
  const { project } = location.state || {};
  const token = localStorage.getItem("token")
  const [formData, setFormData] = useState({
    title:project?.title ?? "",
    projectDescription: project?.projectDescription ??"",
    roleDescription: project?.roleDescription ??"",
    vacancies: project?.vacancies ?? null
  });
  type Duration= "< 1 month" | "1-3 months" | "3-6 months" | "6-12 months" | "> 1 year"; 
  const [duration, setDuration] = useState<Duration>( project?.duration ?? "< 1 month");

  type TagOption = {
  label: string;
  value: string;
};

  const[tags, setTags]= useState<TagOption[]>(project?.tags??[]);
  
  const tagOptions: TagOption[] = [
  { label: "AI", value: "AI" },
  { label: "Data", value: "Data" },
  { label: "Business", value: "Business" },
];
const userContext = useUser();
            if (!userContext) {
                throw new Error("useUser must be used within a UserProvider");
            }
const { user } = userContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("Form Submitted:", formData);
  //   alert("Form submitted successfully!");
  // };

  const handleSubmit=()=>{
    if (!formData.title || !formData.projectDescription || !formData.roleDescription || !formData.vacancies){
      alert("Input valid values into the form")
      return 
    }
    const project: Project = {
      _id:"placeholder", 
    title: formData.title, 
    projectDescription: formData.projectDescription,
    roleDescription: formData.roleDescription,
    initiatorID: user._id, 
    vacancies: formData.vacancies??0,
    postedDate: new Date(), 
    tags: tags.map(tag=> tag.value), 
    duration: duration
  }
  const { _id, ...projectWithoutId } = project;
   axios.post("http://localhost:3001/addProject", projectWithoutId,  
            {headers: {
    Authorization: `Bearer ${token}`
  }, 
    params:{userID: user._id}, 
  }
        )
            .then(response => {
                if (response.status==201){
                    alert("Successfully added project")
                    console.log("success")
                }
                else{
                    console.log(response.data)
                }
            })
            .catch(error => console.error("Error adding projects:", error));
  }

  return (
    <>
    <form >
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="projectDescription">Project Description:</label>
        <input
          type="text"
          id="projectDescription"
          name="projectDescription"
          value={formData.projectDescription}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="roleDescription">Role Description:</label>
        <input
        type="text"
          id="roleDescription"
          name="roleDescription"
          value={formData.roleDescription}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="vacancies">Number of vancancies:</label>
        <input
        type="number"
          id="vacancies"
          name="vacancies"
          value={formData.vacancies||""}
          onChange={handleChange}
          required
        />
      </div>
      {/* <button type="submit">Submit</button> */}
    </form>
    <label>
      Select project duration 
    <select
      value={duration} // ...force the select's value to match the state variable...
      onChange={e => setDuration(e.target.value as Duration)} // ... and update the state variable on any change!
    >
      <option value="< 1 month"> &lt; 1 month</option>
      <option value="1-3 months">1-3 months</option>
      <option value="3-6 months">3-6 months</option>
      <option value="6-12 months">6-12 months</option>
      <option value="> 1 year"> &gt; 1 year</option>
    </select>
    </label>
    <hr />
      {/* <label>
        Select project tags:
        <select
          multiple={true}
          value={tags}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setTags(values);
          }}
        >
          <option value="AI">AI</option>
          <option value="Data">Data </option>
          <option value="Business">Business</option>
        </select>
      </label> */}
      <div>
      <h1>Select Tags</h1>
      <pre>{JSON.stringify(tags)}</pre>
      <MultiSelect
        options={tagOptions}
        value={tags}
        onChange={setTags}
        labelledBy="Select"
      />
      <button onClick={handleSubmit}>
      Add project
    </button>
    </div>
    <div>
      <hr />
      <p>Project duration: {duration}</p>
      <p>Project tags: {tags.join(', ')}</p>
      </div>
    </>
  );
}

export default InputForm;
