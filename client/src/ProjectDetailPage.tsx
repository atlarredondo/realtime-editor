import {useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {api} from './lib/api';
import {DashboardLayout} from './components/DashboardLayout';
import {Modal} from "./components/Modal.tsx";
import {useProjects} from "./components/ProjectContext.tsx";

function InviteUserModal({ isOpen, onClose, onSubmit, }: {isOpen: boolean;
    onClose: () => void;
    onSubmit: (projectName: string) => void;
}){
    const [userEmail, setUserEmail] = useState('');
    return (<Modal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={() => onSubmit(userEmail)}
        title="Invite User"
        submitLabel="Invite"
    >
        <div className="p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
            <input
                autoFocus
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="e.g. auser@test.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
            />
        </div>
    </Modal>)
}


export const ProjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const location = useLocation();

    const { getProjectById, updateProjectInList } = useProjects();

    const [content, setContent] = useState('');

    const project = useMemo(
        () => {
            console.log('inside here refreshing the project')
            const project = getProjectById(parseInt(id!)) ?? null;

            return project},
        [id, getProjectById])

    console.log('this is the project', project)


    const [isSaving, setIsSaving] = useState(false);

    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    useEffect(() => {
        if (project){
            setContent(project?.content ?? '')
        }else {
            console.log('inside here')
            api('/api/project/getProject', {
                body: JSON.stringify({projectId: id}),
                method: 'post'
            }).then(res => res.json()).then(data => {
                updateProjectInList(data.project);
                setContent(data.project.content || '');
            });
        }
    }, [project, project?.content, id, updateProjectInList]);

    const handleSave = async () => {
        setIsSaving(true);
        await api(`/api/project/editProjectContent`, {
            method: 'post',
            body: JSON.stringify({ projectId: id,  newContent: content })
        });

        setIsSaving(false);
        navigate(location.pathname, {
            replace: true,
            state: {}
        });
    };

    const handleInvite = (userEmail: string) => {
         api(`/api/project/inviteUser`, {
            method: 'post',
            body: JSON.stringify({ projectId: id,  userEmail })
        });
        setIsInviteModalOpen(false);
    }

    if (!project) return <DashboardLayout>Loading...</DashboardLayout>;

    return (
        <DashboardLayout userEmail="user@example.com">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.name}</h1>
                    <p className="text-gray-500">Project ID: {id}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-gray-800">Project Content</h3>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="text-sm bg-indigo-700 text-black px-3 py-1 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                            <textarea
                                className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-sm"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Start writing project details..."
                            />
                        </div>
                    </div>

                    {/* Sidebar Area: Members */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">

                            <h3 className="font-bold text-gray-800">Collaborators</h3>

                            <button
                                onClick={() => {setIsInviteModalOpen(true)}}
                                disabled={isInviteModalOpen}
                                className="text-xs bg-indigo-700 text-black px-1 py-1  rounded-sm hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {'Invite User'}</button>
                            </div>
                            <div className="space-y-3">
                                {/* Render the Author */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold">A</div>
                                    {// TODO: Implement show list of users\}
                                         }
                                    <div className="text-sm font-medium truncate">THE OWNER <span className="text-[10px] text-amber-600 block">Owner</span></div>
                                </div>
                                {/* Render Invited Users (Assuming your API returns an 'invites' array) */}
                                {/*{project.invites?.map((user: any) => (*/}
                                {/*    <div key={user.id} className="flex items-center gap-3">*/}
                                {/*        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">U</div>*/}
                                {/*        <div className="text-sm font-medium truncate">{user.email}</div>*/}
                                {/*    </div>*/}
                                {/*))}*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isInviteModalOpen && (
            <InviteUserModal
                isOpen={isInviteModalOpen}
                onClose={()=> (setIsInviteModalOpen(false))}
                onSubmit={handleInvite}
                />

            )}
        </DashboardLayout>
    );
};