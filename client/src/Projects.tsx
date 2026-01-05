import {useEffect, useState} from 'react';
import {api} from './lib/api.ts';
import {DashboardLayout} from './components/DashboardLayout';
import {Link} from 'react-router-dom';
import {Modal} from "./components/Modal.tsx";
import {useProjects} from "./components/ProjectContext.tsx";
import {useSocketUpdate} from "./components/SocketUpdateHook.tsx";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (projectName: string) => void;
}

export const CreateProjectModal = ({ isOpen, onClose, onSubmit }: ModalProps) => {
    const [name, setName] = useState('');

return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={() => {onSubmit(name)}}
            title="Create New Project"
            submitLabel="Create Project"
        >
            <div className="p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
                <input
                    autoFocus
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    placeholder="e.g. My Awesome App"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
        </Modal>
    );

};

export const ProjectsPage = () => {
    useSocketUpdate();

    const {setProjects, getAllProjects} = useProjects();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        api('/api/project/getProjects',{  method: "POST",}).then(res => res.json()).then((responseBody) => {
            const projectsById = responseBody.projects.map((project: { id: any; }) => [project.id, project])
            setProjects(new Map(projectsById))
        });

        // const ws = new WebSocket(`ws://localhost:3000?`);
        //
        //
        //
        // ws.onmessage = (event) => {
        //     console.log('this is the event sent', event.data)
        //     setProjects((prevState) => {
        //         console.log('Got the new value', prevState,event.data)
        //            return [ JSON.parse(event.data), ...prevState]
        //     }
        //
        //     )
        //
        // }
    }, []);

    function handleCreateProject(name: string){
        setIsModalOpen(false)
        api('/api/project/createProject', {body: JSON.stringify({name}),  method: "POST",});

    }

    return (
        <DashboardLayout userEmail="user@example.com">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
                <button className="bg-indigo text-black px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-md" onClick={()=> {
                    setIsModalOpen(true)
                }}>
                    + New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getAllProjects().map((project: any) => (
                    <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        state={{ project }} // This passes the whole object!
                    >
                    <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                    {project.name[0]}
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                    Invite Contributor
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <button className="bg-gray-800 text-black px-3 py-1.5 rounded-md text-sm hover:bg-black transition">
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </Link>
                ))}
            </div>
            {/* The Modal */}
            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateProject}
            />
        </DashboardLayout>
    );
};