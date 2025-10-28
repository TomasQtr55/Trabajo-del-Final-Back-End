import app from "./app.js";
import pkg from 'signale'
import AppDatasource from "./providers/datasource.provider.js";
import http from 'http'
import { initSocketServer } from "./socket/sockets.js";

const {Signale} = pkg;
const longger = new Signale({scope:'Main'})

const main = async () =>{    
    try{

        await AppDatasource.initialize()
        longger.success(`Conectamos a la base de datos`)

        const port = app.get('port')

        const server = http.createServer(app)

        initSocketServer(server)

        server.listen(port, ()=>{
            longger.log(`servidor corriendo en el puerto ${port}`)
        })
    }catch(error){
        longger.fatal(`no se pudo iniciar el server`, error)
    }
}

main()