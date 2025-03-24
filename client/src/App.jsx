import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ProSidebarProvider } from "react-pro-sidebar";

import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// import Topbar from "./components/Topbar";
// import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/dashboard";
import Login from "./components/Login";
// import Calender from "./pages/calender";
// import Notes from "./pages/notes";
// import Settings from "./pages/settings";
import PrivateRoutes from "./utils/PrivateRoutes";
import RegisterPage from "./components/RegisterPage";

function App() {
    const [theme, colorMode] = useMode();

    return (
        <ProSidebarProvider>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <div className="app">
                        <AuthProvider>
                            <Routes>
                                <Route element={<PrivateRoutes />}>
                                    <Route
                                        path="/dashboard"
                                        element={<Dashboard />}
                                        exact
                                    />
                                </Route>
                                <Route element={<Login />} path="/login" />
                                <Route
                                    element={<RegisterPage />}
                                    path="/register"
                                />
                                <Route path="/" element={<Login />} />
                                {/* <Route
                                    path="/calender"
                                    element={<Calender />}
                                />
                                <Route path="/notes" element={<Notes />} />
                                <Route
                                    path="/settings"
                                    element={<Settings />}
                                /> */}
                            </Routes>
                        </AuthProvider>
                    </div>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </ProSidebarProvider>
    );
}

export default App;
