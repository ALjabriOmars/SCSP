import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { FaCheckCircle, FaTrash, FaTimes, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function CityAuthorityDashboard() {
  const [newTask, setNewTask] = useState({
    description: "",
    department: "",
    resources: "",
    timeline: "",
  });
  const [availableTasks, setAvailableTasks] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [openIssues, setOpenIssues] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [bids, setBids] = useState([]);
const [selectedBidId, setSelectedBidId] = useState(null);
const [resourceAllocations, setResourceAllocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      const savedAllocations = sessionStorage.getItem("allocations");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Auto-assign department to new task
        setNewTask((prev) => ({ ...prev, department: parsedUser.department }));

        // Restore resource allocations from sessionStorage
        if (savedAllocations) {
          setResourceAllocations(JSON.parse(savedAllocations));
        }

        // Initial fetch
        fetchAvailableTasks();

        if (parsedUser.department) {
          fetchIssues(parsedUser.department);

          axios
            .get("http://localhost:5000/api/bids", {
              params: { department: parsedUser.department },
            })
            .then((res) => setBids(res.data))
            .catch((err) => console.error("Failed to fetch bids:", err));

          const interval = setInterval(() => {
            fetchIssues(parsedUser.department);
            fetchAvailableTasks();

            axios
              .get("http://localhost:5000/api/bids", {
                params: { department: parsedUser.department },
              })
              .then((res) => setBids(res.data))
              .catch((err) => console.error("Failed to fetch bids (polling):", err));
          }, 5000);

          return () => clearInterval(interval);
        } else {
          console.warn("User has no department assigned:", parsedUser);
        }
      } else {
        navigate("/auth");
      }
    } catch (err) {
      console.error("Error parsing user from sessionStorage:", err);
      navigate("/auth");
    }
  }, [navigate]);

  const fetchIssues = async (department) => {
    try {
      const [openRes, resolvedRes] = await Promise.all([
        axios.get("http://localhost:5000/api/issues", { params: { department, status: "open" } }),
        axios.get("http://localhost:5000/api/issues", { params: { department, status: "resolved" } }),
      ]);
      setOpenIssues(openRes.data);
      setResolvedIssues(resolvedRes.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user")
    navigate("/auth");
  };

  const availableResources = ["2 Trucks", "4 Engineers", "6 Staff", "1 Tank", "Generator"];
  const availableProviders = [
    { name: "GreenClean Ltd.", bid: "OMR 2,500" },
    { name: "EcoServe Co.", bid: "OMR 2,300" },
    { name: "AquaFix Services", bid: "OMR 2,700" },
  ];

  const responseTimeChartData = {
    labels: ["Waste", "Water", "Transport", "Energy", "Safety"],
    datasets: [
      {
        label: "Avg Response Time (hours)",
        data: [3.5, 5.2, 2.8, 4.1, 3.0],
        backgroundColor: "#1d234e",
        borderRadius: 6,
      },
    ],
  };

  const handleResolve = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/issues/${id}/resolve`);
      fetchIssues(user.department);
    } catch (err) {
      console.error("Resolve failed:", err);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/issues/${id}`);
      fetchIssues(user.department);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handlePostTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/tasks", newTask);
      setNewTask({ description: "", department: "", resources: "", timeline: "" });
      setShowNewTaskModal(false);
      fetchAvailableTasks();
    } catch (err) {
      console.error("Failed to post task:", err);
    }
  };

  const fetchAvailableTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setAvailableTasks(res.data);
    } catch (err) {
      console.error("Error fetching available tasks:", err);
    }
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${taskId}/status`, { status });
      fetchAvailableTasks();
    } catch (err) {
      console.error(`Failed to ${status} task:`, err);
    }
  };

  const handleAllocate = (e) => {
    e.preventDefault();
    if (!selectedBidId) return alert("Please select a bid to allocate");

    const bid = bids.find((b) => b.id === parseInt(selectedBidId));
    if (bid) {
      const allocation = {
        id: Date.now(),
        department: bid.department,
        task: bid.task,
        resources: bid.resources || "N/A", // Fallback if not present
        provider: bid.provider,
        note: "",
      };

      const updatedAllocations = [...resourceAllocations, allocation];
      setResourceAllocations(updatedAllocations);

      // ✅ Persist to sessionStorage
      sessionStorage.setItem("allocations", JSON.stringify(updatedAllocations));

      setShowAllocationModal(false);
      setSelectedBidId(null);
    }
  }; 
  
  const handleAllocationAction = async (id, action) => {
    const allocation = resourceAllocations.find((a) => a.id === id);
    if (!allocation) return;

    const bid = bids.find(
      (b) => b.task === allocation.task && b.provider === allocation.provider
    );
    if (!bid) return;

    const payload = {
      status: action,
      resources: allocation.resources || "N/A",
    };

    if (action === "suspend" || action === "terminate") {
      const reason = prompt(`Reason for ${action}?`);
      if (!reason) return;
      payload.reason = reason;
    }

    if (action === "complete") {
      payload.completed_date = new Date().toISOString();
    }

    try {
      await axios.patch(`http://localhost:5000/api/bids/${bid.id}/status`, payload);
      if (action === "terminate") {
        setResourceAllocations((prev) => prev.filter((a) => a.id !== id));
      } else {
        setResourceAllocations((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: action } : a))
        );
      }
      sessionStorage.setItem("allocations", JSON.stringify(resourceAllocations));
    } catch (err) {
      console.error("Failed to update bid status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#e4e9f4] px-4 py-8 text-[#1d234e]">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">City Authority Dashboard</h1>
            <p className="text-sm text-gray-600">Smart City Admin Overview</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUserModal(true)}
              className="bg-[#1d234e] text-white px-4 py-2 rounded-md hover:bg-[#2f386b] text-sm"
            >
              User Management
            </button>
            <button
              onClick={() => setShowAllocationModal(true)}
              className="bg-[#1d234e] text-white px-4 py-2 rounded-md hover:bg-[#2f386b] text-sm"
            >
              Allocate Resources
            </button>
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="bg-[#1d234e] text-white px-4 py-2 rounded-md hover:bg-[#2f386b] text-sm"
            >
              Post New Task
            </button>
            <button onClick={() => setShowProfile(true)}>
              <FaUserCircle className="text-3xl text-[#1d234e]" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Open Issues</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#f0f4fa]">
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2">Location</th>
                <th className="text-left p-2">Reported Date</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {openIssues.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400 py-4">
                    No issues reported for your department.
                  </td>
                </tr>
              ) : (
                openIssues.map((issue) => (
                  <tr key={issue.id} className="border-b">
                    <td className="p-2">{issue.description}</td>
                    <td className="p-2">{issue.location}</td>
                    <td className="p-2">{new Date(issue.created_at).toLocaleDateString()}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => handleResolve(issue.id)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        <FaCheckCircle className="mr-1" /> Resolve
                      </button>
                      <button
                        onClick={() => handleDelete(issue.id)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {resolvedIssues.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">Resolved Issues</h2>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#f0f4fa]">
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Location</th>
                  <th className="text-left p-2">Reported Date</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resolvedIssues.map((issue) => (
                  <tr key={issue.id} className="border-b">
                    <td className="p-2">{issue.description}</td>
                    <td className="p-2">{issue.location}</td>
                    <td className="p-2">{new Date(issue.created_at).toLocaleDateString()}</td>
                    <td className="p-2 text-green-600 font-medium">Resolved</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(issue.id)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Tasks & Resource Allocation</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#f0f4fa]">
                <th className="text-left p-2">Department</th>
                <th className="text-left p-2">Task</th>
                <th className="text-left p-2">Resources</th>
                <th className="text-left p-2">Provider</th>
                <th className="text-left p-2">Notes</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resourceAllocations.map((task) => (
                <tr key={task.id} className="border-b">
                  <td className="p-2">{task.department}</td>
                  <td className="p-2">{task.task}</td>
                  <td className="p-2">{task.resources}</td>
                  <td className="p-2">{task.provider}</td>
                  <td className="p-2">
                    <textarea className="w-full border rounded p-1 text-xs" placeholder="Enter notes..." />
                  </td>
                  <td className="p-2 space-x-1">
                    <button
                      className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                      onClick={() => handleAllocationAction(task.id, "complete")}
                    >
                      Complete
                    </button>
                    <button
                      className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                      onClick={() => handleAllocationAction(task.id, "suspend")}
                    >
                      Suspend
                    </button>
                    <button
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      onClick={() => handleAllocationAction(task.id, "terminate")}
                    >
                      Terminate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Available Tasks & Resources</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#f0f4fa]">
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2">Department</th>
                <th className="text-left p-2">Resources</th>
                <th className="text-left p-2">Timeline</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {availableTasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-gray-400 py-4">
                    No tasks available.
                  </td>
                </tr>
              ) : (
                availableTasks.map((task) => (
                  <tr key={task.id} className="border-b">
                    <td className="p-2">{task.description}</td>
                    <td className="p-2">{task.department}</td>
                    <td className="p-2">{task.resources}</td>
                    <td className="p-2">{task.timeline}</td>
                    <td className="p-2">
                      <span className={`font-medium ${task.status === "suspended" ? "text-yellow-700" : "text-green-700"}`}>
                        {task.status === "suspended" ? "Suspended" : "Available"}
                      </span>
                    </td>
                    <td className="p-2 space-x-1">
                      {task.status === "suspended" ? (
                        <button
                          onClick={() => handleUpdateTaskStatus(task.id, "active")}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateTaskStatus(task.id, "suspended")}
                          className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                        >
                          Suspend
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateTaskStatus(task.id, "terminated")}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Terminate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Average Response Time</h2>
          <div className="h-[250px]">
            <Bar
              data={responseTimeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
              }}
            />
          </div>
        </div>
      </div>

      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative shadow-lg">
            <button onClick={() => setShowUserModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-black">
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-[#1d234e]">User Management</h2>
            <table className="w-full text-sm border">
              <thead className="bg-[#f0f4fa]">
                <tr><th className="text-left p-2">Name</th><th className="text-left p-2">Email</th><th className="text-left p-2">Role</th><th className="text-left p-2">Status</th></tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="p-2">Ahmed Al-Said</td><td className="p-2">ahmed@example.com</td><td className="p-2">Resident</td><td className="p-2 text-green-600">Active</td></tr>
                <tr className="border-b"><td className="p-2">Fatima Noor</td><td className="p-2">fatima@provider.com</td><td className="p-2">Service Provider</td><td className="p-2 text-green-600">Active</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAllocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl relative shadow-lg">
            <button onClick={() => setShowAllocationModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-black">
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-[#1d234e]">Allocate Resources</h2>
            <form onSubmit={handleAllocate} className="space-y-4 text-sm">
              <div>
                <label className="block mb-1 font-medium">Available Providers & Bids</label>
                <table className="w-full text-sm border">
                  <thead className="bg-[#f0f4fa]">
                    <tr>
                      <th className="text-left p-2">Task</th>
                      <th className="text-left p-2">Provider</th>
                      <th className="text-left p-2">Bid</th>
                      <th className="text-left p-2">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map((bid) => (
                      <tr key={bid.id} className="border-b">
                        <td className="p-2">{bid.task}</td>
                        <td className="p-2">{bid.provider}</td>
                        <td className="p-2">{bid.bid}</td>
                        <td className="p-2">
                          <input
                            type="radio"
                            name="selectedBid"
                            value={bid.id}
                            checked={selectedBidId === String(bid.id)}
                            onChange={(e) => setSelectedBidId(e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="submit" className="mt-4 w-full bg-[#1d234e] text-white py-2 rounded hover:bg-[#2f386b]">
                Allocate
              </button>
            </form>
          </div>
        </div>
      )}

      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative shadow-lg">
            <button onClick={() => setShowNewTaskModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-black">
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-[#1d234e]">Post New Task</h2>
            <form onSubmit={handlePostTask} className="space-y-4 text-sm">
              <div>
                <label className="block mb-1 font-medium">Task Description</label>
                <input
                  type="text"
                  name="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="e.g. Upgrade transformer"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Department</label>
                <input
                  type="text"
                  name="department"
                  value={user?.department || ""}
                  readOnly
                  disabled
                  className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-700"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Available Resources</label>
                <textarea
                  name="resources"
                  value={newTask.resources}
                  onChange={(e) => setNewTask({ ...newTask, resources: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="e.g. 2 trucks, 3 engineers"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Timeline</label>
                <input
                  type="text"
                  name="timeline"
                  value={newTask.timeline}
                  onChange={(e) => setNewTask({ ...newTask, timeline: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="e.g. 2 weeks"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-[#1d234e] text-white py-2 rounded hover:bg-[#2f386b]">
                Post Task
              </button>
            </form>
          </div>
        </div>
      )}

      {showProfile && user && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm relative shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowProfile(false)}
            >
              <FaTimes size={18} />
            </button>
            <h2 className="text-lg font-semibold text-[#1d234e] mb-4">Your Profile</h2>
            <ul className="text-sm text-[#1d234e] space-y-2">
              <li><strong>Name:</strong> {user.full_name}</li>
              <li><strong>Email:</strong> {user.email}</li>
              <li><strong>Role:</strong> {user.role}</li>
              <li><strong>Department:</strong> {user.department}</li>
            </ul>
            <button
              onClick={handleLogout}
              className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
