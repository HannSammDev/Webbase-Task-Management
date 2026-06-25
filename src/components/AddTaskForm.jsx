import React, { useState } from "react";
import { db } from "../Config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../Auth/AuthContex";

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { FiPlusCircle } from "react-icons/fi";
import { useRef } from "react";

export const AddTaskForm = () => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState(null);
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const priorityOptions = [
    { label: "🔵 Low", value: "low" },
    { label: "🟡 Medium", value: "medium" },
    { label: "🔴 High", value: "high" },
  ];

  const statusOptions = [
    { label: "📝 Pending", value: "todo" },
    { label: "⏳ In Progress", value: "in-progress" },
    { label: "✅ Completed", value: "done" },
  ];

  const assigneeOptions = [
    { label: "Alice", value: "Alice" },
    { label: "Bob", value: "Bob" },
    { label: "Charlie", value: "Charlie" },
  ];
const {user} = useAuth()


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (!title.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Please enter a task title",
        life: 3000,
      });
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "tasks"), {
        title: title.trim(),
        description: description.trim(),
        priority: priority,
        status: status,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdAt: new Date(),
        assignedTo: assignedTo.trim() || user.uid,
      });
      // Reset form and close dialog
      setTitle("");
      setDescription("");
      setPriority("low");
      setStatus("todo");
      setDueDate(null);
      setAssignedTo("");
      setVisible(false);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Task created successfully!",
        life: 3000,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to create task: ${error.message}`,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

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
      <Toast ref={toast}  />
      <Button
        onClick={() => setVisible(true)}
        icon={<FiPlusCircle className="mr-2" />}
        label="Add Task"
        // severity="info"
        size="small"
        rounded

        style={{ backgroundColor:'#f7f3f3' }}
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
          {/* Title */}
          <div className="field">
            <label htmlFor="title" className="block font-semibold mb-2 text-sm">
              Task Title <span className="text-red-500">*</span>
            </label>
            <InputText
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="field">
            <label
              htmlFor="description"
              className="block font-semibold mb-2 text-sm"
            >
              Description
            </label>
            <InputTextarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description (optional)"
              rows={1}
              className="w-full"
            />
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field">
              <label
                htmlFor="priority"
                className="block font-semibold mb-2 text-sm"
              >
                Priority
              </label>
              <Dropdown
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.value)}
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
                className="block font-semibold mb-2 text-sm"
              >
                Status
              </label>
              <Dropdown
                id="status"
                value={status}
                onChange={(e) => setStatus(e.value)}
                options={statusOptions}
                optionLabel="label"
                optionValue="value"
                placeholder="Select status"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Due Date */}

            <div className="field">
              <label
                htmlFor="dueDate"
                className="block font-semibold mb-2 text-sm"
              >
                Due Date
              </label>
              <Calendar
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.value)}
                placeholder="Pick a date"
                className="w-full"
                showIcon
                dateFormat="dd/mm/yy"
              />
            </div>
            <div className="field">
              <label
                htmlFor="assignedTo"
                className="block font-semibold mb-2 text-sm"
              >
                Assigned To
              </label>
              <Dropdown
                id="assignedTo"
                value={assignedTo} // ← Just use the value directly, not the object
                onChange={(e) => setAssignedTo(e.value)} // ← Use e.value, not e.target.value
                options={assigneeOptions}
                optionLabel="label"
                optionValue="value"
                placeholder="Select assignee"
                className="w-full"
              />
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
};
