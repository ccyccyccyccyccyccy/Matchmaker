import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component-19";

function InputForm() {
  const [formData, setFormData] = useState({
    title: "",
    projectDescription: "",
    roleDescription: "",
    vacancies: null
  });
  type Duration= "< 1 month" | "1-3 months" | "3-6 months" | "6-12 months" | "> 1 year"; 
  const [duration, setDuration] = useState<Duration>("< 1 month");
  const[tags, setTags]= useState<typeof Option[]>([]);
  const tagOptions = [
  { label: "AI", value: "AI" },
  { label: "Data", value: "Data" },
  { label: "Business", value: "Business" },
];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Form submitted successfully!");
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Submit</button>
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
      <h1>Select Fruits</h1>
      <pre>{JSON.stringify(tags)}</pre>
      <MultiSelect
        options={tagOptions}
        value={tags}
        onChange={setTags}
        labelledBy="Select"
      />
    </div>
      <hr />
      <p>Project duration: {duration}</p>
      <p>Project tags: {tags.join(', ')}</p>
    </>
  );
}

export default InputForm;
