import {type NextFunction, type Request, type Response, Router} from "express";
import {prisma} from '../lib/prisma'
import {userSockets} from "../web_socket_server";

export const router = Router()

async function isUserProjectCollaborator(userId: number, projectId: number): Promise<boolean>{
    const projectRecordCollaboratorRecord = await prisma.projectCollaborator.findFirst({
        where: {
            projectId,
            userId
        }
    })

    return projectRecordCollaboratorRecord !== null

}

function parseProjectFromBody(maybeProjectId: any): number | null{
    if (!maybeProjectId) {
        return null;
    }

    return  parseInt(maybeProjectId!);
}

async function validateProjectPermissionMiddlewareAsync(req:Request, res: Response, next: NextFunction){
    const user = req.user!
    const projectId =parseProjectFromBody ( req.body.projectId);

    if (!projectId) {
        res.sendStatus(404);
        return
    }

    const isUserCollaboratorResult = await isUserProjectCollaborator(user.id, projectId)

    if(!isUserCollaboratorResult){
        res.status(403).json({error: 'Invalid permission'})
    }

    req.body.projectId = projectId;

    next()
}

router.post('/getProject',[validateProjectPermissionMiddlewareAsync], async (req: Request, res: Response) => {

    const projectId: number = req.body.projectId;

    const project = await prisma.project.findUnique({where: {id: projectId}})

    if (!project) {
        res.status(404).json({error: 'Project Not Found'})
        return
    }

    res.status(200).json({project})
    return
});

router.post('/getProjects', async (req: Request, res: Response) => {

    const user = req.user!
    const projectIds = await prisma.projectCollaborator.findMany({where: {userId: user.id}, select: {projectId:true}})

    const projects = await prisma.project.findMany({where: {id: {in: projectIds.map((project) => project.projectId)}}})


    res.status(200).json({projects})
    return
});

router.post('/createProject', async (req: Request, res: Response) => {
    const user = req.user!;
    const name = req.body.name! as string;

   const project = await prisma.project.create({data: {
        authorUserId: user.id,
            content: "",
            name,
        }});

   await prisma.projectCollaborator.create({data: {
       projectId: project.id, userId: user.id
       }});

    const socket = userSockets.get(user.id);
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(project));
    }

    res.sendStatus(200);
    return
});

router.post('/editProjectContent',[validateProjectPermissionMiddlewareAsync], async (req: Request, res: Response) => {
    const user = req.user!;
    const projectId: number = req.body.projectId;
    const newContent = req.body.newContent;

    await prisma.project.update({where: {id: projectId}, data: {
        content: newContent ?? ''
        }});

    res.sendStatus(200);
    return
});

router.post('/inviteUser',[validateProjectPermissionMiddlewareAsync], async (req: Request, res: Response) => {
    const projectId: number = req.body.projectId;
    const userEmail: string = req.body.userEmail;

    const queryRes = await prisma.user.findMany({where: {email:userEmail}})

    if(queryRes.length !== 1){
        res.status(400).json({error: 'Invalid user'});
        return
    }

    const user = queryRes[0]!
    await prisma.projectCollaborator.create({data:{
            projectId,
            userId: user.id
        }});


    const project = await prisma.project.findUnique({where: {id: projectId}})
    const socket = userSockets.get(user.id);

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(project));
    }

    res.sendStatus(200);
    return
});

