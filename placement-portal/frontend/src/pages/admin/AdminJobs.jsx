import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

const AdminJobs = () => {

  const [jobs,setJobs]=useState([]);
  const [search,setSearch]=useState("");

  useEffect(()=>{
      fetchJobs();
  },[]);

  const fetchJobs=async()=>{

      try{

          const res=await API.get("/admin/jobs");

          setJobs(res.data.jobs);

      }catch(err){
          console.log(err);
      }

  };

  const deleteJob=async(id)=>{

      if(!window.confirm("Delete this job?")) return;

      try{

          await API.delete(`/admin/jobs/${id}`);

          fetchJobs();

      }catch(err){
          console.log(err);
      }

  };

  const filtered=useMemo(()=>{

      return jobs.filter(job=>

          job.title?.toLowerCase().includes(search.toLowerCase()) ||

          job.company_name?.toLowerCase().includes(search.toLowerCase())

      );

  },[jobs,search]);

  return(

      <DashboardLayout
          role="admin"
          title="Jobs"
          subtitle="Manage all jobs"
      >

          <div style={styles.header}>

              <h2>Total Jobs : {filtered.length}</h2>

              <input

                  placeholder="Search jobs..."

                  value={search}

                  onChange={(e)=>setSearch(e.target.value)}

                  style={styles.search}

              />

          </div>

          <table style={styles.table}>

              <thead>

              <tr>

                  <th>Company</th>

                  <th>Job Title</th>

                  <th>Location</th>

                  <th>Salary</th>

                  <th>Deadline</th>

                  <th>Action</th>

              </tr>

              </thead>

              <tbody>

              {

                  filtered.map(job=>(

                      <tr key={job._id}>

                          <td>{job.company_name}</td>

                          <td>{job.title}</td>

                          <td>{job.location}</td>

                          <td>{job.salary}</td>

                          <td>{job.deadline}</td>

                          <td>

                              <button

                                  style={styles.delete}

                                  onClick={()=>deleteJob(job._id)}

                              >

                                  Delete

                              </button>

                          </td>

                      </tr>

                  ))

              }

              </tbody>

          </table>

      </DashboardLayout>

  );

};

const styles={

header:{

display:"flex",

justifyContent:"space-between",

marginBottom:"20px"

},

search:{

padding:"10px",

width:"300px",

borderRadius:"8px",

border:"1px solid #ddd"

},

table:{

width:"100%",

background:"#fff",

borderCollapse:"collapse"

},

delete:{

background:"#dc2626",

color:"#fff",

border:"none",

padding:"8px 15px",

borderRadius:"6px",

cursor:"pointer"

}

};

export default AdminJobs;