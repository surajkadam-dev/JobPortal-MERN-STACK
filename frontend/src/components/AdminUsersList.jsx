import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiBriefcase,
  FiLock,
  FiUnlock,
  FiEye,
  FiX,
  FiCheck,
  FiAlertTriangle,
} from "react-icons/fi";
import {
  getAllUsers,
  blockEmployer,
  unblockEmployer,
  clearAdminErrors,
  getBlockedEmployers,
  clearMessage,
} from "../store/slices/adminSlice";
import { toast } from "react-toastify";

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.8 },
};

const AdminUsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error, message } = useSelector(
    (state) => state.admin,
  );

  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmUnblock, setConfirmUnblock] = useState(null);
  const [duration, setDuration] = useState(7);

  useEffect(() => {
    dispatch(getAllUsers());
    if (error) {
      toast.error(error);
      dispatch(clearAdminErrors());
    }
  }, [dispatch, error, message]);

  const handleBlockClick = (user) => {
    setSelectedUser(user);
  };

  const handleBlockConfirm = () => {
    if (!selectedUser || !duration) {
      toast.error("Duration is required");
      return;
    }
    const employerId = selectedUser._id;
    const durationInDays = duration;
    dispatch(blockEmployer(employerId, durationInDays));
    dispatch(getBlockedEmployers());
    setSelectedUser(null);
  };

  const handleUnblock = (userId) => {
    setConfirmUnblock(userId);
  };

  const confirmUnblockAction = () => {
    dispatch(unblockEmployer(confirmUnblock));
    setConfirmUnblock(null);
  };

  const handleViewJobs = (employerId) => {
    navigate(`/employer/${employerId}`);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800";
      case "Job Seeker":
        return "bg-blue-100 text-blue-800";
      case "Employer":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <FiUser className="mr-3 text-blue-600" />
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          User Management
        </span>
      </h2>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        </motion.div>
      ) : (
        <>
          {/* Desktop/Tablet Table */}
          <div className="hidden md:block">
            <motion.div
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            >
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="py-5 px-6 text-left font-semibold">User</th>
                    <th className="py-5 px-6 text-left font-semibold">Role</th>
                    <th className="py-5 px-6 text-left font-semibold">Email</th>
                    <th className="py-5 px-6 text-center font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {users.map((user) => (
                      <motion.tr
                        key={user._id}
                        variants={rowVariants}
                        className="border-b border-gray-100 hover:bg-blue-50 group"
                        whileHover={{ scale: 1.005 }}
                      >
                        <td className="py-4 px-4 text-gray-800 font-medium">
                          <div className="flex items-center">
                            {user.role === "Employer" ? (
                              <FiBriefcase className="h-5 w-5 mr-3 text-orange-500" />
                            ) : (
                              <FiUser className="h-5 w-8 mr-1 text-blue-500" />
                            )}
                            {user.name}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`${getRoleColor(
                              user.role,
                            )} px-1 py-1 rounded-full text-sm font-medium`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {user.email}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {user.role === "Employer" ? (
                            <div className="flex items-center justify-center space-x-3">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
                                onClick={() => handleViewJobs(user._id)}
                              >
                                <FiEye className="mr-2" />
                                Jobs
                              </motion.button>
                              {user.isBlocked ? (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
                                  onClick={() => handleUnblock(user._id)}
                                >
                                  <FiUnlock className="mr-2" />
                                  Unblock
                                </motion.button>
                              ) : (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
                                  onClick={() => handleBlockClick(user)}
                                >
                                  <FiLock className="mr-2" />
                                  Block
                                </motion.button>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">
                              No actions available
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden grid gap-4">
            <AnimatePresence>
              {users.map((user) => (
                <motion.div
                  key={user._id}
                  variants={cardVariants}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
                  whileHover={{ y: -3 }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {user.role === "Employer" ? (
                          <FiBriefcase className="h-6 w-6 mr-3 text-orange-500" />
                        ) : (
                          <FiUser className="h-6 w-6 mr-3 text-blue-500" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-800">
                          {user.name}
                        </h3>
                      </div>
                      <span
                        className={`${getRoleColor(
                          user.role,
                        )} px-3 py-1 rounded-full text-sm`}
                      >
                        {user.role}
                      </span>
                    </div>

                    <div className="text-gray-600">
                      <p className="break-all">{user.email}</p>
                    </div>

                    {user.role === "Employer" && (
                      <div className="space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                          onClick={() => handleViewJobs(user._id)}
                        >
                          <FiEye className="mr-2" />
                          View Jobs
                        </motion.button>
                        {user.isBlocked ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="w-full bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                            onClick={() => handleUnblock(user._id)}
                          >
                            <FiUnlock className="mr-2" />
                            Unblock
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="w-full bg-red-500 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                            onClick={() => handleBlockClick(user)}
                          >
                            <FiLock className="mr-2" />
                            Block
                          </motion.button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
          >
            <motion.div
              variants={modalVariants}
              className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-200 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <FiAlertTriangle className="mr-2 text-red-500" />
                  Block {selectedUser.name}
                </h3>
                <button onClick={() => setSelectedUser(null)}>
                  <FiX className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Block Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={7}>7 Days</option>
                    <option value={14}>14 Days</option>
                    <option value={30}>30 Days</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                    onClick={() => setSelectedUser(null)}
                  >
                    <FiX className="mr-2" /> Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                    onClick={handleBlockConfirm}
                  >
                    <FiLock className="mr-2" /> Confirm Block
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {confirmUnblock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
          >
            <motion.div
              variants={modalVariants}
              className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-200 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <FiAlertTriangle className="mr-2 text-green-500" />
                  Confirm Unblock
                </h3>
                <button onClick={() => setConfirmUnblock(null)}>
                  <FiX className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to unblock this employer?
              </p>

              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                  onClick={() => setConfirmUnblock(null)}
                >
                  <FiX className="mr-2" /> Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                  onClick={confirmUnblockAction}
                >
                  <FiUnlock className="mr-2" /> Confirm Unblock
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminUsersList;
