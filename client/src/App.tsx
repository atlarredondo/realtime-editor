import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {AuthPage} from './Auth';
import {ProjectsPage} from './Projects';
import {ProjectDetailPage} from "./ProjectDetailPage.tsx";
import {ProjectProvider} from "./components/ProjectContext.tsx";

function App() {
    return (
        <ProjectProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<AuthPage mode="login" />} />
                <Route path="/signup" element={<AuthPage mode="signup" />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
        </ProjectProvider>
    );
}
export default App;