interface Project{
    _id: string; // Unique identifier for the project
    title: string;
    projectDescription: string;
    roleDescription: string;
    initiatorID: string; // User ID of the project initiator
    vacancies: number;
    postedDate: Date;
    tags: string[]; // Array of tags for categorization
    duration: "< 1 month" | "1-3 months" | "3-6 months" | "6-12 months" | "> 1 year"; // Duration of the project
}

export default Project;