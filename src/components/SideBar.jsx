export default function SideBar(props) {
  let data = props.props.data;

  return (
    <div>
      <div className="flex flex-col">
        <h1 className="text-5xl">Riemann 3D</h1>
        <label className="label mt-3">
          <span className="label-text text-lg">dx</span>
        </label>
        <input
          type="range"
          min={(data.b - data.a) / 30}
          max={(data.b - data.a) / 3}
          step={(data.b - data.a) / 30}
          defaultValue="1"
          onChange={(e) => {
            data.dx = parseFloat(e.target.value);
            props.props.updateData(data);
          }}
          className="ml-1 range range-primary w-11/12"
        />

        <label className="label mt-3">
          <span className="label-text text-lg">dy</span>
        </label>
        <input
          type="range"
          min={(data.b - data.a) / 30}
          max={(data.b - data.a) / 3}
          step={(data.b - data.a) / 30}
          defaultValue="1"
          onChange={(e) => {
            data.dy = parseFloat(e.target.value);
            props.props.updateData(data);
          }}
          className="ml-1 range range-primary w-11/12"
        />

        <label className="label mt-3">
          <span className="label-text text-lg">Function</span>
        </label>
        <div className="flex justify-center items-center ">
          <input
            type="text"
            placeholder="x*y"
            className="input w-[90%] max-w-xs "
            onChange={(e) => {
              try {
                let x = 1;
                let y = 1;
                eval(e.target.value);
              } catch (es) {
                return;
              }

              data.func = e.target.value;
              props.props.updateData(data);
            }}
          />
        </div>
        <label className="label mt-3">
          <span className="label-text text-lg">Domeniile de def</span>
        </label>
        <div className="flex flex-row w-[95%] gap-1 items-center ml-[2%]">
          <input
            type="text"
            placeholder="[xmin] 0"
            className="input w-[90%] max-w-xs"
            onChange={(e) => {
              data.a = parseFloat(e.target.value);
              props.props.updateData(data);
            }}
          />
          <input
            type="text"
            placeholder="[xmax] 5"
            className="input w-[90%] max-w-xs"
            onChange={(e) => {
              data.b = parseFloat(e.target.value);
              props.props.updateData(data);
            }}
          />
        </div>
        <div className="flex flex-row w-[95%] gap-1 items-center ml-[2%] mt-2">
          <input
            type="text"
            placeholder="[ymin] 0"
            className="input w-[90%] max-w-xs"
            onChange={(e) => {
              data.c = parseFloat(e.target.value);
              props.props.updateData(data);
            }}
          />
          <input
            type="text"
            placeholder="[ymax] 5"
            className="input w-[90%] max-w-xs"
            onChange={(e) => {
              data.d = parseFloat(e.target.value);
              props.props.updateData(data);
            }}
          />
        </div>
      </div>
    </div>
  );
}
