import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell, FaTimes } from "react-icons/fa";

export default function ServiceProviderDashboard() {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [awaitingApprovalTasks, setAwaitingApprovalTasks] = useState([]);
  const [allocatedTasks, setAllocatedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [rejectedTasks, setRejectedTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [bidPrices, setBidPrices] = useState({});
  const [bidsPlaced, setBidsPlaced] = useState(new Set());
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [providerName, setProviderName] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    setProviderName(user.full_name); 
    fetchBids(user.full_name); // immediate fetch
    fetchTasks();              // immediate fetch

    // start polling every 5 seconds using user.full_name directly
    const interval = setInterval(() => {
      fetchBids(user.full_name);
      fetchTasks();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchBids = async (provider) => {
    try {
      const res = await axios.get("http://localhost:5000/api/bids", {
        params: { provider },
      });

      const awaiting = [];
      const allocated = [];
      const completed = [];
      const rejected = [];

      res.data.forEach((bid) => {
        const status = bid.status?.toLowerCase(); // normalize status
        const taskData = {
          id: bid.task_id,
          department: bid.department,
          description: bid.task,
          task: bid.task,
          resources: bid.resources || "N/A",
          reason: bid.reason || "N/A",
          date: bid.completed_date || "",
        };

        if (bid.status.toLowerCase() === "pending") awaiting.push(taskData);
        else if (bid.status.toLowerCase() === "approved") allocated.push(taskData);
        else if (bid.status.toLowerCase() === "completed") completed.push(taskData);
        else if (bid.status.toLowerCase() === "rejected" || bid.status.toLowerCase() === "suspend") rejected.push(taskData);
      });

      setAwaitingApprovalTasks(awaiting);
      setAllocatedTasks(allocated);
      setCompletedTasks(completed);
      setRejectedTasks(rejected);
    } catch (err) {
      console.error("Failed to fetch provider bids:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      const latestTasks = res.data;

      const now = new Date();
      const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

      setNotifications((prev) => {
        const filtered = prev.filter(
          (n) => new Date(n.timestamp) > twelveHoursAgo
        );
        const existingIds = new Set(filtered.map((n) => n.id));

        const newNotifs = latestTasks
          .filter(
            (task) => !existingIds.has(task.id) && !bidsPlaced.has(task.id)
          )
          .map((task) => ({
            id: task.id,
            message: `🆕 New task posted for ${task.department}: "${task.description}"`,
            timestamp: now.toISOString(),
          }));

        if (newNotifs.length > 0) {
          setUnseenCount((prev) => prev + newNotifs.length);
          return [...newNotifs, ...filtered];
        }

        return filtered;
      });

      const filteredAvailable = latestTasks.filter(
        (task) => !bidsPlaced.has(task.id)
      );
      setAvailableTasks(filteredAvailable);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const handleBidChange = (id, value) => {
    setBidPrices((prev) => ({ ...prev, [id]: value }));
  };

  const placeBid = async (task) => {
    const bid = bidPrices[task.id];
    if (!bid) return alert("Please enter your bid price.");

    const user = JSON.parse(sessionStorage.getItem("user"));
    const providerName = user?.full_name || "Unknown Provider";

    try {
      await axios.post(
        "http://localhost:5000/api/bids",
        {
          taskId: task.id,
          taskName: task.description,
          department: task.department,
          providerName,
          bidAmount: bid,
        },
        {
          withCredentials: true,
        }
      );

      alert(`Bid of ${bid} submitted for task ${task.id}`);

      setAvailableTasks((prev) => prev.filter((t) => t.id !== task.id));
      setAwaitingApprovalTasks((prev) => [...prev, task]);
      setBidsPlaced((prev) => new Set([...prev, task.id]));
    } catch (err) {
      console.error("Failed to submit bid:", err);
      alert("Failed to submit bid. Please try again.");
    }
  };

  const openNotifications = () => {
    setShowNotificationModal(true);
    setUnseenCount(0);
  };

  return (
    <div className="min-h-screen bg-[#e4e9f4] px-4 py-8 text-[#1d234e]">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Service Provider Dashboard</h1>
            <p className="text-sm text-gray-600">
              Manage your city service tasks and applications
            </p>
          </div>
          <button
            onClick={openNotifications}
            className="relative flex items-center gap-2 bg-[#1d234e] text-white px-4 py-2 rounded-md hover:bg-[#2f386b] text-sm"
          >
            <FaBell />
            Notifications
            {unseenCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
                {unseenCount}
              </span>
            )}
          </button>
        </div>

        <Section
          title="Allocated Tasks"
          data={allocatedTasks}
          columns={["Department", "Task", "Resources"]}
        />
        <Section
          title="Completed Tasks"
          data={completedTasks}
          columns={["Department", "Task", "Date"]}
        />
        <Section
          title="Tasks Awaiting Approval"
          data={awaitingApprovalTasks}
          columns={["Department", "Description"]}
        />
        <Section
          title="Rejected Tasks & Resources"
          data={rejectedTasks}
          columns={["Department", "Task", "Reason"]}
          highlight="Reason"
        />

        <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">
            Available Tasks & Resources
          </h2>
          <table className="min-w-full text-sm">
            <thead className="bg-[#f0f4fa]">
              <tr>
                <th className="text-left p-2">Department</th>
                <th className="text-left p-2">Task Description</th>
                <th className="text-left p-2">Available Resources</th>
                <th className="text-left p-2">Timeline</th>
                <th className="text-left p-2">Set Price</th>
                <th className="text-left p-2">Bid</th>
              </tr>
            </thead>
            <tbody>
              {availableTasks.map((task) => (
                <tr key={task.id} className="border-b">
                  <td className="p-2">{task.department}</td>
                  <td className="p-2">{task.description}</td>
                  <td className="p-2">{task.resources}</td>
                  <td className="p-2">{task.timeline}</td>
                  <td className="p-2">
                    <input
                      type="text"
                      placeholder="OMR Price"
                      className="border px-2 py-1 rounded w-24"
                      value={bidPrices[task.id] || ""}
                      onChange={(e) => handleBidChange(task.id, e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <button
                      className="bg-[#1d234e] text-white text-xs px-3 py-1 rounded hover:bg-[#2f386b]"
                      onClick={() => placeBid(task)}
                    >
                      Place Bid
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl relative shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowNotificationModal(false)}
            >
              <FaTimes size={18} />
            </button>
            <h2 className="text-lg font-semibold text-[#1d234e] mb-4">
              Real-Time Notifications
            </h2>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm">No new notifications</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {notifications.map((note, idx) => (
                  <li key={idx}>{note.message}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, data, columns, highlight }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <table className="min-w-full text-sm">
        <thead className="bg-[#f0f4fa]">
          <tr>
            {columns.map((col) => (
              <th key={col} className="text-left p-2">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b">
              {columns.map((col) => (
                <td
                  key={col}
                  className={`p-2 ${col === highlight ? "text-red-600" : ""}`}
                >
                  {row[col.toLowerCase().replace(" ", "")] ||
                    row[col.toLowerCase()] ||
                    "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
