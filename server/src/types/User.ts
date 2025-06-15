interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    biography?: string;
}

export default User;