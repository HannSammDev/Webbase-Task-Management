import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FiPlusCircle } from "react-icons/fi";
export const AddTaskForm = () => {
  const [visible, setVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setVisible(false);
  };

  return (
    <>
      <Button onClick={() => setVisible(true)} label="Add Task" size="small" />

      <Dialog
        className="w-100"
        visible={visible}
        onHide={() => setVisible(false)}
        header={
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2 ">
            <FiPlusCircle size={14} />
            Create New Task
          </span>
        }
        modal
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
              placeholder="Task title"
            />
          </div>
          <div className="flex flex-col gap-1">
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
              placeholder="Task description"
              rows={4}
            />
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Priority
              </label>
              <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Status
              </label>
              <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400">
                <option value="todo">Pending </option>
                <option value="in-progress">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Due Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
              />
            </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                      <Button
                          size="small"
              label="Cancel"
              onClick={() => setVisible(false)}
              className="p-button-text"
            />
            <Button size="small" label="Create Task" type="submit" />
          </div>
        </form>
      </Dialog>
    </>
  );
};
