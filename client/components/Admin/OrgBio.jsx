export default function OrgBio({ user, adminData }) {
  return (
    <div className="org-col">
      <div className="title">
        <h1>Welcome, {adminData.institution}</h1>
      </div>
    </div>
  );
}
