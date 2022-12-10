import React from "react";
import "./App.css";
import Header from "./components/header/header";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./pages/Home";
import CounterPage from "./pages/CounterPage";
import Counter from "./components/counter";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
      </div>
      <Route path="/" component={Home} exact />
      <Route path="/counter" component={CounterPage} />
      <Route path="/bicepcurls">
        {" "}
        <Counter exercise={"bicepCurls"} />{" "}
      </Route>
      <Route path="/squats">
        {" "}
        <Counter exercise={"squats"} />{" "}
      </Route>
    </BrowserRouter>
  );
}

export default App;
