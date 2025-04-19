import {createContext, useState} from "react"

export const UserContext = createContext({})

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null)

    // Function to update user data
    const updateUser = (userData) => {
        setUser(userData)
    }

    // Function to clear user data on Logout
    const clearUser = () => {
        setUser(null)
    }

    const updateUserState = (key, value) => {
        setUser(prev => ({
                ...prev,
                [key]: value
            }
        ))
    }

    // Update totalPollsCreated count locally
    const onPollCreateAndDelete = (type = "create") => {
        const totalPollsCreated = user.totalPollsCreated || 0;
        updateUserState(
            "totalPollsCreated", // key
            type === "create" ? totalPollsCreated + 1 : totalPollsCreated - 1, // value
        );
    }

    // Update totalPollsVotes count locally
    const onUserVoted = () => {
        const totalPollsVotes = user.totalPollsVotes || 0;
        updateUserState(
            "totalPollsVotes",
            totalPollsVotes + 1,
        )
    }

    // Add or Remove poll id from bookmarkedPolls
    const toggleBookmarkId = (id) => {
        const bookmarks = user.bookmarkedPolls || [];

        const index = bookmarks.indexOf(id);

        if (index === -1) {
            // Add the ID if it's not in the array
            setUser(prev => ({
                ...prev,
                bookmarkedPolls: [...bookmarks, id],
                totalPollsBookmarked: prev.totalPollsBookmarked + 1
            }))
        } else {
            // Remove the ID if it's already in the array
            setUser(prev => ({
                ...prev,
                bookmarkedPolls: bookmarks.filter((pollId) => pollId !== id),
                totalPollsBookmarked: prev.totalPollsBookmarked - 1
            }))
        }
    }

    const contextValue = {
        user,
        updateUser,
        clearUser,
        onPollCreateAndDelete,
        onUserVoted,
        toggleBookmarkId
    }

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}