import React, { useState, useMemo, useEffect } from "react";
import { db } from "../../Config/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

import { TabView, TabPanel } from "primereact/tabview";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useAuth } from "../../Auth/AuthContex";

// ─── Firestore status values → internal column ids ────────────────────────────
// These strings must exactly match what you store in Firestore's "status" field
const STATUS_TO_COLUMN = {
  "To do": "todo",
  "In Progress": "inprogress",
  Review: "review",
  Completed: "completed",
};

const COLUMN_TO_STATUS = {
  todo: "To do",
  inprogress: "In Progress",
  review: "Review",
  completed: "Completed",
};

// ─── Column definitions ───────────────────────────────────────────────────────
const COLUMNS = [
  { id: "todo", label: "To Do", dotColor: "bg-yellow-400" },
  { id: "inprogress", label: "In Progress", dotColor: "bg-blue-400" },
  { id: "review", label: "Review", dotColor: "bg-purple-400" },
  { id: "completed", label: "Completed", dotColor: "bg-green-400" },
];

const STATUS_META = {
  todo: { label: "To Do", statusClass: "bg-yellow-100 text-yellow-800" },
  inprogress: {
    label: "In Progress",
    statusClass: "bg-blue-100 text-blue-800",
  },
  review: { label: "Review", statusClass: "bg-purple-100 text-purple-800" },
  completed: { label: "Completed", statusClass: "bg-green-100 text-green-800" },
};

const PRIORITY_META = {
  high: { label: "High", className: "bg-red-100 text-red-700" },
  medium: { label: "Medium", className: "bg-amber-100 text-amber-700" },
  low: { label: "Low", className: "bg-gray-100 text-gray-600" },
};

const TIMELINE_STATE_MAP = {
  completed: "done",
  inprogress: "active",
  review: "pending",
  todo: "pending",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toColumnId = (status) => STATUS_TO_COLUMN[status] ?? "todo";

const formatDate = (val) => {
  if (!val) return null;
  const d = val?.toDate ? val.toDate() : new Date(val);
  if (isNaN(d)) return null;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const toInitials = (name) => {
  if (!name) return null;
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// ─── Shared primitives ────────────────────────────────────────────────────────

const Avatar = ({ name }) => {
  const initials = toInitials(name);
  if (!initials) return null;
  return (
    <div
      title={name}
      className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold flex items-center justify-center shrink-0"
    >
      {initials}
    </div>
  );
};

const Tag = ({ label, className }) => (
  <span
    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${className}`}
  >
    {label}
  </span>
);

// ─── Kanban card ──────────────────────────────────────────────────────────────

const KanbanCard = ({ task, index }) => {
  const priority =
    PRIORITY_META[task.priority?.toLowerCase()] ?? PRIORITY_META.low;
  const due = formatDate(task.dueDate);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-white border rounded-lg p-3 mb-2 select-none
            transition-shadow duration-150
            ${
              snapshot.isDragging
                ? "border-blue-400 shadow-lg rotate-1 cursor-grabbing"
                : "border-gray-200 hover:border-gray-400 hover:shadow-sm cursor-grab"
            }
          `}
        >
          <p className="text-[13px] text-gray-900 leading-snug mb-2 font-medium">
            {task.title}
          </p>

          {task.description && (
            <p className="text-[11px] text-gray-400 leading-snug mb-2 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag label={priority.label} className={priority.className} />
            {due && (
              <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                <i className="pi pi-calendar text-[10px]" />
                {due}
              </span>
            )}
            <div className="ml-auto">
              <Avatar name={task.assignedTo} />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

// ─── Board views ──────────────────────────────────────────────────────────────

const DesktopBoardView = ({ columnMap }) => (
  <div className="grid grid-cols-4 gap-3">
    {COLUMNS.map((col) => {
      const tasks = columnMap[col.id] ?? [];
      return (
        <Droppable droppableId={col.id} key={col.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`
                rounded-lg p-2.5 min-h-[80px] transition-colors duration-150
                ${
                  snapshot.isDraggingOver
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-gray-50"
                }
              `}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    {col.label}
                  </span>
                </div>
                <span className="text-[11px] bg-white border border-gray-200 rounded-full px-1.5 py-px text-gray-500">
                  {tasks.length}
                </span>
              </div>

              {tasks.map((task, index) => (
                <KanbanCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      );
    })}
  </div>
);

const MobileBoardView = ({ columnMap }) => {
  const [open, setOpen] = useState("todo");
  return (
    <div className="flex flex-col gap-2">
      {COLUMNS.map((col) => {
        const tasks = columnMap[col.id] ?? [];
        return (
          <div
            key={col.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 text-left"
              onClick={() => setOpen(open === col.id ? null : col.id)}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  {col.label}
                </span>
                <span className="text-xs bg-white border border-gray-200 rounded-full px-2 text-gray-500">
                  {tasks.length}
                </span>
              </div>
              <i
                className={`pi ${open === col.id ? "pi-chevron-up" : "pi-chevron-down"} text-gray-400 text-xs`}
              />
            </button>

            {open === col.id && (
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-2 min-h-[40px] transition-colors ${
                      snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-50"
                    }`}
                  >
                    {tasks.map((task, index) => (
                      <KanbanCard key={task.id} task={task} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </div>
        );
      })}
    </div>
  );
};

const BoardView = ({ columnMap }) => (
  <>
    <div className="block sm:hidden">
      <MobileBoardView columnMap={columnMap} />
    </div>
    <div className="hidden sm:block">
      <DesktopBoardView columnMap={columnMap} />
    </div>
  </>
);

// ─── List view ────────────────────────────────────────────────────────────────

const ListView = ({ tasks }) => {
  const SORT_ORDER = { todo: 0, inprogress: 1, review: 2, completed: 3 };
  const rows = useMemo(
    () =>
      [...tasks].sort(
        (a, b) => (SORT_ORDER[a.columnId] ?? 9) - (SORT_ORDER[b.columnId] ?? 9),
      ),
    [tasks],
  );

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-2 sm:hidden">
        {rows.map((task) => {
          const meta = STATUS_META[task.columnId] ?? STATUS_META.todo;
          const priority =
            PRIORITY_META[task.priority?.toLowerCase()] ?? PRIORITY_META.low;
          return (
            <div
              key={task.id}
              className="border border-gray-200 rounded-lg p-3"
            >
              <p className="text-[13px] font-medium text-gray-900 mb-2">
                {task.title}
              </p>
              <div className="flex flex-wrap gap-1.5 items-center">
                <Tag label={meta.label} className={meta.statusClass} />
                <Tag label={priority.label} className={priority.className} />
                {task.assignedTo && (
                  <span className="text-[11px] text-gray-400 ml-auto">
                    {task.assignedTo}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {["Task", "Status", "Priority", "Assignee", "Due Date"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-[12px] font-medium text-gray-500 px-3 py-2 border-b border-gray-100"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((task) => {
              const meta = STATUS_META[task.columnId] ?? STATUS_META.todo;
              const priority =
                PRIORITY_META[task.priority?.toLowerCase()] ??
                PRIORITY_META.low;
              const due = formatDate(task.dueDate);
              return (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-2.5 border-b border-gray-100 text-gray-900">
                    <p className="font-medium">{task.title}</p>
                    {task.description && (
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2.5 border-b border-gray-100">
                    <Tag label={meta.label} className={meta.statusClass} />
                  </td>
                  <td className="px-3 py-2.5 border-b border-gray-100">
                    <Tag
                      label={priority.label}
                      className={priority.className}
                    />
                  </td>
                  <td className="px-3 py-2.5 border-b border-gray-100 text-gray-500">
                    {task.assignedTo || "—"}
                  </td>
                  <td className="px-3 py-2.5 border-b border-gray-100 text-gray-500">
                    {due || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

// ─── Timeline view ────────────────────────────────────────────────────────────

const TimelineView = ({ tasks }) => {
  const items = useMemo(() => {
    const ORDER = { completed: 0, inprogress: 1, review: 2, todo: 3 };
    return [...tasks]
      .sort((a, b) => (ORDER[a.columnId] ?? 9) - (ORDER[b.columnId] ?? 9))
      .map((task) => ({
        id: task.id,
        title: task.title,
        state: TIMELINE_STATE_MAP[task.columnId] ?? "pending",
        label: STATUS_META[task.columnId]?.label ?? task.columnId,
        date: formatDate(task.dueDate) ?? "No due date",
        assignedTo: task.assignedTo,
      }));
  }, [tasks]);

  return (
    <div className="py-2">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="flex gap-3"
          style={{ marginBottom: i < items.length - 1 ? 20 : 0 }}
        >
          <div className="flex flex-col items-center w-5">
            <div
              className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${
                item.state === "done"
                  ? "bg-green-500"
                  : item.state === "active"
                    ? "bg-blue-500"
                    : "bg-gray-300"
              }`}
            />
            {i < items.length - 1 && (
              <div className="w-px flex-1 bg-gray-200 mt-1" />
            )}
          </div>
          <div className="flex-1 pb-1 min-w-0">
            <p className="text-[13px] font-medium text-gray-900 leading-snug truncate">
              {item.title}
            </p>
            <p className="text-[12px] text-gray-500 mt-0.5">
              {item.label} · {item.date}
              {item.assignedTo && ` · ${item.assignedTo}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Root component ───────────────────────────────────────────────────────────

export const Kanban = () => {
  // null = loading, array = loaded
  const [tasks, setTasks] = useState(null);
  const { user } = useAuth();
  // ── Fetch flat "tasks" collection from Firestore ──────────────────────────
  useEffect(() => {
    const q = query(
      collection(db, "tasks"),
      where("assignedTo", "==", user.uid),
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          // Derive internal columnId from Firestore's "status" string
          columnId: toColumnId(d.data().status),
        }));
        setTasks(data);
      },
      (error) => {
        console.error("Firestore error:", error);
      },
    );
    return () => unsubscribe();
  }, []);

  // ── Build columnMap { todo: [tasks], inprogress: [tasks], ... } ───────────
  const columnMap = useMemo(() => {
    if (!tasks) return {};
    return tasks.reduce((acc, task) => {
      const col = task.columnId;
      if (!acc[col]) acc[col] = [];
      acc[col].push(task);
      return acc;
    }, {});
  }, [tasks]);

  // ── Drag and drop ─────────────────────────────────────────────────────────
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newColumnId = destination.droppableId;
    const newStatus = COLUMN_TO_STATUS[newColumnId];

    // 1. Optimistic update — instant UI feedback
    setTasks((prev) =>
      prev.map((t) =>
        t.id === draggableId
          ? { ...t, columnId: newColumnId, status: newStatus }
          : t,
      ),
    );

    // 2. Persist to Firestore — only the "status" field changes
    try {
      await updateDoc(doc(db, "tasks", draggableId), { status: newStatus });
    } catch (error) {
      console.error("Failed to update task status:", error);
      // onSnapshot will auto-revert if write fails
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (tasks === null) {
    return (
      <div className="border border-gray-200 rounded-xl bg-white mb-4 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <i className="pi pi-th-large text-gray-400 text-sm" />
          <span className="text-xl font-semibold text-gray-900">
            Kanban board
          </span>
        </div>
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
          <i className="pi pi-spin pi-spinner" />
          Loading…
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="border border-gray-200 rounded-xl bg-white mb-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <i className="pi pi-th-large text-gray-400 text-sm" />
            <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Kanban board
            </span>
          </div>
        </div>

        {/* Tabs */}
        <TabView
          pt={{
            root: { className: "w-full" },
            nav: {
              className:
                "border-b border-gray-100 px-2 sm:px-4 flex overflow-x-auto",
            },
            inkbar: { className: "bg-gray-900" },
          }}
        >
          <TabPanel
            header="Board"
            leftIcon="pi pi-th-large"
            pt={{
              headerAction: {
                className: "text-[13px] gap-1.5 py-2.5 px-3 whitespace-nowrap",
              },
            }}
          >
            <div className="p-3 sm:p-4">
              <BoardView columnMap={columnMap} />
            </div>
          </TabPanel>

          <TabPanel
            header="List"
            leftIcon="pi pi-list"
            pt={{
              headerAction: {
                className: "text-[13px] gap-1.5 py-2.5 px-3 whitespace-nowrap",
              },
            }}
          >
            <div className="p-3 sm:p-4">
              <ListView tasks={tasks} />
            </div>
          </TabPanel>

          <TabPanel
            header="Timeline"
            leftIcon="pi pi-clock"
            pt={{
              headerAction: {
                className: "text-[13px] gap-1.5 py-2.5 px-3 whitespace-nowrap",
              },
            }}
          >
            <div className="p-3 sm:p-4">
              <TimelineView tasks={tasks} />
            </div>
          </TabPanel>
        </TabView>
      </div>
    </DragDropContext>
  );
};
