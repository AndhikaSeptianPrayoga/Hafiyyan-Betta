import StatCard from '../components/StatCard'
import SimpleLineChart from '../components/SimpleLineChart'

export default function Dashboard() {
  const activities = [
    { id: 1, text: 'Menambah artikel: Tips Breeding Sukses', time: '2 jam lalu' },
    { id: 2, text: 'Menghapus kebutuhan: Garam Ikan 100gr', time: '5 jam lalu' },
    { id: 3, text: 'Update harga ikan: Halfmoon Marble', time: 'Kemarin' },
  ]

  const visits = [40, 80, 65, 120, 90, 140, 130, 160, 120, 180, 150, 210]

  return (
    <div className="space-y-6">
      {/* Alert ribbon */}
      <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">
        <span className="font-semibold">Sukses.</span> Anda berhasil membaca pesan penting ini.
      </div>

      {/* top stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Members online"
          value={10468}
          subtitle="+2% dari kemarin"
          colorClass="bg-sky-500"
          trendData={[50, 60, 55, 70, 75, 68, 72, 80]}
          icon={<span>👤</span>}
        />
        <StatCard
          title="Pageviews"
          value={28706}
          subtitle="Bulan ini"
          colorClass="bg-indigo-500"
          trendData={[40, 55, 45, 60, 70, 65, 80, 90]}
          icon={<span>📈</span>}
        />
        <StatCard
          title="Total Profit"
          value={1012}
          subtitle="Rp"
          colorClass="bg-amber-500"
          trendData={[10, 20, 30, 20, 35, 40, 45, 60]}
          icon={<span>💰</span>}
        />
        <StatCard
          title="New Customer"
          value={961}
          subtitle="+15 hari ini"
          colorClass="bg-rose-500"
          trendData={[5, 10, 8, 12, 15, 20, 18, 25]}
          icon={<span>🧑‍🤝‍🧑</span>}
        />
      </div>

      {/* social cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-600 text-white rounded-xl shadow p-6">
          <p className="text-sm">Facebook</p>
          <p className="mt-2 text-2xl font-bold">40K Friends</p>
        </div>
        <div className="bg-sky-500 text-white rounded-xl shadow p-6">
          <p className="text-sm">Twitter</p>
          <p className="mt-2 text-2xl font-bold">30K Tweets</p>
        </div>
        <div className="bg-blue-700 text-white rounded-xl shadow p-6">
          <p className="text-sm">LinkedIn</p>
          <p className="mt-2 text-2xl font-bold">40+ Contacts</p>
        </div>
        <div className="bg-red-600 text-white rounded-xl shadow p-6">
          <p className="text-sm">Google+</p>
          <p className="mt-2 text-2xl font-bold">94K Followers</p>
        </div>
      </div>

      {/* traffic & right widgets */}
      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-xl shadow">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-sm font-semibold text-gray-900">Traffic</h2>
            <div className="flex items-center gap-2 text-xs">
              <button className="px-2 py-1 rounded-md border">Day</button>
              <button className="px-2 py-1 rounded-md border bg-gray-900 text-white">Month</button>
              <button className="px-2 py-1 rounded-md border">Year</button>
            </div>
          </div>
          <div className="p-4">
            <SimpleLineChart
              data={visits}
              width={600}
              height={220}
              stroke="#10b981"
              fill="rgba(16,185,129,0.1)"
            />
            <div className="grid sm:grid-cols-4 gap-4 mt-4 text-xs text-gray-600">
              <div>
                <p className="font-semibold">Visits</p>
                <p>29,703 Users</p>
              </div>
              <div>
                <p className="font-semibold">Unique</p>
                <p>24,093 Users</p>
              </div>
              <div>
                <p className="font-semibold">Pageviews</p>
                <p>28,706 Views</p>
              </div>
              <div>
                <p className="font-semibold">Bounce Rate</p>
                <p>40.15%</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center">
                JD
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Jim Doe</p>
                <p className="text-xs text-gray-500">Project Manager</p>
              </div>
            </div>
            <div className="mt-3">
              <input
                className="w-full rounded-lg border-gray-300"
                placeholder="Write your Tweet and Enter"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span>Total Profit</span>
                <span className="font-semibold">1,012</span>
              </li>
              <li className="flex items-center justify-between">
                <span>New Customer</span>
                <span className="font-semibold">961</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Active Projects</span>
                <span className="font-semibold">770</span>
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* world map placeholder */}
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">World</h2>
        <div className="h-48 rounded-lg bg-gradient-to-r from-sky-100 to-emerald-100 border"></div>
      </section>

      {/* recent activity */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Aktivitas Terbaru</h2>
        <div className="bg-white rounded-xl shadow">
          <ul className="divide-y">
            {activities.map((a) => (
              <li key={a.id} className="p-4 flex items-center justify-between">
                <span className="text-gray-700 text-sm">{a.text}</span>
                <span className="text-xs text-gray-500">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
