import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";

import {UserProvider} from "./context/UserContext.jsx";

import LoginForm from "./pages/Auth/LoginForm.jsx";
import SignUpForm from "./pages/Auth/SignUpForm.jsx";
import Home from "./pages/Dashboard/Home.jsx";
import CreatePoll from "./pages/Dashboard/CreatePoll.jsx";
import MyPolls from "./pages/Dashboard/MyPolls.jsx";
import VotedPolls from "./pages/Dashboard/VotedPolls.jsx";
import Bookmarks from "./pages/Dashboard/Bookmarks.jsx";

import {Toaster} from "react-hot-toast";

function App() {
    return (
        <>
            <UserProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Root/>}/>
                        <Route path="/login" exact element={<LoginForm/>}/>
                        <Route path="/signUp" exact element={<SignUpForm/>}/>
                        <Route path="/dashboard" exact element={<Home/>}/>
                        <Route path="/create-poll" exact element={<CreatePoll/>}/>
                        <Route path="/my-polls" exact element={<MyPolls/>}/>
                        <Route path="/voted-polls" exact element={<VotedPolls/>}/>
                        <Route path="/bookmarked-polls" exact element={<Bookmarks/>}/>
                    </Routes>
                </Router>

                <Toaster
                    toastOptions={{
                    className: "",
                    style: {
                        fontSize: "13px",
                    },
                }}
                />
            </UserProvider>
        </>
    );
}

export default App;

// Handle initial Navigate
const Root = () => {
    // Check if token exist in localStorage
    const isAuthorized = !!localStorage.getItem("token");

    return isAuthorized ? (
        <Navigate to="/dashboard"/>
    ) : (
        <Navigate to="/login"/>
    )
}