import { useEffect, useRef, useState } from "react";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../Config/firebase";
import { useAuth } from "../../Auth/useAuth";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

export const AddTaskForm = () => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState(null);
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const toast = useRef(null);

  const { user, isAdmin, userData } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const options = snapshot.docs
        .map((userDoc) => {
          const data = userDoc.data();

          return {
            label: data.username || data.email || userDoc.id,
            value: userDoc.id,
            role: data.userRole || null,
          };
        })
        .filter((option) => option.role !== "admin");

      setAssigneeOptions(options);
    });

    return unsubscribe;
  }, []);

  const priorityOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];

  const statusOptions = [
    { label: "Pending", value: "todo" },
    // { label: "In Progress", value: "in-progress" },
    // { label: "Completed", value: "done" },
  ];

  const assigneeOptionsWithSelf =
    isAdmin && user
      ? [
          {
            label: `${userData?.username || user.email || "Admin"} (You)`,
            value: user.uid,
            role: "admin",
          },
          ...assigneeOptions,
        ]
      : assigneeOptions;

  const openDialog = () => {
    setAssignedTo(user?.uid || ""); // default: self, for both admin and non-admin
    setVisible(true);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Please enter a task title",
        life: 3000,
      });
      return;
    }

    // fallback: if admin somehow has no assignedTo set, default to self
    const finalAssignedTo = isAdmin ? assignedTo || user.uid : user.uid;

    const selectedAssignee = assigneeOptionsWithSelf.find(
      (option) => option.value === finalAssignedTo,
    );

    if (isAdmin && !selectedAssignee) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Please select a valid assignee",
        life: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "tasks"), {
        title: title.trim(),
        description: description.trim(),
        priority,
        status: "todo",
        dueDate: dueDate ? new Date(dueDate) : null,
        createdAt: new Date(),
        assignedTo: finalAssignedTo,
        createdBy: user?.uid || null,
        createdByName: userData?.username || user?.email || null,
        createdByRole: userData?.userRole || null,
      });

      setTitle("");
      setDescription("");
      setPriority("low");
      setStatus("todo");
      setDueDate(null);
      setAssignedTo(user?.uid || ""); // reset back to self, not empty
      setVisible(false);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Task created successfully!",
        life: 3000,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to create task: ${error.message}`,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // const openDialog = () => {
  //   if (!isAdmin && user?.uid) {
  //     setAssignedTo(user.uid);
  //   } else {
  //     setAssignedTo("");
  //   }

  //   setVisible(true);
  // };

  const dialogFooter = (
    <div className="flex justify-end gap-2">
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
        size="small"
      />
      <Button
        label="Create Task"
        icon="pi pi-check"
        onClick={handleSubmit}
        loading={loading}
        disabled={loading}
        size="small"
        severity="success"
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />

      <Button
        onClick={openDialog}
        icon="pi pi-plus"
        label="Add Task"
        size="small"
        rounded
        style={{ backgroundColor: "#93C5FD", color: "black", border: "none" }}
      />

      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Create New Task"
        modal
        className="w-full md:w-2xl"
        footer={dialogFooter}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="field">
            <label htmlFor="title" className="mb-2 block text-sm font-semibold">
              Task Title <span className="text-red-500">*</span>
            </label>
            <InputText
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter task title"
              className="w-full"
            />
          </div>

          <div className="field">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold"
            >
              Description
            </label>
            <InputTextarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter task description (optional)"
              rows={1}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="field">
              <label
                htmlFor="priority"
                className="mb-2 block text-sm font-semibold"
              >
                Priority
              </label>
              <Dropdown
                id="priority"
                value={priority}
                onChange={(event) => setPriority(event.value)}
                options={priorityOptions}
                optionLabel="label"
                optionValue="value"
                placeholder="Select priority"
                className="w-full"
              />
            </div>

            <div className="field">
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-semibold"
              >
                Status
              </label>
              <Dropdown
                id="status"
                value={status}
                onChange={(event) => setStatus(event.value)}
                options={statusOptions}
                optionLabel="label"
                optionValue="value"
                placeholder="Select status"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="field">
              <label
                htmlFor="dueDate"
                className="mb-2 block text-sm font-semibold"
              >
                Due Date
              </label>
              <Calendar
                id="dueDate"
                value={dueDate}
                onChange={(event) => setDueDate(event.value)}
                placeholder="Pick a date"
                className="w-full"
                showIcon
                dateFormat="dd/mm/yy"
              />
            </div>

            {isAdmin ? (
              <div className="field">
                <label
                  htmlFor="assignedTo"
                  className="block font-semibold mb-2 text-sm"
                >
                  Assigned To
                </label>
                <Dropdown
                  id="assignedTo"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.value)}
                  options={assigneeOptionsWithSelf}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select assignee"
                  className="w-full"
                />
              </div>
            ) : (
              <div className="field">
                <label className="mb-2 block text-sm font-semibold">
                  Assigned To
                </label>
                <div className="text-sm text-gray-700 dark:text-gray-200">
                  You will be assigned to this task.
                </div>
              </div>
            )}
          </div>
        </form>
      </Dialog>
    </>
  );
};
