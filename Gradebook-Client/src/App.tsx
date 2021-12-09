import { Redirect, Route, Switch } from "react-router-dom";
import About from "./Components/About/About";
import Createpost from "./Components/CreatePost/Createpost";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import Landing from "./Components/Landing/Landing";
import Login from "./Components/Login/Login";
import Navigation from "./Components/Navigation/Navigation";
import Register from "./Components/Register/Register";
import { ApplicationContextProvider } from "./Hooks/ApplicationContext";

// const client = createClient({
//   url: url2,
//   fetchOptions: {
//     credentials: "include" as const,
//     headers: {
      
//     }
    
//   },
//   exchanges: [
//     dedupExchange,
//     cacheExchange,
//     fetchExchange,
//     authExchange({
//       getAuth: async ({authState, mutate}: any)=> {

//       }
//     })
//   ]
// });

function App() {
  return (
    <>
      <ApplicationContextProvider>
        {/* <Provider value={client}> */}
          <Navigation />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/create-post" component={Createpost} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/about" component={About} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        {/* </Provider> */}
      </ApplicationContextProvider>
    </>
  );
}

export default App;


