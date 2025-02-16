import { Client } from "appwrite";
import config from '../conf/config'

const client = new Client()
    .setEndpoint(config.databaseEndPoint)
    .setProject(config.projectId);
    console.log( config.databaseEndPoint , config.projectId);
    

    export default client;