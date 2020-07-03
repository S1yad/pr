import { Router } from "express";
import Controller from "./controllers/controller";
import regController from "./controllers/regController";
const apiRouter = new Router();

apiRouter.get("/logo.png", Controller.logo)
apiRouter.get("/main", Controller.main);
apiRouter.get("/allUsers", Controller.allUsers)

//Registration and authorization
apiRouter.get("/registrationPage", Controller.registrationPage);
apiRouter.post("/registration", regController.registration);
apiRouter.post("/login", regController.logIn);
apiRouter.get("/logOut", regController.logOut);

apiRouter.get("/userPage", Controller.userPage);

//Quations
apiRouter.post("/newQuation", Controller.newQuation);
apiRouter.post("/addAnswer", Controller.addAnswer);
apiRouter.get("/allQuations", Controller.allQuations);
apiRouter.post("/quationPage", Controller.quationPage);

apiRouter.delete("/", regController.deleteById);



export default apiRouter;