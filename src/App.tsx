import "./App.css";
import { useContext } from "react";
import { SwrveContext, SwrveProvider } from "./SwrveProvider";

function ButtonClickedEvent() {
  const { event } = useContext(SwrveContext);
  return (
    <div>
      <button onClick={() => event('button_clicked')}>
        Trigger button_clicked Event
      </button>
    </div>
  );
}

function App() {
  return (
    <SwrveProvider>
      <ButtonClickedEvent />
    </SwrveProvider>
  );
}

export default App;
