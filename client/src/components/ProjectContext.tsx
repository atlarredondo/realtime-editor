import React, {createContext, useCallback, useContext, useState} from 'react';

interface ProjectContextType {
    projects: Map<number, any>;
    setProjects: (newProjects: Map<number, any>) => void;
        // React.Dispatch<React.SetStateAction<Map<number, any>>>;
    updateProjectInList: (updatedProject: any) => void;
    getProjectById: (id: number) => any | undefined;
    getAllProjects: () => any[]
}

const ProjectContext = createContext<ProjectContextType |null>(null)

export const ProjectProvider = ({children}: {children: React.ReactNode}) =>{
    const [projects, setProjectsState] = useState<Map<number, any>>(new Map())

    const setProjects = useCallback((newProjects:  Map<number, any>) => {
        console.log('inside here updating', newProjects)
        setProjectsState(newProjects)
        console.log('after in context', projects)
    }, [])

    const updateProjectInList = useCallback((updatedProject: any)=> {
        setProjects((prev) => {
            prev.set(updatedProject.id, updatedProject)
            return prev
        }


        )

    }, [])

    const getProjectById = useCallback((id: number) => {
        return projects.get(id)
    }, [])

    const getAllProjects = useCallback(()=>
    {return Array.from(projects.values())}, []

    )

    return (
        <ProjectContext.Provider
            value={{
                projects,
                setProjects,
                updateProjectInList,
                getProjectById,
                getAllProjects
            }}
            >
            {children}
        </ProjectContext.Provider>

    )
}

export const useProjects = () => {
    const context = useContext(ProjectContext);
    if (!context) throw new Error('useProjects must be used within a ProjectProvider');
    return context;
};