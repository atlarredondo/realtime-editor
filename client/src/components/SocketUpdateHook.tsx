import {useEffect} from "react";
import {socketService} from "../services/socket_service.tsx";
import {useProjects} from "./ProjectContext.tsx";


// function onMessageCallback(payload): void {
//     const parsedPayload = JSON.parse(payload)
//
//     const type: 'projects' | 'project' = parsedPayload.type;
//
//     switch(type){
//         case 'project':
//
//     }
// }

export const useSocketUpdate = () => {
    // update project list
    const {updateProjectInList} = useProjects()

    useEffect(() => {
        socketService.connect();
        // TODO( set a more complex by event type function with different callbacks
        socketService.onMessageRegister((payload) => {updateProjectInList(JSON.parse(payload))})
    }, []);

}