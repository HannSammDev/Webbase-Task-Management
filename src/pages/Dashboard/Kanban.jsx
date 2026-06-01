import React, { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";

const styles = `
  @media (max-width: 768px) {
    .kanban-board {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 8px !important;
    }
    .kanban-column {
      padding: 8px !important;
    }
  }
  @media (max-width: 480px) {
    .kanban-board {
      grid-template-columns: 1fr !important;
      gap: 8px !important;
    }
    .kanban-column {
      padding: 6px !important;
    }
    .list-table {
      font-size: 12px !important;
    }
    .list-table th, .list-table td {
      padding: 6px 4px !important;
    }
    .list-table .hide-mobile {
      display: none !important;
    }
    .kanban-header {
      font-size: 13px !important;
    }
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  if (!document.head.querySelector("style[data-kanban]")) {
    styleSheet.setAttribute("data-kanban", "true");
    document.head.appendChild(styleSheet);
  }
}

const INITIAL_COLUMNS = [
  {
    id: "pending",
    label: "Pending",
    cards: [
      {
        id: 1,
        title: "Design new landing page",
        tag: "Design",
        tagColor: "#1D4ED8",
        tagBg: "#DBEAFE",
        assignee: "AJ",
      },
      {
        id: 2,
        title: "Set up CI/CD pipeline",
        tag: "DevOps",
        tagColor: "#92400E",
        tagBg: "#FEF3C7",
        assignee: "KL",
      },
      {
        id: 3,
        title: "Write API documentation",
        tag: "Docs",
        tagColor: "#065F46",
        tagBg: "#D1FAE5",
        assignee: null,
      },
    ],
  },
  {
    id: "inprogress",
    label: "In Progress",
    cards: [
      {
        id: 4,
        title: "Build user auth module",
        tag: "Dev",
        tagColor: "#1D4ED8",
        tagBg: "#DBEAFE",
        assignee: "MR",
      },
      {
        id: 5,
        title: "User research interviews",
        tag: "Research",
        tagColor: "#9D174D",
        tagBg: "#FCE7F3",
        assignee: "SP",
      },
    ],
  },
  {
    id: "review",
    label: "Review",
    cards: [
      {
        id: 6,
        title: "Accessibility audit",
        tag: "QA",
        tagColor: "#92400E",
        tagBg: "#FEF3C7",
        assignee: "TW",
      },
      {
        id: 7,
        title: "Update privacy policy",
        tag: "Legal",
        tagColor: "#065F46",
        tagBg: "#D1FAE5",
        assignee: null,
      },
    ],
  },
  {
    id: "completed",
    label: "Completed",
    cards: [
      {
        id: 8,
        title: "Migrate database schema",
        tag: "Dev",
        tagColor: "#1D4ED8",
        tagBg: "#DBEAFE",
        assignee: "KL",
      },
      {
        id: 9,
        title: "Create onboarding flow",
        tag: "Design",
        tagColor: "#1D4ED8",
        tagBg: "#DBEAFE",
        assignee: "AJ",
      },
    ],
  },
];

const LIST_ROWS = [
  {
    title: "Design new landing page",
    status: "Pending",
    statusColor: "#92400E",
    statusBg: "#FEF3C7",
    tag: "Design",
    assignee: "AJ",
  },
  {
    title: "Build user auth module",
    status: "In Progress",
    statusColor: "#1D4ED8",
    statusBg: "#DBEAFE",
    tag: "Dev",
    assignee: "MR",
  },
  {
    title: "User research interviews",
    status: "In Progress",
    statusColor: "#1D4ED8",
    statusBg: "#DBEAFE",
    tag: "Research",
    assignee: "SP",
  },
  {
    title: "Accessibility audit",
    status: "Review",
    statusColor: "#9D174D",
    statusBg: "#FCE7F3",
    tag: "QA",
    assignee: "TW",
  },
  {
    title: "Migrate database schema",
    status: "Completed",
    statusColor: "#065F46",
    statusBg: "#D1FAE5",
    tag: "Dev",
    assignee: "KL",
  },
  {
    title: "Write API documentation",
    status: "Pending",
    statusColor: "#92400E",
    statusBg: "#FEF3C7",
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
  <div
    style={{
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: "#DBEAFE",
      color: "#1D4ED8",
      fontSize: 9,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {initials}
  </div>
);

const Tag = ({ label, color, bg }) => (
  <span
    style={{
      fontSize: 11,
      fontWeight: 500,
      padding: "2px 8px",
      borderRadius: 999,
      background: bg,
      color,
    }}
  >
    {label}
  </span>
);

const KanbanCard = ({ card }) => (
  <div
    style={{
      background: "#fff",
      border: "0.5px solid #E5E7EB",
      borderRadius: 8,
      padding: "10px 12px",
      marginBottom: 8,
      cursor: "pointer",
      transition: "border-color .15s, box-shadow .15s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "#9CA3AF";
      e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.06)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "#E5E7EB";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <p
      style={{
        fontSize: 13,
        color: "#111827",
        lineHeight: 1.45,
        marginBottom: 8,
      }}
    >
      {card.title}
    </p>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap",
      }}
    >
      <Tag label={card.tag} color={card.tagColor} bg={card.tagBg} />
      {card.assignee && <Avatar initials={card.assignee} />}
    </div>
  </div>
);

const BoardView = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="kanban-board"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 12,
      }}
    >
      {INITIAL_COLUMNS.map((col) => (
        <div
          key={col.id}
          className="kanban-column"
          style={{
            background: "#F9FAFB",
            borderRadius: 8,
            padding: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: isMobile ? 10 : 11,
                fontWeight: 600,
                color: "#6B7280",
                textTransform: "uppercase",
                letterSpacing: ".05em",
              }}
            >
              {col.label}
            </span>
            <span
              style={{
                fontSize: 10,
                background: "#fff",
                border: "0.5px solid #E5E7EB",
                borderRadius: 999,
                padding: "1px 7px",
                color: "#6B7280",
              }}
            >
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
};

const ListView = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {LIST_ROWS.map((row, i) => (
          <div
            key={i}
            style={{
              background: "#F9FAFB",
              border: "0.5px solid #E5E7EB",
              borderRadius: 6,
              padding: 10,
              cursor: "pointer",
              transition: "background .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F3F4F6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#F9FAFB")}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#111827",
                marginBottom: 6,
              }}
            >
              {row.title}
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <Tag label={row.status} color={row.statusColor} bg={row.statusBg} />
              <Tag label={row.tag} color="#374151" bg="#F3F4F6" />
              <span style={{ fontSize: 11, color: "#6B7280" }}>{row.assignee}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="list-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {["Task", "Status", "Tag", "Assignee"].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  fontWeight: 500,
                  fontSize: 12,
                  color: "#6B7280",
                  padding: "6px 10px",
                  borderBottom: "0.5px solid #E5E7EB",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {LIST_ROWS.map((row, i) => (
            <tr
              key={i}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <td
                style={{
                  padding: "9px 10px",
                  borderBottom: "0.5px solid #E5E7EB",
                  color: "#111827",
                }}
              >
                {row.title}
              </td>
              <td
                style={{ padding: "9px 10px", borderBottom: "0.5px solid #E5E7EB" }}
              >
                <Tag label={row.status} color={row.statusColor} bg={row.statusBg} />
              </td>
              <td
                style={{ padding: "9px 10px", borderBottom: "0.5px solid #E5E7EB" }}
              >
                <Tag label={row.tag} color="#374151" bg="#F3F4F6" />
              </td>
              <td
                style={{
                  padding: "9px 10px",
                  borderBottom: "0.5px solid #E5E7EB",
                  color: "#6B7280",
                }}
              >
                {row.assignee}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TimelineView = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ padding: isMobile ? "4px 0" : "8px 0" }}>
      {TIMELINE_ITEMS.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: isMobile ? 8 : 12,
            marginBottom: i < TIMELINE_ITEMS.length - 1 ? (isMobile ? 14 : 20) : 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: isMobile ? 20 : 28,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: isMobile ? 8 : 10,
                height: isMobile ? 8 : 10,
                borderRadius: "50%",
                flexShrink: 0,
                marginTop: 3,
                background:
                  item.state === "done"
                    ? "#1D9E75"
                    : item.state === "active"
                      ? "#378ADD"
                      : "#D1D5DB",
              }}
            />
            {i < TIMELINE_ITEMS.length - 1 && (
              <div
                style={{
                  width: 1,
                  flex: 1,
                  background: "#E5E7EB",
                  marginTop: 4,
                }}
              />
            )}
          </div>
          <div style={{ flex: 1, paddingBottom: 4, minWidth: 0 }}>
            <p
              style={{
                fontSize: isMobile ? 12 : 13,
                fontWeight: 500,
                color: "#111827",
                marginBottom: 2,
                wordBreak: "break-word",
              }}
            >
              {item.title}
            </p>
            <p
              style={{
                fontSize: isMobile ? 11 : 12,
                color: "#6B7280",
                wordBreak: "break-word",
              }}
            >
              {item.label} · {item.date}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Kanban = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{
        border: "0.5px solid #E5E7EB",
        borderRadius: 12,
        background: "#fff",
        marginBottom: 16,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: isMobile ? "10px 12px" : "14px 16px",
          borderBottom: "0.5px solid #E5E7EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          className="kanban-header"
          style={{
            fontSize: isMobile ? 13 : 15,
            fontWeight: 500,
            color: "#111827",
          }}
        >
          Kanban board
        </span>
      </div>

      <div style={{ padding: isMobile ? "8px" : "0" }}>
        <TabView>
          <TabPanel header="Board" leftIcon="pi pi-th-large mr-2">
            <div style={{ padding: isMobile ? "8px 0" : "0" }}>
              <BoardView />
            </div>
          </TabPanel>
          <TabPanel header="List" leftIcon="pi pi-list mr-2">
            <div style={{ padding: isMobile ? "0 8px" : "0" }}>
              <ListView />
            </div>
          </TabPanel>
          <TabPanel header="Timeline" leftIcon="pi pi-clock mr-2">
            <div style={{ padding: isMobile ? "8px" : "0" }}>
              <TimelineView />
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default Kanban;
