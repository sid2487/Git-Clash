export default function RankPage() {
  const data = [
    {
      rank: 1,
      name: "Eminem",
      score: 982,
      github: "https://github.com/eminem",
    },
    { rank: 2, name: "Ashh", score: 941, github: "https://github.com/ashh" },
    {
      rank: 3,
      name: "Siddharth",
      score: 910,
      github: "https://github.com/sid",
    },
    { rank: 4, name: "Amit", score: 875, github: "https://github.com/amit" },
    { rank: 5, name: "Rahul", score: 860, github: "https://github.com/rahul" },
    { rank: 6, name: "Karan", score: 842, github: "https://github.com/karan" },
    {
      rank: 7,
      name: "Tanishq",
      score: 830,
      github: "https://github.com/tanishq",
    },
    { rank: 8, name: "Jay", score: 812, github: "https://github.com/jay" },
    {
      rank: 9,
      name: "Nikhil",
      score: 799,
      github: "https://github.com/nikhil",
    },
    { rank: 10, name: "Dev", score: 780, github: "https://github.com/dev" },
  ];

  return (
    <div className="text-white pt-24 px-4 min-h-screen flex justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-emerald-400 tracking-wide">
          Weekly Top 10 Rankings
        </h1>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-md">
          {data.map((user, index) => (
            <div
              key={user.rank}
              className="
                flex items-center justify-between
                py-3 px-4 border-b border-white/10 last:border-none
                hover:bg-white/5 rounded-lg transition-all duration-200
              "
            >
              <div className="flex items-center gap-4 min-w-[150px]">
                <span
                  className={`text-lg font-semibold w-8 ${
                    index < 3 ? "text-emerald-400" : "text-white/70"
                  }`}
                >
                  #{user.rank}
                </span>

                <span className="text-white/90 text-lg">{user.name}</span>
              </div>

              <div className="text-white/80 font-semibold text-base w-20 text-center">
                {user.score}
              </div>

              <a
                href={user.github}
                target="_blank"
                className="
                  text-emerald-400 text-sm font-medium
                  hover:text-emerald-300 transition underline-offset-4
                "
              >
                GitHub →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
