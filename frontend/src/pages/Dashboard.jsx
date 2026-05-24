import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import MyProfile from "@/components/MyProfile";
import UpdateProfile from "@/components/UpdateProfile";
import UpdatePassword from "@/components/UpdatePassword";
import MyJobs from "@/components/MyJobs";
import MyApplications from "@/components/MyApplications";
import Applications from "@/components/Applications";
import JobPost from "@/components/JobPost";
import UserInterviewsList from "../components/UserInterviewsList";
import SavedJobs from "@/components/SavedJobs";
import AdminUsersList from "@/components/AdminUsersList";
import MyReports from "@/components/MyReports";
import AdminReports from "@/components/AdminReports";
import { getBlockedEmployers } from "@/store/slices/adminSlice";

const Dashboard = () => {
  const [componentName, setComponentName] = useState("My Profile");
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loading, message } = useSelector((state) => state.admin);
  const { error, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  useEffect(() => {
    if (componentName === "savedJobs") {
      navigate("/saved-jobs");
    }
  }, [componentName, navigate]);

  useEffect(() => {
    if (user?.role === "admin") {
      dispatch(getBlockedEmployers());
    }
  }, [dispatch, user]);
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (message) toast.success(message);
  }, [message]);

  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobile, isSidebarOpen]);

  const renderComponent = () => {
    switch (componentName) {
      case "My Profile":
        return <MyProfile />;
      case "Update Profile":
        return <UpdateProfile />;
      case "Update Password":
        return <UpdatePassword />;
      case "My Jobs":
        return <MyJobs />;
      case "My Applications":
        return <MyApplications />;
      case "Applications":
        return <Applications />;
      case "Job Post":
        return <JobPost />;
      case "myInterviews":
        return <UserInterviewsList />;
      case "savedJobs":
        return null;
      case "Users":
        return <AdminUsersList />;
      case "Reports":
        return <AdminReports />;
      case "myReports":
        return <MyReports />;
      default:
        return <MyProfile />;
    }
  };

  return (
    <div className={`max-w-7xl mx-auto ${isMobile ? "block" : "flex gap-6"}`}>
      <Sidebar
        setComponentName={setComponentName}
        activeComponent={componentName}
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div
        className={`flex-1 p-5 bg-white shadow-lg rounded-lg transition-all duration-300 ${
          isMobile && isSidebarOpen
            ? "ml-0 opacity-50 pointer-events-none"
            : "w-full opacity-100"
        }`}
        style={{ minHeight: "calc(100vh - 2rem)" }}
      >
        {renderComponent()}
      </div>
    </div>
  );
};

export default Dashboard;
