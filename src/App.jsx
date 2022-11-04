import { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import ThreeComponent from "./components/ThreeComponent";

function App() {
  const [Open, setOpen] = useState(true);
  const [Data, setData] = useState({
    func: "x*y",
    dx: 1,
    dy: 1,
    a: 0,
    b: 5,
    c: 0,
    d: 5,
  });

  const [ForceRerender, SetForceRerender] = useState(true);

  const updateData = (data) => {
    setData(data);
    SetForceRerender(!ForceRerender);
  };

  const OpenNav = () => {
    setOpen(!Open);
  };
  const handleClick = (event) => {
    if (event.detail === 2) {
      setOpen(!Open);
    }
  };

  return (
    <div>
      <div className="h-screen w-screen flex flex-row bg-base-100">
        <div className="basis-1/4 flex-initial bg-base-300">
          <SideBar props={{ updateData: updateData, data: Data }} />
        </div>
        {ForceRerender ? (
          <div className="flex-1" onClick={handleClick}>
            <ThreeComponent data={Data} />
          </div>
        ) : (
          <div className="flex-1" onClick={handleClick}>
            <ThreeComponent data={Data} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
