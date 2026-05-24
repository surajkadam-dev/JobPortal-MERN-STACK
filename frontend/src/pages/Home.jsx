import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeroSection from "../components/HeroSection";
import TopNiches from "../components/TopNiches";
import { fetchJobs } from "../store/slices/jobSlice";
import ChatWidget from "../components/ChatWidget";

const Home = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs({ searchKeyword }));
  }, [dispatch, searchKeyword]);

  return (
    <main>
      <HeroSection setSearchKeyword={setSearchKeyword} />
      <TopNiches jobs={jobs} loading={loading} error={error} />
      <ChatWidget />
    </main>
  );
};

export default Home;
