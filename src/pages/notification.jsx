import { Tabs } from "@primereact/ui/tabs";
import React from "react";

export const Notification = () => {
  return (
    <section>
      <div className="flex flex-col">
        <span className="text-lg text-gray-950 dark:text-white">
          Notification
        </span>
        <span className="text-gray-300 dark:text-white">
          You have 3 unread notification
        </span>
      </div>
      <div>
        <Tabs></Tabs>
      </div>
    </section>
  );
};
