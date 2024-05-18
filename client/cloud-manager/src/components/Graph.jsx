import GraphCPU from "./graph/GraphCPU";
import GraphMemory from "./graph/GraphMemory";
import TimePicker from "./TimePicker";

const Graph = ({ data }) => {
  return (
    <div>
      <TimePicker />
      <p>CPU</p>
      <GraphCPU />
      <p>Memory</p>
      <GraphMemory />
    </div>
  );
};

export default Graph;
