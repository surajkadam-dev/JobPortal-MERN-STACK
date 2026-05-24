import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Clock, Briefcase } from "lucide-react";

const TopNiches = ({ jobs, loading, error }) => {
  const navigate = useNavigate();
  const [displayLimit, setDisplayLimit] = useState(6);

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + 6);
  };

  const handleDetails = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 bg-red-50 rounded-lg max-w-2xl mx-auto">
        <p className="text-lg font-semibold">Oops! Something went wrong.</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const jobsToShow = jobs.slice(0, displayLimit);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm tracking-wide mb-4">
            Latest Opportunities
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Fresh <span className="text-blue-600">Jobs</span> This Week
          </h2>
          <p className="text-xl text-gray-600">
            {jobs.length} jobs available – find your next career move.
          </p>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {jobsToShow.map((job) => (
            <div
              key={job._id}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-200 transition-all hover:shadow-md hover:-translate-y-1 duration-300"
            >
              <div className="p-4 space-y-3">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {/* Logo Placeholder */}
                    <div className="w-10 h-10 rounded-lg border border-blue-100 bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {job.companyName?.charAt(0) || "J"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {job.companyName}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </p>
                    </div>
                  </div>
                  {/* Posted time indicator */}
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {job.createdAt || "2d ago"}
                  </span>
                </div>

                {/* Job Details */}
                <div>
                  <h2 className="text-base font-bold text-gray-800 mb-1 line-clamp-1">
                    {job.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-2 text-xs mb-2">
                    {job.introduction}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                      {job.jobType}
                    </span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                      {job.positions}{" "}
                      {job.positions > 1 ? "Positions" : "Position"}
                    </span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                      ₹{job.salary}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                  <button
                    onClick={() => handleDetails(job._id)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs h-8 px-2 rounded transition-colors"
                  >
                    Details
                  </button>
                  <Link
                    to={`/post/application/${job._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3 rounded flex items-center justify-center transition-colors"
                  >
                    Apply
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {jobs.length > displayLimit && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <span>Load More Jobs</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopNiches;
