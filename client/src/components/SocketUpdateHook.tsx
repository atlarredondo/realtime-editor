import {useEffect} from "react";
import {socketService} from "../services/socket_service.tsx";
import {useProjects} from "./ProjectContext.tsx";


export const useSocketUpdate = () => {
    // update project list
    const setProjects = useProjects()

    useEffect(() => {
        socketService.connect();
        // TODO( set a more complex by event type function with different callbacks
        socketService.onMessageRegister(setProjects)
    }, []);

}