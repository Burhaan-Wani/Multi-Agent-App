import { Routes, Route } from "react-router";
import Auth from "./pages/Auth";
const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<>hi threr</>} />
                <Route path="auth" element={<Auth />} />
            </Routes>
        </>
    );
};

export default App;
