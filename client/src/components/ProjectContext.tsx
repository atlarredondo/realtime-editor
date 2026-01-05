import React, {createContext, useCallback, useContext, useState} from 'react';
import type { Project} from '../../../generated/prisma/client';

interface ProjectContextType {
    projects: Map<number, Project>;
    setProjects: (newProjects: Map<number, Project>) => void;
        // React.Dispatch<React.SetStateAction<Map<number, any>>>;
    updateProjectInList: (updatedProject: Project) => void;
    getProjectById: (id: number) => Project | undefined;
    getAllProjects: () => Array<Project>
}

const ProjectContext = createContext<ProjectContextType |null>(null)

export const ProjectProvider = ({children}: {children: React.ReactNode}) =>{
    const [projects, setProjectsState] = useState<Map<number, Project>>(new Map())

    const setProjects = useCallback((newProjects:  Map<number, Project>) => {
        setProjectsState(new Map(newProjects));
    }, [])

    const updateProjectInList = useCallback((updatedProject: Project)=> {
        setProjectsState((prev) => {
            console.log('this is the updated project', updatedProject)
            const newMap = new Map(prev)
                newMap.set(updatedProject.id, updatedProject)
            return newMap
        }
        )

    }, [])

    const getProjectById = useCallback((id: number) => {
        return projects.get(id)
    }, [projects])

    const getAllProjects = useCallback(()=> {
        return Array.from(projects.values())

    }, [projects] )

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