"use client";
import { useEffect, useState } from "react";

type Follower = {
  studentId: string;
  professionalId: string;
  followedAt: string;
  studentName?: string;
};

type Props = {
  professionalId: string;
};

export default function ProfessionalFollowsTable({ professionalId }: Props) {
  const [follows, setFollows] = useState<Follower[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/follows?professionalId=${professionalId}`)
      .then(res => res.json())
      .then(data => {
        setFollows(data);
        setLoading(false);
      });
  }, [professionalId]);

  const filtered = follows.filter(f =>
    !search.trim() || (f.studentName?.toLowerCase() ?? f.studentId.toLowerCase()).includes(search.trim().toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Followers</h2>
        <input
          type="text"
          placeholder="Search student name..."
          className="border rounded px-3 py-2 text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Student ID</th>
              <th className="px-4 py-2 border">Followed At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-6">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-6">No followers found.</td></tr>
            ) : (
              filtered.map((f, i) => (
                <tr key={f.studentId + f.followedAt}>
                  <td className="px-4 py-2 border">{i + 1}</td>
                  <td className="px-4 py-2 border">{f.studentName || f.studentId}</td>
                  <td className="px-4 py-2 border">{new Date(f.followedAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
