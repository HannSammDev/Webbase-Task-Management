import React, { useState, useMemo } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { AddTaskForm } from "../../component/AddTaskForm";

const INITIAL_COLUMNS = [
  {
    id: "pending",
    label: "Pending",
    dotColor: "bg-yellow-400",
    cards: [
      {
        id: 1,
        title: "Design new landing page",
        tag: "Design",
        tagClass: "bg-blue-100 text-blue-800",
        assignee: "AJ",
      },
      {
        id: 2,
        title: "Set up CI/CD pipeline",
        tag: "DevOps",
        tagClass: "bg-amber-100 text-amber-800",
        assignee: "KL",
      },
      {
        id: 3,
        title: "Write API documentation",
        tag: "Docs",
        tagClass: "bg-green-100 text-green-800",
        assignee: null,
      },
    ],
  },
  {
    id: "inprogress",
    label: "In Progress",
    dotColor: "bg-blue-400",
    cards: [
      {
        id: 4,
        title: "Build user auth module",
        tag: "Dev",
        tagClass: "bg-blue-100 text-blue-800",
        assignee: "MR",
      },
      {
        id: 5,
        title: "User research interviews",
        tag: "Research",
        tagClass: "bg-pink-100 text-pink-800",
        assignee: "SP",
      },
    ],
  },
  {
    id: "review",
    label: "Review",
    dotColor: "bg-purple-400",
    cards: [
      {
        id: 6,
        title: "Accessibility audit",
        tag: "QA",
        tagClass: "bg-amber-100 text-amber-800",
        assignee: "TW",
      },
      {
        id: 7,
        title: "Update privacy policy",
        tag: "Legal",
        tagClass: "bg-green-100 text-green-800",
        assignee: null,
      },
    ],
  },
  {
    id: "completed",
    label: "Completed",
    dotColor: "bg-green-400",
    cards: [
      {
        id: 8,
        title: "Migrate database schema",
        tag: "Dev",
        tagClass: "bg-blue-100 text-blue-800",
        assignee: "KL",
      },
      {
        id: 9,
        title: "Create onboarding flow",
        tag: "Design",
        tagClass: "bg-blue-100 text-blue-800",
        assignee: "AJ",
      },
    ],
  },
];

const STATUS_MAP = {
  pending: { label: "Pending", statusClass: "bg-amber-100 text-amber-800" },
  inprogress: {
    label: "In Progress",
    statusClass: "bg-blue-100 text-blue-800",
  },
  review: { label: "Review", statusClass: "bg-purple-100 text-purple-800" },
  completed: { label: "Completed", statusClass: "bg-green-100 text-green-800" },
};

const TIMELINE_DATE_MAP = {
  8: "May 20",
  9: "May 24",
  4: "Jun 5",
  5: "Jun 7",
  6: "Jun 10",
  1: "Jun 15",
};

const TIMELINE_STATE_MAP = {
  completed: "done",
  inprogress: "active",
  review: "pending",
  pending: "pending",
};

// ─── Shared primitives ────────────────────────────────────────────────────────

const Avatar = ({ initials }) => (
  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold flex items-center justify-center shrink-0">
    {initials}
  </div>
);

const Tag = ({ label, className }) => (
  <span
    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${className}`}
  >
    {label}
  </span>
);

// ─── Kanban card (draggable-aware) ────────────────────────────────────────────

const KanbanCard = ({ card, index }) => (
  <Draggable draggableId={String(card.id)} index={index}>
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
        <p className="text-[13px] text-gray-900 leading-snug mb-2">
          {card.title}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Tag label={card.tag} className={card.tagClass} />
          {card.assignee && <Avatar initials={card.assignee} />}
        </div>
      </div>
    )}
  </Draggable>
);

// ─── Board views ──────────────────────────────────────────────────────────────

const DesktopBoardView = ({ columns }) => (
  <div className="grid grid-cols-4 gap-3">
    {columns.map((col) => (
      <Droppable droppableId={col.id} key={col.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              rounded-lg p-2.5 min-h-[80px] transition-colors duration-150
              ${snapshot.isDraggingOver ? "bg-blue-50 border border-blue-200" : "bg-gray-50"}
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
                {col.cards.length}
              </span>
            </div>
            {col.cards.map((card, index) => (
              <KanbanCard key={card.id} card={card} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    ))}
  </div>
);

const MobileBoardView = ({ columns }) => {
  const [open, setOpen] = useState("pending");
  return (
    <div className="flex flex-col gap-2">
      {columns.map((col) => (
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
                {col.cards.length}
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
                  className={`p-2 min-h-[40px] transition-colors ${snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-50"}`}
                >
                  {col.cards.map((card, index) => (
                    <KanbanCard key={card.id} card={card} index={index} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </div>
      ))}
    </div>
  );
};

const BoardView = ({ columns }) => (
  <>
    <div className="block sm:hidden">
      <MobileBoardView columns={columns} />
    </div>
    <div className="hidden sm:block">
      <DesktopBoardView columns={columns} />
    </div>
  </>
);

// ─── List view (derived from columns state) ───────────────────────────────────

const ListView = ({ columns }) => {
  const rows = useMemo(
    () =>
      columns.flatMap((col) =>
        col.cards.map((card) => ({
          title: card.title,
          tag: card.tag,
          assignee: card.assignee || "—",
          ...STATUS_MAP[col.id],
        })),
      ),
    [columns],
  );

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-2 sm:hidden">
        {rows.map((row, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3">
            <p className="text-[13px] font-medium text-gray-900 mb-2">
              {row.title}
            </p>
            <div className="flex flex-wrap gap-1.5 items-center">
              <Tag label={row.label} className={row.statusClass} />
              <Tag label={row.tag} className="bg-gray-100 text-gray-700" />
              <span className="text-[11px] text-gray-400 ml-auto">
                {row.assignee}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {["Task", "Status", "Tag", "Assignee"].map((h) => (
                <th
                  key={h}
                  className="text-left text-[12px] font-medium text-gray-500 px-3 py-2 border-b border-gray-100"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2.5 border-b border-gray-100 text-gray-900">
                  {row.title}
                </td>
                <td className="px-3 py-2.5 border-b border-gray-100">
                  <Tag label={row.label} className={row.statusClass} />
                </td>
                <td className="px-3 py-2.5 border-b border-gray-100">
                  <Tag label={row.tag} className="bg-gray-100 text-gray-700" />
                </td>
                <td className="px-3 py-2.5 border-b border-gray-100 text-gray-500">
                  {row.assignee}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

// ─── Timeline view (derived from columns state) ───────────────────────────────

const TimelineView = ({ columns }) => {
  const items = useMemo(() => {
    const allCards = columns.flatMap((col) =>
      col.cards.map((card) => ({
        title: card.title,
        state: TIMELINE_STATE_MAP[col.id] ?? "pending",
        label: STATUS_MAP[col.id]?.label ?? col.label,
        date: TIMELINE_DATE_MAP[card.id] ?? "TBD",
        _sortOrder:
          col.id === "completed"
            ? 0
            : col.id === "inprogress"
              ? 1
              : col.id === "review"
                ? 2
                : 3,
      })),
    );
    return allCards.sort((a, b) => a._sortOrder - b._sortOrder);
  }, [columns]);

  return (
    <div className="py-2">
      {items.map((item, i) => (
        <div
          key={i}
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
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Root component ───────────────────────────────────────────────────────────

export const Kanban = () => {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Dropped outside any droppable or in the same spot
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newColumns = columns.map((col) => ({
      ...col,
      cards: [...col.cards],
    }));

    const srcColIdx = newColumns.findIndex((c) => c.id === source.droppableId);
    const dstColIdx = newColumns.findIndex(
      (c) => c.id === destination.droppableId,
    );

    const [movedCard] = newColumns[srcColIdx].cards.splice(source.index, 1);
    newColumns[dstColIdx].cards.splice(destination.index, 0, movedCard);

    setColumns(newColumns);
  };

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
          <AddTaskForm />
        </div>

        {/* TabView */}
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
              <BoardView columns={columns} />
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
              <ListView columns={columns} />
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
              <TimelineView columns={columns} />
            </div>
          </TabPanel>
        </TabView>
      </div>
    </DragDropContext>
  );
};
