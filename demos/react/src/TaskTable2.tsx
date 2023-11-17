import React, { useCallback } from "react";
import { Task } from "./data/tasks/schema.js";
import { PersistentTreap } from "@vlcn.io/materialite";
import { Page, VirtualTable2 } from "./virtualized/VirtualTable2.js";

type TaskTableProps = {
  tasks: PersistentTreap<Task>;
  onTaskClick: (task: Task) => void;
  selectedTask?: number;
};

const page: Page<string> = {
  hasNext: true,
  hasPrev: false,
  nextCursor: "sdf",
  prevCursor: "sdf",
};
export const TaskTable2: React.FC<TaskTableProps> = ({ tasks }) => {
  const onLoadNext = useCallback(() => {
    console.log("loading next");
  }, []);
  const onLoadPrev = useCallback(() => {
    console.log("loading prev");
  }, []);

  return (
    <div className="bg-gray-100 p-6 overflow-y-auto task-table">
      <VirtualTable2
        page={page}
        width="100%"
        height={window.innerHeight - 130}
        loading={false}
        onLoadNext={onLoadNext}
        onLoadPrev={onLoadPrev}
      >
        {tasks.map((t) => (
          <Row task={t} key={t.id} onClick={() => {}} />
        ))}
      </VirtualTable2>
    </div>
  );
};

function Row({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <tr
      style={{ height: 50 }}
      className={`border-t cursor-pointer ${
        task.id === 1 ? "bg-blue-200" : "hover:bg-blue-100"
      }`}
      onClick={onClick}
    >
      <td className="py-2 px-3">{task.id}</td>
      <td className="py-2 px-3">{task.title}</td>
      <td className="py-2 px-3">{task.assignee}</td>
      <td className="py-2 px-3">{task.dueDate.toISOString().split("T")[0]}</td>
      <td className="py-2 px-3">{task.status}</td>
      <td className="py-2 px-3">{task.priority}</td>
      <td className="py-2 px-3">{task.project}</td>
      <td className="py-2 px-3">{task.labels.join(", ")}</td>
    </tr>
  );
}