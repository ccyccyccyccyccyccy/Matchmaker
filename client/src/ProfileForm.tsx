import React, { useState } from "react";
import axios from 'axios'
import { useParams, useLocation } from 'react-router-dom';
import { useUser } from "./main"; 

function ProfileForm() {

  const token = localStorage.getItem("token")
  const userContext = useUser();
            if (!userContext) {
                throw new Error("useUser must be used within a UserProvider");
            }
const { user } = userContext;
  const [formData, setFormData] = useState({
    name:user?.name ?? "",
    email: user?.email ??"",
    phone: user?.phone ??"",
    biography: user?.biography ??""
  });
  


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
     if (!formData.name || !formData.email ){
      alert("Input valid values into the form")
      return 
    }
    const updateData={
      name: formData.name, 
      email: formData.email,
      phone: formData.phone,
      biography: formData.biography
    }

    axios.post("http://localhost:3001/updateProfile", {updateData: updateData},  
            {headers: {
    Authorization: `Bearer ${token}`
  }, 
    params:{userID: user._id}, 
  }
        ).then(response => {
                if (response.status==200){
                    alert("Successfully updated profile")
                    console.log("success")
                }
                else{
                    console.log(response.data)
                }
            })
            .catch(error => console.error("Error updating profile:", error));

  }


  return (
    <>
    <form >
      <div>
        <label htmlFor="name">Name: </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="biography">Biography:</label>
        <input
        type="text"
          id="biography"
          name="biography"
          value={formData.biography}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="phone">Phone number:</label>
        <input
        type="number"
          id="phone"
          name="phone"
          value={formData.phone as string||""}
          onChange={handleChange}
          required
        />
      </div>
       <button type="submit" onClick={handleSubmit}>Submit</button>
    </form>
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
    
    </>
  );
}

export default ProfileForm;
