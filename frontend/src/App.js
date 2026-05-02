import { PipelineToolbar } from "./toolbar";
import { PipelineUI } from "./ui";
import { SubmitButton } from "./submit";
import { usePipelineExecution } from "./hooks/usePipelineExecution";

function App() {
  const executionState = usePipelineExecution();

  return (
    <div>
      <PipelineToolbar />
      <PipelineUI nodeStatuses={executionState.nodeStatuses} />
      <SubmitButton executionState={executionState} />
    </div>
  );
}

export default App;
