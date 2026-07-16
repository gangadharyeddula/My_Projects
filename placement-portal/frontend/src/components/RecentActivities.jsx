import { useEffect, useState } from "react";
import API from "../api/axios";

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();

    const interval = setInterval(() => {
      fetchActivities();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await API.get("/admin/recent-activities");
      setActivities(res.data.activities || []);
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const getIcon = (type) => {
    switch (type) {
      case "application":
        return "📄";
      case "job":
        return "💼";
      case "student":
        return "👨‍🎓";
      case "company":
        return "🏢";
      default:
        return "🔔";
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>📢 Recent Activities</h2>

      <div style={styles.list}>
        {activities.length === 0 ? (
          <p>No recent activity</p>
        ) : (
          activities.map((activity, index) => (
            <div key={index} style={styles.item}>
              <div style={styles.icon}>
                {getIcon(activity.type)}
              </div>

              <div>
                <div style={styles.message}>
                  {activity.message}
                </div>

                <div style={styles.date}>
                  {formatDate(activity.date)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    marginTop: "30px",
    background: "#fff",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 8px 24px rgba(0,0,0,.08)",
  },

  title: {
    marginBottom: "20px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxHeight: "350px",
    overflowY: "auto",
  },

  item: {
    display: "flex",
    gap: "15px",
    padding: "12px",
    borderRadius: "10px",
    background: "#f8fafc",
  },

  icon: {
    fontSize: "24px",
  },

  message: {
    fontWeight: "600",
  },

  date: {
    color: "#64748b",
    fontSize: "13px",
    marginTop: "5px",
  },
};

export default RecentActivities;