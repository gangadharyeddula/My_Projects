import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await API.get("/admin/companies");
      setCompanies(res.data.companies || []);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCompany = async (id) => {
    if (!window.confirm("Delete this company?")) return;

    try {
      await API.delete(`/admin/companies/${id}`);
      fetchCompanies();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) =>
      company.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      company.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [companies, search]);

  return (
    <DashboardLayout
      role="admin"
      title="Companies"
      subtitle="Manage registered companies"
    >
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
        <h2>Total Companies : {filteredCompanies.length}</h2>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />
      </div>

      <table style={{width:"100%",background:"#fff"}}>
        <thead>
          <tr>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Website</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredCompanies.map(company=>(
            <tr key={company._id}>
              <td>{company.company_name}</td>
              <td>{company.email}</td>
              <td>{company.phone}</td>
              <td>{company.website}</td>

              <td>
                <button
                  onClick={()=>deleteCompany(company._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </DashboardLayout>
  );
};

export default AdminCompanies;