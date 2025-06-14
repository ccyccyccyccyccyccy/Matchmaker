//User without password to be shared with the client
interface UserNoPassword {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    biography?: string;
}
export default UserNoPassword;