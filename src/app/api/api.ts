import { User } from "@/stores/user/modules";

const fetchUserDetails = async (email: string): Promise<User> => {
    const response = await fetch(`https://ceitba.org.ar/api/v1/user?email=${email}`);
    const data = await response.json();
    return data;
}

export { fetchUserDetails };