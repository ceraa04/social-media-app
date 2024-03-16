import "../assets/index.css";
import { IoMdPersonAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import { getAllProfiles } from "../api/getAllProfilesApi";
import { userType } from "../../../server/types/userType";

// Return user by username

const AllProfiles: React.FC<{ currentUser: userType }> = ({ currentUser }) => {
    // Initialize state for loading
    const [loading, setLoading] = useState<boolean>(true)
    const [users, setUsers] = useState<userType[]>([])

    // Fetch all profiles on first render, and set loading to false
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let data = await getAllProfiles()

                // Display all profiles except for current user one
                data = data.filter(user => user.username !== currentUser.username)
                setUsers(data)
            }
            catch (error) {
                console.error("Error occured while fetching all profiles from DB: " + error)
            }
            setLoading(false)
        }
        fetchUsers()

    }, [currentUser.username])

    // Handle search bar on input
    const [searchProfile, setSearchProfile] = useState<string>('')
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const searchValue = e.target.value;
        setSearchProfile(searchValue)
    }

    // I will use filteredUsers array to display users
    let filteredUsers: userType[];

    // Filter them by input value
    if (users.length > 0) {
        filteredUsers = users.filter(user => {
            return user.username.toLowerCase().includes(searchProfile.toLowerCase())
        })
    } else {
        filteredUsers = []
    }
    return (
        <div>
            <div className="my-20 flex flex-col gap-32 items-center overflow-auto">
                <div className="flex flex-col items-center gap-7">
                    <h2 data-testid="allProfiles-header"
                        className="text-4xl">All profiles</h2>
                    <input onChange={handleInputChange}
                        className="px-5 py-3 w-[30rem] text-black
                        focus:outline-none rounded-full"
                        type="text" placeholder="Search for profiles" />
                </div>
                <div className="flex flex-wrap gap-20 justify-center">

                    {!loading && filteredUsers.length === 0 &&
                        <p className="text-2xl">No profiles found!</p>
                    }

                    {!loading && filteredUsers && filteredUsers.map((user: userType, index: number) => (
                        <div className="profileWrapper" key={index}>
                            <Link to={`/users/${user.username}`}>
                                <div className="flex place-items-center">
                                    <img className="w-10 rounded-full" src={user.avatar} alt="" />
                                    <p className="pl-10 text-[1.2rem]">{user.username}</p>
                                </div>
                            </Link>
                            <p className="flex justify-end w-full">
                                <span className="bg-white px-2 text-black rounded-full
                                text-2xl">
                                    < IoMdPersonAdd />
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
};

export default AllProfiles;
