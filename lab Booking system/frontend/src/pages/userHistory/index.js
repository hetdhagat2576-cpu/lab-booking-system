import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createApiUrl } from "../../config/api";
import { useAuth } from "../../context/authContext";
import Header from "../../components/header";
import Footer from "../../components/footer";
import IconConfig from "../../components/icon/index.js";
import Theme from "../../config/theam/index.js";
import CButton from "../../components/cButton";

export default function UserHistoryIndex() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { Calendar, Clock, MapPin, FileText, CheckCircle2, XCircle, AlertCircle, ArrowLeft } = IconConfig;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await fetch(createApiUrl("/api/bookings"), {
        headers: {
          Authorization: `Bearer ${user?.token || ""}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setBookings(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user || (user.role && user.role !== "user")) {
      navigate("/user-login");
      return;
    }
    fetchBookings();
  }, [user]);

  return (
    <div className={Theme.layout.standardPage}>
      <Header hideNavItems={true} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-4">
          <CButton
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-primary hover:opacity-80 transition"
            variant="outline"
          >
            <ArrowLeft className="mr-2" /> Back to Dashboard
          </CButton>
        </div>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">Your Booking History</h1>
          <p className="text-gray-600">Track your appointments and statuses</p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id || booking.id} className="bg-white rounded-xl shadow-md p-4 border border-secondary/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {booking.packageName || "Lab Appointment"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {booking.patientName || user.name || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium">{booking.labAppointment || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{booking.date || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{booking.time || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.adminStatus === "approved" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : booking.adminStatus === "rejected" ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    )}
                    <span className="font-medium">
                      {booking.adminStatus || "pending"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
