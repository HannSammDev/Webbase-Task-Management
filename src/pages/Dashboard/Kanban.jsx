import React, { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";

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

const LIST_ROWS = [
  {
    title: "Design new landing page",
    status: "Pending",
    statusClass: "bg-amber-100 text-amber-800",
    tag: "Design",
    assignee: "AJ",
  },
  {
    title: "Build user auth module",
    status: "In Progress",
    statusClass: "bg-blue-100 text-blue-800",
    tag: "Dev",
    assignee: "MR",
  },
  {
    title: "User research interviews",
    status: "In Progress",
    statusClass: "bg-blue-100 text-blue-800",
    tag: "Research",
    assignee: "SP",
  },
  {
    title: "Accessibility audit",
    status: "Review",
    statusClass: "bg-purple-100 text-purple-800",
    tag: "QA",
    assignee: "TW",
  },
  {
    title: "Migrate database schema",
    status: "Completed",
    statusClass: "bg-green-100 text-green-800",
    tag: "Dev",
    assignee: "KL",
  },
  {
    title: "Write API documentation",
    status: "Pending",
    statusClass: "bg-amber-100 text-amber-800",
    tag: "Docs",
    assignee: "—",
  },
];

const TIMELINE_ITEMS = [
  {
    title: "Migrate database schema",
    date: "May 20",
    state: "done",
    label: "Completed",
  },
  {
    title: "Create onboarding flow",
    date: "May 24",
    state: "done",
    label: "Completed",
  },
  {
    title: "Build user auth module",
    date: "Jun 5",
    state: "active",
    label: "In Progress · Due",
  },
  {
    title: "User research interviews",
    date: "Jun 7",
    state: "active",
    label: "In Progress · Due",
  },
  {
    title: "Accessibility audit",
    date: "Jun 10",
    state: "pending",
    label: "Review · Due",
  },
  {
    title: "Design new landing page",
    date: "Jun 15",
    state: "pending",
    label: "Pending · Due",
  },
];

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

const KanbanCard = ({ card }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2 cursor-pointer hover:border-gray-400 hover:shadow-sm transition-all duration-150">
    <p className="text-[13px] text-gray-900 leading-snug mb-2">{card.title}</p>
    <div className="flex items-center gap-1.5 flex-wrap">
      <Tag label={card.tag} className={card.tagClass} />
      {card.assignee && <Avatar initials={card.assignee} />}
    </div>
  </div>
);

// Mobile: accordion — one column open at a time
const MobileBoardView = () => {
  const [open, setOpen] = useState("pending");
  return (
    <div className="flex flex-col gap-2">
      {INITIAL_COLUMNS.map((col) => (
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
            <div className="p-2 bg-gray-50">
              {col.cards.map((card) => (
                <KanbanCard key={card.id} card={card} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Desktop: 4-column grid
const DesktopBoardView = () => (
  <div className="grid grid-cols-4 gap-3">
    {INITIAL_COLUMNS.map((col) => (
      <div key={col.id} className="bg-gray-50 rounded-lg p-2.5">
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
        {col.cards.map((card) => (
          <KanbanCard key={card.id} card={card} />
        ))}
      </div>
    ))}
  </div>
);

const BoardView = () => (
  <>
    <div className="block sm:hidden">
      <MobileBoardView />
    </div>
    <div className="hidden sm:block">
      <DesktopBoardView />
    </div>
  </>
);

const ListView = () => (
  <>
    {/* Mobile: stacked cards */}
    <div className="flex flex-col gap-2 sm:hidden">
      {LIST_ROWS.map((row, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3">
          <p className="text-[13px] font-medium text-gray-900 mb-2">
            {row.title}
          </p>
          <div className="flex flex-wrap gap-1.5 items-center">
            <Tag label={row.status} className={row.statusClass} />
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
          {LIST_ROWS.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-2.5 border-b border-gray-100 text-gray-900">
                {row.title}
              </td>
              <td className="px-3 py-2.5 border-b border-gray-100">
                <Tag label={row.status} className={row.statusClass} />
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

const TimelineView = () => (
  <div className="py-2">
    {TIMELINE_ITEMS.map((item, i) => (
      <div
        key={i}
        className="flex gap-3"
        style={{ marginBottom: i < TIMELINE_ITEMS.length - 1 ? 20 : 0 }}
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
          {i < TIMELINE_ITEMS.length - 1 && (
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

export const Kanban = () => {
  return (
    <div className="border border-gray-200 rounded-xl bg-white mb-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <i className="pi pi-th-large text-gray-400 text-sm" />
          <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Kanban board
          </span>
        </div>
        <button className="flex items-center gap-1 text-[12px] text-gray-500 hover:text-gray-800 border border-gray-200 rounded-md px-2.5 py-1 hover:bg-gray-50 transition-colors">
          <i className="pi pi-plus text-[11px]" />
          <span className="hidden sm:inline ml-0.5">Add task</span>
        </button>
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
            <BoardView />
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
            <ListView />
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
            <TimelineView />
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};
